---
title: "106.1 - Instalar y configurar X11"
tags:
  - lpic-1
  - examen-102
  - tema-106
  - indice-subtema
tipo: indice-subtema
certificacion: lpic-1
examen: "102"
tema: "106"
subtema: "106.1"
---

# 106.1 - Instalar y configurar X11

## Peso: 2

## Objetivo del examen
Instalar y configurar X11. Comprender la arquitectura del sistema X Window, su configuracion basica y la variable DISPLAY. Conocer los display managers y el reenvio de X11 a traves de SSH.

## Conocimientos clave
- Arquitectura cliente-servidor de X11
- Configuracion de la variable DISPLAY
- Control de acceso con xhost y xauth
- Archivo de configuracion /etc/X11/xorg.conf y sus secciones
- Display Managers: GDM, SDDM, LightDM, XDM
- Wayland como alternativa moderna a X11
- X forwarding con SSH

## Archivos, terminos y utilidades
- `/etc/X11/xorg.conf`, `/etc/X11/xorg.conf.d/`
- `~/.Xauthority`
- `DISPLAY`
- `xhost`, `xauth`
- `xdpyinfo`, `xwininfo`
- `ssh -X`, `ssh -Y`
- Display Managers: `gdm`, `sddm`, `lightdm`, `xdm`
- Wayland

## Contenido

| Recurso | Estado |
|---------|--------|
| [Teoria](notas/teoria.md) | Completado |
| [Comandos clave](notas/comandos-clave.md) | Completado |
| [Ejercicios](ejercicios/ejercicios.md) | Completado |
