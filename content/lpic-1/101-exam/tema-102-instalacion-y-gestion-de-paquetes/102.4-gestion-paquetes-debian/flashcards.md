---
title: "102.4 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "102.4"
---

# Flashcards: 102.4 - Gestion Paquetes Debian

> 12 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: `apt-get dist-upgrade` no significa necesariamente actualizar la distribucion co...

</div>
<div class="flashcard-back">

**R:** `apt-get dist-upgrade` no significa necesariamente actualizar la distribucion completa. Solo significa que permite gestiones de dependencias mas agresivas (eliminar e instalar paquetes) durante la actualizacion. `apt full-upgrade` es el equivalente moderno.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: `apt-get purge` y `apt-get remove --purge` son equivalentes. Ambos eliminan los ...

</div>
<div class="flashcard-back">

**R:** `apt-get purge` y `apt-get remove --purge` son equivalentes. Ambos eliminan los archivos de configuracion del paquete. Con `remove` (sin purge), los archivos de configuracion se conservan y el paquete aparece con estado `rc` en `dpkg -l`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `dpkg`?

</div>
<div class="flashcard-back">

**R:** Instala/desinstala paquetes .deb individuales. No resuelve dependencias

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `ii`?

</div>
<div class="flashcard-back">

**R:** Instalado correctamente

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `rc`?

</div>
<div class="flashcard-back">

**R:** Eliminado, archivos de configuracion presentes

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `un`?

</div>
<div class="flashcard-back">

**R:** Desconocido, no instalado

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-007">
<div class="flashcard-front">

**P:** Que hace el comando `iU`?

</div>
<div class="flashcard-back">

**R:** Instalado, pendiente de desempaquetar

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-008">
<div class="flashcard-front">

**P:** Que es/son Introduccion?

</div>
<div class="flashcard-back">

**R:** El sistema de paquetes Debian es utilizado por Debian y sus derivados (Ubuntu, Linux Mint, etc.). Se basa en el formato de paquetes `.deb` y utiliza dos capas de herramientas: `dpkg` para la gestion de

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-009">
<div class="flashcard-front">

**P:** Que es/son 5. apt-file - Buscar archivos en paquetes?

</div>
<div class="flashcard-back">

**R:** `apt-file` permite buscar que paquete contiene un archivo especifico, **incluso si el paquete no esta instalado**.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-010">
<div class="flashcard-front">

**P:** Que es/son 6. dpkg-reconfigure?

</div>
<div class="flashcard-back">

**R:** Permite reconfigurar un paquete ya instalado ejecutando sus scripts de configuracion post-instalacion.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-011">
<div class="flashcard-front">

**P:** Que es/son 7. Gestion de claves GPG de repositorios?

</div>
<div class="flashcard-back">

**R:** Los repositorios se firman con claves GPG para verificar la autenticidad de los paquetes.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.4">
</div>

<div class="flashcard" data-id="102.4-fc-012">
<div class="flashcard-front">

**P:** Que es/son Resumen para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **dpkg** es de bajo nivel (no resuelve dependencias); **apt** es de alto nivel (resuelve dependencias).

</div>
</div>

---

