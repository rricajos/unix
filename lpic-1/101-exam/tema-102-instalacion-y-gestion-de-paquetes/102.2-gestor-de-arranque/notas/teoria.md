# 102.2 - Instalar un gestor de arranque: Teoria

## Introduccion

El gestor de arranque (bootloader) es el primer software que se ejecuta al encender el ordenador (despues del firmware BIOS/UEFI). Su funcion principal es cargar el kernel del sistema operativo en memoria y transferirle el control. GRUB2 es el gestor de arranque estandar en la mayoria de distribuciones Linux modernas.

---

## 1. Proceso de arranque del sistema

### Secuencia en BIOS + MBR

```
1. BIOS ejecuta POST (Power-On Self-Test)
2. BIOS lee el MBR (primer sector, 512 bytes) del disco de arranque
3. El codigo del MBR (Stage 1 de GRUB) carga Stage 1.5
4. Stage 1.5 (en el gap post-MBR) carga Stage 2
5. Stage 2 muestra el menu de GRUB
6. Se carga el kernel y el initramfs
7. El kernel inicia el sistema (init/systemd)
```

### Secuencia en UEFI + GPT

```
1. UEFI ejecuta POST
2. UEFI lee la tabla de particiones GPT
3. UEFI busca el cargador .efi en la ESP (EFI System Partition)
4. Se ejecuta el cargador GRUB (grubx64.efi)
5. GRUB muestra el menu
6. Se carga el kernel y el initramfs
7. El kernel inicia el sistema (init/systemd)
```

---

## 2. GRUB2 (GRand Unified Bootloader version 2)

### Caracteristicas principales

- Soporte para multiples sistemas operativos (multiboot)
- Soporte para multiples sistemas de archivos (ext4, xfs, btrfs, FAT, NTFS, etc.)
- Interfaz grafica y de linea de comandos
- Carga modulos dinamicamente
- Soporte para BIOS y UEFI
- Configuracion basada en scripts

### Diferencias entre GRUB Legacy y GRUB2

| Caracteristica | GRUB Legacy | GRUB2 |
|---------------|-------------|-------|
| Archivo de configuracion | `menu.lst` o `grub.conf` | `grub.cfg` |
| Numeracion de particiones | Desde 0 (hd0,0) | Desde 1 (hd0,1) |
| Numeracion de discos | Desde 0 (hd0) | Desde 0 (hd0) |
| Configuracion | Edicion directa | Scripts en `/etc/grub.d/` |
| Modulos | Integrados | Carga dinamica |

---

## 3. Archivos de configuracion de GRUB2

### /boot/grub/grub.cfg (o /boot/grub2/grub.cfg)

- **Archivo principal de configuracion de GRUB2**
- **NUNCA se debe editar manualmente**
- Se genera automaticamente con `grub-mkconfig` o `update-grub`
- Contiene las entradas del menu, parametros del kernel, etc.
- Ubicacion:
  - Debian/Ubuntu: `/boot/grub/grub.cfg`
  - Red Hat/CentOS/Fedora: `/boot/grub2/grub.cfg`

### /etc/default/grub

Este es el archivo principal que el administrador debe editar para configurar GRUB2.

```bash
# Entrada por defecto del menu (0 = primera)
GRUB_DEFAULT=0

# Tiempo de espera en segundos antes de arrancar automaticamente
GRUB_TIMEOUT=5

# Estilo del timeout (menu, countdown, hidden)
GRUB_TIMEOUT_STYLE=menu

# Linea de comandos del kernel (parametros adicionales)
GRUB_CMDLINE_LINUX="quiet splash"

# Parametros adicionales solo para la entrada por defecto
GRUB_CMDLINE_LINUX_DEFAULT="quiet"

# Desactivar la recuperacion automatica de entradas
GRUB_DISABLE_RECOVERY="false"

# Activar la deteccion de otros sistemas operativos
GRUB_DISABLE_OS_PROBER=false

# Resolucion de la pantalla de GRUB
GRUB_GFXMODE=1024x768

# Terminal de salida
GRUB_TERMINAL=console
```

**Variables importantes para el examen:**

| Variable | Descripcion |
|----------|-------------|
| `GRUB_DEFAULT` | Entrada por defecto (numero, "saved", o nombre de entrada). Con "saved" recuerda la ultima entrada seleccionada |
| `GRUB_SAVEDEFAULT` | Si es "true", guarda la ultima entrada seleccionada (requiere `GRUB_DEFAULT=saved`) |
| `GRUB_TIMEOUT` | Segundos de espera del menu. Valor `-1` espera indefinidamente |
| `GRUB_TIMEOUT_STYLE` | `menu` (visible), `hidden` (oculto), `countdown` |
| `GRUB_CMDLINE_LINUX` | Parametros del kernel para **TODAS** las entradas (incluida recovery) |
| `GRUB_CMDLINE_LINUX_DEFAULT` | Parametros solo para la entrada por defecto (no recovery) |
| `GRUB_DISABLE_RECOVERY` | Si es "true", no muestra opciones de recuperacion |
| `GRUB_DISABLE_OS_PROBER` | Si es "true", no detecta otros SO |
| `GRUB_ENABLE_CRYPTODISK` | Si es "y", habilita soporte para arrancar desde discos cifrados con LUKS |

### /etc/grub.d/

Directorio que contiene scripts que generan las secciones de `grub.cfg`. Se ejecutan en orden numerico.

| Script | Funcion |
|--------|---------|
| `00_header` | Configuracion inicial (timeout, default, etc.) |
| `05_debian_theme` | Tema visual (especifico de Debian/Ubuntu) |
| `10_linux` | Entradas del kernel Linux instalado |
| `20_linux_xen` | Entradas para Xen |
| `30_os-prober` | Deteccion de otros sistemas operativos |
| `40_custom` | Entradas personalizadas del administrador |
| `41_custom` | Carga entradas desde archivo externo |

**Nota**: Solo se ejecutan los scripts que tienen permisos de ejecucion. Para desactivar un script, se le quitan los permisos: `chmod -x /etc/grub.d/30_os-prober`.

---

## 4. Comandos de GRUB2

### grub-install

Instala GRUB2 en el sector de arranque del disco (MBR o ESP).

```bash
# Instalar en MBR de un disco (BIOS)
grub-install /dev/sda

# Instalar para UEFI
grub-install --target=x86_64-efi --efi-directory=/boot/efi

# Instalar en un directorio especifico (rescate)
grub-install --boot-directory=/mnt/boot /dev/sda
```

**En Red Hat/CentOS**: `grub2-install`

### grub-mkconfig

Genera el archivo `grub.cfg` a partir de `/etc/default/grub` y los scripts de `/etc/grub.d/`.

```bash
# Generar y mostrar en pantalla
grub-mkconfig

# Generar y guardar en el archivo de configuracion
grub-mkconfig -o /boot/grub/grub.cfg
```

**En Red Hat/CentOS**: `grub2-mkconfig -o /boot/grub2/grub.cfg`

### update-grub

Comando simplificado disponible en **Debian/Ubuntu** que equivale a:

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

Es un wrapper que facilita la regeneracion de la configuracion.

**Importante**: Despues de cualquier cambio en `/etc/default/grub` o en `/etc/grub.d/`, se debe ejecutar `update-grub` o `grub-mkconfig -o ...` para que los cambios surtan efecto.

---

## 5. Interaccion con el menu de GRUB al arranque

### Mostrar el menu de GRUB (si esta oculto)

Si `GRUB_TIMEOUT_STYLE=hidden` esta configurado, el menu de GRUB no se muestra por defecto. Para forzar su aparicion:

- **Mantener pulsada la tecla `Shift`** durante el arranque (en sistemas con BIOS)
- **Pulsar `Esc`** durante el arranque (en sistemas con UEFI)

> **Para el examen:** La tecla `Shift` (mantenida) es la forma de mostrar un menu de GRUB oculto en sistemas BIOS. En UEFI se usa `Esc`.

### Teclas de acceso en el menu

| Tecla | Funcion |
|-------|---------|
| **`e`** | Editar la entrada seleccionada del menu (cambios temporales) |
| **`c`** | Acceder a la consola de comandos de GRUB (shell `grub>`) |
| **`Ctrl+X`** o **`F10`** | Arrancar con los cambios editados |
| **`Esc`** | Cancelar la edicion y volver al menu |

### Editar entradas al arranque (tecla `e`)

Al pulsar `e` sobre una entrada del menu, se puede modificar temporalmente la linea del kernel. Usos comunes:

- **Arrancar en modo single/rescue**: Anadir `single`, `1`, o `systemd.unit=rescue.target` al final de la linea `linux`
- **Cambiar la contrasena de root**: Anadir `init=/bin/bash` al final de la linea `linux`
- **Desactivar el modo grafico**: Eliminar `quiet splash`

Despues de editar, se pulsa **Ctrl+X** o **F10** para arrancar con los cambios.

**Los cambios realizados con `e` son temporales** y se pierden en el siguiente reinicio.

### Consola de GRUB2 (shell `grub>`)

Al pulsar `c` en el menu, se accede a la consola completa de GRUB2. Esta consola permite arrancar manualmente el sistema:

```
grub> ls                                # Listar discos y particiones disponibles
grub> ls (hd0,1)/                       # Listar contenido de una particion
grub> set root=(hd0,1)                  # Establecer la particion que contiene /boot
grub> linux /vmlinuz root=/dev/sda1     # Cargar el kernel especificando la particion raiz
grub> initrd /initrd.img                # Cargar la imagen initramfs
grub> boot                               # Arrancar el sistema con lo configurado
```

**Otros comandos utiles en la consola `grub>`:**
```
grub> set                               # Ver todas las variables configuradas
grub> set root=(hd0,msdos1)            # Establecer particion (formato MBR)
grub> set root=(hd0,gpt2)             # Establecer particion (formato GPT)
grub> cat (hd0,1)/etc/hostname          # Leer un archivo desde una particion
grub> configfile (hd0,1)/boot/grub/grub.cfg   # Cargar un archivo de configuracion
```

---

## 6. Recuperacion desde GRUB

### Escenario: GRUB muestra "grub rescue>"

El prompt `grub rescue>` aparece cuando GRUB no puede encontrar sus archivos de configuracion o modulos (por ejemplo, tras redimensionar particiones o eliminar archivos de `/boot/grub/`). En este modo, solo hay disponibles unos pocos comandos basicos.

**Pasos de recuperacion desde `grub rescue>`:**

```
grub rescue> ls                             # Ver particiones disponibles
grub rescue> ls (hd0,1)/boot/grub           # Buscar archivos de GRUB en cada particion
grub rescue> set prefix=(hd0,1)/boot/grub   # Establecer la ubicacion de los modulos de GRUB
grub rescue> set root=(hd0,1)               # Establecer la particion raiz
grub rescue> insmod normal                  # Cargar el modulo 'normal' de GRUB
grub rescue> insmod linux                   # Cargar el modulo 'linux' (si es necesario)
grub rescue> normal                         # Iniciar el modo normal de GRUB (muestra el menu)
```

**Diferencia entre `grub>` y `grub rescue>`:**

| Prompt | Situacion | Comandos disponibles |
|--------|-----------|---------------------|
| `grub>` | GRUB cargo sus modulos pero no encontro `grub.cfg` o se presiono `c` | Todos los comandos: `ls`, `set`, `linux`, `initrd`, `boot`, `insmod`, etc. |
| `grub rescue>` | GRUB no puede encontrar sus propios modulos | Solo comandos basicos: `ls`, `set`, `insmod`, `unset` |

> **Para el examen:** En `grub rescue>`, la clave es usar `set prefix=` para indicar donde estan los modulos de GRUB, luego `insmod normal` para cargar el modulo normal y finalmente ejecutar `normal` para volver al menu estandar.

### Escenario: Reinstalar GRUB desde un Live CD

```bash
# 1. Montar la particion raiz
mount /dev/sda2 /mnt

# 2. Montar particiones necesarias
mount --bind /dev /mnt/dev
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys

# 3. Entrar en el entorno chroot
chroot /mnt

# 4. Reinstalar GRUB
grub-install /dev/sda
update-grub

# 5. Salir y reiniciar
exit
umount -R /mnt
reboot
```

---

## 7. GRUB Legacy (version 0.97)

Aunque GRUB Legacy esta obsoleto, el examen puede incluir preguntas sobre sus diferencias con GRUB2.

### Archivo de configuracion

- **Ubicacion**: `/boot/grub/menu.lst` (Debian/Ubuntu) o `/boot/grub/grub.conf` (Red Hat/CentOS)
- A diferencia de GRUB2, el archivo de configuracion de GRUB Legacy **se edita directamente**
- No existe un equivalente a `grub-mkconfig` o `update-grub`

### Numeracion

- **Discos** se numeran desde **0**: `hd0` = primer disco, `hd1` = segundo disco
- **Particiones** se numeran desde **0**: `(hd0,0)` = primera particion del primer disco
- Esto contrasta con GRUB2, donde las particiones se numeran desde **1**: `(hd0,1)`

### Sintaxis del archivo de configuracion

```
# Opciones globales
default 0                              # Entrada por defecto (primera = 0)
timeout 10                             # Tiempo de espera en segundos
splashimage=(hd0,0)/grub/splash.xpm.gz # Imagen de fondo

# Primera entrada del menu
title Linux CentOS                     # Titulo mostrado en el menu
  root (hd0,0)                         # Particion que contiene /boot
  kernel /vmlinuz root=/dev/sda1 ro quiet   # Kernel y sus parametros
  initrd /initrd.img                   # Imagen initramfs

# Segunda entrada (otro SO)
title Windows XP
  rootnoverify (hd0,1)                # Particion de Windows (sin verificar FS)
  chainloader +1                       # Cargar el bootloader de esa particion
```

**Directivas principales de GRUB Legacy:**

| Directiva | Descripcion |
|-----------|-------------|
| `default` | Numero de la entrada por defecto (base 0) |
| `timeout` | Tiempo de espera del menu en segundos |
| `title` | Titulo de la entrada del menu |
| `root` | Particion que contiene los archivos de arranque |
| `kernel` | Ruta al kernel y sus parametros |
| `initrd` | Ruta a la imagen initramfs/initrd |
| `rootnoverify` | Establecer particion raiz sin intentar montarla |
| `chainloader +1` | Cargar el primer sector de la particion (para Windows) |

---

## 8. Arranque con UEFI

### Componentes

- **ESP (EFI System Partition)**: Particion FAT32 que contiene los cargadores .efi
- **Cargador GRUB UEFI**: `/boot/efi/EFI/<distro>/grubx64.efi`
- **Variables UEFI**: El firmware almacena el orden de arranque en NVRAM

### efibootmgr

Herramienta para gestionar las entradas de arranque UEFI:

```bash
# Listar entradas de arranque
efibootmgr -v

# Cambiar orden de arranque
efibootmgr -o 0002,0001,0003

# Establecer arranque para el proximo reinicio
efibootmgr -n 0002
```

---

## Resumen para el examen

1. **NUNCA editar** `/boot/grub/grub.cfg` directamente. Editar `/etc/default/grub` y ejecutar `update-grub` o `grub-mkconfig`.
2. `/etc/grub.d/` contiene scripts que generan secciones de grub.cfg, ejecutados en orden numerico.
3. `grub-install` instala GRUB en el disco; `grub-mkconfig` / `update-grub` genera la configuracion.
4. En el menu de GRUB: `e` edita (temporal), `c` abre linea de comandos, Ctrl+X arranca.
5. GRUB2 numera particiones desde 1 (hd0,1); GRUB Legacy desde 0 (hd0,0).
6. `GRUB_TIMEOUT`, `GRUB_DEFAULT`, y `GRUB_CMDLINE_LINUX` son las variables mas importantes.
7. En Red Hat los comandos llevan prefijo `grub2-` (grub2-install, grub2-mkconfig).
