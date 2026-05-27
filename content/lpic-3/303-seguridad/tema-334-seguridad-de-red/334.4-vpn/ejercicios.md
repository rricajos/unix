---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "334 - Seguridad de Red"
tema: "334.4 - VPN"
subtema: "334.4"
peso: 4
tags:
  - lpic-3
  - tema-334
  - ipsec
  - openvpn
  - wireguard
  - vpn
---

# Ejercicios - 334.4 VPN

### Pregunta 1
¿Cual es la diferencia principal entre el modo tunnel y transport de IPsec?

a) Tunnel usa cifrado, transport no
b) Tunnel encapsula el paquete IP completo; transport solo cifra el payload
c) Transport es mas seguro que tunnel
d) Tunnel solo funciona con IKEv2

<details><summary>Respuesta</summary>

**b)** Tunnel encapsula el paquete IP completo; transport solo cifra el payload

En modo tunnel, se añade una nueva cabecera IP y se encapsula el paquete original completo, ideal para VPN site-to-site. En modo transport, se cifra solo el payload del paquete, usado en comunicaciones host-to-host.
</details>

### Pregunta 2
¿Que comando genera un par de claves WireGuard (privada y publica)?

a) `wireguard --generate-keys`
b) `wg genkey | tee privatekey | wg pubkey > publickey`
c) `wg-quick genkeys`
d) `openssl genrsa -out wg.key 2048 && openssl rsa -pubout -in wg.key -out wg.pub`

<details><summary>Respuesta</summary>

**b)** `wg genkey | tee privatekey | wg pubkey > publickey`

`wg genkey` genera la clave privada, `tee` la guarda y la pasa por pipe a `wg pubkey` que deriva la clave publica correspondiente.
</details>

### Pregunta 3
En la configuracion de strongSwan (ipsec.conf), ¿que parametro especifica la autenticacion mediante certificados?

a) `authby=cert`
b) `authby=rsasig`
c) `auth=certificate`
d) `authentication=x509`

<details><summary>Respuesta</summary>

**b)** `authby=rsasig`

El parametro `authby=rsasig` indica autenticacion mediante firma RSA (certificados X.509). `authby=secret` usa claves precompartidas (PSK). `authby=pubkey` es una alternativa mas moderna.
</details>

### Pregunta 4
¿Que protocolo de transporte usa WireGuard?

a) TCP en puerto 51820
b) UDP en puerto 51820
c) TCP o UDP, configurable
d) SCTP en puerto 51820

<details><summary>Respuesta</summary>

**b)** UDP en puerto 51820

WireGuard usa exclusivamente UDP. El puerto por defecto es 51820, pero puede configurarse con `ListenPort` en wg0.conf.
</details>

### Pregunta 5
En OpenVPN, ¿cual es la diferencia entre las interfaces `tun` y `tap`?

a) `tun` cifra el trafico, `tap` no
b) `tun` opera en capa 3 (IP), `tap` opera en capa 2 (Ethernet)
c) `tap` es mas rapido que `tun`
d) `tun` solo soporta IPv4, `tap` soporta IPv4 e IPv6

<details><summary>Respuesta</summary>

**b)** `tun` opera en capa 3 (IP), `tap` opera en capa 2 (Ethernet)

`tun` crea un tunel punto a punto a nivel IP (capa 3), mas eficiente. `tap` emula una interfaz Ethernet (capa 2), soporta broadcast y bridging, necesario para protocolos que dependen de la capa de enlace.
</details>

### Pregunta 6
¿Que ventaja ofrece `tls-crypt` sobre `tls-auth` en OpenVPN?

a) `tls-crypt` usa certificados, `tls-auth` usa PSK
b) `tls-crypt` cifra ademas el canal de control, `tls-auth` solo lo autentica
c) `tls-crypt` es mas rapido
d) `tls-auth` esta obsoleto y no funciona en versiones recientes

<details><summary>Respuesta</summary>

**b)** `tls-crypt` cifra ademas el canal de control, `tls-auth` solo lo autentica

Ambos proporcionan autenticacion HMAC y proteccion contra DoS. La diferencia es que `tls-crypt` tambien cifra el canal de control, ocultando metadatos del protocolo OpenVPN y dificultando la identificacion del trafico VPN.
</details>

### Pregunta 7
¿Que parametro de WireGuard en la seccion [Peer] define tanto las IPs que se enrutan por el tunel como las IPs aceptadas del peer?

a) `Routes`
b) `AllowedIPs`
c) `RoutedSubnets`
d) `PeerNetworks`

<details><summary>Respuesta</summary>

**b)** `AllowedIPs`

`AllowedIPs` tiene doble funcion: actua como tabla de enrutamiento (define que trafico se envia al peer) y como ACL (solo acepta paquetes del peer con esas IPs de origen). `0.0.0.0/0` enruta todo el trafico por la VPN.
</details>

### Pregunta 8
¿Que comando de strongSwan muestra el estado detallado de todas las conexiones IPsec?

a) `ipsec status --verbose`
b) `ipsec statusall`
c) `ipsec show connections`
d) `strongswan --list-tunnels`

<details><summary>Respuesta</summary>

**b)** `ipsec statusall`

`ipsec statusall` muestra informacion detallada de todas las conexiones incluyendo Security Associations (SA), algoritmos de cifrado, trafico transferido y estado de los tuneles.
</details>

### Pregunta 9
¿Cual de estas tecnologias VPN esta integrada directamente en el kernel Linux (desde la version 5.6)?

a) OpenVPN
b) strongSwan
c) WireGuard
d) Libreswan

<details><summary>Respuesta</summary>

**c)** WireGuard

WireGuard fue integrado en el kernel Linux a partir de la version 5.6, lo que le proporciona un rendimiento superior al operar directamente en el espacio del kernel. OpenVPN opera en espacio de usuario.
</details>

### Pregunta 10
En una configuracion IPsec con strongSwan, ¿donde se almacenan las claves precompartidas (PSK)?

a) `/etc/strongswan/ipsec.conf`
b) `/etc/strongswan/ipsec.secrets`
c) `/etc/strongswan/psk.conf`
d) `/etc/strongswan/strongswan.conf`

<details><summary>Respuesta</summary>

**b)** `/etc/strongswan/ipsec.secrets`

El archivo `ipsec.secrets` almacena las credenciales de autenticacion: claves precompartidas (PSK), referencias a claves privadas RSA y certificados. El formato para PSK es: `IP_local IP_remota : PSK "clave"`.
</details>
