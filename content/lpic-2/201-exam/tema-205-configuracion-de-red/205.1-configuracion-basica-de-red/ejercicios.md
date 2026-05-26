---
title: "205.1 - Configuracion basica de red"
tags: [lpic-2, examen-201, tema-205, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "205"
subtema: "205.1"
---

# 205.1 - Ejercicios: Configuracion basica de red

### Pregunta 1
Que comando moderno reemplaza a `ifconfig` para mostrar las direcciones IP de todas las interfaces?

a) `ip config show`
b) `ip addr show`
c) `ip interface list`
d) `netstat -i`

<details>
<summary>Respuesta</summary>

**b) `ip addr show`**

El comando `ip addr show` (o su forma abreviada `ip a`) del paquete iproute2 es el reemplazo moderno de `ifconfig`. Muestra todas las interfaces de red con sus direcciones IP, mascaras de red, direcciones MAC y otros atributos. `ifconfig` esta deprecado y puede no estar instalado por defecto en distribuciones modernas.
</details>

---

### Pregunta 2
En un archivo `/etc/sysconfig/network-scripts/ifcfg-eth0` de RHEL, que valor debe tener `BOOTPROTO` para configurar una IP estatica?

a) `static`
b) `manual`
c) `none`
d) `fixed`

<details>
<summary>Respuesta</summary>

**c) `none`**

En los archivos ifcfg de RHEL/CentOS, `BOOTPROTO=none` indica que no se usa ningun protocolo automatico de asignacion, lo que equivale a una configuracion estatica. Los valores validos son `none` (estatica), `dhcp` (cliente DHCP) y `bootp` (protocolo BOOTP). No se usa `static` como valor, a pesar de ser intuitivo.
</details>

---

### Pregunta 3
Que comando establece el hostname de forma persistente en un sistema con systemd?

a) `hostname servidor01`
b) `echo "servidor01" > /etc/hostname`
c) `hostnamectl set-hostname servidor01`
d) `sysctl hostname=servidor01`

<details>
<summary>Respuesta</summary>

**c) `hostnamectl set-hostname servidor01`**

El comando `hostnamectl set-hostname` es la forma recomendada de establecer el hostname en sistemas con systemd. Modifica automaticamente `/etc/hostname` y actualiza el hostname activo en el kernel. La opcion b) modifica el archivo pero no aplica el cambio inmediatamente. La opcion a) solo cambia el hostname de forma transitoria (hasta el reinicio).
</details>

---

### Pregunta 4
Cual es el numero maximo de directivas `nameserver` que se pueden definir en `/etc/resolv.conf`?

a) 1
b) 2
c) 3
d) Sin limite

<details>
<summary>Respuesta</summary>

**c) 3**

El archivo `/etc/resolv.conf` admite un maximo de 3 directivas `nameserver`. Si se especifican mas, las adicionales son ignoradas por el resolver. Los servidores DNS se consultan en orden: si el primero no responde dentro del timeout, se intenta con el segundo, y luego con el tercero.
</details>

---

### Pregunta 5
Que comando de nmcli crea una nueva conexion Ethernet con IP estatica en la interfaz eth0?

a) `nmcli device add eth0 ipv4.addresses 192.168.1.100/24`
b) `nmcli connection add type ethernet con-name red1 ifname eth0 ipv4.addresses 192.168.1.100/24 ipv4.method manual`
c) `nmcli interface create eth0 ip 192.168.1.100/24`
d) `nmcli network add static eth0 192.168.1.100/24`

<details>
<summary>Respuesta</summary>

**b) `nmcli connection add type ethernet con-name red1 ifname eth0 ipv4.addresses 192.168.1.100/24 ipv4.method manual`**

El comando `nmcli connection add` crea una nueva conexion. Se necesita: `type ethernet` (tipo de conexion), `con-name` (nombre de la conexion), `ifname` (interfaz fisica), `ipv4.addresses` (IP con prefijo) y `ipv4.method manual` (para indicar configuracion estatica en lugar de DHCP).
</details>

---

### Pregunta 6
En que directorio se almacenan los archivos de configuracion de red de systemd-networkd?

a) `/etc/networkd/`
b) `/etc/systemd/network/`
c) `/etc/network/systemd/`
d) `/lib/systemd/network-config/`

<details>
<summary>Respuesta</summary>

**b) `/etc/systemd/network/`**

Los archivos de configuracion de systemd-networkd se encuentran en `/etc/systemd/network/`. Utilizan la extension `.network` para configuracion de redes, `.netdev` para dispositivos virtuales y `.link` para propiedades de enlaces. Los archivos se procesan en orden alfanumerico, por lo que es comun usar prefijos numericos (como `20-wired.network`).
</details>

---

### Pregunta 7
Que modo de bonding proporciona failover activo-pasivo sin requerir configuracion especial en el switch?

a) mode=0 (balance-rr)
b) mode=1 (active-backup)
c) mode=4 (802.3ad)
d) mode=3 (broadcast)

<details>
<summary>Respuesta</summary>

**b) mode=1 (active-backup)**

El modo 1 (active-backup) mantiene solo una interfaz activa a la vez. Si la interfaz activa falla, otra esclava toma el control automaticamente. No requiere ninguna configuracion especial en el switch de red, lo que lo hace el modo mas sencillo de implementar. El modo 4 (802.3ad/LACP) requiere soporte del switch para agregacion de enlaces.
</details>

---

### Pregunta 8
Que archivo determina el orden en que se consultan las fuentes de resolucion de nombres (como `/etc/hosts` y DNS)?

a) `/etc/resolv.conf`
b) `/etc/host.conf`
c) `/etc/nsswitch.conf`
d) `/etc/dns.conf`

<details>
<summary>Respuesta</summary>

**c) `/etc/nsswitch.conf`**

El archivo `/etc/nsswitch.conf` (Name Service Switch) controla el orden de busqueda para varios servicios del sistema, incluyendo la resolucion de nombres de host. La linea `hosts: files dns` indica que primero se consulta `/etc/hosts` (files) y luego los servidores DNS. `/etc/resolv.conf` solo define los servidores DNS, no el orden de consulta.
</details>

---

### Pregunta 9
Un administrador ejecuta `ip route add 10.0.0.0/8 via 192.168.1.254`. Que efecto tiene este comando?

a) Cambia la puerta de enlace predeterminada a 192.168.1.254
b) Agrega una ruta para alcanzar la red 10.0.0.0/8 a traves del gateway 192.168.1.254
c) Crea un tunel hacia la red 10.0.0.0/8
d) Asigna la direccion 10.0.0.0 a la interfaz con IP 192.168.1.254

<details>
<summary>Respuesta</summary>

**b) Agrega una ruta para alcanzar la red 10.0.0.0/8 a traves del gateway 192.168.1.254**

El comando agrega una ruta estatica a la tabla de enrutamiento, indicando que todo el trafico destinado a la red 10.0.0.0/8 (direcciones 10.x.x.x) debe enviarse al router 192.168.1.254. Esta ruta es temporal (se pierde al reiniciar) a menos que se persista en los archivos de configuracion de red.
</details>

---

### Pregunta 10
Que seccion del archivo de configuracion de systemd-networkd define a que interfaz se aplica la configuracion?

a) `[Interface]`
b) `[Match]`
c) `[Device]`
d) `[Link]`

<details>
<summary>Respuesta</summary>

**b) `[Match]`**

En los archivos `.network` de systemd-networkd, la seccion `[Match]` determina a que interfaces se aplica la configuracion, usando criterios como `Name=eth0`, `MACAddress=`, `Type=`, etc. La seccion `[Network]` contiene la configuracion de red propiamente dicha (IP, gateway, DNS). Si no hay seccion `[Match]`, la configuracion se aplica a todas las interfaces.
</details>

---
