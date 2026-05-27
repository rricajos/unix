---
title: "206.3 - Notificacion a usuarios"
tags: [lpic-2, examen-201, tema-206, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "206"
subtema: "206.3"
---

# 206.3 - Ejercicios: Notificacion a usuarios

### Pregunta 1

¿Que archivo se muestra al usuario ANTES de iniciar sesion en una consola local?

a) `/etc/motd`
b) `/etc/issue`
c) `/etc/issue.net`
d) `/etc/login.msg`

<details><summary>Respuesta</summary>

**b) `/etc/issue`**

El archivo `/etc/issue` se muestra en la pantalla de login de la consola local antes de que el usuario introduzca sus credenciales. `/etc/motd` se muestra despues del login exitoso, y `/etc/issue.net` es para conexiones remotas.

</details>

### Pregunta 2

¿Que directiva se debe configurar en `/etc/ssh/sshd_config` para que SSH muestre un banner antes del login?

a) `MotdFile /etc/issue.net`
b) `LoginBanner /etc/issue.net`
c) `Banner /etc/issue.net`
d) `PreLoginMessage /etc/issue.net`

<details><summary>Respuesta</summary>

**c) `Banner /etc/issue.net`**

La directiva `Banner` en `/etc/ssh/sshd_config` especifica el archivo cuyo contenido se mostrara al usuario antes de la autenticacion SSH. Normalmente se apunta a `/etc/issue.net`, aunque puede ser cualquier archivo de texto.

</details>

### Pregunta 3

¿Que comando envia un mensaje a TODOS los usuarios conectados al sistema?

a) `write`
b) `msg`
c) `wall`
d) `broadcast`

<details><summary>Respuesta</summary>

**c) `wall`**

El comando `wall` (Write to ALL) envia un mensaje a todas las terminales de todos los usuarios que estan conectados al sistema. El comando `write` envia un mensaje a un usuario especifico.

</details>

### Pregunta 4

Un usuario ejecuta `mesg n` en su terminal. ¿Cual es el efecto?

a) No podra recibir mensajes de `wall` ni de `write`
b) No podra recibir mensajes de `write`, pero los mensajes de `wall` de root si llegaran
c) Todos los mensajes seran redirigidos a su correo
d) Solo bloqueara los mensajes del sistema

<details><summary>Respuesta</summary>

**b) No podra recibir mensajes de `write`, pero los mensajes de `wall` de root si llegaran**

`mesg n` deshabilita la escritura en la terminal del usuario por parte de otros usuarios, bloqueando los mensajes de `write`. Sin embargo, los mensajes enviados con `wall` por el usuario root generalmente no son bloqueados por esta configuracion.

</details>

### Pregunta 5

¿Que secuencia de escape en `/etc/issue` muestra el nombre del host?

a) `\h`
b) `\n`
c) `\s`
d) `\H`

<details><summary>Respuesta</summary>

**b) `\n`**

En el archivo `/etc/issue`, la secuencia `\n` muestra el nombre del host (hostname) de la maquina. Nota: esto es diferente de la secuencia `\n` en otros contextos (como bash), donde representa un salto de linea.

</details>

### Pregunta 6

¿Como se cancela un apagado programado con `shutdown` y se notifica a los usuarios?

a) `shutdown --abort "Mensaje"`
b) `shutdown -c "El reinicio ha sido cancelado"`
c) `shutdown --cancel`
d) `kill $(pidof shutdown)`

<details><summary>Respuesta</summary>

**b) `shutdown -c "El reinicio ha sido cancelado"`**

La opcion `-c` (cancel) de `shutdown` cancela un apagado o reinicio previamente programado. El mensaje opcional se envia a todos los usuarios conectados para informarles de la cancelacion.

</details>

### Pregunta 7

¿Cual es la diferencia principal entre `/etc/issue` y `/etc/issue.net`?

a) `/etc/issue` es para sistemas SysV, `/etc/issue.net` para systemd
b) `/etc/issue` se muestra en la consola local, `/etc/issue.net` en conexiones remotas
c) `/etc/issue.net` es la version cifrada de `/etc/issue`
d) No hay diferencia, son sinonimos

<details><summary>Respuesta</summary>

**b) `/etc/issue` se muestra en la consola local, `/etc/issue.net` en conexiones remotas**

`/etc/issue` es mostrado por `getty` (o `agetty`) en las consolas locales (tty). `/etc/issue.net` esta destinado a conexiones remotas como SSH o Telnet. Ademas, las secuencias de escape como `\n`, `\l`, etc., normalmente solo se interpretan en `/etc/issue`, no en `/etc/issue.net`.

</details>

### Pregunta 8

¿Para que se utiliza `systemd-ask-password`?

a) Para cambiar la contrasena de un usuario del sistema
b) Para solicitar contrasenas de forma segura durante el arranque, como claves de descifrado LUKS
c) Para verificar la fortaleza de una contrasena
d) Para enviar contrasenas cifradas a los usuarios

<details><summary>Respuesta</summary>

**b) Para solicitar contrasenas de forma segura durante el arranque, como claves de descifrado LUKS**

`systemd-ask-password` es una herramienta de systemd disenada para solicitar contrasenas de forma segura, tipicamente durante el arranque del sistema. Su uso mas comun es pedir la contrasena de descifrado de particiones LUKS cifradas. Trabaja con agentes como Plymouth (grafico) o la consola de texto.

</details>

### Pregunta 9

¿En que directorio se encuentran los scripts que generan el MOTD dinamico en distribuciones basadas en Debian/Ubuntu?

a) `/etc/motd.d/`
b) `/etc/update-motd.d/`
c) `/usr/lib/motd/`
d) `/var/run/motd.d/`

<details><summary>Respuesta</summary>

**b) `/etc/update-motd.d/`**

En distribuciones basadas en Debian/Ubuntu, el MOTD puede generarse dinamicamente mediante scripts ejecutables ubicados en `/etc/update-motd.d/`. Los scripts se ejecutan en orden numerico (00-header, 10-help-text, etc.) y su salida combinada forma el mensaje del dia que ven los usuarios.

</details>

### Pregunta 10

Un administrador necesita enviar un mensaje solo al usuario "maria" que esta conectada en la terminal `pts/3`. ¿Que comando debe usar?

a) `wall maria pts/3 "Mensaje"`
b) `write maria pts/3`
c) `msg maria pts/3 "Mensaje"`
d) `notify maria pts/3`

<details><summary>Respuesta</summary>

**b) `write maria pts/3`**

El comando `write` permite enviar un mensaje a un usuario especifico en una terminal determinada. La sintaxis es `write usuario [terminal]`. Despues de ejecutar el comando, se escribe el mensaje linea por linea y se finaliza con Ctrl+D. El comando `wall` no acepta un usuario especifico como destino.

</details>
