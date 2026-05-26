---
title: "101.3 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "101.3"
---

# Flashcards: 101.3 - Niveles De Ejecucion Y Targets

> 15 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: En sistemas con systemd, `/etc/inittab` **no se utiliza**. systemd usa targets e...

</div>
<div class="flashcard-back">

**R:** En sistemas con systemd, `/etc/inittab` **no se utiliza**. systemd usa targets en su lugar. Sin embargo, es importante conocer este archivo para el examen.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: Los scripts S se ejecutan en orden ascendente (S01, S02, S03...) y los scripts K...

</div>
<div class="flashcard-back">

**R:** Los scripts S se ejecutan en orden ascendente (S01, S02, S03...) y los scripts K se ejecutan en orden ascendente antes que los S al cambiar de runlevel.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-003">
<div class="flashcard-front">

**P:** Tip de examen: Las cabeceras LSB son esenciales para que las herramientas de gestion de SysVini...

</div>
<div class="flashcard-back">

**R:** Las cabeceras LSB son esenciales para que las herramientas de gestion de SysVinit calculen automaticamente el orden correcto de inicio y parada de los servicios.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-004">
<div class="flashcard-front">

**P:** Tip de examen: Upstart ya no se utiliza en distribuciones principales, pero es importante saber...

</div>
<div class="flashcard-back">

**R:** Upstart ya no se utiliza en distribuciones principales, pero es importante saber que existio y fue el sistema de inicio de Ubuntu durante varios anos. Chromium OS tambien lo utilizo. Actualmente, systemd es el estandar en practicamente todas las distribuciones principales.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-005">
<div class="flashcard-front">

**P:** Tip de examen: Los archivos en `/etc/systemd/system/` tienen **prioridad** sobre los de `/lib/s...

</div>
<div class="flashcard-back">

**R:** Los archivos en `/etc/systemd/system/` tienen **prioridad** sobre los de `/lib/systemd/system/`. Para personalizar un servicio, se copian o crean archivos en `/etc/systemd/system/`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-006">
<div class="flashcard-front">

**P:** Tip de examen: `systemctl set-default` crea un enlace simbolico `/etc/systemd/system/default.ta...

</div>
<div class="flashcard-back">

**R:** `systemctl set-default` crea un enlace simbolico `/etc/systemd/system/default.target` que apunta al target deseado.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-007">
<div class="flashcard-front">

**P:** Tip de examen: `shutdown` es el metodo preferido porque permite programar el apagado, avisar a ...

</div>
<div class="flashcard-back">

**R:** `shutdown` es el metodo preferido porque permite programar el apagado, avisar a los usuarios y cancelar la operacion. Los comandos `poweroff`, `reboot` y `halt` son inmediatos y no avisan a los usuarios.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-008">
<div class="flashcard-front">

**P:** Tip de examen: Es suficiente saber que acpid es el demonio que gestiona eventos de energia ACPI...

</div>
<div class="flashcard-back">

**R:** Es suficiente saber que acpid es el demonio que gestiona eventos de energia ACPI, como el boton de encendido y la tapa del portatil. No se requiere un conocimiento profundo de su configuracion.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-009">
<div class="flashcard-front">

**P:** Que hace el comando `Provides`?

</div>
<div class="flashcard-back">

**R:** Nombre del servicio que proporciona el script

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-010">
<div class="flashcard-front">

**P:** Que hace el comando `Required-Start`?

</div>
<div class="flashcard-back">

**R:** Servicios o facilidades que deben estar iniciados **antes** de que este servicio arranque

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-011">
<div class="flashcard-front">

**P:** Que hace el comando `Default-Start`?

</div>
<div class="flashcard-back">

**R:** Runlevels en los que el servicio debe **iniciarse** por defecto

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-012">
<div class="flashcard-front">

**P:** Que es/son 3. Tabla de equivalencia: runlevels y targets?

</div>
<div class="flashcard-back">

**R:** Esta tabla es **fundamental para el examen**:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-013">
<div class="flashcard-front">

**P:** Que es/son 4. Gestion de servicios con systemctl?

</div>
<div class="flashcard-back">

**R:** `systemctl` es la herramienta principal para gestionar servicios y targets en systemd.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-014">
<div class="flashcard-front">

**P:** Que es/son 6. El comando wall?

</div>
<div class="flashcard-back">

**R:** `wall` (write all) envia un mensaje a todos los usuarios conectados al sistema. Es util para avisar de mantenimientos, reinicios u otras acciones que afecten a los usuarios.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="101.3">
</div>

<div class="flashcard" data-id="101.3-fc-015">
<div class="flashcard-front">

**P:** Que es/son Resumen para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **Runlevels de SysVinit:** 0 (apagado), 1 (monousuario), 2 (multi sin red), 3 (multi con red), 4 (personalizable), 5 (grafico), 6 (reinicio).

</div>
</div>

---

