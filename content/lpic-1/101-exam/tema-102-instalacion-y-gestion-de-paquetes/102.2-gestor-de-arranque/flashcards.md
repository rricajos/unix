---
title: "102.2 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "102.2"
---

# Flashcards: 102.2 - Gestor De Arranque

> 9 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="102.2">
</div>

<div class="flashcard" data-id="102.2-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: La tecla `Shift` (mantenida) es la forma de mostrar un menu de GRUB oculto en si...

</div>
<div class="flashcard-back">

**R:** La tecla `Shift` (mantenida) es la forma de mostrar un menu de GRUB oculto en sistemas BIOS. En UEFI se usa `Esc`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.2">
</div>

<div class="flashcard" data-id="102.2-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: En `grub rescue>`, la clave es usar `set prefix=` para indicar donde estan los m...

</div>
<div class="flashcard-back">

**R:** En `grub rescue>`, la clave es usar `set prefix=` para indicar donde estan los modulos de GRUB, luego `insmod normal` para cargar el modulo normal y finalmente ejecutar `normal` para volver al menu estandar.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.2">
</div>

<div class="flashcard" data-id="102.2-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `GRUB_DEFAULT`?

</div>
<div class="flashcard-back">

**R:** Entrada por defecto (numero, "saved", o nombre de entrada). Con "saved" recuerda la ultima entrada seleccionada

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.2">
</div>

<div class="flashcard" data-id="102.2-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `GRUB_SAVEDEFAULT`?

</div>
<div class="flashcard-back">

**R:** Si es "true", guarda la ultima entrada seleccionada (requiere `GRUB_DEFAULT=saved`)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.2">
</div>

<div class="flashcard" data-id="102.2-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `GRUB_TIMEOUT`?

</div>
<div class="flashcard-back">

**R:** Segundos de espera del menu. Valor `-1` espera indefinidamente

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.2">
</div>

<div class="flashcard" data-id="102.2-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `GRUB_CMDLINE_LINUX`?

</div>
<div class="flashcard-back">

**R:** Parametros del kernel para **TODAS** las entradas (incluida recovery)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.2">
</div>

<div class="flashcard" data-id="102.2-fc-007">
<div class="flashcard-front">

**P:** Que es/son Introduccion?

</div>
<div class="flashcard-back">

**R:** El gestor de arranque (bootloader) es el primer software que se ejecuta al encender el ordenador (despues del firmware BIOS/UEFI). Su funcion principal es cargar el kernel del sistema operativo en memo

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.2">
</div>

<div class="flashcard" data-id="102.2-fc-008">
<div class="flashcard-front">

**P:** Que es/son 7. GRUB Legacy (version 0.97)?

</div>
<div class="flashcard-back">

**R:** Aunque GRUB Legacy esta obsoleto, el examen puede incluir preguntas sobre sus diferencias con GRUB2.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.2">
</div>

<div class="flashcard" data-id="102.2-fc-009">
<div class="flashcard-front">

**P:** Que es/son Resumen para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **NUNCA editar** `/boot/grub/grub.cfg` directamente. Editar `/etc/default/grub` y ejecutar `update-grub` o `grub-mkconfig`.

</div>
</div>

---

