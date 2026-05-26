---
title: "102.2 - Instalar un gestor de arranque: Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.2"
---

# 102.2 - Instalar un gestor de arranque: Comandos clave

## Instalacion y configuracion de GRUB2

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `grub-install <disco>` | Instalar GRUB en el MBR del disco | `grub-install /dev/sda` |
| `grub-install --target=x86_64-efi` | Instalar GRUB para UEFI | `grub-install --target=x86_64-efi --efi-directory=/boot/efi` |
| `grub-mkconfig` | Generar configuracion (salida a stdout) | `grub-mkconfig` |
| `grub-mkconfig -o <archivo>` | Generar configuracion y guardar | `grub-mkconfig -o /boot/grub/grub.cfg` |
| `update-grub` | Regenerar grub.cfg (Debian/Ubuntu) | `update-grub` |

## Equivalentes en Red Hat/CentOS/Fedora

| Debian/Ubuntu | Red Hat/CentOS |
|---------------|---------------|
| `grub-install` | `grub2-install` |
| `grub-mkconfig` | `grub2-mkconfig` |
| `update-grub` | `grub2-mkconfig -o /boot/grub2/grub.cfg` |
| `/boot/grub/grub.cfg` | `/boot/grub2/grub.cfg` |

## Archivos de configuracion

| Archivo/Directorio | Funcion | Editar? |
|-------------------|---------|---------|
| `/boot/grub/grub.cfg` | Configuracion final de GRUB2 | **NO** (generado automaticamente) |
| `/etc/default/grub` | Variables de configuracion principal | **SI** |
| `/etc/grub.d/` | Scripts generadores de secciones | SI (con cuidado) |
| `/etc/grub.d/00_header` | Configuracion inicial | Normalmente no |
| `/etc/grub.d/10_linux` | Entradas de Linux | Normalmente no |
| `/etc/grub.d/30_os-prober` | Deteccion de otros SO | Desactivar con `chmod -x` |
| `/etc/grub.d/40_custom` | Entradas personalizadas | **SI** |

## Variables de /etc/default/grub

| Variable | Descripcion | Valores comunes |
|----------|-------------|-----------------|
| `GRUB_DEFAULT` | Entrada por defecto | `0`, `saved`, `"nombre"` |
| `GRUB_TIMEOUT` | Segundos de espera | `5`, `10`, `0`, `-1` (infinito) |
| `GRUB_TIMEOUT_STYLE` | Estilo del timeout | `menu`, `hidden`, `countdown` |
| `GRUB_CMDLINE_LINUX` | Parametros kernel (todas las entradas) | `"quiet splash"` |
| `GRUB_CMDLINE_LINUX_DEFAULT` | Parametros kernel (entrada por defecto) | `"quiet"` |
| `GRUB_DISABLE_RECOVERY` | Ocultar entradas de recuperacion | `"true"`, `"false"` |
| `GRUB_DISABLE_OS_PROBER` | Desactivar deteccion de otros SO | `true`, `false` |
| `GRUB_GFXMODE` | Resolucion grafica de GRUB | `1024x768`, `auto` |
| `GRUB_TERMINAL` | Tipo de terminal | `console`, `gfxterm` |

## Interaccion con el menu de GRUB

| Tecla | Accion |
|-------|--------|
| `Shift` (BIOS) / `Esc` (UEFI) | Mostrar menu oculto |
| `e` | Editar entrada seleccionada (temporal) |
| `c` | Abrir linea de comandos de GRUB |
| `Ctrl+X` o `F10` | Arrancar con los cambios editados |
| `Esc` | Volver al menu desde la edicion |

## Comandos en la linea de comandos de GRUB

| Comando GRUB | Descripcion |
|-------------|-------------|
| `ls` | Listar discos y particiones |
| `ls (hd0,1)/` | Listar contenido de una particion |
| `set root=(hd0,1)` | Establecer particion raiz |
| `linux /vmlinuz root=/dev/sda1` | Cargar kernel |
| `initrd /initrd.img` | Cargar initramfs |
| `boot` | Arrancar con la configuracion actual |
| `set` | Mostrar todas las variables |
| `set pager=1` | Activar paginacion |
| `insmod <modulo>` | Cargar un modulo de GRUB |

## Recuperacion de GRUB desde Live CD

```bash
mount /dev/sda2 /mnt                    # Montar raiz
mount --bind /dev /mnt/dev              # Montar /dev
mount --bind /proc /mnt/proc            # Montar /proc
mount --bind /sys /mnt/sys              # Montar /sys
chroot /mnt                             # Entrar en chroot
grub-install /dev/sda                   # Reinstalar GRUB
update-grub                             # Regenerar configuracion
exit                                    # Salir del chroot
umount -R /mnt                          # Desmontar todo
reboot                                  # Reiniciar
```

## Gestion de arranque UEFI

| Comando | Descripcion |
|---------|-------------|
| `efibootmgr` | Listar entradas de arranque UEFI |
| `efibootmgr -v` | Listar con detalles |
| `efibootmgr -o 0002,0001` | Cambiar orden de arranque |
| `efibootmgr -n 0002` | Siguiente arranque con entrada 0002 |

## Flujo de trabajo habitual

```bash
# 1. Editar configuracion
nano /etc/default/grub

# 2. Regenerar grub.cfg
update-grub                 # Debian/Ubuntu
# o
grub-mkconfig -o /boot/grub2/grub.cfg  # Red Hat

# 3. Verificar (opcional)
cat /boot/grub/grub.cfg | grep menuentry
```
