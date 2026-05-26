---
title: "101.2 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "101.2"
---

# Flashcards: 101.2 - Arranque Del Sistema

> 14 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: Aunque tecnicamente son diferentes, los archivos en `/boot/` todavia suelen llam...

</div>
<div class="flashcard-back">

**R:** Aunque tecnicamente son diferentes, los archivos en `/boot/` todavia suelen llamarse `initrd.img-*` por convencion historica, incluso cuando realmente son initramfs.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: Es importante saber que Upstart existio y fue usado por Ubuntu, pero actualmente...

</div>
<div class="flashcard-back">

**R:** Es importante saber que Upstart existio y fue usado por Ubuntu, pero actualmente systemd es el estandar.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-003">
<div class="flashcard-front">

**P:** Tip de examen: Debido a que el ring buffer es circular y de tamano fijo, los mensajes de arranq...

</div>
<div class="flashcard-back">

**R:** Debido a que el ring buffer es circular y de tamano fijo, los mensajes de arranque se van perdiendo con el tiempo a medida que el sistema genera nuevos mensajes del kernel. Por eso es importante consultar `dmesg` poco despues del arranque si se necesita informacion del boot.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `/boot/grub/grub.cfg`?

</div>
<div class="flashcard-back">

**R:** Archivo de configuracion principal de GRUB2. **NO se debe editar manualmente.** Se genera automaticamente.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `/etc/default/grub`?

</div>
<div class="flashcard-back">

**R:** Archivo con las opciones por defecto de GRUB2. **Este es el archivo que se edita manualmente.**

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `/etc/grub.d/`?

</div>
<div class="flashcard-back">

**R:** Directorio con scripts que generan secciones del archivo `grub.cfg`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-007">
<div class="flashcard-front">

**P:** Que hace el comando `00_header`?

</div>
<div class="flashcard-back">

**R:** Genera la cabecera del archivo de configuracion

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-008">
<div class="flashcard-front">

**P:** Que hace el comando `05_debian_theme`?

</div>
<div class="flashcard-back">

**R:** Configura el fondo y colores (Debian/Ubuntu)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-009">
<div class="flashcard-front">

**P:** Que es/son 1. La secuencia completa de arranque?

</div>
<div class="flashcard-back">

**R:** El proceso de arranque de un sistema Linux sigue una secuencia bien definida. Es fundamental comprender cada etapa para el examen LPIC-1.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-010">
<div class="flashcard-front">

**P:** Que es/son 3. El cargador de arranque GRUB2?

</div>
<div class="flashcard-back">

**R:** GRUB2 (GRand Unified Bootloader version 2) es el cargador de arranque estandar en la mayoria de distribuciones Linux modernas. Ha reemplazado a GRUB Legacy (version 0.97).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-011">
<div class="flashcard-front">

**P:** Que es/son 4. Opciones del kernel en el arranque?

</div>
<div class="flashcard-back">

**R:** Los parametros del kernel se pasan a traves de la linea `linux` en GRUB2. Estos parametros modifican el comportamiento del arranque.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-012">
<div class="flashcard-front">

**P:** Que es/son 6. El proceso init y systemd?

</div>
<div class="flashcard-back">

**R:** Una vez que el kernel ha montado el initramfs y posteriormente el sistema de archivos raiz real, ejecuta el proceso init (PID 1). Este proceso es responsable de iniciar todos los demas servicios del si

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-013">
<div class="flashcard-front">

**P:** Que es/son 7. Registros de arranque?

</div>
<div class="flashcard-back">

**R:** Los registros (logs) de arranque son fundamentales para diagnosticar problemas. Existen varios metodos para consultarlos.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.2">
</div>

<div class="flashcard" data-id="101.2-fc-014">
<div class="flashcard-front">

**P:** Que es/son Resumen para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **Secuencia de arranque:** BIOS/UEFI -> POST -> MBR/GPT -> GRUB2 -> Kernel -> initramfs -> init/systemd -> target/runlevel.

</div>
</div>

---

