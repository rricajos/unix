---
title: "108.1 Mantener la hora del sistema - Comandos clave"
tags:
  - lpic-1
  - examen-102
  - tema-108
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "108"
subtema: "108.1"
---

# 108.1 Mantener la hora del sistema - Comandos clave

## date

| Comando | Descripcion |
|---------|-------------|
| `date` | Mostrar fecha y hora actual |
| `date -u` | Mostrar fecha y hora en UTC |
| `date +%Y-%m-%d` | Formato personalizado (2024-01-15) |
| `date "+%Y-%m-%d %H:%M:%S"` | Formato completo con hora |
| `date +%s` | Mostrar epoch Unix |
| `date -s "2024-01-15 14:30:00"` | Establecer fecha y hora |

## hwclock

| Comando | Descripcion |
|---------|-------------|
| `hwclock -r` / `hwclock --show` | Leer reloj hardware |
| `hwclock --systohc` | Copiar hora del sistema al hardware |
| `hwclock --hctosys` | Copiar hora del hardware al sistema |
| `hwclock --localtime` | Indicar que RTC esta en hora local |
| `hwclock --utc` | Indicar que RTC esta en UTC |
| `hwclock --set --date "2024-01-15 14:30:00"` | Establecer RTC directamente |

## timedatectl

| Comando | Descripcion |
|---------|-------------|
| `timedatectl` / `timedatectl status` | Mostrar estado completo |
| `timedatectl set-time "2024-01-15 14:30:00"` | Establecer fecha y hora |
| `timedatectl set-timezone Europe/Madrid` | Establecer zona horaria |
| `timedatectl list-timezones` | Listar zonas horarias disponibles |
| `timedatectl set-ntp true` | Activar sincronizacion NTP |
| `timedatectl set-ntp false` | Desactivar sincronizacion NTP |

## NTP (ntpd)

| Comando | Descripcion |
|---------|-------------|
| `ntpdate pool.ntp.org` | Sincronizar una vez manualmente |
| `ntpq -p` | Mostrar peers y estado de sincronizacion |

## Chrony

| Comando | Descripcion |
|---------|-------------|
| `chronyc sources` | Mostrar fuentes NTP |
| `chronyc sources -v` | Fuentes con columnas explicadas |
| `chronyc sourcestats` | Estadisticas de fuentes |
| `chronyc tracking` | Info detallada de sincronizacion |
| `chronyc activity` | Fuentes online/offline |

## Archivos clave

| Archivo | Descripcion |
|---------|-------------|
| `/etc/ntp.conf` | Configuracion de ntpd |
| `/etc/chrony.conf` | Configuracion de chrony |
| `/etc/systemd/timesyncd.conf` | Configuracion de systemd-timesyncd |
| `/etc/localtime` | Enlace simbolico a la zona horaria actual |
| `/etc/timezone` | Nombre de la zona horaria (Debian/Ubuntu) |
| `/usr/share/zoneinfo/` | Directorio con archivos de zonas horarias |
| `/etc/adjtime` | Drift y modo del RTC (UTC/LOCAL) |

## Simbolos en ntpq -p / chronyc sources

| Simbolo | Significado |
|---------|-------------|
| `*` / `^*` | Servidor seleccionado actualmente |
| `+` / `^+` | Candidato aceptable |
| `-` / `^-` | Descartado por el algoritmo |
| `x` | Falseticker (fuente falsa) |
