---
title: "211.2 - Gestión de entrega"
tags: [lpic-2, examen-202, tema-211, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "211"
subtema: "211.2"
---

# 211.2 - Comandos clave: Gestión de entrega

## Formatos de buzón

| Formato | Ruta típica | Descripción |
|---------|-------------|-------------|
| mbox | `/var/mail/usuario` | Un archivo por buzón |
| Maildir | `~/Maildir/` | Un directorio con subdirectorios cur/, new/, tmp/ |

## Configuración de formato en Postfix

| Parámetro | Valor | Formato |
|-----------|-------|---------|
| `home_mailbox` | `Maildir/` | Maildir (con barra final) |
| `home_mailbox` | `Mailbox` | mbox |
| `mailbox_command` | `/usr/bin/procmail` | Delegar a Procmail |

## Procmail: sintaxis de reglas

| Elemento | Significado |
|----------|-------------|
| `:0` | Inicio de regla |
| `:0 c` | Copiar y continuar procesando |
| `:0 f` | Filtrar a través de un programa |
| `:0 w` | Esperar al programa externo |
| `:0 h` | Solo cabeceras |
| `:0 b` | Solo cuerpo |
| `* ^From:.*patron` | Condición (expresión regular en cabecera) |
| `/ruta/carpeta/` | Destino Maildir (con barra final) |
| `/ruta/archivo` | Destino mbox (sin barra) |
| `\| programa` | Pipe a programa externo |
| `! email@destino` | Reenvío |
| `/dev/null` | Descartar |

## Archivos Procmail

| Archivo | Ámbito |
|---------|--------|
| `/etc/procmailrc` | Configuración global |
| `~/.procmailrc` | Configuración por usuario |

## Sieve: acciones principales

| Acción | Descripción |
|--------|-------------|
| `keep` | Mantener en bandeja de entrada |
| `fileinto "carpeta"` | Mover a carpeta |
| `redirect "email"` | Redirigir |
| `reject "mensaje"` | Rechazar con mensaje |
| `discard` | Descartar silenciosamente |
| `vacation` | Respuesta automática |

## Usuarios virtuales en Postfix

| Parámetro | Descripción |
|-----------|-------------|
| `virtual_mailbox_domains` | Dominios virtuales |
| `virtual_mailbox_maps` | Mapa de buzones virtuales |
| `virtual_mailbox_base` | Directorio base de buzones |
| `virtual_uid_maps` | UID del propietario |
| `virtual_gid_maps` | GID del propietario |

## Mapas de transporte

```bash
# Generar mapa de transporte
postmap /etc/postfix/transport

# Generar mapa de buzones virtuales
postmap /etc/postfix/vmailbox
```

## Filtros de contenido

| Herramienta | Función |
|-------------|---------|
| SpamAssassin | Filtro antispam (puntuación) |
| amavisd-new | Interfaz MTA-filtros (puertos 10024/10025) |
| ClamAV | Antivirus de código abierto |

## Comandos ClamAV

| Comando | Descripción |
|---------|-------------|
| `freshclam` | Actualizar firmas de virus |
| `clamscan` | Escaneo antivirus bajo demanda |
| `clamd` | Demonio antivirus residente |
| `clamav-milter` | Integración con MTA vía milter |

## SpamAssassin

| Comando/Archivo | Descripción |
|-----------------|-------------|
| `spamc` | Cliente de SpamAssassin |
| `spamd` | Demonio de SpamAssassin |
| `/etc/spamassassin/local.cf` | Configuración local |
| `sa-learn --spam archivo` | Entrenar filtro bayesiano (spam) |
| `sa-learn --ham archivo` | Entrenar filtro bayesiano (legítimo) |

## Archivos clave

| Archivo | Función |
|---------|---------|
| `~/.procmailrc` | Reglas Procmail del usuario |
| `~/.dovecot.sieve` | Reglas Sieve del usuario |
| `/etc/postfix/vmailbox` | Buzones virtuales |
| `/etc/postfix/transport` | Mapas de transporte |
| `/etc/spamassassin/local.cf` | Configuración SpamAssassin |
| `/etc/amavis/conf.d/` | Configuración amavisd-new |
