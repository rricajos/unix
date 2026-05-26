# 109.1 Fundamentos de protocolos de Internet - Ejercicios

## Ejercicio 1
¿Cuantos hosts disponibles tiene una red con mascara /26? Muestra el calculo.

<details><summary>Respuesta</summary>

```
Hosts = 2^(32 - 26) - 2 = 2^6 - 2 = 64 - 2 = 62 hosts
```

Se restan 2 porque la primera direccion es la **direccion de red** y la ultima es la **direccion de broadcast**, que no se pueden asignar a hosts.

</details>

## Ejercicio 2
¿Cuales son los tres rangos de direcciones IPv4 privadas (RFC 1918)?

<details><summary>Respuesta</summary>

| Clase | Rango | CIDR |
|-------|-------|------|
| A | 10.0.0.0 - 10.255.255.255 | 10.0.0.0/8 |
| B | 172.16.0.0 - 172.31.255.255 | 172.16.0.0/12 |
| C | 192.168.0.0 - 192.168.255.255 | 192.168.0.0/16 |

Estas direcciones no son enrutables en Internet y se usan en redes internas.

</details>

## Ejercicio 3
¿Cual es la diferencia principal entre TCP y UDP? Indica dos servicios que usen cada uno.

<details><summary>Respuesta</summary>

**TCP (Transmission Control Protocol)**:
- Orientado a conexion (handshake de 3 vias)
- Fiable: garantiza entrega ordenada
- Servicios: **HTTP** (80), **SSH** (22), SMTP, FTP

**UDP (User Datagram Protocol)**:
- Sin conexion (no hay handshake)
- No fiable: no garantiza entrega ni orden
- Servicios: **DNS** (53), **NTP** (123), DHCP, SNMP

</details>

## Ejercicio 4
Simplifica la siguiente direccion IPv6: `2001:0db8:0000:0000:0000:ff00:0042:8329`

<details><summary>Respuesta</summary>

Paso 1 - Eliminar ceros a la izquierda:
```
2001:db8:0:0:0:ff00:42:8329
```

Paso 2 - Reemplazar grupos consecutivos de ceros por `::`:
```
2001:db8::ff00:42:8329
```

Regla: `::` solo puede usarse **una vez** en una direccion IPv6.

</details>

## Ejercicio 5
¿Que tipo de direccion IPv6 es `fe80::1`? ¿Y `::1`? ¿Y `2001:db8::1`?

<details><summary>Respuesta</summary>

- **`fe80::1`**: Direccion **link-local** (prefijo `fe80::/10`). Es autoconfigurada y solo valida en el enlace local (no enrutable).
- **`::1`**: Direccion de **loopback** (equivalente a 127.0.0.1 en IPv4). Apunta al propio equipo.
- **`2001:db8::1`**: Direccion de **documentacion** (prefijo `2001:db8::/32`, reservado para ejemplos). En general, `2000::/3` es el rango de direcciones **global unicast** (publicas enrutables).

</details>

## Ejercicio 6
Indica el numero de puerto para los siguientes servicios: SSH, SMTP, DNS, HTTP, HTTPS, POP3, IMAP, NTP.

<details><summary>Respuesta</summary>

| Servicio | Puerto | Protocolo |
|----------|--------|-----------|
| SSH | **22** | TCP |
| SMTP | **25** | TCP |
| DNS | **53** | TCP/UDP |
| HTTP | **80** | TCP |
| NTP | **123** | UDP |
| IMAP | **143** | TCP |
| HTTPS | **443** | TCP |
| POP3 | **110** | TCP |

Versiones seguras: IMAPS=993, POP3S=995, SMTPS=465

</details>

## Ejercicio 7
¿Cuales son las 4 capas del modelo TCP/IP? ¿A que capas del modelo OSI corresponde cada una?

<details><summary>Respuesta</summary>

| Capa TCP/IP | Equivalencia OSI | Ejemplo |
|-------------|-------------------|---------|
| 4. Aplicacion | Capas 5, 6, 7 | HTTP, SSH, DNS |
| 3. Transporte | Capa 4 | TCP, UDP |
| 2. Internet | Capa 3 | IP, ICMP |
| 1. Acceso a red | Capas 1, 2 | Ethernet, Wi-Fi |

El modelo TCP/IP simplifica las 7 capas de OSI en 4 capas practicas.

</details>

## Ejercicio 8
Divide la red 192.168.10.0/24 en 4 subredes iguales. Indica la direccion de red, rango de hosts y broadcast de cada una.

<details><summary>Respuesta</summary>

Para 4 subredes necesitamos 2 bits adicionales (2^2 = 4). Nueva mascara: /26 (24+2).

Cada subred tiene 2^6 - 2 = **62 hosts**.

| Subred | Dir. de red | Rango de hosts | Broadcast |
|--------|------------|----------------|-----------|
| 1 | 192.168.10.0/26 | 192.168.10.1 - .62 | 192.168.10.63 |
| 2 | 192.168.10.64/26 | 192.168.10.65 - .126 | 192.168.10.127 |
| 3 | 192.168.10.128/26 | 192.168.10.129 - .190 | 192.168.10.191 |
| 4 | 192.168.10.192/26 | 192.168.10.193 - .254 | 192.168.10.255 |

</details>
