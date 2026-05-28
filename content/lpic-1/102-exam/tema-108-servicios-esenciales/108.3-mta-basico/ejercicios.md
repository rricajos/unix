---
title: "108.3 Fundamentos de MTA - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-108
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "108"
subtema: "108.3"
---

# 108.3 Fundamentos de MTA - Ejercicios

### Pregunta 1

Cual de los siguientes componentes del sistema de correo se encarga de transferir mensajes entre servidores mediante el protocolo SMTP?

a) MUA (Mail User Agent)
b) MTA (Mail Transfer Agent)
c) MDA (Mail Delivery Agent)
d) MSA (Mail Submission Agent)

<details><summary>Respuesta</summary>

**b) MTA (Mail Transfer Agent)**

El MTA (Mail Transfer Agent) es el componente responsable de transferir correo entre servidores usando el protocolo SMTP. Ejemplos de MTAs son sendmail, postfix y exim. El MUA (Mail User Agent) es el cliente de correo que usa el usuario (Thunderbird, mutt). El MDA (Mail Delivery Agent) entrega el correo al buzon local del usuario (procmail, maildrop). El MSA no es un componente estandar del examen LPIC-1.

</details>

---

### Pregunta 2

Despues de editar el archivo `/etc/aliases` para agregar un nuevo alias de correo, que comando se debe ejecutar para que los cambios tengan efecto?

a) `postfix reload`
b) `sendmail -q`
c) `newaliases`
d) `systemctl restart postfix`

<details><summary>Respuesta</summary>

**c) `newaliases`**

El comando `newaliases` reconstruye la base de datos de aliases (`/etc/aliases.db`) a partir del archivo de texto `/etc/aliases`. Sin ejecutar este comando, los cambios en `/etc/aliases` no tendran efecto. Una alternativa equivalente es `sendmail -bi`. Reiniciar postfix o ejecutar `sendmail -q` (que procesa la cola) no reconstruyen la base de datos de aliases.

</details>

---

### Pregunta 3

Cual es el puerto estandar utilizado por SMTP para la transferencia de correo entre servidores?

a) Puerto 22
b) Puerto 25
c) Puerto 110
d) Puerto 587

<details><summary>Respuesta</summary>

**b) Puerto 25**

El puerto 25 es el puerto estandar de SMTP para la transferencia de correo entre servidores. El puerto 587 se usa para SMTP submission (envio de correo con autenticacion desde un cliente). El puerto 465 se usa para SMTPS (SMTP sobre SSL/TLS). El puerto 22 es SSH y el puerto 110 es POP3. Para el examen LPIC-1, el puerto 25 es el mas importante como puerto estandar de SMTP.

</details>

---

### Pregunta 4

Un usuario quiere redirigir su correo a `otro@gmail.com` pero tambien mantener una copia local. Cual es el contenido correcto del archivo `~/.forward`?

a) `otro@gmail.com`
b) `\miusuario, otro@gmail.com`
c) `forward: otro@gmail.com, local`
d) `miusuario, otro@gmail.com`

<details><summary>Respuesta</summary>

**b) `\miusuario, otro@gmail.com`**

La barra invertida `\` antes del nombre de usuario local evita la expansion recursiva del alias y asegura que se mantenga una copia local del correo. Sin la barra invertida (opcion D), podria producirse un bucle de expansion. La opcion A solo reenvia sin guardar copia local. La opcion C usa una sintaxis incorrecta. El archivo `~/.forward` permite redireccion personal sin necesidad de permisos de root.

</details>

---

### Pregunta 5

Cual de los siguientes comandos muestra la cola de correo pendiente de envio?

a) `postfix status`
b) `sendmail -q`
c) `mailq`
d) `mail --queue`

<details><summary>Respuesta</summary>

**c) `mailq`**

El comando `mailq` es la forma estandar de ver la cola de correo pendiente de envio, mostrando los mensajes con su ID, tamano, fecha y remitente/destinatario. Es equivalente a `sendmail -bp` y `postqueue -p` (en Postfix). La opcion B (`sendmail -q`) procesa la cola (intenta enviar los mensajes pendientes), no la muestra. Las opciones A y D no son comandos validos con esa sintaxis.

</details>

---

### Pregunta 6

Cual es la diferencia principal entre los formatos de buzon `mbox` y `Maildir`?

a) `mbox` usa un directorio por usuario y `Maildir` un archivo por usuario
b) `mbox` almacena todos los mensajes en un unico archivo y `Maildir` usa un directorio con un archivo por mensaje
c) `mbox` es mas moderno y robusto que `Maildir`
d) No hay diferencia significativa, solo varia la ubicacion por defecto

<details><summary>Respuesta</summary>

**b) `mbox` almacena todos los mensajes en un unico archivo y `Maildir` usa un directorio con un archivo por mensaje**

El formato `mbox` almacena todos los mensajes de un usuario en un unico archivo (tipicamente `/var/spool/mail/usuario` o `/var/mail/usuario`), lo cual es simple pero presenta problemas de bloqueo con acceso concurrente. `Maildir` usa un directorio con tres subdirectorios (`new/`, `cur/`, `tmp/`) y almacena cada mensaje como un archivo individual, ofreciendo mejor rendimiento, sin problemas de bloqueo y mayor robustez ante fallos.

</details>

---

### Pregunta 7

En el archivo `/etc/aliases`, que hace la siguiente linea: `alertas: |/usr/local/bin/procesar-alerta.sh`?

a) Crea un alias que redirige el correo a un archivo de log
b) Envia el correo destinado a `alertas` como entrada (stdin) al script indicado
c) Ejecuta el script cada vez que el servidor de correo se inicia
d) Crea un filtro que bloquea el correo destinado a `alertas`

<details><summary>Respuesta</summary>

**b) Envia el correo destinado a `alertas` como entrada (stdin) al script indicado**

El caracter pipe `|` en `/etc/aliases` indica que el correo destinado al alias se debe enviar como entrada estandar (stdin) al comando o script especificado. Esto permite procesar automaticamente los correos con scripts personalizados. Despues de agregar esta linea, se debe ejecutar `newaliases` para que el cambio tenga efecto.

</details>

---

### Pregunta 8

Cual de los siguientes es el archivo de configuracion principal de Postfix?

a) `/etc/sendmail.cf`
b) `/etc/postfix/master.cf`
c) `/etc/postfix/main.cf`
d) `/etc/mail/postfix.conf`

<details><summary>Respuesta</summary>

**c) `/etc/postfix/main.cf`**

El archivo de configuracion principal de Postfix es `/etc/postfix/main.cf`, donde se definen parametros como `myhostname`, `mydomain`, `myorigin`, `inet_interfaces`, `mydestination` y `mynetworks`. El archivo `/etc/postfix/master.cf` define los procesos de Postfix pero no la configuracion principal. `/etc/sendmail.cf` es la configuracion de sendmail (MTA clasico) y `/etc/mail/postfix.conf` no existe.

</details>

---

### Pregunta 9

Que comando es equivalente a ejecutar `newaliases` para reconstruir la base de datos de aliases?

a) `sendmail -q`
b) `sendmail -bp`
c) `sendmail -bi`
d) `sendmail -t`

<details><summary>Respuesta</summary>

**c) `sendmail -bi`**

La opcion `-bi` de sendmail reconstruye la base de datos de aliases, siendo equivalente al comando `newaliases`. La opcion `-q` procesa la cola de correo. La opcion `-bp` muestra la cola de correo (equivalente a `mailq`). La opcion `-t` lee los destinatarios del encabezado del mensaje. Todos los MTAs proporcionan un comando `sendmail` compatible con estas opciones.

</details>

---

### Pregunta 10

Como se envia un correo desde la linea de comandos con el asunto "Reporte" y el contenido del archivo `/tmp/reporte.txt` al usuario `admin@ejemplo.com`?

a) `mail -s "Reporte" admin@ejemplo.com > /tmp/reporte.txt`
b) `sendmail -s "Reporte" admin@ejemplo.com /tmp/reporte.txt`
c) `mail -s "Reporte" admin@ejemplo.com < /tmp/reporte.txt`
d) `mail --subject "Reporte" --file /tmp/reporte.txt admin@ejemplo.com`

<details><summary>Respuesta</summary>

**c) `mail -s "Reporte" admin@ejemplo.com < /tmp/reporte.txt`**

El comando `mail` con la opcion `-s` establece el asunto del correo. La redireccion de entrada `<` envia el contenido del archivo como cuerpo del mensaje. La opcion A usa `>` que redirige la salida (no la entrada). La opcion B usa una sintaxis incorrecta de sendmail (que no tiene opcion `-s`). La opcion D usa opciones largas que no existen en el comando `mail`.

</details>
