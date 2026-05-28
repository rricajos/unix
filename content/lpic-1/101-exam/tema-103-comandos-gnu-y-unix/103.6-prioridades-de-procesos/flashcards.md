---
title: "103.6 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "103.6"
---

# Flashcards: 103.6 - Prioridades De Procesos

> 12 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-001">
<div class="flashcard-front">

**P:** Cual es el rango valido de valores nice en Linux y cual es el valor por defecto al iniciar un proceso normalmente?

</div>
<div class="flashcard-back">

**R:** C) -20 a 19, por defecto 0. El rango de valores nice en Linux va de **-20** (maxima prioridad) a **19** (minima prioridad). Cuando un proceso se inicia normalmente (sin usar el comando `nice`), se le asigna un valor nice de **0** por defecto. Los valores negativos (-20 a -1) solo pueden ser asignados por root. El rango 0 a 39 corresponde a la prioridad del kernel (PR), no al valor nice.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-002">
<div class="flashcard-front">

**P:** Un usuario normal ejecuta el siguiente comando: ```bash nice -n -5 ./mi_script.sh ``` Que ocurrira?

</div>
<div class="flashcard-back">

**R:** C) El comando falla con un error de permisos. Un usuario normal **no puede** asignar valores nice negativos. Los valores negativos (de -20 a -1) representan prioridades mas altas que la por defecto y solo **root** puede asignarlos. El sistema mostrara un error como "nice: cannot set niceness: Permission denied". Para ejecutar este comando correctamente, el usuario necesitaria usar `sudo nice -n -5 ./mi_script.sh`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-003">
<div class="flashcard-front">

**P:** Un administrador tiene un proceso con PID 5678 ejecutandose con nice 0. Quiere bajar su prioridad a nice 15. Cual es el comando correcto?

</div>
<div class="flashcard-back">

**R:** B) `renice -n 15 -p 5678`. Para cambiar la prioridad de un proceso **ya en ejecucion**, se utiliza `renice`, no `nice`. `nice` solo se usa para **iniciar** un nuevo proceso con una prioridad especifica. La sintaxis correcta es `renice -n 15 -p 5678`. La opcion A es incorrecta porque `nice` no acepta `-p PID` (no trabaja con procesos existentes). Aunque el orden de opciones en `renice` puede variar en algunas implementaciones, la forma estandar es `-n VALOR -p PID`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-004">
<div class="flashcard-front">

**P:** Un usuario normal tiene un proceso con PID 3456 ejecutandose con nice 10. Ejecuta: ```bash renice -n 5 -p 3456 ``` Que sucede?

</div>
<div class="flashcard-back">

**R:** C) El comando falla porque el usuario no puede bajar el nice. Un usuario normal **no puede disminuir** el valor nice de un proceso, ni siquiera si fue el quien lo subio. El proceso tiene nice 10 y el usuario intenta cambiarlo a 5, lo cual es **bajar el nice** (subir la prioridad). Esta operacion esta reservada para root. El usuario solo podria subir el nice a un valor mayor (por ejemplo, 15 o 19). Para cambiarlo a 5, necesitaria privilegios de root: `sudo renice -n 5 -p 3456`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-005">
<div class="flashcard-front">

**P:** Si un proceso tiene un valor nice de -10, cual sera su valor de prioridad (PR) mostrado en `top`?

</div>
<div class="flashcard-back">

**R:** B) 10. La relacion entre el valor nice (NI) y la prioridad del kernel (PR) es: **PR = 20 + NI**. Si NI = -10, entonces PR = 20 + (-10) = **10**. Un PR mas bajo significa mayor prioridad. Para referencia: NI = 0 da PR = 20 (por defecto), NI = -20 da PR = 0 (maxima prioridad normal), y NI = 19 da PR = 39 (minima prioridad).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-006">
<div class="flashcard-front">

**P:** Que tecla se presiona en `top` para cambiar interactivamente la prioridad (nice) de un proceso?

</div>
<div class="flashcard-back">

**R:** C) `r`. En la interfaz interactiva de `top`, la tecla `r` (de "renice") permite cambiar el valor nice de un proceso. Al presionarla, `top` solicita el PID del proceso y luego el nuevo valor nice. La tecla `k` se usa para matar (kill) un proceso. Las teclas `n` y `p` no tienen esta funcion en top (`N` ordena por PID y `P` ordena por CPU).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-007">
<div class="flashcard-front">

**P:** Un administrador quiere ejecutar una compilacion pesada sin que afecte el rendimiento del servidor. Cual es el comando mas apropiado?

</div>
<div class="flashcard-back">

**R:** C) `nice -n 19 make -j4`. `nice -n 19` inicia el proceso con la **minima prioridad posible** (nice 19), lo que significa que el proceso solo usara CPU cuando ningun otro proceso la necesite. Esto es ideal para tareas pesadas que no son urgentes. La opcion A (`nice make -j4`) usaria nice 10, que es menor prioridad pero no la minima. La opcion B usaria nice -20 (maxima prioridad), que es lo contrario de lo deseado. La opcion D es incorrecta porque `renice` cambia la prioridad de procesos ya en ejecucion, no inicia nuevos procesos.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-008">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos muestra el PID, valor nice, prioridad y nombre de todos los procesos del sistema?

</div>
<div class="flashcard-back">

**R:** B) `ps -eo pid,ni,pri,comm`. `ps -eo pid,ni,pri,comm` usa la opcion `-e` para seleccionar todos los procesos y `-o` para personalizar las columnas de salida: PID (identificador), NI (valor nice), PRI (prioridad del kernel) y COMM (nombre del comando). `ps aux` y `ps -ef` muestran muchas columnas pero **no incluyen nice ni prioridad** en su formato estandar. `top -n 1` mostraria una captura de los procesos con NI y PR, pero no es un comando `ps` y su formato no es tan limpio para esta consulta especifica.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-009">
<div class="flashcard-front">

**P:** Tip de examen: La forma recomendada y mas clara es `nice -n VALOR comando`.

</div>
<div class="flashcard-back">

**R:** La forma recomendada y mas clara es `nice -n VALOR comando`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-010">
<div class="flashcard-front">

**P:** Tip de examen: Recuerda que la tecla `r` en `top` sirve para cambiar el nice (renice) de un pro...

</div>
<div class="flashcard-back">

**R:** Recuerda que la tecla `r` en `top` sirve para cambiar el nice (renice) de un proceso interactivamente.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-011">
<div class="flashcard-front">

**P:** Que hace el comando `nice`?

</div>
<div class="flashcard-back">

**R:** `renice`

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.6">
</div>

<div class="flashcard" data-id="103.6-fc-012">
<div class="flashcard-front">

**P:** Que hace el comando `nice -n 10 comando`?

</div>
<div class="flashcard-back">

**R:** `renice -n 10 -p PID`

</div>
</div>

---

