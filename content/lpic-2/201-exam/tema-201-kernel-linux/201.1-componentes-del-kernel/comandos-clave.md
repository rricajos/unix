---
title: "201.1 - Componentes del kernel"
tags: [lpic-2, examen-201, tema-201, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "201"
subtema: "201.1"
---

# 201.1 - Comandos clave: Componentes del kernel

## Comandos principales

| Comando | Funcion | Ejemplo |
|---------|---------|---------|
| `uname -r` | Mostrar version del kernel en ejecucion | `uname -r` → `5.15.0-56-generic` |
| `uname -a` | Mostrar toda la informacion del kernel | `uname -a` |
| `patch` | Aplicar parches al codigo fuente | `patch -p1 < parche.patch` |
| `tar` | Extraer codigo fuente del kernel | `tar xf linux-5.15.60.tar.xz` |
| `lsmod` | Listar modulos cargados | `lsmod` |
| `modinfo` | Informacion detallada de un modulo | `modinfo ext4` |
| `zcat` | Leer configuracion comprimida | `zcat /proc/config.gz` |

## Opciones de uname

| Opcion | Informacion que muestra | Ejemplo de salida |
|--------|------------------------|-------------------|
| `-r` | Version del kernel | `5.15.0-56-generic` |
| `-s` | Nombre del kernel | `Linux` |
| `-n` | Nombre del host | `servidor01` |
| `-m` | Arquitectura de la maquina | `x86_64` |
| `-p` | Tipo de procesador | `x86_64` |
| `-o` | Sistema operativo | `GNU/Linux` |
| `-a` | Toda la informacion | Combinacion de todas |
| `-v` | Version del kernel (compilacion) | `#62-Ubuntu SMP ...` |

## Tipos de imagen del kernel

| Tipo | Descripcion | Ubicacion/Uso |
|------|-------------|---------------|
| `vmlinuz` | Kernel comprimido instalado | `/boot/vmlinuz-<version>` |
| `bzImage` | Kernel comprimido (memoria alta) | Resultado de `make bzImage` |
| `zImage` | Kernel comprimido (memoria baja, < 640KB) | Obsoleto en x86 |
| `vmlinux` | Kernel sin comprimir (ELF) | Depuracion unicamente |
| `uImage` | Formato para U-Boot | Sistemas embebidos |

## Archivos importantes

| Archivo/Directorio | Funcion |
|--------------------|---------|
| `/boot/vmlinuz-<version>` | Imagen del kernel para arrancar |
| `/boot/config-<version>` | Configuracion con la que se compilo el kernel |
| `/boot/System.map-<version>` | Mapa de simbolos del kernel |
| `/boot/initrd.img-<version>` | Imagen initrd/initramfs |
| `/usr/src/linux/` | Codigo fuente del kernel (enlace simbolico) |
| `/usr/src/linux/.config` | Configuracion de compilacion |
| `/usr/src/linux/Makefile` | Makefile con version y reglas de compilacion |
| `/usr/src/linux/Documentation/` | Documentacion oficial del kernel |
| `/lib/modules/<version>/` | Modulos compilados del kernel |
| `/proc/config.gz` | Configuracion del kernel activo (si habilitado) |
| `/proc/version` | Informacion de version del kernel en ejecucion |

## Estados de configuracion del kernel (.config)

| Estado | Sintaxis | Significado |
|--------|----------|-------------|
| Built-in | `CONFIG_XXX=y` | Compilado dentro del kernel |
| Modulo | `CONFIG_XXX=m` | Compilado como modulo cargable |
| Deshabilitado | `# CONFIG_XXX is not set` | No se compila |

## Versionado del kernel

| Variable (Makefile) | Significado | Ejemplo |
|---------------------|-------------|---------|
| `VERSION` | Version mayor | `5` |
| `PATCHLEVEL` | Version menor | `15` |
| `SUBLEVEL` | Nivel de parche | `60` |
| `EXTRAVERSION` | Sufijo adicional | `-rc1` o vacio |

## Comparativa: kernel monolitico vs. modular

| Caracteristica | Monolitico (todo built-in) | Modular (con modulos) |
|----------------|---------------------------|----------------------|
| Tamano de imagen | Grande | Pequeno (nucleo + modulos) |
| Flexibilidad | Baja (requiere recompilar) | Alta (carga/descarga en caliente) |
| Dependencias externas | Ninguna | Requiere archivos de modulos |
| Uso de memoria | Mayor (todo cargado) | Menor (solo lo necesario) |
| Arranque sin initramfs | Posible si todo es built-in | Puede necesitar initramfs |
