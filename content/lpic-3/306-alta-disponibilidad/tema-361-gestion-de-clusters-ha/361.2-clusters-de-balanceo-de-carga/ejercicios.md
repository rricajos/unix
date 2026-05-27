---
title: "361.2 - Ejercicios: Clusters de Balanceo de Carga"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "361 - Gestión de Clusters HA"
subtema: "361.2"
peso: 4
tags:
  - lpic-3
  - tema-361
  - ejercicios
  - balanceo-de-carga
---

# 361.2 - Ejercicios: Clusters de Balanceo de Carga

### Pregunta 1
¿En qué modo de LVS el tráfico de respuesta va directamente del Real Server al cliente sin pasar por el Director?

a) NAT
b) DR (Direct Routing)
c) Full NAT
d) Proxy

<details><summary>Respuesta</summary>

**b) DR (Direct Routing)**

En el modo DR, solo el tráfico entrante pasa por el Director. Las respuestas van directamente del Real Server al cliente, lo que hace este modo el más eficiente y más utilizado en producción.
</details>

### Pregunta 2
¿Cuál es el algoritmo de planificación predeterminado en IPVS?

a) rr (Round Robin)
b) lc (Least Connection)
c) wlc (Weighted Least Connection)
d) wrr (Weighted Round Robin)

<details><summary>Respuesta</summary>

**c) wlc (Weighted Least Connection)**

`wlc` es el algoritmo predeterminado en IPVS. Combina el conteo de conexiones activas con los pesos asignados a cada servidor para tomar decisiones de enrutamiento.
</details>

### Pregunta 3
¿Qué comando crea un servicio virtual TCP en la IP 10.0.0.100 puerto 80 con algoritmo Round Robin?

a) `ipvsadm -A -u 10.0.0.100:80 -s rr`
b) `ipvsadm -a -t 10.0.0.100:80 -s rr`
c) `ipvsadm -A -t 10.0.0.100:80 -s rr`
d) `ipvsadm -D -t 10.0.0.100:80 -s rr`

<details><summary>Respuesta</summary>

**c) `ipvsadm -A -t 10.0.0.100:80 -s rr`**

`-A` crea un nuevo servicio virtual, `-t` especifica TCP (versus `-u` para UDP), y `-s rr` establece el algoritmo Round Robin. `-a` (minúscula) añade un Real Server, `-D` elimina un servicio.
</details>

### Pregunta 4
En keepalived, ¿qué parámetro debe ser único en la red para cada instancia VRRP?

a) priority
b) state
c) virtual_router_id
d) advert_int

<details><summary>Respuesta</summary>

**c) virtual_router_id**

El `virtual_router_id` (valor entre 0 y 255) identifica de forma única una instancia VRRP en la red. Dos instancias VRRP diferentes no deben compartir el mismo ID en la misma red.
</details>

### Pregunta 5
En HAProxy, ¿qué sección combina la funcionalidad de `frontend` y `backend` en una sola?

a) `global`
b) `defaults`
c) `server`
d) `listen`

<details><summary>Respuesta</summary>

**d) `listen`**

La sección `listen` combina frontend y backend en un solo bloque, útil para configuraciones simples como páginas de estadísticas o servicios TCP directos.
</details>

### Pregunta 6
¿Qué flag de ipvsadm se usa para añadir un Real Server en modo NAT?

a) `-g`
b) `-m`
c) `-i`
d) `-n`

<details><summary>Respuesta</summary>

**b) `-m`**

`-m` indica masquerading (NAT), `-g` indica gatewaying (DR, modo predeterminado), y `-i` indica tunneling (TUN).
</details>

### Pregunta 7
¿Qué directiva de HAProxy permite enrutar tráfico basándose en la URL solicitada?

a) `balance`
b) `server`
c) `acl` con `use_backend`
d) `option httpchk`

<details><summary>Respuesta</summary>

**c) `acl` con `use_backend`**

Las ACLs permiten definir condiciones basadas en atributos HTTP (path, headers, etc.) y `use_backend` enruta el tráfico al backend correspondiente según la ACL evaluada. Esto requiere `mode http`.
</details>

### Pregunta 8
En la configuración de nginx como balanceador, ¿qué directiva define un grupo de servidores backend?

a) `server`
b) `location`
c) `upstream`
d) `proxy_pass`

<details><summary>Respuesta</summary>

**c) `upstream`**

La directiva `upstream` define un grupo de servidores backend. Dentro del bloque upstream se especifican los servidores individuales con la directiva `server` y el algoritmo de balanceo.
</details>

### Pregunta 9
¿Qué requisito especial tienen los Real Servers en modo DR de LVS?

a) Deben tener IP pública
b) Deben tener la VIP configurada en loopback con ARP suprimido
c) Deben usar el Director como gateway
d) Deben soportar túneles IP-in-IP

<details><summary>Respuesta</summary>

**b) Deben tener la VIP configurada en loopback con ARP suprimido**

En modo DR, los Real Servers necesitan la VIP en la interfaz loopback para poder responder a los paquetes destinados a esa IP, pero deben suprimir ARP para esa dirección para evitar conflictos con el Director.
</details>

### Pregunta 10
¿Qué algoritmo de balanceo en HAProxy mantiene la persistencia de sesión basándose en la IP de origen del cliente?

a) `roundrobin`
b) `leastconn`
c) `source`
d) `first`

<details><summary>Respuesta</summary>

**c) `source`**

El algoritmo `source` realiza un hash de la IP de origen del cliente para asegurar que las peticiones del mismo cliente siempre lleguen al mismo servidor, proporcionando así persistencia de sesión.
</details>
