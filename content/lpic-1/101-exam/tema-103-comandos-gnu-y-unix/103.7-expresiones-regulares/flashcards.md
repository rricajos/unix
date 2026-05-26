---
title: "103.7 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "103.7"
---

# Flashcards: 103.7 - Expresiones Regulares

> 10 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: `egrep` y `fgrep` se consideran comandos obsoletos (deprecated). Se recomienda u...

</div>
<div class="flashcard-back">

**R:** `egrep` y `fgrep` se consideran comandos obsoletos (deprecated). Se recomienda usar `grep -E` y `grep -F` en su lugar, pero ambas formas son validas.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: `\b` y `\w` funcionan en GNU grep. `\d` puede no funcionar en todas las versione...

</div>
<div class="flashcard-back">

**R:** `\b` y `\w` funcionan en GNU grep. `\d` puede no funcionar en todas las versiones; es mas seguro usar `[0-9]` o `[[:digit:]]`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `.`?

</div>
<div class="flashcard-back">

**R:** Cualquier caracter (excepto salto de linea)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `*`?

</div>
<div class="flashcard-back">

**R:** Cero o mas repeticiones del caracter anterior

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `^`?

</div>
<div class="flashcard-back">

**R:** Inicio de linea

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `$`?

</div>
<div class="flashcard-back">

**R:** Fin de linea

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-007">
<div class="flashcard-front">

**P:** Que hace el comando `[]`?

</div>
<div class="flashcard-back">

**R:** Clase de caracteres (uno de los listados)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-008">
<div class="flashcard-front">

**P:** Que es/son 1. Que son las expresiones regulares?

</div>
<div class="flashcard-back">

**R:** Las **expresiones regulares** (regex o regexp) son patrones de texto que describen un conjunto de cadenas posibles. Permiten buscar, comparar y manipular texto de forma flexible y potente.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-009">
<div class="flashcard-front">

**P:** Que es/son 7. Clases de caracteres POSIX?

</div>
<div class="flashcard-back">

**R:** Las clases POSIX funcionan dentro de corchetes `[[:clase:]]`:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-010">
<div class="flashcard-front">

**P:** Que es/son 8. Secuencias de escape comunes?

</div>
<div class="flashcard-back">

**R:** | Secuencia | Significado | Equivalente |

</div>
</div>

---

