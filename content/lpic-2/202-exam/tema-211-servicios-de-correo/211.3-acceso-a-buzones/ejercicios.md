---
title: "211.3 - Acceso a buzones"
tags: [lpic-2, examen-202, tema-211, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "211"
subtema: "211.3"
---

# 211.3 - Ejercicios: Acceso a buzones

## Pregunta 1

¿Cuáles son los puertos estándar para IMAP sin cifrar y con SSL/TLS?

a) 110 y 995
b) 143 y 993
c) 143 y 995
d) 110 y 993

<details><summary>Respuesta</summary>

**b) 143 y 993**

IMAP utiliza el puerto 143 para conexiones sin cifrar y el puerto 993 para conexiones SSL/TLS (IMAPS). Los puertos 110 y 995 corresponden a POP3 y POP3S respectivamente.
</details>

## Pregunta 2

¿Qué directiva de Dovecot define la ubicación de los buzones de correo?

a) mailbox_path
b) mail_home
c) mail_location
d) inbox_path

<details><summary>Respuesta</summary>

**c) mail_location**

La directiva `mail_location` en `/etc/dovecot/conf.d/10-mail.conf` define dónde busca Dovecot los buzones de correo. Los valores más comunes son `maildir:~/Maildir` para formato Maildir y `mbox:~/mail:INBOX=/var/mail/%u` para formato mbox.
</details>

## Pregunta 3

¿Qué valor de la directiva `ssl` en Dovecot obliga a que todas las conexiones usen cifrado?

a) ssl = yes
b) ssl = force
c) ssl = required
d) ssl = mandatory

<details><summary>Respuesta</summary>

**c) ssl = required**

`ssl = required` obliga a que todas las conexiones a Dovecot utilicen cifrado SSL/TLS. `ssl = yes` hace que SSL esté disponible pero sea opcional, y `ssl = no` lo deshabilita completamente.
</details>

## Pregunta 4

¿Cuál es la principal diferencia funcional entre IMAP y POP3?

a) IMAP es más rápido que POP3
b) IMAP mantiene el correo en el servidor, POP3 lo descarga al cliente
c) POP3 soporta carpetas y subcarpetas, IMAP no
d) IMAP solo funciona con cifrado, POP3 no requiere cifrado

<details><summary>Respuesta</summary>

**b) IMAP mantiene el correo en el servidor, POP3 lo descarga al cliente**

IMAP gestiona el correo en el servidor, permitiendo acceso desde múltiples dispositivos y gestión completa de carpetas. POP3 descarga el correo al cliente local, tras lo cual normalmente se elimina del servidor.
</details>

## Pregunta 5

¿Qué comando de Dovecot muestra solo los parámetros de configuración que difieren de los valores por defecto?

a) doveconf -a
b) doveconf -n
c) dovecot -c
d) doveadm config

<details><summary>Respuesta</summary>

**b) doveconf -n**

`doveconf -n` muestra solo los parámetros que han sido modificados respecto a los valores por defecto, lo que facilita revisar la configuración personalizada. `doveconf -a` muestra todos los parámetros, incluyendo los valores por defecto.
</details>

## Pregunta 6

¿En qué directorio se encuentra la configuración modular de Dovecot?

a) /etc/dovecot/modules/
b) /etc/dovecot/conf.d/
c) /etc/dovecot/config.d/
d) /etc/dovecot.d/

<details><summary>Respuesta</summary>

**b) /etc/dovecot/conf.d/**

La configuración modular de Dovecot se distribuye en archivos dentro del directorio `/etc/dovecot/conf.d/`. Cada archivo se encarga de un aspecto diferente: autenticación (10-auth.conf), correo (10-mail.conf), SSL (10-ssl.conf), etc.
</details>

## Pregunta 7

¿Qué formato de buzón soporta exclusivamente Courier-IMAP?

a) mbox
b) Maildir
c) mbox y Maildir
d) dbox

<details><summary>Respuesta</summary>

**b) Maildir**

Courier-IMAP solo soporta el formato Maildir. A diferencia de Dovecot, que soporta tanto mbox como Maildir, Courier-IMAP está diseñado específicamente para trabajar con buzones Maildir.
</details>

## Pregunta 8

¿Qué sintaxis especial se utiliza en Dovecot para indicar la ruta del certificado SSL?

a) ssl_cert = "/etc/ssl/certs/cert.pem"
b) ssl_cert = file:/etc/ssl/certs/cert.pem
c) ssl_cert = </etc/ssl/certs/cert.pem
d) ssl_cert = path(/etc/ssl/certs/cert.pem)

<details><summary>Respuesta</summary>

**c) ssl_cert = </etc/ssl/certs/cert.pem**

Dovecot utiliza la sintaxis `<` antes de la ruta del archivo para indicar que debe leer el contenido del archivo. Se escribe `ssl_cert = </etc/ssl/certs/cert.pem` (sin espacio entre `<` y la ruta).
</details>

## Pregunta 9

¿Qué mecanismo de autenticación de Dovecot se utiliza típicamente con conexiones SSL/TLS?

a) cram-md5
b) digest-md5
c) plain
d) ntlm

<details><summary>Respuesta</summary>

**c) plain**

El mecanismo `plain` envía las credenciales en texto plano, pero es seguro cuando se usa sobre una conexión SSL/TLS cifrada. Es el mecanismo más simple, compatible y ampliamente soportado. La directiva `disable_plaintext_auth = yes` garantiza que solo se use con conexiones cifradas.
</details>

## Pregunta 10

¿Qué protocolo utiliza Dovecot para actuar como agente de entrega local integrado con Postfix?

a) SMTP
b) LMTP
c) LDA
d) IMAP

<details><summary>Respuesta</summary>

**b) LMTP**

LMTP (Local Mail Transfer Protocol) es el protocolo que Dovecot ofrece para recibir correo de Postfix y entregarlo directamente a los buzones. Se configura en Postfix con `mailbox_transport = lmtp:unix:private/dovecot-lmtp`. LDA (Local Delivery Agent) es otro método pero LMTP es el recomendado.
</details>
