---
title: "102.4 - Gestion de paquetes Debian"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - indice-subtema
tipo: indice-subtema
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.4"
---

# 102.4 - Gestion de paquetes Debian

## Peso: 3

## Objetivo del examen

Realizar la gestion de paquetes utilizando las herramientas de paquetes de Debian. Esto incluye instalar, actualizar y desinstalar paquetes binarios Debian, encontrar paquetes que contengan archivos o bibliotecas especificas (instalados o no), y obtener informacion de los paquetes como version, contenido, dependencias, integridad del paquete y estado de la instalacion.

## Conocimientos clave

- Instalar, actualizar y desinstalar paquetes binarios Debian
- Encontrar paquetes que contengan archivos o bibliotecas especificas instaladas o no
- Obtener informacion de paquetes: version, contenido, dependencias, integridad, estado
- Conocer el sistema de gestion de paquetes apt y dpkg
- Comprender la estructura de los repositorios Debian

## Archivos, terminos y utilidades

- `/etc/apt/sources.list`
- `/etc/apt/sources.list.d/`
- `dpkg`
- `dpkg -i`, `dpkg -r`, `dpkg -P`
- `dpkg -l`, `dpkg -L`, `dpkg -S`
- `dpkg --configure -a`
- `dpkg-reconfigure`
- `apt` / `apt-get`
- `apt-cache`
- `apt-file`
- `apt update`, `apt upgrade`, `apt full-upgrade`
- `apt install`, `apt remove`, `apt purge`
- `apt search`, `apt show`
- `apt-cache depends`, `apt-cache rdepends`

## Contenido

| Recurso | Estado |
|---------|--------|
| [Teoria](notas/teoria.md) | Completo |
| [Comandos clave](notas/comandos-clave.md) | Completo |
| [Ejercicios](ejercicios/ejercicios.md) | Completo |
