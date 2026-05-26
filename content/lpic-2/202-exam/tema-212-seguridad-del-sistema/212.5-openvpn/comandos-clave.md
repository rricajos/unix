---
title: "212.5 - OpenVPN: Comandos clave"
tags: [lpic-2, examen-202, tema-212, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.5"
---

# 212.5 - OpenVPN: Comandos clave

## PKI con easy-rsa

| Comando | Descripción |
|---------|-------------|
| `make-cadir /etc/openvpn/easy-rsa` | Crear directorio de trabajo easy-rsa |
| `./easyrsa init-pki` | Inicializar la infraestructura PKI |
| `./easyrsa build-ca` | Crear la autoridad certificadora (CA) |
| `./easyrsa gen-req server nopass` | Generar solicitud de certificado del servidor |
| `./easyrsa sign-req server server` | Firmar certificado como tipo servidor |
| `./easyrsa gen-req cliente1 nopass` | Generar solicitud de certificado del cliente |
| `./easyrsa sign-req client cliente1` | Firmar certificado como tipo cliente |
| `./easyrsa gen-dh` | Generar parámetros Diffie-Hellman |
| `./easyrsa revoke cliente1` | Revocar certificado de un cliente |
| `./easyrsa gen-crl` | Generar lista de revocación de certificados |

## Gestión de OpenVPN

| Comando | Descripción |
|---------|-------------|
| `openvpn --genkey secret /etc/openvpn/ta.key` | Generar clave TLS-Auth |
| `openvpn --config /etc/openvpn/server/server.conf` | Iniciar manualmente con archivo de configuración |
| `systemctl enable openvpn-server@server` | Habilitar inicio automático del servidor |
| `systemctl start openvpn-server@server` | Iniciar el servidor VPN |
| `systemctl status openvpn-server@server` | Verificar estado del servidor |
| `systemctl enable openvpn-client@client` | Habilitar inicio automático del cliente |
| `systemctl start openvpn-client@client` | Iniciar el cliente VPN |

## Verificación y diagnóstico

| Comando | Descripción |
|---------|-------------|
| `ip addr show tun0` | Ver la interfaz del túnel VPN |
| `ip route \| grep tun` | Ver rutas a través del túnel |
| `cat /var/log/openvpn/openvpn-status.log` | Ver conexiones activas |
| `tail -f /var/log/openvpn/openvpn.log` | Seguir el log en tiempo real |
| `ping 10.8.0.1` | Probar conectividad con el servidor VPN |

## Directivas principales del servidor (server.conf)

| Directiva | Descripción |
|-----------|-------------|
| `port 1194` | Puerto de escucha |
| `proto udp` | Protocolo (udp o tcp) |
| `dev tun` | Interfaz virtual (tun o tap) |
| `ca ca.crt` | Certificado de la CA |
| `cert server.crt` | Certificado del servidor |
| `key server.key` | Clave privada del servidor |
| `dh dh.pem` | Parámetros Diffie-Hellman |
| `server 10.8.0.0 255.255.255.0` | Subred VPN |
| `push "route 192.168.1.0 255.255.255.0"` | Enviar ruta a los clientes |
| `client-to-client` | Permitir tráfico entre clientes |
| `keepalive 10 120` | Intervalo de ping y timeout |
| `tls-auth ta.key 0` | Autenticación HMAC (servidor: 0) |
| `tls-crypt ta.key` | Cifrado del canal de control |
| `cipher AES-256-GCM` | Algoritmo de cifrado |
| `persist-key` | Mantener claves en reinicios |
| `persist-tun` | Mantener túnel en reinicios |
| `crl-verify crl.pem` | Verificar lista de revocación |

## Directivas principales del cliente (client.ovpn)

| Directiva | Descripción |
|-----------|-------------|
| `client` | Modo cliente |
| `remote vpn.ejemplo.com 1194` | Dirección y puerto del servidor |
| `resolv-retry infinite` | Reintentar resolución DNS |
| `nobind` | No vincularse a puerto local |
| `tls-auth ta.key 1` | Autenticación HMAC (cliente: 1) |
| `remote-cert-tls server` | Verificar tipo de certificado del servidor |

## Archivos y rutas relevantes

| Archivo | Descripción |
|---------|-------------|
| `/etc/openvpn/server/server.conf` | Configuración del servidor |
| `/etc/openvpn/client/client.ovpn` | Configuración del cliente |
| `/etc/openvpn/ta.key` | Clave TLS-Auth/TLS-Crypt |
| `/etc/openvpn/easy-rsa/pki/ca.crt` | Certificado de la CA |
| `/etc/openvpn/easy-rsa/pki/issued/` | Certificados firmados |
| `/etc/openvpn/easy-rsa/pki/private/` | Claves privadas |
| `/etc/openvpn/easy-rsa/pki/dh.pem` | Parámetros Diffie-Hellman |
| `/etc/openvpn/easy-rsa/pki/crl.pem` | Lista de revocación |
| `/var/log/openvpn/openvpn-status.log` | Estado de conexiones activas |
| `/var/log/openvpn/openvpn.log` | Log del servidor |
