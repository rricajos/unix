---
title: "107.2 - Comandos clave: Automatizacion de tareas"
tags:
  - lpic-1
  - examen-102
  - tema-107
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "107"
subtema: "107.2"
---

# 107.2 - Comandos clave: Automatizacion de tareas

## Formato del crontab

### Crontab de usuario (5 campos + comando)
```
min  hora  dia  mes  dia_sem  comando
0-59 0-23  1-31 1-12 0-7      /ruta/script.sh
```

### Crontab del sistema /etc/crontab (6 campos + comando)
```
min  hora  dia  mes  dia_sem  USUARIO  comando
0-59 0-23  1-31 1-12 0-7      root     /ruta/script.sh
```

## Simbolos especiales en crontab

| Simbolo | Significado | Ejemplo |
|---------|-------------|---------|
| `*` | Cualquier valor | `* * * * *` (cada minuto) |
| `,` | Lista | `1,15,30 * * * *` |
| `-` | Rango | `1-5 * * * *` |
| `/` | Incremento | `*/15 * * * *` (cada 15 min) |

## Atajos de crontab

| Cadena | Equivalente | Significado |
|--------|-------------|-------------|
| `@reboot` | - | Al arrancar |
| `@yearly` | `0 0 1 1 *` | 1 de enero |
| `@monthly` | `0 0 1 * *` | Dia 1 de cada mes |
| `@weekly` | `0 0 * * 0` | Domingos |
| `@daily` | `0 0 * * *` | Medianoche |
| `@hourly` | `0 * * * *` | Cada hora |

## Ejemplos comunes de crontab

| Programacion | Significado |
|-------------|-------------|
| `30 2 * * *` | Diario a las 2:30 AM |
| `0 8 * * 1-5` | Lunes a viernes a las 8:00 |
| `0 0 1 * *` | Dia 1 de cada mes a medianoche |
| `*/15 * * * *` | Cada 15 minutos |
| `0 3 * * 0` | Domingos a las 3:00 AM |
| `0 */2 * * *` | Cada 2 horas |

## Gestion del crontab de usuario

| Comando | Descripcion |
|---------|-------------|
| `crontab -e` | Editar crontab del usuario actual |
| `crontab -l` | Listar crontab del usuario actual |
| `crontab -r` | Eliminar crontab del usuario actual |
| `crontab -e -u usuario` | Editar crontab de otro usuario (root) |
| `crontab -l -u usuario` | Listar crontab de otro usuario (root) |

## Archivos y directorios de cron

| Ruta | Descripcion |
|------|-------------|
| `/etc/crontab` | Crontab del sistema (con campo usuario) |
| `/etc/cron.d/` | Crontabs adicionales del sistema (con campo usuario) |
| `/etc/cron.hourly/` | Scripts ejecutados cada hora |
| `/etc/cron.daily/` | Scripts ejecutados diariamente |
| `/etc/cron.weekly/` | Scripts ejecutados semanalmente |
| `/etc/cron.monthly/` | Scripts ejecutados mensualmente |
| `/var/spool/cron/crontabs/` | Crontabs de usuarios (Debian) |
| `/var/spool/cron/` | Crontabs de usuarios (Red Hat) |

## Control de acceso a cron

| Situacion | Resultado |
|-----------|-----------|
| `cron.allow` existe | SOLO los listados pueden usar cron |
| Solo `cron.deny` existe | Todos EXCEPTO los listados |
| Ninguno existe | Depende de distribucion (normalmente solo root) |
| Ambos existen | `cron.allow` tiene prioridad |

## Anacron

### /etc/anacrontab
```
periodo  retardo  identificador  comando
1        5        cron.daily     run-parts /etc/cron.daily
7        25       cron.weekly    run-parts /etc/cron.weekly
@monthly 45       cron.monthly   run-parts /etc/cron.monthly
```

| Campo | Descripcion |
|-------|-------------|
| periodo | Dias entre ejecuciones |
| retardo | Minutos de espera antes de ejecutar |
| identificador | Nombre unico (para registro en /var/spool/anacron/) |
| comando | Comando a ejecutar |

| Variable | Descripcion |
|----------|-------------|
| `RANDOM_DELAY` | Retardo aleatorio adicional (minutos) |
| `START_HOURS_RANGE` | Rango de horas para ejecutar |

## at - Tareas unicas

| Comando | Descripcion |
|---------|-------------|
| `at 15:00` | Programar tarea para las 15:00 |
| `at 02:30 tomorrow` | Para manana a las 2:30 |
| `at now + 2 hours` | Dentro de 2 horas |
| `at now + 30 minutes` | Dentro de 30 minutos |
| `at now + 3 days` | Dentro de 3 dias |
| `at 14:00 2026-12-25` | Fecha especifica |
| `at -f archivo hora` | Leer comandos de archivo |
| `atq` / `at -l` | Listar tareas pendientes |
| `atrm ID` / `at -d ID` | Eliminar tarea por ID |
| `batch` | Ejecutar cuando carga < 0.8 |

### Control de acceso a at
Misma logica que cron: `/etc/at.allow` y `/etc/at.deny`

## Systemd timers

### Opciones de programacion

| Opcion | Descripcion | Ejemplo |
|--------|-------------|---------|
| `OnCalendar` | Calendario | `daily`, `*-*-* 02:30:00` |
| `OnBootSec` | Despues de arranque | `15min` |
| `OnUnitActiveSec` | Desde ultima activacion | `1h` |
| `Persistent` | Recuperar ejecuciones perdidas | `true` |

### Gestion de timers

| Comando | Descripcion |
|---------|-------------|
| `systemctl list-timers` | Listar timers activos |
| `systemctl list-timers --all` | Listar todos los timers |
| `systemctl enable nombre.timer` | Habilitar timer |
| `systemctl start nombre.timer` | Iniciar timer |
| `systemctl status nombre.timer` | Ver estado |
| `systemd-analyze calendar "expresion"` | Verificar expresion de calendario |

### Estructura de archivos

```
/etc/systemd/system/nombre.timer    # Cuando ejecutar
/etc/systemd/system/nombre.service  # Que ejecutar
```
