# Teoria: Arranque del Sistema (101.2)

## Indice
1. [La secuencia completa de arranque](#1-la-secuencia-completa-de-arranque)
2. [BIOS vs UEFI](#2-bios-vs-uefi)
3. [El cargador de arranque GRUB2](#3-el-cargador-de-arranque-grub2)
4. [Opciones del kernel en el arranque](#4-opciones-del-kernel-en-el-arranque)
5. [initramfs vs initrd](#5-initramfs-vs-initrd)
6. [El proceso init y systemd](#6-el-proceso-init-y-systemd)
7. [Registros de arranque](#7-registros-de-arranque)

---

## 1. La secuencia completa de arranque

El proceso de arranque de un sistema Linux sigue una secuencia bien definida. Es fundamental comprender cada etapa para el examen LPIC-1.

### Secuencia paso a paso

```
BIOS/UEFI -> POST -> MBR/GPT -> Bootloader (GRUB2) -> Kernel -> initramfs/initrd -> init/systemd -> runlevel/target
```

#### Paso 1: BIOS/UEFI
- Al encender el equipo, el firmware (BIOS o UEFI) toma el control.
- El firmware esta almacenado en un chip de memoria no volatil en la placa base.
- Su funcion principal es inicializar el hardware basico y localizar el dispositivo de arranque.

#### Paso 2: POST (Power-On Self-Test)
- El firmware ejecuta el POST, una serie de pruebas de diagnostico.
- Verifica la integridad de la CPU, la memoria RAM, los controladores de disco y otros dispositivos esenciales.
- Si el POST falla, el sistema emite pitidos o muestra codigos de error y se detiene.

#### Paso 3: MBR/GPT
- Tras el POST, el firmware busca el dispositivo de arranque configurado (disco duro, USB, red, etc.).
- **Con BIOS**: Lee los primeros 512 bytes del disco (MBR - Master Boot Record). El MBR contiene:
  - Codigo de arranque (446 bytes)
  - Tabla de particiones (64 bytes, maximo 4 particiones primarias)
  - Firma de arranque (2 bytes: 0x55AA)
- **Con UEFI**: Lee la particion ESP (EFI System Partition, formateada en FAT32) y busca archivos `.efi` en la ruta `/EFI/`.

#### Paso 4: Bootloader (GRUB2)
- El cargador de arranque se ejecuta y presenta un menu al usuario (si esta configurado).
- GRUB2 (GRand Unified Bootloader version 2) es el bootloader estandar en la mayoria de distribuciones modernas.
- Carga el kernel de Linux y el initramfs/initrd en memoria.
- Pasa parametros al kernel segun la configuracion.

#### Paso 5: Kernel
- El kernel se descomprime en memoria y toma el control del sistema.
- Inicializa los subsistemas del hardware: CPU, memoria, interrupciones, controladores basicos.
- Monta el sistema de archivos raiz temporal proporcionado por initramfs/initrd.

#### Paso 6: initramfs/initrd
- El kernel monta el sistema de archivos raiz inicial (initramfs o initrd) en memoria.
- Este sistema de archivos temporal contiene los modulos y herramientas necesarios para montar el sistema de archivos raiz real.
- Una vez montado el sistema de archivos raiz definitivo, el initramfs se descarta.

#### Paso 7: init/systemd
- El kernel ejecuta el primer proceso del espacio de usuario: **init** (PID 1).
- En sistemas modernos, este proceso es `systemd`. En sistemas mas antiguos puede ser SysVinit o Upstart.
- Este proceso es el padre de todos los demas procesos del sistema.

#### Paso 8: Runlevel/Target
- El sistema de init lleva al sistema al nivel de ejecucion (runlevel) o target configurado por defecto.
- Se inician los servicios del sistema: red, registro, cron, servidores, entorno grafico, etc.
- Finalmente se presenta la pantalla de inicio de sesion al usuario.

---

## 2. BIOS vs UEFI

### BIOS (Basic Input/Output System)

| Caracteristica | Detalle |
|----------------|---------|
| Antiguedad | Tecnologia de los anos 80 |
| Interfaz | Basada en texto, solo teclado |
| Esquema de particiones | MBR (Master Boot Record) |
| Limite de disco | Maximo 2 TB |
| Particiones primarias | Maximo 4 (o 3 primarias + 1 extendida) |
| Arranque | Lee los primeros 512 bytes del disco (MBR) |
| Modo del procesador | 16 bits (modo real) |
| Seguridad | Sin Secure Boot |

### UEFI (Unified Extensible Firmware Interface)

| Caracteristica | Detalle |
|----------------|---------|
| Antiguedad | Tecnologia moderna (reemplazo de BIOS) |
| Interfaz | Grafica, soporte de raton y teclado |
| Esquema de particiones | GPT (GUID Partition Table) |
| Limite de disco | Maximo 9.4 ZB (zettabytes) |
| Particiones primarias | Hasta 128 particiones |
| Arranque | Lee archivos `.efi` desde la particion ESP (FAT32) |
| Modo del procesador | 32 o 64 bits |
| Seguridad | Soporte de Secure Boot |

### Diferencias clave en el proceso de arranque

**Arranque con BIOS + MBR:**
```
1. BIOS lee el MBR (512 bytes del sector 0 del disco)
2. El codigo del MBR localiza la particion activa
3. Carga la primera etapa del bootloader (Stage 1)
4. Stage 1 carga Stage 1.5 (entre MBR y primera particion)
5. Stage 1.5 carga Stage 2 (GRUB2 completo desde /boot/grub/)
6. GRUB2 muestra el menu y carga el kernel
```

**Arranque con UEFI + GPT:**
```
1. UEFI lee la tabla GPT para encontrar la particion ESP
2. Ejecuta directamente el archivo .efi del bootloader desde ESP
3. Por ejemplo: /EFI/ubuntu/grubx64.efi
4. GRUB2 muestra el menu y carga el kernel
```

> **Nota para el examen:** UEFI no necesita las "etapas" intermedias de BIOS. Puede ejecutar directamente el cargador de arranque desde la particion ESP. Ademas, UEFI puede arrancar en modo de compatibilidad BIOS (CSM - Compatibility Support Module).

---

## 3. El cargador de arranque GRUB2

GRUB2 (GRand Unified Bootloader version 2) es el cargador de arranque estandar en la mayoria de distribuciones Linux modernas. Ha reemplazado a GRUB Legacy (version 0.97).

### Archivos de configuracion clave

| Archivo | Descripcion |
|---------|-------------|
| `/boot/grub/grub.cfg` | Archivo de configuracion principal de GRUB2. **NO se debe editar manualmente.** Se genera automaticamente. |
| `/etc/default/grub` | Archivo con las opciones por defecto de GRUB2. **Este es el archivo que se edita manualmente.** |
| `/etc/grub.d/` | Directorio con scripts que generan secciones del archivo `grub.cfg`. |

### Archivo /etc/default/grub

Este es el archivo principal que el administrador modifica. Parametros mas importantes:

```bash
# Entrada del menu que arranca por defecto (0 = primera entrada)
GRUB_DEFAULT=0

# Tiempo de espera del menu en segundos
GRUB_TIMEOUT=5

# Estilo del menu de espera (menu, countdown, hidden)
GRUB_TIMEOUT_STYLE=menu

# Linea de comandos del kernel (parametros adicionales)
GRUB_CMDLINE_LINUX=""

# Parametros solo para la entrada por defecto (no recovery)
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"

# Desactivar la generacion de entradas de recovery
GRUB_DISABLE_RECOVERY=false
```

### Scripts en /etc/grub.d/

Los scripts se ejecutan en orden numerico para generar `grub.cfg`:

| Script | Funcion |
|--------|---------|
| `00_header` | Genera la cabecera del archivo de configuracion |
| `05_debian_theme` | Configura el fondo y colores (Debian/Ubuntu) |
| `10_linux` | Genera las entradas para los kernels de Linux instalados |
| `20_linux_xen` | Entradas para Xen |
| `30_os-prober` | Detecta otros sistemas operativos (Windows, etc.) |
| `40_custom` | Entradas personalizadas del administrador |
| `41_custom` | Entradas personalizadas adicionales |

### Comandos de GRUB2

```bash
# Instalar GRUB2 en el MBR del disco
grub-install /dev/sda

# Instalar GRUB2 en la particion ESP (sistemas UEFI)
grub-install --target=x86_64-efi --efi-directory=/boot/efi

# Regenerar el archivo grub.cfg a partir de /etc/default/grub y /etc/grub.d/
grub-mkconfig -o /boot/grub/grub.cfg

# En Debian/Ubuntu existe un atajo equivalente
update-grub
# (equivale a: grub-mkconfig -o /boot/grub/grub.cfg)
```

> **Importante para el examen:** Siempre que se modifique `/etc/default/grub` o los scripts en `/etc/grub.d/`, es necesario ejecutar `grub-mkconfig` o `update-grub` para que los cambios surtan efecto.

### Menu interactivo de GRUB2

Al arrancar, si presionamos la tecla `Esc`, `Shift` (BIOS) o mantenemos `Shift` (UEFI), aparece el menu de GRUB2. Desde ahi:

- **`e`**: Editar la entrada seleccionada (modificar parametros del kernel temporalmente).
- **`c`**: Acceder a la consola de comandos de GRUB2.
- En la linea que empieza por `linux`, podemos modificar los parametros del kernel.

---

## 4. Opciones del kernel en el arranque

Los parametros del kernel se pasan a traves de la linea `linux` en GRUB2. Estos parametros modifican el comportamiento del arranque.

### Parametros mas comunes

| Parametro | Descripcion |
|-----------|-------------|
| `ro` | Monta el sistema de archivos raiz como solo lectura (por defecto durante el arranque) |
| `rw` | Monta el sistema de archivos raiz como lectura-escritura |
| `root=/dev/sda1` | Especifica la particion del sistema de archivos raiz |
| `root=UUID=xxxx` | Especifica la particion raiz por UUID (metodo preferido) |
| `init=/bin/bash` | Arranca directamente en un shell bash en lugar de init/systemd (rescate) |
| `init=/sbin/init` | Especifica el proceso init a ejecutar |
| `single` o `s` o `1` | Arranca en modo monousuario (rescate) |
| `quiet` | Suprime la mayoria de mensajes del kernel durante el arranque |
| `splash` | Muestra la pantalla grafica de arranque (Plymouth) |
| `vga=xxx` | Establece el modo de video (ej: vga=791 para 1024x768) |
| `nomodeset` | Desactiva KMS (Kernel Mode Setting), util para problemas graficos |
| `acpi=off` | Desactiva ACPI (gestion de energia) |
| `noapic` | Desactiva APIC (controlador de interrupciones) |
| `systemd.unit=rescue.target` | Arranca en el target de rescate de systemd |
| `systemd.unit=emergency.target` | Arranca en el target de emergencia de systemd |
| `mem=512M` | Limita la memoria RAM disponible |
| `maxcpus=1` | Limita el numero de CPUs |

### Como modificar parametros temporalmente

1. En el menu de GRUB2, seleccionar la entrada deseada.
2. Presionar `e` para editar.
3. Buscar la linea que comienza con `linux` o `linuxefi`.
4. Anadir o modificar parametros al final de esa linea.
5. Presionar `Ctrl+X` o `F10` para arrancar con los cambios.

> **Nota:** Estos cambios son temporales y solo afectan al arranque actual. Para cambios permanentes, editar `/etc/default/grub` y regenerar `grub.cfg`.

### Como modificar parametros permanentemente

```bash
# 1. Editar /etc/default/grub
sudo nano /etc/default/grub

# Modificar la linea GRUB_CMDLINE_LINUX o GRUB_CMDLINE_LINUX_DEFAULT
# Por ejemplo, para anadir "quiet splash":
# GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"

# 2. Regenerar grub.cfg
sudo grub-mkconfig -o /boot/grub/grub.cfg
# o en Debian/Ubuntu:
sudo update-grub
```

---

## 5. initramfs vs initrd

### Que son y para que sirven

Tanto `initramfs` como `initrd` son sistemas de archivos raiz iniciales que se cargan en memoria durante el arranque. Su proposito es proporcionar los modulos y herramientas necesarios para montar el sistema de archivos raiz real.

**Son necesarios cuando:**
- El sistema de archivos raiz esta en un dispositivo que requiere modulos especiales (RAID, LVM, cifrado LUKS).
- Los controladores del disco no estan compilados directamente en el kernel.
- Se necesita ejecutar scripts previos al montaje del sistema raiz.

### Diferencias entre initrd e initramfs

| Caracteristica | initrd | initramfs |
|----------------|--------|-----------|
| Nombre completo | Initial RAM Disk | Initial RAM Filesystem |
| Tipo | Imagen de disco comprimida | Archivo cpio comprimido |
| Montaje | Se monta como dispositivo de bloque | Se extrae directamente en ramfs/tmpfs |
| Tecnologia | Mas antigua | Moderna (desde kernel 2.6) |
| Eficiencia | Requiere un controlador de sistema de archivos | Mas eficiente, integrado en el kernel |
| Uso actual | Practicamente en desuso | Estandar en distribuciones modernas |

> **Para el examen:** Aunque tecnicamente son diferentes, los archivos en `/boot/` todavia suelen llamarse `initrd.img-*` por convencion historica, incluso cuando realmente son initramfs.

### Archivos en /boot/

```bash
# Archivos tipicos en /boot/
/boot/vmlinuz-5.15.0-generic       # Imagen del kernel comprimida
/boot/initrd.img-5.15.0-generic    # Imagen initramfs (nombre historico)
/boot/config-5.15.0-generic        # Configuracion del kernel
/boot/System.map-5.15.0-generic    # Tabla de simbolos del kernel
```

### Como generar initramfs/initrd

Dependiendo de la distribucion, se utilizan diferentes herramientas:

```bash
# En Debian/Ubuntu: mkinitramfs
sudo mkinitramfs -o /boot/initrd.img-$(uname -r) $(uname -r)

# En Red Hat/CentOS/Fedora (antiguo): mkinitrd
sudo mkinitrd /boot/initrd-$(uname -r).img $(uname -r)

# En Red Hat/CentOS/Fedora (moderno): dracut
sudo dracut /boot/initramfs-$(uname -r).img $(uname -r)

# Regenerar para el kernel actual con dracut
sudo dracut --force

# En Debian/Ubuntu, tambien se puede usar:
sudo update-initramfs -u    # Actualizar la imagen existente
sudo update-initramfs -c -k $(uname -r)  # Crear nueva imagen
```

| Distribucion | Herramienta | Ejemplo |
|-------------|-------------|---------|
| Debian/Ubuntu | `mkinitramfs`, `update-initramfs` | `mkinitramfs -o /boot/initrd.img-5.15.0 5.15.0` |
| Red Hat/CentOS (antiguo) | `mkinitrd` | `mkinitrd /boot/initrd-5.15.0.img 5.15.0` |
| Red Hat/CentOS/Fedora (moderno) | `dracut` | `dracut /boot/initramfs-5.15.0.img 5.15.0` |

---

## 6. El proceso init y systemd

Una vez que el kernel ha montado el initramfs y posteriormente el sistema de archivos raiz real, ejecuta el proceso init (PID 1). Este proceso es responsable de iniciar todos los demas servicios del sistema.

### Sistemas de inicio (init systems)

Linux ha utilizado tres sistemas de inicio principales a lo largo de su historia:

#### SysVinit (System V init)
- Sistema de inicio **clasico**, basado en Unix System V.
- Utiliza **runlevels** (niveles de ejecucion) numerados del 0 al 6.
- Los scripts de inicio estan en `/etc/init.d/`.
- Los enlaces simbolicos de cada runlevel estan en `/etc/rc.d/rc[0-6].d/` o `/etc/rc[0-6].d/`.
- La configuracion principal esta en `/etc/inittab`.
- Los servicios se inician **secuencialmente** (uno tras otro).

#### Upstart
- Desarrollado por **Canonical** para Ubuntu.
- Basado en **eventos** (event-driven).
- Podia iniciar servicios en paralelo.
- Archivos de configuracion en `/etc/init/` (archivos `.conf`).
- Compatible con scripts de SysVinit.
- **Ya no se utiliza** en distribuciones principales (Ubuntu migro a systemd en 15.04).

> **Para el examen:** Es importante saber que Upstart existio y fue usado por Ubuntu, pero actualmente systemd es el estandar.

#### systemd
- Sistema de inicio **moderno**, utilizado por la mayoria de distribuciones actuales.
- Utiliza **targets** en lugar de runlevels.
- Inicia servicios en **paralelo**, acelerando el arranque.
- Gestion de dependencias entre servicios.
- Archivos de configuracion llamados **units** (unidades) en `/lib/systemd/system/` y `/etc/systemd/system/`.
- Incluye herramientas de gestion de logs (`journalctl`), temporizadores, sockets y mas.

### Identificar el sistema de inicio

```bash
# Comprobar si el sistema usa systemd (PID 1)
ps -p 1 -o comm=
# Si muestra "systemd", el sistema usa systemd

# Tambien se puede verificar con:
ls -l /sbin/init
# En sistemas con systemd, /sbin/init es un enlace simbolico a /lib/systemd/systemd
```

---

## 7. Registros de arranque

Los registros (logs) de arranque son fundamentales para diagnosticar problemas. Existen varios metodos para consultarlos.

### El kernel ring buffer (buffer de anillo del kernel)

El **kernel ring buffer** es un buffer de tamano fijo de tipo circular que el kernel de Linux utiliza para almacenar sus mensajes de registro. Es fundamental entender su naturaleza:

- **Tamano fijo**: el buffer tiene un tamano predeterminado que se puede configurar con el parametro del kernel `log_buf_len`
- **Circular**: cuando el buffer se llena, los mensajes **mas antiguos se sobrescriben** automaticamente con los nuevos (de ahi el nombre "anillo")
- **Almacena mensajes del kernel**: desde el arranque del sistema, incluyendo deteccion de hardware, carga de modulos, errores del kernel, etc.
- **Volatil**: el contenido del ring buffer se pierde al reiniciar el sistema, a menos que se copie a un archivo de log

> **Para el examen:** Debido a que el ring buffer es circular y de tamano fijo, los mensajes de arranque se van perdiendo con el tiempo a medida que el sistema genera nuevos mensajes del kernel. Por eso es importante consultar `dmesg` poco despues del arranque si se necesita informacion del boot.

### dmesg

El comando `dmesg` muestra los mensajes del kernel ring buffer. Contiene los mensajes generados por el kernel durante el arranque y la deteccion de hardware.

```bash
# Ver todos los mensajes del kernel
dmesg

# Ver con paginacion
dmesg | less

# Ver solo mensajes de error
dmesg --level=err

# Ver mensajes de error y advertencia
dmesg --level=err,warn

# Ver mensajes con marca de tiempo legible
dmesg -T

# Ver mensajes en formato humano (colores y tiempo legible)
dmesg -H

# Limpiar el buffer (requiere root)
dmesg -c

# Seguir nuevos mensajes en tiempo real
dmesg -w
```

### journalctl

En sistemas con `systemd`, el demonio `systemd-journald` captura todos los logs del sistema, incluyendo los mensajes del kernel, los servicios y el proceso de arranque.

```bash
# Ver los logs del arranque actual
journalctl -b

# Ver los logs del arranque anterior
journalctl -b -1

# Ver los logs de dos arranques atras
journalctl -b -2

# Listar todos los arranques registrados
journalctl --list-boots

# Ver solo mensajes del kernel (equivalente a dmesg)
journalctl -k

# Ver mensajes del kernel del arranque actual
journalctl -k -b

# Ver logs de una unidad especifica
journalctl -u sshd.service

# Seguir nuevos logs en tiempo real
journalctl -f

# Ver logs con prioridad de error o superior
journalctl -p err
```

### Archivos de log tradicionales

Ademas de `dmesg` y `journalctl`, existen archivos de log en `/var/log/`:

| Archivo | Descripcion |
|---------|-------------|
| `/var/log/boot.log` | Mensajes del proceso de arranque del sistema: registra la salida de los scripts de inicio de servicios (start/stop). Presente principalmente en distribuciones basadas en Red Hat/CentOS y otras que usan `bootlogd`. Contiene informacion sobre que servicios se iniciaron correctamente o fallaron durante el arranque |
| `/var/log/messages` | Log general del sistema (Red Hat/CentOS/SUSE) |
| `/var/log/syslog` | Log general del sistema (Debian/Ubuntu) |
| `/var/log/dmesg` | Copia del buffer de dmesg capturada durante el arranque |
| `/var/log/kern.log` | Mensajes del kernel (Debian/Ubuntu) |

```bash
# Consultar el log de arranque
cat /var/log/boot.log

# Consultar mensajes del sistema
cat /var/log/messages       # Red Hat/CentOS
cat /var/log/syslog         # Debian/Ubuntu

# Consultar el archivo dmesg guardado
cat /var/log/dmesg
```

> **Para el examen:** Es importante saber que `/var/log/messages` se usa en Red Hat/CentOS y `/var/log/syslog` en Debian/Ubuntu. Ambos contienen mensajes generales del sistema, incluyendo informacion de arranque.

### Persistencia de logs en journalctl

Por defecto, en muchas distribuciones los logs de `journalctl` no son persistentes (se pierden al reiniciar). Para hacerlos persistentes:

```bash
# Crear el directorio de almacenamiento persistente
sudo mkdir -p /var/log/journal

# Reiniciar el servicio de journal
sudo systemctl restart systemd-journald
```

Tambien se puede configurar en `/etc/systemd/journald.conf`:
```ini
[Journal]
Storage=persistent
```

---

## Resumen para el examen

1. **Secuencia de arranque:** BIOS/UEFI -> POST -> MBR/GPT -> GRUB2 -> Kernel -> initramfs -> init/systemd -> target/runlevel.
2. **BIOS usa MBR** (limite 2 TB, 4 particiones). **UEFI usa GPT** (sin limites practicos, 128 particiones).
3. **GRUB2:** No editar `grub.cfg` directamente. Editar `/etc/default/grub` y ejecutar `grub-mkconfig` o `update-grub`.
4. **initramfs** es la tecnologia moderna; **initrd** es la antigua. Los archivos aun se llaman `initrd.img-*` por convencion.
5. **Generar initramfs:** `mkinitramfs` (Debian), `dracut` (Red Hat moderno), `mkinitrd` (Red Hat antiguo).
6. **Logs de arranque:** `dmesg` (buffer del kernel), `journalctl -b` (systemd), `/var/log/boot.log`, `/var/log/messages`.
7. **Sistemas de init:** SysVinit (clasico, secuencial), Upstart (Ubuntu antiguo, eventos), systemd (moderno, paralelo).
8. **Parametros del kernel:** `ro`, `root=`, `init=`, `single`, `quiet`, `splash`, `systemd.unit=`.
