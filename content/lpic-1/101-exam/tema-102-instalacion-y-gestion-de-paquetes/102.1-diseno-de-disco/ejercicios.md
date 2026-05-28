---
title: "102.1 - Diseno de disco duro: Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.1"
---

# 102.1 - Diseno de disco duro: Ejercicios

### Pregunta 1

Un disco con tabla de particiones MBR tiene actualmente 3 particiones primarias y necesitas crear 4 particiones mas. Cual es la solucion correcta?

a) Crear las 4 particiones adicionales como primarias, ya que MBR permite hasta 8
b) Convertir una de las particiones primarias existentes a logica y crear las 4 nuevas como logicas
c) Crear la 4a particion como extendida y dentro de ella crear las 4 particiones logicas necesarias
d) Eliminar las 3 particiones primarias existentes y recrear todo con particiones logicas

<details><summary>Respuesta</summary>

**c) Crear la 4a particion como extendida y dentro de ella crear las 4 particiones logicas necesarias**

MBR permite un maximo de 4 particiones primarias. La solucion es usar la 4a entrada como particion extendida, que actua como contenedor para multiples particiones logicas. Las particiones logicas se numeran a partir de 5 (sda5, sda6, etc.). No es posible convertir una particion primaria existente a logica sin eliminarla, y MBR no soporta mas de 4 entradas primarias.

</details>

---

### Pregunta 2

Cual es el tamano maximo de disco soportado por una tabla de particiones MBR?

a) 1 TB
b) 2 TB
c) 4 TB
d) 8 ZB

<details><summary>Respuesta</summary>

**b) 2 TB**

MBR utiliza direcciones de 32 bits para los sectores del disco, lo que resulta en un maximo de 2^32 sectores x 512 bytes = 2 TB. Para discos mayores de 2 TB se debe usar GPT (GUID Partition Table), que soporta hasta 8 ZB teoricos. GPT ademas ofrece ventajas como redundancia de la tabla de particiones y verificacion CRC32.

</details>

---

### Pregunta 3

En un servidor web con alto trafico que genera muchos logs, cual de los siguientes directorios es MAS importante separar en una particion independiente para proteger la estabilidad del sistema?

a) `/home`
b) `/usr`
c) `/var`
d) `/opt`

<details><summary>Respuesta</summary>

**c) `/var`**

El directorio `/var` contiene los logs del servidor web (Apache/Nginx), cache y datos variables que crecen de forma impredecible. Si los logs crecen sin control y `/var` comparte particion con `/`, la particion raiz podria llenarse completamente, provocando la caida del sistema. Separar `/var` en su propia particion evita que los logs excesivos afecten al resto del sistema operativo.

</details>

---

### Pregunta 4

Que sistema de archivos debe tener obligatoriamente la EFI System Partition (ESP)?

a) ext4
b) NTFS
c) FAT32
d) XFS

<details><summary>Respuesta</summary>

**c) FAT32**

La especificacion UEFI requiere que la ESP (EFI System Partition) este formateada en FAT32. Esta particion se monta tipicamente en `/boot/efi`, tiene un tamano recomendado de 100-550 MB, y se identifica por el tipo de particion `EF00` en GPT. Contiene los cargadores de arranque (.efi) de los sistemas operativos instalados, cada uno en un subdirectorio propio como `/boot/efi/EFI/ubuntu/`.

</details>

---

### Pregunta 5

En LVM, cual es el orden correcto de los componentes desde el nivel fisico hasta el nivel logico?

a) LV -> VG -> PV
b) VG -> PV -> LV
c) PV -> VG -> LV
d) PV -> LV -> VG

<details><summary>Respuesta</summary>

**c) PV -> VG -> LV**

El flujo de LVM es: primero se crean los Physical Volumes (PV) con `pvcreate` sobre las particiones o discos fisicos. Luego se agrupan en un Volume Group (VG) con `vgcreate`, formando un pool de almacenamiento. Finalmente, se crean Logical Volumes (LV) con `lvcreate` dentro del VG, que actuan como particiones virtuales sobre las cuales se crean los sistemas de archivos.

</details>

---

### Pregunta 6

Un sistema con 4 GB de RAM necesita soporte para hibernacion. Cual es el tamano minimo recomendado para la particion de swap?

a) 2 GB (mitad de la RAM)
b) 4 GB (igual a la RAM)
c) 8 GB (doble de la RAM)
d) No se necesita swap para hibernacion

<details><summary>Respuesta</summary>

**b) 4 GB (igual a la RAM)**

La hibernacion vuelca todo el contenido de la memoria RAM al espacio de swap, por lo que el swap debe ser al menos igual al tamano de la RAM. Con 4 GB de RAM, se necesitan al menos 4 GB de swap (idealmente un poco mas, como 5-6 GB). Sin espacio de swap suficiente, la hibernacion fallaria porque no hay donde almacenar el estado completo de la memoria.

</details>

---

### Pregunta 7

Cual es la diferencia principal entre `parted` y `fdisk`/`gdisk` al realizar cambios en las particiones?

a) `parted` solo soporta MBR mientras que `fdisk` y `gdisk` soportan GPT
b) `parted` aplica los cambios inmediatamente, mientras que `fdisk` y `gdisk` esperan hasta que se ejecute el comando `w`
c) `fdisk` y `gdisk` aplican los cambios inmediatamente, mientras que `parted` los almacena en buffer
d) `parted` solo funciona en modo no interactivo

<details><summary>Respuesta</summary>

**b) `parted` aplica los cambios inmediatamente, mientras que `fdisk` y `gdisk` esperan hasta que se ejecute el comando `w`**

Esta es una diferencia critica entre las herramientas de particionado. En `fdisk` y `gdisk`, los cambios no se escriben en el disco hasta que el usuario pulsa `w` (write), lo que permite deshacer errores con `q` (quit). En `parted`, cada comando se ejecuta inmediatamente sobre el disco, lo que lo hace mas peligroso si se comete un error, ya que no se pueden deshacer los cambios.

</details>

---

### Pregunta 8

Cual es la linea correcta en `/etc/fstab` para montar la particion con UUID `a1b2-c3d4` en `/home` con sistema de archivos ext4, opciones por defecto con `nosuid`, y verificacion con fsck despues de la raiz?

a) `UUID=a1b2-c3d4  /home  ext4  defaults,nosuid  0  1`
b) `UUID=a1b2-c3d4  /home  ext4  defaults,nosuid  0  2`
c) `/dev/sda2  /home  ext4  defaults,nosuid  1  1`
d) `UUID=a1b2-c3d4  /home  ext4  nosuid  0  0`

<details><summary>Respuesta</summary>

**b) `UUID=a1b2-c3d4  /home  ext4  defaults,nosuid  0  2`**

El sexto campo (pass) controla el orden de verificacion con `fsck`: 0 significa no verificar, 1 es para la particion raiz `/` (se verifica primero), y 2 es para el resto de particiones (se verifican despues de la raiz). Usar UUID es mas fiable que nombres de dispositivo como `/dev/sdX` porque los nombres pueden cambiar al anadir o quitar discos. La opcion `nosuid` impide la ejecucion de programas con bits SUID en esa particion.

</details>

---

### Pregunta 9

Cuantas particiones permite GPT por defecto?

a) 4 particiones primarias
b) 16 particiones
c) 64 particiones
d) 128 particiones

<details><summary>Respuesta</summary>

**d) 128 particiones**

GPT (GUID Partition Table) permite 128 particiones por defecto, un numero ampliable. A diferencia de MBR, GPT no necesita el concepto de particiones extendidas o logicas: todas las particiones son iguales. Ademas, GPT ofrece redundancia almacenando una copia de la tabla de particiones al final del disco, utiliza CRC32 para detectar errores y asigna un GUID unico a cada particion.

</details>

---

### Pregunta 10

Que comandos se utilizan para crear y activar una particion de swap en `/dev/sda3`?

a) `format swap /dev/sda3` y luego `mount /dev/sda3 swap`
b) `mkswap /dev/sda3` y luego `swapon /dev/sda3`
c) `fdisk -swap /dev/sda3` y luego `swapon /dev/sda3`
d) `mkfs.swap /dev/sda3` y luego `mount -t swap /dev/sda3`

<details><summary>Respuesta</summary>

**b) `mkswap /dev/sda3` y luego `swapon /dev/sda3`**

El comando `mkswap` formatea la particion como espacio de intercambio (swap) y `swapon` la activa para que el sistema comience a usarla. Para verificar que esta activa se pueden usar `swapon --show` o `free -h`. Para desactivarla se usa `swapoff /dev/sda3`. Para que sea permanente, se debe anadir una entrada en `/etc/fstab` con el formato: `UUID=<uuid>  none  swap  sw  0  0`.

</details>
