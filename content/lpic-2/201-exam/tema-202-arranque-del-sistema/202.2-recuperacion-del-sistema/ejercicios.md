---
title: "202.2 - Recuperacion del sistema"
tags: [lpic-2, examen-201, tema-202, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "202"
subtema: "202.2"
---

# 202.2 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

Un sistema Linux no puede arrancar debido a un archivo `/etc/fstab` corrupto. ¿Cual es la mejor opcion para acceder al sistema y repararlo?

a) Arrancar con `systemd.unit=rescue.target`
b) Arrancar con `systemd.unit=emergency.target`
c) Arrancar con `init=/sbin/reboot`
d) Reinstalar el sistema operativo

<details>
<summary>Respuesta</summary>

**b) Arrancar con `systemd.unit=emergency.target`**

El modo emergencia es la opcion correcta porque no intenta montar los sistemas de archivos listados en `/etc/fstab`. El modo rescate (`rescue.target`) si intenta montar los sistemas de archivos de fstab, por lo que fallaria si fstab esta corrupto. Una vez en modo emergencia, se puede remontar la raiz en lectura/escritura con `mount -o remount,rw /` y corregir el archivo fstab.
</details>

---

### Pregunta 2

Despues de arrancar con `init=/bin/bash`, un administrador intenta editar un archivo de configuracion pero recibe un error de "Read-only file system". ¿Que debe hacer?

a) Ejecutar `fsck /`
b) Ejecutar `mount -o remount,rw /`
c) Ejecutar `chmod 777 /`
d) Reiniciar y arrancar con `rw` como parametro del kernel

<details>
<summary>Respuesta</summary>

**b) Ejecutar `mount -o remount,rw /`**

Cuando se arranca con `init=/bin/bash`, el sistema de archivos raiz se monta en modo solo lectura por defecto (por el parametro `ro` en la linea del kernel). Para poder modificar archivos, es necesario remontar la raiz en modo lectura/escritura con `mount -o remount,rw /`. La opcion d) tambien funcionaria pero no es la solucion mas practica ya que implica reiniciar.
</details>

---

### Pregunta 3

¿Cuales son los sistemas de archivos virtuales que DEBEN montarse antes de ejecutar `chroot` para que herramientas como `grub-install` funcionen correctamente?

a) `/tmp`, `/var`, `/home`
b) `/dev`, `/proc`, `/sys`
c) `/boot`, `/etc`, `/usr`
d) `/run`, `/tmp`, `/opt`

<details>
<summary>Respuesta</summary>

**b) `/dev`, `/proc`, `/sys`**

Los sistemas de archivos virtuales `/dev` (dispositivos), `/proc` (informacion del kernel y procesos) y `/sys` (informacion del hardware y kernel) son esenciales para que muchas herramientas del sistema funcionen correctamente dentro del entorno chroot. Sin ellos, comandos como `grub-install`, `mount` y otros no podran interactuar con el hardware ni con el kernel. Tambien es recomendable montar `/dev/pts` y `/run`.
</details>

---

### Pregunta 4

Un administrador quiere respaldar solo el codigo del bootloader del MBR sin incluir la tabla de particiones. ¿Que comando dd es correcto?

a) `dd if=/dev/sda of=mbr.img bs=512 count=1`
b) `dd if=/dev/sda of=bootloader.img bs=446 count=1`
c) `dd if=/dev/sda of=bootloader.img bs=64 count=1`
d) `dd if=/dev/sda of=mbr.img bs=510 count=1`

<details>
<summary>Respuesta</summary>

**b) `dd if=/dev/sda of=bootloader.img bs=446 count=1`**

El codigo del bootloader ocupa los primeros 446 bytes del MBR. Los siguientes 64 bytes contienen la tabla de particiones, y los ultimos 2 bytes son la firma de arranque (0x55AA). Al usar `bs=446 count=1`, se copian exactamente los 446 bytes del bootloader sin tocar la tabla de particiones. La opcion a) copia los 512 bytes completos del MBR, incluyendo la tabla de particiones.
</details>

---

### Pregunta 5

En la shell de rescate de GRUB (`grub rescue>`), ¿cual es la secuencia correcta de comandos para arrancar manualmente?

a) `boot`, `linux /vmlinuz`, `initrd /initrd.img`
b) `set root=(hd0,1)`, `insmod normal`, `normal`
c) `mount /dev/sda1`, `chroot /mnt`, `grub-install`
d) `fsck /dev/sda1`, `reboot`

<details>
<summary>Respuesta</summary>

**b) `set root=(hd0,1)`, `insmod normal`, `normal`**

En la shell de rescate de GRUB, primero se debe establecer la particion raiz correcta con `set root=`, luego cargar el modulo `normal` con `insmod normal`, y finalmente ejecutar `normal` para cargar el menu completo de GRUB. Desde la shell de rescate, los comandos `linux` e `initrd` no estan disponibles hasta que se carga el modulo normal. Las opciones c) y d) son comandos de Linux, no de GRUB.
</details>

---

### Pregunta 6

¿Cual es el comando correcto para reinstalar GRUB en un sistema UEFI despues de hacer chroot desde un Live CD?

a) `grub-install /dev/sda`
b) `grub-install --target=x86_64-efi --efi-directory=/boot/efi`
c) `grub-install --force /dev/sda1`
d) `dd if=grub.img of=/dev/sda bs=512 count=1`

<details>
<summary>Respuesta</summary>

**b) `grub-install --target=x86_64-efi --efi-directory=/boot/efi`**

En sistemas UEFI, `grub-install` necesita los parametros `--target=x86_64-efi` para especificar la plataforma y `--efi-directory` para indicar donde esta montada la particion EFI (normalmente `/boot/efi`). La opcion a) es para sistemas BIOS/MBR. La opcion d) no tiene sentido para UEFI ya que no utiliza MBR.
</details>

---

### Pregunta 7

Un administrador necesita ejecutar `fsck` en la particion raiz (`/`) de un sistema en ejecucion. ¿Cual es el procedimiento correcto?

a) Ejecutar `fsck /` directamente
b) Ejecutar `fsck -f /dev/sda1` con el sistema en ejecucion
c) Arrancar en modo emergencia y ejecutar `fsck /dev/sda1` con la raiz montada en solo lectura
d) No es posible ejecutar fsck en la particion raiz

<details>
<summary>Respuesta</summary>

**c) Arrancar en modo emergencia y ejecutar `fsck /dev/sda1` con la raiz montada en solo lectura**

Nunca se debe ejecutar `fsck` en un sistema de archivos montado en modo lectura/escritura, ya que puede causar corrupcion severa de datos. El procedimiento correcto es arrancar en modo emergencia (donde la raiz se monta en solo lectura) o desde un Live CD (donde la particion no esta montada). Tambien se puede usar `touch /forcefsck` para que fsck se ejecute automaticamente en el proximo arranque.
</details>

---

### Pregunta 8

Despues de realizar reparaciones dentro de un entorno chroot con `init=/bin/bash`, ¿cual es la forma mas segura de reiniciar el sistema?

a) Ejecutar `reboot`
b) Ejecutar `shutdown -r now`
c) Ejecutar `sync` y luego `echo b > /proc/sysrq-trigger`
d) Desconectar la alimentacion electrica

<details>
<summary>Respuesta</summary>

**c) Ejecutar `sync` y luego `echo b > /proc/sysrq-trigger`**

Cuando se arranca con `init=/bin/bash`, los comandos `reboot` y `shutdown` normalmente no funcionan porque no hay un sistema init en ejecucion que gestione el apagado. El procedimiento seguro es: primero ejecutar `sync` para asegurar que todos los datos en buffer se escriban al disco, luego remontar en solo lectura con `mount -o remount,ro /`, y finalmente forzar el reinicio mediante la interfaz SysRq con `echo b > /proc/sysrq-trigger`. Tambien se puede intentar `exec /sbin/init` para iniciar el sistema normalmente.
</details>

---

### Pregunta 9

¿Que comando permite desmontar recursivamente todos los sistemas de archivos montados bajo `/mnt` despues de salir de un entorno chroot?

a) `umount /mnt`
b) `umount -a /mnt`
c) `umount -R /mnt`
d) `umount --force /mnt`

<details>
<summary>Respuesta</summary>

**c) `umount -R /mnt`**

La opcion `-R` (o `--recursive`) de `umount` desmonta recursivamente todos los sistemas de archivos montados bajo el punto de montaje especificado. Esto es especialmente util despues de un chroot, donde se han montado `/dev`, `/proc`, `/sys` y otros bajo `/mnt`. La opcion `-a` desmontaria todos los sistemas de archivos del sistema (peligroso), y `umount /mnt` solo desmontaria el punto de montaje principal si no hay otros montados debajo.
</details>

---

### Pregunta 10

Un administrador arranca en modo emergencia y ejecuta `blkid`. La salida muestra que la particion raiz tiene UUID `a1b2c3d4-e5f6-7890-abcd-ef1234567890`. ¿Cual seria la linea correcta en `/etc/fstab` para esta particion raiz ext4?

a) `/dev/sda1  /  ext4  defaults  0  0`
b) `UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890  /  ext4  defaults  1  1`
c) `LABEL=root  /  ext4  rw  1  1`
d) `a1b2c3d4-e5f6-7890-abcd-ef1234567890  /  ext4  defaults  1  1`

<details>
<summary>Respuesta</summary>

**b) `UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890  /  ext4  defaults  1  1`**

La forma recomendada de identificar particiones en fstab es mediante UUID, ya que los nombres de dispositivo (`/dev/sdX`) pueden cambiar entre arranques. El formato correcto incluye el prefijo `UUID=`, el punto de montaje `/`, el tipo de sistema de archivos `ext4`, las opciones `defaults`, `1` para dump (respaldo), y `1` para pass (orden de fsck, donde 1 indica la raiz). La opcion d) es incorrecta porque falta el prefijo `UUID=`.
</details>
