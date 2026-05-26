---
title: "211.1 - Servidores de correo"
tags: [lpic-2, examen-202, tema-211, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "211"
subtema: "211.1"
---

# 211.1 - Servidores de correo

## Peso: 4

## Conceptos fundamentales del correo electrónico

### Componentes del sistema de correo

| Componente | Función | Ejemplos |
|------------|---------|----------|
| **MUA** (Mail User Agent) | Cliente de correo del usuario | Thunderbird, mutt, Outlook |
| **MTA** (Mail Transfer Agent) | Transfiere correo entre servidores | Postfix, Sendmail, Exim |
| **MDA** (Mail Delivery Agent) | Entrega el correo al buzón local | Procmail, maildrop, Dovecot LDA |
| **MSA** (Mail Submission Agent) | Recibe correo del MUA para envío | Postfix (puerto 587) |

### Flujo del correo electrónico

```
Remitente (MUA) → MSA (587) → MTA (25) → MTA destino (25) → MDA → Buzón → MUA destinatario
```

### Protocolo SMTP y puertos

| Puerto | Protocolo | Uso |
|--------|-----------|-----|
| **25** | SMTP | Transferencia entre MTAs (servidor a servidor) |
| **465** | SMTPS | SMTP sobre SSL/TLS (histórico, reutilizado) |
| **587** | Submission | Envío de correo autenticado (MUA a MTA) |

> **Para el examen:** El puerto 25 es para comunicación entre servidores MTA. El puerto 587 es para que los clientes (MUA) envíen correo con autenticación. Memoriza estos puertos y sus funciones.

## Postfix

Postfix es el MTA más utilizado en Linux. Es modular, seguro y fácil de configurar en comparación con Sendmail.

### Arquitectura de Postfix

Postfix está compuesto por múltiples procesos especializados:

| Proceso | Función |
|---------|---------|
| `master` | Proceso principal, gestiona los demás |
| `smtpd` | Recibe correo vía SMTP |
| `smtp` | Envía correo a otros servidores |
| `pickup` | Recoge correo de la cola local (maildrop) |
| `cleanup` | Procesa y limpia los mensajes entrantes |
| `qmgr` | Gestor de la cola de correo |
| `local` | Entrega local de correo |
| `bounce` | Gestiona mensajes devueltos |

### Archivo de configuración principal: main.cf

El archivo `/etc/postfix/main.cf` contiene la configuración principal de Postfix:

```bash
# /etc/postfix/main.cf

# Identidad del servidor
myhostname = correo.ejemplo.com
mydomain = ejemplo.com
myorigin = $mydomain

# Redes autorizadas para enviar correo
mynetworks = 127.0.0.0/8, 192.168.1.0/24

# Interfaces donde escuchar
inet_interfaces = all
# inet_interfaces = loopback-only   # Solo local

# Protocolos
inet_protocols = ipv4

# Destinos locales
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain

# Buzón
home_mailbox = Maildir/
# mailbox_command = /usr/bin/procmail

# Relay
relayhost = [smtp.proveedor.com]:587

# Alias
alias_maps = hash:/etc/aliases
alias_database = hash:/etc/aliases

# Límites
message_size_limit = 10240000
mailbox_size_limit = 51200000
```

### Parámetros principales de main.cf

| Parámetro | Descripción |
|-----------|-------------|
| `myhostname` | FQDN del servidor de correo |
| `mydomain` | Dominio del servidor |
| `myorigin` | Dominio que aparece en el campo "From" |
| `mynetworks` | Redes autorizadas para enviar correo (relay) |
| `inet_interfaces` | Interfaces donde escucha Postfix |
| `mydestination` | Dominios para los que el servidor acepta correo final |
| `relayhost` | Servidor al que reenviar correo saliente |
| `home_mailbox` | Ruta del buzón relativa al home del usuario |
| `alias_maps` | Mapa de alias de correo |
| `alias_database` | Base de datos de alias compilada |
| `message_size_limit` | Tamaño máximo de mensaje (bytes) |
| `mailbox_size_limit` | Tamaño máximo del buzón (bytes) |

> **Para el examen:** `mynetworks` define qué IPs pueden usar el servidor como relay. Una configuración incorrecta puede convertir el servidor en un open relay (retransmisión abierta), lo cual es un problema de seguridad grave.

### Restricciones SMTP

Las restricciones controlan qué correo se acepta y cuál se rechaza:

```bash
# Restricciones en la recepción
smtpd_recipient_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_unauth_destination,
    reject_unknown_sender_domain,
    reject_rbl_client zen.spamhaus.org

# Restricciones del remitente
smtpd_sender_restrictions =
    reject_unknown_sender_domain,
    reject_non_fqdn_sender

# Restricciones del cliente
smtpd_client_restrictions =
    permit_mynetworks,
    reject_unknown_client_hostname
```

### Restricciones comunes

| Restricción | Descripción |
|-------------|-------------|
| `permit_mynetworks` | Permitir redes en mynetworks |
| `permit_sasl_authenticated` | Permitir usuarios autenticados SASL |
| `reject_unauth_destination` | Rechazar relay no autorizado |
| `reject_unknown_sender_domain` | Rechazar remitentes con dominio sin DNS |
| `reject_unknown_recipient_domain` | Rechazar destinatarios con dominio sin DNS |
| `reject_non_fqdn_sender` | Rechazar remitentes sin FQDN |
| `reject_rbl_client` | Rechazar clientes en listas negras (RBL) |

### Archivo master.cf

El archivo `/etc/postfix/master.cf` define los servicios y procesos de Postfix:

```bash
# /etc/postfix/master.cf
# servicio  tipo  privado  unpriv  chroot  wakeup  maxproc  comando
smtp        inet  n        -       y       -       -        smtpd
submission  inet  n        -       y       -       -        smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,reject
```

## Aliases de correo

Los alias permiten redirigir correo de un usuario a otro.

### Archivo /etc/aliases

```bash
# /etc/aliases
postmaster:    root
root:          admin@ejemplo.com
webmaster:     juan
abuse:         admin
info:          juan, maria, pedro
```

### Comando newaliases

Después de modificar `/etc/aliases`, se debe regenerar la base de datos:

```bash
# Regenerar la base de datos de alias
newaliases

# Equivalente con postalias de Postfix
postalias /etc/aliases
```

> **Para el examen:** Siempre que se modifique `/etc/aliases`, hay que ejecutar `newaliases` para que los cambios surtan efecto. Esto genera el archivo hash `/etc/aliases.db`.

## Cola de correo

### Gestión de la cola

```bash
# Ver la cola de correo
mailq
# o equivalente:
postqueue -p

# Forzar el reenvío de la cola
postqueue -f

# Ver detalles de un mensaje en cola
postcat -q ID_MENSAJE

# Eliminar un mensaje de la cola
postsuper -d ID_MENSAJE

# Eliminar todos los mensajes de la cola
postsuper -d ALL

# Poner un mensaje en espera
postsuper -h ID_MENSAJE

# Liberar un mensaje en espera
postsuper -H ID_MENSAJE

# Reencolar todos los mensajes
postsuper -r ALL
```

### Comandos de cola de Postfix

| Comando | Descripción |
|---------|-------------|
| `mailq` / `postqueue -p` | Listar mensajes en cola |
| `postqueue -f` | Forzar envío inmediato de la cola |
| `postsuper -d ID` | Eliminar un mensaje de la cola |
| `postsuper -d ALL` | Eliminar todos los mensajes |
| `postsuper -h ID` | Poner en espera (hold) |
| `postsuper -H ID` | Liberar de espera |
| `postsuper -r ALL` | Reencolar todos los mensajes |
| `postcat -q ID` | Ver contenido de un mensaje en cola |

## Sendmail (conceptos básicos)

Sendmail es el MTA histórico de Unix. Aunque Postfix es más popular, conviene conocer los conceptos básicos de Sendmail.

### Archivos de configuración

| Archivo | Descripción |
|---------|-------------|
| `/etc/mail/sendmail.cf` | Configuración principal (compleja, generada automáticamente) |
| `/etc/mail/sendmail.mc` | Archivo fuente de macros m4 (se edita este) |
| `/etc/mail/access` | Control de acceso (relay, rechazo) |
| `/etc/mail/local-host-names` | Nombres de host locales |
| `/etc/mail/aliases` | Alias de correo |

### Macros m4 de Sendmail

El archivo `sendmail.mc` se procesa con m4 para generar `sendmail.cf`:

```m4
dnl /etc/mail/sendmail.mc
VERSIONID(`ejemplo')dnl
OSTYPE(`linux')dnl
define(`SMART_HOST', `smtp.proveedor.com')dnl
FEATURE(`access_db')dnl
MAILER(`local')dnl
MAILER(`smtp')dnl
```

```bash
# Regenerar sendmail.cf desde sendmail.mc
m4 /etc/mail/sendmail.mc > /etc/mail/sendmail.cf

# O en distribuciones con make
cd /etc/mail && make
```

> **Para el examen:** Nunca se edita directamente `sendmail.cf`. Se edita `sendmail.mc` y se genera el .cf con m4. Postfix es mucho más sencillo de configurar y es el foco principal del examen.

## Logs del correo

```bash
# Ubicación de logs
/var/log/mail.log       # Debian/Ubuntu
/var/log/maillog        # RHEL/CentOS

# Ver logs en tiempo real
tail -f /var/log/mail.log

# Filtrar logs de Postfix
journalctl -u postfix

# Buscar mensajes de un remitente
grep "from=<usuario@ejemplo.com>" /var/log/mail.log
```

## Comandos de gestión de Postfix

```bash
# Verificar configuración
postconf -n            # Mostrar solo parámetros modificados
postconf -d            # Mostrar valores por defecto
postconf myhostname    # Mostrar un parámetro específico

# Gestión del servicio
systemctl start postfix
systemctl reload postfix    # Recargar sin reiniciar
postfix check               # Verificar configuración
postfix reload              # Equivalente a systemctl reload
```

## Resumen de archivos clave

| Archivo | Función |
|---------|---------|
| `/etc/postfix/main.cf` | Configuración principal de Postfix |
| `/etc/postfix/master.cf` | Definición de servicios de Postfix |
| `/etc/aliases` | Alias de correo |
| `/etc/aliases.db` | Base de datos compilada de alias |
| `/var/spool/postfix/` | Directorio de colas de Postfix |
| `/var/log/mail.log` | Log de correo (Debian) |
| `/var/log/maillog` | Log de correo (RHEL) |
| `/etc/mail/sendmail.mc` | Fuente de configuración de Sendmail |
| `/etc/mail/sendmail.cf` | Configuración generada de Sendmail |
