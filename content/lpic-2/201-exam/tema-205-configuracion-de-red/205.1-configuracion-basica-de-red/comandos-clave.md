---
title: "205.1 - Configuracion basica de red"
tags: [lpic-2, examen-201, tema-205, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "205"
subtema: "205.1"
---

# 205.1 - Comandos clave: Configuracion basica de red

## Comando ip (iproute2)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `ip addr show` | Ver direcciones IP de todas las interfaces | `ip a` |
| `ip addr add IP/MASK dev IF` | Asignar direccion IP | `ip addr add 192.168.1.100/24 dev eth0` |
| `ip addr del IP/MASK dev IF` | Eliminar direccion IP | `ip addr del 192.168.1.100/24 dev eth0` |
| `ip addr flush dev IF` | Eliminar todas las IPs de una interfaz | `ip addr flush dev eth0` |
| `ip link show` | Ver estado de las interfaces | `ip l` |
| `ip link set IF up/down` | Activar/desactivar interfaz | `ip link set eth0 up` |
| `ip link set IF mtu N` | Cambiar MTU | `ip link set eth0 mtu 9000` |
| `ip route show` | Ver tabla de enrutamiento | `ip r` |
| `ip route add default via IP` | Agregar ruta por defecto | `ip route add default via 192.168.1.1` |
| `ip route add RED via IP` | Agregar ruta a una red | `ip route add 10.0.0.0/8 via 192.168.1.254` |
| `ip route del RED` | Eliminar una ruta | `ip route del 10.0.0.0/8` |
| `ip neigh show` | Ver tabla ARP/vecinos | `ip n` |
| `ip -s link show` | Ver estadisticas de interfaces | `ip -s link show eth0` |

## Equivalencias legacy vs moderno

| Legacy (obsoleto) | Moderno (iproute2) | Funcion |
|---|---|---|
| `ifconfig` | `ip addr` / `ip link` | Configurar interfaces |
| `ifconfig -a` | `ip addr show` | Listar interfaces |
| `route -n` | `ip route show` | Ver tabla de rutas |
| `route add default gw IP` | `ip route add default via IP` | Agregar gateway |
| `arp -a` | `ip neigh show` | Ver tabla ARP |
| `netstat` | `ss` | Ver conexiones de red |

## Comandos de NetworkManager (nmcli)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `nmcli general status` | Estado general de la red | `nmcli general status` |
| `nmcli device status` | Estado de los dispositivos | `nmcli device status` |
| `nmcli connection show` | Listar conexiones | `nmcli con show` |
| `nmcli connection show --active` | Listar conexiones activas | `nmcli con show --active` |
| `nmcli connection add` | Crear nueva conexion | `nmcli con add type ethernet con-name red1 ifname eth0` |
| `nmcli connection modify` | Modificar conexion | `nmcli con modify red1 ipv4.dns "8.8.8.8"` |
| `nmcli connection up NOMBRE` | Activar conexion | `nmcli con up red1` |
| `nmcli connection down NOMBRE` | Desactivar conexion | `nmcli con down red1` |
| `nmcli connection delete NOMBRE` | Eliminar conexion | `nmcli con delete red1` |
| `nmcli connection reload` | Recargar archivos de configuracion | `nmcli con reload` |

## Comandos de hostname

| Comando | Funcion | Ejemplo |
|---|---|---|
| `hostnamectl` | Ver hostname y metadatos del sistema | `hostnamectl` |
| `hostnamectl set-hostname NOMBRE` | Establecer hostname persistente | `hostnamectl set-hostname servidor01` |
| `hostname` | Ver hostname actual | `hostname` |
| `hostname -f` | Ver FQDN | `hostname -f` |

## Archivos de configuracion importantes

| Archivo | Funcion |
|---|---|
| `/etc/hostname` | Hostname estatico del sistema |
| `/etc/hosts` | Resolucion local de nombres |
| `/etc/resolv.conf` | Configuracion de servidores DNS |
| `/etc/nsswitch.conf` | Orden de resolucion de nombres |
| `/etc/sysconfig/network-scripts/ifcfg-*` | Config de interfaces (RHEL/CentOS) |
| `/etc/network/interfaces` | Config de interfaces (Debian/Ubuntu) |
| `/etc/systemd/network/*.network` | Config de systemd-networkd |
| `/etc/NetworkManager/` | Directorio de configuracion de NM |
| `/proc/net/bonding/bondX` | Estado de interfaces bonding |

## Parametros clave de ifcfg-* (RHEL)

| Parametro | Valor | Descripcion |
|---|---|---|
| `BOOTPROTO` | `none` / `dhcp` | Protocolo de arranque |
| `ONBOOT` | `yes` / `no` | Activar al inicio |
| `IPADDR` | `192.168.1.100` | Direccion IP |
| `PREFIX` | `24` | Longitud del prefijo |
| `GATEWAY` | `192.168.1.1` | Puerta de enlace |
| `DNS1` | `8.8.8.8` | Servidor DNS primario |
| `DEFROUTE` | `yes` / `no` | Ruta por defecto |
| `TYPE` | `Ethernet` / `Bond` / `Bridge` | Tipo de interfaz |

## Directivas de /etc/resolv.conf

| Directiva | Descripcion | Ejemplo |
|---|---|---|
| `nameserver` | Servidor DNS (max 3) | `nameserver 8.8.8.8` |
| `domain` | Dominio de busqueda por defecto | `domain empresa.com` |
| `search` | Lista de dominios de busqueda | `search empresa.com dev.empresa.com` |
| `options` | Opciones del resolver | `options timeout:2 attempts:3` |

## Modos de bonding

| Modo | Nombre | Descripcion |
|---|---|---|
| 0 | balance-rr | Round-robin |
| 1 | active-backup | Failover activo-pasivo |
| 2 | balance-xor | XOR de direcciones |
| 3 | broadcast | Transmision a todas |
| 4 | 802.3ad | LACP (requiere switch) |
| 5 | balance-tlb | Balanceo de transmision |
| 6 | balance-alb | Balanceo adaptativo |
