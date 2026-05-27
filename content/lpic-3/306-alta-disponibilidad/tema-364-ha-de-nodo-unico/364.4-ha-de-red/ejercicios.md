---
title: "364.4 - Ejercicios: HA de Red"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "364 - HA de Nodo Unico"
subtema: "364.4"
peso: 2
tags:
  - lpic-3
  - tema-364
  - ejercicios
  - bonding
  - teaming
  - vrrp
---

# 364.4 - Ejercicios: HA de Red

### Pregunta 1
¿Que modo de bonding proporciona redundancia activo/pasivo sin necesidad de configuracion especial en el switch?

a) mode 0 (balance-rr)
b) mode 1 (active-backup)
c) mode 4 (802.3ad)
d) mode 6 (balance-alb)

<details><summary>Respuesta</summary>

**b) mode 1 (active-backup)**

El modo 1 (active-backup) mantiene una interfaz activa y las demas en espera. No requiere ninguna configuracion especial en el switch, a diferencia de los modos 0, 2, 3 y 4.
</details>

### Pregunta 2
¿Que protocolo estandar IEEE usa el modo 4 de bonding?

a) STP (802.1d)
b) VLAN (802.1q)
c) LACP (802.3ad)
d) WPA (802.11i)

<details><summary>Respuesta</summary>

**c) LACP (802.3ad)**

El modo 4 de bonding implementa LACP (Link Aggregation Control Protocol) definido en el estandar IEEE 802.3ad. Requiere que el switch tambien soporte y tenga habilitado LACP.
</details>

### Pregunta 3
¿Que herramienta se usa para ver el estado y gestionar un network team en tiempo real?

a) `teamctl`
b) `teamdctl`
c) `ip team`
d) `nmcli team`

<details><summary>Respuesta</summary>

**b) `teamdctl`**

`teamdctl` es la herramienta de control para teamd. Permite ver el estado (`teamdctl team0 state`), la configuracion (`config dump`) y gestionar puertos (`port disable/enable`).
</details>

### Pregunta 4
¿Que parametro de VRRP en keepalived debe ser unico en la red para cada instancia?

a) `priority`
b) `advert_int`
c) `virtual_router_id`
d) `state`

<details><summary>Respuesta</summary>

**c) `virtual_router_id`**

El `virtual_router_id` (0-255) identifica de forma unica una instancia VRRP en la red. Si dos instancias diferentes comparten el mismo ID en la misma red, se produciran conflictos.
</details>

### Pregunta 5
¿Que runner de teaming es equivalente al modo 4 (802.3ad/LACP) de bonding?

a) `activebackup`
b) `loadbalance`
c) `roundrobin`
d) `lacp`

<details><summary>Respuesta</summary>

**d) `lacp`**

El runner `lacp` de teaming implementa LACP (IEEE 802.3ad), equivalente al modo 4 de bonding. Requiere soporte LACP en el switch.
</details>

### Pregunta 6
¿Que archivo muestra el estado de un bond de red en Linux?

a) `/sys/net/bond0/status`
b) `/proc/net/bonding/bond0`
c) `/etc/bond0/status`
d) `/var/run/bond0.state`

<details><summary>Respuesta</summary>

**b) `/proc/net/bonding/bond0`**

`/proc/net/bonding/bond0` muestra informacion detallada del bond incluyendo el modo, interfaces esclavas, estado de cada interfaz y la interfaz activa actualmente.
</details>

### Pregunta 7
En keepalived, ¿que directiva evita que un nodo BACKUP recupere automaticamente el rol MASTER cuando vuelve a estar disponible?

a) `nopreempt`
b) `nofailback`
c) `sticky`
d) `no_recovery`

<details><summary>Respuesta</summary>

**a) `nopreempt`**

La directiva `nopreempt` en una instancia VRRP evita que el nodo con mayor prioridad recupere automaticamente el rol MASTER. Esto reduce los cambios de estado innecesarios. Solo funciona cuando `state` es `BACKUP`.
</details>

### Pregunta 8
¿Que parametro de bonding define cada cuantos milisegundos se verifica el estado del enlace?

a) `updelay`
b) `check_interval`
c) `miimon`
d) `arp_interval`

<details><summary>Respuesta</summary>

**c) `miimon`**

`miimon` define el intervalo en milisegundos para la verificacion del estado del enlace usando MII (Media Independent Interface). Un valor tipico es 100 ms. `arp_interval` es una alternativa que usa peticiones ARP.
</details>

### Pregunta 9
¿Que comando crea una ruta predeterminada con dos gateways para balanceo de carga?

a) `ip route add default via 10.0.0.1 via 10.0.0.2`
b) `ip route add default nexthop via 10.0.0.1 weight 1 nexthop via 10.0.0.2 weight 1`
c) `route add default gw 10.0.0.1 gw 10.0.0.2`
d) `ip route add default multipath 10.0.0.1 10.0.0.2`

<details><summary>Respuesta</summary>

**b) `ip route add default nexthop via 10.0.0.1 weight 1 nexthop via 10.0.0.2 weight 1`**

La sintaxis `nexthop` de `ip route` permite definir multiples gateways con pesos para balanceo de carga. El kernel distribuye el trafico entre los nexthops segun los pesos.
</details>

### Pregunta 10
¿Que ventaja principal tiene network teaming sobre bonding?

a) Mejor rendimiento en modo LACP
b) Arquitectura modular en espacio de usuario con runners intercambiables
c) Soporte para mas interfaces fisicas
d) Mayor compatibilidad con switches antiguos

<details><summary>Respuesta</summary>

**b) Arquitectura modular en espacio de usuario con runners intercambiables**

Teaming usa una arquitectura modular con runners en espacio de usuario (teamd), configuracion JSON, soporte D-Bus y mejor monitorizacion (incluyendo nsna_ping para IPv6). Bonding es monolitico en el kernel.
</details>
