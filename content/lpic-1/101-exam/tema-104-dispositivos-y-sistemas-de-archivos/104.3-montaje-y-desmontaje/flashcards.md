---
title: "104.3 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "104.3"
---

# Flashcards: 104.3 - Montaje Y Desmontaje

> 9 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="104.3">
</div>

<div class="flashcard" data-id="104.3-fc-001">
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

<div class="flashcard" data-id="104.3-fc-002">
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

<div class="flashcard" data-id="104.3-fc-003">
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

<div class="flashcard" data-id="104.3-fc-004">
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

<div class="flashcard" data-id="104.3-fc-005">
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

<div class="flashcard" data-id="104.3-fc-006">
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

<div class="flashcard" data-id="104.3-fc-007">
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

<div class="flashcard" data-id="104.3-fc-008">
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

<div class="flashcard" data-id="104.3-fc-009">
<div class="flashcard-front">

**P:** Que es/son 7. Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **`/etc/fstab` tiene 6 campos:** dispositivo, punto de montaje, tipo, opciones, dump, pass.

</div>
</div>

---

