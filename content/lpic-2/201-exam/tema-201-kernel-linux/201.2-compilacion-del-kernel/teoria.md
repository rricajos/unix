---
title: "201.2 - Compilacion del kernel"
tags: [lpic-2, examen-201, tema-201, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "201"
subtema: "201.2"
---

# 201.2 - Compilacion del kernel

## Introduccion

Compilar un kernel personalizado es una habilidad clave para un administrador Linux avanzado. Permite optimizar el sistema para hardware especifico, habilitar funcionalidades concretas, eliminar componentes innecesarios y aplicar parches de seguridad o rendimiento.

Este subtema tiene un **peso de 3** en el examen y cubre el proceso completo desde la configuracion hasta la instalacion del kernel compilado.

## Preparacion del entorno de compilacion

### Requisitos previos

Antes de compilar, se necesitan las herramientas de desarrollo:

```bash
# Debian/Ubuntu
$ apt-get install build-essential libncurses5-dev bison flex libssl-dev libelf-dev

# Red Hat/CentOS
$ yum groupinstall "Development Tools"
$ yum install ncurses-devel bison flex elfutils-libelf-devel openssl-devel
```

### Directorio de trabajo

El codigo fuente debe estar en `/usr/src/` con el enlace simbolico apropiado:

```bash
$ cd /usr/src
$ tar xf linux-5.15.60.tar.xz
$ ln -sf linux-5.15.60 linux
$ cd linux
```

> **Para el examen:** El directorio estandar para el codigo fuente del kernel es `/usr/src/linux`. Los headers del kernel (necesarios para compilar modulos externos) se instalan en `/usr/src/linux-headers-<version>/` o se acceden desde `/lib/modules/<version>/build`.

## Configuracion del kernel

### Metodos de configuracion interactiva

Linux ofrece varias interfaces para configurar las opciones del kernel:

| Herramienta | Comando | Interfaz | Requisitos |
|-------------|---------|----------|------------|
| `menuconfig` | `make menuconfig` | TUI (ncurses) | libncurses |
| `xconfig` | `make xconfig` | GUI (Qt) | Qt libraries |
| `gconfig` | `make gconfig` | GUI (GTK) | GTK libraries |
| `nconfig` | `make nconfig` | TUI mejorada | libncurses |
| `config` | `make config` | Linea de comandos | Ninguno |
| `oldconfig` | `make oldconfig` | Solo pregunta opciones nuevas | Ninguno |

### make menuconfig

Es el metodo mas utilizado. Presenta un menu jerarquico basado en texto donde se navega por categorias de opciones.

```bash
$ cd /usr/src/linux
$ make menuconfig
```

Navegacion:
- Flechas arriba/abajo para moverse
- Enter para entrar en un submenu
- Espacio para cambiar el estado: `[*]` built-in, `[M]` modulo, `[ ]` deshabilitado
- `?` para ver ayuda de la opcion seleccionada
- `<Exit>` para salir de un submenu

### make oldconfig

Se utiliza cuando se tiene un `.config` de una version anterior y se quiere actualizar a una nueva version del kernel. Solo pregunta por las opciones que son nuevas.

```bash
# Copiar configuracion anterior
$ cp /boot/config-$(uname -r) /usr/src/linux/.config

# Responder solo a las opciones nuevas
$ make oldconfig
```

### make olddefconfig

Similar a `oldconfig` pero acepta los valores por defecto para las opciones nuevas sin preguntar.

```bash
$ make olddefconfig
```

### Otras opciones de configuracion

```bash
# Crear configuracion por defecto para la arquitectura
$ make defconfig

# Crear configuracion con todas las opciones como modulos
$ make allmodconfig

# Limpiar configuracion y empezar desde cero
$ make mrproper   # Limpia todo, incluyendo .config
$ make clean      # Limpia archivos de compilacion, conserva .config
```

> **Para el examen:** `make mrproper` elimina todo incluyendo `.config`. `make clean` solo elimina archivos objeto de compilaciones anteriores pero preserva `.config`. Siempre respalda `.config` antes de ejecutar `make mrproper`.

## El archivo .config en detalle

El archivo `.config` es un archivo de texto plano con las opciones de compilacion:

```bash
$ head -20 /usr/src/linux/.config
#
# Automatically generated file; DO NOT EDIT.
# Linux/x86 5.15.60 Kernel Configuration
#
CONFIG_CC_VERSION_TEXT="gcc (Ubuntu 11.3.0-1ubuntu1) 11.3.0"
CONFIG_CC_IS_GCC=y
CONFIG_GCC_VERSION=110300
CONFIG_LOCALVERSION=""
CONFIG_LOCALVERSION_AUTO=y
CONFIG_DEFAULT_HOSTNAME="(none)"
CONFIG_SWAP=y
CONFIG_SYSVIPC=y
CONFIG_POSIX_MQUEUE=y
```

Opciones relevantes de personalizacion:
- `CONFIG_LOCALVERSION`: sufijo personalizado para la version (por ejemplo, `-custom`)
- `CONFIG_DEFAULT_HOSTNAME`: nombre de host por defecto
- `CONFIG_MODULES`: habilitar soporte de modulos cargables

## Proceso de compilacion

### Targets de make

El proceso de compilacion se ejecuta con `make` y sus distintos targets:

```bash
# Compilar todo (kernel + modulos)
$ make

# O equivalentemente
$ make all

# Compilar solo la imagen del kernel
$ make bzImage

# Compilar solo los modulos
$ make modules
```

### Compilacion paralela

Para acelerar la compilacion, se puede usar la opcion `-j` para compilacion en paralelo:

```bash
# Usar 4 hilos de compilacion
$ make -j4

# Usar tantos hilos como nucleos de CPU
$ make -j$(nproc)
```

### Secuencia completa de compilacion e instalacion

```bash
# 1. Configurar
$ make menuconfig

# 2. Compilar kernel e imagen
$ make bzImage

# 3. Compilar modulos
$ make modules

# 4. Instalar modulos en /lib/modules/<version>/
$ make modules_install

# 5. Instalar el kernel en /boot/
$ make install
```

> **Para el examen:** El orden correcto es: configurar -> compilar bzImage -> compilar modules -> modules_install -> install. `make modules_install` copia los modulos a `/lib/modules/<version>/`. `make install` copia el kernel, System.map y config a `/boot/` y actualiza el bootloader.

### ¿Que hace cada target?

| Target | Accion |
|--------|--------|
| `make bzImage` | Compila la imagen del kernel comprimida |
| `make modules` | Compila todos los modulos configurados con =m |
| `make modules_install` | Instala modulos en `/lib/modules/<version>/` |
| `make install` | Copia vmlinuz, System.map y config a `/boot/`, ejecuta scripts de post-instalacion |
| `make all` | Equivale a `make bzImage` + `make modules` |
| `make clean` | Elimina archivos de compilacion, conserva .config |
| `make mrproper` | Limpieza completa incluyendo .config |
| `make distclean` | Como mrproper mas archivos de editor y parches |

## Generacion del initramfs/initrd

### ¿Por que se necesita un initramfs?

El **initramfs** (initial RAM filesystem) es una imagen de sistema de archivos temporal que se carga en memoria durante el arranque. Contiene los modulos y herramientas necesarios para montar el sistema de archivos raiz real.

Es necesario cuando:
- El controlador del disco esta compilado como modulo
- El sistema de archivos raiz requiere un modulo (por ejemplo, ext4 como modulo)
- Se usa cifrado de disco, LVM o RAID por software
- Se necesita hardware especial para acceder al disco raiz

### Herramientas para generar initramfs

#### mkinitramfs (Debian/Ubuntu)

```bash
# Generar initramfs para el kernel actual
$ mkinitramfs -o /boot/initrd.img-5.15.60 5.15.60

# Actualizar initramfs existente
$ update-initramfs -u -k 5.15.60
```

#### mkinitrd (sistemas legacy)

```bash
# Generar initrd
$ mkinitrd /boot/initrd-5.15.60.img 5.15.60
```

#### dracut (Red Hat/Fedora/SUSE)

```bash
# Generar initramfs con dracut
$ dracut /boot/initramfs-5.15.60.img 5.15.60

# Regenerar initramfs para el kernel actual
$ dracut --force

# Listar contenido del initramfs
$ lsinitrd /boot/initramfs-5.15.60.img
```

> **Para el examen:** Debes conocer las tres herramientas: `mkinitramfs` (Debian), `mkinitrd` (legacy) y `dracut` (Red Hat/Fedora). `dracut` es la herramienta moderna que esta reemplazando a `mkinitrd` en la familia Red Hat.

## DKMS - Dynamic Kernel Module Support

### Concepto

**DKMS** (Dynamic Kernel Module Support) es un framework que permite recompilar automaticamente modulos de kernel de terceros cuando se instala un nuevo kernel.

Problema que resuelve: cuando se actualiza el kernel, los modulos compilados para la version anterior dejan de funcionar. DKMS automatiza la recompilacion.

### Funcionamiento

```bash
# El codigo fuente del modulo se coloca en:
/usr/src/<modulo>-<version>/

# Archivo de configuracion DKMS:
/usr/src/<modulo>-<version>/dkms.conf

# Comandos DKMS
$ dkms add -m <modulo> -v <version>
$ dkms build -m <modulo> -v <version> -k $(uname -r)
$ dkms install -m <modulo> -v <version> -k $(uname -r)
$ dkms status
```

### Ejemplo de dkms.conf

```bash
PACKAGE_NAME="mi-driver"
PACKAGE_VERSION="1.0"
BUILT_MODULE_NAME[0]="mi-driver"
DEST_MODULE_LOCATION[0]="/updates"
AUTOINSTALL="yes"
MAKE[0]="make -C ${kernel_source_dir} M=${dkms_tree}/${PACKAGE_NAME}/${PACKAGE_VERSION}/build"
```

> **Para el examen:** DKMS recompila automaticamente modulos de terceros cuando se instala un nuevo kernel. Es esencial para drivers propietarios como los de NVIDIA o VirtualBox. Los fuentes se almacenan en `/usr/src/<modulo>-<version>/`.

## Headers del kernel

Los headers del kernel son necesarios para compilar modulos externos (fuera del arbol del kernel):

```bash
# Instalar headers en Debian/Ubuntu
$ apt-get install linux-headers-$(uname -r)

# Instalar headers en Red Hat/CentOS
$ yum install kernel-devel

# Ubicacion tipica
/usr/src/linux-headers-$(uname -r)/
# o enlace simbolico en
/lib/modules/$(uname -r)/build
```

Los headers contienen:
- Archivos `.h` de inclusion
- Scripts de configuracion
- Makefile para compilacion de modulos
- Configuracion del kernel (`.config`)

## Personalizacion avanzada

### LOCALVERSION

Para identificar kernels personalizados, se puede agregar un sufijo:

```bash
# En .config
CONFIG_LOCALVERSION="-miservidor"

# O al compilar
$ make LOCALVERSION="-miservidor"

# Resultado: 5.15.60-miservidor
```

### Compilacion cruzada

Para compilar un kernel para una arquitectura diferente:

```bash
$ make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- menuconfig
$ make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- -j$(nproc)
```

## Resumen del flujo completo

```
1. Obtener fuentes     → tar xf linux-X.Y.Z.tar.xz
2. Configurar          → make menuconfig (o oldconfig, xconfig, etc.)
3. Compilar kernel     → make bzImage -j$(nproc)
4. Compilar modulos    → make modules -j$(nproc)
5. Instalar modulos    → make modules_install
6. Instalar kernel     → make install
7. Generar initramfs   → mkinitramfs / dracut
8. Actualizar GRUB     → update-grub / grub2-mkconfig
9. Reiniciar           → reboot
```
