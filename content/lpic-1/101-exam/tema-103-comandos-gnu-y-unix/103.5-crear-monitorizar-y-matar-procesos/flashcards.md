---
title: "103.5 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "103.5"
---

# Flashcards: 103.5 - Crear Monitorizar Y Matar Procesos

> 11 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: `nohup` protege contra SIGHUP, pero el proceso **si puede ser matado** con SIGKI...

</div>
<div class="flashcard-back">

**R:** `nohup` protege contra SIGHUP, pero el proceso **si puede ser matado** con SIGKILL o SIGTERM. `nohup` NO convierte un proceso en daemon.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: `pstree` es util para visualizar la jerarquia de procesos. La opcion `-p` para v...

</div>
<div class="flashcard-back">

**R:** `pstree` es util para visualizar la jerarquia de procesos. La opcion `-p` para ver PIDs es la mas preguntada.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-003">
<div class="flashcard-front">

**P:** Tip de examen: `/proc/PID/` es una fuente fundamental de informacion sobre procesos. Los archiv...

</div>
<div class="flashcard-back">

**R:** `/proc/PID/` es una fuente fundamental de informacion sobre procesos. Los archivos `cmdline`, `status` y `fd/` son los mas relevantes. Toda la informacion que muestra `ps` proviene de `/proc`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `R`?

</div>
<div class="flashcard-back">

**R:** Running (ejecutandose o en cola de ejecucion)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `S`?

</div>
<div class="flashcard-back">

**R:** Sleeping (durmiendo, esperando un evento)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `D`?

</div>
<div class="flashcard-back">

**R:** Uninterruptible sleep (esperando I/O de disco)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-007">
<div class="flashcard-front">

**P:** Que hace el comando `T`?

</div>
<div class="flashcard-back">

**R:** Stopped (detenido por una senal)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-008">
<div class="flashcard-front">

**P:** Que hace el comando `Z`?

</div>
<div class="flashcard-back">

**R:** Zombie (terminado pero no recogido por el padre)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-009">
<div class="flashcard-front">

**P:** Que es/son 4. htop?

</div>
<div class="flashcard-back">

**R:** `htop` es una version mejorada e interactiva de `top` con interfaz en colores, barras graficas y soporte de raton.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-010">
<div class="flashcard-front">

**P:** Que es/son 5. Buscar procesos con `pgrep`?

</div>
<div class="flashcard-back">

**R:** `pgrep` busca procesos por nombre u otros atributos y devuelve sus PIDs.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-011">
<div class="flashcard-front">

**P:** Que es/son 8. `nohup` - Inmunidad a SIGHUP?

</div>
<div class="flashcard-back">

**R:** Cuando cierras una terminal o sesion SSH, el shell envia **SIGHUP** a todos sus procesos hijos, lo que normalmente los termina. `nohup` hace que un proceso ignore la senal SIGHUP.

</div>
</div>

---

