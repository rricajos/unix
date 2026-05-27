---
title: "364.3 - Ejercicios: LVM Avanzado"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "364 - HA de Nodo Unico"
subtema: "364.3"
peso: 2
tags:
  - lpic-3
  - tema-364
  - ejercicios
  - lvm
  - thin-provisioning
  - vdo
---

# 364.3 - Ejercicios: LVM Avanzado

### Pregunta 1
¿Que permite el thin provisioning de LVM?

a) Comprimir datos automaticamente
b) Crear LVs cuyo tamaño virtual excede el almacenamiento fisico real
c) Replicar datos entre multiples PVs
d) Cifrar volumenes logicos

<details><summary>Respuesta</summary>

**b) Crear LVs cuyo tamaño virtual excede el almacenamiento fisico real**

El thin provisioning permite overprovisioning: crear volumenes logicos cuyo tamaño total supera el espacio fisico disponible. El espacio real se asigna dinamicamente solo cuando se escriben datos.
</details>

### Pregunta 2
¿Que comando crea un thin pool de 100 GB llamado "mi_pool" en el VG "mi_vg"?

a) `lvcreate -L 100G -n mi_pool mi_vg`
b) `lvcreate --type thin-pool -L 100G -n mi_pool mi_vg`
c) `lvcreate --thin -L 100G -n mi_pool mi_vg`
d) `lvcreate --pool -L 100G -n mi_pool mi_vg`

<details><summary>Respuesta</summary>

**b) `lvcreate --type thin-pool -L 100G -n mi_pool mi_vg`**

`--type thin-pool` crea un pool de thin provisioning. Despues se pueden crear thin LVs dentro del pool con `lvcreate --type thin -V tamaño --thinpool mi_pool`.
</details>

### Pregunta 3
¿Que herramienta de VDO proporciona estadisticas de deduplicacion y compresion?

a) `vdo status`
b) `vdostats`
c) `vdo info`
d) `lvs --vdo`

<details><summary>Respuesta</summary>

**b) `vdostats`**

`vdostats --human-readable` muestra las estadisticas de uso, incluyendo el espacio fisico, logico, ahorro por deduplicacion y compresion.
</details>

### Pregunta 4
¿Que comando migra los datos de un PV a otro sin tiempo de inactividad?

a) `pvresize`
b) `pvchange`
c) `pvmove`
d) `pvcopy`

<details><summary>Respuesta</summary>

**c) `pvmove`**

`pvmove /dev/origen /dev/destino` migra todos los LVs del PV de origen al destino de forma online, sin necesidad de desmontar los volumenes logicos.
</details>

### Pregunta 5
¿Que politica de cache LVM es la predeterminada y recomendada?

a) `mq`
b) `smq`
c) `lru`
d) `fifo`

<details><summary>Respuesta</summary>

**b) `smq`**

SMQ (Stochastic Multi Queue) es la politica de cache predeterminada y recomendada para dm-cache/lvmcache. Es mas eficiente y usa menos memoria que la politica `mq` anterior.
</details>

### Pregunta 6
¿Donde almacena LVM automaticamente las copias de seguridad de metadatos?

a) `/var/lib/lvm/`
b) `/etc/lvm/backup/` y `/etc/lvm/archive/`
c) `/boot/lvm/`
d) `/proc/lvm/metadata/`

<details><summary>Respuesta</summary>

**b) `/etc/lvm/backup/` y `/etc/lvm/archive/`**

`/etc/lvm/backup/` contiene el backup mas reciente de cada VG. `/etc/lvm/archive/` contiene el historial de todos los cambios. Se pueden restaurar con `vgcfgrestore`.
</details>

### Pregunta 7
¿Que tipo de RAID LVM crea un espejo de datos?

a) `raid0`
b) `raid1`
c) `raid5`
d) `striped`

<details><summary>Respuesta</summary>

**b) `raid1`**

`lvcreate --type raid1 -m 1` crea un LV con espejo (mirror). El parametro `-m 1` indica una copia adicional (total 2 copias de los datos).
</details>

### Pregunta 8
¿Que hace el comando `lvconvert --uncache mi_vg/datos`?

a) Elimina el LV de datos
b) Elimina el cache SSD sin perder los datos del LV
c) Convierte el cache a modo writethrough
d) Limpia el cache de datos sucios

<details><summary>Respuesta</summary>

**b) Elimina el cache SSD sin perder los datos del LV**

`--uncache` primero vuelca los datos sucios (dirty) del cache al disco principal, y luego elimina el cache pool. El LV de datos sigue funcionando sin cache.
</details>

### Pregunta 9
¿Que sistema de archivos se recomienda sobre VDO?

a) ext4
b) btrfs
c) XFS
d) GFS2

<details><summary>Respuesta</summary>

**c) XFS**

XFS es el sistema de archivos recomendado sobre VDO por Red Hat. Se debe usar `mkfs.xfs -K` (sin descartar bloques) para que VDO pueda gestionar correctamente la deduplicacion.
</details>

### Pregunta 10
¿Que modo de activacion LVM permite que solo un nodo del cluster acceda al LV?

a) `lvchange -a y`
b) `lvchange -a ey`
c) `lvchange -a sy`
d) `lvchange -a ly`

<details><summary>Respuesta</summary>

**b) `lvchange -a ey`**

El modo exclusivo (`-a ey`) asegura que solo un nodo del cluster puede activar y acceder al LV. Es el modo adecuado para LVs que no usan un sistema de archivos cluster. `-a sy` (compartido) permite acceso desde multiples nodos.
</details>
