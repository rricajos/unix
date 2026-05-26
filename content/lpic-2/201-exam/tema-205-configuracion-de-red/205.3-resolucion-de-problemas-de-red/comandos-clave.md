---
title: "205.3 - Resolucion de problemas de red"
tags: [lpic-2, examen-201, tema-205, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "205"
subtema: "205.3"
---

# 205.3 - Comandos clave: Resolucion de problemas de red

## Pruebas de conectividad

| Comando | Funcion | Ejemplo |
|---|---|---|
| `ping -c N HOST` | Enviar N pings ICMP | `ping -c 4 8.8.8.8` |
| `ping -s SIZE HOST` | Ping con tamano de paquete | `ping -s 1500 -c 4 8.8.8.8` |
| `ping -I IF HOST` | Ping desde una interfaz | `ping -I eth0 8.8.8.8` |
| `ping6 HOST` | Ping IPv6 | `ping6 2001:db8::1` |
| `traceroute HOST` | Trazar ruta (UDP) | `traceroute 8.8.8.8` |
| `traceroute -I HOST` | Trazar ruta (ICMP) | `traceroute -I 8.8.8.8` |
| `traceroute -T -p PORT HOST` | Trazar ruta (TCP) | `traceroute -T -p 80 ejemplo.com` |
| `tracepath HOST` | Trazar ruta sin root | `tracepath 8.8.8.8` |
| `mtr HOST` | Traceroute interactivo continuo | `mtr 8.8.8.8` |
| `mtr -r HOST` | mtr con reporte final | `mtr -r -c 50 8.8.8.8` |

## Analisis de puertos y conexiones

| Comando | Funcion | Ejemplo |
|---|---|---|
| `ss -tlnp` | Puertos TCP en escucha con proceso | `ss -tlnp` |
| `ss -tulnp` | Puertos TCP y UDP en escucha | `ss -tulnp` |
| `ss -tnp` | Conexiones TCP establecidas | `ss -tnp` |
| `ss -s` | Resumen de estadisticas | `ss -s` |
| `ss sport = :PORT` | Filtrar por puerto de origen | `ss -tnp sport = :80` |
| `netstat -tlnp` | Puertos en escucha (legacy) | `netstat -tlnp` |
| `netstat -rn` | Tabla de enrutamiento (legacy) | `netstat -rn` |

## Captura y analisis de trafico

| Comando | Funcion | Ejemplo |
|---|---|---|
| `tcpdump -i IF` | Capturar trafico en interfaz | `tcpdump -i eth0` |
| `tcpdump -i IF host IP` | Capturar trafico de/hacia IP | `tcpdump -i eth0 host 192.168.1.100` |
| `tcpdump -i IF port N` | Capturar trafico en puerto | `tcpdump -i eth0 port 80` |
| `tcpdump -i IF -nn` | Capturar sin resolver nombres | `tcpdump -i eth0 -nn` |
| `tcpdump -i IF -w FILE` | Guardar captura en archivo pcap | `tcpdump -i eth0 -w /tmp/captura.pcap` |
| `tcpdump -r FILE` | Leer archivo pcap | `tcpdump -r /tmp/captura.pcap` |
| `tcpdump -i IF -c N` | Capturar N paquetes | `tcpdump -i eth0 -c 100` |

## Escaneo de red

| Comando | Funcion | Ejemplo |
|---|---|---|
| `nmap HOST` | Escaneo basico de puertos | `nmap 192.168.1.100` |
| `nmap -sn RED` | Descubrir hosts activos (ping sweep) | `nmap -sn 192.168.1.0/24` |
| `nmap -p PORTS HOST` | Escanear puertos especificos | `nmap -p 22,80,443 192.168.1.100` |
| `nmap -sV HOST` | Detectar version de servicios | `nmap -sV 192.168.1.100` |
| `nmap -sU HOST` | Escaneo de puertos UDP | `nmap -sU 192.168.1.100` |
| `nmap -O HOST` | Detectar sistema operativo | `nmap -O 192.168.1.100` |
| `nmap -A HOST` | Escaneo completo y agresivo | `nmap -A 192.168.1.100` |

## Verificacion de puertos con netcat

| Comando | Funcion | Ejemplo |
|---|---|---|
| `nc -zv HOST PORT` | Verificar si un puerto esta abierto | `nc -zv 192.168.1.100 80` |
| `nc -zv HOST P1-P2` | Escanear rango de puertos | `nc -zv 192.168.1.100 20-25` |
| `nc -l -p PORT` | Escuchar en un puerto | `nc -l -p 8080` |
| `nc -u HOST PORT` | Conexion UDP | `nc -u 192.168.1.100 53` |
| `nc -w N -zv HOST PORT` | Verificar con timeout | `nc -w 5 -zv 192.168.1.100 443` |

## Resolucion DNS

| Comando | Funcion | Ejemplo |
|---|---|---|
| `dig DOMAIN` | Consulta DNS completa | `dig ejemplo.com` |
| `dig DOMAIN TYPE` | Consulta de tipo especifico | `dig ejemplo.com MX` |
| `dig @SERVER DOMAIN` | Consultar servidor DNS especifico | `dig @8.8.8.8 ejemplo.com` |
| `dig +short DOMAIN` | Respuesta resumida | `dig +short ejemplo.com` |
| `dig +trace DOMAIN` | Trazar cadena de resolucion | `dig +trace ejemplo.com` |
| `dig -x IP` | Consulta DNS inversa | `dig -x 8.8.8.8` |
| `nslookup DOMAIN` | Consulta DNS (legacy) | `nslookup ejemplo.com` |
| `nslookup DOMAIN SERVER` | Consulta con servidor especifico | `nslookup ejemplo.com 8.8.8.8` |
| `host DOMAIN` | Consulta DNS simplificada | `host ejemplo.com` |
| `host -t TYPE DOMAIN` | Consulta por tipo de registro | `host -t MX ejemplo.com` |
| `host IP` | Consulta inversa | `host 8.8.8.8` |

## Informacion de la interfaz fisica

| Comando | Funcion | Ejemplo |
|---|---|---|
| `ethtool IF` | Ver velocidad, duplex, estado | `ethtool eth0` |
| `ethtool -S IF` | Ver estadisticas del driver | `ethtool -S eth0` |
| `ethtool -i IF` | Ver informacion del driver | `ethtool -i eth0` |
| `ethtool -s IF speed N duplex D` | Forzar velocidad/duplex | `ethtool -s eth0 speed 100 duplex full` |
| `ethtool -p IF` | Parpadear LED de la interfaz | `ethtool -p eth0` |
| `ethtool -k IF` | Ver estado de offloading | `ethtool -k eth0` |

## Tabla ARP / vecinos

| Comando | Funcion | Ejemplo |
|---|---|---|
| `ip neigh show` | Ver tabla de vecinos (moderno) | `ip neigh show` |
| `ip neigh flush all` | Limpiar cache de vecinos | `ip neigh flush all` |
| `arp -a` | Ver tabla ARP (legacy) | `arp -a` |
| `arp -n` | Tabla ARP sin resolver nombres | `arp -n` |
| `arp -s IP MAC` | Agregar entrada ARP estatica | `arp -s 192.168.1.50 00:11:22:33:44:55` |
| `arp -d IP` | Eliminar entrada ARP | `arp -d 192.168.1.50` |

## Metodologia de diagnostico rapido

```bash
# Paso 1: Interfaz activa?
ip link show eth0

# Paso 2: IP asignada?
ip addr show eth0

# Paso 3: Gateway configurado?
ip route show | grep default

# Paso 4: Ping al gateway
ping -c 2 $(ip route show | grep default | awk '{print $3}')

# Paso 5: Ping a IP externa
ping -c 2 8.8.8.8

# Paso 6: DNS funciona?
dig +short google.com

# Paso 7: Puerto del servicio abierto?
ss -tlnp | grep :80

# Paso 8: Firewall bloqueando?
iptables -L -n | head -20
```
