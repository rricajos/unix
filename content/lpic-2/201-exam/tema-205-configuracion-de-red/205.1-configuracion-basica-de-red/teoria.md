---
title: "205.1 - Configuracion basica de red"
tags: [lpic-2, examen-201, tema-205, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "205"
subtema: "205.1"
---

# 205.1 - Configuracion basica de red

## Herramientas modernas: el comando ip (iproute2)

El paquete `iproute2` proporciona el comando `ip`, que es la herramienta moderna y recomendada para la configuracion de red en Linux, reemplazando a los comandos legacy `ifconfig`, `route`, `arp` y `netstat`.

### ip addr - Gestion de direcciones IP

```bash
# Ver todas las interfaces y sus direcciones
ip addr show
ip a                    # Forma abreviada

# Ver una interfaz especifica
ip addr show dev eth0

# Agregar una direccion IP a una interfaz
ip addr add 192.168.1.100/24 dev eth0

# Agregar una direccion IP secundaria
ip addr add 192.168.1.101/24 dev eth0 label eth0:1

# Eliminar una direccion IP
ip addr del 192.168.1.100/24 dev eth0

# Eliminar todas las direcciones de una interfaz
ip addr flush dev eth0
```

### ip link - Gestion de interfaces

```bash
# Ver el estado de todas las interfaces
ip link show
ip l                    # Forma abreviada

# Activar una interfaz
ip link set eth0 up

# Desactivar una interfaz
ip link set eth0 down

# Cambiar la MTU
ip link set eth0 mtu 9000

# Cambiar la direccion MAC
ip link set eth0 address 00:11:22:33:44:55

# Ver estadisticas de una interfaz
ip -s link show eth0
```

### ip route - Gestion de rutas

```bash
# Ver la tabla de enrutamiento
ip route show
ip r                    # Forma abreviada

# Agregar una ruta por defecto (gateway)
ip route add default via 192.168.1.1

# Agregar una ruta a una red especifica
ip route add 10.0.0.0/8 via 192.168.1.254

# Agregar una ruta a traves de una interfaz
ip route add 172.16.0.0/16 dev eth1

# Eliminar una ruta
ip route del 10.0.0.0/8

# Reemplazar una ruta existente
ip route replace default via 192.168.1.254
```

### ip neigh - Gestion de la tabla ARP

```bash
# Ver la tabla de vecinos (ARP/NDP)
ip neigh show
ip n                    # Forma abreviada

# Agregar una entrada estatica
ip neigh add 192.168.1.50 lladdr 00:11:22:33:44:55 dev eth0

# Eliminar una entrada
ip neigh del 192.168.1.50 dev eth0

# Limpiar la cache ARP
ip neigh flush all
```

> **Para el examen:** El comando `ip` reemplaza completamente a los comandos legacy. Conoce las equivalencias: `ip addr` = `ifconfig`, `ip route` = `route`, `ip neigh` = `arp`, `ip link` = parte de `ifconfig`.

## Herramientas legacy

Aunque estan deprecadas, pueden aparecer en el examen:

### ifconfig

```bash
# Ver todas las interfaces
ifconfig -a

# Ver una interfaz especifica
ifconfig eth0

# Configurar una direccion IP
ifconfig eth0 192.168.1.100 netmask 255.255.255.0

# Activar/desactivar
ifconfig eth0 up
ifconfig eth0 down
```

### route

```bash
# Ver la tabla de enrutamiento
route -n

# Agregar ruta por defecto
route add default gw 192.168.1.1

# Agregar ruta a una red
route add -net 10.0.0.0/8 gw 192.168.1.254

# Eliminar una ruta
route del -net 10.0.0.0/8
```

## Configuracion del hostname

### hostnamectl (systemd)

```bash
# Ver el hostname actual y metadatos
hostnamectl

# Salida tipica:
#    Static hostname: servidor01
#    Icon name: computer-vm
#    Machine ID: abc123...
#    Boot ID: def456...
#    Operating System: Debian GNU/Linux 12
#    Kernel: Linux 6.1.0-18-amd64
#    Architecture: x86-64

# Establecer el hostname estatico
hostnamectl set-hostname servidor01

# Establecer hostname descriptivo (pretty)
hostnamectl set-hostname "Servidor de Produccion 01" --pretty

# Establecer hostname transitorio (hasta reinicio)
hostnamectl set-hostname temporal01 --transient
```

### Tipos de hostname

| Tipo | Descripcion | Persistencia |
|---|---|---|
| Static | Nombre almacenado en `/etc/hostname` | Persistente |
| Transient | Asignado por el kernel, DHCP, etc. | Hasta reinicio |
| Pretty | Nombre descriptivo libre (con espacios, etc.) | Persistente |

### Archivos de hostname

```bash
# Hostname estatico del sistema
cat /etc/hostname
# servidor01

# Resolucion local de nombres
cat /etc/hosts
# 127.0.0.1   localhost
# 127.0.1.1   servidor01.empresa.com servidor01
# 192.168.1.10  servidor-web
# 192.168.1.20  servidor-db

# Comando hostname (legacy)
hostname                  # Ver hostname actual
hostname nuevo_nombre     # Cambiar (no persistente)
hostname -f               # Ver FQDN
hostname -d               # Ver dominio
hostname -i               # Ver direccion IP
```

> **Para el examen:** `hostnamectl` es la forma moderna y preferida de gestionar el hostname en sistemas con systemd. El cambio con `hostnamectl set-hostname` modifica `/etc/hostname` automaticamente.

## Configuracion de DNS

### /etc/resolv.conf

```bash
cat /etc/resolv.conf
# Servidores DNS
nameserver 8.8.8.8
nameserver 8.8.4.4

# Dominio de busqueda
domain empresa.com

# Lista de busqueda (alternativa a domain)
search empresa.com desarrollo.empresa.com

# Opciones
options timeout:2 attempts:3 rotate
```

| Directiva | Descripcion |
|---|---|
| `nameserver` | IP del servidor DNS (maximo 3) |
| `domain` | Dominio por defecto para nombres no cualificados |
| `search` | Lista de dominios de busqueda (maximo 6) |
| `options` | Opciones adicionales (timeout, attempts, rotate) |

> **Para el examen:** En sistemas con NetworkManager o systemd-resolved, `/etc/resolv.conf` puede ser un enlace simbolico gestionado automaticamente. No se debe editar directamente en esos casos.

### /etc/nsswitch.conf

Este archivo controla el orden de busqueda para resolucion de nombres:

```bash
# Orden de resolucion de hosts
hosts: files dns myhostname

# Esto significa: buscar primero en /etc/hosts (files),
# luego en DNS (dns), y por ultimo el nombre local (myhostname)
```

## NetworkManager

NetworkManager es el gestor de red mas comun en distribuciones de escritorio y servidor modernas.

### nmcli - Interfaz de linea de comandos

```bash
# Ver estado general
nmcli general status

# Ver todas las conexiones
nmcli connection show
nmcli con show              # Forma abreviada

# Ver conexiones activas
nmcli connection show --active

# Ver detalles de una conexion
nmcli connection show "Wired connection 1"

# Ver dispositivos de red
nmcli device status

# Crear una nueva conexion con IP estatica
nmcli connection add type ethernet con-name "red-oficina" ifname eth0 \
  ipv4.addresses 192.168.1.100/24 \
  ipv4.gateway 192.168.1.1 \
  ipv4.dns "8.8.8.8 8.8.4.4" \
  ipv4.method manual

# Crear una conexion con DHCP
nmcli connection add type ethernet con-name "red-dhcp" ifname eth0 \
  ipv4.method auto

# Modificar una conexion existente
nmcli connection modify "red-oficina" ipv4.dns "1.1.1.1 1.0.0.1"

# Activar/desactivar una conexion
nmcli connection up "red-oficina"
nmcli connection down "red-oficina"

# Eliminar una conexion
nmcli connection delete "red-oficina"

# Recargar archivos de configuracion
nmcli connection reload
```

### nmtui - Interfaz de texto

```bash
# Lanzar la interfaz de texto de NetworkManager
nmtui

# Opciones del menu:
# - Edit a connection (editar conexiones)
# - Activate a connection (activar/desactivar)
# - Set system hostname (configurar hostname)
```

> **Para el examen:** `nmcli` es la herramienta CLI de NetworkManager mas importante. Conoce como crear, modificar y activar conexiones. `nmtui` es la alternativa interactiva con menus de texto.

## Configuracion en distribucion RHEL/CentOS

### Archivos en /etc/sysconfig/network-scripts/

```bash
# Archivo de configuracion de interfaz
cat /etc/sysconfig/network-scripts/ifcfg-eth0

# Configuracion con IP estatica:
TYPE=Ethernet
DEVICE=eth0
NAME=eth0
ONBOOT=yes
BOOTPROTO=none
IPADDR=192.168.1.100
PREFIX=24
GATEWAY=192.168.1.1
DNS1=8.8.8.8
DNS2=8.8.4.4
DEFROUTE=yes

# Configuracion con DHCP:
TYPE=Ethernet
DEVICE=eth0
NAME=eth0
ONBOOT=yes
BOOTPROTO=dhcp
```

| Parametro | Descripcion |
|---|---|
| `TYPE` | Tipo de interfaz (Ethernet, Bridge, Bond...) |
| `DEVICE` | Nombre del dispositivo |
| `ONBOOT` | Activar al arrancar (yes/no) |
| `BOOTPROTO` | Protocolo (none=estatica, dhcp, bootp) |
| `IPADDR` | Direccion IP |
| `PREFIX` | Longitud del prefijo (o NETMASK) |
| `GATEWAY` | Puerta de enlace por defecto |
| `DNS1/DNS2` | Servidores DNS |
| `DEFROUTE` | Usar como ruta por defecto |

## Configuracion en distribucion Debian/Ubuntu

### Archivo /etc/network/interfaces

```bash
cat /etc/network/interfaces

# Interfaz loopback
auto lo
iface lo inet loopback

# Interfaz con IP estatica
auto eth0
iface eth0 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 8.8.4.4

# Interfaz con DHCP
auto eth1
iface eth1 inet dhcp

# Aplicar cambios (legacy)
ifup eth0
ifdown eth0
```

## systemd-networkd

Alternativa de configuracion de red via systemd, comun en servidores minimalistas y contenedores.

```bash
# Archivos de configuracion en:
# /etc/systemd/network/*.network
# /etc/systemd/network/*.netdev
# /etc/systemd/network/*.link

# Ejemplo: /etc/systemd/network/20-wired.network
cat /etc/systemd/network/20-wired.network

[Match]
Name=eth0

[Network]
Address=192.168.1.100/24
Gateway=192.168.1.1
DNS=8.8.8.8
DNS=8.8.4.4

# Ejemplo con DHCP:
# /etc/systemd/network/20-dhcp.network
[Match]
Name=eth0

[Network]
DHCP=yes

# Habilitar y reiniciar systemd-networkd
systemctl enable systemd-networkd
systemctl restart systemd-networkd

# Habilitar resolucion DNS via systemd
systemctl enable systemd-resolved
systemctl restart systemd-resolved
```

> **Para el examen:** systemd-networkd usa archivos `.network` con secciones `[Match]` y `[Network]`. Es una alternativa ligera a NetworkManager, frecuente en servidores y contenedores.

## Bonding y Teaming

### Bonding (kernel module)

El bonding combina multiples interfaces fisicas en una interfaz logica para redundancia o rendimiento.

```bash
# Cargar el modulo de bonding
modprobe bonding

# Modos de bonding
# mode=0 (balance-rr): Round-robin
# mode=1 (active-backup): Solo una interfaz activa
# mode=2 (balance-xor): XOR de MACs
# mode=3 (broadcast): Transmite por todas
# mode=4 (802.3ad): LACP (requiere soporte del switch)
# mode=5 (balance-tlb): Balanceo adaptativo de transmision
# mode=6 (balance-alb): Balanceo adaptativo completo

# Crear bond con nmcli
nmcli connection add type bond con-name bond0 ifname bond0 \
  bond.options "mode=active-backup,miimon=100"

# Agregar interfaces esclavas
nmcli connection add type ethernet con-name bond0-slave1 \
  ifname eth0 master bond0
nmcli connection add type ethernet con-name bond0-slave2 \
  ifname eth1 master bond0

# Activar el bond
nmcli connection up bond0

# Ver estado del bond
cat /proc/net/bonding/bond0
```

### Modos de bonding mas importantes

| Modo | Nombre | Descripcion | Requiere switch |
|---|---|---|---|
| 0 | balance-rr | Round-robin entre interfaces | Configuracion especial |
| 1 | active-backup | Solo una activa, failover automatico | No |
| 4 | 802.3ad | LACP, agregacion de enlaces | Si (LACP) |
| 6 | balance-alb | Balanceo adaptativo | No |

### Teaming (alternativa moderna)

Teaming es una alternativa mas moderna al bonding con mejor rendimiento y flexibilidad:

```bash
# Crear team con nmcli
nmcli connection add type team con-name team0 ifname team0 \
  team.config '{"runner": {"name": "activebackup"}}'

# Agregar miembros
nmcli connection add type ethernet con-name team0-port1 \
  ifname eth0 master team0
nmcli connection add type ethernet con-name team0-port2 \
  ifname eth1 master team0

# Ver estado del team
teamdctl team0 state

# Runners disponibles: activebackup, roundrobin, loadbalance, broadcast, lacp
```

> **Para el examen:** Conoce los modos de bonding mas comunes (0, 1, 4, 6) y como crearlos con `nmcli`. El teaming es la alternativa moderna pero el bonding sigue siendo ampliamente usado.
