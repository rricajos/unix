---
title: "108.2 Registro del sistema - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-108
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "108"
subtema: "108.2"
---

# 108.2 Registro del sistema - Ejercicios

### Pregunta 1

En rsyslog, que significa la regla `mail.=warning /var/log/mail.warn`?

a) Registra todos los mensajes de la facility `mail` con prioridad `warning` y superiores
b) Registra solo los mensajes de la facility `mail` con prioridad exacta `warning`
c) Registra todos los mensajes excepto los de prioridad `warning`
d) Registra los mensajes de todas las facilities con prioridad `warning`

<details><summary>Respuesta</summary>

**b) Registra solo los mensajes de la facility `mail` con prioridad exacta `warning`**

El operador `=` antes de la prioridad indica que solo se registra esa prioridad exacta. Sin el operador `=`, la regla `mail.warning` registraria la prioridad `warning` y todas las superiores (err, crit, alert, emerg). Los operadores de prioridad en syslog son: sin operador (esa y superiores), `=` (solo esa exacta), `!` (excepto esa y superiores), y `none` (excluir la facility).

</details>

---

### Pregunta 2

Cual es el orden correcto de las prioridades de syslog, de mayor a menor severidad?

a) debug, info, notice, warning, err, crit, alert, emerg
b) emerg, alert, crit, err, warning, notice, info, debug
c) emerg, crit, alert, err, warning, notice, info, debug
d) alert, emerg, crit, err, warning, notice, info, debug

<details><summary>Respuesta</summary>

**b) emerg, alert, crit, err, warning, notice, info, debug**

Las 8 prioridades de syslog en orden de mayor a menor severidad son: emerg (0), alert (1), crit (2), err (3), warning (4), notice (5), info (6), debug (7). Una regla mnemotecnica util es: "Every Alley Cat Eats Wet Noodles In December" (Emerg, Alert, Crit, Err, Warning, Notice, Info, Debug).

</details>

---

### Pregunta 3

Que comando envia un mensaje personalizado a syslog con facility `local0` y prioridad `info` desde un script bash?

a) `syslog -p local0.info "Mensaje"`
b) `logger -p local0.info -t miscript "Mensaje"`
c) `journalctl --send "local0.info" "Mensaje"`
d) `rsyslog -f local0 -p info "Mensaje"`

<details><summary>Respuesta</summary>

**b) `logger -p local0.info -t miscript "Mensaje"`**

El comando `logger` se utiliza para generar mensajes syslog desde la linea de comandos o scripts. La opcion `-p` especifica la facility y prioridad en formato `facility.priority`, y `-t` agrega una etiqueta (tag) al mensaje. Los comandos `syslog`, `rsyslog` y `journalctl --send` no existen con esa sintaxis.

</details>

---

### Pregunta 4

Cual es la diferencia entre `/var/log/wtmp` y `/var/log/btmp`?

a) `wtmp` registra los intentos fallidos y `btmp` los logins exitosos
b) `wtmp` registra los logins exitosos y `btmp` los intentos de login fallidos
c) Ambos registran la misma informacion pero en formato diferente
d) `wtmp` es para el sistema y `btmp` es para las aplicaciones

<details><summary>Respuesta</summary>

**b) `wtmp` registra los logins exitosos y `btmp` los intentos de login fallidos**

`/var/log/wtmp` registra los logins exitosos del sistema y se lee con el comando `last`. `/var/log/btmp` registra los intentos de login fallidos y se lee con el comando `lastb` (requiere permisos de root). Ambos son archivos binarios que no se pueden leer directamente con `cat` o `less`; se necesitan los comandos especializados `last` y `lastb` respectivamente.

</details>

---

### Pregunta 5

En la configuracion de rsyslog, que diferencia hay entre `*.* @192.168.1.100:514` y `*.* @@192.168.1.100:514`?

a) `@` envia por TCP y `@@` envia por UDP
b) `@` envia por UDP y `@@` envia por TCP
c) `@` envia en texto plano y `@@` envia cifrado con TLS
d) No hay diferencia, ambas envian por TCP

<details><summary>Respuesta</summary>

**b) `@` envia por UDP y `@@` envia por TCP**

En rsyslog, un solo `@` indica envio de logs al servidor remoto usando UDP, mientras que doble `@@` indica envio usando TCP. Una regla mnemotecnica es: `@` = UDP (un arroba, un protocolo simple), `@@` = TCP (dos arrobas, protocolo con mas garantias). TCP es mas fiable porque garantiza la entrega, pero genera mas overhead. UDP es mas rapido pero puede perder mensajes.

</details>

---

### Pregunta 6

Que comando de `journalctl` muestra los logs del servicio `sshd` desde hace 2 horas con prioridad error o superior?

a) `journalctl --service sshd --since "2h" --level err`
b) `journalctl -u sshd --since "2 hours ago" -p err`
c) `journalctl -f sshd -t "2 hours" -p error`
d) `journalctl --unit=sshd --time=2h --priority=3`

<details><summary>Respuesta</summary>

**b) `journalctl -u sshd --since "2 hours ago" -p err`**

En `journalctl`, la opcion `-u` filtra por unidad de servicio systemd, `--since` especifica el tiempo de inicio (acepta formatos como "2 hours ago", "yesterday", o fechas absolutas), y `-p` filtra por prioridad (la prioridad indicada y todas las superiores). La prioridad `err` incluye err, crit, alert y emerg.

</details>

---

### Pregunta 7

Como se limita el espacio en disco del journal de systemd a un maximo de 200MB de forma permanente?

a) Ejecutando `journalctl --vacuum-size=200M`
b) Configurando `SystemMaxUse=200M` en `/etc/systemd/journald.conf`
c) Editando `MaxDiskUsage=200M` en `/etc/rsyslog.conf`
d) Ejecutando `systemctl set-property systemd-journald MaxSize=200M`

<details><summary>Respuesta</summary>

**b) Configurando `SystemMaxUse=200M` en `/etc/systemd/journald.conf`**

Para limitar de forma permanente el espacio del journal, se configura la directiva `SystemMaxUse=200M` en la seccion `[Journal]` de `/etc/systemd/journald.conf`, seguido de un reinicio del servicio con `systemctl restart systemd-journald`. La opcion A (`journalctl --vacuum-size=200M`) realiza una limpieza inmediata pero no establece un limite permanente. Las opciones C y D no son sintaxis validas.

</details>

---

### Pregunta 8

En logrotate, que hace la directiva `copytruncate`?

a) Copia el archivo rotado y lo comprime inmediatamente
b) Copia el contenido al archivo rotado y trunca el original a cero
c) Crea una copia de seguridad antes de eliminar el archivo
d) Trunca el archivo sin hacer copia

<details><summary>Respuesta</summary>

**b) Copia el contenido al archivo rotado y trunca el original a cero**

La directiva `copytruncate` copia el contenido del archivo de log al archivo rotado y luego trunca el archivo original a cero bytes. Esto es util para aplicaciones que mantienen el archivo abierto y no pueden ser senalizadas para reabrir el archivo (ya que el descriptor de archivo sigue apuntando al mismo inodo). Sin `copytruncate`, logrotate mueve el archivo y crea uno nuevo, lo cual requiere que la aplicacion reabra el archivo.

</details>

---

### Pregunta 9

Que valor de `Storage` en `/etc/systemd/journald.conf` hace que el journal sea persistente creando automaticamente el directorio si no existe?

a) `Storage=auto`
b) `Storage=persistent`
c) `Storage=volatile`
d) `Storage=permanent`

<details><summary>Respuesta</summary>

**b) `Storage=persistent`**

Con `Storage=persistent`, el journal almacena los logs de forma persistente en `/var/log/journal/` y crea el directorio automaticamente si no existe. Con `Storage=auto` (valor por defecto), el almacenamiento es persistente solo si el directorio `/var/log/journal/` ya existe; si no existe, los logs se guardan de forma volatil en `/run/log/journal/`. `Storage=volatile` almacena solo en RAM y `Storage=permanent` no es un valor valido.

</details>

---

### Pregunta 10

Cual de los siguientes comandos muestra los mensajes del buffer del anillo del kernel con marcas de tiempo legibles?

a) `dmesg -H`
b) `dmesg -T`
c) `dmesg -l`
d) `dmesg -c`

<details><summary>Respuesta</summary>

**b) `dmesg -T`**

La opcion `-T` de `dmesg` muestra las marcas de tiempo en formato legible para humanos (fecha y hora completas) en lugar de los segundos desde el arranque del sistema. La opcion `-H` muestra el formato legible para humanos (human-readable) con paginacion. La opcion `-l` filtra por nivel de severidad (por ejemplo, `dmesg -l err`). La opcion `-c` muestra los mensajes y limpia el buffer.

</details>
