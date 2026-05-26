---
title: "109.3 Resolucion de problemas basicos de red - Comandos clave"
tags:
  - lpic-1
  - examen-102
  - tema-109
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "109"
subtema: "109.3"
---

# 109.3 Resolucion de problemas basicos de red - Comandos clave

## ping

| Comando | Descripcion |
|---------|-------------|
| `ping host` | Ping continuo |
| `ping -c 5 host` | Enviar 5 paquetes |
| `ping -i 2 host` | Intervalo de 2 segundos |
| `ping -w 10 host` | Timeout total 10 segundos |
| `ping -I eth0 host` | Usar interfaz especifica |
| `ping6 host` / `ping -6 host` | Ping IPv6 |

## traceroute / tracepath / mtr

| Comando | Descripcion |
|---------|-------------|
| `traceroute host` | Trazar ruta (UDP por defecto) |
| `traceroute -I host` | Trazar ruta con ICMP |
| `traceroute -n host` | Sin resolver nombres |
| `tracepath host` | Trazar ruta (no requiere root) |
| `mtr host` | Ping + traceroute interactivo |
| `mtr -r host` | Modo reporte |
| `mtr -r -c 10 host` | Reporte con 10 ciclos |

## ss (moderno)

| Comando | Descripcion |
|---------|-------------|
| `ss -tulnp` | Puertos TCP/UDP en escucha con PID |
| `ss -a` | Todas las conexiones |
| `ss -t` | Solo TCP |
| `ss -u` | Solo UDP |
| `ss -l` | Solo en escucha |
| `ss -s` | Resumen estadistico |
| `ss sport = :22` | Filtrar por puerto origen |

## netstat (legacy)

| Comando | Descripcion |
|---------|-------------|
| `netstat -tulnp` | Puertos en escucha con PID |
| `netstat -r` | Tabla de rutas |
| `netstat -i` | Estadisticas de interfaces |
| `netstat -s` | Estadisticas por protocolo |

## ip (diagnostico)

| Comando | Descripcion |
|---------|-------------|
| `ip addr show` | Ver direcciones IP |
| `ip link show` | Estado de interfaces |
| `ip route show` | Tabla de rutas |
| `ip neigh show` | Tabla ARP |
| `ip -s link show eth0` | Estadisticas de interfaz |

## netcat / nc

| Comando | Descripcion |
|---------|-------------|
| `nc -zv host 80` | Verificar si puerto 80 esta abierto |
| `nc -zv host 20-25` | Escanear rango de puertos |
| `nc -l 1234` | Escuchar en puerto 1234 |
| `nc -u host 53` | Conexion UDP |

## tcpdump

| Comando | Descripcion |
|---------|-------------|
| `tcpdump -i eth0` | Capturar en interfaz |
| `tcpdump -n` | Sin resolver nombres |
| `tcpdump -c 10` | Solo 10 paquetes |
| `tcpdump host 192.168.1.1` | Filtrar por host |
| `tcpdump port 80` | Filtrar por puerto |
| `tcpdump -w archivo.pcap` | Guardar captura |
| `tcpdump -r archivo.pcap` | Leer captura |

## hostname

| Comando | Descripcion |
|---------|-------------|
| `hostname` | Nombre del host |
| `hostname -f` | FQDN |
| `hostname -i` | IP del host |
| `hostname -I` | Todas las IPs |

## Metodologia de troubleshooting

| Paso | Verificar | Comando |
|------|-----------|---------|
| 1 | Interfaz activa | `ip link show` |
| 2 | IP configurada | `ip addr show` |
| 3 | Ping a si mismo | `ping -c 3 MI_IP` |
| 4 | Ping al gateway | `ping -c 3 GATEWAY` |
| 5 | Ping externo | `ping -c 3 8.8.8.8` |
| 6 | Resolucion DNS | `ping -c 3 google.com` |
| 7 | Servicio | `ss -tulnp` / `nc -zv host puerto` |
