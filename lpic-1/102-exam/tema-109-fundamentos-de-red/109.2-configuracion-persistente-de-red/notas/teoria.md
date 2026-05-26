# 109.2 Configuracion persistente de red - Teoria

## Configuracion del nombre de host

### `/etc/hostname`
Contiene el nombre de host estatico del sistema (una sola linea).
```
mi-servidor
```

### `hostnamectl` (systemd)
```bash
hostnamectl                             # Mostrar informacion del hostname
hostnamectl set-hostname mi-servidor    # Establecer hostname
hostnamectl set-hostname "Mi Servidor" --pretty  # Hostname descriptivo
```

Tipos de hostname:
- **static**: Nombre persistente (almacenado en `/etc/hostname`)
- **transient**: Nombre temporal asignado por DHCP o mDNS
- **pretty**: Nombre descriptivo con caracteres especiales

### `hostname` (comando tradicional)
```bash
hostname                    # Mostrar hostname actual
hostname mi-servidor        # Establecer temporalmente (no persiste)
hostname -f                 # FQDN (fully qualified domain name)
hostname -i                 # Direccion IP del hostname
```

---

## `/etc/hosts`

Archivo de resolucion estatica de nombres. Se consulta **antes** que DNS (segun `/etc/nsswitch.conf`).

### Formato
```
IP_ADDRESS    FQDN    ALIAS
```

### Ejemplo
```
127.0.0.1       localhost
127.0.1.1       mi-servidor.ejemplo.com    mi-servidor
192.168.1.10    servidor-web.ejemplo.com   web
192.168.1.20    servidor-db.ejemplo.com    db
::1             localhost ip6-localhost ip6-loopback
```

---

## `/etc/nsswitch.conf`

Define el **orden de busqueda** para distintas bases de datos del sistema, incluyendo la resolucion de nombres.

```
passwd:     files systemd
group:      files systemd
shadow:     files
hosts:      files dns myhostname
networks:   files
```

La linea clave para resolucion de nombres:
```
hosts:      files dns myhostname
```

Esto significa:
1. Primero buscar en **files** (`/etc/hosts`)
2. Luego consultar **DNS** (`/etc/resolv.conf`)
3. Finalmente **myhostname** (resuelve el hostname local)

---

## `/etc/resolv.conf`

Configuracion de los servidores DNS del cliente.

```
# Servidor DNS primario
nameserver 192.168.1.1
# Servidor DNS secundario
nameserver 8.8.8.8
# Servidor DNS terciario (maximo 3)
nameserver 8.8.4.4

# Dominio local
domain ejemplo.com

# Lista de busqueda (alternativa a domain)
search ejemplo.com test.ejemplo.com

# Opciones
options timeout:2 attempts:3
```

| Directiva | Descripcion |
|-----------|-------------|
| `nameserver` | IP del servidor DNS (maximo 3) |
| `domain` | Dominio local por defecto |
| `search` | Lista de dominios para busqueda (se agrega automaticamente) |
| `options` | Opciones adicionales (timeout, intentos) |

> **Nota**: `domain` y `search` son mutuamente excluyentes; si ambos estan presentes, se usa el ultimo.

> **Importante**: En sistemas con NetworkManager o systemd-resolved, este archivo puede ser generado automaticamente. No editar manualmente si esta gestionado por otro servicio.

---

## Comando `ip` (iproute2)

Herramienta moderna para configuracion de red. Reemplaza a `ifconfig`, `route`, `arp`.

### ip addr (direcciones)
```bash
ip addr show                    # Mostrar todas las interfaces y direcciones
ip addr show eth0               # Mostrar direccion de eth0
ip a                            # Abreviatura de ip addr show
ip addr add 192.168.1.100/24 dev eth0        # Agregar direccion IP
ip addr del 192.168.1.100/24 dev eth0        # Eliminar direccion IP
```

### ip link (interfaces)
```bash
ip link show                    # Mostrar todas las interfaces
ip link set eth0 up             # Activar interfaz
ip link set eth0 down           # Desactivar interfaz
ip -s link show eth0            # Estadisticas de la interfaz
```

### ip route (rutas)
```bash
ip route show                   # Mostrar tabla de rutas
ip route                        # Igual (abreviatura)
ip r                            # Igual (abreviatura minima)
ip route add 10.0.0.0/8 via 192.168.1.1           # Agregar ruta
ip route add default via 192.168.1.1                # Ruta por defecto
ip route del 10.0.0.0/8 via 192.168.1.1            # Eliminar ruta
ip route add 10.0.0.0/8 via 192.168.1.1 dev eth0   # Ruta con interfaz
```

### ip neigh (vecinos/ARP)
```bash
ip neigh show                   # Mostrar tabla ARP
ip neigh                        # Abreviatura
```

---

## `ifconfig` (legacy - net-tools)

```bash
ifconfig                        # Mostrar interfaces activas
ifconfig -a                     # Mostrar todas las interfaces
ifconfig eth0                   # Info de una interfaz
ifconfig eth0 192.168.1.100 netmask 255.255.255.0 up    # Configurar
ifconfig eth0 down              # Desactivar
ifconfig eth0 up                # Activar
```

> `ifconfig` esta **deprecado**. Se recomienda usar `ip` en su lugar.

---

## `route` (legacy)

```bash
route -n                        # Mostrar tabla de rutas (numerico)
route add default gw 192.168.1.1              # Agregar gateway
route add -net 10.0.0.0 netmask 255.0.0.0 gw 192.168.1.1  # Agregar ruta
route del default gw 192.168.1.1              # Eliminar gateway
```

> `route` esta **deprecado**. Se recomienda usar `ip route` en su lugar.

---

## NetworkManager

### Descripcion
- Gestor de red predeterminado en la mayoria de distribuciones de escritorio
- Demonio: `NetworkManager`
- Gestiona conexiones cableadas, Wi-Fi, VPN, etc.
- Configuraciones en `/etc/NetworkManager/`

### `nmcli` (linea de comandos)
```bash
# Estado general
nmcli general status                 # Estado del NetworkManager
nmcli device status                  # Estado de dispositivos
nmcli connection show                # Listar conexiones

# Ver detalles de una conexion
nmcli connection show "Conexion cableada 1"

# Crear conexion estatica
nmcli connection add type ethernet con-name mi-red ifname eth0 \
    ip4 192.168.1.100/24 gw4 192.168.1.1

# Establecer DNS
nmcli connection modify mi-red ipv4.dns "8.8.8.8 8.8.4.4"

# Activar/desactivar conexion
nmcli connection up mi-red
nmcli connection down mi-red

# Eliminar conexion
nmcli connection delete mi-red

# Wi-Fi
nmcli device wifi list               # Listar redes Wi-Fi
nmcli device wifi connect MiRed password "clave123"
```

### `nmtui` (interfaz de texto)
- Interfaz grafica basada en ncurses para terminal
- Permite editar conexiones, activar/desactivar, establecer hostname
```bash
nmtui
```

---

## systemd-networkd

### Descripcion
- Gestor de red de systemd (preferido en servidores y contenedores)
- Archivos de configuracion en `/etc/systemd/network/`
- Extension `.network`

### Ejemplo de configuracion estatica
Archivo `/etc/systemd/network/20-wired.network`:
```ini
[Match]
Name=eth0

[Network]
Address=192.168.1.100/24
Gateway=192.168.1.1
DNS=8.8.8.8
DNS=8.8.4.4
```

### Ejemplo con DHCP
Archivo `/etc/systemd/network/20-wired.network`:
```ini
[Match]
Name=eth0

[Network]
DHCP=yes
```

### Gestionar el servicio
```bash
systemctl enable systemd-networkd
systemctl start systemd-networkd
networkctl list                      # Listar interfaces
networkctl status eth0               # Estado de interfaz
```

---

## Configuracion por distribucion

### Debian/Ubuntu: `/etc/network/interfaces`
```
# Loopback
auto lo
iface lo inet loopback

# Interfaz con DHCP
auto eth0
iface eth0 inet dhcp

# Interfaz estatica
auto eth0
iface eth0 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 8.8.4.4
```

Gestionar:
```bash
ifup eth0                # Activar interfaz
ifdown eth0              # Desactivar interfaz
systemctl restart networking
```

### RHEL/CentOS: `/etc/sysconfig/network-scripts/`
Archivo `ifcfg-eth0`:
```
TYPE=Ethernet
BOOTPROTO=static
NAME=eth0
DEVICE=eth0
ONBOOT=yes
IPADDR=192.168.1.100
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=8.8.8.8
DNS2=8.8.4.4
```

Rutas estaticas en `route-eth0`:
```
10.0.0.0/8 via 192.168.1.1
172.16.0.0/12 via 192.168.1.1
```

---

## Rutas estaticas

### Agregar rutas temporales
```bash
ip route add 10.0.0.0/8 via 192.168.1.1 dev eth0
ip route add default via 192.168.1.1
```

### Rutas persistentes
- **Debian**: En `/etc/network/interfaces` con `up ip route add ...`
- **RHEL**: En `/etc/sysconfig/network-scripts/route-eth0`
- **NetworkManager**: `nmcli connection modify mi-red +ipv4.routes "10.0.0.0/8 192.168.1.1"`
- **systemd-networkd**: Seccion `[Route]` en archivos `.network`

---

## Puntos clave para el examen

1. **`/etc/hostname`** contiene el hostname estatico; **`hostnamectl`** lo gestiona en systemd
2. **`/etc/hosts`** resuelve nombres localmente; se consulta antes que DNS (segun nsswitch)
3. **`/etc/nsswitch.conf`** define el orden: `hosts: files dns` (primero /etc/hosts, luego DNS)
4. **`/etc/resolv.conf`** define servidores DNS (maximo 3 `nameserver`)
5. **`ip`** reemplaza a `ifconfig`, `route` y `arp`
6. **`nmcli`** es la herramienta CLI de NetworkManager; **`nmtui`** es la version TUI
7. **systemd-networkd** usa archivos `.network` en `/etc/systemd/network/`
8. Debian usa `/etc/network/interfaces`; RHEL usa `/etc/sysconfig/network-scripts/`
9. **`ip route add default via IP`** establece la ruta por defecto
10. Las configuraciones con `ip`/`ifconfig` son **temporales**; para persistir se usan archivos de configuracion
