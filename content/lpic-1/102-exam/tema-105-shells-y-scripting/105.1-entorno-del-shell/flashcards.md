---
title: "105.1 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "105.1"
---

# Flashcards: 105.1 - Entorno Del Shell

> 14 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-001">
<div class="flashcard-front">

**P:** Que hace el comando `/etc/profile`?

</div>
<div class="flashcard-back">

**R:** Ejecutado por login shells. Configura variables de entorno globales, umask, PATH

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-002">
<div class="flashcard-front">

**P:** Que hace el comando `/etc/bash.bashrc`?

</div>
<div class="flashcard-back">

**R:** Ejecutado por non-login shells interactivos (en Debian/Ubuntu). Configuraciones globales para shells interactivos

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `/etc/environment`?

</div>
<div class="flashcard-back">

**R:** Archivo simple de asignaciones `VARIABLE=valor` (no es un script). Leido por PAM, no por bash directamente

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `~/.bash_profile`?

</div>
<div class="flashcard-back">

**R:** Ejecutado por login shells. Primer archivo buscado del usuario

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-005">
<div class="flashcard-front">

**P:** Que es/son 3. Ejecutar comandos con entorno limpio: `env -i`?

</div>
<div class="flashcard-back">

**R:** El comando `env -i` permite ejecutar un comando con un entorno completamente vacio (sin ninguna variable de entorno heredada).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-006">
<div class="flashcard-front">

**P:** Que es/son 4. Opciones del shell: `set -o` / `set +o`?

</div>
<div class="flashcard-back">

**R:** El comando `set` permite activar y desactivar opciones de comportamiento del shell.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-007">
<div class="flashcard-front">

**P:** Que es/son 6. Modificacion del PATH?

</div>
<div class="flashcard-back">

**R:** El `PATH` es una lista de directorios separados por `:` donde el shell busca ejecutables.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-008">
<div class="flashcard-front">

**P:** Que es/son 7. Personalizacion del prompt (PS1)?

</div>
<div class="flashcard-back">

**R:** El prompt se personaliza mediante la variable `PS1`. Secuencias de escape comunes:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-009">
<div class="flashcard-front">

**P:** Que es/son 8. Alias?

</div>
<div class="flashcard-back">

**R:** Los alias son atajos para comandos largos o frecuentes.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-010">
<div class="flashcard-front">

**P:** Que es/son 9. Funciones del shell?

</div>
<div class="flashcard-back">

**R:** Las funciones permiten agrupar comandos reutilizables. Son mas poderosas que los alias.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-011">
<div class="flashcard-front">

**P:** Que es/son 10. source vs . (dot command)?

</div>
<div class="flashcard-back">

**R:** Ambos comandos ejecutan un script en el contexto del shell actual (no crean un subshell).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-012">
<div class="flashcard-front">

**P:** Que es/son 11. Directorio /etc/skel/ (skeleton)?

</div>
<div class="flashcard-back">

**R:** El directorio `/etc/skel/` contiene los archivos plantilla que se copian al directorio home de cada nuevo usuario creado con `useradd -m`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-013">
<div class="flashcard-front">

**P:** Que es/son 12. /etc/environment?

</div>
<div class="flashcard-back">

**R:** Este archivo es diferente a los demas: **NO es un script de shell**. Es un archivo simple de pares `VARIABLE=valor` leido por el modulo PAM (`pam_env`).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="105.1">
</div>

<div class="flashcard" data-id="105.1-fc-014">
<div class="flashcard-front">

**P:** Que es/son Resumen para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **Login shell:** `/etc/profile` --> `/etc/profile.d/*.sh` --> `~/.bash_profile` OR `~/.bash_login` OR `~/.profile` (solo el primero encontrado)

</div>
</div>

---

