---
title: "211.2 - Gestión de entrega"
tags: [lpic-2, examen-202, tema-211, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "211"
subtema: "211.2"
---

# 211.2 - Gestión de entrega

## Peso: 2

## Formatos de buzón de correo

### mbox vs Maildir

| Característica | mbox | Maildir |
|---------------|------|---------|
| **Formato** | Un solo archivo por buzón | Un directorio con un archivo por mensaje |
| **Ruta típica** | `/var/mail/usuario` | `~/Maildir/` |
| **Bloqueo** | Requiere bloqueo del archivo | No requiere bloqueo |
| **Concurrencia** | Problemático con acceso simultáneo | Seguro con acceso concurrente |
| **NFS** | Problemático sobre NFS | Funciona bien sobre NFS |
| **Rendimiento** | Se degrada con buzones grandes | Constante independientemente del tamaño |

### Estructura de Maildir

```
~/Maildir/
├── cur/           # Mensajes leídos
├── new/           # Mensajes nuevos (no leídos)
├── tmp/           # Mensajes en proceso de entrega
├── .Sent/         # Carpeta de enviados
│   ├── cur/
│   ├── new/
│   └── tmp/
├── .Drafts/       # Carpeta de borradores
└── .Trash/        # Carpeta de papelera
```

> **Para el examen:** Maildir es el formato recomendado para servidores modernos. Cada mensaje es un archivo individual en los subdirectorios `new/`, `cur/` y `tmp/`. No requiere bloqueo de archivos y funciona bien con NFS.

### Configuración del formato en Postfix

```bash
# Para usar Maildir (directorio por usuario)
home_mailbox = Maildir/

# Para usar mbox (archivo único)
home_mailbox = Mailbox
# o dejar que use /var/mail/usuario por defecto
```

## Procmail

Procmail es un MDA y filtro de correo local que permite clasificar y procesar correo según reglas definidas por el usuario.

### Configuración global y de usuario

| Archivo | Ámbito |
|---------|--------|
| `/etc/procmailrc` | Configuración global (todos los usuarios) |
| `~/.procmailrc` | Configuración personal del usuario |

### Integración con Postfix

```bash
# En /etc/postfix/main.cf
mailbox_command = /usr/bin/procmail -a "$EXTENSION"
```

### Formato de reglas .procmailrc

```bash
# ~/.procmailrc

# Variables de entorno
MAILDIR=$HOME/Maildir
DEFAULT=$MAILDIR/
LOGFILE=$HOME/procmail.log
VERBOSE=yes

# Regla: filtrar correo de una lista de distribución
:0
* ^List-Id:.*linux-users
.linux-users/

# Regla: mover spam a carpeta Junk
:0
* ^X-Spam-Status: Yes
.Junk/

# Regla: copiar correo del jefe a una carpeta especial
:0 c
* ^From:.*jefe@ejemplo.com
.importante/

# Regla: descartar correo de un remitente
:0
* ^From:.*spam@molesto.com
/dev/null

# Regla: ejecutar un programa externo
:0 w
* ^Subject:.*reporte
| /usr/local/bin/procesar_reporte.sh
```

### Flags de las reglas Procmail

| Flag | Descripción |
|------|-------------|
| `:0` | Inicio de regla (sin flags adicionales) |
| `:0 c` | Copia: entrega una copia y continúa procesando |
| `:0 f` | Filtro: pasa el mensaje por un programa y continúa |
| `:0 w` | Wait: espera a que el programa externo termine |
| `:0 h` | Solo cabeceras (header) |
| `:0 b` | Solo cuerpo (body) |
| `:0 H` | Condición aplicada a cabeceras (por defecto) |
| `:0 B` | Condición aplicada al cuerpo del mensaje |

### Destinos de entrega

| Destino | Descripción |
|---------|-------------|
| `/ruta/archivo` | Entregar a un archivo mbox |
| `/ruta/directorio/` | Entregar a un directorio Maildir (con barra final) |
| `\| programa` | Redirigir al stdin de un programa |
| `! usuario@dominio` | Reenviar a otra dirección |
| `/dev/null` | Descartar el mensaje |

> **Para el examen:** La barra final (`/`) en el destino es crítica: indica Maildir. Sin barra, Procmail trata el destino como un archivo mbox.

## Sieve

Sieve es un lenguaje estándar de filtrado de correo del lado del servidor, generalmente integrado con Dovecot o Cyrus.

### Integración con Dovecot

```bash
# /etc/dovecot/conf.d/90-sieve.conf
plugin {
    sieve = ~/.dovecot.sieve
    sieve_dir = ~/sieve
    sieve_global_dir = /etc/dovecot/sieve/
}
```

### Sintaxis de filtros Sieve

```sieve
# ~/.dovecot.sieve
require ["fileinto", "reject", "vacation"];

# Mover correo de listas a carpeta
if header :contains "List-Id" "linux-users" {
    fileinto "Listas.Linux";
}

# Rechazar correo de un remitente
if address :is "from" "spam@molesto.com" {
    reject "No acepto correo de esta dirección";
}

# Respuesta automática de vacaciones
if true {
    vacation :days 7 :subject "Fuera de oficina"
        "Estoy de vacaciones. Responderé a mi regreso.";
}

# Mover spam detectado
if header :contains "X-Spam-Status" "Yes" {
    fileinto "Junk";
}
```

### Acciones Sieve principales

| Acción | Descripción |
|--------|-------------|
| `keep` | Mantener en la bandeja de entrada (acción por defecto) |
| `fileinto "carpeta"` | Mover a una carpeta específica |
| `redirect "email"` | Redirigir a otra dirección |
| `reject "mensaje"` | Rechazar con un mensaje |
| `discard` | Descartar sin notificación |
| `vacation` | Respuesta automática de vacaciones |

## Usuarios virtuales

Los usuarios virtuales permiten gestionar buzones de correo sin necesidad de crear cuentas del sistema.

### Configuración en Postfix

```bash
# /etc/postfix/main.cf

# Dominios virtuales
virtual_mailbox_domains = dominio1.com, dominio2.com

# Mapa de buzones virtuales
virtual_mailbox_maps = hash:/etc/postfix/vmailbox

# Directorio base de buzones
virtual_mailbox_base = /var/mail/vhosts

# UID y GID del propietario de los buzones
virtual_uid_maps = static:5000
virtual_gid_maps = static:5000
```

```bash
# /etc/postfix/vmailbox
info@dominio1.com       dominio1.com/info/
admin@dominio1.com      dominio1.com/admin/
ventas@dominio2.com     dominio2.com/ventas/
```

```bash
# Generar la base de datos
postmap /etc/postfix/vmailbox
```

## Mapas de transporte de Postfix

Los transport maps permiten definir cómo y a dónde se entrega el correo según el destino:

```bash
# /etc/postfix/main.cf
transport_maps = hash:/etc/postfix/transport

# /etc/postfix/transport
ejemplo.com        smtp:[correo.ejemplo.com]:25
interno.local      local:
.backup.com        relay:[backup-mx.ejemplo.com]
```

```bash
# Generar la base de datos
postmap /etc/postfix/transport
```

## Filtrado de contenido

### SpamAssassin

SpamAssassin es un filtro antispam que analiza el correo y asigna puntuaciones:

```bash
# Configuración: /etc/spamassassin/local.cf
required_score 5.0
rewrite_header Subject [SPAM]
report_safe 0

# Integración con Postfix vía header_checks o content_filter
# En main.cf:
content_filter = spamassassin

# En master.cf:
spamassassin unix -     n       n       -       -       pipe
  user=spamd argv=/usr/bin/spamc -f -e /usr/sbin/sendmail -oi -f ${sender} ${recipient}
```

### amavisd-new

amavisd-new es una interfaz entre el MTA y los filtros de contenido (antivirus y antispam):

```bash
# Integración con Postfix en main.cf
content_filter = smtp-amavis:[127.0.0.1]:10024

# En master.cf
smtp-amavis     unix    -       -       -       -       2       smtp
    -o smtp_data_done_timeout=1200
    -o smtp_send_xforward_command=yes

# Puerto de retorno
127.0.0.1:10025 inet    n       -       -       -       -       smtpd
    -o content_filter=
    -o local_recipient_maps=
```

> **Para el examen:** amavisd-new actúa como intermediario entre Postfix y los filtros de contenido. El correo se envía al puerto 10024, se procesa y se devuelve al puerto 10025.

### ClamAV

ClamAV es el antivirus de código abierto más utilizado en servidores de correo Linux:

```bash
# Actualizar firmas
freshclam

# Integración típica: ClamAV se integra con amavisd-new
# En /etc/amavis/conf.d/15-content_filter_mode
@bypass_virus_checks_maps = (
   \%bypass_virus_checks, \@bypass_virus_checks_acl, \$bypass_virus_checks_re);
```

| Componente ClamAV | Función |
|-------------------|---------|
| `clamd` | Demonio antivirus residente en memoria |
| `clamscan` | Escaneo bajo demanda |
| `freshclam` | Actualización de firmas de virus |
| `clamav-milter` | Integración directa con MTA vía milter |

## Resumen de archivos clave

| Archivo | Función |
|---------|---------|
| `~/.procmailrc` | Reglas de filtrado Procmail del usuario |
| `/etc/procmailrc` | Reglas globales de Procmail |
| `~/.dovecot.sieve` | Reglas de filtrado Sieve del usuario |
| `/etc/postfix/vmailbox` | Mapa de buzones virtuales |
| `/etc/postfix/transport` | Mapa de transporte |
| `/etc/spamassassin/local.cf` | Configuración de SpamAssassin |
| `/etc/amavis/conf.d/` | Configuración de amavisd-new |
