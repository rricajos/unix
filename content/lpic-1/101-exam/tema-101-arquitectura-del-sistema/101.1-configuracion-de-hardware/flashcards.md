---
title: "101.1 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "101.1"
---

# Flashcards: 101.1 - Configuracion De Hardware

> 18 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-001">
<div class="flashcard-front">

**P:** Que comando muestra los modulos del kernel que estan actualmente cargados?

</div>
<div class="flashcard-back">

**R:** c) `lsmod`. `lsmod` muestra una lista de todos los modulos del kernel cargados, su tamano y las dependencias. Equivale a leer `/proc/modules`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-002">
<div class="flashcard-front">

**P:** Cual es la diferencia principal entre `modprobe` e `insmod`?

</div>
<div class="flashcard-back">

**R:** c) `modprobe` gestiona dependencias automaticamente. `modprobe` resuelve y carga automaticamente las dependencias del modulo. `insmod` requiere que especifiques la ruta completa del modulo y no maneja dependencias.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-003">
<div class="flashcard-front">

**P:** En que directorio se encuentran las reglas personalizadas de udev?

</div>
<div class="flashcard-back">

**R:** b) `/etc/udev/rules.d/`. Las reglas personalizadas se colocan en `/etc/udev/rules.d/`. Las reglas del sistema estan en `/lib/udev/rules.d/`. Las reglas en `/etc/` tienen prioridad sobre las de `/lib/`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-004">
<div class="flashcard-front">

**P:** Que archivo de /proc contiene informacion sobre las interrupciones (IRQs) del sistema?

</div>
<div class="flashcard-back">

**R:** b) `/proc/interrupts`. `/proc/interrupts` muestra el conteo de interrupciones por CPU y por dispositivo. `/proc/dma` muestra los canales DMA y `/proc/ioports` los puertos de E/S.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-005">
<div class="flashcard-front">

**P:** Que sistema de archivos virtual expone la informacion de dispositivos y drivers del kernel de forma jerarquica?

</div>
<div class="flashcard-back">

**R:** c) sysfs (/sys). `/sys` (sysfs) expone informacion de dispositivos, buses y drivers de forma jerarquica. `/proc` contiene principalmente informacion de procesos y del kernel, aunque tambien tiene algo de info de hardware.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-006">
<div class="flashcard-front">

**P:** Que comando usarias para ver los dispositivos PCI junto con los modulos del kernel que los manejan?

</div>
<div class="flashcard-back">

**R:** b) `lspci -k`. La opcion `-k` de `lspci` muestra el driver del kernel en uso y los modulos del kernel disponibles para cada dispositivo PCI.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-007">
<div class="flashcard-front">

**P:** UEFI utiliza una particion especial para almacenar los cargadores de arranque. Como se llama y donde se monta normalmente?

</div>
<div class="flashcard-back">

**R:** ESP (EFI System Partition). . Se monta normalmente en `/boot/efi`. Debe estar formateada con FAT32 (vfat). Contiene los archivos `.efi` de los cargadores de arranque.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-008">
<div class="flashcard-front">

**P:** Que comando permite monitorizar en tiempo real los eventos de conexion/desconexion de dispositivos?

</div>
<div class="flashcard-back">

**R:** b) `udevadm monitor`. `udevadm monitor` muestra los eventos de udev y del kernel en tiempo real. Es util para depurar problemas de hardware. `dmesg -w` tambien muestra mensajes del kernel en tiempo real pero no es especifico de udev.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-009">
<div class="flashcard-front">

**P:** Que comando descarga un modulo del kernel incluyendo sus dependencias no utilizadas?

</div>
<div class="flashcard-back">

**R:** c) `modprobe -r modulo`. `modprobe -r` descarga el modulo y sus dependencias que no esten siendo utilizadas por otros modulos. `rmmod` solo descarga el modulo especificado sin manejar dependencias.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-010">
<div class="flashcard-front">

**P:** Que archivo contendria una blacklist para evitar que un modulo se cargue automaticamente?

</div>
<div class="flashcard-back">

**R:** b) `/etc/modprobe.d/blacklist.conf`. Los archivos en `/etc/modprobe.d/` pueden contener directivas `blacklist nombre_modulo` para evitar que se carguen automaticamente. El nombre del archivo puede ser cualquiera con extension `.conf`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-011">
<div class="flashcard-front">

**P:** Tip de examen: En distribuciones actuales de Linux, udev es responsable tanto de la deteccion c...

</div>
<div class="flashcard-back">

**R:** En distribuciones actuales de Linux, udev es responsable tanto de la deteccion coldplug (durante el encendido) como de la deteccion hotplug (con el sistema en funcionamiento).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-012">
<div class="flashcard-front">

**P:** Tip de examen: Las funciones deshabilitadas en BIOS/UEFI reducen el consumo de energia y pueden...

</div>
<div class="flashcard-back">

**R:** Las funciones deshabilitadas en BIOS/UEFI reducen el consumo de energia y pueden aumentar la proteccion del sistema. Si el dispositivo incorrecto aparece primero en la lista de arranque, el sistema operativo puede no cargarse.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-013">
<div class="flashcard-front">

**P:** Tip de examen: `/sys/bus/` organiza por tipo de bus, `/sys/class/` organiza por funcion del dis...

</div>
<div class="flashcard-back">

**R:** `/sys/bus/` organiza por tipo de bus, `/sys/class/` organiza por funcion del dispositivo, y `/sys/devices/` es el arbol fisico real. Los dos primeros contienen enlaces simbolicos que apuntan al tercero.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-014">
<div class="flashcard-front">

**P:** Que hace el comando `/proc/cpuinfo`?

</div>
<div class="flashcard-back">

**R:** Informacion del procesador

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `/proc/meminfo`?

</div>
<div class="flashcard-back">

**R:** Informacion de la memoria

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-016">
<div class="flashcard-front">

**P:** Que hace el comando `/proc/interrupts`?

</div>
<div class="flashcard-back">

**R:** IRQs del sistema

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-017">
<div class="flashcard-front">

**P:** Que hace el comando `/proc/ioports`?

</div>
<div class="flashcard-back">

**R:** Puertos de E/S

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.1">
</div>

<div class="flashcard" data-id="101.1-fc-018">
<div class="flashcard-front">

**P:** Que hace el comando `/proc/dma`?

</div>
<div class="flashcard-back">

**R:** Canales DMA

</div>
</div>

---

