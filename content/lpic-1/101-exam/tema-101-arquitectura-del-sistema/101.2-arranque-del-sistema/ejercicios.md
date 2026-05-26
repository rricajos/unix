---
title: "Ejercicios: Arranque del Sistema (101.2)"
tags:
  - lpic-1
  - examen-101
  - tema-101
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "101"
subtema: "101.2"
---

# Ejercicios: Arranque del Sistema (101.2)

Preguntas tipo examen LPIC-1 sobre el proceso de arranque del sistema Linux. Intenta responder cada pregunta antes de revelar la respuesta.

---

## Pregunta 1: Secuencia de arranque

**Ordena correctamente la secuencia de arranque de un sistema Linux:**

a) Kernel -> BIOS -> GRUB2 -> initramfs -> systemd
b) BIOS/UEFI -> POST -> MBR/GPT -> GRUB2 -> Kernel -> initramfs -> systemd
c) POST -> BIOS -> Kernel -> GRUB2 -> initramfs -> systemd
d) BIOS/UEFI -> GRUB2 -> MBR -> Kernel -> systemd -> initramfs

<details>
<summary>Respuesta</summary>

**b) BIOS/UEFI -> POST -> MBR/GPT -> GRUB2 -> Kernel -> initramfs -> systemd**

La secuencia correcta es:
1. El firmware **BIOS/UEFI** se activa al encender el equipo.
2. Se ejecuta el **POST** (Power-On Self-Test) para verificar el hardware.
3. Se lee el **MBR** (en BIOS) o la **particion GPT/ESP** (en UEFI) para localizar el bootloader.
4. **GRUB2** (bootloader) se carga y presenta el menu de arranque.
5. El **Kernel** se descomprime y se carga en memoria.
6. **initramfs** proporciona un sistema de archivos temporal para montar el root real.
7. **systemd** (o init) se ejecuta como PID 1 e inicia los servicios del sistema.
</details>

---

## Pregunta 2: Configuracion de GRUB2

**Un administrador necesita cambiar el tiempo de espera del menu de GRUB2 de 5 a 10 segundos. Cual es el procedimiento correcto?**

a) Editar directamente `/boot/grub/grub.cfg` y cambiar el valor del timeout
b) Editar `/etc/default/grub`, cambiar `GRUB_TIMEOUT=10` y ejecutar `update-grub`
c) Ejecutar `grub-install --timeout=10`
d) Editar `/etc/grub.d/00_header` y cambiar el timeout

<details>
<summary>Respuesta</summary>

**b) Editar `/etc/default/grub`, cambiar `GRUB_TIMEOUT=10` y ejecutar `update-grub`**

El procedimiento correcto es:
1. Editar el archivo `/etc/default/grub` y modificar la linea `GRUB_TIMEOUT=10`.
2. Ejecutar `grub-mkconfig -o /boot/grub/grub.cfg` (o `update-grub` en Debian/Ubuntu) para regenerar la configuracion.

**Nunca se debe editar `/boot/grub/grub.cfg` directamente**, ya que este archivo se genera automaticamente y los cambios se perderian al regenerarlo. La opcion (a) es incorrecta por esta razon. La opcion (c) es incorrecta porque `grub-install` se usa para instalar GRUB en un disco, no para configurar opciones. La opcion (d) no es el metodo recomendado.
</details>

---

## Pregunta 3: initramfs

**Cual es el proposito principal de initramfs durante el arranque?**

a) Proporcionar una interfaz grafica durante el arranque
b) Almacenar los archivos de configuracion de GRUB2
c) Proporcionar un sistema de archivos raiz temporal con los modulos necesarios para montar el sistema de archivos raiz real
d) Realizar las pruebas POST del hardware

<details>
<summary>Respuesta</summary>

**c) Proporcionar un sistema de archivos raiz temporal con los modulos necesarios para montar el sistema de archivos raiz real**

**initramfs** (Initial RAM Filesystem) es un archivo comprimido (formato cpio) que contiene un mini sistema de archivos. Se carga en la RAM durante el arranque y proporciona:
- Modulos del kernel necesarios para acceder al disco (controladores SCSI, SATA, NVMe, etc.)
- Herramientas para montar sistemas de archivos especiales (LVM, RAID, LUKS/cifrado)
- Scripts de inicializacion que preparan el montaje del sistema de archivos raiz definitivo

Una vez montado el sistema raiz real, el initramfs se descarta de la memoria.
</details>

---

## Pregunta 4: dmesg vs journalctl

**Cual de las siguientes afirmaciones sobre `dmesg` y `journalctl` es correcta?**

a) `dmesg` muestra los logs de todos los servicios del sistema, mientras que `journalctl` solo muestra mensajes del kernel
b) `journalctl -k` es equivalente a `dmesg` ya que ambos muestran mensajes del kernel
c) `dmesg` almacena logs de forma persistente, mientras que `journalctl` los pierde al reiniciar
d) `journalctl` solo funciona en sistemas con SysVinit

<details>
<summary>Respuesta</summary>

**b) `journalctl -k` es equivalente a `dmesg` ya que ambos muestran mensajes del kernel**

Explicacion:
- `dmesg` muestra **solo** los mensajes del buffer del anillo (ring buffer) del kernel. Este buffer tiene un tamano fijo y los mensajes antiguos se van sobrescribiendo.
- `journalctl` muestra los logs del journal de systemd, que incluyen mensajes del kernel **y** de todos los servicios del sistema.
- `journalctl -k` (o `journalctl --dmesg`) filtra para mostrar **solo** mensajes del kernel, haciendo que sea funcionalmente equivalente a `dmesg`.
- `journalctl` es una herramienta de **systemd**, no de SysVinit (opcion d incorrecta).
- `dmesg` no almacena logs de forma persistente; es un buffer en memoria (opcion c incorrecta).
</details>

---

## Pregunta 5: Parametros del kernel

**Un administrador necesita arrancar el sistema en modo monousuario para realizar tareas de mantenimiento. Cual de los siguientes parametros del kernel puede usar en la linea de GRUB2?**

a) `runlevel=1`
b) `mode=single`
c) `single`
d) `maintenance`

<details>
<summary>Respuesta</summary>

**c) `single`**

Para arrancar en modo monousuario (single-user mode), se pueden usar los siguientes parametros del kernel:
- `single`
- `s`
- `1`
- `systemd.unit=rescue.target` (en sistemas con systemd)

El modo monousuario proporciona un shell de root con servicios minimos, util para tareas de mantenimiento como reparacion del sistema de archivos, cambio de contrasenas de root, etc. Las opciones (a), (b) y (d) no son parametros validos del kernel de Linux.
</details>

---

## Pregunta 6: Ubicacion de logs de arranque

**En un sistema Red Hat/CentOS, cual de los siguientes archivos contiene mensajes generales del sistema, incluyendo informacion de arranque?**

a) `/var/log/syslog`
b) `/var/log/messages`
c) `/var/log/boot.cfg`
d) `/var/log/grub.log`

<details>
<summary>Respuesta</summary>

**b) `/var/log/messages`**

Archivos de log segun la distribucion:
- **Red Hat/CentOS/SUSE**: Usan `/var/log/messages` como log general del sistema.
- **Debian/Ubuntu**: Usan `/var/log/syslog` como log general del sistema.

Otros archivos de log de arranque importantes:
- `/var/log/boot.log` - Mensajes especificos del arranque.
- `/var/log/dmesg` - Copia del buffer de dmesg capturada durante el arranque.

La opcion (a) es el equivalente en Debian/Ubuntu, no en Red Hat. Las opciones (c) y (d) no existen como archivos estandar del sistema.
</details>

---

## Pregunta 7: BIOS vs UEFI

**Cual de las siguientes afirmaciones describe correctamente una diferencia entre BIOS+MBR y UEFI+GPT?**

a) MBR soporta discos de hasta 8 TB, mientras que GPT soporta hasta 2 TB
b) UEFI lee el bootloader directamente desde la particion ESP, mientras que BIOS lee los primeros 512 bytes del disco (MBR)
c) BIOS soporta Secure Boot, pero UEFI no
d) GPT permite un maximo de 4 particiones primarias, mientras que MBR permite 128

<details>
<summary>Respuesta</summary>

**b) UEFI lee el bootloader directamente desde la particion ESP, mientras que BIOS lee los primeros 512 bytes del disco (MBR)**

Diferencias clave:
- **BIOS + MBR**: Lee los primeros 512 bytes del disco (MBR), que contienen el codigo de arranque inicial. Limite de disco de **2 TB** y maximo **4 particiones** primarias.
- **UEFI + GPT**: Lee directamente archivos `.efi` desde la particion **ESP** (EFI System Partition, formateada en FAT32). Sin limite practico de tamano de disco y soporta hasta **128 particiones**.
- **Secure Boot** es una caracteristica de **UEFI**, no de BIOS.

Las opciones (a), (c) y (d) tienen los valores invertidos o son incorrectas.
</details>

---

## Pregunta 8: Generar initramfs

**En un sistema Debian/Ubuntu, cual es el comando correcto para regenerar la imagen initramfs del kernel actual?**

a) `dracut --force`
b) `mkinitrd /boot/initrd.img $(uname -r)`
c) `update-initramfs -u`
d) `grub-mkconfig -o /boot/initrd.img`

<details>
<summary>Respuesta</summary>

**c) `update-initramfs -u`**

Las herramientas para generar initramfs dependen de la distribucion:
- **Debian/Ubuntu**: `mkinitramfs` o `update-initramfs`
  - `update-initramfs -u` actualiza la imagen del kernel actual
  - `update-initramfs -c -k version` crea una nueva imagen
- **Red Hat/CentOS/Fedora (moderno)**: `dracut`
  - `dracut --force` regenera la imagen
- **Red Hat/CentOS (antiguo)**: `mkinitrd`

La opcion (a) es para Red Hat, no Debian. La opcion (b) usa `mkinitrd`, que es la herramienta antigua de Red Hat. La opcion (d) es incorrecta porque `grub-mkconfig` genera la configuracion de GRUB, no la imagen initramfs.
</details>

---

## Pregunta 9: Opciones de /etc/default/grub

**Cual de las siguientes lineas en `/etc/default/grub` agrega los parametros "quiet" y "splash" a la linea de arranque del kernel?**

a) `GRUB_KERNEL_PARAMS="quiet splash"`
b) `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"`
c) `GRUB_BOOT_PARAMS="quiet splash"`
d) `GRUB_OPTIONS="quiet splash"`

<details>
<summary>Respuesta</summary>

**b) `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"`**

Opciones de linea de comandos del kernel en `/etc/default/grub`:
- **`GRUB_CMDLINE_LINUX_DEFAULT`**: Parametros que se agregan **solo** a la entrada de arranque por defecto (no a la entrada de recovery/recuperacion). Es la opcion mas comun para parametros como `quiet splash`.
- **`GRUB_CMDLINE_LINUX`**: Parametros que se agregan a **todas** las entradas de arranque (incluyendo recovery).

Las opciones (a), (c) y (d) no son variables validas de `/etc/default/grub`.

Despues de cualquier cambio en este archivo, se debe ejecutar `grub-mkconfig -o /boot/grub/grub.cfg` o `update-grub` para aplicar los cambios.
</details>

---

## Pregunta 10: Logs del arranque anterior

**Un administrador necesita revisar los logs del arranque anterior del sistema porque hubo un fallo. Que comando debe usar?**

a) `dmesg -b -1`
b) `journalctl -b -1`
c) `cat /var/log/boot.log.1`
d) `systemctl --boot=-1`

<details>
<summary>Respuesta</summary>

**b) `journalctl -b -1`**

El comando `journalctl -b -1` muestra los logs del arranque anterior al actual:
- `-b` indica que se quiere filtrar por arranque.
- `-1` indica el arranque anterior (0 = actual, -1 = anterior, -2 = dos arranques atras, etc.).
- `journalctl --list-boots` muestra una lista de todos los arranques registrados.

**Requisito:** Para que los logs de arranques anteriores esten disponibles, el journal de systemd debe estar configurado con almacenamiento persistente. Esto requiere que exista el directorio `/var/log/journal/` o que la configuracion en `/etc/systemd/journald.conf` tenga `Storage=persistent`.

La opcion (a) es incorrecta porque `dmesg` no tiene la opcion `-b -1`. La opcion (c) podria funcionar si el archivo rotado existe, pero no es el metodo estandar. La opcion (d) no es un comando valido.
</details>
