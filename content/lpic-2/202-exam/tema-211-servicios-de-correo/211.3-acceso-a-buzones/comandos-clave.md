---
title: "211.3 - Acceso a buzones"
tags: [lpic-2, examen-202, tema-211, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "211"
subtema: "211.3"
---

# 211.3 - Comandos clave: Acceso a buzones

## Puertos de acceso a buzones

| Servicio | Puerto sin cifrar | Puerto SSL/TLS |
|----------|------------------|----------------|
| IMAP | 143 | 993 |
| POP3 | 110 | 995 |

## IMAP vs POP3

| Característica | IMAP | POP3 |
|---------------|------|------|
| Correo almacenado en | Servidor | Cliente (se descarga) |
| Carpetas remotas | Sí | No |
| Múltiples dispositivos | Sí | No (normalmente) |
| Puerto estándar | 143 | 110 |
| Puerto SSL | 993 | 995 |

## Estructura de configuración de Dovecot

| Archivo | Función |
|---------|---------|
| `/etc/dovecot/dovecot.conf` | Archivo principal |
| `/etc/dovecot/conf.d/10-auth.conf` | Autenticación |
| `/etc/dovecot/conf.d/10-mail.conf` | Ubicación de buzones |
| `/etc/dovecot/conf.d/10-master.conf` | Servicios y puertos |
| `/etc/dovecot/conf.d/10-ssl.conf` | SSL/TLS |
| `/etc/dovecot/conf.d/15-lda.conf` | Agente de entrega local |
| `/etc/dovecot/conf.d/20-imap.conf` | Configuración IMAP |
| `/etc/dovecot/conf.d/20-pop3.conf` | Configuración POP3 |
| `/etc/dovecot/conf.d/90-sieve.conf` | Plugin Sieve |

## Directivas clave de Dovecot

| Directiva | Archivo | Descripción |
|-----------|---------|-------------|
| `protocols` | dovecot.conf | Protocolos habilitados (imap, pop3, lmtp) |
| `listen` | dovecot.conf | Interfaces de escucha |
| `mail_location` | 10-mail.conf | Ubicación de buzones |
| `ssl` | 10-ssl.conf | Estado SSL: no, yes, required |
| `ssl_cert` | 10-ssl.conf | Ruta al certificado (con `<`) |
| `ssl_key` | 10-ssl.conf | Ruta a la clave privada (con `<`) |
| `disable_plaintext_auth` | 10-auth.conf | Deshabilitar auth sin SSL |
| `auth_mechanisms` | 10-auth.conf | Mecanismos: plain, login, cram-md5 |

## Comandos de gestión de Dovecot

| Comando | Descripción |
|---------|-------------|
| `doveconf -n` | Mostrar configuración no predeterminada |
| `doveconf -a` | Mostrar toda la configuración |
| `doveadm auth test usuario` | Probar autenticación |
| `doveadm user '*'` | Listar usuarios configurados |
| `doveadm who` | Ver usuarios conectados actualmente |
| `doveadm mailbox list -u usuario` | Listar buzones de un usuario |
| `doveadm reload` | Recargar configuración |

## Courier-IMAP (referencia)

| Archivo | Función |
|---------|---------|
| `/etc/courier/imapd` | Configuración IMAP |
| `/etc/courier/imapd-ssl` | Configuración IMAP-SSL |
| `/etc/courier/pop3d` | Configuración POP3 |
| `/etc/courier/pop3d-ssl` | Configuración POP3-SSL |
| `/etc/courier/authdaemonrc` | Demonio de autenticación |

## Webmail

| Aplicación | Configuración |
|------------|---------------|
| SquirrelMail | `/etc/squirrelmail/config.php` o conf.pl |
| Roundcube | `/etc/roundcube/config.inc.php` |

## Integración Dovecot-Postfix

| Función | Configuración Postfix |
|---------|----------------------|
| Autenticación SASL | `smtpd_sasl_type = dovecot` |
| Socket SASL | `smtpd_sasl_path = private/auth` |
| Habilitar SASL | `smtpd_sasl_auth_enable = yes` |
| Entrega LMTP | `mailbox_transport = lmtp:unix:private/dovecot-lmtp` |

## Valores de mail_location

| Formato | Ejemplo |
|---------|---------|
| Maildir | `maildir:~/Maildir` |
| mbox | `mbox:~/mail:INBOX=/var/mail/%u` |
| Variable %u | Se sustituye por el nombre de usuario |
| Variable %d | Se sustituye por el dominio |
