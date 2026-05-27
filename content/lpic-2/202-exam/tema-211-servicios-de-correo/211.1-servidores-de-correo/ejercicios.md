---
title: "211.1 - Servidores de correo"
tags: [lpic-2, examen-202, tema-211, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "211"
subtema: "211.1"
---

# 211.1 - Ejercicios: Servidores de correo

### Pregunta 1

¿Qué componente del sistema de correo se encarga de transferir mensajes entre servidores?

a) MUA (Mail User Agent)
b) MTA (Mail Transfer Agent)
c) MDA (Mail Delivery Agent)
d) MSA (Mail Submission Agent)

<details><summary>Respuesta</summary>

**b) MTA (Mail Transfer Agent)**

El MTA es responsable de transferir el correo entre servidores utilizando el protocolo SMTP. Ejemplos de MTA son Postfix, Sendmail y Exim. El MUA es el cliente de correo del usuario, el MDA entrega el correo al buzón local y el MSA recibe correo del MUA para su envío.
</details>

### Pregunta 2

¿Cuál es el puerto estándar para el envío de correo autenticado desde un cliente (submission)?

a) 25
b) 110
c) 465
d) 587

<details><summary>Respuesta</summary>

**d) 587**

El puerto 587 (submission) es el puerto estándar para que los clientes de correo (MUA) envíen correo al servidor con autenticación. El puerto 25 es para comunicación entre servidores MTA, y el puerto 465 es para SMTPS (SMTP sobre SSL/TLS).
</details>

### Pregunta 3

¿Qué parámetro de Postfix define las redes autorizadas para usar el servidor como relay?

a) mydestination
b) mynetworks
c) relay_domains
d) permit_networks

<details><summary>Respuesta</summary>

**b) mynetworks**

`mynetworks` en `/etc/postfix/main.cf` define las direcciones IP y redes que tienen permiso para enviar correo a través del servidor sin autenticación adicional. Una configuración incorrecta puede crear un open relay.
</details>

### Pregunta 4

¿Qué comando se debe ejecutar después de modificar el archivo `/etc/aliases`?

a) postfix reload
b) aliasupdate
c) newaliases
d) postmap /etc/aliases

<details><summary>Respuesta</summary>

**c) newaliases**

`newaliases` regenera la base de datos hash de alias (`/etc/aliases.db`) a partir del archivo de texto `/etc/aliases`. Sin ejecutar este comando, los cambios en el archivo de alias no tendrán efecto.
</details>

### Pregunta 5

¿Qué comando muestra solo los parámetros de Postfix que difieren de los valores por defecto?

a) postconf -a
b) postconf -d
c) postconf -n
d) postconf -m

<details><summary>Respuesta</summary>

**c) postconf -n**

`postconf -n` muestra solo los parámetros que han sido modificados respecto a sus valores por defecto, lo que facilita ver la configuración personalizada. `postconf -d` muestra todos los valores por defecto.
</details>

### Pregunta 6

¿Qué restricción de Postfix se utiliza para prevenir que el servidor actúe como open relay?

a) reject_unknown_sender
b) reject_unauth_destination
c) reject_open_relay
d) deny_relay_access

<details><summary>Respuesta</summary>

**b) reject_unauth_destination**

`reject_unauth_destination` rechaza el correo destinado a dominios para los cuales el servidor no es el destino final ni tiene autorización de relay. Es la restricción fundamental para prevenir un open relay y debe incluirse en `smtpd_recipient_restrictions`.
</details>

### Pregunta 7

En Sendmail, ¿qué archivo se debe editar para realizar cambios de configuración?

a) /etc/mail/sendmail.cf
b) /etc/mail/sendmail.mc
c) /etc/mail/sendmail.conf
d) /etc/sendmail/main.cf

<details><summary>Respuesta</summary>

**b) /etc/mail/sendmail.mc**

Se edita `sendmail.mc` (archivo de macros m4) y luego se genera `sendmail.cf` ejecutando `m4 sendmail.mc > sendmail.cf`. El archivo `sendmail.cf` nunca se edita directamente debido a su complejidad extrema.
</details>

### Pregunta 8

¿Qué comando de Postfix elimina todos los mensajes de la cola de correo?

a) postqueue -d ALL
b) postsuper -d ALL
c) postflush ALL
d) mailq --delete-all

<details><summary>Respuesta</summary>

**b) postsuper -d ALL**

`postsuper -d ALL` elimina todos los mensajes de la cola de correo de Postfix. Para eliminar un mensaje específico se usa `postsuper -d ID_MENSAJE`. `postqueue` se usa para listar (`-p`) o forzar el envío (`-f`), no para eliminar.
</details>

### Pregunta 9

¿Qué parámetro de main.cf define el nombre de dominio completamente cualificado (FQDN) del servidor de correo?

a) mydomain
b) myorigin
c) myhostname
d) mail_name

<details><summary>Respuesta</summary>

**c) myhostname**

`myhostname` define el FQDN del servidor de correo (por ejemplo, `correo.ejemplo.com`). `mydomain` define solo el dominio (`ejemplo.com`), y `myorigin` define el dominio que aparece en las direcciones de correo saliente.
</details>

### Pregunta 10

¿Qué comando fuerza a Postfix a intentar reenviar inmediatamente todos los mensajes de la cola?

a) postfix flush
b) postqueue -f
c) postsuper -r ALL
d) mailq -f

<details><summary>Respuesta</summary>

**b) postqueue -f**

`postqueue -f` fuerza a Postfix a intentar entregar inmediatamente todos los mensajes que están en la cola. Es equivalente al comando `sendmail -q` en Sendmail. `postsuper -r ALL` reencola los mensajes pero no fuerza su envío inmediato.
</details>
