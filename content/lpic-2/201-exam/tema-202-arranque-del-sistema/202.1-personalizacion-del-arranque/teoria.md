---
title: "202.1 - Personalizacion del arranque"
tags: [lpic-2, examen-201, tema-202, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "202"
subtema: "202.1"
---

# 202.1 - Personalizacion del arranque

## Introduccion

La personalizacion del proceso de arranque es una habilidad fundamental para cualquier administrador de sistemas Linux. Este subtema cubre la configuracion de GRUB 2 como cargador de arranque principal, la gestion de los objetivos de arranque en systemd, los niveles de ejecucion heredados de SysV init, y el analisis de los mensajes de arranque del sistema.

**Peso del subtema: 3**

## GRUB 2 - El cargador de arranque estandar

### Arquitectura de configuracion de GRUB 2

GRUB 2 (GRand Unified Bootloader version 2) utiliza una arquitectura de configuracion modular. A diferencia de GRUB Legacy, **nunca se debe editar directamente** el archivo principal de configuracion.

- **`/boot/grub/grub.cfg`** (o `/boot/grub2/grub.cfg` en RHEL/CentOS): Archivo de configuracion generado automaticamente. No editar manualmente.
- **`/etc/default/grub`**: Archivo principal de personalizacion del comportamiento de GRUB.
- **`/etc/grub.d/`**: Directorio con scripts que generan secciones del archivo `grub.cfg`.

> **Para el examen:** Recuerda que `grub.cfg` se genera automaticamente. Cualquier modificacion directa se perdera al ejecutar `grub-mkconfig`.

### El archivo /etc/default/grub

Este archivo contiene las variables principales que controlan el comportamiento de GRUB:

```bash
# Entrada predeterminada (por numero o nombre)
GRUB_DEFAULT=0

# Tiempo de espera en segundos antes de arrancar la entrada por defecto
GRUB_TIMEOUT=5

# Estilo del tiempo de espera: menu, countdown, hidden
GRUB_TIMEOUT_STYLE=menu

# Parametros del kernel para las entradas normales
GRUB_CMDLINE_LINUX="rhgb quiet"

# Parametros adicionales solo para la entrada por defecto
GRUB_CMDLINE_LINUX_DEFAULT="splash"

# Desactivar la recuperacion de entradas
GRUB_DISABLE_RECOVERY=false

# Resolucion de la terminal grafica
GRUB_GFXMODE=1024x768

# Terminal de salida
GRUB_TERMINAL_OUTPUT=console
```

| Variable | Funcion | Valor comun |
|---|---|---|
| `GRUB_DEFAULT` | Entrada de arranque por defecto | `0`, `saved` |
| `GRUB_TIMEOUT` | Tiempo de espera en segundos | `5` |
| `GRUB_TIMEOUT_STYLE` | Comportamiento del menu | `menu`, `hidden`, `countdown` |
| `GRUB_CMDLINE_LINUX` | Parametros kernel (todas las entradas) | `"quiet"` |
| `GRUB_CMDLINE_LINUX_DEFAULT` | Parametros kernel (solo defecto) | `"splash"` |
| `GRUB_DISABLE_RECOVERY` | Ocultar entradas de recuperacion | `true`, `false` |
| `GRUB_DISABLE_OS_PROBER` | No detectar otros SO | `true`, `false` |

### Directorio /etc/grub.d/

Los scripts en este directorio se ejecutan en orden numerico para generar `grub.cfg`:

| Script | Funcion |
|---|---|
| `00_header` | Configuracion general (timeout, defecto, etc.) |
| `05_debian_theme` | Tema visual (especifico de Debian/Ubuntu) |
| `10_linux` | Entradas para los kernels Linux instalados |
| `20_linux_xen` | Entradas para Xen |
| `30_os-prober` | Deteccion de otros sistemas operativos |
| `40_custom` | Entradas personalizadas del administrador |
| `41_custom` | Carga entradas desde archivo externo |

> **Para el examen:** Los scripts deben tener permisos de ejecucion para ser procesados por `grub-mkconfig`. Si necesitas desactivar un script, puedes retirarle el permiso de ejecucion con `chmod -x`.

### Comandos esenciales de GRUB 2

#### grub-mkconfig

Genera (o regenera) el archivo `grub.cfg`:

```bash
# Generar y mostrar la configuracion en stdout
grub-mkconfig

# Generar y escribir directamente al archivo de configuracion
grub-mkconfig -o /boot/grub/grub.cfg

# En sistemas RHEL/CentOS
grub2-mkconfig -o /boot/grub2/grub.cfg
```

#### grub-install

Instala los archivos de GRUB en el disco:

```bash
# Instalar GRUB en el MBR del disco sda
grub-install /dev/sda

# Instalar en un directorio especifico
grub-install --boot-directory=/mnt/boot /dev/sda

# Instalacion para UEFI
grub-install --target=x86_64-efi --efi-directory=/boot/efi
```

### Entradas personalizadas en GRUB

Se pueden agregar entradas en `/etc/grub.d/40_custom`:

```bash
#!/bin/sh
exec tail -n +3 $0

menuentry "Mi Linux personalizado" {
    set root=(hd0,msdos1)
    linux /vmlinuz root=/dev/sda1 ro quiet
    initrd /initrd.img
}

menuentry "Arrancar desde segundo disco" {
    set root=(hd1,gpt2)
    linux /boot/vmlinuz root=UUID=xxxx-xxxx ro
    initrd /boot/initrd.img
}
```

## Objetivos de arranque en systemd

### Concepto de targets

En systemd, los **targets** reemplazan a los niveles de ejecucion (runlevels) de SysV init. Un target es una unidad que agrupa otras unidades y define un estado del sistema.

| Target systemd | Runlevel SysV | Descripcion |
|---|---|---|
| `poweroff.target` | 0 | Apagado del sistema |
| `rescue.target` | 1 (S) | Modo de rescate (usuario unico) |
| `multi-user.target` | 2, 3, 4 | Multiusuario sin interfaz grafica |
| `graphical.target` | 5 | Multiusuario con interfaz grafica |
| `reboot.target` | 6 | Reinicio del sistema |
| `emergency.target` | - | Modo de emergencia (minimo) |

### Gestion de targets

```bash
# Ver el target actual
systemctl get-default

# Cambiar el target por defecto
systemctl set-default multi-user.target

# Cambiar al target en tiempo real (equivalente a cambiar runlevel)
systemctl isolate rescue.target

# Listar todas las unidades de un target
systemctl list-dependencies graphical.target
```

> **Para el examen:** `rescue.target` monta los sistemas de archivos y tiene servicios basicos activos, mientras que `emergency.target` solo monta el sistema de archivos raiz en modo solo lectura. Esta es una diferencia critica.

## Niveles de ejecucion SysV init

Aunque la mayoria de distribuciones modernas usan systemd, es importante conocer el sistema SysV init:

- **`/etc/inittab`**: Archivo principal de configuracion (define el runlevel por defecto)
- **`/etc/init.d/`**: Scripts de servicios
- **`/etc/rc0.d/` a `/etc/rc6.d/`**: Enlaces simbolicos a scripts organizados por runlevel

```bash
# Formato tipico de /etc/inittab
id:3:initdefault:

# Comandos de gestion de runlevels
runlevel          # Muestra el runlevel anterior y actual
telinit 3         # Cambia al runlevel 3
init 5            # Cambia al runlevel 5
```

Los enlaces en los directorios rcN.d siguen la convencion:
- **`S##nombre`**: Script de inicio (Start), ## indica el orden
- **`K##nombre`**: Script de parada (Kill), ## indica el orden

## Mensajes de arranque y diagnostico

### dmesg

El comando `dmesg` muestra los mensajes del buffer del anillo del kernel:

```bash
# Ver todos los mensajes del kernel
dmesg

# Filtrar por nivel de severidad
dmesg --level=err
dmesg --level=warn,err

# Seguimiento en tiempo real
dmesg -w

# Limpiar el buffer (requiere root)
dmesg -C

# Formato legible con marcas de tiempo
dmesg -T
```

### journalctl para mensajes de arranque

```bash
# Ver mensajes del arranque actual
journalctl -b

# Ver mensajes del arranque anterior
journalctl -b -1

# Listar arranques disponibles
journalctl --list-boots

# Filtrar por prioridad
journalctl -b -p err

# Ver solo mensajes del kernel (equivalente a dmesg)
journalctl -k
```

> **Para el examen:** Para que `journalctl --list-boots` funcione, el journal debe ser persistente. Esto requiere que exista el directorio `/var/log/journal/` o que `Storage=persistent` este configurado en `/etc/systemd/journald.conf`.

## Parametros del kernel en el arranque

Los parametros del kernel se pueden pasar desde GRUB editando la linea `linux` en el menu de arranque (tecla `e`) o permanentemente en `/etc/default/grub`.

### Parametros mas importantes

| Parametro | Funcion |
|---|---|
| `init=/bin/bash` | Reemplaza el proceso init por una shell |
| `init=/bin/sh` | Similar, usa sh en lugar de bash |
| `root=/dev/sda1` | Especifica el dispositivo raiz |
| `root=UUID=xxxx` | Especifica la raiz por UUID |
| `single` o `1` | Arranca en modo usuario unico |
| `ro` | Monta el sistema raiz en solo lectura |
| `rw` | Monta el sistema raiz en lectura/escritura |
| `quiet` | Suprime la mayoria de mensajes de arranque |
| `splash` | Muestra pantalla de carga grafica |
| `nomodeset` | Desactiva la configuracion de modo grafico del kernel |
| `systemd.unit=rescue.target` | Arranca directamente en modo rescate |
| `systemd.unit=emergency.target` | Arranca en modo emergencia |
| `rd.break` | Interrumpe el arranque durante initramfs |
| `mem=512M` | Limita la memoria disponible |

### Edicion temporal en GRUB

1. En el menu de GRUB, presionar `e` para editar la entrada seleccionada
2. Localizar la linea que comienza con `linux` o `linux16`
3. Agregar o modificar los parametros al final de la linea
4. Presionar `Ctrl+X` o `F10` para arrancar con los cambios

> **Para el examen:** Los cambios realizados editando la entrada de GRUB en tiempo de arranque son **temporales** y solo afectan al arranque actual. Para cambios permanentes, editar `/etc/default/grub` y ejecutar `grub-mkconfig`.

## Persistencia del journal de systemd

Para configurar la persistencia de los logs de arranque:

```bash
# Crear el directorio de journal persistente
mkdir -p /var/log/journal

# O configurar en journald.conf
# /etc/systemd/journald.conf
[Journal]
Storage=persistent
SystemMaxUse=500M

# Reiniciar el servicio
systemctl restart systemd-journald
```

Opciones de almacenamiento en `journald.conf`:
- **`volatile`**: Solo en memoria (`/run/log/journal/`)
- **`persistent`**: En disco (`/var/log/journal/`)
- **`auto`**: En disco si `/var/log/journal/` existe, sino en memoria
- **`none`**: Descarta todos los logs

## Resumen de archivos clave

| Archivo/Directorio | Funcion |
|---|---|
| `/etc/default/grub` | Configuracion principal de GRUB 2 |
| `/etc/grub.d/` | Scripts generadores de grub.cfg |
| `/boot/grub/grub.cfg` | Configuracion generada (no editar) |
| `/etc/inittab` | Configuracion SysV init |
| `/etc/init.d/` | Scripts de servicios SysV |
| `/etc/systemd/journald.conf` | Configuracion del journal |
| `/var/log/journal/` | Almacenamiento persistente del journal |
| `/proc/cmdline` | Parametros del kernel del arranque actual |
