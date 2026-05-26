# 108.3 Fundamentos de MTA - Comandos clave

## mail / mailx

| Comando | Descripcion |
|---------|-------------|
| `mail usuario@ejemplo.com` | Enviar correo interactivamente |
| `echo "texto" \| mail -s "Asunto" usuario` | Enviar correo no interactivo |
| `mail` | Leer buzon del usuario actual |

## Aliases y redireccion

| Comando / Archivo | Descripcion |
|-------------------|-------------|
| `/etc/aliases` | Archivo de aliases del sistema |
| `newaliases` | Reconstruir base de datos de aliases |
| `~/.forward` | Redireccion personal de correo |

## Gestion de cola

| Comando | Descripcion |
|---------|-------------|
| `mailq` | Ver cola de correo pendiente |
| `postqueue -p` | Ver cola (postfix) |
| `postqueue -f` | Forzar reenvio de cola (postfix) |

## sendmail (interfaz compatible)

| Comando | Descripcion |
|---------|-------------|
| `sendmail usuario@ejemplo.com < archivo` | Enviar correo |
| `sendmail -q` | Procesar cola de correo |
| `sendmail -bp` | Mostrar cola (equivale a `mailq`) |
| `sendmail -bi` | Reconstruir aliases (equivale a `newaliases`) |
| `sendmail -t` | Leer destinatarios del encabezado |

## Componentes del correo

| Componente | Nombre | Funcion | Ejemplos |
|-----------|--------|---------|----------|
| MUA | Mail User Agent | Cliente de correo | mail, mutt, Thunderbird |
| MTA | Mail Transfer Agent | Transferencia | sendmail, postfix, exim |
| MDA | Mail Delivery Agent | Entrega local | procmail, maildrop |

## Puertos

| Puerto | Servicio |
|--------|----------|
| 25 | SMTP |
| 587 | SMTP submission |
| 465 | SMTPS (SSL/TLS) |

## Archivos de configuracion

| Archivo | Descripcion |
|---------|-------------|
| `/etc/postfix/main.cf` | Configuracion principal de Postfix |
| `/etc/aliases` | Aliases de correo del sistema |
| `~/.forward` | Redireccion personal del usuario |
| `/var/spool/mail/` o `/var/mail/` | Buzones de correo (formato mbox) |
| `~/Maildir/` | Buzones de correo (formato Maildir) |

## Formato de /etc/aliases

```
alias: destino
root: admin
webmaster: juan, maria
soporte: soporte@empresa.com
registro: /var/log/correo
tickets: |/usr/local/bin/script.sh
lista: :include:/etc/mail/lista
```
