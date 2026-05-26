---
title: "108.1 Mantener la hora del sistema"
tags:
  - lpic-1
  - examen-102
  - tema-108
  - indice-subtema
tipo: indice-subtema
certificacion: lpic-1
examen: "102"
tema: "108"
subtema: "108.1"
---

# 108.1 Mantener la hora del sistema

## Objetivo
Mantener correctamente la hora del sistema y sincronizar el reloj mediante NTP.

## Peso
3

## Conocimientos clave
- Configurar la fecha y hora del sistema
- Configurar el reloj hardware en la hora correcta en UTC
- Configurar la zona horaria correcta
- Configuracion basica de NTP usando ntpd
- Conocimiento del uso del servicio chrony
- Conocimiento del uso de systemd-timesyncd

## Archivos, terminos y utilidades
- `/usr/share/zoneinfo/`
- `/etc/timezone`
- `/etc/localtime`
- `/etc/ntp.conf`
- `/etc/chrony.conf`
- `/etc/adjtime`
- `date`
- `hwclock`
- `timedatectl`
- `ntpd`
- `ntpdate`
- `ntpq`
- `chronyd`
- `chronyc`
- `pool.ntp.org`

## Contenido

| Recurso | Estado |
|---------|--------|
| [Teoria](notas/teoria.md) | Completado |
| [Comandos clave](notas/comandos-clave.md) | Completado |
| [Ejercicios](ejercicios/ejercicios.md) | Completado |
