---
title: "205.2 - Configuracion avanzada de red"
tags: [lpic-2, examen-201, tema-205, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "205"
subtema: "205.2"
---

# 205.2 - Comandos clave: Configuracion avanzada de red

## Enrutamiento y policy routing

| Comando | Funcion | Ejemplo |
|---|---|---|
| `ip route add RED via GW` | Agregar ruta estatica | `ip route add 10.0.0.0/8 via 192.168.1.254` |
| `ip route add default via GW` | Agregar ruta por defecto | `ip route add default via 192.168.1.1` |
| `ip route add RED dev IF` | Ruta por interfaz | `ip route add 172.16.0.0/12 dev eth1` |
| `ip route add RED via GW metric N` | Ruta con metrica | `ip route add 10.0.0.0/8 via 192.168.1.254 metric 100` |
| `ip route add RED via GW table TABLA` | Ruta en tabla personalizada | `ip route add default via 10.0.0.1 table isp2` |
| `ip route show table TABLA` | Ver rutas de una tabla | `ip route show table isp2` |
| `ip route del RED` | Eliminar ruta | `ip route del 10.0.0.0/8` |
| `ip route replace RED via GW` | Reemplazar ruta | `ip route replace default via 192.168.1.254` |
| `ip rule show` | Ver reglas de politica | `ip rule show` |
| `ip rule add from RED table TABLA` | Regla por IP origen | `ip rule add from 10.0.1.0/24 table isp2` |
| `ip rule add to RED table TABLA` | Regla por IP destino | `ip rule add to 172.16.0.0/12 table isp2` |
| `ip rule add fwmark N table TABLA` | Regla por marca firewall | `ip rule add fwmark 1 table isp2` |
| `ip rule del from RED table TABLA` | Eliminar regla | `ip rule del from 10.0.1.0/24 table isp2` |

## VLANs

| Comando | Funcion | Ejemplo |
|---|---|---|
| `ip link add link IF name IF.VID type vlan id VID` | Crear VLAN | `ip link add link eth0 name eth0.100 type vlan id 100` |
| `ip link delete IF.VID` | Eliminar VLAN | `ip link delete eth0.100` |
| `modprobe 8021q` | Cargar modulo de VLANs | `modprobe 8021q` |
| `cat /proc/net/vlan/config` | Ver VLANs configuradas | `cat /proc/net/vlan/config` |

## Bridges

| Comando | Funcion | Ejemplo |
|---|---|---|
| `ip link add name BR type bridge` | Crear bridge | `ip link add name br0 type bridge` |
| `ip link set IF master BR` | Agregar interfaz al bridge | `ip link set eth0 master br0` |
| `ip link set IF nomaster` | Retirar interfaz del bridge | `ip link set eth0 nomaster` |
| `ip link delete BR` | Eliminar bridge | `ip link delete br0` |
| `bridge link show` | Ver interfaces del bridge | `bridge link show` |
| `bridge fdb show` | Ver tabla MAC del bridge | `bridge fdb show` |
| `brctl show` | Ver bridges (legacy) | `brctl show` |
| `brctl addbr BR` | Crear bridge (legacy) | `brctl addbr br0` |
| `brctl addif BR IF` | Agregar interfaz (legacy) | `brctl addif br0 eth0` |
| `brctl stp BR on` | Activar STP (legacy) | `brctl stp br0 on` |

## Tunneling

| Comando | Funcion | Ejemplo |
|---|---|---|
| `ip tunnel add NAME mode gre remote IP local IP` | Crear tunel GRE | `ip tunnel add gre1 mode gre remote 203.0.113.1 local 198.51.100.1` |
| `ip tunnel add NAME mode sit remote IP local IP` | Crear tunel SIT (6in4) | `ip tunnel add sit1 mode sit remote 203.0.113.1 local 198.51.100.1` |
| `ip tunnel add NAME mode ipip remote IP local IP` | Crear tunel IPIP | `ip tunnel add tun1 mode ipip remote 203.0.113.1 local 198.51.100.1` |
| `ip tunnel del NAME` | Eliminar tunel | `ip tunnel del gre1` |
| `ip tunnel show` | Ver tuneles activos | `ip tunnel show` |

## Traffic Control (tc)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `tc qdisc show dev IF` | Ver qdiscs configuradas | `tc qdisc show dev eth0` |
| `tc qdisc add dev IF root tbf rate R burst B latency L` | Limitar ancho de banda | `tc qdisc add dev eth0 root tbf rate 1mbit burst 32kbit latency 400ms` |
| `tc qdisc add dev IF root netem delay T` | Simular latencia | `tc qdisc add dev eth0 root netem delay 100ms` |
| `tc qdisc add dev IF root netem loss P` | Simular perdida | `tc qdisc add dev eth0 root netem loss 10%` |
| `tc qdisc del dev IF root` | Eliminar toda config tc | `tc qdisc del dev eth0 root` |
| `tc class show dev IF` | Ver clases de trafico | `tc class show dev eth0` |
| `tc filter show dev IF` | Ver filtros de trafico | `tc filter show dev eth0` |

## IPv6

| Comando | Funcion | Ejemplo |
|---|---|---|
| `ip -6 addr show` | Ver direcciones IPv6 | `ip -6 addr show` |
| `ip -6 addr add ADDR dev IF` | Asignar direccion IPv6 | `ip -6 addr add 2001:db8::1/64 dev eth0` |
| `ip -6 route show` | Ver rutas IPv6 | `ip -6 route show` |
| `ip -6 route add RED via GW` | Agregar ruta IPv6 | `ip -6 route add 2001:db8:2::/48 via 2001:db8::ffff` |
| `ip -6 neigh show` | Ver vecinos IPv6 (NDP) | `ip -6 neigh show` |

## IP Forwarding

| Comando | Funcion | Ejemplo |
|---|---|---|
| `sysctl net.ipv4.ip_forward` | Ver estado de forwarding IPv4 | `sysctl net.ipv4.ip_forward` |
| `sysctl -w net.ipv4.ip_forward=1` | Habilitar forwarding (temporal) | `sysctl -w net.ipv4.ip_forward=1` |
| `sysctl -p` | Aplicar cambios de sysctl.conf | `sysctl -p` |

## Archivos y rutas importantes

| Archivo/Ruta | Funcion |
|---|---|
| `/proc/sys/net/ipv4/ip_forward` | Estado del reenvio IPv4 |
| `/proc/sys/net/ipv6/conf/all/forwarding` | Estado del reenvio IPv6 |
| `/etc/sysctl.conf` | Configuracion persistente de parametros del kernel |
| `/etc/sysctl.d/*.conf` | Configuraciones adicionales de sysctl |
| `/etc/iproute2/rt_tables` | Definicion de tablas de enrutamiento |
| `/proc/net/vlan/config` | VLANs configuradas |
| `/proc/sys/net/ipv4/conf/all/rp_filter` | Reverse Path Filtering (anti-spoofing) |
| `/proc/sys/net/ipv4/conf/all/accept_redirects` | Aceptar ICMP redirects |
