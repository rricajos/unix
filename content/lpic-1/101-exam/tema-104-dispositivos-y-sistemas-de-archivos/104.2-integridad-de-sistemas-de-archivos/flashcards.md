---
title: "104.2 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "104.2"
---

# Flashcards: 104.2 - Integridad De Sistemas De Archivos

> 8 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: `debugfs` es util para examinar la estructura interna de ext2/ext3/ext4 y para r...

</div>
<div class="flashcard-back">

**R:** `debugfs` es util para examinar la estructura interna de ext2/ext3/ext4 y para recuperar archivos borrados. El FS debe estar preferiblemente desmontado o montado como solo lectura.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: `xfs_fsr` funciona en sistemas XFS **montados** (a diferencia de la mayoria de h...

</div>
<div class="flashcard-back">

**R:** `xfs_fsr` funciona en sistemas XFS **montados** (a diferencia de la mayoria de herramientas de reparacion que requieren FS desmontado). `xfs_db` es el equivalente XFS de `debugfs` para ext.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `-s`?

</div>
<div class="flashcard-back">

**R:** Solo mostrar total (summary)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `-h`?

</div>
<div class="flashcard-back">

**R:** Formato legible (human readable)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `-c`?

</div>
<div class="flashcard-back">

**R:** Mostrar total general al final

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `--max-depth=N`?

</div>
<div class="flashcard-back">

**R:** Limitar profundidad de directorios

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-007">
<div class="flashcard-front">

**P:** Que hace el comando `-a`?

</div>
<div class="flashcard-back">

**R:** Incluir archivos individuales

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-008">
<div class="flashcard-front">

**P:** Que es/son 6. Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **`fsck` solo en FS desmontado** o montado como solo lectura. NUNCA en FS montado en lectura-escritura.

</div>
</div>

---

