---
title: "205.2 - Configuracion avanzada de red"
tags: [lpic-2, examen-201, tema-205, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "205"
subtema: "205.2"
---

# 205.2 - Ejercicios: Configuracion avanzada de red

### Pregunta 1
Que archivo debe modificarse para habilitar permanentemente el reenvio de paquetes IPv4 en un sistema Linux?

a) `/etc/network/forwarding`
b) `/proc/sys/net/ipv4/ip_forward`
c) `/etc/sysctl.conf`
d) `/etc/ip_forward.conf`

<details>
<summary>Respuesta</summary>

**c) `/etc/sysctl.conf`**

Para habilitar el reenvio de forma permanente, se agrega `net.ipv4.ip_forward = 1` en `/etc/sysctl.conf` (o en un archivo en `/etc/sysctl.d/`). El archivo `/proc/sys/net/ipv4/ip_forward` permite el cambio inmediato pero temporal (se pierde al reiniciar). Despues de editar sysctl.conf se aplican los cambios con `sysctl -p`.
</details>

---

### Pregunta 2
Que comando crea una interfaz VLAN con ID 200 sobre la interfaz eth0?

a) `vlan add eth0 200`
b) `ip link add link eth0 name eth0.200 type vlan id 200`
c) `ip vlan create eth0 id 200`
d) `nmcli vlan add eth0.200 id 200`

<details>
<summary>Respuesta</summary>

**b) `ip link add link eth0 name eth0.200 type vlan id 200`**

La sintaxis correcta usa `ip link add` con los parametros: `link` (interfaz padre), `name` (nombre de la subinterfaz VLAN), `type vlan` (tipo de dispositivo virtual) e `id` (identificador VLAN 802.1Q). Antes de crear VLANs, debe estar cargado el modulo del kernel `8021q` (`modprobe 8021q`).
</details>

---

### Pregunta 3
En el contexto de policy routing, que hace el comando `ip rule add from 10.0.1.0/24 table custom`?

a) Agrega una ruta hacia 10.0.1.0/24 en la tabla custom
b) Indica que el trafico originado en 10.0.1.0/24 use la tabla de enrutamiento custom
c) Bloquea el trafico de 10.0.1.0/24
d) Crea una nueva tabla de enrutamiento llamada custom

<details>
<summary>Respuesta</summary>

**b) Indica que el trafico originado en 10.0.1.0/24 use la tabla de enrutamiento custom**

Las reglas de politica (`ip rule`) determinan que tabla de enrutamiento se consulta para cada paquete. Esta regla establece que todo trafico con IP de origen en la red 10.0.1.0/24 sea enrutado usando la tabla "custom" en lugar de la tabla "main" por defecto. Esto permite tener diferentes gateways para diferentes redes de origen.
</details>

---

### Pregunta 4
Que comando de tc se utiliza para simular 100ms de latencia en una interfaz de red para pruebas?

a) `tc qdisc add dev eth0 root tbf delay 100ms`
b) `tc qdisc add dev eth0 root netem delay 100ms`
c) `tc latency add dev eth0 100ms`
d) `tc qdisc add dev eth0 root htb delay 100ms`

<details>
<summary>Respuesta</summary>

**b) `tc qdisc add dev eth0 root netem delay 100ms`**

La qdisc `netem` (Network Emulator) permite simular condiciones de red como latencia, perdida de paquetes, duplicacion y reordenamiento. Es especialmente util para pruebas. `tbf` sirve para limitar ancho de banda, y `htb` para control de ancho de banda jerarquico, pero ninguno de los dos simula latencia.
</details>

---

### Pregunta 5
Cual de las siguientes afirmaciones sobre las direcciones IPv6 link-local es correcta?

a) Son enrutables a traves de Internet
b) Comienzan con el prefijo fe80:: y se configuran automaticamente en cada interfaz
c) Solo se asignan manualmente por el administrador
d) Son equivalentes a las direcciones de broadcast en IPv4

<details>
<summary>Respuesta</summary>

**b) Comienzan con el prefijo fe80:: y se configuran automaticamente en cada interfaz**

Las direcciones link-local (fe80::/10) se generan automaticamente en cada interfaz de red IPv6 habilitada, sin necesidad de configuracion manual ni servidor DHCP. Son validas unicamente en el segmento de red local (no enrutables). Son esenciales para el funcionamiento de NDP (Neighbor Discovery Protocol) y la comunicacion local.
</details>

---

### Pregunta 6
Que comando crea un tunel GRE con IP remota 203.0.113.1 e IP local 198.51.100.1?

a) `ip link add gre1 type gre remote 203.0.113.1 local 198.51.100.1`
b) `ip tunnel add gre1 mode gre remote 203.0.113.1 local 198.51.100.1`
c) `ip route add tunnel gre remote 203.0.113.1 local 198.51.100.1`
d) `iptunnel create gre1 203.0.113.1 198.51.100.1`

<details>
<summary>Respuesta</summary>

**b) `ip tunnel add gre1 mode gre remote 203.0.113.1 local 198.51.100.1`**

El comando `ip tunnel add` crea un tunel especificando el nombre (`gre1`), el modo (`gre`), la IP remota del otro extremo (`remote`) y la IP local de este extremo (`local`). Tras crearlo, se necesita asignar una IP al tunel y activarlo con `ip link set gre1 up`. La opcion a) tambien podria funcionar en versiones recientes pero la forma canonica es `ip tunnel add`.
</details>

---

### Pregunta 7
Que protocolo reemplaza a ARP en IPv6 para la resolucion de direcciones de capa 2?

a) RARP (Reverse ARP)
b) NDP (Neighbor Discovery Protocol)
c) DHCPv6
d) ICMPv6 Echo

<details>
<summary>Respuesta</summary>

**b) NDP (Neighbor Discovery Protocol)**

NDP (Neighbor Discovery Protocol), definido en RFC 4861, reemplaza a ARP en IPv6. Utiliza mensajes ICMPv6 para la resolucion de direcciones (Neighbor Solicitation/Advertisement), descubrimiento de routers (Router Solicitation/Advertisement), deteccion de direcciones duplicadas (DAD) y redireccion. A diferencia de ARP que usa broadcast, NDP usa multicast.
</details>

---

### Pregunta 8
Un administrador necesita crear un bridge que conecte eth0 y eth1. Cual es la secuencia correcta de comandos?

a) `brctl addbr br0 && brctl addif br0 eth0 eth1 && ifconfig br0 up`
b) `ip link add name br0 type bridge && ip link set eth0 master br0 && ip link set eth1 master br0 && ip link set br0 up`
c) `nmcli bridge create br0 ports eth0,eth1`
d) `bridge create br0 members eth0 eth1`

<details>
<summary>Respuesta</summary>

**b) `ip link add name br0 type bridge && ip link set eth0 master br0 && ip link set eth1 master br0 && ip link set br0 up`**

La secuencia correcta con herramientas modernas (iproute2) es: crear el bridge con `ip link add type bridge`, agregar cada interfaz con `ip link set IF master br0`, y finalmente activar el bridge con `ip link set br0 up`. La opcion a) usa herramientas legacy (brctl) y la sintaxis de addif no acepta multiples interfaces a la vez.
</details>

---

### Pregunta 9
En que archivo se definen las tablas de enrutamiento personalizadas para su uso con policy routing?

a) `/etc/sysctl.conf`
b) `/etc/iproute2/rt_tables`
c) `/etc/routing/tables.conf`
d) `/proc/net/rt_tables`

<details>
<summary>Respuesta</summary>

**b) `/etc/iproute2/rt_tables`**

El archivo `/etc/iproute2/rt_tables` mapea numeros de tabla a nombres simbolicos. Las tablas predeterminadas son: 255 (local), 254 (main) y 253 (default). Para crear una tabla personalizada, se agrega una linea como `100 nombre_tabla`. Luego se pueden agregar rutas a esa tabla con `ip route add ... table nombre_tabla`.
</details>

---

### Pregunta 10
Que qdisc de tc se utiliza comunmente para limitar el ancho de banda de salida a una tasa fija?

a) `netem`
b) `sfq`
c) `tbf`
d) `pfifo_fast`

<details>
<summary>Respuesta</summary>

**c) `tbf`**

TBF (Token Bucket Filter) es la qdisc mas sencilla para limitar el ancho de banda de salida a una tasa fija. Funciona como un cubo de tokens: los paquetes solo se transmiten si hay tokens disponibles, y los tokens se reponen a la tasa configurada. Ejemplo: `tc qdisc add dev eth0 root tbf rate 1mbit burst 32kbit latency 400ms`. `netem` simula condiciones de red, `sfq` distribuye equitativamente y `pfifo_fast` es la qdisc por defecto.
</details>

---
