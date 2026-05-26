---
title: "202.3 - Cargadores de arranque alternativos"
tags: [lpic-2, examen-201, tema-202, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "202"
subtema: "202.3"
---

# 202.3 - Cargadores de arranque alternativos

## Introduccion

Aunque GRUB 2 es el cargador de arranque mas utilizado en sistemas Linux de escritorio y servidor, existen varios cargadores alternativos diseñados para escenarios especificos: arranque por red, sistemas embebidos, medios extraibles y sistemas UEFI modernos. Este subtema cubre las alternativas mas relevantes para el examen LPIC-2.

**Peso del subtema: 2**

## La familia SYSLINUX

SYSLINUX es un conjunto de cargadores de arranque ligeros desarrollados por H. Peter Anvin. Cada variante esta diseñada para un tipo especifico de medio de arranque.

### SYSLINUX

SYSLINUX es el cargador diseñado para arrancar Linux desde sistemas de archivos **FAT** (FAT12, FAT16, FAT32). Se usa comunmente en memorias USB y disquetes.

```bash
# Instalar SYSLINUX en una particion FAT
syslinux --install /dev/sdb1

# Instalar con MBR
syslinux --install --mbr /dev/sdb1

# El archivo de configuracion se busca en este orden:
# /boot/syslinux/syslinux.cfg
# /syslinux/syslinux.cfg
# /syslinux.cfg
```

Archivo de configuracion tipico (`syslinux.cfg`):

```
DEFAULT linux
PROMPT 1
TIMEOUT 50
LABEL linux
    KERNEL vmlinuz
    APPEND root=/dev/sda1 ro quiet
    INITRD initrd.img
LABEL rescue
    KERNEL vmlinuz
    APPEND root=/dev/sda1 ro single
    INITRD initrd.img
```

### ISOLINUX

ISOLINUX es la variante diseñada para arrancar desde medios opticos **CD/DVD** con sistema de archivos ISO 9660 (con extensiones El Torito).

- Se utiliza ampliamente para crear Live CDs y discos de instalacion
- El archivo binario principal es `isolinux.bin`
- La configuracion se almacena en `isolinux.cfg`

```bash
# Estructura tipica de un CD arrancable con ISOLINUX
isolinux/
├── isolinux.bin        # Cargador de arranque
├── isolinux.cfg        # Configuracion
├── ldlinux.c32         # Modulo del nucleo
├── vmlinuz             # Kernel
└── initrd.img          # Initramfs

# Crear una ISO arrancable con ISOLINUX
mkisofs -o boot.iso -b isolinux/isolinux.bin \
    -c isolinux/boot.cat -no-emul-boot \
    -boot-load-size 4 -boot-info-table \
    ./cd_root/
```

### PXELINUX

PXELINUX permite arrancar Linux a traves de la red utilizando el protocolo **PXE** (Preboot Execution Environment). Es fundamental para instalaciones automatizadas y sistemas diskless.

**Arquitectura de arranque PXE:**

1. El cliente envia una solicitud DHCP
2. El servidor DHCP responde con una IP y la ubicacion del archivo de arranque
3. El cliente descarga el cargador (`pxelinux.0`) via TFTP
4. PXELINUX descarga la configuracion y el kernel via TFTP
5. El kernel arranca con el initramfs proporcionado

```bash
# Archivos necesarios en el servidor TFTP
/tftpboot/
├── pxelinux.0               # Cargador PXE
├── ldlinux.c32              # Modulo nucleo
├── pxelinux.cfg/
│   ├── default              # Configuracion por defecto
│   ├── 01-aa-bb-cc-dd-ee-ff # Config por MAC (prefijo 01-)
│   └── C0A80164             # Config por IP (hexadecimal)
├── vmlinuz                   # Kernel
└── initrd.img                # Initramfs
```

**Configuracion DHCP para PXE** (en ISC DHCP):

```
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.1;
    next-server 192.168.1.10;       # Servidor TFTP
    filename "pxelinux.0";          # Archivo de arranque
}
```

**Orden de busqueda de configuracion en PXELINUX:**

1. `pxelinux.cfg/01-<MAC>` (MAC en minusculas separada por guiones)
2. `pxelinux.cfg/<IP_HEX>` (IP en hexadecimal, eliminando digitos desde la derecha)
3. `pxelinux.cfg/default`

> **Para el examen:** PXELINUX busca la configuracion primero por direccion MAC (con prefijo `01-`), luego por IP en hexadecimal (reduciendo digitos), y finalmente el archivo `default`. Por ejemplo, para la IP 192.168.1.100, buscaria `C0A80164`, `C0A8016`, `C0A801`, etc.

### Directivas comunes de SYSLINUX

| Directiva | Funcion |
|---|---|
| `DEFAULT` | Etiqueta de arranque por defecto |
| `PROMPT` | Mostrar prompt (0=no, 1=si) |
| `TIMEOUT` | Tiempo de espera en decimas de segundo |
| `LABEL` | Define una entrada de arranque |
| `KERNEL` | Ruta al kernel |
| `APPEND` | Parametros del kernel |
| `INITRD` | Ruta al initramfs |
| `DISPLAY` | Archivo de texto a mostrar |
| `MENU TITLE` | Titulo del menu grafico |

## systemd-boot (bootctl)

### Descripcion general

`systemd-boot` (anteriormente conocido como gummiboot) es un cargador de arranque UEFI simple incluido en systemd. Es mas ligero que GRUB y esta diseñado exclusivamente para sistemas UEFI.

**Caracteristicas:**
- Solo funciona con UEFI (no soporta BIOS/MBR)
- Configuracion basada en archivos de texto simples
- Deteccion automatica de kernels
- Interfaz de menu minimalista
- No soporta sistemas de archivos complejos (solo lee la ESP)

### Instalacion y gestion con bootctl

```bash
# Instalar systemd-boot en la ESP
bootctl install

# Actualizar systemd-boot
bootctl update

# Ver estado actual
bootctl status

# Listar entradas disponibles
bootctl list

# Eliminar systemd-boot
bootctl remove
```

### Configuracion

Los archivos de configuracion se almacenan en la **ESP** (EFI System Partition):

**Archivo principal** (`/boot/loader/loader.conf`):

```
default  arch.conf
timeout  5
console-mode max
editor   no
```

**Entradas de arranque** (`/boot/loader/entries/*.conf`):

```
# /boot/loader/entries/arch.conf
title   Arch Linux
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=UUID=xxxx-xxxx rw quiet
```

```
# /boot/loader/entries/arch-fallback.conf
title   Arch Linux (fallback)
linux   /vmlinuz-linux
initrd  /initramfs-linux-fallback.img
options root=UUID=xxxx-xxxx rw
```

> **Para el examen:** `systemd-boot` solo funciona con UEFI y almacena su configuracion en la ESP. Cada entrada de arranque es un archivo `.conf` independiente en `/boot/loader/entries/`.

## U-Boot

### Descripcion general

U-Boot (Universal Boot Loader) es el cargador de arranque estandar para **sistemas embebidos**, especialmente en arquitecturas ARM, MIPS y PowerPC. Es ampliamente utilizado en routers, dispositivos IoT, placas de desarrollo (Raspberry Pi, BeagleBone) y otros sistemas embebidos.

**Caracteristicas:**
- Soporte para multiples arquitecturas (ARM, MIPS, x86, PowerPC)
- Linea de comandos interactiva
- Soporte para arranque por red (TFTP, NFS)
- Soporte para multiples sistemas de archivos
- Variables de entorno persistentes
- Scripting de arranque

### Variables de entorno de U-Boot

```bash
# En la consola interactiva de U-Boot
# Ver todas las variables
printenv

# Establecer una variable
setenv bootargs "console=ttyS0,115200 root=/dev/mmcblk0p2 rw"
setenv bootcmd "fatload mmc 0:1 0x80000000 zImage; bootz 0x80000000"

# Guardar variables de forma persistente
saveenv

# Arrancar con la configuracion actual
boot
# O ejecutar el comando de bootcmd
run bootcmd
```

### Archivos de configuracion

- **`/boot/boot.scr`**: Script de arranque compilado
- **`/boot/uEnv.txt`**: Variables de entorno en texto plano (alternativa a boot.scr)

```bash
# Ejemplo de uEnv.txt
bootargs=console=ttyO0,115200n8 root=/dev/mmcblk0p2 rw
loadaddr=0x82000000
fdtaddr=0x88000000
bootcmd=load mmc 0:1 ${loadaddr} zImage; load mmc 0:1 ${fdtaddr} am335x-boneblack.dtb; bootz ${loadaddr} - ${fdtaddr}
```

## Conceptos de arranque PXE

### Proceso completo de arranque por red

```
Cliente                         Servidor DHCP         Servidor TFTP
   |                                |                      |
   |--- DHCP Discover ------------>|                      |
   |<-- DHCP Offer (IP + PXE) ----|                      |
   |--- DHCP Request ------------>|                      |
   |<-- DHCP ACK -----------------|                      |
   |                                                      |
   |--- TFTP Request (pxelinux.0) ---------------------->|
   |<-- TFTP Transfer -----------------------------------|
   |                                                      |
   |--- TFTP Request (config) -------------------------->|
   |<-- TFTP Transfer -----------------------------------|
   |                                                      |
   |--- TFTP Request (kernel + initrd) ----------------->|
   |<-- TFTP Transfer -----------------------------------|
   |                                                      |
   [Kernel arranca]
```

> **Para el examen:** El arranque PXE requiere al menos dos servicios: DHCP (para asignar IP y indicar el archivo de arranque) y TFTP (para transferir los archivos). Opcionalmente se puede usar NFS o HTTP para el sistema de archivos raiz.

## UEFI y efibootmgr

### Entradas de arranque UEFI

En sistemas UEFI, las entradas de arranque se almacenan en la **NVRAM** del firmware. Se gestionan con `efibootmgr`:

```bash
# Ver las entradas de arranque actuales
efibootmgr -v

# Crear una nueva entrada de arranque
efibootmgr -c -d /dev/sda -p 1 -L "Linux" -l "\EFI\BOOT\bootx64.efi"

# Cambiar el orden de arranque
efibootmgr -o 0001,0002,0003

# Establecer el proximo arranque (una sola vez)
efibootmgr -n 0002

# Eliminar una entrada
efibootmgr -b 0004 -B

# Activar/desactivar una entrada
efibootmgr -b 0003 -a    # Activar
efibootmgr -b 0003 -A    # Desactivar
```

### Estructura de la ESP

```
/boot/efi/EFI/
├── BOOT/
│   └── bootx64.efi        # Cargador por defecto UEFI
├── debian/
│   └── grubx64.efi        # GRUB para Debian
├── ubuntu/
│   └── shimx64.efi        # Shim para Secure Boot (Ubuntu)
└── Microsoft/
    └── Boot/
        └── bootmgfw.efi   # Windows Boot Manager
```

## Secure Boot

### Conceptos basicos

Secure Boot es una caracteristica de UEFI que verifica la firma digital de los cargadores de arranque antes de ejecutarlos, protegiendo contra malware de arranque (bootkits).

**Cadena de confianza:**

1. El firmware UEFI verifica la firma del cargador de arranque
2. El cargador (shim) verifica la firma de GRUB
3. GRUB verifica la firma del kernel
4. El kernel verifica la firma de los modulos

**Componentes clave:**
- **PK** (Platform Key): Clave del propietario de la plataforma
- **KEK** (Key Exchange Key): Claves para actualizar las bases de datos
- **db**: Base de datos de firmas permitidas
- **dbx**: Base de datos de firmas revocadas
- **shim**: Cargador de primera etapa firmado por Microsoft que permite cargar GRUB

```bash
# Verificar el estado de Secure Boot
mokutil --sb-state

# Listar claves enrolladas
mokutil --list-enrolled

# Importar una clave MOK (Machine Owner Key)
mokutil --import mi_clave.der
```

> **Para el examen:** Secure Boot utiliza `shim` como cargador de primera etapa firmado por Microsoft. Shim a su vez carga GRUB u otro cargador de segunda etapa. `mokutil` se usa para gestionar las Machine Owner Keys (MOK).

## Comparativa de cargadores de arranque

| Caracteristica | GRUB 2 | SYSLINUX | systemd-boot | U-Boot |
|---|---|---|---|---|
| BIOS/MBR | Si | Si | No | Depende |
| UEFI | Si | Parcial | Si | Parcial |
| Sistemas de archivos | Muchos | FAT/ISO/PXE | Solo ESP (FAT) | Varios |
| Complejidad | Alta | Baja | Baja | Media |
| Uso tipico | Escritorio/Servidor | Medios/Red | Escritorio UEFI | Embebido |
| Scripting | Si | Limitado | No | Si |
| Secure Boot | Si (con shim) | No | Si | Parcial |
