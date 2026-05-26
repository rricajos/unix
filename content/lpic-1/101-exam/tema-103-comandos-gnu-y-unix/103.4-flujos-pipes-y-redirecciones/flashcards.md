---
title: "103.4 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
subtema: "103.4"
---

# Flashcards: 103.4 - Flujos Pipes Y Redirecciones

> 18 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-001">
<div class="flashcard-front">

**P:** Tip de examen: `/dev/null` es la forma estandar de descartar salida no deseada. Es un "sumidero...

</div>
<div class="flashcard-back">

**R:** `/dev/null` es la forma estandar de descartar salida no deseada. Es un "sumidero" (sink) que acepta cualquier cantidad de datos y los descarta.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-002">
<div class="flashcard-front">

**P:** Tip de examen: `xargs` es necesario cuando el comando destino espera **argumentos** (no stdin)....

</div>
<div class="flashcard-back">

**R:** `xargs` es necesario cuando el comando destino espera **argumentos** (no stdin). Por ejemplo, `rm`, `cp`, `mv`, `chmod` necesitan nombres de archivo como argumentos, no datos por stdin.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-003">
<div class="flashcard-front">

**P:** Tip de examen: La sustitucion de procesos es especifica de bash (no funciona en `sh`). Es parti...

</div>
<div class="flashcard-back">

**R:** La sustitucion de procesos es especifica de bash (no funciona en `sh`). Es particularmente util con `diff` para comparar la salida de dos comandos, y con `while read` para evitar problemas de subshell creados por pipes.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-004">
<div class="flashcard-front">

**P:** Que hace el comando `El pipe`?

</div>
<div class="flashcard-back">

**R:** ` conecta la **salida estandar** de un comando con la **entrada estandar** del siguiente comando. Es uno de los conceptos mas poderosos de Unix.  ```bash ls -l /etc

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-005">
<div class="flashcard-front">

**P:** Que hace el comando `tee >(wc -l)`?

</div>
<div class="flashcard-back">

**R:** > **Para el examen**: La sustitucion de procesos es especifica de bash (no funciona en `sh`). Es particularmente util con `diff` para comparar la salida de dos comandos, y con `while read` para evitar problemas de subshell creados por pipes.  ---  ## 13. Named pipes (FIFOs): mkfifo  Una **named pipe** (tuberia con nombre) o **FIFO** (First In, First Out) es un archivo especial en el sistema de archivos que actua como un canal de comunicacion entre procesos. A diferencia de los pipes normales (`

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-006">
<div class="flashcard-front">

**P:** Que hace el comando `>`?

</div>
<div class="flashcard-back">

**R:** Redirige stdout a archivo (sobreescribe)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-007">
<div class="flashcard-front">

**P:** Que hace el comando `>>`?

</div>
<div class="flashcard-back">

**R:** Redirige stdout a archivo (anade)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-008">
<div class="flashcard-front">

**P:** Que hace el comando `<`?

</div>
<div class="flashcard-back">

**R:** Redirige archivo a stdin

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-009">
<div class="flashcard-front">

**P:** Que es/son 1. Descriptores de archivo?

</div>
<div class="flashcard-back">

**R:** En Linux, cada proceso tiene tres flujos de datos estandar abiertos por defecto, identificados por **descriptores de archivo** (file descriptors):

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-010">
<div class="flashcard-front">

**P:** Que es/son 6. /dev/null: el agujero negro?

</div>
<div class="flashcard-back">

**R:** `/dev/null` es un archivo especial que **descarta todo lo que se escribe en el**. Leer de el produce inmediatamente un fin de archivo (EOF).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-011">
<div class="flashcard-front">

**P:** Que es/son 7. Pipes (tuberias): `|`?

</div>
<div class="flashcard-back">

**R:** El pipe `|` conecta la **salida estandar** de un comando con la **entrada estandar** del siguiente comando. Es uno de los conceptos mas poderosos de Unix.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-012">
<div class="flashcard-front">

**P:** Que es/son 8. tee: dividir la salida?

</div>
<div class="flashcard-back">

**R:** `tee` lee de stdin y escribe simultaneamente en **stdout** y en uno o mas **archivos**. Es como una "T" en una tuberia de agua que divide el flujo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-013">
<div class="flashcard-front">

**P:** Que es/son 9. xargs: construir comandos desde stdin?

</div>
<div class="flashcard-back">

**R:** `xargs` lee datos de la entrada estandar y los convierte en **argumentos** para otro comando. Es esencial cuando un comando no acepta datos por stdin pero necesita recibirlos de un pipe.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-014">
<div class="flashcard-front">

**P:** Que es/son 10. Here documents: `<< EOF`?

</div>
<div class="flashcard-back">

**R:** Un **here document** permite pasar un bloque de texto como entrada estandar a un comando, sin necesidad de un archivo externo. El texto se define entre un delimitador (tipicamente `EOF`, pero puede ser

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-015">
<div class="flashcard-front">

**P:** Que es/son 11. Here strings: `<<<`?

</div>
<div class="flashcard-back">

**R:** Un **here string** es una version simplificada del here document que pasa una **sola cadena** como entrada estandar a un comando.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-016">
<div class="flashcard-front">

**P:** Que es/son 12. Sustitucion de procesos: `<()` y `>()`?

</div>
<div class="flashcard-back">

**R:** La **sustitucion de procesos** (process substitution) es una funcionalidad avanzada de bash que permite usar la salida de un comando como si fuera un archivo, o enviar datos a un comando como si fuera

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-017">
<div class="flashcard-front">

**P:** Que es/son 13. Named pipes (FIFOs): mkfifo?

</div>
<div class="flashcard-back">

**R:** Una **named pipe** (tuberia con nombre) o **FIFO** (First In, First Out) es un archivo especial en el sistema de archivos que actua como un canal de comunicacion entre procesos. A diferencia de los pip

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-018">
<div class="flashcard-front">

**P:** Que es/son 14. Resumen de redirecciones?

</div>
<div class="flashcard-back">

**R:** | Operador | Descripcion | Ejemplo |

</div>
</div>

---

