---
title: "107.2 - Automatizar tareas de administracion"
tags:
  - lpic-1
  - examen-102
  - tema-107
  - indice-subtema
tipo: indice-subtema
certificacion: lpic-1
examen: "102"
tema: "107"
subtema: "107.2"
---

# 107.2 - Automatizar tareas de administracion

## Peso: 4

## Objetivo del examen
Usar cron y anacron para ejecutar trabajos a intervalos regulares. Usar at para ejecutar trabajos en un momento especifico. Gestionar trabajos de cron y at. Configurar el acceso de usuarios a los servicios cron y at. Comprender los timers de systemd como alternativa a cron.

## Conocimientos clave
- Formato del crontab y gestion de trabajos cron
- Crontab del sistema (/etc/crontab) vs crontab de usuario
- Directorios cron: /etc/cron.d/, /etc/cron.{hourly,daily,weekly,monthly}
- Control de acceso a cron y at (allow/deny)
- Anacron para sistemas que no estan siempre encendidos
- Comando at para tareas unicas programadas
- Timers de systemd como alternativa moderna a cron

## Archivos, terminos y utilidades
- `crontab` (-e, -l, -r)
- `/etc/crontab`, `/etc/cron.d/`
- `/etc/cron.hourly/`, `/etc/cron.daily/`, `/etc/cron.weekly/`, `/etc/cron.monthly/`
- `/etc/cron.allow`, `/etc/cron.deny`
- `anacron`, `/etc/anacrontab`
- `at`, `atq`, `atrm`, `batch`
- `/etc/at.allow`, `/etc/at.deny`
- systemd timers, `systemctl list-timers`

## Contenido

| Recurso | Estado |
|---------|--------|
| [Teoria](notas/teoria.md) | Completado |
| [Comandos clave](notas/comandos-clave.md) | Completado |
| [Ejercicios](ejercicios/ejercicios.md) | Completado |
