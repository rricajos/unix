---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "334 - Seguridad de Red"
tema: "334.1 - Hardening de red"
subtema: "334.1"
peso: 4
tags:
  - lpic-3
  - tema-334
  - nftables
  - iptables
  - sysctl
---

# Ejercicios - 334.1 Hardening de Red

### Pregunta 1
¿Que parametro sysctl habilita la proteccion contra ataques SYN flood?

a) `net.ipv4.tcp_syn_protect = 1`
b) `net.ipv4.tcp_syncookies = 1`
c) `net.ipv4.tcp_flood_protection = 1`
d) `net.ipv4.syn_cookies_enable = 1`

<details><summary>Respuesta</summary>

**b)** `net.ipv4.tcp_syncookies = 1`

TCP SYN cookies es un mecanismo que permite al servidor responder a conexiones SYN sin mantener estado en memoria, protegiendo contra ataques SYN flood que intentan agotar los recursos del servidor.
</details>

### Pregunta 2
¿Que hace el parametro `net.ipv4.conf.all.rp_filter = 1`?

a) Filtra paquetes por protocolo
b) Activa el reverse path filtering, rechazando paquetes con IP de origen falsificada
c) Filtra paquetes duplicados
d) Bloquea paquetes fragmentados

<details><summary>Respuesta</summary>

**b)** Activa el reverse path filtering, rechazando paquetes con IP de origen falsificada

El Reverse Path Filtering verifica que la direccion de origen de cada paquete recibido sea alcanzable a traves de la interfaz por la que llego. El valor 1 (strict) requiere coincidencia exacta de interfaz; el valor 2 (loose) solo requiere que exista alguna ruta.
</details>

### Pregunta 3
En TCP Wrappers, ¿cual es el orden de evaluacion entre hosts.allow y hosts.deny?

a) hosts.deny se evalua primero, luego hosts.allow
b) hosts.allow se evalua primero; si no coincide, se evalua hosts.deny
c) Se evaluan ambos simultaneamente
d) El orden depende de la configuracion en /etc/nsswitch.conf

<details><summary>Respuesta</summary>

**b)** hosts.allow se evalua primero; si no coincide, se evalua hosts.deny

El flujo es: 1) Si coincide en hosts.allow -> PERMITIDO. 2) Si coincide en hosts.deny -> DENEGADO. 3) Si no coincide en ninguno -> PERMITIDO (por defecto).
</details>

### Pregunta 4
¿Que comando de nftables crea una cadena de entrada con politica de descarte por defecto?

a) `nft create chain inet filtro entrada policy drop`
b) `nft add chain inet filtro entrada { type filter hook input priority 0 ; policy drop ; }`
c) `nft chain inet filtro entrada --policy DROP`
d) `nft add filter inet entrada DROP`

<details><summary>Respuesta</summary>

**b)** `nft add chain inet filtro entrada { type filter hook input priority 0 ; policy drop ; }`

En nftables, las cadenas base requieren especificar type (filter/nat/route), hook (input/output/forward), priority y policy dentro de llaves.
</details>

### Pregunta 5
¿Que modulo de iptables permite limitar el numero de conexiones nuevas a un servicio en un periodo de tiempo?

a) `conntrack`
b) `limit`
c) `recent`
d) `hashlimit`

<details><summary>Respuesta</summary>

**c)** `recent`

El modulo `recent` mantiene una lista de IPs recientes y permite establecer umbrales de conexion por IP en un periodo. El modulo `limit` limita la tasa global, no por IP. `hashlimit` combina ambas funcionalidades.
</details>

### Pregunta 6
¿Que comando crea un namespace de red aislado llamado "seguro"?

a) `netns create seguro`
b) `ip netns add seguro`
c) `ip namespace create seguro`
d) `nsenter --net seguro`

<details><summary>Respuesta</summary>

**b)** `ip netns add seguro`

`ip netns add` crea un nuevo namespace de red con su propio stack de red aislado (interfaces, tabla de rutas, reglas de firewall, etc.). Se ejecutan comandos dentro con `ip netns exec seguro comando`.
</details>

### Pregunta 7
¿Que parametro sysctl deshabilita completamente IPv6 en todas las interfaces?

a) `net.ipv6.disable = 1`
b) `net.ipv6.conf.all.disable_ipv6 = 1`
c) `net.ipv6.conf.all.ipv6_disable = 1`
d) `net.ipv6.enabled = 0`

<details><summary>Respuesta</summary>

**b)** `net.ipv6.conf.all.disable_ipv6 = 1`

Este parametro deshabilita IPv6 en todas las interfaces. Tambien se recomienda establecer `net.ipv6.conf.default.disable_ipv6 = 1` para que las nuevas interfaces tambien lo tengan deshabilitado.
</details>

### Pregunta 8
¿Que familia de nftables permite crear reglas que aplican tanto a IPv4 como a IPv6?

a) `ip`
b) `ip6`
c) `inet`
d) `dual`

<details><summary>Respuesta</summary>

**c)** `inet`

La familia `inet` en nftables es una familia dual-stack que aplica las reglas tanto a trafico IPv4 como IPv6, evitando duplicar reglas. Las familias `ip` e `ip6` solo aplican a su respectivo protocolo.
</details>

### Pregunta 9
¿Para que sirve el comando `conntrack -L`?

a) Lista las reglas de firewall activas
b) Lista todas las conexiones rastreadas por el sistema de connection tracking
c) Lista las interfaces de red
d) Lista las rutas de red

<details><summary>Respuesta</summary>

**b)** Lista todas las conexiones rastreadas por el sistema de connection tracking

`conntrack -L` muestra la tabla de seguimiento de conexiones del kernel, incluyendo estado (ESTABLISHED, TIME_WAIT, etc.), direcciones de origen y destino, y puertos de cada conexion.
</details>

### Pregunta 10
¿Que parametro sysctl registra paquetes con direcciones IP de origen imposibles (paquetes marcianos)?

a) `net.ipv4.conf.all.log_impossible = 1`
b) `net.ipv4.conf.all.log_martians = 1`
c) `net.ipv4.log_invalid_source = 1`
d) `net.ipv4.conf.all.log_spoofed = 1`

<details><summary>Respuesta</summary>

**b)** `net.ipv4.conf.all.log_martians = 1`

Los "paquetes marcianos" son aquellos con direcciones IP de origen imposibles o no rutables. `log_martians` registra estos paquetes en el log del kernel, util para detectar intentos de spoofing o errores de configuracion.
</details>
