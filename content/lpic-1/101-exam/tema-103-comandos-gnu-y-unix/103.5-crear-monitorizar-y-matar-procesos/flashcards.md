---
title: "103.5 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "103.5"
---

# Flashcards: 103.5 - Crear Monitorizar Y Matar Procesos

> 19 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-001">
<div class="flashcard-front">

**P:** Un administrador necesita ver todos los procesos del sistema incluyendo el PID del proceso padre (PPID). Cual de los siguientes comandos muestra esta informacion?

</div>
<div class="flashcard-back">

**R:** B) `ps -ef`. `ps -ef` usa el formato UNIX que incluye la columna PPID (Parent Process ID) por defecto. `ps aux` (formato BSD) muestra USER, PID, %CPU, %MEM, etc., pero **no incluye PPID** en su salida estandar. `ps -l` muestra formato largo pero solo del shell actual, no todos los procesos. `top` muestra procesos en tiempo real pero tampoco muestra PPID por defecto.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-002">
<div class="flashcard-front">

**P:** Un proceso esta colgado y no responde a `kill 1234`. Que comando garantiza que el proceso sera terminado inmediatamente?

</div>
<div class="flashcard-back">

**R:** D) `kill -9 1234`. `kill -9` envia la senal SIGKILL, que **no puede ser capturada, bloqueada ni ignorada** por el proceso. El kernel termina el proceso inmediatamente sin darle oportunidad de realizar limpieza. Las opciones A y B envian SIGTERM (senal 15), que es la senal por defecto y puede ser capturada o ignorada por el proceso. La opcion C envia SIGHUP (senal 1), que normalmente pide al proceso que recargue su configuracion.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-003">
<div class="flashcard-front">

**P:** Un usuario esta ejecutando un proceso largo en primer plano. Quiere suspenderlo temporalmente para ejecutar otro comando y luego reanudarlo en segundo plano. Cual es la secuencia correcta?

</div>
<div class="flashcard-back">

**R:** B) `Ctrl+Z`, luego `bg`. `Ctrl+Z` envia la senal SIGTSTP (20) que suspende (pausa) el proceso sin terminarlo. Luego, `bg` reanuda el proceso suspendido en segundo plano (background). `Ctrl+C` envia SIGINT que **termina** el proceso, no lo suspende. `fg` traeria el proceso de vuelta a primer plano, no a segundo plano. `Ctrl+D` envia EOF (fin de archivo), no suspende procesos.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-004">
<div class="flashcard-front">

**P:** Un administrador necesita ejecutar un script de backup que debe continuar ejecutandose incluso despues de cerrar la sesion SSH. Cual es la forma correcta de hacerlo?

</div>
<div class="flashcard-back">

**R:** C) `nohup ./backup.sh &`. `nohup` hace que el proceso ignore la senal SIGHUP que se envia cuando se cierra la terminal o la sesion SSH. El `&` al final lo ejecuta en segundo plano. La opcion A ejecuta en segundo plano pero el proceso recibira SIGHUP al cerrar la sesion y sera terminado. `bg` se usa para reanudar un proceso suspendido, no para iniciar uno. `nice` modifica la prioridad pero no protege contra SIGHUP.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-005">
<div class="flashcard-front">

**P:** En `top`, que tecla se usa para ordenar los procesos por uso de memoria?

</div>
<div class="flashcard-back">

**R:** D) `M`. En la interfaz interactiva de `top`, la tecla `M` (mayuscula) ordena los procesos por porcentaje de uso de memoria (%MEM). `P` ordena por uso de CPU (%CPU), que es el ordenamiento por defecto. `N` ordena por PID (numerico). `T` ordena por tiempo de CPU acumulado (TIME+).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-006">
<div class="flashcard-front">

**P:** Cual es la diferencia principal entre `killall` y `pkill`?

</div>
<div class="flashcard-back">

**R:** B) `killall` requiere nombre exacto y `pkill` usa coincidencia parcial (patron). `killall` mata procesos cuyo nombre coincide **exactamente** con el argumento. Por ejemplo, `killall apache2` solo matara procesos llamados exactamente "apache2". `pkill` funciona con coincidencia parcial (usa patrones), por lo que `pkill apach` mataria cualquier proceso cuyo nombre contenga "apach". Ambos comandos pueden enviar cualquier senal (no solo SIGKILL) y ambos usan nombres de proceso (no PIDs).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-007">
<div class="flashcard-front">

**P:** Un administrador ejecuta los siguientes comandos: ```bash sleep 100 & sleep 200 & sleep 300 & jobs ``` Que mostrara el comando `jobs` y cual es el trabajo "actual" (marcado con `+`)?

</div>
<div class="flashcard-back">

**R:** B) Los tres trabajos, con `sleep 300` marcado como `+`. `jobs` muestra todos los trabajos del shell actual, incluyendo los que se ejecutan en segundo plano. La salida seria algo como: ``` [1]   Running    sleep 100 & [2]-  Running    sleep 200 & [3]+  Running    sleep 300 & ``` El simbolo `+` marca el trabajo mas reciente (el ultimo que se inicio o manipulo), que es el "trabajo actual". El simbolo `-` marca el trabajo anterior. Los comandos `fg` y `bg` sin argumentos actuan sobre el trabajo marcado con `+`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-008">
<div class="flashcard-front">

**P:** Que informacion muestra el comando `uptime` y que significan los valores de "load average"?

</div>
<div class="flashcard-back">

**R:** B) Muestra hora actual, uptime, usuarios conectados y carga media (1, 5 y 15 minutos). La salida de `uptime` se ve asi: ``` 14:30:25 up 45 days, 3:22, 2 users, load average: 0.15, 0.10, 0.05 ``` Incluye: la hora actual, el tiempo que lleva encendido el sistema, el numero de usuarios conectados y los tres valores de **load average** (carga media del sistema en los ultimos 1, 5 y 15 minutos). El load average indica cuantos procesos estan en ejecucion o esperando CPU. Un valor de 1.0 en un sistema con una CPU significa 100% de uso; en un sistema con 4 CPUs, un load average de 4.0 seria el 100%.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.5">
</div>

<div class="flashcard" data-id="103.5-fc-009">
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

<div class="flashcard" data-id="103.5-fc-010">
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

<div class="flashcard" data-id="103.5-fc-011">
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

<div class="flashcard" data-id="103.5-fc-012">
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

<div class="flashcard" data-id="103.5-fc-013">
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

<div class="flashcard" data-id="103.5-fc-014">
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

<div class="flashcard" data-id="103.5-fc-015">
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

<div class="flashcard" data-id="103.5-fc-016">
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

<div class="flashcard" data-id="103.5-fc-017">
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

<div class="flashcard" data-id="103.5-fc-018">
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

<div class="flashcard" data-id="103.5-fc-019">
<div class="flashcard-front">

**P:** Que es/son 8. `nohup` - Inmunidad a SIGHUP?

</div>
<div class="flashcard-back">

**R:** Cuando cierras una terminal o sesion SSH, el shell envia **SIGHUP** a todos sus procesos hijos, lo que normalmente los termina. `nohup` hace que un proceso ignore la senal SIGHUP.

</div>
</div>

---

