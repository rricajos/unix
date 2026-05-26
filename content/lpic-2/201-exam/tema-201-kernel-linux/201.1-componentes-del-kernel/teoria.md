---
title: "201.1 - Componentes del kernel"
tags: [lpic-2, examen-201, tema-201, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "201"
subtema: "201.1"
---

# 201.1 - Componentes del kernel

## Introduccion

El kernel de Linux es el nucleo del sistema operativo. Es el componente que gestiona directamente el hardware y proporciona servicios fundamentales al resto del sistema: gestion de procesos, memoria, sistemas de archivos, dispositivos y red. Comprender sus componentes es esencial para un administrador de sistemas avanzado.

Este subtema tiene un **peso de 2** en el examen y se centra en la teoria de los componentes del kernel, sus tipos de imagen y como obtener el codigo fuente.

## Tipos de imagen del kernel

### vmlinuz

`vmlinuz` es el nombre tipico del archivo del kernel comprimido y listo para arrancar. Se encuentra habitualmente en `/boot/vmlinuz-<version>`.

- La "z" final indica que esta comprimido (tipicamente con gzip, bzip2 o LZMA/XZ)
- El prefijo "vm" proviene de "Virtual Memory", ya que los kernels modernos soportan memoria virtual
- Es un archivo ejecutable autonomo que el bootloader carga en memoria

```bash
$ ls -la /boot/vmlinuz-*
-rw------- 1 root root 11534336 mar 15 2026 /boot/vmlinuz-5.15.0-56-generic
-rw------- 1 root root 11567104 abr 20 2026 /boot/vmlinuz-5.15.0-60-generic
```

### bzImage vs zImage

Ambos son formatos de imagen comprimida del kernel, pero difieren en como se cargan en memoria:

- **zImage**: formato antiguo. El kernel comprimido debe caber en los primeros 640 KB de RAM (memoria baja). Limitado a kernels pequenos
- **bzImage** (big zImage): formato moderno y estandar. El kernel comprimido se carga en memoria alta (por encima de 1 MB), sin la limitacion de 640 KB

```bash
# Al compilar el kernel, se genera bzImage
$ make bzImage
# El archivo resultante esta en:
# arch/x86/boot/bzImage (en arquitectura x86)
```

> **Para el examen:** `bzImage` es el formato estandar actual. La "b" de "big" se refiere a que puede usar memoria alta, no a que el archivo sea mas grande necesariamente. `zImage` es obsoleto para kernels modernos.

### Otros formatos de imagen

| Formato | Descripcion | Uso tipico |
|---------|-------------|-----------|
| `vmlinux` | Kernel sin comprimir (formato ELF) | Depuracion, no se usa para arrancar |
| `vmlinuz` | Kernel comprimido (nombre generico) | Archivo instalado en /boot |
| `bzImage` | Big zImage, carga en memoria alta | Formato estandar de compilacion x86 |
| `zImage` | Carga en memoria baja (< 640 KB) | Obsoleto para x86, usado en ARM |
| `uImage` | Formato para U-Boot | Sistemas embebidos |

## Versiones del kernel y ciclo de lanzamiento

### Esquema de versionado

El kernel Linux usa un esquema de versionado de tres o cuatro numeros:

```
5.15.60
|  |  |
|  |  +-- Parche/revision (correccion de bugs)
|  +----- Version menor (nuevas funcionalidades)
+-------- Version mayor
```

A partir del kernel 3.0, Linus Torvalds decidio que la version mayor se incrementaria cuando el numero menor se hiciera demasiado grande, sin implicar cambios radicales.

### Tipos de versiones

- **Mainline**: la rama principal de desarrollo, mantenida por Linus Torvalds
- **Stable**: versiones estables con correcciones de bugs y seguridad
- **LTS (Long Term Support)**: versiones mantenidas durante varios anos (tipicamente 2-6 anos)
- **RC (Release Candidate)**: versiones previas al lanzamiento para pruebas

```bash
# Ver la version actual del kernel
$ uname -r
5.15.0-56-generic

# Detalle completo
$ uname -a
Linux servidor 5.15.0-56-generic #62-Ubuntu SMP x86_64 GNU/Linux
```

> **Para el examen:** `uname -r` muestra la version del kernel en ejecucion. El sufijo como `-generic` o `-amd64` es anadido por la distribucion.

## Obtencion del codigo fuente del kernel

### Fuentes oficiales

El codigo fuente oficial del kernel se obtiene de **kernel.org**:

```bash
# Descargar desde kernel.org
$ wget https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.15.60.tar.xz

# Verificar integridad
$ wget https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.15.60.tar.sign
$ xz -d linux-5.15.60.tar.xz
$ gpg --verify linux-5.15.60.tar.sign linux-5.15.60.tar

# Extraer
$ tar xf linux-5.15.60.tar -C /usr/src/
```

### Fuentes de la distribucion

Las distribuciones proporcionan sus propias versiones del kernel con parches adicionales:

```bash
# Debian/Ubuntu
$ apt-get source linux-image-$(uname -r)

# Red Hat/CentOS
$ yumdownloader --source kernel
```

### Directorio estandar del codigo fuente

El codigo fuente del kernel se instala tipicamente en `/usr/src/linux/` o `/usr/src/linux-<version>/`.

```bash
$ ls /usr/src/
linux-5.15.60/
linux-headers-5.15.0-56-generic/
```

Es comun tener un enlace simbolico `/usr/src/linux` que apunta a la version activa:

```bash
$ ls -la /usr/src/linux
lrwxrwxrwx 1 root root 16 /usr/src/linux -> linux-5.15.60
```

## Documentacion del kernel

La documentacion oficial del kernel se encuentra dentro del codigo fuente:

```
/usr/src/linux/Documentation/
```

Este directorio contiene:
- Documentacion de subsistemas (filesystems, networking, etc.)
- Guias de configuracion
- Parametros de arranque del kernel
- Documentacion de la API del kernel
- Informacion sobre hardware soportado

```bash
# Explorar la documentacion
$ ls /usr/src/linux/Documentation/
admin-guide/    filesystems/    networking/    process/
devicetree/     gpu/            security/      userspace-api/
```

> **Para el examen:** La documentacion del kernel esta en `/usr/src/linux/Documentation/`. Es la referencia oficial para parametros, configuracion y funcionalidades del kernel.

## Parches del kernel

### Concepto de parche

Un parche (patch) es un archivo que contiene las diferencias entre dos versiones de codigo. Permite actualizar el kernel de una version a otra sin descargar todo el codigo fuente.

```bash
# Descargar un parche
$ wget https://cdn.kernel.org/pub/linux/kernel/v5.x/patch-5.15.61.xz

# Aplicar un parche (desde el directorio del fuente del kernel)
$ cd /usr/src/linux
$ xzcat /path/to/patch-5.15.61.xz | patch -p1

# Revertir un parche
$ xzcat /path/to/patch-5.15.61.xz | patch -R -p1
```

### Tipos de parches

- **Parches incrementales**: de una version a la siguiente (5.15.60 a 5.15.61)
- **Parches de la distribucion**: correcciones especificas de la distribucion
- **Parches de terceros**: funcionalidades adicionales (por ejemplo, parches de realtime)

> **Para el examen:** Los parches se aplican con el comando `patch -p1`. Se aplican desde el directorio raiz del codigo fuente del kernel. La opcion `-p1` elimina el primer componente de la ruta en el parche.

## Archivo de configuracion del kernel (.config)

El archivo `.config` en el directorio raiz del codigo fuente del kernel contiene todas las opciones de configuracion seleccionadas para la compilacion.

```bash
# Ver la configuracion actual del kernel en ejecucion
$ cat /boot/config-$(uname -r) | head -20
# o bien
$ zcat /proc/config.gz  # si CONFIG_IKCONFIG_PROC esta habilitado

# Copiar la configuracion actual como base
$ cp /boot/config-$(uname -r) /usr/src/linux/.config
```

Cada opcion puede tener tres estados:
- **y** (yes): compilado dentro del kernel (built-in)
- **m** (module): compilado como modulo cargable
- **n** (no): no compilado

```
CONFIG_EXT4_FS=y          # Soporte EXT4 integrado en el kernel
CONFIG_NTFS_FS=m          # Soporte NTFS como modulo
# CONFIG_MINIX_FS is not set  # Soporte MINIX deshabilitado
```

## Makefile del kernel

El `Makefile` principal del kernel se encuentra en la raiz del codigo fuente y controla el proceso de compilacion. Las primeras lineas definen la version:

```makefile
# SPDX-License-Identifier: GPL-2.0
VERSION = 5
PATCHLEVEL = 15
SUBLEVEL = 60
EXTRAVERSION =
NAME = Trick or Treat
```

> **Para el examen:** La version del kernel se define en las variables `VERSION`, `PATCHLEVEL`, `SUBLEVEL` y `EXTRAVERSION` del Makefile principal.

## Kernel monolitico vs. modular

### Kernel monolitico

Un kernel monolitico tiene todas las funcionalidades compiladas directamente dentro de la imagen del kernel. No carga componentes adicionales.

- **Ventaja**: no depende de archivos externos; todo esta en un solo binario
- **Desventaja**: imagen grande, desperdicio de memoria para funciones no usadas, requiere recompilar para cambios

### Kernel modular

Linux usa un enfoque **modular hibrido**: un nucleo central con funcionalidades esenciales compiladas de forma integrada (built-in), y funcionalidades opcionales disponibles como modulos cargables.

- **Ventaja**: imagen del kernel mas pequena, carga solo lo necesario, flexibilidad para anadir/quitar funcionalidades sin reiniciar
- **Desventaja**: dependencia de archivos de modulo en el sistema de archivos

```bash
# Los modulos se almacenan en:
/lib/modules/$(uname -r)/

# Ver modulos cargados
$ lsmod

# Informacion de un modulo
$ modinfo ext4
```

> **Para el examen:** Linux es un kernel monolitico con soporte de modulos cargables. Las funcionalidades pueden compilarse como built-in (=y), modulo (=m) o deshabilitadas (=n). Los modulos se cargan y descargan en tiempo de ejecucion.

## Resumen de archivos y directorios clave

| Ruta | Descripcion |
|------|-------------|
| `/boot/vmlinuz-<version>` | Imagen del kernel comprimida |
| `/boot/config-<version>` | Configuracion del kernel |
| `/boot/System.map-<version>` | Tabla de simbolos del kernel |
| `/boot/initrd.img-<version>` | Disco RAM inicial |
| `/usr/src/linux/` | Codigo fuente del kernel |
| `/usr/src/linux/Documentation/` | Documentacion del kernel |
| `/usr/src/linux/.config` | Archivo de configuracion para compilacion |
| `/usr/src/linux/Makefile` | Makefile principal con version |
| `/lib/modules/<version>/` | Modulos compilados del kernel |
| `/proc/config.gz` | Configuracion del kernel en ejecucion (si disponible) |
