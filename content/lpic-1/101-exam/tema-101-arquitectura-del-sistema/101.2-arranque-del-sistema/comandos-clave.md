---
title: "Comandos Clave: Arranque del Sistema (101.2)"
tags:
  - lpic-1
  - examen-101
  - tema-101
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "101"
subtema: "101.2"
---

# Comandos Clave: Arranque del Sistema (101.2)

## Indice
1. [Comandos de diagnostico de arranque](#1-comandos-de-diagnostico-de-arranque)
2. [Comandos de GRUB2](#2-comandos-de-grub2)
3. [Comandos para initramfs/initrd](#3-comandos-para-initramfsinitrd)
4. [Archivos clave del sistema de arranque](#4-archivos-clave-del-sistema-de-arranque)
5. [Parametros del kernel en el arranque](#5-parametros-del-kernel-en-el-arranque)

---

## 1. Comandos de diagnostico de arranque

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `dmesg` | Muestra los mensajes del buffer del anillo del kernel | `dmesg \| less` |
| `dmesg -T` | Muestra mensajes del kernel con marcas de tiempo legibles | `dmesg -T \| grep -i error` |
| `dmesg -H` | Muestra mensajes en formato humano (colores y tiempo) | `dmesg -H` |
| `dmesg --level=err` | Filtra por nivel de severidad (emerg, alert, crit, err, warn, notice, info, debug) | `dmesg --level=err,warn` |
| `dmesg -w` | Sigue los mensajes del kernel en tiempo real | `dmesg -w` |
| `dmesg -c` | Muestra y limpia el buffer del kernel (requiere root) | `sudo dmesg -c` |
| `journalctl -b` | Muestra los logs del arranque actual (systemd) | `journalctl -b` |
| `journalctl -b -1` | Muestra los logs del arranque anterior | `journalctl -b -1` |
| `journalctl --list-boots` | Lista todos los arranques registrados | `journalctl --list-boots` |
| `journalctl -k` | Muestra solo mensajes del kernel (equivalente a dmesg) | `journalctl -k` |
| `journalctl -k -b` | Mensajes del kernel del arranque actual | `journalctl -k -b` |
| `journalctl -p err` | Filtra por prioridad (emerg, alert, crit, err, warning, notice, info, debug) | `journalctl -p err -b` |
| `journalctl -f` | Sigue los logs en tiempo real | `journalctl -f` |
| `journalctl -u servicio` | Logs de un servicio especifico | `journalctl -u sshd.service` |

---

## 2. Comandos de GRUB2

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `grub-install` | Instala GRUB2 en un dispositivo | `grub-install /dev/sda` |
| `grub-install --target=x86_64-efi` | Instala GRUB2 para sistemas UEFI | `grub-install --target=x86_64-efi --efi-directory=/boot/efi` |
| `grub-mkconfig` | Genera el archivo de configuracion de GRUB2 | `grub-mkconfig -o /boot/grub/grub.cfg` |
| `update-grub` | Atajo de Debian/Ubuntu para regenerar grub.cfg | `sudo update-grub` |

### Teclas en el menu de GRUB2

| Tecla | Funcion |
|-------|---------|
| `Shift` (mantener al arrancar) | Mostrar el menu de GRUB2 (en BIOS) |
| `Esc` | Mostrar el menu de GRUB2 (en UEFI) |
| `e` | Editar la entrada seleccionada |
| `c` | Abrir la consola de comandos de GRUB2 |
| `Ctrl+X` o `F10` | Arrancar con los parametros editados |

---

## 3. Comandos para initramfs/initrd

| Comando | Distribucion | Descripcion | Ejemplo |
|---------|-------------|-------------|---------|
| `mkinitramfs` | Debian/Ubuntu | Genera una imagen initramfs | `mkinitramfs -o /boot/initrd.img-$(uname -r) $(uname -r)` |
| `update-initramfs -u` | Debian/Ubuntu | Actualiza la imagen initramfs del kernel actual | `sudo update-initramfs -u` |
| `update-initramfs -c -k version` | Debian/Ubuntu | Crea una nueva imagen para un kernel especifico | `sudo update-initramfs -c -k 5.15.0-generic` |
| `mkinitrd` | Red Hat/CentOS (antiguo) | Genera una imagen initrd (herramienta antigua) | `mkinitrd /boot/initrd-$(uname -r).img $(uname -r)` |
| `dracut` | Red Hat/CentOS/Fedora | Genera una imagen initramfs (herramienta moderna) | `dracut /boot/initramfs-$(uname -r).img $(uname -r)` |
| `dracut --force` | Red Hat/CentOS/Fedora | Regenera la imagen sobrescribiendo la existente | `sudo dracut --force` |
| `lsinitramfs` | Debian/Ubuntu | Lista el contenido de una imagen initramfs | `lsinitramfs /boot/initrd.img-$(uname -r)` |
| `lsinitrd` | Red Hat/CentOS | Lista el contenido de una imagen initramfs | `lsinitrd /boot/initramfs-$(uname -r).img` |

---

## 4. Archivos clave del sistema de arranque

### Archivos de configuracion de GRUB2

| Archivo / Directorio | Descripcion | Editar manualmente |
|----------------------|-------------|-------------------|
| `/etc/default/grub` | Opciones por defecto de GRUB2 | **SI** - Archivo principal de configuracion |
| `/etc/grub.d/` | Scripts que generan secciones de grub.cfg | SI - Para entradas personalizadas |
| `/boot/grub/grub.cfg` | Archivo de configuracion final de GRUB2 | **NO** - Se genera automaticamente |
| `/boot/grub2/grub.cfg` | Mismo archivo en Red Hat/CentOS | **NO** - Se genera automaticamente |

### Archivos en /boot/

| Archivo | Descripcion |
|---------|-------------|
| `/boot/vmlinuz-*` | Imagen comprimida del kernel de Linux |
| `/boot/initrd.img-*` | Imagen initramfs/initrd (sistema de archivos raiz inicial) |
| `/boot/config-*` | Archivo de configuracion del kernel (opciones de compilacion) |
| `/boot/System.map-*` | Tabla de simbolos del kernel |

### Archivos de logs de arranque

| Archivo | Descripcion | Distribucion |
|---------|-------------|-------------|
| `/var/log/boot.log` | Mensajes del proceso de arranque | Varias (si esta habilitado) |
| `/var/log/messages` | Log general del sistema | Red Hat/CentOS/SUSE |
| `/var/log/syslog` | Log general del sistema | Debian/Ubuntu |
| `/var/log/dmesg` | Copia del buffer dmesg capturada al arrancar | Varias |
| `/var/log/kern.log` | Mensajes del kernel | Debian/Ubuntu |

### Particion ESP (UEFI)

| Ruta | Descripcion |
|------|-------------|
| `/boot/efi/` | Punto de montaje de la particion ESP |
| `/boot/efi/EFI/` | Directorio raiz de los archivos EFI |
| `/boot/efi/EFI/ubuntu/grubx64.efi` | Bootloader GRUB2 para Ubuntu (UEFI) |
| `/boot/efi/EFI/BOOT/BOOTX64.EFI` | Bootloader generico de respaldo |

---

## 5. Parametros del kernel en el arranque

### Parametros generales

| Parametro | Descripcion |
|-----------|-------------|
| `ro` | Monta la particion raiz como solo lectura (por defecto) |
| `rw` | Monta la particion raiz como lectura-escritura |
| `root=/dev/sda1` | Especifica el dispositivo de la particion raiz |
| `root=UUID=xxxx-xxxx` | Especifica la particion raiz por UUID |
| `init=/bin/bash` | Ejecuta bash como proceso init (acceso de emergencia) |
| `init=/sbin/init` | Especifica la ruta del proceso init |

### Parametros de modo de arranque

| Parametro | Descripcion |
|-----------|-------------|
| `single` o `s` o `1` | Arranca en modo monousuario (mantenimiento) |
| `emergency` | Modo de emergencia (minimo, solo root filesystem) |
| `systemd.unit=rescue.target` | Equivalente a single en systemd |
| `systemd.unit=emergency.target` | Modo de emergencia en systemd |
| `systemd.unit=multi-user.target` | Arranca en modo multiusuario sin entorno grafico |
| `systemd.unit=graphical.target` | Arranca con entorno grafico |

### Parametros de pantalla y depuracion

| Parametro | Descripcion |
|-----------|-------------|
| `quiet` | Suprime la mayoria de mensajes del kernel |
| `splash` | Muestra la pantalla grafica de arranque (Plymouth) |
| `vga=xxx` | Establece el modo de video del framebuffer |
| `nomodeset` | Desactiva KMS (util para problemas graficos) |
| `debug` | Activa los mensajes de depuracion del kernel |

### Parametros de hardware

| Parametro | Descripcion |
|-----------|-------------|
| `acpi=off` | Desactiva ACPI completamente |
| `noapic` | Desactiva el controlador APIC |
| `nolapic` | Desactiva el APIC local |
| `mem=512M` | Limita la memoria RAM utilizable |
| `maxcpus=1` | Limita el numero de CPUs disponibles |
| `pci=noacpi` | Desactiva el ruteo ACPI de PCI |

---

## Referencia rapida de flujo de trabajo

### Modificar parametros del kernel de forma permanente
```bash
sudo nano /etc/default/grub          # 1. Editar configuracion
sudo grub-mkconfig -o /boot/grub/grub.cfg  # 2. Regenerar grub.cfg
# o en Debian/Ubuntu:
sudo update-grub                      # 2. Alternativa
```

### Regenerar initramfs
```bash
# Debian/Ubuntu
sudo update-initramfs -u

# Red Hat/CentOS/Fedora
sudo dracut --force
```

### Diagnosticar problemas de arranque
```bash
dmesg | grep -i error                 # Buscar errores del kernel
journalctl -b -p err                  # Errores del arranque actual
journalctl -b -1                      # Logs del arranque anterior
cat /var/log/boot.log                 # Log de arranque (si existe)
```
