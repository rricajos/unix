---
title: "104.1 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "104.1"
---

# Flashcards: 104.1 - Particiones Y Sistemas De Archivos

> 19 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-001">
<div class="flashcard-front">

**P:** Un disco con tabla de particiones MBR ya tiene 3 particiones primarias. Un administrador necesita crear 3 particiones adicionales. Cual de las siguientes estrategias es correcta?

</div>
<div class="flashcard-back">

**R:** c) Crear la 4ta particion como extendida y dentro de ella crear 3 particiones logicas. MBR permite un maximo de 4 particiones primarias. Para superar este limite, se crea la 4ta particion como extendida (contenedor), y dentro de ella se crean particiones logicas. Las particiones logicas siempre se numeran a partir de 5 (por ejemplo, `sda5`, `sda6`, `sda7`), independientemente del numero de particiones primarias existentes. No es necesario eliminar particiones primarias ni convertir a GPT para resolver esta situacion.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-002">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos crea un sistema de archivos ext4 en `/dev/sdb1`?

</div>
<div class="flashcard-back">

**R:** b) `mkfs -t ext4 /dev/sdb1`. El comando `mkfs` (make filesystem) con la opcion `-t ext4` crea un sistema de archivos ext4 en la particion indicada. Esto es equivalente a ejecutar `mkfs.ext4 /dev/sdb1`. La opcion `format` no es un comando Linux estandar. `fsck.ext4` se usa para verificar y reparar sistemas de archivos, no para crearlos. `mount` monta un sistema de archivos ya existente en un punto de montaje.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-003">
<div class="flashcard-front">

**P:** Cual es una diferencia fundamental entre `fdisk` y `parted` respecto a la aplicacion de cambios?

</div>
<div class="flashcard-back">

**R:** b) `parted` aplica los cambios inmediatamente, mientras que `fdisk` espera al comando `w` para escribirlos. Esta es una diferencia critica para el examen LPIC-1. En `fdisk` (y `gdisk`), los cambios se almacenan en memoria y no se escriben en disco hasta que se ejecuta el comando `w` (write). Se puede salir sin guardar con `q`. En cambio, `parted` aplica cada operacion de forma inmediata al ejecutarla, sin posibilidad de deshacer. Esto hace que `parted` sea potencialmente mas peligroso si se cometen errores.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-004">
<div class="flashcard-front">

**P:** Un administrador necesita preparar un archivo swap de 2 GB. Cual de las siguientes secuencias de comandos es correcta?

</div>
<div class="flashcard-back">

**R:** c) `dd if=/dev/zero of=/swapfile bs=1M count=2048 && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`. La secuencia correcta es: primero crear el archivo con `dd`, luego establecer permisos seguros `600` (solo root puede leer y escribir), despues formatear como swap con `mkswap`, y finalmente activar con `swapon`. La opcion `a` intenta formatear antes de crear el archivo. La opcion `b` usa permisos `666` que son inseguros para un archivo swap. La opcion `d` establece los permisos despues de activar el swap, lo cual no sigue las buenas practicas de seguridad.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-005">
<div class="flashcard-front">

**P:** Cual es el codigo hexadecimal de tipo de particion MBR para Linux swap?

</div>
<div class="flashcard-back">

**R:** c) `82`. El codigo hexadecimal `82` identifica una particion Linux swap en la tabla MBR. Los otros codigos importantes son: `83` para particiones Linux normales (ext2/ext3/ext4, etc.), `8e` para Linux LVM, y `fd` para Linux RAID autodetect. Estos codigos se establecen con el comando `t` dentro de `fdisk`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-006">
<div class="flashcard-front">

**P:** Cuantas particiones soporta GPT por defecto y cual es su limite de tamano de disco?

</div>
<div class="flashcard-back">

**R:** c) 128 particiones, 9.4 ZB. GPT (GUID Partition Table) soporta por defecto hasta 128 particiones (ampliable) y puede gestionar discos de hasta 9.4 zettabytes. A diferencia de MBR, GPT no distingue entre particiones primarias, extendidas y logicas: todas las particiones son iguales. Ademas, incluye CRC32 para deteccion de errores y mantiene una copia de respaldo de la tabla al final del disco. MBR esta limitado a 4 particiones primarias y discos de hasta 2 TB.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-007">
<div class="flashcard-front">

**P:** Que sistema de archivos es el predeterminado en RHEL/CentOS 7+ y tiene como limitacion que NO se puede reducir de tamano?

</div>
<div class="flashcard-back">

**R:** c) XFS. XFS es el sistema de archivos predeterminado en Red Hat Enterprise Linux (RHEL) y CentOS desde la version 7. Ofrece alto rendimiento especialmente con archivos grandes y tiene un excelente sistema de journaling. Sin embargo, una limitacion importante es que XFS solo se puede ampliar, nunca reducir. ext4 es el default en muchas otras distribuciones como Debian y Ubuntu. Btrfs soporta snapshots y RAID integrado pero no es el default de RHEL. ext3 es una version anterior con menos funcionalidades.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-008">
<div class="flashcard-front">

**P:** Un disco NVMe es el segundo controlador del sistema. Como se llamaria el dispositivo y su tercera particion en `/dev/`?

</div>
<div class="flashcard-back">

**R:** b) `/dev/nvme1n1` y `/dev/nvme1n1p3`. La nomenclatura NVMe sigue el formato `nvme[controlador]n[namespace]p[particion]`. El segundo controlador es `nvme1` (la numeracion empieza en 0), el primer namespace es `n1`, y la tercera particion es `p3`. La nomenclatura `sd*` es para discos SATA/SCSI/USB, no para NVMe. `nvme2n1` seria el tercer controlador, no el segundo. La opcion `d` no incluye el namespace, que es parte obligatoria de la nomenclatura NVMe.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-009">
<div class="flashcard-front">

**P:** Cual de las siguientes opciones de `mke2fs` realiza una simulacion (dry-run) mostrando lo que haria sin crear realmente el sistema de archivos?

</div>
<div class="flashcard-back">

**R:** b) `mke2fs -n /dev/sda1`. La opcion `-n` de `mke2fs` realiza un dry-run: muestra toda la informacion sobre el sistema de archivos que se crearia (tamano de bloques, numero de inodos, ubicaciones de superbloques de respaldo, etc.) sin escribir nada en el disco. Es util para planificar y verificar parametros antes de crear el sistema de archivos real. La opcion `-c` verifica bloques defectuosos. La opcion `-L` asigna una etiqueta al volumen. La opcion `-m` establece el porcentaje de bloques reservados para root.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-010">
<div class="flashcard-front">

**P:** Que sistema de archivos se recomienda para la particion EFI System Partition (ESP) y es compatible con Windows, macOS y Linux?

</div>
<div class="flashcard-back">

**R:** c) VFAT (FAT32). La particion EFI System Partition (ESP) requiere el sistema de archivos VFAT (FAT32) segun la especificacion UEFI. VFAT es compatible con Windows, macOS y Linux, lo que lo convierte en el estandar para la ESP y tambien para medios extraibles que necesitan ser leidos en multiples plataformas. Se crea con `mkfs.vfat -F 32 /dev/sdXN`. Su principal limitacion es que el tamano maximo de un archivo individual es de 4 GB. ext4 y Btrfs son sistemas Linux que no son reconocidos nativamente por Windows. NTFS es propiamente de Windows y no se usa para la ESP.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-011">
<div class="flashcard-front">

**P:** Tip de examen: `mke2fs` es equivalente a `mkfs.ext2/ext3/ext4`. La opcion `-n` (dry-run) es imp...

</div>
<div class="flashcard-back">

**R:** `mke2fs` es equivalente a `mkfs.ext2/ext3/ext4`. La opcion `-n` (dry-run) es importante para verificar parametros antes de crear el FS. La opcion `-b` para el tamano de bloque y `-L` para la etiqueta son las mas preguntadas.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-012">
<div class="flashcard-front">

**P:** Que hace el comando `/dev/sda`?

</div>
<div class="flashcard-back">

**R:** Primer disco SATA/SCSI/USB

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-013">
<div class="flashcard-front">

**P:** Que hace el comando `/dev/sdb`?

</div>
<div class="flashcard-back">

**R:** Segundo disco SATA/SCSI/USB

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-014">
<div class="flashcard-front">

**P:** Que hace el comando `/dev/sda1`?

</div>
<div class="flashcard-back">

**R:** Primera particion del primer disco

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `/dev/sda2`?

</div>
<div class="flashcard-back">

**R:** Segunda particion del primer disco

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-016">
<div class="flashcard-front">

**P:** Que hace el comando `/dev/nvme0n1`?

</div>
<div class="flashcard-back">

**R:** Primer disco NVMe

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-017">
<div class="flashcard-front">

**P:** Que es/son 1. Dispositivos de bloque en Linux?

</div>
<div class="flashcard-back">

**R:** En Linux, los discos y particiones se representan como archivos especiales de dispositivo en `/dev/`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-018">
<div class="flashcard-front">

**P:** Que es/son 5. Gestion del espacio swap?

</div>
<div class="flashcard-back">

**R:** El swap es espacio en disco usado como extension de la RAM cuando esta se agota.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-019">
<div class="flashcard-front">

**P:** Que es/son 6. Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **MBR vs GPT:** MBR soporta hasta 4 particiones primarias y discos de hasta 2 TB. GPT soporta 128+ particiones y discos enormes.

</div>
</div>

---

