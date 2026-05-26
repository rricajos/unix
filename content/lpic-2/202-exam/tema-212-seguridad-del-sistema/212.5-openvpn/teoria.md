---
title: "212.5 - OpenVPN"
tags: [lpic-2, examen-202, tema-212, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.5"
---

# 212.5 - OpenVPN

## Introducción a OpenVPN

OpenVPN es una solución VPN de código abierto que utiliza TLS/SSL para crear túneles cifrados seguros. Opera en espacio de usuario y puede funcionar sobre TCP o UDP, lo que lo hace flexible y capaz de atravesar firewalls y NAT.

## Arquitectura de OpenVPN

### Modelo cliente-servidor

OpenVPN funciona con un modelo cliente-servidor donde:

- **Servidor**: escucha conexiones entrantes y gestiona la red VPN
- **Clientes**: se conectan al servidor para acceder a la red VPN
- **PKI (Public Key Infrastructure)**: certificados X.509 para autenticar ambas partes

### Interfaces virtuales: tun vs tap

| Interfaz | Capa OSI | Modo | Uso típico |
|----------|----------|------|-----------|
| **tun** | Capa 3 (red) | Routing | VPN punto a punto, acceso remoto |
| **tap** | Capa 2 (enlace) | Bridging | Emula una red local completa (broadcast, ARP) |

- **tun**: crea un túnel IP (routing). Más eficiente, adecuado para la mayoría de escenarios
- **tap**: crea un puente Ethernet (bridging). Necesario cuando se requiere tráfico de capa 2 (NetBIOS, DHCP broadcast)

> **Para el examen:** `tun` es el modo más común y recomendado. Se usa routing para conectar subredes. `tap` se usa solo cuando se necesita bridging real (misma subred, broadcast de capa 2).

## Routing vs Bridging

### Routing (tun)

```
Red local A          Servidor OpenVPN          Red local B
10.0.1.0/24  ←----→  10.8.0.0/24  ←----→  10.0.2.0/24
                     (red VPN)
```

- Las redes cliente y servidor tienen subredes diferentes
- El servidor OpenVPN enruta paquetes entre subredes
- Requiere `push "route ..."` para informar a los clientes de las redes accesibles
- Más eficiente y escalable

### Bridging (tap)

```
Red local           Servidor OpenVPN + Bridge           Clientes VPN
192.168.1.0/24  ←----→  br0 (bridge)  ←----→  192.168.1.x
                     (misma subred)
```

- Clientes y red local comparten la misma subred
- Requiere configurar un puente de red (bridge)
- Permite broadcast, ideal para aplicaciones que lo necesitan
- Mayor overhead de red

## PKI con easy-rsa

La infraestructura de clave pública (PKI) es fundamental para OpenVPN. **easy-rsa** es la herramienta oficial para gestionarla.

### Inicialización de la PKI

```bash
# Crear directorio de trabajo
make-cadir /etc/openvpn/easy-rsa
cd /etc/openvpn/easy-rsa

# Inicializar PKI
./easyrsa init-pki

# Editar variables (opcional)
# nano vars
# set_var EASYRSA_REQ_COUNTRY    "ES"
# set_var EASYRSA_REQ_PROVINCE   "Madrid"
# set_var EASYRSA_KEY_SIZE        2048
# set_var EASYRSA_CA_EXPIRE       3650
# set_var EASYRSA_CERT_EXPIRE     1080
```

### Crear la autoridad certificadora (CA)

```bash
./easyrsa build-ca
# Solicita passphrase y nombre de la CA
# Genera: pki/ca.crt (certificado público) y pki/private/ca.key (clave privada)
```

### Generar certificado del servidor

```bash
# Generar solicitud de certificado del servidor
./easyrsa gen-req server nopass

# Firmar la solicitud como servidor
./easyrsa sign-req server server

# Genera: pki/issued/server.crt y pki/private/server.key
```

### Generar certificados de clientes

```bash
# Generar solicitud del cliente
./easyrsa gen-req cliente1 nopass

# Firmar la solicitud como cliente
./easyrsa sign-req client cliente1

# Genera: pki/issued/cliente1.crt y pki/private/cliente1.key
```

### Generar parámetros Diffie-Hellman

```bash
./easyrsa gen-dh
# Genera: pki/dh.pem (puede tardar varios minutos)
```

### Revocar un certificado

```bash
./easyrsa revoke cliente1
./easyrsa gen-crl
# Genera: pki/crl.pem
```

> **Para el examen:** La secuencia completa de PKI es: `init-pki` -> `build-ca` -> `gen-req` -> `sign-req` -> `gen-dh`. Los tipos de firma son `server` para el servidor y `client` para los clientes. La opción `nopass` omite la passphrase de la clave privada.

## Configuración del servidor

### Archivo server.conf

```bash
# /etc/openvpn/server/server.conf

# Puerto y protocolo
port 1194
proto udp

# Interfaz virtual (tun para routing, tap para bridging)
dev tun

# Certificados y claves
ca /etc/openvpn/easy-rsa/pki/ca.crt
cert /etc/openvpn/easy-rsa/pki/issued/server.crt
key /etc/openvpn/easy-rsa/pki/private/server.key
dh /etc/openvpn/easy-rsa/pki/dh.pem

# Red VPN (subred que se asigna a los clientes)
server 10.8.0.0 255.255.255.0

# Registrar asignaciones de IPs
ifconfig-pool-persist /var/log/openvpn/ipp.txt

# Rutas que se empujan a los clientes
push "route 192.168.1.0 255.255.255.0"
push "route 10.0.0.0 255.255.0.0"

# Redirigir todo el tráfico del cliente a través de la VPN
# push "redirect-gateway def1 bypass-dhcp"

# Servidores DNS que se empujan a los clientes
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 8.8.4.4"

# Permitir comunicación entre clientes
client-to-client

# Mantener conexión activa (ping cada 10s, timeout 120s)
keepalive 10 120

# Autenticación TLS adicional
tls-auth /etc/openvpn/ta.key 0
# o con cifrado (más seguro):
# tls-crypt /etc/openvpn/ta.key

# Cifrado de datos
cipher AES-256-GCM

# Compresión (opcional, deprecated en versiones recientes)
# compress lz4-v2
# push "compress lz4-v2"

# Reducir privilegios después de iniciar
user nobody
group nogroup

# Mantener claves y túnel en reinicios
persist-key
persist-tun

# Archivo de estado y logs
status /var/log/openvpn/openvpn-status.log
log-append /var/log/openvpn/openvpn.log
verb 3

# Lista de revocación de certificados
# crl-verify /etc/openvpn/easy-rsa/pki/crl.pem
```

### Generar la clave TLS-Auth

```bash
openvpn --genkey secret /etc/openvpn/ta.key
```

> **Para el examen:** `tls-auth` añade una firma HMAC a los paquetes del handshake TLS, protegiendo contra ataques DoS y de escaneo de puertos. `tls-crypt` va más allá cifrando también los paquetes de control. El servidor usa `tls-auth ta.key 0` y los clientes `tls-auth ta.key 1`.

## Configuración del cliente

### Archivo client.ovpn

```bash
# /etc/openvpn/client/client.ovpn

# Modo cliente
client

# Interfaz (debe coincidir con el servidor)
dev tun

# Protocolo (debe coincidir con el servidor)
proto udp

# Dirección y puerto del servidor
remote vpn.ejemplo.com 1194

# Reintentar conexión indefinidamente
resolv-retry infinite

# No vincularse a puerto local específico
nobind

# Reducir privilegios
user nobody
group nogroup

# Mantener estado en reconexiones
persist-key
persist-tun

# Certificados del cliente
ca ca.crt
cert cliente1.crt
key cliente1.key

# Autenticación TLS (dirección 1 para cliente)
tls-auth ta.key 1
# o: tls-crypt ta.key

# Cifrado (debe coincidir con el servidor)
cipher AES-256-GCM

# Verificar el certificado del servidor
remote-cert-tls server

# Nivel de verbosidad
verb 3
```

### Archivos embebidos en el perfil del cliente

Se pueden incluir los certificados directamente en el archivo `.ovpn`:

```bash
client
dev tun
proto udp
remote vpn.ejemplo.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-GCM
verb 3

<ca>
-----BEGIN CERTIFICATE-----
... contenido de ca.crt ...
-----END CERTIFICATE-----
</ca>

<cert>
-----BEGIN CERTIFICATE-----
... contenido de cliente1.crt ...
-----END CERTIFICATE-----
</cert>

<key>
-----BEGIN PRIVATE KEY-----
... contenido de cliente1.key ...
-----END PRIVATE KEY-----
</key>

<tls-auth>
-----BEGIN OpenVPN Static key V1-----
... contenido de ta.key ...
-----END OpenVPN Static key V1-----
</tls-auth>
key-direction 1
```

## Gestión del servicio

```bash
# Habilitar e iniciar el servidor OpenVPN
systemctl enable openvpn-server@server
systemctl start openvpn-server@server

# Verificar estado
systemctl status openvpn-server@server

# El nombre después de @ corresponde al archivo de configuración
# server = /etc/openvpn/server/server.conf

# Para el cliente
systemctl enable openvpn-client@client
systemctl start openvpn-client@client
```

> **Para el examen:** El nombre de la instancia después de `@` en `openvpn-server@server` se corresponde con el nombre del archivo de configuración (sin extensión .conf) dentro de `/etc/openvpn/server/`.

## Requisitos de red del servidor

Para que OpenVPN funcione como gateway, se necesita:

1. **IP forwarding habilitado**:
```bash
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
sysctl -p
```

2. **NAT/Masquerading** para la red VPN:
```bash
iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
```

3. **Firewall**: permitir el puerto UDP 1194 (o el configurado):
```bash
iptables -A INPUT -p udp --dport 1194 -j ACCEPT
# o con firewalld:
firewall-cmd --permanent --add-service=openvpn
firewall-cmd --reload
```

## Verificación y diagnóstico

```bash
# Ver log del servidor
tail -f /var/log/openvpn/openvpn.log

# Ver estado de conexiones activas
cat /var/log/openvpn/openvpn-status.log

# Verificar interfaz tun
ip addr show tun0

# Probar conectividad con la red VPN
ping 10.8.0.1

# Verificar rutas
ip route | grep tun
```

## Directivas clave para recordar

| Directiva | Descripción |
|-----------|-------------|
| `server 10.8.0.0 255.255.255.0` | Define la subred VPN |
| `push "route ..."` | Envía rutas a los clientes |
| `client-to-client` | Permite tráfico entre clientes |
| `tls-auth` / `tls-crypt` | Capa adicional de seguridad TLS |
| `keepalive 10 120` | Ping cada 10s, timeout 120s |
| `persist-key` / `persist-tun` | Mantener estado en reinicios |
| `remote-cert-tls server` | Cliente verifica que el cert es de tipo servidor |
| `crl-verify` | Verificar lista de revocación |
