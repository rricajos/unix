---
title: "102.6 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "102.6"
---

# Flashcards: 102.6 - Linux Como Guest Virtual

> 12 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: KVM **requiere** extensiones de virtualizacion por hardware (Intel VT-x o AMD-V)...

</div>
<div class="flashcard-back">

**R:** KVM **requiere** extensiones de virtualizacion por hardware (Intel VT-x o AMD-V) para funcionar. Estas extensiones deben estar **habilitadas en la configuracion del BIOS/UEFI**. Si no estan habilitadas, KVM no podra crear maquinas virtuales.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: qcow2 es el formato preferido en entornos KVM/QEMU por su flexibilidad (snapshot...

</div>
<div class="flashcard-back">

**R:** qcow2 es el formato preferido en entornos KVM/QEMU por su flexibilidad (snapshots, thin provisioning). RAW ofrece mejor rendimiento pero sin funcionalidades avanzadas.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-003">
<div class="flashcard-front">

**P:** Tip de examen: Si no se regeneran las claves SSH del host despues de clonar, los clientes que s...

</div>
<div class="flashcard-back">

**R:** Si no se regeneran las claves SSH del host despues de clonar, los clientes que se conecten a la maquina clonada recibiran advertencias de "host key changed" porque el fingerprint sera identico al de la maquina original.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-004">
<div class="flashcard-front">

**P:** Tip de examen: Al clonar una VM, es imprescindible regenerar el machine-id. Dos maquinas con el...

</div>
<div class="flashcard-back">

**R:** Al clonar una VM, es imprescindible regenerar el machine-id. Dos maquinas con el mismo machine-id pueden causar conflictos en D-Bus, DHCP y otros servicios que dependen de este identificador unico.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-005">
<div class="flashcard-front">

**P:** Tip de examen: cloud-init se ejecuta solo durante el **primer arranque** de la instancia. La co...

</div>
<div class="flashcard-back">

**R:** cloud-init se ejecuta solo durante el **primer arranque** de la instancia. La configuracion se proporciona en formato YAML con la directiva `#cloud-config` al inicio del archivo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `/etc/machine-id`?

</div>
<div class="flashcard-back">

**R:** Machine ID principal del sistema, usado por systemd

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-007">
<div class="flashcard-front">

**P:** Que hace el comando `/var/lib/dbus/machine-id`?

</div>
<div class="flashcard-back">

**R:** Machine ID de D-Bus. Normalmente es un enlace simbolico a `/etc/machine-id` o una copia identica

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-008">
<div class="flashcard-front">

**P:** Que hace el comando `/etc/cloud/cloud.cfg`?

</div>
<div class="flashcard-back">

**R:** Configuracion principal de cloud-init

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-009">
<div class="flashcard-front">

**P:** Que es/son Introduccion?

</div>
<div class="flashcard-back">

**R:** La virtualizacion permite ejecutar multiples sistemas operativos simultaneamente sobre un mismo hardware fisico. Comprender como Linux funciona como sistema invitado (guest) en entornos virtualizados y

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-010">
<div class="flashcard-front">

**P:** Que es/son 7. Guest Additions / Guest Tools?

</div>
<div class="flashcard-back">

**R:** Son herramientas que se instalan en el sistema guest para mejorar la integracion con el hipervisor.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-011">
<div class="flashcard-front">

**P:** Que es/son 10. cloud-init?

</div>
<div class="flashcard-back">

**R:** **cloud-init** es la herramienta estandar de la industria para la configuracion automatica de instancias en la nube durante el **primer arranque**. Es soportada por la mayoria de proveedores cloud (AWS

</div>
</div>

---

<div class="flashcard-deck" data-subtema="102.6">
</div>

<div class="flashcard" data-id="102.6-fc-012">
<div class="flashcard-front">

**P:** Que es/son Resumen para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **Hipervisor Tipo 1** (bare metal): KVM, Xen, ESXi. **Tipo 2** (hosted): VirtualBox, VMware Workstation.

</div>
</div>

---

