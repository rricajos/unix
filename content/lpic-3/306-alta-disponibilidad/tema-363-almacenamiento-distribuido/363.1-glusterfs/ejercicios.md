---
title: "363.1 - Ejercicios: GlusterFS"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "363 - Almacenamiento Distribuido"
subtema: "363.1"
peso: 5
tags:
  - lpic-3
  - tema-363
  - ejercicios
  - glusterfs
---

# 363.1 - Ejercicios: GlusterFS

### Pregunta 1
¿Que comando añade un nuevo servidor al Trusted Storage Pool de GlusterFS?

a) `gluster pool add server2`
b) `gluster peer probe server2`
c) `gluster node add server2`
d) `gluster cluster join server2`

<details><summary>Respuesta</summary>

**b) `gluster peer probe server2`**

`gluster peer probe` añade un servidor al pool de confianza (Trusted Storage Pool). Debe ejecutarse desde un nodo ya existente del pool.
</details>

### Pregunta 2
¿Que tipo de volumen GlusterFS usa erasure coding para proporcionar redundancia con menor coste de almacenamiento?

a) Distributed
b) Replicated
c) Dispersed
d) Striped

<details><summary>Respuesta</summary>

**c) Dispersed**

Los volumenes dispersed (dispersos) usan erasure coding, similar a RAID 5/6. Proporcionan redundancia con menos overhead de almacenamiento que la replicacion completa. Se crean con `disperse N redundancy M`.
</details>

### Pregunta 3
¿Cuantos bricks se necesitan para crear un volumen distributed-replicated con replica 3 y 2 sets de distribucion?

a) 3
b) 4
c) 5
d) 6

<details><summary>Respuesta</summary>

**d) 6**

Un volumen distributed-replicated con replica 3 y 2 sets de distribucion necesita 3 x 2 = 6 bricks. El numero total de bricks debe ser multiplo del factor de replica.
</details>

### Pregunta 4
¿Que accion se debe realizar despues de añadir bricks a un volumen existente para distribuir los datos existentes?

a) `gluster volume heal`
b) `gluster volume rebalance start`
c) `gluster volume restart`
d) `gluster volume sync`

<details><summary>Respuesta</summary>

**b) `gluster volume rebalance start`**

El rebalanceo redistribuye los datos existentes entre todos los bricks, incluyendo los nuevos. Sin rebalanceo, solo los archivos nuevos se colocarian en los bricks nuevos.
</details>

### Pregunta 5
¿Que tipo de montaje nativo usa GlusterFS para acceder a los volumenes desde los clientes?

a) NFS
b) CIFS
c) FUSE
d) iSCSI

<details><summary>Respuesta</summary>

**c) FUSE**

GlusterFS usa FUSE (Filesystem in Userspace) como metodo de montaje nativo. El comando es `mount -t glusterfs server:/volumen /punto_montaje`. Tambien puede exportarse via NFS-Ganesha o SMB.
</details>

### Pregunta 6
¿Que tipo de replicacion usa la geo-replicacion de GlusterFS?

a) Sincrona
b) Asincrona
c) Semi-sincrona
d) Sincrona con cache

<details><summary>Respuesta</summary>

**b) Asincrona**

La geo-replicacion es asincrona, diseñada para replicar datos entre clusters GlusterFS distantes geograficamente. La replicacion normal (replica dentro de un volumen) es sincrona.
</details>

### Pregunta 7
¿Que hace el comando `gluster volume heal mi_vol info`?

a) Repara archivos dañados
b) Muestra archivos pendientes de reparacion
c) Activa el daemon de self-heal
d) Muestra el historial de reparaciones

<details><summary>Respuesta</summary>

**b) Muestra archivos pendientes de reparacion**

`gluster volume heal VOL info` lista los archivos que necesitan ser reparados (healing). Para iniciar la reparacion se usa `gluster volume heal VOL` sin la opcion `info`.
</details>

### Pregunta 8
¿Que componente de GlusterFS es una unidad basica de almacenamiento que consiste en un directorio en un servidor?

a) Volume
b) Translator
c) Brick
d) Peer

<details><summary>Respuesta</summary>

**c) Brick**

Un brick es la unidad basica de almacenamiento en GlusterFS. Es un directorio exportado desde un servidor miembro del pool. Se especifica como `servidor:/ruta/directorio`.
</details>

### Pregunta 9
¿Que algoritmo usa GlusterFS para localizar archivos sin necesidad de un servidor de metadatos centralizado?

a) CRUSH
b) DHT (Distributed Hash Table)
c) Consistent Hashing
d) B-tree indexing

<details><summary>Respuesta</summary>

**b) DHT (Distributed Hash Table)**

GlusterFS usa el translator DHT (Distributed Hash Table) para determinar en que brick se almacena cada archivo, basandose en un hash del nombre del archivo. Esto elimina la necesidad de un servidor de metadatos centralizado.
</details>

### Pregunta 10
¿Que puerto TCP usa el daemon glusterd para la gestion del cluster?

a) 2049
b) 24007
c) 49152
d) 111

<details><summary>Respuesta</summary>

**b) 24007**

El daemon `glusterd` escucha en el puerto TCP 24007 para la gestion del cluster. Los bricks usan puertos a partir de 49152. NFS-Ganesha usa el puerto 2049.
</details>
