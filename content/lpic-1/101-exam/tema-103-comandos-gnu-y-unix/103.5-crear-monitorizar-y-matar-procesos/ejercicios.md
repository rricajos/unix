---
title: "103.5 - Crear, monitorizar y matar procesos: Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.5"
---

# 103.5 - Crear, monitorizar y matar procesos: Ejercicios

## Pregunta 1
Un administrador necesita ver todos los procesos del sistema incluyendo el PID del proceso padre (PPID). Cual de los siguientes comandos muestra esta informacion?

A) `ps aux`
B) `ps -ef`
C) `ps -l`
D) `top`

<details>
<summary>Respuesta</summary>

**B) `ps -ef`**

`ps -ef` usa el formato UNIX que incluye la columna PPID (Parent Process ID) por defecto. `ps aux` (formato BSD) muestra USER, PID, %CPU, %MEM, etc., pero **no incluye PPID** en su salida estandar. `ps -l` muestra formato largo pero solo del shell actual, no todos los procesos. `top` muestra procesos en tiempo real pero tampoco muestra PPID por defecto.
</details>

---

## Pregunta 2
Un proceso esta colgado y no responde a `kill 1234`. Que comando garantiza que el proceso sera terminado inmediatamente?

A) `kill -SIGTERM 1234`
B) `kill -15 1234`
C) `kill -1 1234`
D) `kill -9 1234`

<details>
<summary>Respuesta</summary>

**D) `kill -9 1234`**

`kill -9` envia la senal SIGKILL, que **no puede ser capturada, bloqueada ni ignorada** por el proceso. El kernel termina el proceso inmediatamente sin darle oportunidad de realizar limpieza. Las opciones A y B envian SIGTERM (senal 15), que es la senal por defecto y puede ser capturada o ignorada por el proceso. La opcion C envia SIGHUP (senal 1), que normalmente pide al proceso que recargue su configuracion.
</details>

---

## Pregunta 3
Un usuario esta ejecutando un proceso largo en primer plano. Quiere suspenderlo temporalmente para ejecutar otro comando y luego reanudarlo en segundo plano. Cual es la secuencia correcta?

A) `Ctrl+C`, luego `bg`
B) `Ctrl+Z`, luego `bg`
C) `Ctrl+Z`, luego `fg`
D) `Ctrl+D`, luego `bg`

<details>
<summary>Respuesta</summary>

**B) `Ctrl+Z`, luego `bg`**

`Ctrl+Z` envia la senal SIGTSTP (20) que suspende (pausa) el proceso sin terminarlo. Luego, `bg` reanuda el proceso suspendido en segundo plano (background). `Ctrl+C` envia SIGINT que **termina** el proceso, no lo suspende. `fg` traeria el proceso de vuelta a primer plano, no a segundo plano. `Ctrl+D` envia EOF (fin de archivo), no suspende procesos.
</details>

---

## Pregunta 4
Un administrador necesita ejecutar un script de backup que debe continuar ejecutandose incluso despues de cerrar la sesion SSH. Cual es la forma correcta de hacerlo?

A) `./backup.sh &`
B) `bg ./backup.sh`
C) `nohup ./backup.sh &`
D) `nice ./backup.sh &`

<details>
<summary>Respuesta</summary>

**C) `nohup ./backup.sh &`**

`nohup` hace que el proceso ignore la senal SIGHUP que se envia cuando se cierra la terminal o la sesion SSH. El `&` al final lo ejecuta en segundo plano. La opcion A ejecuta en segundo plano pero el proceso recibira SIGHUP al cerrar la sesion y sera terminado. `bg` se usa para reanudar un proceso suspendido, no para iniciar uno. `nice` modifica la prioridad pero no protege contra SIGHUP.
</details>

---

## Pregunta 5
En `top`, que tecla se usa para ordenar los procesos por uso de memoria?

A) `P`
B) `N`
C) `T`
D) `M`

<details>
<summary>Respuesta</summary>

**D) `M`**

En la interfaz interactiva de `top`, la tecla `M` (mayuscula) ordena los procesos por porcentaje de uso de memoria (%MEM). `P` ordena por uso de CPU (%CPU), que es el ordenamiento por defecto. `N` ordena por PID (numerico). `T` ordena por tiempo de CPU acumulado (TIME+).
</details>

---

## Pregunta 6
Cual es la diferencia principal entre `killall` y `pkill`?

A) `killall` usa PIDs y `pkill` usa nombres
B) `killall` requiere nombre exacto y `pkill` usa coincidencia parcial (patron)
C) `killall` solo puede enviar SIGKILL y `pkill` puede enviar cualquier senal
D) No hay diferencia, son sinonimos

<details>
<summary>Respuesta</summary>

**B) `killall` requiere nombre exacto y `pkill` usa coincidencia parcial (patron)**

`killall` mata procesos cuyo nombre coincide **exactamente** con el argumento. Por ejemplo, `killall apache2` solo matara procesos llamados exactamente "apache2". `pkill` funciona con coincidencia parcial (usa patrones), por lo que `pkill apach` mataria cualquier proceso cuyo nombre contenga "apach". Ambos comandos pueden enviar cualquier senal (no solo SIGKILL) y ambos usan nombres de proceso (no PIDs).
</details>

---

## Pregunta 7
Un administrador ejecuta los siguientes comandos:
```bash
sleep 100 &
sleep 200 &
sleep 300 &
jobs
```
Que mostrara el comando `jobs` y cual es el trabajo "actual" (marcado con `+`)?

A) Los tres trabajos, con `sleep 100` marcado como `+`
B) Los tres trabajos, con `sleep 300` marcado como `+`
C) Solo el ultimo trabajo
D) Ningun trabajo, porque se ejecutaron en background

<details>
<summary>Respuesta</summary>

**B) Los tres trabajos, con `sleep 300` marcado como `+`**

`jobs` muestra todos los trabajos del shell actual, incluyendo los que se ejecutan en segundo plano. La salida seria algo como:
```
[1]   Running    sleep 100 &
[2]-  Running    sleep 200 &
[3]+  Running    sleep 300 &
```
El simbolo `+` marca el trabajo mas reciente (el ultimo que se inicio o manipulo), que es el "trabajo actual". El simbolo `-` marca el trabajo anterior. Los comandos `fg` y `bg` sin argumentos actuan sobre el trabajo marcado con `+`.
</details>

---

## Pregunta 8
Que informacion muestra el comando `uptime` y que significan los valores de "load average"?

A) Solo muestra cuanto tiempo lleva encendido el sistema
B) Muestra hora actual, uptime, usuarios conectados y carga media (1, 5 y 15 minutos)
C) Muestra el uso de CPU y memoria
D) Muestra los procesos activos y su tiempo de ejecucion

<details>
<summary>Respuesta</summary>

**B) Muestra hora actual, uptime, usuarios conectados y carga media (1, 5 y 15 minutos)**

La salida de `uptime` se ve asi:
```
14:30:25 up 45 days, 3:22, 2 users, load average: 0.15, 0.10, 0.05
```
Incluye: la hora actual, el tiempo que lleva encendido el sistema, el numero de usuarios conectados y los tres valores de **load average** (carga media del sistema en los ultimos 1, 5 y 15 minutos). El load average indica cuantos procesos estan en ejecucion o esperando CPU. Un valor de 1.0 en un sistema con una CPU significa 100% de uso; en un sistema con 4 CPUs, un load average de 4.0 seria el 100%.
</details>
