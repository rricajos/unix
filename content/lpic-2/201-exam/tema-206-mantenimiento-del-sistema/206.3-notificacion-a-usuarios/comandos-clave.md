---
title: "206.3 - Notificacion a usuarios"
tags: [lpic-2, examen-201, tema-206, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "206"
subtema: "206.3"
---

# 206.3 - Comandos clave: Notificacion a usuarios

## Archivos de banner y mensajes

| Archivo | Descripcion | Cuando se muestra |
|---------|-------------|-------------------|
| `/etc/motd` | Mensaje del dia | Despues de un login exitoso |
| `/etc/issue` | Banner de login local | Antes del login en consola local |
| `/etc/issue.net` | Banner de login remoto | Antes del login remoto (SSH/Telnet) |
| `/etc/update-motd.d/` | Scripts para motd dinamico (Ubuntu/Debian) | Generan `/etc/motd` dinamicamente |
| `/etc/ssh/sshd_config` | Configuracion SSH (directiva `Banner`) | Necesario para activar `/etc/issue.net` |

## Secuencias de escape de /etc/issue

| Secuencia | Descripcion |
|-----------|-------------|
| `\d` | Fecha actual |
| `\t` | Hora actual |
| `\n` | Nombre del host |
| `\l` | Nombre de la terminal (tty) |
| `\s` | Nombre del sistema operativo |
| `\r` | Version del kernel |
| `\m` | Arquitectura de la maquina |
| `\o` | Nombre de dominio |
| `\U` | Numero de usuarios conectados |

## Comandos de mensajeria

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `wall "mensaje"` | Enviar mensaje a todos los usuarios conectados | `wall "Reinicio en 10 min"` |
| `wall < archivo` | Enviar contenido de un archivo a todos | `wall < /etc/aviso.txt` |
| `write usuario` | Enviar mensaje a un usuario especifico | `write juan` |
| `write usuario tty` | Enviar a un usuario en terminal especifica | `write juan pts/2` |
| `mesg` | Ver estado de recepcion de mensajes | `mesg` |
| `mesg y` | Habilitar recepcion de mensajes | `mesg y` |
| `mesg n` | Deshabilitar recepcion de mensajes | `mesg n` |

## Comandos de apagado con notificacion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `shutdown -h +MIN "msg"` | Apagar en N minutos con mensaje | `shutdown -h +10 "Apagado por mantenimiento"` |
| `shutdown -r TIME "msg"` | Reiniciar a una hora con mensaje | `shutdown -r 23:00 "Reinicio programado"` |
| `shutdown -c "msg"` | Cancelar apagado programado con aviso | `shutdown -c "Reinicio cancelado"` |
| `shutdown -h now "msg"` | Apagar inmediatamente con mensaje | `shutdown -h now "Apagado de emergencia"` |

## systemd-ask-password

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `systemd-ask-password "prompt"` | Solicitar contrasena al usuario | `systemd-ask-password "Clave LUKS:"` |
| `systemd-ask-password --timeout=N` | Solicitar con timeout en segundos | `systemd-ask-password --timeout=60 "Clave:"` |
| `systemd-ask-password --list` | Listar solicitudes pendientes | `systemd-ask-password --list` |

## Resumen rapido: ¿Cuando se muestra cada mensaje?

```
Conexion local:
  /etc/issue  -->  [LOGIN]  -->  /etc/motd  -->  Shell

Conexion SSH (con Banner configurado):
  /etc/issue.net  -->  [LOGIN]  -->  /etc/motd  -->  Shell
```
