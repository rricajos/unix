---
title: "104.3 Controlar el montaje y desmontaje de sistemas de archivos"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - indice-subtema
tipo: indice-subtema
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.3"
---

# 104.3 Controlar el montaje y desmontaje de sistemas de archivos

## Objetivo
El candidato debe ser capaz de configurar el montaje de un sistema de archivos. Incluye la capacidad de montar y desmontar manualmente, configurar el montaje automatico al arrancar, y configurar sistemas de archivos extraibles montables por el usuario.

## Peso
**3**

## Conocimientos clave
- Montar y desmontar manualmente sistemas de archivos
- Configurar el montaje de sistemas de archivos al arrancar
- Configurar sistemas de archivos extraibles montables por el usuario
- Uso de etiquetas y UUIDs para identificar y montar sistemas de archivos
- Conocimiento de unidades de montaje de systemd

## Archivos y utilidades clave
| Recurso | Descripcion |
|---------|-------------|
| `mount` | Montar sistemas de archivos |
| `umount` | Desmontar sistemas de archivos |
| `/etc/fstab` | Tabla de montaje automatico |
| `blkid` | Mostrar UUID y tipo de FS de dispositivos |
| `lsblk` | Listar dispositivos de bloque |
| `findmnt` | Encontrar sistemas de archivos montados |
| `systemd mount units` | Unidades .mount y .automount de systemd |

## Contenido

| Seccion | Recurso | Estado |
|---------|---------|--------|
| Teoria completa | [notas/teoria.md](notas/teoria.md) | Completado |
| Comandos clave | [notas/comandos-clave.md](notas/comandos-clave.md) | Completado |
| Ejercicios | [ejercicios/ejercicios.md](ejercicios/ejercicios.md) | Completado |
