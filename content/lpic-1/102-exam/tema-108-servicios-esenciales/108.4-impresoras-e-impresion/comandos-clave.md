---
title: "108.4 Gestionar impresoras e impresion - Comandos clave"
tags:
  - lpic-1
  - examen-102
  - tema-108
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "108"
subtema: "108.4"
---

# 108.4 Gestionar impresoras e impresion - Comandos clave

## Imprimir archivos

| Comando (System V) | Comando (BSD) | Descripcion |
|---------------------|---------------|-------------|
| `lp archivo.txt` | `lpr archivo.txt` | Imprimir en predeterminada |
| `lp -d Impresora archivo` | `lpr -P Impresora archivo` | Imprimir en impresora especifica |
| `lp -n 3 archivo` | `lpr -# 3 archivo` | Imprimir 3 copias |

## Ver estado y colas

| Comando | Descripcion |
|---------|-------------|
| `lpstat -a` | Impresoras que aceptan trabajos |
| `lpstat -p` | Estado de las impresoras |
| `lpstat -t` | Estado completo del sistema |
| `lpstat -d` | Impresora predeterminada |
| `lpstat -o` | Trabajos en todas las colas |
| `lpstat -s` | Resumen de impresoras y URIs |
| `lpq` | Ver cola (BSD style) |
| `lpq -a` | Ver todas las colas |
| `lpq -P Impresora` | Ver cola de impresora especifica |

## Cancelar trabajos

| Comando (System V) | Comando (BSD) | Descripcion |
|---------------------|---------------|-------------|
| `cancel ID` | `lprm numero` | Cancelar trabajo especifico |
| `cancel -a` | `lprm -` | Cancelar todos los trabajos |
| `cancel -a Impresora` | `lprm -P Impresora` | Cancelar de una impresora |

## Administracion de impresoras

| Comando | Descripcion |
|---------|-------------|
| `lpadmin -p Nombre -E -v URI -m modelo` | Agregar impresora |
| `lpadmin -d Nombre` | Establecer predeterminada |
| `lpadmin -x Nombre` | Eliminar impresora |
| `lpinfo -v` | Listar dispositivos disponibles |
| `lpinfo -m` | Listar drivers disponibles |
| `lpoptions -l` | Listar opciones de impresion |
| `lpoptions -d Nombre` | Predeterminada del usuario |
| `cupsctl` | Configuracion del servidor CUPS |

## URIs de dispositivos

| Tipo | URI |
|------|-----|
| USB | `usb://fabricante/modelo` |
| IPP | `ipp://host/ipp/print` |
| Socket | `socket://host:9100` |
| LPD | `lpd://host/cola` |

## Archivos de configuracion

| Archivo | Descripcion |
|---------|-------------|
| `/etc/cups/cupsd.conf` | Configuracion del demonio CUPS |
| `/etc/cups/printers.conf` | Definicion de impresoras |
| `/etc/cups/ppd/` | Archivos PPD de impresoras |
| `http://localhost:631` | Interfaz web de CUPS |
