---
title: "351.2 - Xen"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.2"
peso: 3
tags:
  - lpic-3
  - tema-351
  - xen
  - hypervisor
  - dom0
  - domu
---

# 351.2 Xen

## Introducción

Xen es un hipervisor de Tipo 1 (bare-metal) de código abierto que se ejecuta directamente sobre el hardware. Es uno de los hipervisores más maduros del ecosistema Linux y es la base de muchas plataformas cloud como Amazon AWS (históricamente).

## Arquitectura de Xen

```
┌────────┐ ┌────────┐ ┌────────┐
│ Dom0   │ │ DomU 1 │ │ DomU 2 │
│(Priv.) │ │(Guest) │ │(Guest) │
├────────┴─┴────────┴─┴────────┤
│       Xen Hypervisor          │
├───────────────────────────────┤
│       Hardware Físico         │
└───────────────────────────────┘
```

### Componentes principales

| Componente | Descripción |
|---|---|
| **Xen Hypervisor** | Capa mínima que se ejecuta directamente sobre el hardware. Gestiona CPU, memoria y scheduling. |
| **Dom0** (Domain 0) | Dominio privilegiado que arranca primero. Tiene acceso directo al hardware y ejecuta los drivers. Gestiona los DomU. |
| **DomU** (Domain U) | Dominios no privilegiados (las máquinas virtuales de usuario). |

> **Para el examen:** Dom0 es esencial para el funcionamiento de Xen. Sin Dom0, no se pueden gestionar los guests. Dom0 tiene privilegios especiales para acceder al hardware y al hipervisor.

## Tipos de Guests en Xen

### PV (Paravirtualizado)

- El kernel del guest está modificado para comunicarse con el hipervisor mediante **hypercalls**.
- No requiere extensiones de hardware (VT-x/AMD-V).
- Mejor rendimiento en operaciones de E/S.
- Solo soporta kernels Linux modificados (u otros SO compatibles).

### HVM (Hardware Virtual Machine)

- Virtualización completa asistida por hardware.
- Requiere VT-x o AMD-V.
- Soporta cualquier SO sin modificar (Windows, Linux, etc.).
- Usa QEMU para emulación de dispositivos.

### PVH (PV in HVM container)

- Modo híbrido: usa extensiones de hardware para la CPU pero drivers PV para E/S.
- Combina las ventajas de ambos modos.
- Es el modo recomendado en versiones recientes de Xen.

| Característica | PV | HVM | PVH |
|---|---|---|---|
| VT-x/AMD-V requerido | No | Sí | Sí |
| Kernel modificado | Sí | No | No |
| Rendimiento CPU | Bueno | Bueno | Excelente |
| Rendimiento E/S | Excelente | Depende | Excelente |
| Windows soportado | No | Sí | No |

> **Para el examen:** PVH es el modo preferido en Xen moderno. Combina el rendimiento de PV para E/S con la compatibilidad de HVM para CPU.

## Herramientas de Gestión: xl y xm

`xl` es la herramienta principal de gestión de dominios en Xen actual (reemplazó a `xm` que dependía de xend).

### Gestión de Dominios

```bash
# Crear y arrancar un dominio desde archivo de configuración
xl create /etc/xen/mi-vm.cfg

# Listar dominios activos
xl list

# Información detallada de un dominio
xl info

# Pausar un dominio
xl pause mi-vm

# Reanudar un dominio pausado
xl unpause mi-vm

# Apagado ordenado (envía señal ACPI)
xl shutdown mi-vm

# Apagado forzado (inmediato)
xl destroy mi-vm

# Reiniciar un dominio
xl reboot mi-vm

# Conectar a la consola de un dominio
xl console mi-vm
```

### Migración

```bash
# Migración en vivo a otro host
xl migrate mi-vm host-destino

# Migración con almacenamiento compartido
xl migrate -s mi-vm host-destino
```

### Monitorización

```bash
# Monitor interactivo tipo top para dominios Xen
xentop

# Uso de CPU por dominio
xl vcpu-list

# Información de memoria
xl mem-list
```

## Archivo de Configuración xl.cfg

```python
# /etc/xen/mi-vm.cfg
name = "mi-vm"
builder = "hvm"          # "generic" para PV, "hvm" para HVM
memory = 2048
vcpus = 2
disk = [
    'phy:/dev/vg0/vm-disk,xvda,w',
    'file:/var/lib/xen/images/mi-vm.img,xvdb,w'
]
vif = [
    'bridge=xenbr0,mac=00:16:3e:xx:xx:xx'
]
boot = "cd"               # c=disco, d=cdrom (solo HVM)
vnc = 1                   # Habilitar VNC (HVM)
sdl = 0
kernel = "/boot/vmlinuz-guest"    # Solo PV
ramdisk = "/boot/initrd-guest"    # Solo PV
extra = "root=/dev/xvda1"         # Solo PV
```

### Opciones de disco

| Formato | Ejemplo | Descripción |
|---|---|---|
| `phy:` | `phy:/dev/vg0/disk,xvda,w` | Dispositivo de bloques físico |
| `file:` | `file:/path/image.img,xvdb,w` | Archivo de imagen |
| `tap:aio:` | `tap:aio:/path/image.img,xvdc,w` | Acceso asíncrono a imagen |

> **Para el examen:** En el formato de disco, `w` significa escritura (read-write) y `r` solo lectura. `xvda` es la convención de nombres para discos Xen paravirtualizados.

## Xenstore

Xenstore es una base de datos jerárquica compartida entre Dom0 y los DomU para intercambiar información de configuración:

```bash
# Leer un valor
xenstore-read /local/domain/1/name

# Listar contenido de un directorio
xenstore-ls /local/domain

# Escribir un valor
xenstore-write /local/domain/1/data/mi-clave "mi-valor"

# Observar cambios
xenstore-watch /local/domain/1/data
```

## Networking en Xen

### Configuración de Bridge

```bash
# Crear bridge para Xen
brctl addbr xenbr0
brctl addif xenbr0 eth0
ip link set xenbr0 up
```

### Interfaz Virtual (vif)

Cada DomU tiene interfaces virtuales (vif) que se conectan al bridge de Dom0:

```
DomU (eth0) ←→ vifX.Y (Dom0) ←→ xenbr0 ←→ eth0 (físico)
```

Configuración en xl.cfg:
```python
vif = [
    'bridge=xenbr0',                              # Bridge simple
    'bridge=xenbr0,mac=00:16:3e:01:02:03',       # MAC específica
    'bridge=xenbr0,ip=192.168.1.100,rate=100Mb/s' # Con límite de ancho de banda
]
```

## Almacenamiento en Xen

### Backends de Almacenamiento

| Backend | Descripción | Uso típico |
|---|---|---|
| **file** | Imágenes de disco en archivo | Desarrollo, pruebas |
| **phy (LVM)** | Volúmenes lógicos LVM | Producción, mejor rendimiento |
| **DRBD** | Replicación de bloques en red | Alta disponibilidad |
| **NFS** | Almacenamiento en red | Migración en vivo |

```bash
# Crear volumen LVM para una VM
lvcreate -L 20G -n vm-disk vg0

# Configuración de disco con LVM
# disk = ['phy:/dev/vg0/vm-disk,xvda,w']

# Con DRBD
# disk = ['drbd:recurso,xvda,w']
```

## xentop - Monitorización

```bash
# Ejecutar xentop
xentop

# Con refresco cada 5 segundos
xentop -d 5

# Modo batch (una iteración)
xentop -b -i 1
```

Columnas principales de xentop:
- **NAME**: Nombre del dominio
- **STATE**: Estado (r=running, b=blocked, p=paused)
- **CPU(sec)**: Tiempo de CPU consumido
- **MEM(k)**: Memoria asignada
- **NETS/NETTX/NETRX**: Tráfico de red
- **VBDs**: Dispositivos de bloque virtuales

## Resumen

| Concepto | Detalle clave |
|---|---|
| Dom0 | Dominio privilegiado, imprescindible |
| DomU | Dominios de usuario (las VMs) |
| xl | Herramienta principal (reemplaza xm) |
| PV | Kernel modificado, sin VT-x |
| HVM | SO sin modificar, requiere VT-x |
| PVH | Modo híbrido recomendado |
| xentop | Monitorización de dominios |
| Xenstore | Base de datos de configuración compartida |
