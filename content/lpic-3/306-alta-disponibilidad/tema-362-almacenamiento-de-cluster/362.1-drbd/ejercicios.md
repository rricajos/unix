---
title: "362.1 - Ejercicios: DRBD"
tipo: ejercicios
certificacion: lpic-3
especialidad: 306 - Alta Disponibilidad y Clusters de Almacenamiento
tema: "362 - Almacenamiento de Cluster"
subtema: "362.1"
peso: 5
tags:
  - lpic-3
  - tema-362
  - ejercicios
  - drbd
---

# 362.1 - Ejercicios: DRBD

### Pregunta 1
¿Que protocolo de replicacion DRBD confirma la escritura solo cuando los datos han sido escritos en el disco del nodo remoto?

a) Protocolo A
b) Protocolo B
c) Protocolo C
d) Protocolo D

<details><summary>Respuesta</summary>

**c) Protocolo C**

El protocolo C (sincrono) es el mas seguro. La escritura se confirma a la aplicacion solo cuando los datos se han escrito tanto en el disco local como en el disco remoto. Es el mas recomendado para produccion.
</details>

### Pregunta 2
¿Que comando se usa para crear los metadatos DRBD en un recurso llamado "datos"?

a) `drbdadm init-md datos`
b) `drbdadm create-md datos`
c) `drbdadm setup datos`
d) `drbdadm format datos`

<details><summary>Respuesta</summary>

**b) `drbdadm create-md datos`**

`drbdadm create-md` inicializa los metadatos DRBD en el disco subyacente. Debe ejecutarse en ambos nodos antes de activar el recurso por primera vez.
</details>

### Pregunta 3
¿Que archivo del sistema proporciona informacion sobre el estado de DRBD en formato legacy?

a) `/proc/drbd`
b) `/sys/drbd/status`
c) `/var/log/drbd.log`
d) `/etc/drbd.d/status`

<details><summary>Respuesta</summary>

**a) `/proc/drbd`**

`/proc/drbd` muestra el estado de todos los dispositivos DRBD en formato legacy del kernel, incluyendo el estado de conexion (cs), rol (ro) y estado del disco (ds).
</details>

### Pregunta 4
En una recuperacion de split-brain manual, ¿que flag se usa en el nodo cuyos datos se van a descartar?

a) `--force`
b) `--discard-my-data`
c) `--overwrite-data`
d) `--invalidate`

<details><summary>Respuesta</summary>

**b) `--discard-my-data`**

En la recuperacion de split-brain, el nodo victima usa `drbdadm connect --discard-my-data recurso` para indicar que sus datos deben ser reemplazados por los del otro nodo.
</details>

### Pregunta 5
¿Que significa el estado de disco (ds) "UpToDate/Inconsistent"?

a) Ambos nodos estan sincronizados
b) El disco local esta actualizado, el remoto esta en resincronizacion
c) Ambos discos son inconsistentes
d) El disco local es inconsistente, el remoto esta actualizado

<details><summary>Respuesta</summary>

**b) El disco local esta actualizado, el remoto esta en resincronizacion**

El formato es "local/remoto". `UpToDate` indica datos actualizados e `Inconsistent` indica que el nodo esta recibiendo datos de resincronizacion o que sus datos no estan completos.
</details>

### Pregunta 6
¿Que se requiere para usar DRBD en modo dual-primary?

a) Solo configurar `allow-two-primaries yes`
b) Un sistema de archivos cluster (GFS2/OCFS2) y fencing
c) Protocolo A obligatoriamente
d) Un minimo de 3 nodos

<details><summary>Respuesta</summary>

**b) Un sistema de archivos cluster (GFS2/OCFS2) y fencing**

El modo dual-primary requiere `allow-two-primaries yes` en la configuracion, un sistema de archivos cluster que soporte escrituras concurrentes (como GFS2 u OCFS2), y fencing configurado para proteger contra split-brain.
</details>

### Pregunta 7
¿Que comando aplica los cambios de configuracion de DRBD sin necesidad de reiniciar el recurso?

a) `drbdadm reload datos`
b) `drbdadm restart datos`
c) `drbdadm adjust datos`
d) `drbdadm reconfigure datos`

<details><summary>Respuesta</summary>

**c) `drbdadm adjust datos`**

`drbdadm adjust` compara la configuracion actual en ejecucion con la del archivo de configuracion y aplica los cambios necesarios sin detener el recurso.
</details>

### Pregunta 8
¿En que seccion del archivo de configuracion DRBD se define el protocolo de replicacion?

a) `global { }`
b) `disk { }`
c) `net { }`
d) `startup { }`

<details><summary>Respuesta</summary>

**c) `net { }`**

El protocolo de replicacion (A, B o C) se define en la seccion `net { }`, ya que es un parametro de red. Ejemplo: `net { protocol C; }`.
</details>

### Pregunta 9
¿Que hace el comando `drbdadm verify datos`?

a) Verifica la configuracion del recurso
b) Compara bloques de datos entre nodos sin detener el servicio
c) Verifica la integridad del sistema de archivos
d) Verifica la conexion de red entre nodos

<details><summary>Respuesta</summary>

**b) Compara bloques de datos entre nodos sin detener el servicio**

La verificacion online compara los datos bloque a bloque entre ambos nodos usando el algoritmo definido en `verify-alg`. No detiene el servicio ni corrige automaticamente las diferencias encontradas.
</details>

### Pregunta 10
¿Cual es el valor predeterminado de `meta-disk` en la configuracion de un recurso DRBD?

a) `external`
b) `internal`
c) `/dev/md0`
d) No tiene valor predeterminado

<details><summary>Respuesta</summary>

**b) `internal`**

`meta-disk internal` almacena los metadatos de DRBD al final del disco subyacente. La alternativa es usar un disco separado con `meta-disk /dev/sdX[indice]`, lo cual puede mejorar el rendimiento.
</details>
