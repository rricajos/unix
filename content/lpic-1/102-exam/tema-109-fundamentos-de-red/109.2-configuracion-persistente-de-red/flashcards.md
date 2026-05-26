---
title: "109.2 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "109.2"
---

# Flashcards: 109.2 - Configuracion Persistente De Red

> 10 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="109.2">
</div>

<div class="flashcard" data-id="109.2-fc-001">
<div class="flashcard-front">

**P:** Que hace el comando `nameserver`?

</div>
<div class="flashcard-back">

**R:** IP del servidor DNS (maximo 3)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="109.2">
</div>

<div class="flashcard" data-id="109.2-fc-002">
<div class="flashcard-front">

**P:** Que hace el comando `domain`?

</div>
<div class="flashcard-back">

**R:** Dominio local por defecto

</div>
</div>

---

<div class="flashcard-deck" data-subtema="109.2">
</div>

<div class="flashcard" data-id="109.2-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `search`?

</div>
<div class="flashcard-back">

**R:** Lista de dominios para busqueda (se agrega automaticamente)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="109.2">
</div>

<div class="flashcard" data-id="109.2-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `options`?

</div>
<div class="flashcard-back">

**R:** Opciones adicionales (timeout, intentos)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="109.2">
</div>

<div class="flashcard" data-id="109.2-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `NETWORKING`?

</div>
<div class="flashcard-back">

**R:** Habilitar/deshabilitar la red (yes/no)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="109.2">
</div>

<div class="flashcard" data-id="109.2-fc-006">
<div class="flashcard-front">

**P:** Que es/son `/etc/hosts`?

</div>
<div class="flashcard-back">

**R:** Archivo de resolucion estatica de nombres. Se consulta **antes** que DNS (segun `/etc/nsswitch.conf`).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="109.2">
</div>

<div class="flashcard" data-id="109.2-fc-007">
<div class="flashcard-front">

**P:** Que es/son `/etc/nsswitch.conf`?

</div>
<div class="flashcard-back">

**R:** Define el **orden de busqueda** para distintas bases de datos del sistema, incluyendo la resolucion de nombres.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="109.2">
</div>

<div class="flashcard" data-id="109.2-fc-008">
<div class="flashcard-front">

**P:** Que es/son `/etc/resolv.conf`?

</div>
<div class="flashcard-back">

**R:** Configuracion de los servidores DNS del cliente.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="109.2">
</div>

<div class="flashcard" data-id="109.2-fc-009">
<div class="flashcard-front">

**P:** Que es/son Comando `ip` (iproute2)?

</div>
<div class="flashcard-back">

**R:** Herramienta moderna para configuracion de red. Reemplaza a `ifconfig`, `route`, `arp`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="109.2">
</div>

<div class="flashcard" data-id="109.2-fc-010">
<div class="flashcard-front">

**P:** Que es/son Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **`/etc/hostname`** contiene el hostname estatico; **`hostnamectl`** lo gestiona en systemd

</div>
</div>

---

