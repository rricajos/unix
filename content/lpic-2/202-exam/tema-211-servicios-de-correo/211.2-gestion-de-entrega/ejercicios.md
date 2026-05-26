---
title: "211.2 - Gestión de entrega"
tags: [lpic-2, examen-202, tema-211, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "211"
subtema: "211.2"
---

# 211.2 - Ejercicios: Gestión de entrega

## Pregunta 1

¿Cuáles son los tres subdirectorios estándar de un buzón Maildir?

a) inbox/, sent/, trash/
b) new/, cur/, tmp/
c) read/, unread/, pending/
d) mail/, queue/, archive/

<details><summary>Respuesta</summary>

**b) new/, cur/, tmp/**

Un buzón Maildir tiene tres subdirectorios: `new/` (mensajes nuevos no leídos), `cur/` (mensajes leídos o procesados) y `tmp/` (mensajes en proceso de entrega). Cada mensaje se almacena como un archivo individual.
</details>

## Pregunta 2

¿Qué ventaja tiene Maildir sobre mbox para acceso concurrente?

a) Maildir usa cifrado automático
b) Maildir no requiere bloqueo de archivos
c) Maildir comprime los mensajes automáticamente
d) Maildir es más rápido en lectura secuencial

<details><summary>Respuesta</summary>

**b) Maildir no requiere bloqueo de archivos**

Como cada mensaje es un archivo individual en Maildir, no hay necesidad de bloquear un archivo compartido para escribir. En mbox, todos los mensajes están en un solo archivo y se necesita bloqueo para evitar corrupción durante el acceso concurrente.
</details>

## Pregunta 3

En una regla Procmail, ¿qué indica la barra final (`/`) en la ruta del destino?

a) Que el destino es un archivo comprimido
b) Que el destino es un directorio Maildir
c) Que se debe crear el directorio si no existe
d) Que se sobrescribe el contenido anterior

<details><summary>Respuesta</summary>

**b) Que el destino es un directorio Maildir**

En Procmail, una ruta que termina en `/` indica que el destino es un buzón Maildir. Sin la barra final, Procmail trata la ruta como un archivo mbox. Por ejemplo, `.spam/` entrega al Maildir y `.spam` entrega a un archivo mbox.
</details>

## Pregunta 4

¿Qué flag de Procmail se utiliza para hacer una copia del mensaje y continuar procesando reglas?

a) :0 f
b) :0 w
c) :0 c
d) :0 d

<details><summary>Respuesta</summary>

**c) :0 c**

El flag `c` (copy) hace que Procmail entregue una copia del mensaje al destino indicado y continúe evaluando las reglas siguientes con el mensaje original. Sin este flag, la primera regla que coincida entrega el mensaje y detiene el procesamiento.
</details>

## Pregunta 5

¿Qué acción de Sieve se utiliza para mover un mensaje a una carpeta específica?

a) moveto "carpeta"
b) fileinto "carpeta"
c) deliver "carpeta"
d) store "carpeta"

<details><summary>Respuesta</summary>

**b) fileinto "carpeta"**

La acción `fileinto` de Sieve mueve el mensaje a la carpeta especificada. Es una de las acciones más utilizadas en los scripts Sieve para organizar el correo automáticamente.
</details>

## Pregunta 6

¿Qué herramienta actúa como interfaz entre Postfix y los filtros de contenido como SpamAssassin y ClamAV?

a) milter-manager
b) amavisd-new
c) postscreen
d) content-filter

<details><summary>Respuesta</summary>

**b) amavisd-new**

amavisd-new es un intermediario entre el MTA (Postfix) y los filtros de contenido (antivirus y antispam). Recibe correo del MTA en el puerto 10024, lo pasa por los filtros configurados y lo devuelve al MTA en el puerto 10025.
</details>

## Pregunta 7

¿Qué comando se utiliza para actualizar las firmas de virus de ClamAV?

a) clamupdate
b) clamscan --update
c) freshclam
d) clamav-update

<details><summary>Respuesta</summary>

**c) freshclam**

`freshclam` es el comando que descarga y actualiza las bases de datos de firmas de virus de ClamAV. Normalmente se ejecuta como un demonio o mediante cron para mantener las firmas actualizadas.
</details>

## Pregunta 8

¿Qué parámetro de Postfix se configura para activar el uso de buzones virtuales?

a) virtual_users = yes
b) virtual_mailbox_domains
c) enable_virtual = true
d) virtual_transport

<details><summary>Respuesta</summary>

**b) virtual_mailbox_domains**

`virtual_mailbox_domains` en main.cf define los dominios para los que Postfix gestiona buzones virtuales. Se complementa con `virtual_mailbox_maps` (mapa de buzones), `virtual_mailbox_base` (directorio base) y `virtual_uid_maps`/`virtual_gid_maps` (propietario).
</details>

## Pregunta 9

¿Dónde se almacenan las reglas de filtrado Sieve del usuario cuando se usa Dovecot?

a) /etc/sieve/usuario.sieve
b) ~/.procmailrc
c) ~/.dovecot.sieve
d) /etc/dovecot/sieve/usuario

<details><summary>Respuesta</summary>

**c) ~/.dovecot.sieve**

Las reglas Sieve del usuario se almacenan por defecto en `~/.dovecot.sieve`. La ubicación se puede cambiar en la configuración de Dovecot mediante la directiva `sieve` en el archivo de configuración del plugin Sieve.
</details>

## Pregunta 10

¿Qué parámetro en SpamAssassin define la puntuación mínima para considerar un mensaje como spam?

a) spam_threshold
b) required_score
c) min_score
d) spam_level

<details><summary>Respuesta</summary>

**b) required_score**

`required_score` en `/etc/spamassassin/local.cf` define la puntuación mínima a partir de la cual un mensaje se clasifica como spam. El valor por defecto es 5.0. Los mensajes que superan esta puntuación se marcan con cabeceras de spam.
</details>
