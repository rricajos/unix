---
title: "109.2 Configuracion persistente de red - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-109
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "109"
subtema: "109.2"
---

# 109.2 Configuracion persistente de red - Ejercicios

### Pregunta 1

Cual de los siguientes comandos es el reemplazo moderno (iproute2) de `ifconfig`?

a) `ip config`
b) `ip addr`
c) `netctl`
d) `ifup`

<details><summary>Respuesta</summary>

**b) `ip addr`**

El comando `ip addr` (o `ip addr show`) del paquete iproute2 es el reemplazo moderno de `ifconfig` para mostrar y configurar direcciones IP en interfaces de red. Otras equivalencias son: `route` -> `ip route`, `arp` -> `ip neigh`, `ifconfig` -> `ip link show` / `ip addr show`. El paquete `net-tools` (que incluye ifconfig, route, arp) esta deprecado.

</details>

---

### Pregunta 2

Que significa la linea `hosts: files dns myhostname` en `/etc/nsswitch.conf`?

a) Solo se pueden resolver nombres mediante DNS y archivos locales
b) Primero se busca en `/etc/hosts`, luego en DNS y finalmente se resuelve el hostname local
c) Se consulta DNS primero y si no responde se busca en archivos locales
d) Se utilizan los tres metodos simultaneamente y se devuelve el primer resultado

<details><summary>Respuesta</summary>

**b) Primero se busca en `/etc/hosts`, luego en DNS y finalmente se resuelve el hostname local**

La linea `hosts: files dns myhostname` en `/etc/nsswitch.conf` define el orden de busqueda para resolver nombres de host: 1) `files` busca primero en `/etc/hosts`, 2) `dns` consulta los servidores DNS definidos en `/etc/resolv.conf`, 3) `myhostname` resuelve el nombre del propio host como ultimo recurso. Esto significa que las entradas en `/etc/hosts` tienen prioridad sobre las respuestas DNS.

</details>

---

### Pregunta 3

Cuantos servidores DNS se pueden definir como maximo en `/etc/resolv.conf`?

a) 1
b) 2
c) 3
d) Ilimitados

<details><summary>Respuesta</summary>

**c) 3**

El archivo `/etc/resolv.conf` permite definir un maximo de 3 directivas `nameserver`, cada una con la IP de un servidor DNS. Si se necesitan mas, solo se usaran los 3 primeros. Las directivas `domain` y `search` son mutuamente excluyentes; si ambas estan presentes, se usa la ultima definida en el archivo.

</details>

---

### Pregunta 4

Un administrador configura una IP estatica con `ip addr add 192.168.1.50/24 dev eth0`. Que ocurre con esta configuracion al reiniciar el sistema?

a) Se mantiene porque el comando `ip` guarda la configuracion automaticamente
b) Se pierde porque las configuraciones con `ip` son temporales
c) Se mantiene si se ejecuto como root
d) Se mantiene solo si el servicio NetworkManager esta activo

<details><summary>Respuesta</summary>

**b) Se pierde porque las configuraciones con `ip` son temporales**

Las configuraciones realizadas con el comando `ip` (iproute2) e `ifconfig` (net-tools) son temporales y se pierden al reiniciar el sistema. Para hacer la configuracion persistente se deben usar los archivos de configuracion de la distribucion: `/etc/network/interfaces` (Debian clasico), archivos en `/etc/sysconfig/network-scripts/` (RHEL), archivos `.network` en `/etc/systemd/network/` (systemd-networkd), `nmcli` (NetworkManager) o archivos YAML en `/etc/netplan/` (Ubuntu moderno).

</details>

---

### Pregunta 5

Como se crea una conexion de red con IP estatica usando `nmcli` de NetworkManager?

a) `nmcli device add ethernet ip4 192.168.1.100/24`
b) `nmcli connection add type ethernet con-name mi-red ifname eth0 ip4 192.168.1.100/24 gw4 192.168.1.1`
c) `nmcli set eth0 address 192.168.1.100/24 gateway 192.168.1.1`
d) `nmcli interface configure eth0 static 192.168.1.100/24`

<details><summary>Respuesta</summary>

**b) `nmcli connection add type ethernet con-name mi-red ifname eth0 ip4 192.168.1.100/24 gw4 192.168.1.1`**

La sintaxis correcta de `nmcli` para crear una conexion estatica incluye: `connection add` (accion), `type ethernet` (tipo de conexion), `con-name` (nombre de la conexion), `ifname` (interfaz de red), `ip4` (direccion IP con mascara) y `gw4` (gateway). Despues se puede configurar DNS con `nmcli connection modify mi-red ipv4.dns "8.8.8.8"` y activar con `nmcli connection up mi-red`.

</details>

---

### Pregunta 6

Cual es el archivo de configuracion de red por interfaz en sistemas RHEL/CentOS?

a) `/etc/network/interfaces`
b) `/etc/sysconfig/network-scripts/ifcfg-eth0`
c) `/etc/systemd/network/eth0.network`
d) `/etc/netplan/01-netcfg.yaml`

<details><summary>Respuesta</summary>

**b) `/etc/sysconfig/network-scripts/ifcfg-eth0`**

En sistemas RHEL/CentOS, la configuracion de red por interfaz se realiza en archivos con formato `ifcfg-nombre` dentro del directorio `/etc/sysconfig/network-scripts/`. Estos archivos contienen directivas como `BOOTPROTO`, `IPADDR`, `NETMASK`, `GATEWAY`, `DNS1`, `ONBOOT`, etc. La opcion A corresponde a Debian clasico, la C a systemd-networkd y la D a Netplan (Ubuntu moderno).

</details>

---

### Pregunta 7

Como se configura systemd-networkd para que la interfaz eth0 obtenga su IP por DHCP?

a) Creando `/etc/systemd/network/eth0.conf` con `DHCP=yes`
b) Ejecutando `networkctl dhcp eth0`
c) Creando un archivo `.network` en `/etc/systemd/network/` con secciones `[Match]` y `[Network]` con `DHCP=yes`
d) Editando `/etc/systemd/networkd.conf` y agregando `Interface=eth0 DHCP=yes`

<details><summary>Respuesta</summary>

**c) Creando un archivo `.network` en `/etc/systemd/network/` con secciones `[Match]` y `[Network]` con `DHCP=yes`**

systemd-networkd usa archivos con extension `.network` en `/etc/systemd/network/`. El archivo debe contener al menos una seccion `[Match]` con `Name=eth0` para identificar la interfaz, y una seccion `[Network]` con `DHCP=yes` para habilitar DHCP. Despues se activa con `systemctl enable systemd-networkd && systemctl start systemd-networkd`. El estado se verifica con `networkctl status eth0`.

</details>

---

### Pregunta 8

Cual es el equivalente moderno de `route -n` para mostrar la tabla de rutas?

a) `ip route show`
b) `netstat -r`
c) `routectl list`
d) `networkctl routes`

<details><summary>Respuesta</summary>

**a) `ip route show`**

El comando `ip route show` (o abreviado `ip r`) es el reemplazo moderno de `route -n` para mostrar la tabla de rutas del sistema. `netstat -r` es otra forma legacy de ver la tabla de rutas (equivalente a `route -n`) pero tambien esta deprecada. Para agregar una ruta por defecto se usa `ip route add default via 192.168.1.1`. Los comandos `routectl` y `networkctl routes` no existen.

</details>

---

### Pregunta 9

Que comando de Netplan aplica los cambios de configuracion de red en Ubuntu moderno?

a) `netplan generate`
b) `netplan apply`
c) `netplan reload`
d) `netplan commit`

<details><summary>Respuesta</summary>

**b) `netplan apply`**

El comando `netplan apply` lee los archivos YAML de configuracion en `/etc/netplan/`, genera la configuracion del backend (NetworkManager o systemd-networkd) y la aplica inmediatamente. `netplan generate` solo genera la configuracion sin aplicarla. `netplan try` aplica la configuracion temporalmente y la revierte si no se confirma (util para evitar perder conectividad). Los comandos `netplan reload` y `netplan commit` no existen.

</details>

---

### Pregunta 10

Que comando se utiliza para establecer el hostname de forma persistente en un sistema con systemd?

a) `hostname mi-servidor`
b) `echo "mi-servidor" > /etc/hostname && reboot`
c) `hostnamectl set-hostname mi-servidor`
d) `sysctl hostname=mi-servidor`

<details><summary>Respuesta</summary>

**c) `hostnamectl set-hostname mi-servidor`**

`hostnamectl set-hostname` establece el hostname de forma persistente en sistemas con systemd, actualizando el archivo `/etc/hostname`. La opcion A (`hostname mi-servidor`) solo cambia el hostname temporalmente y se pierde al reiniciar. La opcion B funciona pero requiere un reinicio innecesario. `hostnamectl` tambien permite establecer un hostname descriptivo con `--pretty`. Los tipos de hostname son: static (persistente), transient (temporal) y pretty (descriptivo).

</details>
