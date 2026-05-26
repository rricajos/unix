---
title: "202.1 - Personalizacion del arranque"
tags: [lpic-2, examen-201, tema-202, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "202"
subtema: "202.1"
---

# 202.1 - Comandos clave: Personalizacion del arranque

## Comandos de GRUB 2

| Comando | Funcion | Ejemplo |
|---|---|---|
| `grub-mkconfig` | Genera el archivo grub.cfg | `grub-mkconfig -o /boot/grub/grub.cfg` |
| `grub2-mkconfig` | Variante RHEL/CentOS | `grub2-mkconfig -o /boot/grub2/grub.cfg` |
| `grub-install` | Instala GRUB en un dispositivo | `grub-install /dev/sda` |
| `grub-install --target=x86_64-efi` | Instala GRUB para UEFI | `grub-install --target=x86_64-efi --efi-directory=/boot/efi` |
| `update-grub` | Wrapper de grub-mkconfig (Debian) | `update-grub` |

## Comandos de systemd (targets y arranque)

| Comando | Funcion | Ejemplo |
|---|---|---|
| `systemctl get-default` | Muestra el target de arranque por defecto | `systemctl get-default` |
| `systemctl set-default` | Establece el target por defecto | `systemctl set-default multi-user.target` |
| `systemctl isolate` | Cambia al target indicado en caliente | `systemctl isolate rescue.target` |
| `systemctl list-dependencies` | Muestra dependencias de un target | `systemctl list-dependencies graphical.target` |
| `systemctl list-units --type=target` | Lista targets activos | `systemctl list-units --type=target` |

## Comandos de SysV init

| Comando | Funcion | Ejemplo |
|---|---|---|
| `runlevel` | Muestra runlevel anterior y actual | `runlevel` |
| `telinit` | Cambia el nivel de ejecucion | `telinit 3` |
| `init` | Cambia el nivel de ejecucion | `init 5` |

## Comandos de diagnostico de arranque

| Comando | Funcion | Ejemplo |
|---|---|---|
| `dmesg` | Muestra mensajes del buffer del kernel | `dmesg` |
| `dmesg -T` | Mensajes con timestamps legibles | `dmesg -T` |
| `dmesg --level=err` | Filtra por nivel de severidad | `dmesg --level=err,warn` |
| `dmesg -w` | Modo seguimiento en tiempo real | `dmesg -w` |
| `dmesg -C` | Limpia el buffer del anillo | `dmesg -C` |
| `journalctl -b` | Mensajes del arranque actual | `journalctl -b` |
| `journalctl -b -1` | Mensajes del arranque anterior | `journalctl -b -1` |
| `journalctl --list-boots` | Lista arranques registrados | `journalctl --list-boots` |
| `journalctl -k` | Solo mensajes del kernel | `journalctl -k` |
| `journalctl -b -p err` | Arranque actual, solo errores | `journalctl -b -p err` |

## Archivos de configuracion importantes

| Archivo | Funcion |
|---|---|
| `/etc/default/grub` | Variables de configuracion de GRUB 2 |
| `/etc/grub.d/` | Scripts generadores de grub.cfg |
| `/etc/grub.d/40_custom` | Entradas personalizadas de GRUB |
| `/boot/grub/grub.cfg` | Configuracion generada (no editar) |
| `/etc/inittab` | Runlevel por defecto en SysV init |
| `/etc/init.d/` | Scripts de servicios SysV |
| `/etc/systemd/journald.conf` | Configuracion de persistencia del journal |
| `/var/log/journal/` | Directorio de logs persistentes del journal |
| `/proc/cmdline` | Parametros del kernel en el arranque actual |

## Comparacion targets vs runlevels

| Target systemd | Runlevel | Descripcion |
|---|---|---|
| `poweroff.target` | 0 | Apagado |
| `rescue.target` | 1 | Usuario unico con servicios basicos |
| `multi-user.target` | 3 | Multiusuario sin GUI |
| `graphical.target` | 5 | Multiusuario con GUI |
| `reboot.target` | 6 | Reinicio |
| `emergency.target` | - | Minimo absoluto, raiz solo lectura |

## Parametros del kernel mas usados

| Parametro | Funcion |
|---|---|
| `init=/bin/bash` | Reemplaza init por shell bash |
| `root=/dev/sda1` | Define dispositivo raiz |
| `root=UUID=xxxx` | Define raiz por UUID |
| `ro` / `rw` | Solo lectura / lectura-escritura |
| `single` o `1` | Modo usuario unico |
| `quiet` | Suprime mensajes de arranque |
| `splash` | Pantalla grafica de carga |
| `nomodeset` | Desactiva KMS (modo grafico kernel) |
| `systemd.unit=rescue.target` | Arranca en modo rescate |
| `systemd.unit=emergency.target` | Arranca en modo emergencia |
| `rd.break` | Interrumpe en initramfs |
