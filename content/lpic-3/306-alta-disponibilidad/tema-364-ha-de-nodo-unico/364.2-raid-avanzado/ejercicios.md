---
title: "364.2 - Ejercicios: RAID Avanzado"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "364 - HA de Nodo Unico"
subtema: "364.2"
peso: 2
tags:
  - lpic-3
  - tema-364
  - ejercicios
  - raid
  - mdadm
---

# 364.2 - Ejercicios: RAID Avanzado

### Pregunta 1
¿Que comando de mdadm permite cambiar el nivel de RAID de un array existente sin desmontarlo?

a) `mdadm --change /dev/md0 --level=5`
b) `mdadm --grow /dev/md0 --level=5`
c) `mdadm --reshape /dev/md0 --level=5`
d) `mdadm --convert /dev/md0 --level=5`

<details><summary>Respuesta</summary>

**b) `mdadm --grow /dev/md0 --level=5`**

`mdadm --grow` permite hacer reshape del array en linea, incluyendo cambio de nivel RAID, numero de discos y tamaño de chunk. El proceso se realiza sin interrumpir el servicio.
</details>

### Pregunta 2
¿Que funcion tiene el bitmap (write-intent bitmap) en un array RAID?

a) Mejorar el rendimiento de lectura
b) Registrar bloques pendientes de sincronizacion para acelerar la reconstruccion
c) Comprimir los datos del array
d) Cifrar los datos del array

<details><summary>Respuesta</summary>

**b) Registrar bloques pendientes de sincronizacion para acelerar la reconstruccion**

El bitmap registra que bloques han sido modificados pero no sincronizados. Despues de un fallo breve y reconexion, solo los bloques marcados necesitan resincronizarse, en lugar de todo el array.
</details>

### Pregunta 3
¿Que archivo del sistema muestra el estado de todos los arrays RAID por software?

a) `/sys/block/md0/status`
b) `/proc/mdstat`
c) `/etc/mdadm/status`
d) `/var/log/mdadm`

<details><summary>Respuesta</summary>

**b) `/proc/mdstat`**

`/proc/mdstat` muestra el estado en tiempo real de todos los arrays md, incluyendo el nivel, discos, estado de sincronizacion y progreso de reconstruccion.
</details>

### Pregunta 4
¿Que herramienta se usa para gestionar controladores RAID HP Smart Array?

a) `storcli`
b) `megacli`
c) `ssacli`
d) `arcconf`

<details><summary>Respuesta</summary>

**c) `ssacli`**

`ssacli` (Smart Storage Administrator CLI) es la herramienta para controladores HP Smart Array. Es el sucesor de `hpacucli`. `storcli` es para controladores MegaRAID (LSI/Broadcom).
</details>

### Pregunta 5
¿Que modo de bcache escribe primero en el SSD y luego en el HDD de forma asincrona?

a) `writethrough`
b) `writeback`
c) `writearound`
d) `writebehind`

<details><summary>Respuesta</summary>

**b) `writeback`**

En modo `writeback`, las escrituras se confirman cuando llegan al SSD cache, y se escriben en el HDD despues de forma asincrona. Es mas rapido pero menos seguro que `writethrough`.
</details>

### Pregunta 6
¿Que comando verifica la integridad de un array RAID por software?

a) `mdadm --check /dev/md0`
b) `echo check > /sys/block/md0/md/sync_action`
c) `mdadm --verify /dev/md0`
d) `fsck /dev/md0`

<details><summary>Respuesta</summary>

**b) `echo check > /sys/block/md0/md/sync_action`**

Escribir `check` en `sync_action` inicia una verificacion de integridad del array. Los bloques discrepantes se reportan en `mismatch_cnt`. Para reparar se usa `echo repair`.
</details>

### Pregunta 7
¿Que comando de lvmcache convierte un LV existente para usar cache SSD?

a) `lvconvert --type cache --cachepool VG/cache_pool VG/datos`
b) `lvcreate --cache --pool VG/cache_pool VG/datos`
c) `lvextend --cache VG/datos /dev/ssd`
d) `lvchange --cache-enable VG/datos`

<details><summary>Respuesta</summary>

**a) `lvconvert --type cache --cachepool VG/cache_pool VG/datos`**

`lvconvert --type cache` convierte un LV existente para usar un cache pool SSD previamente creado con `lvcreate --type cache-pool`.
</details>

### Pregunta 8
¿Que parametro controla la velocidad maxima de reconstruccion RAID?

a) `/sys/block/md0/md/rebuild_speed`
b) `/proc/sys/dev/raid/speed_limit_max`
c) `/etc/mdadm/speed_max`
d) `/sys/block/md0/md/sync_speed_max`

<details><summary>Respuesta</summary>

**b) `/proc/sys/dev/raid/speed_limit_max`**

`speed_limit_max` (y `speed_limit_min`) controlan la velocidad de reconstruccion en KB/s. Aumentar estos valores acelera la reconstruccion pero puede impactar el rendimiento del sistema.
</details>

### Pregunta 9
¿Que funcion tiene un disco journal en RAID 5/6?

a) Almacenar los metadatos del array
b) Registrar escrituras parciales para evitar el write hole
c) Servir como hot spare automatico
d) Almacenar la tabla de paridad

<details><summary>Respuesta</summary>

**b) Registrar escrituras parciales para evitar el write hole**

El disco journal registra las escrituras antes de aplicarlas al array, eliminando el "write hole" de RAID 5/6 (riesgo de inconsistencia si el sistema falla durante una escritura parcial).
</details>

### Pregunta 10
¿Que valor en `/proc/mdstat` indica que todos los discos de un array RAID estan funcionando correctamente?

a) `[AAAA]`
b) `[UUU]`
c) `[OK]`
d) `[+++]`

<details><summary>Respuesta</summary>

**b) `[UUU]`**

`U` significa "Up" (disco activo). `[UUU]` indica que los 3 discos estan funcionando. Un `_` indica un disco fallido, por ejemplo `[_UU]` indica que el primer disco ha fallado.
</details>
