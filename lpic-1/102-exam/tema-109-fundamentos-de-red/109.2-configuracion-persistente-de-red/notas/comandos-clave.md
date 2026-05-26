# 109.2 Configuracion persistente de red - Comandos clave

## Hostname

| Comando | Descripcion |
|---------|-------------|
| `hostnamectl` | Mostrar informacion del hostname |
| `hostnamectl set-hostname nombre` | Establecer hostname persistente |
| `hostname` | Mostrar hostname actual |
| `hostname -f` | Mostrar FQDN |

## ip (iproute2) - Moderno

| Comando | Descripcion |
|---------|-------------|
| `ip addr show` / `ip a` | Mostrar interfaces y direcciones |
| `ip addr add 192.168.1.100/24 dev eth0` | Agregar IP |
| `ip addr del 192.168.1.100/24 dev eth0` | Eliminar IP |
| `ip link show` | Mostrar interfaces |
| `ip link set eth0 up` | Activar interfaz |
| `ip link set eth0 down` | Desactivar interfaz |
| `ip route show` / `ip r` | Mostrar tabla de rutas |
| `ip route add default via 192.168.1.1` | Agregar ruta por defecto |
| `ip route add 10.0.0.0/8 via 192.168.1.1` | Agregar ruta estatica |
| `ip route del 10.0.0.0/8` | Eliminar ruta |
| `ip neigh show` | Mostrar tabla ARP |

## ifconfig / route (legacy)

| Comando | Descripcion |
|---------|-------------|
| `ifconfig` | Mostrar interfaces activas |
| `ifconfig -a` | Mostrar todas las interfaces |
| `ifconfig eth0 192.168.1.100 netmask 255.255.255.0 up` | Configurar IP |
| `route -n` | Mostrar tabla de rutas |
| `route add default gw 192.168.1.1` | Agregar gateway |

## NetworkManager (nmcli)

| Comando | Descripcion |
|---------|-------------|
| `nmcli general status` | Estado general |
| `nmcli device status` | Estado de dispositivos |
| `nmcli connection show` | Listar conexiones |
| `nmcli connection add type ethernet con-name X ifname eth0 ip4 IP/MASK gw4 GW` | Crear conexion |
| `nmcli connection modify X ipv4.dns "8.8.8.8"` | Establecer DNS |
| `nmcli connection up X` | Activar conexion |
| `nmcli connection down X` | Desactivar conexion |
| `nmcli connection delete X` | Eliminar conexion |
| `nmtui` | Interfaz TUI |

## Archivos de configuracion

| Archivo | Descripcion |
|---------|-------------|
| `/etc/hostname` | Nombre del host |
| `/etc/hosts` | Resolucion estatica de nombres |
| `/etc/nsswitch.conf` | Orden de busqueda (files, dns, etc.) |
| `/etc/resolv.conf` | Servidores DNS (nameserver, domain, search) |
| `/etc/network/interfaces` | Config de red (Debian) |
| `/etc/sysconfig/network-scripts/ifcfg-*` | Config de red (RHEL) |
| `/etc/sysconfig/network-scripts/route-*` | Rutas estaticas (RHEL) |
| `/etc/systemd/network/*.network` | Config de systemd-networkd |
| `/etc/NetworkManager/` | Config de NetworkManager |

## Equivalencia comandos legacy vs modernos

| Legacy | Moderno |
|--------|---------|
| `ifconfig` | `ip addr`, `ip link` |
| `route` | `ip route` |
| `arp` | `ip neigh` |
| `netstat` | `ss` |
