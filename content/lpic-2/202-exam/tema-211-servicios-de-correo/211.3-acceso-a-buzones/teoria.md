---
title: "211.3 - Acceso a buzones"
tags: [lpic-2, examen-202, tema-211, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "211"
subtema: "211.3"
---

# 211.3 - Acceso a buzones

## Peso: 2

## Protocolos de acceso a buzones

### IMAP vs POP3

| Característica | IMAP | POP3 |
|---------------|------|------|
| **Puerto estándar** | 143 | 110 |
| **Puerto SSL/TLS** | 993 | 995 |
| **Gestión del correo** | En el servidor | En el cliente (descarga) |
| **Carpetas remotas** | Sí, gestión completa | No (solo bandeja de entrada) |
| **Sincronización** | Múltiples dispositivos | Un solo dispositivo |
| **Uso de disco servidor** | Mayor | Menor (correo se descarga) |
| **Conexión permanente** | Recomendada | No necesaria |
| **Protocolo estándar** | RFC 3501 | RFC 1939 |

> **Para el examen:** Memoriza los puertos: IMAP = 143 (sin cifrar) / 993 (SSL/TLS); POP3 = 110 (sin cifrar) / 995 (SSL/TLS). IMAP mantiene el correo en el servidor, POP3 lo descarga al cliente.

### Resumen de puertos

| Servicio | Puerto sin cifrar | Puerto SSL/TLS |
|----------|------------------|----------------|
| IMAP | 143 | 993 (IMAPS) |
| POP3 | 110 | 995 (POP3S) |
| SMTP | 25 | 465 (SMTPS) |
| Submission | 587 | 587 (STARTTLS) |

## Dovecot

Dovecot es el servidor IMAP/POP3 más utilizado en Linux. Es seguro, rápido y fácil de configurar.

### Instalación

```bash
# Debian/Ubuntu
apt install dovecot-core dovecot-imapd dovecot-pop3d

# RHEL/CentOS
yum install dovecot
```

### Estructura de configuración

Dovecot utiliza un sistema de configuración modular:

```
/etc/dovecot/
├── dovecot.conf                    # Archivo principal
├── conf.d/                         # Directorio de configuración modular
│   ├── 10-auth.conf               # Autenticación
│   ├── 10-logging.conf            # Registro de logs
│   ├── 10-mail.conf               # Ubicación de buzones
│   ├── 10-master.conf             # Servicios y puertos
│   ├── 10-ssl.conf                # Configuración SSL/TLS
│   ├── 15-lda.conf                # Agente de entrega local
│   ├── 15-mailboxes.conf          # Buzones por defecto
│   ├── 20-imap.conf               # Configuración IMAP
│   ├── 20-pop3.conf               # Configuración POP3
│   ├── 90-sieve.conf              # Plugin Sieve
│   └── auth-system.conf.ext       # Autenticación del sistema
```

### Archivo principal: dovecot.conf

```bash
# /etc/dovecot/dovecot.conf

# Protocolos habilitados
protocols = imap pop3 lmtp

# Escuchar en todas las interfaces
listen = *, ::

# Incluir configuración modular
!include conf.d/*.conf
```

### Configuración de protocolos (10-master.conf)

```bash
# /etc/dovecot/conf.d/10-master.conf

service imap-login {
    inet_listener imap {
        port = 143
    }
    inet_listener imaps {
        port = 993
        ssl = yes
    }
}

service pop3-login {
    inet_listener pop3 {
        port = 110
    }
    inet_listener pop3s {
        port = 995
        ssl = yes
    }
}

service lmtp {
    unix_listener /var/spool/postfix/private/dovecot-lmtp {
        mode = 0600
        user = postfix
        group = postfix
    }
}

service auth {
    unix_listener /var/spool/postfix/private/auth {
        mode = 0660
        user = postfix
        group = postfix
    }
}
```

### Configuración del buzón (10-mail.conf)

```bash
# /etc/dovecot/conf.d/10-mail.conf

# Ubicación del buzón (Maildir)
mail_location = maildir:~/Maildir

# Ubicación del buzón (mbox)
# mail_location = mbox:~/mail:INBOX=/var/mail/%u

# Grupo privilegiado para acceso a buzones
mail_privileged_group = mail

# Namespace para INBOX
namespace inbox {
    inbox = yes
    separator = /
}
```

> **Para el examen:** La directiva `mail_location` define dónde busca Dovecot los buzones de correo. Los formatos más comunes son `maildir:~/Maildir` y `mbox:~/mail:INBOX=/var/mail/%u`. La variable `%u` se sustituye por el nombre de usuario.

### Configuración de autenticación (10-auth.conf)

```bash
# /etc/dovecot/conf.d/10-auth.conf

# Deshabilitar login en texto plano sin SSL
disable_plaintext_auth = yes

# Mecanismos de autenticación
auth_mechanisms = plain login

# Incluir backends de autenticación
!include auth-system.conf.ext
# !include auth-ldap.conf.ext
# !include auth-sql.conf.ext
```

### Mecanismos de autenticación

| Mecanismo | Descripción |
|-----------|-------------|
| `plain` | Texto plano (requiere SSL/TLS) |
| `login` | Similar a plain, compatible con Outlook |
| `cram-md5` | Challenge-response (no requiere SSL) |
| `digest-md5` | Digest-based (más seguro que CRAM) |
| `ntlm` | Autenticación Windows NTLM |
| `gssapi` | Kerberos/GSSAPI |

### Backends de autenticación

```bash
# auth-system.conf.ext (autenticación del sistema)
passdb {
    driver = pam
    # o: driver = shadow
}
userdb {
    driver = passwd
}

# auth-ldap.conf.ext (autenticación LDAP)
passdb {
    driver = ldap
    args = /etc/dovecot/dovecot-ldap.conf.ext
}
userdb {
    driver = ldap
    args = /etc/dovecot/dovecot-ldap.conf.ext
}
```

## Configuración SSL/TLS (10-ssl.conf)

```bash
# /etc/dovecot/conf.d/10-ssl.conf

# Habilitar SSL
ssl = required
# Valores: no, yes, required

# Certificado y clave
ssl_cert = </etc/ssl/certs/dovecot.pem
ssl_key = </etc/ssl/private/dovecot.pem

# Protocolos SSL permitidos
ssl_min_protocol = TLSv1.2

# Cifrados preferidos
ssl_cipher_list = HIGH:!aNULL:!MD5
```

### Valores de la directiva ssl

| Valor | Comportamiento |
|-------|---------------|
| `no` | SSL deshabilitado |
| `yes` | SSL disponible pero opcional |
| `required` | SSL obligatorio para todas las conexiones |

> **Para el examen:** `ssl = required` obliga a que todas las conexiones usen cifrado. Nota la sintaxis especial de los certificados: `ssl_cert = </ruta` (con `<` antes de la ruta, sin espacio).

## Courier-IMAP

Courier-IMAP es una alternativa a Dovecot para servicios IMAP/POP3. Es menos utilizado actualmente pero aparece en el temario LPIC-2.

### Características principales

- Solo soporta el formato **Maildir** (no mbox)
- Incluye su propio sistema de autenticación (authdaemon)
- Configuración distribuida en múltiples archivos

### Archivos de configuración de Courier-IMAP

| Archivo | Función |
|---------|---------|
| `/etc/courier/imapd` | Configuración del servidor IMAP |
| `/etc/courier/imapd-ssl` | Configuración IMAP con SSL |
| `/etc/courier/pop3d` | Configuración del servidor POP3 |
| `/etc/courier/pop3d-ssl` | Configuración POP3 con SSL |
| `/etc/courier/authdaemonrc` | Configuración del demonio de autenticación |

### Configuración básica de Courier-IMAP

```bash
# /etc/courier/imapd
ADDRESS=0
PORT=143
MAXDAEMONS=40
MAXPERIP=20
MAILDIRPATH=Maildir

# /etc/courier/imapd-ssl
SSLPORT=993
TLS_CERTFILE=/etc/courier/ssl/imapd.pem
```

## Webmail

El acceso webmail permite a los usuarios consultar su correo a través de un navegador web.

### SquirrelMail

- Aplicación web escrita en PHP
- Ligera y sencilla
- Usa solo IMAP para acceder al correo
- Configuración mediante script `conf.pl`

```bash
# Archivo de configuración
/etc/squirrelmail/config.php
# o
/usr/share/squirrelmail/config/config.php

# Asistente de configuración
/usr/share/squirrelmail/config/conf.pl
```

### Roundcube

- Interfaz web moderna con AJAX
- Escrita en PHP con soporte de base de datos (MySQL, PostgreSQL, SQLite)
- Soporta plugins para ampliar funcionalidad
- Integración con Sieve para filtros

```bash
# Archivo de configuración
/etc/roundcube/config.inc.php
# o
/var/lib/roundcube/config/config.inc.php

# Parámetros principales
$config['default_host'] = 'localhost';     # Servidor IMAP
$config['default_port'] = 143;              # Puerto IMAP
$config['smtp_server'] = 'localhost';       # Servidor SMTP
$config['smtp_port'] = 587;                 # Puerto SMTP
```

> **Para el examen:** Tanto SquirrelMail como Roundcube son clientes webmail que se conectan al servidor de correo vía IMAP. No almacenan correo por sí mismos; son interfaces web para acceder a los buzones del servidor.

## Integración de Dovecot con Postfix

### SASL Authentication

Dovecot puede proporcionar autenticación SASL a Postfix:

```bash
# En Postfix main.cf
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes

# En Dovecot conf.d/10-master.conf
service auth {
    unix_listener /var/spool/postfix/private/auth {
        mode = 0660
        user = postfix
        group = postfix
    }
}
```

### LMTP (Local Mail Transfer Protocol)

Dovecot puede actuar como MDA vía LMTP:

```bash
# En Postfix main.cf
mailbox_transport = lmtp:unix:private/dovecot-lmtp
```

## Verificación y depuración

```bash
# Ver la configuración efectiva de Dovecot
doveconf -n       # Solo parámetros modificados
doveconf -a       # Todos los parámetros

# Probar autenticación
doveadm auth test usuario contraseña

# Ver usuarios configurados
doveadm user '*'

# Estado del servicio
systemctl status dovecot
doveadm who       # Usuarios conectados

# Logs
journalctl -u dovecot
tail -f /var/log/mail.log
```

## Resumen de archivos clave

| Archivo | Función |
|---------|---------|
| `/etc/dovecot/dovecot.conf` | Configuración principal de Dovecot |
| `/etc/dovecot/conf.d/` | Directorio de configuración modular |
| `/etc/dovecot/conf.d/10-auth.conf` | Autenticación |
| `/etc/dovecot/conf.d/10-mail.conf` | Ubicación de buzones |
| `/etc/dovecot/conf.d/10-master.conf` | Servicios y puertos |
| `/etc/dovecot/conf.d/10-ssl.conf` | Configuración SSL/TLS |
| `/etc/courier/imapd` | Configuración Courier-IMAP |
| `/etc/roundcube/config.inc.php` | Configuración Roundcube |
