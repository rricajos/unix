---
title: "104.3 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "104.3"
---

# Flashcards: 104.3 - Montaje Y Desmontaje

> 19 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-001">
<div class="flashcard-front">

**P:** Cual es la linea correcta de `/etc/fstab` para montar una particion ext4 identificada por UUID en `/home`, con opciones por defecto, sin backup con dump, y que se verifique con fsck despues de la particion raiz?

</div>
<div class="flashcard-back">

**R:** b) `UUID=a1b2c3d4 /home ext4 defaults 0 2`. Los 6 campos de `/etc/fstab` son: dispositivo, punto de montaje, tipo, opciones, dump y pass. El campo dump con valor `0` indica que no se hace backup con dump. El campo pass con valor `2` indica que se verifica con fsck despues de la particion raiz (que debe tener pass=1). La opcion `a` tiene dump=1 y pass=1 (solo la raiz deberia tener pass=1). La opcion `c` usa nombre de dispositivo en vez de UUID (no recomendado) y no verifica con fsck (pass=0). La opcion `d` tiene dump=1 y pass=0.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-002">
<div class="flashcard-front">

**P:** Que opciones estan implicitas cuando se usa `defaults` en `/etc/fstab`?

</div>
<div class="flashcard-back">

**R:** b) `rw,suid,dev,exec,auto,nouser,async`. La opcion `defaults` en `/etc/fstab` equivale a la combinacion de: `rw` (lectura-escritura), `suid` (respetar bits SUID/SGID), `dev` (interpretar dispositivos especiales), `exec` (permitir ejecucion de binarios), `auto` (montar con `mount -a`), `nouser` (solo root puede montar) y `async` (escrituras asincronas). Es importante recordar que `defaults` NO incluye `sync` ni opciones restrictivas como `nosuid` o `noexec`. Cuando se usa `user`, automaticamente se aplican `noexec`, `nosuid` y `nodev` por seguridad.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-003">
<div class="flashcard-front">

**P:** Como se monta una imagen ISO llamada `/home/user/ubuntu.iso` en `/mnt/iso` como solo lectura?

</div>
<div class="flashcard-back">

**R:** b) `mount -o loop,ro /home/user/ubuntu.iso /mnt/iso`. La opcion `loop` crea un dispositivo de bucle (`/dev/loopN`) que permite tratar un archivo como si fuera un dispositivo de bloque, lo cual es necesario para montar imagenes ISO. La opcion `ro` asegura que se monte como solo lectura. Opcionalmente se puede especificar el tipo con `-t iso9660`. La opcion `a` no incluye `loop` ni `ro`. La opcion `c` usa una sintaxis incorrecta (`--readonly` no es una opcion valida de mount; se usa `ro` como opcion de montaje). La opcion `d` simplemente copiaria el archivo, no lo montaria.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-004">
<div class="flashcard-front">

**P:** Un sistema de archivos esta montado en `/datos` y necesitas cambiarlo a solo lectura sin desmontarlo. Cual es el comando correcto?

</div>
<div class="flashcard-back">

**R:** c) `mount -o remount,ro /datos`. La opcion `remount` permite cambiar las opciones de un sistema de archivos ya montado sin necesidad de desmontarlo primero. Esto es especialmente util para la particion raiz (`/`), que no se puede desmontar facilmente mientras el sistema esta en ejecucion. La opcion `a` intentaria montar de nuevo sin remontar y fallaria porque ya esta montado. La opcion `b` desmonta y vuelve a montar, lo cual no cumple el requisito de no desmontar. La opcion `d` solo cambia permisos del directorio, no las opciones de montaje del sistema de archivos.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-005">
<div class="flashcard-front">

**P:** Cual es el significado del valor `2` en el sexto campo (pass) de `/etc/fstab`?

</div>
<div class="flashcard-back">

**R:** c) El sistema de archivos se verifica con fsck despues de las particiones con pass=1. El campo pass de `/etc/fstab` controla el orden de verificacion con fsck al arrancar: `0` significa no verificar, `1` significa verificar primero (reservado exclusivamente para la particion raiz `/`), y `2` significa verificar despues de las particiones con pass=1. Las particiones con pass=2 pueden verificarse en paralelo para mayor eficiencia. El swap y los sistemas de archivos virtuales deben tener pass=0. Solo la particion raiz debe tener pass=1.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-006">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos muestra el UUID de `/dev/sdb1`?

</div>
<div class="flashcard-back">

**R:** b) `blkid /dev/sdb1`. El comando `blkid` muestra el UUID, tipo de sistema de archivos y etiqueta de los dispositivos de bloque. Su salida tipica es: `/dev/sdb1: UUID="xxxx" TYPE="ext4" LABEL="datos"`. Otras formas de obtener el UUID incluyen `lsblk -f`, `ls -la /dev/disk/by-uuid/` y `tune2fs -l /dev/sdb1 | grep UUID` (solo para ext). `fdisk -l` muestra informacion de particiones pero no el UUID del sistema de archivos. `mount` muestra o realiza montajes. `df -h` muestra espacio en disco, no UUID.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-007">
<div class="flashcard-front">

**P:** Un administrador intenta desmontar `/mnt/datos` pero recibe el error "target is busy". Cual de los siguientes comandos muestra que procesos estan usando ese punto de montaje?

</div>
<div class="flashcard-back">

**R:** b) `lsof /mnt/datos`. El comando `lsof` (list open files) muestra todos los archivos abiertos en un punto de montaje especifico, incluyendo los procesos responsables. Otra alternativa es `fuser -mv /mnt/datos`. Una vez identificados los procesos, se pueden cerrar normalmente o matar con `fuser -km /mnt/datos`. Si no se pueden terminar los procesos, se puede usar `umount -l` (lazy unmount) que desconecta inmediatamente y limpia cuando ya no se use. La opcion `a` podria no encontrar procesos que tienen archivos abiertos sin que aparezca la ruta en sus argumentos. `top` y `df` no sirven para este proposito.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-008">
<div class="flashcard-front">

**P:** Si una unidad systemd `.mount` se llama `mnt-backup-diario.mount`, cual es el punto de montaje correspondiente?

</div>
<div class="flashcard-back">

**R:** c) `/mnt/backup/diario`. En systemd, el nombre de una unidad `.mount` se construye reemplazando las barras `/` de la ruta del punto de montaje por guiones `-`, y omitiendo la barra inicial. Por lo tanto, `mnt-backup-diario.mount` corresponde al punto de montaje `/mnt/backup/diario`. Inversamente, para el punto de montaje `/srv/web/static`, la unidad se llamaria `srv-web-static.mount`. Las unidades `.mount` de systemd permiten gestionar montajes con `systemctl start`, `systemctl stop` y `systemctl enable`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-009">
<div class="flashcard-front">

**P:** Cual es la fuente mas fiable de informacion sobre los sistemas de archivos actualmente montados en un sistema Linux?

</div>
<div class="flashcard-back">

**R:** c) `/proc/mounts`. `/proc/mounts` es un archivo virtual del kernel que muestra los sistemas de archivos actualmente montados en tiempo real, lo que lo convierte en la fuente mas fiable. `/etc/fstab` es la configuracion de montaje deseada pero no refleja necesariamente el estado actual (un administrador podria haber montado o desmontado algo manualmente). `/etc/mtab` en distribuciones modernas suele ser un enlace simbolico a `/proc/self/mounts`, asi que en la practica contiene la misma informacion. `blkid` muestra informacion sobre dispositivos de bloque y sus UUIDs, no sobre montajes actuales.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-010">
<div class="flashcard-front">

**P:** Que opcion de `/etc/fstab` permite que un usuario normal monte un sistema de archivos, pero automaticamente restringe la ejecucion de binarios, SUID y dispositivos especiales?

</div>
<div class="flashcard-back">

**R:** c) `user`. La opcion `user` en `/etc/fstab` permite que usuarios normales (no root) monten el sistema de archivos. Por seguridad, automaticamente implica `noexec` (no permitir ejecucion de binarios), `nosuid` (ignorar bits SUID/SGID) y `nodev` (no interpretar dispositivos especiales). Esto evita que un usuario pueda escalar privilegios montando medios con ejecutables SUID. La opcion `defaults` no permite a usuarios normales montar (incluye `nouser`). `noauto` solo evita que se monte con `mount -a`. La opcion `users` es similar a `user`, pero permite que cualquier usuario pueda desmontar el FS, no solo el que lo monto.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-011">
<div class="flashcard-front">

**P:** Tip de examen: `/proc/mounts` es la fuente autoritativa de montajes actuales. `/etc/fstab` es l...

</div>
<div class="flashcard-back">

**R:** `/proc/mounts` es la fuente autoritativa de montajes actuales. `/etc/fstab` es la configuracion deseada pero no necesariamente refleja el estado real. En distribuciones modernas, `/etc/mtab` es generalmente un enlace simbolico a `/proc/self/mounts`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-012">
<div class="flashcard-front">

**P:** Que hace el comando `ro`?

</div>
<div class="flashcard-back">

**R:** Solo lectura (read-only)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-013">
<div class="flashcard-front">

**P:** Que hace el comando `rw`?

</div>
<div class="flashcard-back">

**R:** Lectura-escritura (predeterminado)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-014">
<div class="flashcard-front">

**P:** Que hace el comando `noexec`?

</div>
<div class="flashcard-back">

**R:** No permitir ejecucion de binarios

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `exec`?

</div>
<div class="flashcard-back">

**R:** Permitir ejecucion (predeterminado)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-016">
<div class="flashcard-front">

**P:** Que hace el comando `nosuid`?

</div>
<div class="flashcard-back">

**R:** Ignorar bits SUID y SGID

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-017">
<div class="flashcard-front">

**P:** Que es/son 1. Concepto de montaje?

</div>
<div class="flashcard-back">

**R:** En Linux, para acceder al contenido de un sistema de archivos (particion, disco USB, imagen ISO, etc.), es necesario **montarlo** en un directorio del arbol de directorios. Este directorio se llama **p

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-018">
<div class="flashcard-front">

**P:** Que es/son 6. Unidades de montaje de systemd?

</div>
<div class="flashcard-back">

**R:** En sistemas con systemd, los montajes de `/etc/fstab` se traducen automaticamente a unidades `.mount`. Tambien se pueden crear unidades de montaje manualmente.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-019">
<div class="flashcard-front">

**P:** Que es/son 7. Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **`/etc/fstab` tiene 6 campos:** dispositivo, punto de montaje, tipo, opciones, dump, pass.

</div>
</div>

---

