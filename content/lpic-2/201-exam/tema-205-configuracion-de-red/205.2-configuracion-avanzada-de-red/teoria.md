---
title: "205.2 - Configuracion avanzada de red"
tags: [lpic-2, examen-201, tema-205, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "205"
subtema: "205.2"
---

# 205.2 - Configuracion avanzada de red

## Enrutamiento avanzado

### Tablas de enrutamiento

Linux soporta multiples tablas de enrutamiento, lo que permite implementar politicas de enrutamiento complejas (policy routing). Las tablas se definen en `/etc/iproute2/rt_tables`.

```bash
# Ver las tablas definidas
cat /etc/iproute2/rt_tables
# 255   local
# 254   main
# 253   default
# 0     unspec

# Agregar una tabla personalizada
echo "100 empresa" >> /etc/iproute2/rt_tables
```

| Tabla | Numero | Descripcion |
|---|---|---|
| `local` | 255 | Rutas locales y broadcast (gestionada por el kernel) |
| `main` | 254 | Tabla principal (la que se muestra con `ip route`) |
| `default` | 253 | Tabla por defecto (normalmente vacia) |

### Rutas estaticas

```bash
# Agregar ruta a una red especifica
ip route add 10.0.0.0/8 via 192.168.1.254

# Agregar ruta por una interfaz especifica
ip route add 172.16.0.0/12 dev eth1

# Agregar ruta con metrica (preferencia)
ip route add 10.0.0.0/8 via 192.168.1.254 metric 100

# Agregar ruta a una tabla especifica
ip route add 10.0.0.0/8 via 10.0.0.1 table empresa

# Agregar ruta por defecto en una tabla personalizada
ip route add default via 10.0.0.1 table empresa

# Ver rutas de una tabla especifica
ip route show table empresa

# Agregar ruta con source address preferido
ip route add 10.0.0.0/8 via 192.168.1.254 src 192.168.1.100
```

### Policy routing con ip rule

Las reglas de politica (`ip rule`) determinan que tabla de enrutamiento se consulta para cada paquete, basandose en criterios como IP de origen, marca del paquete o interfaz de entrada.

```bash
# Ver las reglas actuales
ip rule show
# 0:      from all lookup local
# 32766:  from all lookup main
# 32767:  from all lookup default

# Agregar regla: trafico desde 10.0.1.0/24 usa tabla "empresa"
ip rule add from 10.0.1.0/24 table empresa

# Agregar regla por IP de destino
ip rule add to 172.16.0.0/12 table empresa

# Agregar regla por interfaz de entrada
ip rule add iif eth1 table empresa

# Agregar regla por marca de firewall (fwmark)
ip rule add fwmark 1 table empresa

# Agregar regla con prioridad especifica
ip rule add from 10.0.1.0/24 table empresa priority 100

# Eliminar una regla
ip rule del from 10.0.1.0/24 table empresa
```

> **Para el examen:** El policy routing permite tener multiples gateways y elegir la ruta segun el origen del trafico. Es fundamental para escenarios con multiples ISP o redes complejas.

### Reenvio de paquetes (IP forwarding)

Para que un sistema Linux actue como router, se debe habilitar el reenvio de paquetes:

```bash
# Verificar si el forwarding esta habilitado
cat /proc/sys/net/ipv4/ip_forward
# 0 = deshabilitado, 1 = habilitado

# Habilitar temporalmente
echo 1 > /proc/sys/net/ipv4/ip_forward
# O con sysctl:
sysctl -w net.ipv4.ip_forward=1

# Habilitar permanentemente en /etc/sysctl.conf o /etc/sysctl.d/
net.ipv4.ip_forward = 1

# Para IPv6
net.ipv6.conf.all.forwarding = 1

# Aplicar cambios sin reiniciar
sysctl -p
```

> **Para el examen:** `/proc/sys/net/ipv4/ip_forward` es un archivo clave. Debe estar a `1` para que el sistema actue como router. Para persistir el cambio se edita `/etc/sysctl.conf`.

## VLANs (Virtual LANs)

Las VLANs permiten segmentar una red fisica en multiples redes logicas usando etiquetado 802.1Q.

### Configuracion de VLANs

```bash
# Cargar el modulo del kernel (normalmente cargado automaticamente)
modprobe 8021q

# Crear una interfaz VLAN
ip link add link eth0 name eth0.100 type vlan id 100

# Asignar IP a la VLAN
ip addr add 10.100.0.1/24 dev eth0.100

# Activar la interfaz VLAN
ip link set eth0.100 up

# Ver informacion de la VLAN
cat /proc/net/vlan/eth0.100

# Ver todas las VLANs configuradas
cat /proc/net/vlan/config

# Eliminar una VLAN
ip link delete eth0.100
```

### VLAN con nmcli

```bash
# Crear conexion VLAN con NetworkManager
nmcli connection add type vlan con-name vlan100 dev eth0 id 100 \
  ipv4.addresses 10.100.0.1/24 ipv4.method manual

# Activar
nmcli connection up vlan100
```

### VLAN persistente con systemd-networkd

```ini
# /etc/systemd/network/10-eth0.100.netdev
[NetDev]
Name=eth0.100
Kind=vlan

[VLAN]
Id=100

# /etc/systemd/network/20-eth0.100.network
[Match]
Name=eth0.100

[Network]
Address=10.100.0.1/24
```

> **Para el examen:** Las interfaces VLAN se nombran tipicamente como `interfaz.vlan_id` (ej: `eth0.100`). Se crean con `ip link add type vlan id N`.

## Bridges (puentes de red)

Un bridge conecta dos o mas segmentos de red a nivel de capa 2 (enlace de datos), funcionando como un switch virtual.

### Configuracion de bridges

```bash
# Crear un bridge
ip link add name br0 type bridge

# Agregar interfaces al bridge
ip link set eth0 master br0
ip link set eth1 master br0

# Activar el bridge y las interfaces
ip link set br0 up
ip link set eth0 up
ip link set eth1 up

# Asignar IP al bridge
ip addr add 192.168.1.1/24 dev br0

# Ver informacion del bridge
bridge link show

# Mostrar tabla de MAC del bridge
bridge fdb show

# Eliminar una interfaz del bridge
ip link set eth0 nomaster

# Eliminar el bridge
ip link delete br0
```

### Bridge con nmcli

```bash
# Crear bridge
nmcli connection add type bridge con-name br0 ifname br0

# Agregar interfaces como esclavas
nmcli connection add type ethernet con-name br0-port1 ifname eth0 master br0
nmcli connection add type ethernet con-name br0-port2 ifname eth1 master br0

# Configurar IP
nmcli connection modify br0 ipv4.addresses 192.168.1.1/24 ipv4.method manual

# Activar
nmcli connection up br0
```

### Herramienta brctl (legacy)

```bash
# Crear bridge (legacy)
brctl addbr br0

# Agregar interfaces
brctl addif br0 eth0
brctl addif br0 eth1

# Ver bridges
brctl show

# Activar STP (Spanning Tree Protocol)
brctl stp br0 on
```

## Tunneling

### Tuneles GRE (Generic Routing Encapsulation)

GRE encapsula paquetes de un protocolo dentro de otro, permitiendo crear tuneles punto a punto sobre redes IP.

```bash
# Crear un tunel GRE
ip tunnel add gre1 mode gre remote 203.0.113.1 local 198.51.100.1 ttl 255

# Asignar IP al tunel
ip addr add 10.0.0.1/30 dev gre1

# Activar el tunel
ip link set gre1 up

# Agregar ruta a traves del tunel
ip route add 192.168.2.0/24 dev gre1

# Eliminar el tunel
ip tunnel del gre1
```

### Tuneles SIT (IPv6 sobre IPv4)

SIT (Simple Internet Transition) encapsula trafico IPv6 dentro de paquetes IPv4, utilizado para conectividad IPv6 sobre redes IPv4.

```bash
# Crear tunel SIT (6in4)
ip tunnel add sit1 mode sit remote 203.0.113.1 local 198.51.100.1 ttl 255

# Asignar direccion IPv6
ip -6 addr add 2001:db8::1/64 dev sit1

# Activar
ip link set sit1 up

# Agregar ruta IPv6 a traves del tunel
ip -6 route add 2001:db8:2::/48 dev sit1
```

### Tipos de tuneles disponibles

| Tipo | Descripcion | Comando |
|---|---|---|
| GRE | Tunel generico IP sobre IP | `ip tunnel add mode gre` |
| SIT | IPv6 sobre IPv4 (6in4) | `ip tunnel add mode sit` |
| IPIP | IPv4 sobre IPv4 | `ip tunnel add mode ipip` |
| ip6tnl | IPv6 sobre IPv6 | `ip tunnel add mode ip6tnl` |
| GRE6 | GRE sobre IPv6 | `ip tunnel add mode ip6gre` |
| VXLAN | Virtual eXtensible LAN | `ip link add type vxlan` |

> **Para el examen:** Conoce los modos de tunel principales: `gre`, `sit`, `ipip`. Los tuneles se crean con `ip tunnel add` o `ip link add`.

## Traffic shaping con tc

El comando `tc` (traffic control) permite controlar el ancho de banda, la latencia y la priorizacion del trafico de red.

### Conceptos basicos de tc

- **qdisc:** Disciplina de colas (queueing discipline), algoritmo que gestiona las colas de paquetes
- **class:** Subdivision de un qdisc para clasificar trafico
- **filter:** Regla que asigna paquetes a clases

### Ejemplos de tc

```bash
# Ver la configuracion actual de tc
tc qdisc show dev eth0
tc class show dev eth0
tc filter show dev eth0

# Limitar el ancho de banda de salida a 1 Mbit/s usando TBF
tc qdisc add dev eth0 root tbf rate 1mbit burst 32kbit latency 400ms

# Usar HTB (Hierarchical Token Bucket) para control mas avanzado
tc qdisc add dev eth0 root handle 1: htb default 30

# Crear clase con ancho de banda garantizado
tc class add dev eth0 parent 1: classid 1:1 htb rate 10mbit ceil 10mbit

# Subclase para trafico prioritario
tc class add dev eth0 parent 1:1 classid 1:10 htb rate 5mbit ceil 10mbit

# Subclase para trafico normal
tc class add dev eth0 parent 1:1 classid 1:30 htb rate 3mbit ceil 10mbit

# Filtro para asignar trafico al puerto 80 a la clase prioritaria
tc filter add dev eth0 parent 1: protocol ip prio 1 u32 \
  match ip dport 80 0xffff flowid 1:10

# Simular latencia (util para pruebas)
tc qdisc add dev eth0 root netem delay 100ms

# Simular perdida de paquetes
tc qdisc add dev eth0 root netem loss 10%

# Eliminar toda la configuracion tc
tc qdisc del dev eth0 root
```

### Qdiscs comunes

| Qdisc | Nombre | Descripcion |
|---|---|---|
| `pfifo_fast` | FIFO rapido con prioridades | Qdisc por defecto en Linux |
| `tbf` | Token Bucket Filter | Limitar tasa de transferencia |
| `htb` | Hierarchical Token Bucket | Control de ancho de banda jerarquico |
| `sfq` | Stochastic Fair Queuing | Distribucion equitativa |
| `netem` | Network Emulator | Simular condiciones de red |
| `cbq` | Class Based Queuing | Control basado en clases |
| `fq_codel` | Fair Queuing CoDel | Anti-bufferbloat (moderno) |

> **Para el examen:** Comprende los conceptos basicos de `tc`: qdisc, class y filter. Conoce al menos `tbf` para limitar ancho de banda y `netem` para simular condiciones de red.

## Configuracion IPv6

### Conceptos basicos de IPv6

```bash
# Ver direcciones IPv6
ip -6 addr show

# Asignar direccion IPv6
ip -6 addr add 2001:db8::1/64 dev eth0

# Ver rutas IPv6
ip -6 route show

# Agregar ruta IPv6
ip -6 route add 2001:db8:2::/48 via 2001:db8::ffff

# Agregar ruta por defecto IPv6
ip -6 route add default via fe80::1 dev eth0

# Habilitar reenvio IPv6
sysctl -w net.ipv6.conf.all.forwarding=1
```

### Tipos de direcciones IPv6

| Tipo | Prefijo | Descripcion |
|---|---|---|
| Link-local | `fe80::/10` | Comunicacion en el enlace local (autoconfigurada) |
| Global unicast | `2000::/3` | Direcciones publicas enrutables |
| Unique local | `fc00::/7` | Equivalente a direcciones privadas |
| Multicast | `ff00::/8` | Multidifusion |
| Loopback | `::1/128` | Equivalente a 127.0.0.1 |

### Neighbor Discovery Protocol (NDP)

NDP es el equivalente IPv6 de ARP, y se encarga de la resolucion de direcciones, descubrimiento de routers y autoconfig.

```bash
# Ver la tabla de vecinos IPv6 (equivalente a ARP)
ip -6 neigh show

# Tipos de mensajes NDP:
# - Router Solicitation (RS): Buscar routers
# - Router Advertisement (RA): Respuesta del router con prefijo
# - Neighbor Solicitation (NS): Resolver MAC (equivale a ARP Request)
# - Neighbor Advertisement (NA): Respuesta con MAC (equivale a ARP Reply)
# - Redirect: Redirigir a un mejor router

# Controlar autoconfig via sysctl
sysctl net.ipv6.conf.eth0.accept_ra        # Aceptar Router Advertisements
sysctl net.ipv6.conf.eth0.autoconf         # Autoconfigurar direccion (SLAAC)
```

### SLAAC (Stateless Address Autoconfiguration)

```bash
# El host genera su propia direccion IPv6 a partir de:
# - Prefijo anunciado por el router (via RA)
# - Identificador de interfaz (basado en MAC o aleatorio)

# Controlar si se usa EUI-64 o direccion aleatoria
sysctl net.ipv6.conf.eth0.use_tempaddr
# 0 = solo EUI-64
# 1 = usar direcciones temporales (privacy extensions)
# 2 = preferir direcciones temporales
```

> **Para el examen:** Conoce los tipos de direcciones IPv6, especialmente link-local (fe80::) que siempre esta presente. Comprende que NDP reemplaza a ARP y que SLAAC permite autoconfig sin DHCP.

## Parametros de red del kernel

```bash
# Parametros importantes en /proc/sys/net/

# Reenvio IPv4
/proc/sys/net/ipv4/ip_forward

# Reenvio IPv6
/proc/sys/net/ipv6/conf/all/forwarding

# Responder a ICMP broadcast (smurf attack prevention)
/proc/sys/net/ipv4/icmp_echo_ignore_broadcasts

# SYN cookies (proteccion contra SYN flood)
/proc/sys/net/ipv4/tcp_syncookies

# Redireccionamientos ICMP
/proc/sys/net/ipv4/conf/all/accept_redirects
/proc/sys/net/ipv4/conf/all/send_redirects

# Reverse Path Filtering (anti-spoofing)
/proc/sys/net/ipv4/conf/all/rp_filter

# ARP proxy
/proc/sys/net/ipv4/conf/all/proxy_arp
```
