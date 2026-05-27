---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "334 - Seguridad de Red"
tema: "334.3 - Filtrado de paquetes"
subtema: "334.3"
peso: 5
tags:
  - lpic-3
  - tema-334
  - nftables
  - iptables
  - firewalld
  - nat
---

# Ejercicios - 334.3 Filtrado de Paquetes

### Pregunta 1
¿Que familia de nftables permite definir reglas que apliquen tanto a IPv4 como a IPv6 simultaneamente?

a) `ip`
b) `ip6`
c) `inet`
d) `bridge`

<details><summary>Respuesta</summary>

**c)** `inet`

La familia `inet` es dual-stack y permite definir reglas que aplican tanto a trafico IPv4 como IPv6 con una sola regla, evitando duplicacion.
</details>

### Pregunta 2
¿Que comando crea un set de nftables con elementos que expiran automaticamente despues de 1 hora?

a) `nft add set inet t ips { type ipv4_addr ; expire 1h ; }`
b) `nft add set inet t ips { type ipv4_addr ; timeout 1h ; }`
c) `nft add set inet t ips { type ipv4_addr ; ttl 3600 ; }`
d) `nft add set inet t ips { type ipv4_addr ; lifetime 1h ; }`

<details><summary>Respuesta</summary>

**b)** `nft add set inet t ips { type ipv4_addr ; timeout 1h ; }`

La opcion `timeout` define el tiempo de vida de los elementos del set. Los elementos añadidos expiran automaticamente pasado el tiempo especificado.
</details>

### Pregunta 3
¿Que comando de nftables configura masquerade (SNAT dinamico) para trafico saliente por la interfaz eth0?

a) `nft add rule inet nat postrouting oif eth0 masquerade`
b) `nft add rule inet nat prerouting oif eth0 masquerade`
c) `nft add rule inet filter output oif eth0 masquerade`
d) `nft add rule inet nat output oif eth0 snat dynamic`

<details><summary>Respuesta</summary>

**a)** `nft add rule inet nat postrouting oif eth0 masquerade`

Masquerade se configura en el hook postrouting de la tabla nat. `oif eth0` especifica la interfaz de salida. Masquerade traduce automaticamente la IP de origen a la IP de la interfaz de salida.
</details>

### Pregunta 4
¿Cual es la prioridad por defecto para cadenas de tipo filter en nftables?

a) -300
b) -100
c) 0
d) 100

<details><summary>Respuesta</summary>

**c)** 0

La prioridad 0 corresponde al filtrado standard (NF_IP_PRI_FILTER). Las prioridades menores (negativas) se procesan antes: raw (-300), mangle (-150), dnat (-100). Las mayores despues: snat (100).
</details>

### Pregunta 5
¿Que comando lista las reglas de nftables mostrando los handles necesarios para eliminar reglas individuales?

a) `nft list ruleset --handles`
b) `nft -a list ruleset`
c) `nft list ruleset -v`
d) `nft list ruleset --show-id`

<details><summary>Respuesta</summary>

**b)** `nft -a list ruleset`

La opcion `-a` (handle) muestra el numero de handle de cada regla. Este handle se necesita para eliminar reglas individuales con `nft delete rule tabla cadena handle N`.
</details>

### Pregunta 6
¿Que tipo de cadena nftables se necesita para configurar DNAT (port forwarding)?

a) `type filter hook prerouting`
b) `type nat hook prerouting`
c) `type route hook prerouting`
d) `type nat hook postrouting`

<details><summary>Respuesta</summary>

**b)** `type nat hook prerouting`

El DNAT (Destination NAT) se configura en cadenas de tipo `nat` en el hook `prerouting`, ya que la direccion de destino debe modificarse antes de que se tome la decision de enrutamiento.
</details>

### Pregunta 7
¿Que comando de nftables usa un map para asociar puertos con acciones (verdict map)?

a) `nft add rule inet t c tcp dport map @port_actions`
b) `nft add rule inet t c tcp dport vmap @port_actions`
c) `nft add rule inet t c tcp dport lookup @port_actions`
d) `nft add rule inet t c tcp dport match @port_actions`

<details><summary>Respuesta</summary>

**b)** `nft add rule inet t c tcp dport vmap @port_actions`

`vmap` (verdict map) permite asociar valores con acciones (accept, drop, jump) en un solo map, evitando multiples reglas individuales.
</details>

### Pregunta 8
¿Que herramienta permite usar la sintaxis clasica de iptables pero con el backend de nftables?

a) `iptables-legacy`
b) `iptables-nft`
c) `nft-iptables`
d) `iptables-translate`

<details><summary>Respuesta</summary>

**b)** `iptables-nft`

`iptables-nft` es una capa de compatibilidad que acepta la sintaxis clasica de iptables pero traduce las reglas internamente al framework nftables. Se puede verificar con `iptables -V` que mostrara "(nf_tables)".
</details>

### Pregunta 9
¿Que comando permite ver el numero maximo de conexiones rastreadas por el sistema de connection tracking?

a) `conntrack --max`
b) `sysctl net.netfilter.nf_conntrack_max`
c) `nft show conntrack limit`
d) `cat /proc/net/nf_conntrack_count`

<details><summary>Respuesta</summary>

**b)** `sysctl net.netfilter.nf_conntrack_max`

Este parametro del kernel define el numero maximo de conexiones que el sistema de connection tracking puede rastrear simultaneamente. Si se alcanza el limite, se descartan nuevas conexiones.
</details>

### Pregunta 10
¿Que comando de firewalld añade permanentemente el servicio HTTPS a la zona publica?

a) `firewall-cmd --add-service=https --zone=public`
b) `firewall-cmd --zone=public --add-service=https --permanent`
c) `firewall-cmd --permanent --zone=public --enable=https`
d) `firewall-cmd --zone=public --service=https --add --save`

<details><summary>Respuesta</summary>

**b)** `firewall-cmd --zone=public --add-service=https --permanent`

La opcion `--permanent` hace que el cambio sea persistente tras reinicios. Sin `--permanent`, el cambio es temporal. Despues de un cambio permanente, se debe ejecutar `firewall-cmd --reload` para aplicarlo en la sesion actual.
</details>
