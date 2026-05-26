# 108.2 Registro del sistema

## Objetivo
Configurar el demonio syslog para registrar eventos del sistema. Gestionar registros del sistema con journald y los archivos de log tradicionales.

## Peso
4

## Conocimientos clave
- Configuracion del demonio syslog (rsyslog, syslog-ng)
- Comprension de facilities y priorities estandar
- Configuracion de logrotate
- Comprension de systemd journal (journald)
- Conocimiento de rsyslog y syslog-ng como implementaciones de syslog

## Archivos, terminos y utilidades
- `/etc/rsyslog.conf`
- `/etc/syslog-ng/syslog-ng.conf`
- `/var/log/`
- `journalctl`
- `logger`
- `logrotate`
- `/etc/logrotate.conf`
- `/etc/logrotate.d/`
- `systemd-journald`
- `/etc/systemd/journald.conf`
- `dmesg`

## Contenido

| Recurso | Estado |
|---------|--------|
| [Teoria](notas/teoria.md) | Completado |
| [Comandos clave](notas/comandos-clave.md) | Completado |
| [Ejercicios](ejercicios/ejercicios.md) | Completado |
