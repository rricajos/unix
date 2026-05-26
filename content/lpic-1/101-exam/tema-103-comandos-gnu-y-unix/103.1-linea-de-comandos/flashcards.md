---
title: "103.1 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "103.1"
---

# Flashcards: 103.1 - Linea De Comandos

> 16 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: `apropos` = `man -k` (buscar). `whatis` = `man -f` (descripcion corta).

</div>
<div class="flashcard-back">

**R:** `apropos` = `man -k` (buscar). `whatis` = `man -f` (descripcion corta).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: `man` y `info` son para comandos externos. `help` es exclusivo para builtins de ...

</div>
<div class="flashcard-back">

**R:** `man` y `info` son para comandos externos. `help` es exclusivo para builtins de bash. Por ejemplo, `man cd` puede no existir, pero `help cd` siempre funciona en bash.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-003">
<div class="flashcard-front">

**P:** Tip de examen: `uname -r` para version del kernel y `uname -a` para toda la informacion son los...

</div>
<div class="flashcard-back">

**R:** `uname -r` para version del kernel y `uname -a` para toda la informacion son los mas preguntados.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-004">
<div class="flashcard-front">

**P:** Tip de examen: Es muy comun que `~/.bash_profile` contenga un `source ~/.bashrc` para reutiliza...

</div>
<div class="flashcard-back">

**R:** Es muy comun que `~/.bash_profile` contenga un `source ~/.bashrc` para reutilizar la configuracion. Asi, los alias y funciones definidos en `.bashrc` tambien estan disponibles en shells de login.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `sh`?

</div>
<div class="flashcard-back">

**R:** Bourne Shell, el shell original de Unix. Mas limitado que bash

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `zsh`?

</div>
<div class="flashcard-back">

**R:** Z Shell, muy popular, con autocompletado avanzado y temas

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-007">
<div class="flashcard-front">

**P:** Que hace el comando `csh`?

</div>
<div class="flashcard-back">

**R:** C Shell, con sintaxis similar al lenguaje C

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-008">
<div class="flashcard-front">

**P:** Que hace el comando `tcsh`?

</div>
<div class="flashcard-back">

**R:** Version mejorada de csh

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-009">
<div class="flashcard-front">

**P:** Que hace el comando `ksh`?

</div>
<div class="flashcard-back">

**R:** Korn Shell, combina caracteristicas de sh y csh

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-010">
<div class="flashcard-front">

**P:** Que es/son 8. Paginas info?

</div>
<div class="flashcard-back">

**R:** El sistema **info** proporciona documentacion mas detallada que man, organizada en nodos con hiperenlaces (estilo hipertexto).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-011">
<div class="flashcard-front">

**P:** Que es/son 9. Alias?

</div>
<div class="flashcard-back">

**R:** Los alias permiten crear atajos para comandos largos o frecuentes.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-012">
<div class="flashcard-front">

**P:** Que es/son 10. Expansion de llaves?

</div>
<div class="flashcard-back">

**R:** La expansion de llaves genera cadenas arbitrarias. **No depende de la existencia de archivos** (a diferencia del globbing).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-013">
<div class="flashcard-front">

**P:** Que es/son 11. Globbing (comodines de archivos)?

</div>
<div class="flashcard-back">

**R:** El globbing permite hacer coincidir nombres de archivo usando patrones. **A diferencia de la expansion de llaves, el globbing depende de los archivos que existan**.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-014">
<div class="flashcard-front">

**P:** Que es/son 12. El comando exec?

</div>
<div class="flashcard-back">

**R:** `exec` reemplaza el shell actual con el comando especificado. **El shell deja de existir** y es sustituido por el nuevo proceso. No se crea proceso hijo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-015">
<div class="flashcard-front">

**P:** Que es/son 13. El comando uname?

</div>
<div class="flashcard-back">

**R:** Muestra informacion del sistema:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-016">
<div class="flashcard-front">

**P:** Que es/son 15. El comando `hash`?

</div>
<div class="flashcard-back">

**R:** El shell bash mantiene una **tabla hash interna** que almacena las rutas de los comandos externos ya ejecutados. Esto evita que el shell tenga que buscar en todos los directorios de `$PATH` cada vez qu

</div>
</div>

---

