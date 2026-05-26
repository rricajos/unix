---
title: "110.2 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "110.2"
---

# Flashcards: 110.2 - Seguridad Del Host

> 8 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="110.2">
</div>

<div class="flashcard" data-id="110.2-fc-001">
<div class="flashcard-front">

**P:** Que hace el comando `$6$...`?

</div>
<div class="flashcard-back">

**R:** Contrasena con SHA-512

</div>
</div>

---

<div class="flashcard-deck" data-subtema="110.2">
</div>

<div class="flashcard" data-id="110.2-fc-002">
<div class="flashcard-front">

**P:** Que hace el comando `$5$...`?

</div>
<div class="flashcard-back">

**R:** Contrasena con SHA-256

</div>
</div>

---

<div class="flashcard-deck" data-subtema="110.2">
</div>

<div class="flashcard" data-id="110.2-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `$1$...`?

</div>
<div class="flashcard-back">

**R:** Contrasena con MD5 (inseguro)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="110.2">
</div>

<div class="flashcard" data-id="110.2-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `*`?

</div>
<div class="flashcard-back">

**R:** Cuenta sin contrasena (login deshabilitado)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="110.2">
</div>

<div class="flashcard" data-id="110.2-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `ALL`?

</div>
<div class="flashcard-back">

**R:** Todos los servicios o todos los hosts

</div>
</div>

---

<div class="flashcard-deck" data-subtema="110.2">
</div>

<div class="flashcard" data-id="110.2-fc-006">
<div class="flashcard-front">

**P:** Que es/son `/usr/sbin/nologin` vs `/etc/nologin` (DISTINCION CRITICA)?

</div>
<div class="flashcard-back">

**R:** Es fundamental distinguir entre estos dos elementos con nombre similar pero funcion completamente diferente:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="110.2">
</div>

<div class="flashcard" data-id="110.2-fc-007">
<div class="flashcard-front">

**P:** Que es/son `/etc/securetty` - Terminales seguras para root?

</div>
<div class="flashcard-back">

**R:** `/etc/securetty` es un archivo que lista las **terminales (TTY) desde las cuales root puede iniciar sesion directamente**. Es verificado por el modulo PAM `pam_securetty`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="110.2">
</div>

<div class="flashcard" data-id="110.2-fc-008">
<div class="flashcard-front">

**P:** Que es/son Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **Shadow passwords**: Contrasenas en `/etc/shadow` (solo root), no en `/etc/passwd` (legible por todos)

</div>
</div>

---

