---
title: "102.3 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "102.3"
---

# Flashcards: 102.3 - Bibliotecas Compartidas

> 13 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: El soname solo incluye la version mayor (ej: `libfuse.so.2`). Esto permite actua...

</div>
<div class="flashcard-back">

**R:** El soname solo incluye la version mayor (ej: `libfuse.so.2`). Esto permite actualizar la version menor y revision sin romper la compatibilidad con los programas que dependen de la biblioteca.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: `ldconfig -p` muestra el contenido de la cache (util para verificar si una bibli...

</div>
<div class="flashcard-back">

**R:** `ldconfig -p` muestra el contenido de la cache (util para verificar si una biblioteca esta registrada). `ldconfig -v` muestra el proceso de escaneo con detalle (util para depurar problemas de bibliotecas).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `lib`?

</div>
<div class="flashcard-back">

**R:** Prefijo estandar

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `NOMBRE`?

</div>
<div class="flashcard-back">

**R:** Nombre de la biblioteca

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `.so`?

</div>
<div class="flashcard-back">

**R:** Shared Object

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `MAYOR`?

</div>
<div class="flashcard-back">

**R:** Version mayor (cambios incompatibles)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-007">
<div class="flashcard-front">

**P:** Que hace el comando `MENOR`?

</div>
<div class="flashcard-back">

**R:** Version menor (nuevas funcionalidades compatibles)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-008">
<div class="flashcard-front">

**P:** Que es/son Introduccion?

</div>
<div class="flashcard-back">

**R:** Las bibliotecas compartidas (shared libraries) son archivos que contienen codigo compilado reutilizable por multiples programas. En lugar de incluir todo el codigo necesario dentro de cada ejecutable (

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-009">
<div class="flashcard-front">

**P:** Que es/son 2. Convencion de nombres?

</div>
<div class="flashcard-back">

**R:** Las bibliotecas compartidas siguen una convencion de nombres estricta:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-010">
<div class="flashcard-front">

**P:** Que es/son 4. ldd - Listar dependencias de bibliotecas?

</div>
<div class="flashcard-back">

**R:** El comando `ldd` muestra las bibliotecas compartidas que necesita un programa ejecutable.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-011">
<div class="flashcard-front">

**P:** Que es/son 7. LD_LIBRARY_PATH?

</div>
<div class="flashcard-back">

**R:** Variable de entorno que permite especificar directorios adicionales donde buscar bibliotecas **sin necesidad de ser root** ni modificar archivos del sistema.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-012">
<div class="flashcard-front">

**P:** Que es/son 8. El cargador dinamico (Dynamic Linker)?

</div>
<div class="flashcard-back">

**R:** El programa `/lib64/ld-linux-x86-64.so.2` (en 64 bits) o `/lib/ld-linux.so.2` (en 32 bits) es el responsable de:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.3">
</div>

<div class="flashcard" data-id="102.3-fc-013">
<div class="flashcard-front">

**P:** Que es/son Resumen para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **ldd** muestra las dependencias de bibliotecas de un ejecutable.

</div>
</div>

---

