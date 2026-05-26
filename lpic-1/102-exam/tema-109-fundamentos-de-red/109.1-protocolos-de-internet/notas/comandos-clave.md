# 109.1 Fundamentos de protocolos de Internet - Comandos clave

## Modelo TCP/IP (4 capas)

| Capa | Protocolos |
|------|------------|
| 4. Aplicacion | HTTP, HTTPS, SSH, FTP, DNS, SMTP, POP3, IMAP |
| 3. Transporte | TCP, UDP |
| 2. Internet | IPv4, IPv6, ICMP |
| 1. Acceso a red | Ethernet, Wi-Fi, ARP |

## Clases IPv4 y direcciones privadas

| Clase | Rango | Mascara defecto | Privadas (RFC 1918) |
|-------|-------|-----------------|---------------------|
| A | 1-126.x.x.x | /8 | 10.0.0.0/8 |
| B | 128-191.x.x.x | /16 | 172.16.0.0/12 |
| C | 192-223.x.x.x | /24 | 192.168.0.0/16 |

## Mascaras CIDR rapidas

| CIDR | Mascara | Hosts |
|------|---------|-------|
| /8 | 255.0.0.0 | 16,777,214 |
| /16 | 255.255.0.0 | 65,534 |
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /28 | 255.255.255.240 | 14 |
| /29 | 255.255.255.248 | 6 |
| /30 | 255.255.255.252 | 2 |
| /32 | 255.255.255.255 | 1 |

**Formula**: Hosts = 2^(32 - CIDR) - 2

## Direcciones IPv6 importantes

| Tipo | Prefijo / Direccion |
|------|---------------------|
| Loopback | `::1` |
| Link-local | `fe80::/10` |
| Global unicast | `2000::/3` |
| Unique local (privada) | `fc00::/7` |
| Multicast | `ff00::/8` |
| No especificada | `::` |

## TCP vs UDP vs ICMP

| Protocolo | Conexion | Fiabilidad | Uso |
|-----------|----------|------------|-----|
| TCP | Orientado | Fiable | HTTP, SSH, SMTP, FTP |
| UDP | Sin conexion | No fiable | DNS, NTP, DHCP, SNMP |
| ICMP | N/A | N/A | ping, traceroute |

## Puertos esenciales

| Puerto | Protocolo | Servicio |
|--------|-----------|----------|
| 22 | TCP | SSH |
| 25 | TCP | SMTP |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 |
| 123 | UDP | NTP |
| 143 | TCP | IMAP |
| 443 | TCP | HTTPS |
| 993 | TCP | IMAPS |
| 995 | TCP | POP3S |

## Archivos de referencia

| Archivo | Contenido |
|---------|-----------|
| `/etc/services` | Mapeo servicio -> puerto |
| `/etc/protocols` | Mapeo protocolo -> numero IP |
