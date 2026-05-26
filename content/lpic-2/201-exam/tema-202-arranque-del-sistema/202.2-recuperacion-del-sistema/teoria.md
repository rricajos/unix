---
title: "202.2 - Recuperacion del sistema"
tags: [lpic-2, examen-201, tema-202, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "202"
subtema: "202.2"
---

# 202.2 - Recuperacion del sistema

## Introduccion

La recuperacion del sistema es una de las habilidades mas criticas para un administrador Linux. Este subtema cubre las tecnicas necesarias para diagnosticar y reparar sistemas que no arrancan correctamente, incluyendo el uso de modos de rescate, entornos chroot, reparacion de sistemas de archivos y reinstalacion de cargadores de arranque.

**Peso del subtema: 4**

## Modos de arranque para recuperacion

### Modo usuario unico (Single-user mode)

El modo usuario unico proporciona acceso al sistema con privilegios de root y sin servicios de red activos. Es util para tareas de mantenimiento basico.

**Como acceder:**

- Agregar `single`, `1` o `S` a los parametros del kernel en GRUB
- En systemd: agregar `systemd.unit=rescue.target`

```bash
# En la linea del kernel en GRUB, agregar al final:
linux /vmlinuz root=/dev/sda1 ro single

# Equivalente en systemd
linux /vmlinuz root=/dev/sda1 ro systemd.unit=rescue.target
```

### Modo de rescate (rescue mode)

El modo de rescate en systemd (`rescue.target`) monta los sistemas de archivos y carga servicios basicos, pero no inicia la red ni servicios multiusuario.

```bash
# Desde GRUB, agregar al kernel:
systemd.unit=rescue.target

# Desde un sistema en ejecucion:
systemctl isolate rescue.target
```

Caracteristicas del modo rescate:
- Monta todos los sistemas de archivos de `/etc/fstab`
- Carga los modulos del kernel necesarios
- Solicita la contrasena de root
- No inicia servicios de red

### Modo de emergencia (emergency mode)

El modo de emergencia es el nivel de recuperacion mas basico en systemd. Proporciona un entorno minimo.

```bash
# Desde GRUB, agregar al kernel:
systemd.unit=emergency.target

# O simplemente:
emergency
```

Caracteristicas del modo emergencia:
- **Solo monta el sistema raiz en modo solo lectura**
- No monta ningun otro sistema de archivos
- No carga ningun servicio adicional
- Solicita la contrasena de root
- El administrador debe montar manualmente cualquier sistema de archivos necesario

> **Para el examen:** Si el sistema no puede arrancar ni siquiera en modo rescate (por ejemplo, un `/etc/fstab` corrupto), el modo emergencia es la opcion correcta porque no intenta montar los sistemas de archivos de fstab.

### Arranque con init=/bin/bash

Esta es la forma mas directa de obtener acceso a un sistema. Reemplaza completamente el proceso init por una shell.

```bash
# En GRUB, reemplazar init:
linux /vmlinuz root=/dev/sda1 ro init=/bin/bash
```

**Procedimiento tipico despues de arrancar con init=/bin/bash:**

```bash
# El sistema de archivos raiz esta montado en solo lectura
# Remontar en lectura/escritura
mount -o remount,rw /

# Realizar las reparaciones necesarias
# Por ejemplo, restablecer la contrasena de root:
passwd root

# Remontar en solo lectura antes de reiniciar
mount -o remount,ro /

# Reiniciar (sync primero para asegurar escritura a disco)
sync
exec /sbin/init
# O forzar reinicio:
echo b > /proc/sysrq-trigger
```

> **Para el examen:** Cuando se arranca con `init=/bin/bash`, el sistema de archivos raiz se monta en **solo lectura**. Es necesario remontarlo con `mount -o remount,rw /` antes de poder hacer cambios.

## Recuperacion con Live CD/USB

### Proceso general de recuperacion con Live CD

Cuando el sistema no puede arrancar en ningun modo, un Live CD o USB proporciona un sistema operativo funcional desde el que se puede acceder a los discos del sistema averiado.

```bash
# 1. Arrancar desde el Live CD/USB

# 2. Identificar las particiones del sistema
lsblk
fdisk -l
blkid

# 3. Montar el sistema de archivos raiz
mount /dev/sda2 /mnt

# 4. Montar particiones adicionales si es necesario
mount /dev/sda1 /mnt/boot
mount /dev/sda3 /mnt/home
```

### Entornos chroot

El comando `chroot` cambia el directorio raiz aparente para un proceso, permitiendo trabajar dentro del sistema instalado como si estuviera arrancado normalmente.

```bash
# Montar los sistemas de archivos virtuales necesarios
mount --bind /dev /mnt/dev
mount --bind /dev/pts /mnt/dev/pts
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys
mount --bind /run /mnt/run

# Entrar al entorno chroot
chroot /mnt /bin/bash

# Ahora estamos "dentro" del sistema instalado
# Podemos ejecutar comandos como si fuera el sistema real

# Para salir del chroot:
exit

# Desmontar los sistemas de archivos virtuales
umount /mnt/dev/pts
umount /mnt/dev
umount /mnt/proc
umount /mnt/sys
umount /mnt/run
umount /mnt
```

> **Para el examen:** Es fundamental montar `/dev`, `/proc` y `/sys` antes de hacer chroot. Sin estos sistemas de archivos virtuales, muchos comandos (como `grub-install`) no funcionaran correctamente dentro del entorno chroot.

**Alternativa moderna con arch-chroot:**

Algunas distribuciones proporcionan scripts que automatizan el montaje de los sistemas de archivos virtuales:

```bash
# En Arch Linux y derivados
arch-chroot /mnt
```

## Reparacion del cargador de arranque

### Reinstalacion de GRUB

Cuando el cargador de arranque esta danado o ha sido sobrescrito (por ejemplo, por una instalacion de Windows):

```bash
# Desde un Live CD, despues de montar y hacer chroot:

# Para sistemas BIOS/MBR:
grub-install /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg

# Para sistemas UEFI:
# Asegurarse de que la particion EFI esta montada
mount /dev/sda1 /boot/efi
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg
```

### Shell de rescate de GRUB

Si GRUB puede cargarse parcialmente pero no encuentra su configuracion, se presenta la shell de rescate de GRUB (`grub rescue>`):

```bash
# Listar particiones y buscar el directorio de GRUB
grub rescue> ls
grub rescue> ls (hd0,msdos1)/
grub rescue> ls (hd0,msdos1)/boot/grub/

# Establecer la particion correcta
grub rescue> set root=(hd0,msdos1)
grub rescue> set prefix=(hd0,msdos1)/boot/grub

# Cargar los modulos necesarios
grub rescue> insmod normal
grub rescue> normal
```

Si se accede a la shell normal de GRUB (`grub>`), se tiene mas funcionalidad:

```bash
grub> ls
grub> set root=(hd0,msdos1)
grub> linux /vmlinuz root=/dev/sda1 ro
grub> initrd /initrd.img
grub> boot
```

## Reparacion de sistemas de archivos

### fsck - Comprobacion y reparacion

El comando `fsck` debe ejecutarse en sistemas de archivos **desmontados** o montados en **solo lectura**:

```bash
# Comprobar y reparar un sistema de archivos ext4
fsck /dev/sda2

# Reparacion automatica sin preguntas
fsck -y /dev/sda2

# Comprobar tipo especifico
fsck.ext4 /dev/sda2
e2fsck /dev/sda2

# Para XFS (debe estar desmontado)
xfs_repair /dev/sda3

# Verificar sin reparar
fsck -n /dev/sda2
```

> **Para el examen:** NUNCA ejecutar `fsck` en un sistema de archivos montado en modo lectura/escritura. Esto puede causar corrupcion de datos severa. Si es necesario reparar la particion raiz, arrancar en modo emergencia o desde un Live CD.

### Forzar fsck en el proximo arranque

```bash
# Crear el archivo indicador en la raiz
touch /forcefsck

# O usar el parametro del kernel
# En GRUB agregar: fsck.mode=force

# Con tune2fs, establecer el contador de montajes
tune2fs -C 100 /dev/sda1
```

## Recuperacion de /etc/fstab

Un archivo `/etc/fstab` corrupto o incorrecto puede impedir el arranque del sistema.

### Procedimiento de reparacion

```bash
# 1. Arrancar en modo emergencia (no intenta montar fstab)
# Agregar al kernel: systemd.unit=emergency.target

# 2. Remontar raiz en lectura/escritura
mount -o remount,rw /

# 3. Obtener informacion de las particiones
blkid
lsblk -f

# 4. Editar fstab con la informacion correcta
vi /etc/fstab

# Formato de /etc/fstab:
# <dispositivo>  <punto_montaje>  <tipo_fs>  <opciones>  <dump>  <pass>
# UUID=xxxx       /                ext4        defaults     1       1
# UUID=yyyy       /home            ext4        defaults     1       2
# UUID=zzzz       swap             swap        defaults     0       0
```

> **Para el examen:** Si fstab tiene errores, arrancar con `systemd.unit=emergency.target` es la opcion mas segura porque no intenta montar las entradas de fstab. El modo rescate si intenta montarlas y podria fallar.

## Backup y restauracion del MBR

### Respaldo del MBR con dd

El MBR (Master Boot Record) ocupa los primeros 512 bytes del disco:

```bash
# Respaldar el MBR completo (446 bytes bootloader + 64 bytes tabla + 2 bytes firma)
dd if=/dev/sda of=/backup/mbr_sda.img bs=512 count=1

# Respaldar solo el bootloader (sin tabla de particiones)
dd if=/dev/sda of=/backup/bootloader_sda.img bs=446 count=1

# Restaurar el MBR completo (PELIGROSO: incluye tabla de particiones)
dd if=/backup/mbr_sda.img of=/dev/sda bs=512 count=1

# Restaurar solo el bootloader (seguro: no toca la tabla de particiones)
dd if=/backup/bootloader_sda.img of=/dev/sda bs=446 count=1
```

| Seccion del MBR | Bytes | Offset |
|---|---|---|
| Codigo del bootloader | 446 | 0-445 |
| Tabla de particiones | 64 | 446-509 |
| Firma de arranque (0x55AA) | 2 | 510-511 |

> **Para el examen:** Al restaurar el MBR, es importante saber la diferencia entre restaurar los 512 bytes completos (que incluye la tabla de particiones) y restaurar solo los primeros 446 bytes (solo el bootloader). Restaurar los 512 bytes en un disco con tabla de particiones diferente destruira la tabla actual.

### Imagenes de disco con dd

```bash
# Crear imagen completa de un disco
dd if=/dev/sda of=/backup/disco_completo.img bs=4M status=progress

# Restaurar imagen a un disco
dd if=/backup/disco_completo.img of=/dev/sda bs=4M status=progress

# Crear imagen comprimida
dd if=/dev/sda bs=4M | gzip > /backup/disco.img.gz

# Restaurar imagen comprimida
gunzip -c /backup/disco.img.gz | dd of=/dev/sda bs=4M

# Clonar un disco a otro
dd if=/dev/sda of=/dev/sdb bs=4M status=progress
```

## Procedimiento completo de recuperacion

Resumen del flujo de trabajo tipico de recuperacion:

1. **Intentar modo rescate**: agregar `systemd.unit=rescue.target` al kernel
2. **Si falla, intentar modo emergencia**: agregar `systemd.unit=emergency.target`
3. **Si falla, intentar init=/bin/bash**: agregar `init=/bin/bash`
4. **Si nada funciona, usar Live CD/USB**:
   - Arrancar desde medio externo
   - Identificar particiones (`lsblk`, `blkid`)
   - Montar el sistema (`mount /dev/sdXY /mnt`)
   - Montar sistemas virtuales (`/dev`, `/proc`, `/sys`)
   - Hacer chroot (`chroot /mnt`)
   - Reparar el problema
   - Reinstalar GRUB si es necesario
   - Salir del chroot y reiniciar

## Resumen de archivos y comandos clave

| Recurso | Funcion en recuperacion |
|---|---|
| `init=/bin/bash` | Arranque sin init, shell directa |
| `rescue.target` | Modo rescate con servicios basicos |
| `emergency.target` | Modo emergencia minimo |
| `chroot /mnt` | Entrar en el sistema montado |
| `fsck /dev/sdX` | Reparar sistema de archivos |
| `grub-install` | Reinstalar bootloader |
| `dd if= of= bs=` | Copiar/respaldar sectores de disco |
| `mount -o remount,rw /` | Remontar raiz en lectura/escritura |
| `blkid` | Identificar particiones y UUIDs |
