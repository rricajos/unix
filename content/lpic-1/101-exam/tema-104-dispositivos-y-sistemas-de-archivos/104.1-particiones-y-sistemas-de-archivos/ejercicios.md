---
title: "104.1 Crear particiones y sistemas de archivos - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.1"
---

# 104.1 Crear particiones y sistemas de archivos - Ejercicios

### Pregunta 1

Un disco con tabla de particiones MBR ya tiene 3 particiones primarias. Un administrador necesita crear 3 particiones adicionales. Cual de las siguientes estrategias es correcta?

a) Crear 3 particiones primarias mas, ya que MBR soporta hasta 8
b) Eliminar una particion primaria y crear 4 logicas en su lugar
c) Crear la 4ta particion como extendida y dentro de ella crear 3 particiones logicas
d) Convertir el disco a GPT, ya que MBR no permite mas de 3 particiones

<details>
<summary>Respuesta</summary>

**c) Crear la 4ta particion como extendida y dentro de ella crear 3 particiones logicas**

MBR permite un maximo de 4 particiones primarias. Para superar este limite, se crea la 4ta particion como extendida (contenedor), y dentro de ella se crean particiones logicas. Las particiones logicas siempre se numeran a partir de 5 (por ejemplo, `sda5`, `sda6`, `sda7`), independientemente del numero de particiones primarias existentes. No es necesario eliminar particiones primarias ni convertir a GPT para resolver esta situacion.

</details>

---

### Pregunta 2

Cual de los siguientes comandos crea un sistema de archivos ext4 en `/dev/sdb1`?

a) `format -t ext4 /dev/sdb1`
b) `mkfs -t ext4 /dev/sdb1`
c) `fsck.ext4 /dev/sdb1`
d) `mount -t ext4 /dev/sdb1 /mnt`

<details>
<summary>Respuesta</summary>

**b) `mkfs -t ext4 /dev/sdb1`**

El comando `mkfs` (make filesystem) con la opcion `-t ext4` crea un sistema de archivos ext4 en la particion indicada. Esto es equivalente a ejecutar `mkfs.ext4 /dev/sdb1`. La opcion `format` no es un comando Linux estandar. `fsck.ext4` se usa para verificar y reparar sistemas de archivos, no para crearlos. `mount` monta un sistema de archivos ya existente en un punto de montaje.

</details>

---

### Pregunta 3

Cual es una diferencia fundamental entre `fdisk` y `parted` respecto a la aplicacion de cambios?

a) `fdisk` aplica los cambios inmediatamente, mientras que `parted` espera al comando `w`
b) `parted` aplica los cambios inmediatamente, mientras que `fdisk` espera al comando `w` para escribirlos
c) Ambos aplican los cambios inmediatamente al ejecutar cada comando
d) Ambos almacenan los cambios en memoria hasta que se ejecuta `w`

<details>
<summary>Respuesta</summary>

**b) `parted` aplica los cambios inmediatamente, mientras que `fdisk` espera al comando `w` para escribirlos**

Esta es una diferencia critica para el examen LPIC-1. En `fdisk` (y `gdisk`), los cambios se almacenan en memoria y no se escriben en disco hasta que se ejecuta el comando `w` (write). Se puede salir sin guardar con `q`. En cambio, `parted` aplica cada operacion de forma inmediata al ejecutarla, sin posibilidad de deshacer. Esto hace que `parted` sea potencialmente mas peligroso si se cometen errores.

</details>

---

### Pregunta 4

Un administrador necesita preparar un archivo swap de 2 GB. Cual de las siguientes secuencias de comandos es correcta?

a) `mkswap /swapfile && swapon /swapfile && dd if=/dev/zero of=/swapfile bs=1M count=2048`
b) `dd if=/dev/zero of=/swapfile bs=1M count=2048 && chmod 666 /swapfile && mkswap /swapfile && swapon /swapfile`
c) `dd if=/dev/zero of=/swapfile bs=1M count=2048 && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`
d) `fallocate -l 2G /swapfile && mkswap /swapfile && swapon /swapfile && chmod 600 /swapfile`

<details>
<summary>Respuesta</summary>

**c) `dd if=/dev/zero of=/swapfile bs=1M count=2048 && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`**

La secuencia correcta es: primero crear el archivo con `dd`, luego establecer permisos seguros `600` (solo root puede leer y escribir), despues formatear como swap con `mkswap`, y finalmente activar con `swapon`. La opcion `a` intenta formatear antes de crear el archivo. La opcion `b` usa permisos `666` que son inseguros para un archivo swap. La opcion `d` establece los permisos despues de activar el swap, lo cual no sigue las buenas practicas de seguridad.

</details>

---

### Pregunta 5

Cual es el codigo hexadecimal de tipo de particion MBR para Linux swap?

a) `83`
b) `8e`
c) `82`
d) `fd`

<details>
<summary>Respuesta</summary>

**c) `82`**

El codigo hexadecimal `82` identifica una particion Linux swap en la tabla MBR. Los otros codigos importantes son: `83` para particiones Linux normales (ext2/ext3/ext4, etc.), `8e` para Linux LVM, y `fd` para Linux RAID autodetect. Estos codigos se establecen con el comando `t` dentro de `fdisk`.

</details>

---

### Pregunta 6

Cuantas particiones soporta GPT por defecto y cual es su limite de tamano de disco?

a) 4 particiones, 2 TB
b) 64 particiones, 8 ZB
c) 128 particiones, 9.4 ZB
d) 256 particiones, 1 EB

<details>
<summary>Respuesta</summary>

**c) 128 particiones, 9.4 ZB**

GPT (GUID Partition Table) soporta por defecto hasta 128 particiones (ampliable) y puede gestionar discos de hasta 9.4 zettabytes. A diferencia de MBR, GPT no distingue entre particiones primarias, extendidas y logicas: todas las particiones son iguales. Ademas, incluye CRC32 para deteccion de errores y mantiene una copia de respaldo de la tabla al final del disco. MBR esta limitado a 4 particiones primarias y discos de hasta 2 TB.

</details>

---

### Pregunta 7

Que sistema de archivos es el predeterminado en RHEL/CentOS 7+ y tiene como limitacion que NO se puede reducir de tamano?

a) ext4
b) Btrfs
c) XFS
d) ext3

<details>
<summary>Respuesta</summary>

**c) XFS**

XFS es el sistema de archivos predeterminado en Red Hat Enterprise Linux (RHEL) y CentOS desde la version 7. Ofrece alto rendimiento especialmente con archivos grandes y tiene un excelente sistema de journaling. Sin embargo, una limitacion importante es que XFS solo se puede ampliar, nunca reducir. ext4 es el default en muchas otras distribuciones como Debian y Ubuntu. Btrfs soporta snapshots y RAID integrado pero no es el default de RHEL. ext3 es una version anterior con menos funcionalidades.

</details>

---

### Pregunta 8

Un disco NVMe es el segundo controlador del sistema. Como se llamaria el dispositivo y su tercera particion en `/dev/`?

a) `/dev/sdb` y `/dev/sdb3`
b) `/dev/nvme1n1` y `/dev/nvme1n1p3`
c) `/dev/nvme2n1` y `/dev/nvme2n1p3`
d) `/dev/nvme1` y `/dev/nvme1p3`

<details>
<summary>Respuesta</summary>

**b) `/dev/nvme1n1` y `/dev/nvme1n1p3`**

La nomenclatura NVMe sigue el formato `nvme[controlador]n[namespace]p[particion]`. El segundo controlador es `nvme1` (la numeracion empieza en 0), el primer namespace es `n1`, y la tercera particion es `p3`. La nomenclatura `sd*` es para discos SATA/SCSI/USB, no para NVMe. `nvme2n1` seria el tercer controlador, no el segundo. La opcion `d` no incluye el namespace, que es parte obligatoria de la nomenclatura NVMe.

</details>

---

### Pregunta 9

Cual de las siguientes opciones de `mke2fs` realiza una simulacion (dry-run) mostrando lo que haria sin crear realmente el sistema de archivos?

a) `mke2fs -c /dev/sda1`
b) `mke2fs -n /dev/sda1`
c) `mke2fs -L "test" /dev/sda1`
d) `mke2fs -m 5 /dev/sda1`

<details>
<summary>Respuesta</summary>

**b) `mke2fs -n /dev/sda1`**

La opcion `-n` de `mke2fs` realiza un dry-run: muestra toda la informacion sobre el sistema de archivos que se crearia (tamano de bloques, numero de inodos, ubicaciones de superbloques de respaldo, etc.) sin escribir nada en el disco. Es util para planificar y verificar parametros antes de crear el sistema de archivos real. La opcion `-c` verifica bloques defectuosos. La opcion `-L` asigna una etiqueta al volumen. La opcion `-m` establece el porcentaje de bloques reservados para root.

</details>

---

### Pregunta 10

Que sistema de archivos se recomienda para la particion EFI System Partition (ESP) y es compatible con Windows, macOS y Linux?

a) ext4
b) NTFS
c) VFAT (FAT32)
d) Btrfs

<details>
<summary>Respuesta</summary>

**c) VFAT (FAT32)**

La particion EFI System Partition (ESP) requiere el sistema de archivos VFAT (FAT32) segun la especificacion UEFI. VFAT es compatible con Windows, macOS y Linux, lo que lo convierte en el estandar para la ESP y tambien para medios extraibles que necesitan ser leidos en multiples plataformas. Se crea con `mkfs.vfat -F 32 /dev/sdXN`. Su principal limitacion es que el tamano maximo de un archivo individual es de 4 GB. ext4 y Btrfs son sistemas Linux que no son reconocidos nativamente por Windows. NTFS es propiamente de Windows y no se usa para la ESP.

</details>
