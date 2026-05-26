---
title: "104.1 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "104.1"
---

# Flashcards: 104.1 - Particiones Y Sistemas De Archivos

> 9 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: `mke2fs` es equivalente a `mkfs.ext2/ext3/ext4`. La opcion `-n` (dry-run) es imp...

</div>
<div class="flashcard-back">

**R:** `mke2fs` es equivalente a `mkfs.ext2/ext3/ext4`. La opcion `-n` (dry-run) es importante para verificar parametros antes de crear el FS. La opcion `-b` para el tamano de bloque y `-L` para la etiqueta son las mas preguntadas.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-002">
<div class="flashcard-front">

**P:** Que hace el comando `/dev/sda`?

</div>
<div class="flashcard-back">

**R:** Primer disco SATA/SCSI/USB

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `/dev/sdb`?

</div>
<div class="flashcard-back">

**R:** Segundo disco SATA/SCSI/USB

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `/dev/sda1`?

</div>
<div class="flashcard-back">

**R:** Primera particion del primer disco

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `/dev/sda2`?

</div>
<div class="flashcard-back">

**R:** Segunda particion del primer disco

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `/dev/nvme0n1`?

</div>
<div class="flashcard-back">

**R:** Primer disco NVMe

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-007">
<div class="flashcard-front">

**P:** Que es/son 1. Dispositivos de bloque en Linux?

</div>
<div class="flashcard-back">

**R:** En Linux, los discos y particiones se representan como archivos especiales de dispositivo en `/dev/`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-008">
<div class="flashcard-front">

**P:** Que es/son 5. Gestion del espacio swap?

</div>
<div class="flashcard-back">

**R:** El swap es espacio en disco usado como extension de la RAM cuando esta se agota.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.1">
</div>

<div class="flashcard" data-id="104.1-fc-009">
<div class="flashcard-front">

**P:** Que es/son 6. Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **MBR vs GPT:** MBR soporta hasta 4 particiones primarias y discos de hasta 2 TB. GPT soporta 128+ particiones y discos enormes.

</div>
</div>

---

