---
title: "362.3 - Ejercicios: Sistemas de Archivos Cluster"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "362 - Almacenamiento de Cluster"
subtema: "362.3"
peso: 3
tags:
  - lpic-3
  - tema-362
  - ejercicios
  - gfs2
  - ocfs2
---

# 362.3 - Ejercicios: Sistemas de Archivos Cluster

### Pregunta 1
¿Que componente coordina los bloqueos entre nodos para los sistemas de archivos cluster?

a) Corosync
b) DLM (Distributed Lock Manager)
c) STONITH
d) CIB

<details><summary>Respuesta</summary>

**b) DLM (Distributed Lock Manager)**

El DLM coordina los bloqueos distribuidos entre los nodos del cluster, asegurando que las escrituras concurrentes en GFS2 u OCFS2 no provoquen corrupcion de datos.
</details>

### Pregunta 2
Al crear un sistema de archivos GFS2, ¿que parametro especifica el numero de journals?

a) `-n`
b) `-N`
c) `-j`
d) `-J`

<details><summary>Respuesta</summary>

**c) `-j`**

El parametro `-j` especifica el numero de journals al crear un GFS2 con `mkfs.gfs2`. Debe haber al menos un journal por cada nodo que vaya a montar el FS. `-J` (mayuscula) especifica el tamaño de cada journal.
</details>

### Pregunta 3
¿Que protocolo de bloqueo se especifica con `-p lock_dlm` al crear un GFS2?

a) Bloqueo local
b) Bloqueo basado en NFS
c) Distributed Lock Manager
d) Bloqueo basado en POSIX

<details><summary>Respuesta</summary>

**c) Distributed Lock Manager**

`lock_dlm` indica que GFS2 usara el DLM de Pacemaker para coordinar los bloqueos entre nodos. Es la unica opcion valida para uso en cluster (existe `lock_nolock` para uso local de un solo nodo).
</details>

### Pregunta 4
¿Que framework propio puede usar OCFS2 como alternativa al DLM de Pacemaker?

a) dlm_controld
b) o2cb
c) cman
d) rgmanager

<details><summary>Respuesta</summary>

**b) o2cb**

OCFS2 puede usar su propio framework de cluster llamado `o2cb`, que incluye su propio sistema de heartbeat y gestion de nodos. La alternativa es usar Pacemaker con DLM (`--cluster-stack=pcmk`).
</details>

### Pregunta 5
¿Que comando expande un sistema de archivos GFS2 en linea?

a) `resize2fs`
b) `xfs_growfs`
c) `gfs2_grow`
d) `tunegfs2 --grow`

<details><summary>Respuesta</summary>

**c) `gfs2_grow`**

`gfs2_grow` expande un sistema de archivos GFS2 mientras esta montado (online). Se ejecuta en un nodo y el cambio se propaga a todos los demas nodos que tienen el FS montado.
</details>

### Pregunta 6
¿Por que es obligatorio el fencing (STONITH) cuando se usan sistemas de archivos cluster?

a) Para mejorar el rendimiento de E/S
b) Para evitar que un nodo no respondiente siga escribiendo sin coordinacion DLM
c) Para gestionar las copias de seguridad
d) Para balancear la carga de E/S entre nodos

<details><summary>Respuesta</summary>

**b) Para evitar que un nodo no respondiente siga escribiendo sin coordinacion DLM**

Si un nodo deja de comunicarse con el cluster pero sigue activo, podria escribir datos en el almacenamiento compartido sin coordinacion del DLM, causando corrupcion. El fencing asegura que el nodo sea eliminado fisicamente.
</details>

### Pregunta 7
¿Que comando añade journals adicionales a un GFS2 ya existente para permitir que nuevos nodos lo monten?

a) `mkfs.gfs2 -j`
b) `gfs2_jadd`
c) `tunegfs2 -j`
d) `gfs2_journal_add`

<details><summary>Respuesta</summary>

**b) `gfs2_jadd`**

`gfs2_jadd -j N /punto_montaje` añade N journals adicionales a un GFS2 montado. Cada nodo que monte el FS necesita su propio journal.
</details>

### Pregunta 8
¿Que parametro de `mkfs.ocfs2` indica que se usara Pacemaker como stack de cluster?

a) `--cluster-stack=dlm`
b) `--cluster-stack=pcmk`
c) `--cluster-stack=pacemaker`
d) `--pacemaker`

<details><summary>Respuesta</summary>

**b) `--cluster-stack=pcmk`**

`--cluster-stack=pcmk` indica que OCFS2 usara Pacemaker con DLM para la gestion del cluster. La alternativa es `--cluster-stack=o2cb` para usar el framework nativo de OCFS2.
</details>

### Pregunta 9
¿Cuando se necesita un sistema de archivos cluster en lugar de uno tradicional?

a) Cuando se quiere mejor rendimiento de lectura
b) Cuando multiples nodos necesitan acceso de escritura simultaneo
c) Cuando se usa RAID por software
d) Cuando el almacenamiento es local (DAS)

<details><summary>Respuesta</summary>

**b) Cuando multiples nodos necesitan acceso de escritura simultaneo**

Los FS cluster (GFS2, OCFS2) son necesarios cuando multiples nodos deben leer y escribir simultaneamente en el mismo dispositivo de bloque. En escenarios activo/pasivo (single-writer), un FS normal es suficiente.
</details>

### Pregunta 10
¿Como se configura el DLM en un cluster Pacemaker?

a) Como recurso primitivo en un solo nodo
b) Como recurso clone que se ejecuta en todos los nodos
c) Como propiedad del cluster
d) Como modulo del kernel sin recurso Pacemaker

<details><summary>Respuesta</summary>

**b) Como recurso clone que se ejecuta en todos los nodos**

El DLM debe configurarse como recurso clone en Pacemaker para que se ejecute en todos los nodos del cluster. Comando: `pcs resource create dlm ocf:pacemaker:controld op monitor interval=30s clone`.
</details>
