---
title: "104.3 Controlar el montaje y desmontaje - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.3"
---

# 104.3 Controlar el montaje y desmontaje - Ejercicios

### Pregunta 1

Cual es la linea correcta de `/etc/fstab` para montar una particion ext4 identificada por UUID en `/home`, con opciones por defecto, sin backup con dump, y que se verifique con fsck despues de la particion raiz?

a) `UUID=a1b2c3d4 /home ext4 defaults 1 1`
b) `UUID=a1b2c3d4 /home ext4 defaults 0 2`
c) `/dev/sda2 /home ext4 defaults 0 0`
d) `UUID=a1b2c3d4 /home ext4 defaults 1 0`

<details>
<summary>Respuesta</summary>

**b) `UUID=a1b2c3d4 /home ext4 defaults 0 2`**

Los 6 campos de `/etc/fstab` son: dispositivo, punto de montaje, tipo, opciones, dump y pass. El campo dump con valor `0` indica que no se hace backup con dump. El campo pass con valor `2` indica que se verifica con fsck despues de la particion raiz (que debe tener pass=1). La opcion `a` tiene dump=1 y pass=1 (solo la raiz deberia tener pass=1). La opcion `c` usa nombre de dispositivo en vez de UUID (no recomendado) y no verifica con fsck (pass=0). La opcion `d` tiene dump=1 y pass=0.

</details>

---

### Pregunta 2

Que opciones estan implicitas cuando se usa `defaults` en `/etc/fstab`?

a) `ro,nosuid,nodev,noexec,auto,nouser,sync`
b) `rw,suid,dev,exec,auto,nouser,async`
c) `rw,suid,dev,exec,noauto,user,async`
d) `rw,nosuid,dev,exec,auto,nouser,sync`

<details>
<summary>Respuesta</summary>

**b) `rw,suid,dev,exec,auto,nouser,async`**

La opcion `defaults` en `/etc/fstab` equivale a la combinacion de: `rw` (lectura-escritura), `suid` (respetar bits SUID/SGID), `dev` (interpretar dispositivos especiales), `exec` (permitir ejecucion de binarios), `auto` (montar con `mount -a`), `nouser` (solo root puede montar) y `async` (escrituras asincronas). Es importante recordar que `defaults` NO incluye `sync` ni opciones restrictivas como `nosuid` o `noexec`. Cuando se usa `user`, automaticamente se aplican `noexec`, `nosuid` y `nodev` por seguridad.

</details>

---

### Pregunta 3

Como se monta una imagen ISO llamada `/home/user/ubuntu.iso` en `/mnt/iso` como solo lectura?

a) `mount /home/user/ubuntu.iso /mnt/iso`
b) `mount -o loop,ro /home/user/ubuntu.iso /mnt/iso`
c) `mount -t iso9660 /home/user/ubuntu.iso /mnt/iso --readonly`
d) `cp /home/user/ubuntu.iso /mnt/iso`

<details>
<summary>Respuesta</summary>

**b) `mount -o loop,ro /home/user/ubuntu.iso /mnt/iso`**

La opcion `loop` crea un dispositivo de bucle (`/dev/loopN`) que permite tratar un archivo como si fuera un dispositivo de bloque, lo cual es necesario para montar imagenes ISO. La opcion `ro` asegura que se monte como solo lectura. Opcionalmente se puede especificar el tipo con `-t iso9660`. La opcion `a` no incluye `loop` ni `ro`. La opcion `c` usa una sintaxis incorrecta (`--readonly` no es una opcion valida de mount; se usa `ro` como opcion de montaje). La opcion `d` simplemente copiaria el archivo, no lo montaria.

</details>

---

### Pregunta 4

Un sistema de archivos esta montado en `/datos` y necesitas cambiarlo a solo lectura sin desmontarlo. Cual es el comando correcto?

a) `mount -o ro /datos`
b) `umount /datos && mount -o ro /datos`
c) `mount -o remount,ro /datos`
d) `chmod -w /datos`

<details>
<summary>Respuesta</summary>

**c) `mount -o remount,ro /datos`**

La opcion `remount` permite cambiar las opciones de un sistema de archivos ya montado sin necesidad de desmontarlo primero. Esto es especialmente util para la particion raiz (`/`), que no se puede desmontar facilmente mientras el sistema esta en ejecucion. La opcion `a` intentaria montar de nuevo sin remontar y fallaria porque ya esta montado. La opcion `b` desmonta y vuelve a montar, lo cual no cumple el requisito de no desmontar. La opcion `d` solo cambia permisos del directorio, no las opciones de montaje del sistema de archivos.

</details>

---

### Pregunta 5

Cual es el significado del valor `2` en el sexto campo (pass) de `/etc/fstab`?

a) El sistema de archivos se verifica con fsck en segundo lugar, antes de la particion raiz
b) El sistema de archivos no se verifica nunca con fsck al arrancar
c) El sistema de archivos se verifica con fsck despues de las particiones con pass=1
d) El sistema de archivos se verifica dos veces con fsck al arrancar

<details>
<summary>Respuesta</summary>

**c) El sistema de archivos se verifica con fsck despues de las particiones con pass=1**

El campo pass de `/etc/fstab` controla el orden de verificacion con fsck al arrancar: `0` significa no verificar, `1` significa verificar primero (reservado exclusivamente para la particion raiz `/`), y `2` significa verificar despues de las particiones con pass=1. Las particiones con pass=2 pueden verificarse en paralelo para mayor eficiencia. El swap y los sistemas de archivos virtuales deben tener pass=0. Solo la particion raiz debe tener pass=1.

</details>

---

### Pregunta 6

Cual de los siguientes comandos muestra el UUID de `/dev/sdb1`?

a) `fdisk -l /dev/sdb1`
b) `blkid /dev/sdb1`
c) `mount /dev/sdb1`
d) `df -h /dev/sdb1`

<details>
<summary>Respuesta</summary>

**b) `blkid /dev/sdb1`**

El comando `blkid` muestra el UUID, tipo de sistema de archivos y etiqueta de los dispositivos de bloque. Su salida tipica es: `/dev/sdb1: UUID="xxxx" TYPE="ext4" LABEL="datos"`. Otras formas de obtener el UUID incluyen `lsblk -f`, `ls -la /dev/disk/by-uuid/` y `tune2fs -l /dev/sdb1 | grep UUID` (solo para ext). `fdisk -l` muestra informacion de particiones pero no el UUID del sistema de archivos. `mount` muestra o realiza montajes. `df -h` muestra espacio en disco, no UUID.

</details>

---

### Pregunta 7

Un administrador intenta desmontar `/mnt/datos` pero recibe el error "target is busy". Cual de los siguientes comandos muestra que procesos estan usando ese punto de montaje?

a) `ps aux | grep /mnt/datos`
b) `lsof /mnt/datos`
c) `top -p /mnt/datos`
d) `df -h /mnt/datos`

<details>
<summary>Respuesta</summary>

**b) `lsof /mnt/datos`**

El comando `lsof` (list open files) muestra todos los archivos abiertos en un punto de montaje especifico, incluyendo los procesos responsables. Otra alternativa es `fuser -mv /mnt/datos`. Una vez identificados los procesos, se pueden cerrar normalmente o matar con `fuser -km /mnt/datos`. Si no se pueden terminar los procesos, se puede usar `umount -l` (lazy unmount) que desconecta inmediatamente y limpia cuando ya no se use. La opcion `a` podria no encontrar procesos que tienen archivos abiertos sin que aparezca la ruta en sus argumentos. `top` y `df` no sirven para este proposito.

</details>

---

### Pregunta 8

Si una unidad systemd `.mount` se llama `mnt-backup-diario.mount`, cual es el punto de montaje correspondiente?

a) `/mnt-backup-diario`
b) `/mnt/backup-diario`
c) `/mnt/backup/diario`
d) `/mount/backup/diario`

<details>
<summary>Respuesta</summary>

**c) `/mnt/backup/diario`**

En systemd, el nombre de una unidad `.mount` se construye reemplazando las barras `/` de la ruta del punto de montaje por guiones `-`, y omitiendo la barra inicial. Por lo tanto, `mnt-backup-diario.mount` corresponde al punto de montaje `/mnt/backup/diario`. Inversamente, para el punto de montaje `/srv/web/static`, la unidad se llamaria `srv-web-static.mount`. Las unidades `.mount` de systemd permiten gestionar montajes con `systemctl start`, `systemctl stop` y `systemctl enable`.

</details>

---

### Pregunta 9

Cual es la fuente mas fiable de informacion sobre los sistemas de archivos actualmente montados en un sistema Linux?

a) `/etc/fstab`
b) `/etc/mtab`
c) `/proc/mounts`
d) La salida del comando `blkid`

<details>
<summary>Respuesta</summary>

**c) `/proc/mounts`**

`/proc/mounts` es un archivo virtual del kernel que muestra los sistemas de archivos actualmente montados en tiempo real, lo que lo convierte en la fuente mas fiable. `/etc/fstab` es la configuracion de montaje deseada pero no refleja necesariamente el estado actual (un administrador podria haber montado o desmontado algo manualmente). `/etc/mtab` en distribuciones modernas suele ser un enlace simbolico a `/proc/self/mounts`, asi que en la practica contiene la misma informacion. `blkid` muestra informacion sobre dispositivos de bloque y sus UUIDs, no sobre montajes actuales.

</details>

---

### Pregunta 10

Que opcion de `/etc/fstab` permite que un usuario normal monte un sistema de archivos, pero automaticamente restringe la ejecucion de binarios, SUID y dispositivos especiales?

a) `defaults`
b) `noauto`
c) `user`
d) `users`

<details>
<summary>Respuesta</summary>

**c) `user`**

La opcion `user` en `/etc/fstab` permite que usuarios normales (no root) monten el sistema de archivos. Por seguridad, automaticamente implica `noexec` (no permitir ejecucion de binarios), `nosuid` (ignorar bits SUID/SGID) y `nodev` (no interpretar dispositivos especiales). Esto evita que un usuario pueda escalar privilegios montando medios con ejecutables SUID. La opcion `defaults` no permite a usuarios normales montar (incluye `nouser`). `noauto` solo evita que se monte con `mount -a`. La opcion `users` es similar a `user`, pero permite que cualquier usuario pueda desmontar el FS, no solo el que lo monto.

</details>
