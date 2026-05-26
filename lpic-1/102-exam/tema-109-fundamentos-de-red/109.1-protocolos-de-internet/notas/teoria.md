# 109.1 Fundamentos de protocolos de Internet - Teoria

## Modelo TCP/IP vs Modelo OSI

### Modelo OSI (7 capas) - Referencia teorica
| Capa | Nombre | Funcion | Ejemplo |
|------|--------|---------|---------|
| 7 | Aplicacion | Interfaz con el usuario | HTTP, FTP, SSH, DNS |
| 6 | Presentacion | Formato de datos, cifrado | SSL/TLS, JPEG |
| 5 | Sesion | Gestiona sesiones | NetBIOS |
| 4 | Transporte | Entrega extremo a extremo | TCP, UDP |
| 3 | Red | Direccionamiento logico, enrutamiento | IP, ICMP |
| 2 | Enlace de datos | Direccionamiento fisico, tramas | Ethernet, Wi-Fi, ARP |
| 1 | Fisica | Bits en el medio fisico | Cables, fibra optica |

### Modelo TCP/IP (4 capas) - Modelo practico
| Capa TCP/IP | Equivalencia OSI | Protocolos |
|-------------|-------------------|------------|
| 4. Aplicacion | 5, 6, 7 | HTTP, FTP, SSH, DNS, SMTP |
| 3. Transporte | 4 | TCP, UDP |
| 2. Internet | 3 | IP (IPv4, IPv6), ICMP |
| 1. Acceso a red | 1, 2 | Ethernet, Wi-Fi, ARP |

---

## IPv4

### Estructura
- Direccion de **32 bits** (4 octetos)
- Representada en **notacion decimal con puntos**: `192.168.1.100`
- Cada octeto: 0-255
- Total de direcciones: 2^32 = ~4.3 mil millones

### Clases de direcciones IPv4
| Clase | Rango primer octeto | Mascara por defecto | Uso |
|-------|---------------------|--------------------|----|
| A | 1-126 | 255.0.0.0 (/8) | Redes grandes |
| B | 128-191 | 255.255.0.0 (/16) | Redes medianas |
| C | 192-223 | 255.255.255.0 (/24) | Redes pequenas |
| D | 224-239 | N/A | Multicast |
| E | 240-255 | N/A | Experimental/Reservado |

> **Nota**: 127.0.0.0/8 es loopback (127.0.0.1 es la mas conocida)

### Direcciones IPv4 privadas (RFC 1918)
| Clase | Rango | CIDR | Cantidad de hosts |
|-------|-------|------|-------------------|
| A | 10.0.0.0 - 10.255.255.255 | 10.0.0.0/8 | ~16.7 millones |
| B | 172.16.0.0 - 172.31.255.255 | 172.16.0.0/12 | ~1 millon |
| C | 192.168.0.0 - 192.168.255.255 | 192.168.0.0/16 | ~65,000 |

### Direcciones especiales
| Direccion | Uso |
|-----------|-----|
| 127.0.0.0/8 | Loopback (localhost) |
| 0.0.0.0 | Esta red / todas las interfaces |
| 255.255.255.255 | Broadcast general |
| 169.254.0.0/16 | Link-local (APIPA, autoasignada) |

---

## Mascaras de subred y CIDR

### Mascara de subred
- Define que parte de la direccion IP es la **red** y cual es el **host**
- Los bits en 1 representan la red, los bits en 0 representan el host

### Notacion CIDR (Classless Inter-Domain Routing)
Se expresa como `/N` donde N es el numero de bits de red.

| CIDR | Mascara | Hosts disponibles | Uso comun |
|------|---------|-------------------|-----------|
| /8 | 255.0.0.0 | 16,777,214 | Clase A |
| /16 | 255.255.0.0 | 65,534 | Clase B |
| /24 | 255.255.255.0 | 254 | Clase C |
| /25 | 255.255.255.128 | 126 | Mitad de clase C |
| /26 | 255.255.255.192 | 62 | Cuarto de clase C |
| /27 | 255.255.255.224 | 30 | |
| /28 | 255.255.255.240 | 14 | |
| /29 | 255.255.255.248 | 6 | |
| /30 | 255.255.255.252 | 2 | Enlaces punto a punto |
| /32 | 255.255.255.255 | 1 | Host unico |

### Calcular numero de hosts
```
Hosts disponibles = 2^(32 - prefijo_CIDR) - 2
```
Se restan 2: una para la direccion de red y otra para broadcast.

Ejemplo: /24 = 2^(32-24) - 2 = 2^8 - 2 = 256 - 2 = **254 hosts**

### Subnetting basico
Dividir una red en subredes mas pequenas.

Ejemplo: Dividir 192.168.1.0/24 en 4 subredes:
- Necesitamos 2 bits adicionales (2^2 = 4 subredes)
- Nueva mascara: /26 (24 + 2 = 26)
- Cada subred tiene 2^6 - 2 = 62 hosts

| Subred | Rango de hosts | Broadcast |
|--------|---------------|-----------|
| 192.168.1.0/26 | 192.168.1.1 - 192.168.1.62 | 192.168.1.63 |
| 192.168.1.64/26 | 192.168.1.65 - 192.168.1.126 | 192.168.1.127 |
| 192.168.1.128/26 | 192.168.1.129 - 192.168.1.190 | 192.168.1.191 |
| 192.168.1.192/26 | 192.168.1.193 - 192.168.1.254 | 192.168.1.255 |

---

## IPv6

### Estructura
- Direccion de **128 bits** (8 grupos de 4 digitos hexadecimales)
- Separados por **dos puntos** `:` (no puntos)
- Ejemplo completo: `2001:0db8:0000:0000:0000:0000:0000:0001`

### Reglas de abreviacion
1. **Omitir ceros a la izquierda** en cada grupo: `0db8` -> `db8`, `0001` -> `1`
2. **Sustituir grupos consecutivos de ceros** por `::` (solo una vez)

```
Completa:   2001:0db8:0000:0000:0000:0000:0000:0001
Abreviada:  2001:db8::1
```

### Tipos de direcciones IPv6
| Tipo | Prefijo | Descripcion |
|------|---------|-------------|
| **Link-local** | `fe80::/10` | Autoconfigurada, solo valida en el enlace local |
| **Loopback** | `::1` | Equivalente a 127.0.0.1 en IPv4 |
| **Global unicast** | `2000::/3` | Direcciones publicas enrutables (como las IPv4 publicas) |
| **Unique local** | `fc00::/7` (`fd00::/8`) | Privadas (equivalente a RFC 1918 en IPv4) |
| **Multicast** | `ff00::/8` | Multidifusion |
| **No especificada** | `::` | Equivalente a 0.0.0.0 |

### Diferencias clave IPv4 vs IPv6
| Caracteristica | IPv4 | IPv6 |
|---------------|------|------|
| Tamano | 32 bits | 128 bits |
| Notacion | Decimal con puntos | Hexadecimal con dos puntos |
| Cabecera | Variable, compleja | Fija, simplificada |
| Broadcast | Si | No (usa multicast) |
| Autoconfig | DHCP | SLAAC + DHCPv6 |
| IPSec | Opcional | Integrado |

---

## Protocolos de transporte

### TCP (Transmission Control Protocol)
- **Orientado a conexion** (handshake de 3 vias: SYN, SYN-ACK, ACK)
- **Fiable**: Garantiza entrega ordenada, retransmision de paquetes perdidos
- Mas lento por el overhead de control
- Usado para: HTTP, HTTPS, SSH, FTP, SMTP, POP3, IMAP

### UDP (User Datagram Protocol)
- **Sin conexion** (sin handshake)
- **No fiable**: No garantiza entrega ni orden
- Mas rapido y ligero
- Usado para: DNS, DHCP, NTP, SNMP, streaming, VoIP

### ICMP (Internet Control Message Protocol)
- Protocolo de **control y diagnostico**
- No transporta datos de usuario
- Usado por `ping` (ICMP echo request/reply) y `traceroute`
- Tipos importantes: Echo Request (8), Echo Reply (0), Destination Unreachable (3), Time Exceeded (11)

---

## Puertos de red conocidos

### Puertos importantes para el examen

| Puerto | Protocolo | Servicio |
|--------|-----------|----------|
| 20 | TCP | FTP (datos) |
| 21 | TCP | FTP (control) |
| 22 | TCP | SSH |
| 25 | TCP | SMTP |
| 53 | TCP/UDP | DNS |
| 67/68 | UDP | DHCP (servidor/cliente) |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 |
| 123 | UDP | NTP |
| 143 | TCP | IMAP |
| 161/162 | UDP | SNMP |
| 389 | TCP | LDAP |
| 443 | TCP | HTTPS |
| 465 | TCP | SMTPS |
| 514 | UDP | Syslog |
| 587 | TCP | SMTP submission |
| 993 | TCP | IMAPS |
| 995 | TCP | POP3S |

### Rangos de puertos
| Rango | Nombre | Descripcion |
|-------|--------|-------------|
| 0-1023 | Well-known | Servicios estandar (requieren root) |
| 1024-49151 | Registered | Registrados por aplicaciones |
| 49152-65535 | Dynamic/Private | Puertos efimeros (conexiones salientes) |

---

## Archivos de referencia

### `/etc/services`
Mapea nombres de servicios a numeros de puerto.
```
ssh        22/tcp
smtp       25/tcp
domain     53/tcp
domain     53/udp
http       80/tcp
https      443/tcp
```

### `/etc/protocols`
Mapea nombres de protocolos a numeros de protocolo IP.
```
icmp    1    ICMP
tcp     6    TCP
udp     17   UDP
```

---

## Puntos clave para el examen

1. **TCP/IP tiene 4 capas**: Acceso a red, Internet, Transporte, Aplicacion
2. **Direcciones privadas**: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
3. **Formula de hosts**: 2^(32-prefijo) - 2
4. **IPv6**: 128 bits, `fe80::` es link-local, `::1` es loopback
5. **TCP** es fiable y orientado a conexion; **UDP** es rapido y sin conexion
6. **ICMP** es para diagnostico (ping, traceroute)
7. **Puertos clave**: SSH=22, SMTP=25, DNS=53, HTTP=80, HTTPS=443
8. **/etc/services** mapea servicios a puertos
9. IPv6 **no tiene broadcast**, usa multicast
10. **CIDR /24** = 254 hosts, **/30** = 2 hosts (punto a punto)
