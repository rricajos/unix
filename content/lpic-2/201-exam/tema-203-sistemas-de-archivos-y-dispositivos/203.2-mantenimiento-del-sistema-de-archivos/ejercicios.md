---
title: "203.2 - Mantenimiento del sistema de archivos"
tags: [lpic-2, examen-201, tema-203, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "203"
subtema: "203.2"
---

# 203.2 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

Un administrador necesita reducir el porcentaje de bloques reservados para root en una particion ext4 de 2TB usada como almacenamiento de datos, donde el 5% por defecto desperdicia 100GB. ¿Que comando debe usar?

a) `resize2fs -m 1 /dev/sdb1`
b) `tune2fs -m 1 /dev/sdb1`
c) `e2fsck -m 1 /dev/sdb1`
d) `mkfs.ext4 -m 1 /dev/sdb1`

<details>
<summary>Respuesta</summary>

**b) `tune2fs -m 1 /dev/sdb1`**

`tune2fs -m` cambia el porcentaje de bloques reservados para el superusuario en un sistema de archivos ext2/3/4 existente. Con `-m 1` se reduce al 1%, liberando espacio significativo en discos grandes. `resize2fs` es para cambiar el tamano del FS, `e2fsck` para verificar, y `mkfs.ext4` destruiria todos los datos al crear un nuevo FS.
</details>

---

### Pregunta 2

¿Cual es la herramienta correcta para reparar un sistema de archivos XFS dañado?

a) `fsck.xfs /dev/sda3`
b) `e2fsck /dev/sda3`
c) `xfs_repair /dev/sda3`
d) `xfs_check /dev/sda3`

<details>
<summary>Respuesta</summary>

**c) `xfs_repair /dev/sda3`**

`xfs_repair` es la unica herramienta real para reparar sistemas de archivos XFS. Aunque `fsck.xfs` existe en el sistema, es un placeholder que no realiza ninguna operacion real de reparacion. `e2fsck` es exclusiva para ext2/3/4. `xfs_check` es una herramienta antigua de verificacion que ha sido reemplazada por `xfs_repair -n`.
</details>

---

### Pregunta 3

Un administrador quiere expandir un sistema de archivos XFS que esta en `/dev/sda3` montado en `/datos`. ¿Que comando debe usar?

a) `resize2fs /dev/sda3`
b) `xfs_growfs /dev/sda3`
c) `xfs_growfs /datos`
d) `xfs_resize /datos`

<details>
<summary>Respuesta</summary>

**c) `xfs_growfs /datos`**

`xfs_growfs` opera sobre el **punto de montaje**, no sobre el dispositivo. Ademas, el sistema de archivos XFS debe estar **montado** para poder expandirse. Esto contrasta con `resize2fs` que opera sobre el dispositivo. La opcion b) es incorrecta porque `xfs_growfs` espera un punto de montaje. `xfs_resize` no existe como comando.
</details>

---

### Pregunta 4

¿Que comando muestra informacion detallada del superbloque de un sistema de archivos ext4, incluyendo el numero de bloques, inodos y la ultima fecha de verificacion?

a) `tune2fs -l /dev/sda1`
b) `dumpe2fs -h /dev/sda1`
c) `e2fsck -n /dev/sda1`
d) `xfs_info /dev/sda1`

<details>
<summary>Respuesta</summary>

**b) `dumpe2fs -h /dev/sda1`**

`dumpe2fs -h` muestra la informacion del superbloque sin listar los descriptores de grupo, incluyendo UUID, etiqueta, conteo de bloques e inodos, tamano de bloque, estado del FS, conteo de montajes, fechas de verificacion y caracteristicas habilitadas. `tune2fs -l` tambien muestra informacion similar. `e2fsck -n` verifica sin reparar pero no esta diseñado para mostrar informacion del superbloque. `xfs_info` es para XFS.
</details>

---

### Pregunta 5

¿Que se debe hacer ANTES de reducir el tamano de un sistema de archivos ext4 con `resize2fs`?

a) Montar el sistema de archivos en modo lectura-escritura
b) Ejecutar `e2fsck -f` sobre el sistema de archivos desmontado
c) Ejecutar `xfs_repair` sobre el sistema de archivos
d) Crear un respaldo del superbloque con `dumpe2fs`

<details>
<summary>Respuesta</summary>

**b) Ejecutar `e2fsck -f` sobre el sistema de archivos desmontado**

Antes de reducir un sistema de archivos ext4, es obligatorio que este desmontado y que se ejecute una verificacion forzada con `e2fsck -f`. Si se intenta reducir sin pasar fsck, `resize2fs` mostrara un error indicando que primero debe ejecutarse e2fsck. Esto garantiza la integridad de los datos antes de la operacion potencialmente destructiva de reduccion.
</details>

---

### Pregunta 6

Un administrador quiere verificar el estado de salud de un disco duro de forma rapida usando SMART. ¿Que comando es el mas adecuado?

a) `smartctl -a /dev/sda`
b) `smartctl -H /dev/sda`
c) `smartctl -t short /dev/sda`
d) `smartctl -A /dev/sda`

<details>
<summary>Respuesta</summary>

**b) `smartctl -H /dev/sda`**

`smartctl -H` (Health) muestra de forma rapida el estado de salud general del disco, reportando "PASSED" o "FAILED". Es la forma mas directa de verificar si el disco esta en buen estado. La opcion `-a` muestra toda la informacion disponible (mas verbosa), `-t short` ejecuta un test que tarda varios minutos, y `-A` muestra los atributos sin el veredicto de salud resumido.
</details>

---

### Pregunta 7

¿Cual de las siguientes afirmaciones sobre XFS es correcta?

a) XFS puede expandirse y reducirse en linea
b) XFS solo puede expandirse, nunca reducirse
c) XFS solo puede reducirse, nunca expandirse
d) XFS no soporta cambios de tamano

<details>
<summary>Respuesta</summary>

**b) XFS solo puede expandirse, nunca reducirse**

Esta es una limitacion fundamental de XFS: solo soporta el crecimiento del sistema de archivos mediante `xfs_growfs`, pero no permite la reduccion. Si se necesita reducir una particion XFS, la unica opcion es respaldar los datos, crear un sistema de archivos nuevo mas pequeño y restaurar. Ademas, `xfs_growfs` requiere que el sistema de archivos este montado.
</details>

---

### Pregunta 8

¿Que comando agrega un journal a un sistema de archivos ext2, convirtiendolo efectivamente en ext3?

a) `mkfs.ext3 /dev/sda1`
b) `tune2fs -j /dev/sda1`
c) `e2fsck -j /dev/sda1`
d) `resize2fs -j /dev/sda1`

<details>
<summary>Respuesta</summary>

**b) `tune2fs -j /dev/sda1`**

`tune2fs -j` agrega un journal a un sistema de archivos ext2 existente, convirtiendolo en ext3 sin destruir los datos. Esta es una forma no destructiva de actualizar el sistema de archivos. La opcion a) `mkfs.ext3` crearia un nuevo sistema de archivos desde cero, destruyendo todos los datos existentes.
</details>

---

### Pregunta 9

Un administrador configura `smartd` para monitorizar discos. ¿En que archivo se define la configuracion del demonio?

a) `/etc/smart.conf`
b) `/etc/smartd.conf`
c) `/etc/smartctl.conf`
d) `/etc/sysconfig/smartd`

<details>
<summary>Respuesta</summary>

**b) `/etc/smartd.conf`**

El archivo `/etc/smartd.conf` contiene la configuracion del demonio `smartd`. En este archivo se especifican los discos a monitorizar, las direcciones de correo para alertas y la programacion de tests automaticos. La directiva `DEVICESCAN` puede usarse para monitorizar automaticamente todos los discos detectados. Tras modificar el archivo, se debe reiniciar el servicio con `systemctl restart smartd`.
</details>

---

### Pregunta 10

Un administrador necesita crear un sistema de archivos FAT32 en una memoria USB (`/dev/sdb1`) con la etiqueta "BACKUP". ¿Que comando es correcto?

a) `mkfs.fat -F 32 -n BACKUP /dev/sdb1`
b) `mkfs.ext4 -L BACKUP /dev/sdb1`
c) `mkfs.ntfs -L BACKUP /dev/sdb1`
d) `mkfs.fat -F 16 -n BACKUP /dev/sdb1`

<details>
<summary>Respuesta</summary>

**a) `mkfs.fat -F 32 -n BACKUP /dev/sdb1`**

`mkfs.fat` (o su alias `mkfs.vfat`) con la opcion `-F 32` crea un sistema de archivos FAT32. La opcion `-n` establece la etiqueta del volumen. Tambien se podria usar `mkfs.vfat -F 32 -n BACKUP /dev/sdb1`. La opcion `-F 16` crearia FAT16 en lugar de FAT32. La opcion b) crearia ext4, que no es compatible con la mayoria de dispositivos y sistemas operativos.
</details>
