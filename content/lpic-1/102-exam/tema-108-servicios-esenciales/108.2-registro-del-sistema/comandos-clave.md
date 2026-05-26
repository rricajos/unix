---
title: "108.2 Registro del sistema - Comandos clave"
tags:
  - lpic-1
  - examen-102
  - tema-108
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "108"
subtema: "108.2"
---

# 108.2 Registro del sistema - Comandos clave

## journalctl

| Comando | Descripcion |
|---------|-------------|
| `journalctl` | Mostrar todos los logs del journal |
| `journalctl -u sshd` | Logs de un servicio especifico |
| `journalctl -p err` | Solo prioridad err y superiores |
| `journalctl -f` | Seguimiento en tiempo real |
| `journalctl -b` | Logs del arranque actual |
| `journalctl -b -1` | Logs del arranque anterior |
| `journalctl --list-boots` | Listar arranques registrados |
| `journalctl -k` | Solo mensajes del kernel |
| `journalctl --since "1 hour ago"` | Desde hace 1 hora |
| `journalctl --since "2024-01-15" --until "2024-01-16"` | Rango de fechas |
| `journalctl --disk-usage` | Espacio usado por el journal |
| `journalctl --vacuum-size=100M` | Reducir journal a 100MB maximo |
| `journalctl --vacuum-time=2weeks` | Eliminar logs antiguos |
| `journalctl -o json` | Salida en formato JSON |
| `journalctl -n 50` | Ultimas 50 entradas |
| `journalctl --no-pager` | Sin paginador |

## logger

| Comando | Descripcion |
|---------|-------------|
| `logger "Mensaje"` | Enviar mensaje a syslog (user.notice) |
| `logger -p local0.info "Mensaje"` | Facility y priority especificas |
| `logger -t etiqueta "Mensaje"` | Con etiqueta personalizada |
| `logger -p auth.warning "Mensaje"` | Registrar en facility auth |

## dmesg

| Comando | Descripcion |
|---------|-------------|
| `dmesg` | Mostrar buffer del kernel |
| `dmesg -T` | Con marcas de tiempo legibles |
| `dmesg -H` | Formato humano legible |
| `dmesg -l err` | Solo nivel error |
| `dmesg -c` | Mostrar y limpiar buffer |

## logrotate

| Comando | Descripcion |
|---------|-------------|
| `logrotate /etc/logrotate.conf` | Ejecutar logrotate |
| `logrotate -f /etc/logrotate.conf` | Forzar rotacion |
| `logrotate -d /etc/logrotate.conf` | Modo debug (simulacion) |

## Facilities (principales)

| Facility | Origen |
|----------|--------|
| `auth` / `authpriv` | Autenticacion |
| `cron` | Tareas programadas |
| `daemon` | Demonios |
| `kern` | Kernel |
| `mail` | Correo |
| `user` | Aplicaciones de usuario |
| `local0`-`local7` | Uso personalizado |

## Priorities (de mayor a menor severidad)

| Priority | Valor | Descripcion |
|----------|-------|-------------|
| `emerg` | 0 | Sistema inutilizable |
| `alert` | 1 | Accion inmediata |
| `crit` | 2 | Critico |
| `err` | 3 | Error |
| `warning` | 4 | Advertencia |
| `notice` | 5 | Normal significativo |
| `info` | 6 | Informativo |
| `debug` | 7 | Depuracion |

## Archivos de log clave

| Archivo | Contenido | Lectura |
|---------|-----------|---------|
| `/var/log/messages` | General (RHEL) | `cat`, `less` |
| `/var/log/syslog` | General (Debian) | `cat`, `less` |
| `/var/log/auth.log` | Autenticacion (Debian) | `cat`, `less` |
| `/var/log/secure` | Autenticacion (RHEL) | `cat`, `less` |
| `/var/log/kern.log` | Kernel | `cat`, `less` |
| `/var/log/wtmp` | Logins exitosos | `last` |
| `/var/log/btmp` | Logins fallidos | `lastb` |
| `/var/log/lastlog` | Ultimo login | `lastlog` |

## Archivos de configuracion

| Archivo | Descripcion |
|---------|-------------|
| `/etc/rsyslog.conf` | Configuracion principal de rsyslog |
| `/etc/rsyslog.d/` | Configuracion adicional de rsyslog |
| `/etc/syslog-ng/syslog-ng.conf` | Configuracion de syslog-ng |
| `/etc/systemd/journald.conf` | Configuracion de journald |
| `/etc/logrotate.conf` | Configuracion principal de logrotate |
| `/etc/logrotate.d/` | Configuracion por servicio de logrotate |
