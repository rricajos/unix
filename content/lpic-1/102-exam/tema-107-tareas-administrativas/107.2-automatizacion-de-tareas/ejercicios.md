---
title: "107.2 - Ejercicios: Automatizacion de tareas"
tags:
  - lpic-1
  - examen-102
  - tema-107
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "107"
subtema: "107.2"
---

# 107.2 - Ejercicios: Automatizacion de tareas

### Pregunta 1

Cual de las siguientes entradas de crontab ejecuta un script todos los dias a las 3:30 AM?

a) `3 30 * * * /opt/backup.sh`
b) `30 3 * * * /opt/backup.sh`
c) `* * 3 30 * /opt/backup.sh`
d) `30 3 * * 1-7 /opt/backup.sh`

<details><summary>Respuesta</summary>

**b) `30 3 * * * /opt/backup.sh`**

El formato del crontab es: `minuto hora dia_mes mes dia_semana comando`. En `30 3 * * *`: minuto 30, hora 3, cualquier dia del mes (`*`), cualquier mes (`*`), cualquier dia de la semana (`*`). La opcion (a) tiene los campos de minuto y hora invertidos (ejecutaria a las 30:03, que es invalido). La opcion (d) usa `1-7` para el dia de semana, que aunque tambien incluye todos los dias, es redundante respecto a `*`.

</details>

---

### Pregunta 2

Cual es la diferencia principal entre el formato del crontab de usuario (`crontab -e`) y el archivo `/etc/crontab`?

a) El crontab del sistema usa 4 campos de tiempo y el de usuario usa 5
b) El crontab del sistema incluye un campo extra que especifica el usuario que ejecuta el comando
c) El crontab de usuario permite variables de entorno y el del sistema no
d) El crontab de usuario acepta la cadena `@reboot` y el del sistema no

<details><summary>Respuesta</summary>

**b) El crontab del sistema incluye un campo extra que especifica el usuario que ejecuta el comando**

El crontab de usuario tiene 5 campos de tiempo + comando (6 elementos): `min hora dia mes dia_sem comando`. El crontab del sistema (`/etc/crontab` y archivos en `/etc/cron.d/`) tiene 5 campos de tiempo + campo USUARIO + comando (7 elementos): `min hora dia mes dia_sem usuario comando`. El campo de usuario extra especifica con que cuenta se ejecuta el comando. Los crontabs de usuario se ejecutan como el usuario que los creo; los del sistema pueden especificar cualquier usuario.

</details>

---

### Pregunta 3

Un servidor tiene solo el archivo `/etc/cron.deny` con el contenido `ana`. Que ocurre si se crea `/etc/cron.allow` con el contenido `sandra`?

a) `ana` es la unica bloqueada y `sandra` tiene acceso prioritario
b) Solo `sandra` podra usar cron; todos los demas (incluida `ana`) seran bloqueados
c) Tanto `sandra` como `ana` podran usar cron
d) Se produce un error porque ambos archivos no pueden coexistir

<details><summary>Respuesta</summary>

**b) Solo `sandra` podra usar cron; todos los demas (incluida `ana`) seran bloqueados**

La logica de control de acceso de cron es: si `/etc/cron.allow` existe, SOLO los usuarios listados pueden usar cron (cron.deny se ignora completamente). Si solo existe `cron.deny`, todos pueden usar cron excepto los listados. Al crear `cron.allow` con solo `sandra`, se activa la regla mas restrictiva: unicamente `sandra` tendra acceso a cron, y `cron.deny` dejara de tener efecto. `cron.allow` siempre tiene prioridad absoluta sobre `cron.deny`.

</details>

---

### Pregunta 4

Que es anacron y cual es su principal ventaja sobre cron?

a) Es una version mas rapida de cron con precision de segundos
b) Es un complemento de cron que ejecuta tareas perdidas cuando el sistema estaba apagado
c) Es un reemplazo completo de cron que permite programar tareas por cualquier usuario
d) Es una herramienta grafica para gestionar las entradas de crontab

<details><summary>Respuesta</summary>

**b) Es un complemento de cron que ejecuta tareas perdidas cuando el sistema estaba apagado**

**Anacron** esta disenado para sistemas que NO estan encendidos 24/7 (laptops, estaciones de trabajo). Si una tarea programada no se ejecuto porque el sistema estaba apagado, anacron la ejecuta cuando el sistema se encienda. Registra la ultima ejecucion en `/var/spool/anacron/`. A diferencia de cron, su precision minima es en dias (no minutos), solo puede ser ejecutado por root, y no es un daemon permanente sino que es invocado periodicamente. Su configuracion esta en `/etc/anacrontab`.

</details>

---

### Pregunta 5

Que comando de `at` se utiliza para listar las tareas pendientes y cual para eliminar una tarea con ID 3?

a) `at -list` y `at -remove 3`
b) `atq` (o `at -l`) y `atrm 3` (o `at -d 3`)
c) `at --pending` y `at --delete 3`
d) `crontab -l` y `crontab -r 3`

<details><summary>Respuesta</summary>

**b) `atq` (o `at -l`) y `atrm 3` (o `at -d 3`)**

`atq` (equivalente a `at -l`) lista todas las tareas pendientes mostrando el ID, fecha/hora programada y usuario. `atrm 3` (equivalente a `at -d 3`) elimina la tarea con ID 3. `at` se usa para tareas **unicas** (se ejecutan una vez y se eliminan automaticamente). Se puede programar con formatos como `at 15:00`, `at now + 2 hours`, `at noon tomorrow`. `batch` es similar pero ejecuta cuando la carga del sistema es baja (por defecto < 0.8).

</details>

---

### Pregunta 6

Cual de los siguientes es el formato correcto de una linea en `/etc/anacrontab`?

a) `min hora dia mes dia_sem comando`
b) `periodo retardo identificador comando`
c) `hora dia_sem usuario comando`
d) `OnCalendar=daily ExecStart=/ruta/script.sh`

<details><summary>Respuesta</summary>

**b) `periodo retardo identificador comando`**

El formato de `/etc/anacrontab` tiene 4 campos: **periodo** (frecuencia en dias, por ejemplo 1 = diario, 7 = semanal, `@monthly`), **retardo** (minutos de espera antes de ejecutar, para no sobrecargar al arrancar), **identificador** (nombre unico usado para registrar la ultima ejecucion en `/var/spool/anacron/`) y **comando** (lo que se ejecuta). Ejemplo: `1 5 cron.daily nice run-parts /etc/cron.daily` ejecuta las tareas diarias con 5 minutos de retardo.

</details>

---

### Pregunta 7

Que diferencia hay entre los directorios `/etc/cron.daily/` y `/etc/cron.d/`?

a) `/etc/cron.daily/` contiene archivos crontab y `/etc/cron.d/` contiene scripts ejecutables
b) `/etc/cron.daily/` contiene scripts ejecutables (sin formato crontab); `/etc/cron.d/` contiene archivos en formato crontab (con campo de usuario)
c) Ambos contienen scripts ejecutables que se ejecutan diariamente
d) Ambos contienen archivos en formato crontab con precision de minutos

<details><summary>Respuesta</summary>

**b) `/etc/cron.daily/` contiene scripts ejecutables (sin formato crontab); `/etc/cron.d/` contiene archivos en formato crontab (con campo de usuario)**

`/etc/cron.daily/` (y hourly, weekly, monthly) contiene **scripts ejecutables** que se ejecutan con `run-parts` a la frecuencia indicada por el nombre del directorio. Los scripts deben tener permiso de ejecucion y son scripts normales con shebang (no tienen formato crontab). `/etc/cron.d/` contiene **archivos en formato crontab** (igual que `/etc/crontab`) con el campo de usuario incluido, y permiten programacion con precision de minutos. Son instalados tipicamente por paquetes de software.

</details>

---

### Pregunta 8

Que dos archivos se necesitan para crear un timer de systemd y que opcion asegura que se ejecuten tareas perdidas si el sistema estaba apagado?

a) Un archivo `.timer` y un `.service`; la opcion `Persistent=true`
b) Un archivo `.cron` y un `.target`; la opcion `Recover=yes`
c) Un archivo `.schedule` y un `.service`; la opcion `OnMissed=retry`
d) Un archivo `.timer` y un `.conf`; la opcion `AutoRestart=true`

<details><summary>Respuesta</summary>

**a) Un archivo `.timer` y un `.service`; la opcion `Persistent=true`**

Los timers de systemd requieren dos archivos: un `.timer` (define cuando se ejecuta, con opciones como `OnCalendar`) y un `.service` (define que se ejecuta, con `ExecStart`). La opcion `Persistent=true` en la seccion `[Timer]` asegura que si se perdio una ejecucion porque el sistema estaba apagado, se ejecute al encender (similar a anacron). Se gestionan con `systemctl enable/start nombre.timer` y se listan con `systemctl list-timers`.

</details>

---

### Pregunta 9

Que significa la expresion `*/15 * * * *` en un crontab?

a) Ejecutar a las 15:00 de cada dia
b) Ejecutar cada 15 minutos (en los minutos 0, 15, 30 y 45 de cada hora)
c) Ejecutar el dia 15 de cada mes
d) Ejecutar 15 veces por hora

<details><summary>Respuesta</summary>

**b) Ejecutar cada 15 minutos (en los minutos 0, 15, 30 y 45 de cada hora)**

El operador `/` indica incremento: `*/15` en el campo de minutos significa "cada 15 minutos", ejecutandose en los minutos 0, 15, 30 y 45 de cada hora. Los simbolos especiales en crontab son: `*` (cualquier valor), `,` (lista de valores, ej: `1,15,30`), `-` (rango, ej: `1-5`), `/` (incremento, ej: `*/10`). Tambien existen cadenas especiales como `@daily` (equivalente a `0 0 * * *`), `@hourly` (`0 * * * *`) y `@reboot`.

</details>

---

### Pregunta 10

Que comando de systemd permite ejecutar una tarea unica programada para dentro de 5 minutos, como alternativa a `at`?

a) `systemctl schedule --in 5m /ruta/script.sh`
b) `systemd-run --on-active=5m /ruta/script.sh`
c) `systemd-timer create --delay=5m /ruta/script.sh`
d) `timedatectl run --after=5m /ruta/script.sh`

<details><summary>Respuesta</summary>

**b) `systemd-run --on-active=5m /ruta/script.sh`**

`systemd-run` permite ejecutar un comando como una unidad transitoria de systemd. Con `--on-active=5m`, el comando se ejecutara dentro de 5 minutos. Es una alternativa moderna a `at` integrada en systemd. Otras opciones incluyen `--on-calendar` para programar en un momento especifico y `--on-boot` para ejecutar despues del arranque. Las ventajas sobre `at` son: los logs se registran en el journal (consultables con `journalctl`), soporta dependencias de unidades y no requiere archivos allow/deny.

</details>
