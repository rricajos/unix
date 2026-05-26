---
title: "211.1 - Servidores de correo"
tags: [lpic-2, examen-202, tema-211, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "211"
subtema: "211.1"
---

# 211.1 - Comandos clave: Servidores de correo

## Comandos de gestión de Postfix

| Comando | Descripción |
|---------|-------------|
| `postfix start` | Iniciar Postfix |
| `postfix stop` | Detener Postfix |
| `postfix reload` | Recargar la configuración sin reiniciar |
| `postfix check` | Verificar la configuración |
| `postconf -n` | Mostrar parámetros no predeterminados |
| `postconf -d` | Mostrar todos los valores por defecto |
| `postconf parametro` | Consultar el valor de un parámetro |
| `postconf -e "parametro=valor"` | Modificar un parámetro en main.cf |

## Comandos de cola de correo

| Comando | Descripción |
|---------|-------------|
| `mailq` | Ver la cola de correo (alias de postqueue -p) |
| `postqueue -p` | Listar mensajes en la cola |
| `postqueue -f` | Forzar reenvío inmediato de toda la cola |
| `postsuper -d ID` | Eliminar un mensaje de la cola |
| `postsuper -d ALL` | Eliminar todos los mensajes de la cola |
| `postsuper -h ID` | Poner un mensaje en espera (hold) |
| `postsuper -H ID` | Liberar un mensaje de la espera |
| `postsuper -r ALL` | Reencolar todos los mensajes |
| `postcat -q ID` | Ver el contenido de un mensaje en cola |

## Alias de correo

| Comando | Descripción |
|---------|-------------|
| `newaliases` | Regenerar la base de datos de alias |
| `postalias /etc/aliases` | Alternativa Postfix a newaliases |

## Parámetros principales de main.cf

| Parámetro | Descripción |
|-----------|-------------|
| `myhostname` | FQDN del servidor |
| `mydomain` | Dominio del servidor |
| `myorigin` | Dominio del campo "From" |
| `mynetworks` | Redes autorizadas para relay |
| `inet_interfaces` | Interfaces de escucha |
| `mydestination` | Dominios de destino local |
| `relayhost` | Servidor relay para correo saliente |
| `alias_maps` | Mapa de alias |
| `alias_database` | Base de datos de alias |
| `home_mailbox` | Buzón relativo al home |
| `smtpd_recipient_restrictions` | Restricciones de destinatario |
| `message_size_limit` | Tamaño máximo de mensaje |

## Restricciones SMTP comunes

| Restricción | Función |
|-------------|---------|
| `permit_mynetworks` | Permitir redes locales |
| `permit_sasl_authenticated` | Permitir autenticados SASL |
| `reject_unauth_destination` | Rechazar relay no autorizado |
| `reject_unknown_sender_domain` | Rechazar remitentes sin DNS |
| `reject_rbl_client lista` | Rechazar por lista negra |

## Puertos SMTP

| Puerto | Uso |
|--------|-----|
| 25 | SMTP entre servidores (MTA a MTA) |
| 465 | SMTPS (SMTP sobre SSL/TLS) |
| 587 | Submission (MUA a MTA, autenticado) |

## Componentes del correo

| Componente | Función | Ejemplo |
|------------|---------|---------|
| MUA | Cliente de correo | Thunderbird |
| MTA | Transferencia de correo | Postfix, Sendmail |
| MDA | Entrega local | Procmail, Dovecot LDA |
| MSA | Recepción desde MUA | Postfix (587) |

## Sendmail (referencia básica)

| Comando/Archivo | Descripción |
|-----------------|-------------|
| `/etc/mail/sendmail.mc` | Archivo fuente (se edita este) |
| `/etc/mail/sendmail.cf` | Archivo generado (no editar) |
| `m4 sendmail.mc > sendmail.cf` | Generar configuración |
| `makemap hash /etc/mail/access < /etc/mail/access` | Compilar mapa de acceso |

## Archivos clave

| Archivo | Función |
|---------|---------|
| `/etc/postfix/main.cf` | Configuración principal de Postfix |
| `/etc/postfix/master.cf` | Servicios y procesos de Postfix |
| `/etc/aliases` | Alias de correo |
| `/var/spool/postfix/` | Colas de correo |
| `/var/log/mail.log` | Log de correo (Debian) |
| `/var/log/maillog` | Log de correo (RHEL) |
