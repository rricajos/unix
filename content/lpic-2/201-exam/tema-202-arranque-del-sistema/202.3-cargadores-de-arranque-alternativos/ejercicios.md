---
title: "202.3 - Cargadores de arranque alternativos"
tags: [lpic-2, examen-201, tema-202, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "202"
subtema: "202.3"
---

# 202.3 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

¿Cual de los siguientes cargadores de arranque de la familia SYSLINUX se utiliza para arrancar sistemas Linux a traves de la red mediante PXE?

a) SYSLINUX
b) ISOLINUX
c) PXELINUX
d) EXTLINUX

<details>
<summary>Respuesta</summary>

**c) PXELINUX**

PXELINUX es la variante de la familia SYSLINUX diseñada especificamente para el arranque por red utilizando el protocolo PXE (Preboot Execution Environment). SYSLINUX se usa para sistemas de archivos FAT, ISOLINUX para medios opticos (CD/DVD con ISO 9660), y EXTLINUX para sistemas de archivos Linux nativos (ext2/3/4, btrfs).
</details>

---

### Pregunta 2

En una configuracion de arranque PXE, ¿en que orden busca PXELINUX su archivo de configuracion?

a) IP hexadecimal, MAC, default
b) default, MAC, IP hexadecimal
c) MAC (con prefijo 01-), IP hexadecimal, default
d) hostname, MAC, default

<details>
<summary>Respuesta</summary>

**c) MAC (con prefijo 01-), IP hexadecimal, default**

PXELINUX busca la configuracion en el siguiente orden: primero por direccion MAC con el prefijo `01-` (por ejemplo, `01-aa-bb-cc-dd-ee-ff`), luego por la IP del cliente convertida a hexadecimal (reduciendo digitos progresivamente), y finalmente el archivo `default`. Este orden permite configuraciones especificas por maquina (MAC) con un respaldo general (default).
</details>

---

### Pregunta 3

¿Que comando se utiliza para instalar y gestionar systemd-boot?

a) `grub-install`
b) `bootctl`
c) `systemd-boot`
d) `efibootmgr`

<details>
<summary>Respuesta</summary>

**b) `bootctl`**

`bootctl` es la herramienta de linea de comandos para instalar, actualizar y gestionar systemd-boot. Se ejecuta `bootctl install` para instalar el cargador en la ESP, `bootctl status` para ver el estado y `bootctl list` para listar las entradas. `efibootmgr` gestiona las entradas de arranque UEFI en la NVRAM, pero no es especifico de systemd-boot.
</details>

---

### Pregunta 4

Un administrador necesita crear un USB arrancable con SYSLINUX. ¿Que sistema de archivos debe tener la particion USB?

a) ext4
b) NTFS
c) FAT (FAT12/FAT16/FAT32)
d) XFS

<details>
<summary>Respuesta</summary>

**c) FAT (FAT12/FAT16/FAT32)**

SYSLINUX esta diseñado especificamente para funcionar con sistemas de archivos FAT. Para arrancar desde ext2/3/4 o btrfs se utilizaria EXTLINUX, que es otra variante de la misma familia. Para medios opticos con ISO 9660 se utiliza ISOLINUX.
</details>

---

### Pregunta 5

¿Donde se almacenan las entradas de arranque individuales de systemd-boot?

a) `/etc/systemd/boot.conf`
b) `/boot/loader/entries/*.conf`
c) `/boot/grub/grub.cfg`
d) `/etc/default/bootloader`

<details>
<summary>Respuesta</summary>

**b) `/boot/loader/entries/*.conf`**

systemd-boot almacena cada entrada de arranque como un archivo `.conf` individual en el directorio `/boot/loader/entries/`. La configuracion principal del cargador (timeout, entrada por defecto) se encuentra en `/boot/loader/loader.conf`. Cada archivo de entrada contiene directivas como `title`, `linux`, `initrd` y `options`.
</details>

---

### Pregunta 6

¿Que herramienta se usa para gestionar las entradas de arranque almacenadas en la NVRAM de un sistema UEFI?

a) `bootctl`
b) `grub-install`
c) `efibootmgr`
d) `mokutil`

<details>
<summary>Respuesta</summary>

**c) `efibootmgr`**

`efibootmgr` es la herramienta estandar para manipular las entradas de arranque UEFI almacenadas en la NVRAM del firmware. Permite crear, eliminar, reordenar y activar/desactivar entradas de arranque. `bootctl` gestiona systemd-boot especificamente, `grub-install` instala GRUB, y `mokutil` gestiona las Machine Owner Keys para Secure Boot.
</details>

---

### Pregunta 7

¿Cual de las siguientes afirmaciones sobre systemd-boot es correcta?

a) Soporta arranque en sistemas BIOS y UEFI
b) Solo funciona en sistemas UEFI y lee unicamente la ESP
c) Requiere un archivo grub.cfg para su configuracion
d) Es el cargador por defecto en todas las distribuciones Linux

<details>
<summary>Respuesta</summary>

**b) Solo funciona en sistemas UEFI y lee unicamente la ESP**

systemd-boot es un cargador de arranque exclusivamente UEFI. No soporta el arranque BIOS/MBR. Solo puede acceder a la ESP (EFI System Partition), que utiliza sistema de archivos FAT32. Esto significa que los kernels e initramfs deben estar en la ESP o ser accesibles desde ella. Utiliza sus propios archivos de configuracion, no `grub.cfg`.
</details>

---

### Pregunta 8

Un administrador desea que un servidor arranque desde la red usando PXE. ¿Que dos servicios minimos necesita en el servidor de arranque?

a) DNS y HTTP
b) DHCP y TFTP
c) NFS y FTP
d) DHCP y NFS

<details>
<summary>Respuesta</summary>

**b) DHCP y TFTP**

El arranque PXE requiere como minimo un servidor DHCP (para asignar una IP al cliente e indicarle la ubicacion del archivo de arranque mediante las opciones `next-server` y `filename`) y un servidor TFTP (para transferir el cargador de arranque, la configuracion, el kernel y el initramfs al cliente). Opcionalmente se pueden usar NFS o HTTP para proporcionar el sistema de archivos raiz despues del arranque inicial.
</details>

---

### Pregunta 9

¿Que componente se utiliza en la cadena de arranque Secure Boot para permitir que cargadores no firmados directamente por Microsoft puedan ejecutarse?

a) `grubx64.efi`
b) `shimx64.efi`
c) `bootx64.efi`
d) `mokutil`

<details>
<summary>Respuesta</summary>

**b) `shimx64.efi`**

`shim` es un cargador de primera etapa firmado por Microsoft que actua como intermediario en la cadena de confianza de Secure Boot. Shim verifica la firma de GRUB (u otro cargador de segunda etapa) usando las claves de la distribucion o las MOK (Machine Owner Keys). Esto permite que distribuciones Linux funcionen con Secure Boot activo sin necesitar que cada version de GRUB este firmada directamente por Microsoft.
</details>

---

### Pregunta 10

En U-Boot, ¿que comando se utiliza para guardar de forma persistente las variables de entorno modificadas con `setenv`?

a) `saveenv`
b) `export`
c) `env save`
d) `persist`

<details>
<summary>Respuesta</summary>

**a) `saveenv`**

En la consola interactiva de U-Boot, `saveenv` guarda todas las variables de entorno actuales de forma persistente (normalmente en flash o en una particion reservada). Las variables se modifican con `setenv` (por ejemplo, `setenv bootargs "root=/dev/mmcblk0p2 rw"`), pero los cambios no sobreviven un reinicio hasta que se ejecuta `saveenv`. El comando `printenv` muestra las variables actuales.
</details>
