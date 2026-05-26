---
title: "212.5 - OpenVPN: Ejercicios"
tags: [lpic-2, examen-202, tema-212, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.5"
---

# 212.5 - OpenVPN: Ejercicios

### Pregunta 1

¿Cuál es la diferencia principal entre las interfaces `tun` y `tap` en OpenVPN?

a) `tun` usa TCP y `tap` usa UDP
b) `tun` opera en capa 3 (routing) y `tap` en capa 2 (bridging)
c) `tun` es más lento pero más seguro que `tap`
d) `tun` solo soporta IPv4 y `tap` soporta IPv4 e IPv6

<details>
<summary>Respuesta</summary>

**b) `tun` opera en capa 3 (routing) y `tap` en capa 2 (bridging)**

La interfaz `tun` crea un túnel de capa 3 (IP) adecuado para routing entre subredes diferentes. La interfaz `tap` emula un dispositivo Ethernet de capa 2, permitiendo bridging y tráfico broadcast. `tun` es más eficiente y el modo recomendado para la mayoría de escenarios.
</details>

---

### Pregunta 2

¿Qué secuencia de comandos easy-rsa crea correctamente un certificado para un cliente llamado "usuario1"?

a) `./easyrsa gen-req usuario1` seguido de `./easyrsa sign-req server usuario1`
b) `./easyrsa build-client usuario1`
c) `./easyrsa gen-req usuario1 nopass` seguido de `./easyrsa sign-req client usuario1`
d) `./easyrsa create-cert usuario1 --type=client`

<details>
<summary>Respuesta</summary>

**c) `./easyrsa gen-req usuario1 nopass` seguido de `./easyrsa sign-req client usuario1`**

Primero se genera la solicitud de certificado con `gen-req` (la opción `nopass` omite la passphrase), y luego se firma con `sign-req` especificando el tipo `client`. Para certificados de servidor, se usa el tipo `server` en lugar de `client`.
</details>

---

### Pregunta 3

¿Qué directiva en la configuración del servidor OpenVPN permite que los clientes VPN se comuniquen directamente entre sí?

a) `allow-client-communication`
b) `client-to-client`
c) `inter-client yes`
d) `push "allow-peer"`

<details>
<summary>Respuesta</summary>

**b) `client-to-client`**

Por defecto, el tráfico entre clientes no se permite en OpenVPN. La directiva `client-to-client` habilita la comunicación directa entre clientes conectados al mismo servidor sin que el tráfico pase por las reglas del firewall del servidor.
</details>

---

### Pregunta 4

¿Qué comando genera la clave estática utilizada para `tls-auth` en OpenVPN?

a) `openssl genrsa -out ta.key 2048`
b) `openvpn --genkey secret /etc/openvpn/ta.key`
c) `easyrsa gen-tls-key`
d) `ssh-keygen -t hmac -f ta.key`

<details>
<summary>Respuesta</summary>

**b) `openvpn --genkey secret /etc/openvpn/ta.key`**

El comando `openvpn --genkey secret` genera una clave estática que se usa con `tls-auth` o `tls-crypt` para añadir una capa adicional de seguridad HMAC al handshake TLS, protegiendo contra ataques DoS y escaneo de puertos.
</details>

---

### Pregunta 5

En la configuración de `tls-auth`, ¿qué valor de dirección usa el servidor y cuál el cliente?

a) Servidor: 1, Cliente: 0
b) Servidor: 0, Cliente: 1
c) Ambos usan 0
d) No se especifica dirección

<details>
<summary>Respuesta</summary>

**b) Servidor: 0, Cliente: 1**

Con `tls-auth`, el servidor usa la dirección `0` (`tls-auth ta.key 0`) y el cliente usa la dirección `1` (`tls-auth ta.key 1`). Esto asegura que las firmas HMAC se generen y verifiquen correctamente en cada extremo. Con `tls-crypt`, no se especifica dirección.
</details>

---

### Pregunta 6

¿Qué comando systemd habilita e inicia un servidor OpenVPN cuyo archivo de configuración es `/etc/openvpn/server/server.conf`?

a) `systemctl enable --now openvpn@server`
b) `systemctl enable --now openvpn-server@server`
c) `systemctl enable --now openvpn-server`
d) `systemctl enable --now openvpn-server@server.conf`

<details>
<summary>Respuesta</summary>

**b) `systemctl enable --now openvpn-server@server`**

La unidad de systemd `openvpn-server@` es una plantilla (template unit). El nombre después de `@` corresponde al nombre del archivo de configuración sin la extensión `.conf` dentro de `/etc/openvpn/server/`. La opción `--now` combina `enable` y `start` en un solo comando.
</details>

---

### Pregunta 7

¿Qué directiva en la configuración del cliente OpenVPN verifica que el certificado presentado por el servidor es realmente de tipo servidor?

a) `verify-server-cert`
b) `remote-cert-tls server`
c) `tls-verify server`
d) `check-cert-type server`

<details>
<summary>Respuesta</summary>

**b) `remote-cert-tls server`**

La directiva `remote-cert-tls server` verifica que el certificado presentado por el servidor durante el handshake TLS tenga el atributo de uso extendido de clave (EKU) de tipo servidor. Esto previene que un cliente comprometido se haga pasar por servidor.
</details>

---

### Pregunta 8

¿Qué comando de easy-rsa genera los parámetros Diffie-Hellman necesarios para el servidor OpenVPN?

a) `./easyrsa gen-key dh`
b) `./easyrsa build-dh`
c) `./easyrsa gen-dh`
d) `./easyrsa create-dh`

<details>
<summary>Respuesta</summary>

**c) `./easyrsa gen-dh`**

El comando `./easyrsa gen-dh` genera los parámetros Diffie-Hellman necesarios para el intercambio seguro de claves. El archivo resultante (`dh.pem`) se referencia en la configuración del servidor con la directiva `dh`. Este proceso puede tardar varios minutos dependiendo del tamaño de clave.
</details>

---

### Pregunta 9

Un administrador quiere que todo el tráfico de los clientes VPN se enrute a través del servidor OpenVPN. ¿Qué directiva debe añadir al archivo server.conf?

a) `push "default-route"`
b) `push "redirect-gateway def1 bypass-dhcp"`
c) `route-all-traffic yes`
d) `push "route 0.0.0.0 0.0.0.0"`

<details>
<summary>Respuesta</summary>

**b) `push "redirect-gateway def1 bypass-dhcp"`**

La directiva `push "redirect-gateway def1 bypass-dhcp"` informa a los clientes que deben redirigir todo su tráfico de Internet a través del túnel VPN. `def1` modifica la tabla de rutas del cliente sin eliminar la ruta por defecto original, y `bypass-dhcp` excluye el tráfico DHCP local.
</details>

---

### Pregunta 10

¿Qué dos pasos adicionales de configuración del sistema son necesarios en el servidor para que los clientes OpenVPN puedan acceder a Internet a través de la VPN?

a) Instalar un proxy HTTP y configurar DNS
b) Habilitar IP forwarding y configurar NAT/masquerading
c) Crear un puente de red (bridge) y habilitar ARP proxy
d) Configurar DHCP relay y habilitar multicast

<details>
<summary>Respuesta</summary>

**b) Habilitar IP forwarding y configurar NAT/masquerading**

Para que los clientes VPN accedan a Internet a través del servidor, se necesitan dos cosas: 1) Habilitar IP forwarding (`net.ipv4.ip_forward = 1` en `/etc/sysctl.conf`) para que el kernel reenvíe paquetes entre interfaces, y 2) configurar NAT con `iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE` para traducir las direcciones de la red VPN.
</details>
