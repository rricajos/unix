# 101.1 - Configuracion de Hardware

## Conceptos fundamentales

### BIOS y UEFI

**BIOS (Basic Input/Output System)**:
- Firmware tradicional almacenado en chip de la placa base
- Interfaz de texto, limitado a discos de 2TB (MBR)
- Proceso de arranque: POST -> buscar MBR -> cargar bootloader

**UEFI (Unified Extensible Firmware Interface)**:
- Reemplazo moderno de BIOS
- Soporta discos GPT (mas de 2TB)
- Interfaz grafica, arranque mas rapido
- Requiere particion ESP (EFI System Partition) en `/boot/efi`
- Secure Boot: verifica firmas digitales del bootloader

### Coldplug vs Hotplug

Es fundamental distinguir entre dos tipos de deteccion de dispositivos:

**Coldplug (deteccion en frio)**:
- Dispositivos que estan **presentes al momento del encendido** de la maquina
- Se detectan durante el proceso de arranque del sistema
- Ejemplos: CPU, RAM, tarjeta grafica integrada, disco duro interno, controladores de la placa base
- Udev se encarga de identificar y configurar estos dispositivos durante el boot

**Hotplug (deteccion en caliente)**:
- Dispositivos que se **conectan o desconectan mientras el sistema esta en funcionamiento**
- El kernel Linux soporta hotplug desde la version 2.6
- La mayoria de buses del sistema (PCI, USB, etc.) pueden activar eventos hotplug
- Ejemplos: memorias USB, discos externos, teclados USB, adaptadores de red WiFi
- El kernel captura el evento de deteccion y lo pasa al proceso udev, que crea dinamicamente los archivos correspondientes en `/dev`

> **Para el examen:** En distribuciones actuales de Linux, udev es responsable tanto de la deteccion coldplug (durante el encendido) como de la deteccion hotplug (con el sistema en funcionamiento).

### Activacion y desactivacion de hardware en BIOS/UEFI

Desde la utilidad de configuracion del firmware (BIOS o UEFI) es posible:

- **Habilitar y deshabilitar perifericos integrados**: controladores de red, audio, puertos USB, puertos serie, etc.
- **Activar proteccion basica contra errores** y cambiar configuraciones de hardware como IRQ y DMA
- **Ajustar velocidades de la RAM**: algunas tecnologias RAM soportan velocidades de transferencia mas rapidas que los valores predeterminados; se recomienda configurar los valores especificados por el fabricante
- **Habilitar/deshabilitar caracteristicas de la CPU**: funciones no necesarias pueden desactivarse para reducir el consumo de energia o evitar errores conocidos (ej: Intel VT-x, Hyper-Threading)
- **Definir el orden de arranque**: establecer que dispositivo de almacenamiento tiene el gestor de arranque correcto y debe ser el primero en la secuencia de arranque
- **Configurar Secure Boot** (solo UEFI): habilitar o deshabilitar la verificacion de firmas digitales del cargador de arranque

La tecla para acceder a la configuracion varia segun el fabricante, pero generalmente es `Del`, `F2` o `F12`. La combinacion suele mostrarse brevemente en pantalla al encender la maquina.

> **Para el examen:** Las funciones deshabilitadas en BIOS/UEFI reducen el consumo de energia y pueden aumentar la proteccion del sistema. Si el dispositivo incorrecto aparece primero en la lista de arranque, el sistema operativo puede no cargarse.

### El directorio /sys (sysfs)

Sistema de archivos virtual montado en `/sys`. Expone informacion sobre dispositivos y drivers del kernel. Udev se basa en sysfs para obtener la informacion de los dispositivos.

```bash
# Estructura principal
/sys/
├── block/        # Dispositivos de bloque (sda, sdb...)
├── bus/          # Buses del sistema (pci, usb, scsi...)
├── class/        # Clases de dispositivos (net, input, sound...)
├── devices/      # Arbol completo de dispositivos
├── firmware/     # Interfaces de firmware (acpi, efi...)
├── module/       # Modulos del kernel cargados
└── power/        # Estados de energia del sistema
```

#### Jerarquia detallada de /sys

**`/sys/bus/`**: Contiene un subdirectorio por cada tipo de bus del sistema (pci, usb, scsi, i2c, etc.). Dentro de cada bus hay dos subdirectorios:
- `devices/`: enlaces simbolicos a los dispositivos conectados a ese bus
- `drivers/`: controladores registrados para ese tipo de bus

```bash
/sys/bus/
├── pci/
│   ├── devices/     # Enlaces a dispositivos PCI detectados
│   └── drivers/     # Controladores PCI cargados
├── usb/
│   ├── devices/     # Enlaces a dispositivos USB detectados
│   └── drivers/     # Controladores USB cargados
└── scsi/
    ├── devices/
    └── drivers/
```

**`/sys/class/`**: Agrupa los dispositivos por su **funcion** (clase), independientemente del bus al que esten conectados. Cada subdirectorio contiene enlaces simbolicos a los dispositivos de esa clase.

```bash
/sys/class/
├── net/          # Interfaces de red (eth0, wlan0, lo...)
├── input/        # Dispositivos de entrada (mouse, teclado...)
├── sound/        # Dispositivos de sonido
├── block/        # Dispositivos de bloque
├── tty/          # Terminales y puertos serie
└── scsi_host/    # Controladores SCSI
```

**`/sys/devices/`**: Contiene el **arbol completo** de todos los dispositivos del sistema, organizados jerarquicamente segun su conexion fisica real. Es la ubicacion canonica de los dispositivos; los enlaces en `/sys/bus/` y `/sys/class/` apuntan aqui.

```bash
# Ejemplo: ver informacion de un dispositivo de red
ls /sys/class/net/eth0/
# -> address, carrier, speed, operstate, statistics/, ...

# Leer la direccion MAC de una interfaz
cat /sys/class/net/eth0/address
```

> **Para el examen:** `/sys/bus/` organiza por tipo de bus, `/sys/class/` organiza por funcion del dispositivo, y `/sys/devices/` es el arbol fisico real. Los dos primeros contienen enlaces simbolicos que apuntan al tercero.

### El directorio /proc (procfs)

Sistema de archivos virtual montado en `/proc`. Expone informacion del kernel y procesos.

```bash
# Archivos importantes de hardware
/proc/cpuinfo       # Informacion del procesador
/proc/meminfo       # Informacion de la memoria
/proc/ioports       # Puertos de E/S asignados
/proc/interrupts    # Interrupciones (IRQs) del sistema
/proc/dma           # Canales DMA en uso
/proc/pci           # Dispositivos PCI (obsoleto, usar lspci)
/proc/scsi/         # Dispositivos SCSI
/proc/bus/usb/      # Dispositivos USB (obsoleto, usar lsusb)
```

### El directorio /dev (devfs/udev)

Contiene archivos de dispositivo (device nodes) que representan hardware.

```bash
# Dispositivos comunes
/dev/sda          # Primer disco SATA/SCSI
/dev/sda1         # Primera particion del primer disco
/dev/nvme0n1      # Primer disco NVMe
/dev/sr0          # Primer CD/DVD
/dev/tty*         # Terminales
/dev/null         # Descarta todo lo que se escribe
/dev/zero         # Genera bytes nulos
/dev/random       # Generador de numeros aleatorios (bloqueante)
/dev/urandom      # Generador de numeros aleatorios (no bloqueante)
```

### Udev - Gestor de dispositivos

**udev** es el gestor de dispositivos del kernel Linux. Se encarga de:
- Crear/eliminar archivos en `/dev` dinamicamente
- Asignar nombres consistentes a dispositivos
- Ejecutar acciones al conectar/desconectar hardware

```bash
# Archivos de configuracion
/etc/udev/rules.d/      # Reglas personalizadas
/lib/udev/rules.d/      # Reglas del sistema

# Formato de reglas udev
# KERNEL=="sdb", SUBSYSTEM=="block", SYMLINK+="mi_disco"
```

Comandos de udev:
```bash
udevadm info /dev/sda          # Informacion de un dispositivo
udevadm monitor                # Monitorizar eventos en tiempo real
udevadm trigger                # Forzar re-evaluacion de reglas
```

### D-Bus (Desktop Bus)

Sistema de comunicacion entre procesos (IPC) que permite a las aplicaciones comunicarse entre si y con servicios del sistema.

- **System bus**: comunicacion con servicios del sistema (udev, NetworkManager)
- **Session bus**: comunicacion entre aplicaciones del usuario

### IRQ, DMA y puertos de E/S

**IRQ (Interrupt Request)**:
- Senales que envian los dispositivos al procesador para solicitar atencion
- Ver asignaciones: `cat /proc/interrupts`

**DMA (Direct Memory Access)**:
- Permite a los dispositivos acceder directamente a la memoria RAM sin pasar por la CPU
- Ver canales: `cat /proc/dma`

**Puertos de E/S (I/O Ports)**:
- Direcciones de comunicacion entre CPU y dispositivos
- Ver asignaciones: `cat /proc/ioports`

### Modulos del kernel

Los modulos son piezas de codigo que se pueden cargar y descargar del kernel en tiempo de ejecucion, sin reiniciar.

```bash
# Ubicacion de los modulos
/lib/modules/$(uname -r)/

# Archivo de configuracion de modulos
/etc/modules            # Modulos a cargar en el arranque (Debian)
/etc/modules-load.d/    # Directorio de configuracion (systemd)
/etc/modprobe.d/        # Opciones y blacklists de modulos
```

## Comandos importantes

### lspci
Muestra dispositivos conectados al bus PCI.

```bash
lspci                  # Lista basica
lspci -v               # Informacion detallada
lspci -vv              # Muy detallada
lspci -s 00:02.0       # Dispositivo especifico (dominio:bus:slot.func)
lspci -k               # Mostrar modulos del kernel asociados
lspci -nn              # Mostrar IDs numericos del vendor y dispositivo
```

### lsusb
Muestra dispositivos USB conectados.

```bash
lsusb                  # Lista basica
lsusb -v               # Informacion detallada
lsusb -t               # Arbol jerarquico
lsusb -s 001:002       # Dispositivo especifico (bus:device)
```

### lsmod
Muestra modulos del kernel cargados actualmente.

```bash
lsmod                  # Lista de modulos con tamano y dependencias
# Salida: Module - Size - Used by
```

### modinfo
Muestra informacion sobre un modulo del kernel.

```bash
modinfo ext4           # Informacion del modulo ext4
modinfo -p ext4        # Solo parametros del modulo
```

### modprobe
Carga o descarga modulos del kernel (gestiona dependencias automaticamente).

```bash
modprobe ext4          # Cargar modulo (con dependencias)
modprobe -r ext4       # Descargar modulo (con dependencias)
modprobe -n ext4       # Simular (dry run)
modprobe --show-depends ext4   # Mostrar dependencias
```

### insmod / rmmod
Carga/descarga modulos sin gestion de dependencias (bajo nivel).

```bash
insmod /lib/modules/.../ext4.ko    # Cargar modulo (ruta completa)
rmmod ext4                          # Descargar modulo
```

### lsblk
Lista dispositivos de bloque.

```bash
lsblk                 # Lista en arbol
lsblk -f              # Mostrar sistema de archivos
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT   # Columnas especificas
```

### lscpu
Muestra informacion de la CPU.

```bash
lscpu                  # Informacion completa del procesador
```

### lsdev
Lista dispositivos de hardware con sus recursos (IRQ, DMA, puertos).

```bash
lsdev                  # Requiere paquete procinfo
```

## Archivos clave para el examen

| Archivo/Directorio | Proposito |
|---------------------|-----------|
| `/proc/cpuinfo` | Informacion del procesador |
| `/proc/meminfo` | Informacion de la memoria |
| `/proc/interrupts` | IRQs del sistema |
| `/proc/ioports` | Puertos de E/S |
| `/proc/dma` | Canales DMA |
| `/sys/` | Informacion de dispositivos (sysfs) |
| `/dev/` | Archivos de dispositivo |
| `/etc/udev/rules.d/` | Reglas personalizadas de udev |
| `/lib/modules/` | Modulos del kernel |
| `/etc/modprobe.d/` | Configuracion de modulos |
