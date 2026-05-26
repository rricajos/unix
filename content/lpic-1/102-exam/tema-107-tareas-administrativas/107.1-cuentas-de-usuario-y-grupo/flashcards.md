---
title: "107.1 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "107.1"
---

# Flashcards: 107.1 - Cuentas De Usuario Y Grupo

> 6 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="107.1">
</div>

<div class="flashcard" data-id="107.1-fc-001">
<div class="flashcard-front">

**P:** Que hace el comando `/bin/bash`?

</div>
<div class="flashcard-back">

**R:** **Ejemplo:** ``` sandra:x:1000:1000:Sandra Garcia:/home/sandra:/bin/bash root:x:0:0:root:/root:/bin/bash nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin ```  **UIDs importantes:** - `0` = root (superusuario) - `1-999` = usuarios del sistema (servicios, daemons) - `1000+` = usuarios regulares (en la mayoria de distribuciones)  ---  ### /etc/shadow - Contrasenas cifradas y politicas de envejecimiento Contiene las contrasenas cifradas y la informacion de envejecimiento. Solo legible por root.  **Formato: 9 campos separados por `:`** ``` usuario:password_hash:lastchg:min:max:warn:inactive:expire:reserved ```

</div>
</div>

---

<div class="flashcard-deck" data-subtema="107.1">
</div>

<div class="flashcard" data-id="107.1-fc-002">
<div class="flashcard-front">

**P:** Que hace el comando `sandra,carlos,ana`?

</div>
<div class="flashcard-back">

**R:** **Ejemplo:** ``` root:x:0: sandra:x:1000: developers:x:1001:sandra,carlos sudo:x:27:sandra ```  **NOTA:** El campo miembros NO lista a los usuarios cuyo grupo primario es este grupo (eso se define en /etc/passwd). Solo lista los miembros adicionales (grupo secundario).  ---  ### /etc/gshadow - Contrasenas de grupos Contiene contrasenas cifradas de grupos y administradores de grupo. Solo legible por root.  **Formato: 4 campos separados por `:`** ``` grupo:password:admins:miembros ```

</div>
</div>

---

<div class="flashcard-deck" data-subtema="107.1">
</div>

<div class="flashcard" data-id="107.1-fc-003">
<div class="flashcard-front">

**P:** Que hace el comando `-m`?

</div>
<div class="flashcard-back">

**R:** Crear directorio home (copia /etc/skel/)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="107.1">
</div>

<div class="flashcard" data-id="107.1-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `-d /ruta`?

</div>
<div class="flashcard-back">

**R:** Especificar directorio home

</div>
</div>

---

<div class="flashcard-deck" data-subtema="107.1">
</div>

<div class="flashcard" data-id="107.1-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `-s /shell`?

</div>
<div class="flashcard-back">

**R:** Shell de login

</div>
</div>

---

<div class="flashcard-deck" data-subtema="107.1">
</div>

<div class="flashcard" data-id="107.1-fc-006">
<div class="flashcard-front">

**P:** Que es/son Resumen para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **/etc/passwd** tiene 7 campos: `usuario:x:UID:GID:GECOS:home:shell`

</div>
</div>

---

