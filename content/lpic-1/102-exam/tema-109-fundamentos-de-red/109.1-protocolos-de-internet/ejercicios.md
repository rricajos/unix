---
title: "109.1 Fundamentos de protocolos de Internet - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-109
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "109"
subtema: "109.1"
---

# 109.1 Fundamentos de protocolos de Internet - Ejercicios

### Pregunta 1

Cuantos hosts disponibles tiene una red con mascara /26?

a) 30
b) 62
c) 64
d) 126

<details><summary>Respuesta</summary>

**b) 62**

La formula para calcular hosts disponibles es: 2^(32 - prefijo) - 2. Para /26: 2^(32-26) - 2 = 2^6 - 2 = 64 - 2 = 62 hosts. Se restan 2 porque la primera direccion es la direccion de red y la ultima es la direccion de broadcast, que no se pueden asignar a hosts.

</details>

---

### Pregunta 2

Cual de los siguientes es un rango de direcciones IPv4 privadas definido en RFC 1918?

a) 192.0.0.0/8
b) 172.16.0.0/12
c) 10.0.0.0/16
d) 169.254.0.0/16

<details><summary>Respuesta</summary>

**b) 172.16.0.0/12**

Los tres rangos de direcciones IPv4 privadas segun RFC 1918 son: 10.0.0.0/8 (Clase A), 172.16.0.0/12 (Clase B) y 192.168.0.0/16 (Clase C). La opcion A (192.0.0.0/8) no es un rango privado. La opcion C (10.0.0.0/16) tiene la mascara incorrecta (deberia ser /8). La opcion D (169.254.0.0/16) es el rango link-local (APIPA), no un rango privado RFC 1918.

</details>

---

### Pregunta 3

Cual de las siguientes afirmaciones sobre TCP y UDP es correcta?

a) UDP es orientado a conexion y TCP no tiene conexion
b) TCP usa un handshake de 2 vias para establecer conexion
c) TCP es orientado a conexion con handshake de 3 vias y garantiza entrega ordenada
d) UDP garantiza la entrega de paquetes pero no el orden

<details><summary>Respuesta</summary>

**c) TCP es orientado a conexion con handshake de 3 vias y garantiza entrega ordenada**

TCP (Transmission Control Protocol) es orientado a conexion, establece la conexion mediante un handshake de 3 vias (SYN, SYN-ACK, ACK) y garantiza la entrega ordenada con retransmision de paquetes perdidos. UDP (User Datagram Protocol) es sin conexion, sin handshake, y no garantiza ni la entrega ni el orden. TCP se usa para HTTP, SSH, SMTP; UDP se usa para DNS, NTP, DHCP.

</details>

---

### Pregunta 4

Cual es la forma simplificada correcta de la direccion IPv6 `2001:0db8:0000:0000:0000:ff00:0042:8329`?

a) `2001:db8:0:0:0:ff00:42:8329`
b) `2001:db8::ff00:42:8329`
c) `2001:db8:::ff00:42:8329`
d) `2001:db8:ff00:42:8329`

<details><summary>Respuesta</summary>

**b) `2001:db8::ff00:42:8329`**

La simplificacion de IPv6 se hace en dos pasos: primero se eliminan los ceros a la izquierda de cada grupo (`0db8` -> `db8`, `0042` -> `42`), y luego se reemplazan los grupos consecutivos de ceros por `::`. La regla importante es que `::` solo puede usarse una vez en una direccion. La opcion A es parcialmente correcta (primer paso) pero no aplica el segundo. La opcion C usa `:::` que es invalido. La opcion D omite grupos necesarios.

</details>

---

### Pregunta 5

Que tipo de direccion IPv6 es `fe80::1`?

a) Global unicast
b) Unique local
c) Link-local
d) Loopback

<details><summary>Respuesta</summary>

**c) Link-local**

Las direcciones con prefijo `fe80::/10` son direcciones link-local en IPv6. Se autoconfiguran en cada interfaz y solo son validas en el enlace local (no son enrutables). La direccion `::1` es loopback (equivalente a 127.0.0.1 en IPv4). Las direcciones `2000::/3` son global unicast (publicas enrutables). Las direcciones `fc00::/7` (tipicamente `fd00::/8`) son unique local (privadas, equivalentes a RFC 1918 en IPv4).

</details>

---

### Pregunta 6

Cual es el numero de puerto asignado al servicio HTTPS?

a) 80
b) 8080
c) 443
d) 8443

<details><summary>Respuesta</summary>

**c) 443**

HTTPS (HTTP sobre TLS/SSL) utiliza el puerto 443/TCP. El puerto 80 corresponde a HTTP sin cifrado. Los puertos 8080 y 8443 son puertos alternativos comunes pero no son los puertos estandar asignados. Otros puertos importantes: SSH=22, SMTP=25, DNS=53, POP3=110, IMAP=143, LDAP=389, LDAPS=636, IMAPS=993, POP3S=995.

</details>

---

### Pregunta 7

Cuales son las 4 capas del modelo TCP/IP en orden de abajo hacia arriba?

a) Fisica, Enlace, Red, Transporte
b) Acceso a red, Internet, Transporte, Aplicacion
c) Red, Transporte, Sesion, Aplicacion
d) Enlace, Internet, Transporte, Presentacion

<details><summary>Respuesta</summary>

**b) Acceso a red, Internet, Transporte, Aplicacion**

El modelo TCP/IP tiene 4 capas: 1) Acceso a red (equivale a las capas 1 y 2 de OSI: Ethernet, Wi-Fi), 2) Internet (equivale a capa 3 de OSI: IP, ICMP), 3) Transporte (equivale a capa 4 de OSI: TCP, UDP), 4) Aplicacion (equivale a capas 5, 6 y 7 de OSI: HTTP, SSH, DNS). El modelo TCP/IP simplifica las 7 capas del modelo OSI en 4 capas practicas.

</details>

---

### Pregunta 8

Al dividir la red 192.168.10.0/24 en 4 subredes iguales, cual es la nueva mascara de subred y cuantos hosts tiene cada subred?

a) /25 con 126 hosts por subred
b) /26 con 62 hosts por subred
c) /27 con 30 hosts por subred
d) /28 con 14 hosts por subred

<details><summary>Respuesta</summary>

**b) /26 con 62 hosts por subred**

Para dividir una red en 4 subredes se necesitan 2 bits adicionales (2^2 = 4). La nueva mascara es /26 (24 + 2 = 26). Cada subred tiene 2^(32-26) - 2 = 2^6 - 2 = 62 hosts. Las 4 subredes resultantes son: 192.168.10.0/26, 192.168.10.64/26, 192.168.10.128/26 y 192.168.10.192/26.

</details>

---

### Pregunta 9

Que protocolo reemplaza a ARP en IPv6 para la resolucion de direcciones?

a) RARP
b) ICMPv6 (NDP)
c) DHCPv6
d) SLAAC

<details><summary>Respuesta</summary>

**b) ICMPv6 (NDP)**

NDP (Neighbor Discovery Protocol) es el protocolo de descubrimiento de vecinos de IPv6 que reemplaza a ARP de IPv4. NDP usa mensajes ICMPv6 para la resolucion de direcciones (IPv6 a MAC), descubrimiento de routers, deteccion de direcciones duplicadas (DAD) y redireccion. Usa mensajes Neighbor Solicitation y Neighbor Advertisement en lugar de ARP Request y ARP Reply. SLAAC es el mecanismo de autoconfiguracion de direcciones, no de resolucion.

</details>

---

### Pregunta 10

En IPv6, que mecanismo permite a un host autoconfigurarse una direccion sin necesidad de un servidor DHCP?

a) NDP
b) RARP
c) SLAAC
d) APIPA

<details><summary>Respuesta</summary>

**c) SLAAC**

SLAAC (Stateless Address Autoconfiguration) es el mecanismo de autoconfiguracion de direcciones IPv6 sin estado. El host genera su propia direccion combinando el prefijo de red anunciado por el router (via Router Advertisement) con un identificador de interfaz generado a partir de la MAC (EUI-64) o de forma aleatoria. No necesita servidor DHCP. NDP es el protocolo de descubrimiento de vecinos (resolucion de direcciones). APIPA es la autoconfiguracion link-local de IPv4 (169.254.x.x).

</details>
