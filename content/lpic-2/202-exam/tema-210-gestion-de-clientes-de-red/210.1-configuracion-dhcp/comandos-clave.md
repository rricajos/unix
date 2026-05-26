---
title: "210.1 - Configuración DHCP"
tags: [lpic-2, examen-202, tema-210, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.1"
---

# 210.1 - Comandos clave: Configuración DHCP

## Comandos del servidor DHCP

| Comando | Descripción |
|---------|-------------|
| `dhcpd` | Demonio del servidor DHCP ISC |
| `dhcpd -t` | Verificar sintaxis de la configuración |
| `dhcpd -t -cf /etc/dhcp/dhcpd.conf` | Verificar un archivo de configuración específico |
| `dhcpd -T` | Comprobar la base de datos de concesiones |
| `dhcpd -f` | Ejecutar en primer plano (foreground) |
| `dhcpd -d` | Modo depuración, salida por consola |
| `dhcpd -6` | Iniciar el servidor en modo DHCPv6 |

## Comandos del cliente DHCP

| Comando | Descripción |
|---------|-------------|
| `dhclient eth0` | Solicitar una IP vía DHCP en la interfaz eth0 |
| `dhclient -r` | Liberar la concesión DHCP actual |
| `dhclient -v eth0` | Solicitar IP con salida detallada (verbose) |
| `dhclient -6 eth0` | Solicitar dirección IPv6 vía DHCPv6 |

## Comando dhcrelay

| Comando | Descripción |
|---------|-------------|
| `dhcrelay -i eth0 192.168.1.10` | Retransmitir peticiones DHCP al servidor 192.168.1.10 |
| `dhcrelay -6 -l eth0 -u eth1` | Relay DHCPv6: cliente en eth0, servidor en eth1 |
| `dhcrelay -d -i eth0 192.168.1.10` | Relay en modo depuración |

## Gestión del servicio

| Comando | Descripción |
|---------|-------------|
| `systemctl start dhcpd` | Iniciar el servicio DHCP |
| `systemctl stop dhcpd` | Detener el servicio DHCP |
| `systemctl restart dhcpd` | Reiniciar el servicio DHCP |
| `systemctl enable dhcpd` | Habilitar inicio automático |
| `systemctl status dhcpd` | Ver estado del servicio |

## Directivas principales de dhcpd.conf

| Directiva | Ejemplo | Descripción |
|-----------|---------|-------------|
| `subnet ... netmask` | `subnet 192.168.1.0 netmask 255.255.255.0 { }` | Declarar una subred |
| `range` | `range 192.168.1.100 192.168.1.200;` | Rango de IPs disponibles |
| `option routers` | `option routers 192.168.1.1;` | Puerta de enlace |
| `option domain-name-servers` | `option domain-name-servers 8.8.8.8;` | Servidores DNS |
| `option domain-name` | `option domain-name "ejemplo.local";` | Nombre de dominio |
| `default-lease-time` | `default-lease-time 600;` | Concesión por defecto (seg) |
| `max-lease-time` | `max-lease-time 7200;` | Concesión máxima (seg) |
| `fixed-address` | `fixed-address 192.168.1.50;` | IP fija para un host |
| `hardware ethernet` | `hardware ethernet 00:1A:2B:3C:4D:5E;` | MAC del host reservado |
| `authoritative` | `authoritative;` | Servidor autoritativo |

## Archivos clave

| Archivo | Función |
|---------|---------|
| `/etc/dhcp/dhcpd.conf` | Configuración principal DHCPv4 |
| `/etc/dhcp/dhcpd6.conf` | Configuración principal DHCPv6 |
| `/var/lib/dhcp/dhcpd.leases` | Concesiones activas DHCPv4 |
| `/var/lib/dhcp/dhcpd6.leases` | Concesiones activas DHCPv6 |
| `/etc/default/isc-dhcp-server` | Interfaz de escucha (Debian) |
| `/etc/sysconfig/dhcpd` | Interfaz de escucha (RHEL) |

## Verificación y depuración

| Comando | Descripción |
|---------|-------------|
| `cat /var/lib/dhcp/dhcpd.leases` | Ver concesiones activas |
| `journalctl -u dhcpd` | Ver logs del servidor DHCP |
| `grep dhcpd /var/log/syslog` | Buscar entradas DHCP en syslog |
| `tcpdump -i eth0 port 67 or port 68` | Capturar tráfico DHCP en la red |
