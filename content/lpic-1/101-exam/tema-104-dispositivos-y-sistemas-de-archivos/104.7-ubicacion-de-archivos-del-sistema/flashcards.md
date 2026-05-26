---
title: "104.7 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "104.7"
---

# Flashcards: 104.7 - Ubicacion De Archivos Del Sistema

> 9 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: `locate -b` (basename) restringe la busqueda al nombre del archivo solamente, ig...

</div>
<div class="flashcard-back">

**R:** `locate -b` (basename) restringe la busqueda al nombre del archivo solamente, ignorando la ruta. Sin `-b`, `locate passwd` encontraria tanto `/etc/passwd` como `/documentos/passwd_info/datos.txt` (porque la ruta contiene "passwd").

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: Es importante saber que `updatedb` se ejecuta automaticamente a traves de cron (...

</div>
<div class="flashcard-back">

**R:** Es importante saber que `updatedb` se ejecuta automaticamente a traves de cron (generalmente a diario). Los archivos creados despues de la ultima ejecucion de `updatedb` no apareceran en los resultados de `locate` hasta la proxima actualizacion.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `/bin`?

</div>
<div class="flashcard-back">

**R:** Binarios esenciales del sistema

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `/sbin`?

</div>
<div class="flashcard-back">

**R:** Binarios esenciales de administracion

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `/lib`?

</div>
<div class="flashcard-back">

**R:** Bibliotecas compartidas esenciales

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `/lib64`?

</div>
<div class="flashcard-back">

**R:** Bibliotecas de 64 bits

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-007">
<div class="flashcard-front">

**P:** Que hace el comando `/usr`?

</div>
<div class="flashcard-back">

**R:** Jerarquia secundaria para datos de solo lectura del usuario

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-008">
<div class="flashcard-front">

**P:** Que es/son 1. FHS - Filesystem Hierarchy Standard?

</div>
<div class="flashcard-back">

**R:** El **FHS** (Filesystem Hierarchy Standard) es un estandar que define la estructura de directorios y su contenido en sistemas Linux/Unix. Su objetivo es garantizar la interoperabilidad entre distribucio

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.7">
</div>

<div class="flashcard" data-id="104.7-fc-009">
<div class="flashcard-front">

**P:** Que es/son 4. Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **`/bin` y `/sbin`** contienen binarios esenciales. En distros modernas con **UsrMerge**, son enlaces simbolicos a `/usr/bin` y `/usr/sbin`.

</div>
</div>

---

