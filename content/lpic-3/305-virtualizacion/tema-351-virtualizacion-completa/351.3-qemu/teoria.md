---
title: "351.3 - QEMU"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.3"
peso: 4
tags:
  - lpic-3
  - tema-351
  - qemu
  - kvm
  - qemu-img
  - snapshots
---

# 351.3 QEMU

## Introducción

QEMU (Quick Emulator) es un emulador y virtualizador genérico de código abierto. Puede funcionar como emulador puro (traduciendo instrucciones por software) o como virtualizador en combinación con KVM, ofreciendo rendimiento casi nativo.

## QEMU como Emulador y Virtualizador

### Modo Emulación (sin KVM)

Traduce instrucciones de una arquitectura a otra por software. Permite ejecutar ARM en x86, por ejemplo, pero con rendimiento reducido.

```bash
# Emular sistema ARM en host x86
qemu-system-arm -M versatilepb -kernel zImage -dtb versatile-pb.dtb
```

### Modo Virtualización (con KVM)

Ejecuta código nativo en la CPU del host usando extensiones de hardware. Requiere misma arquitectura host/guest.

```bash
# Virtualización con aceleración KVM
qemu-system-x86_64 -enable-kvm -m 2048 -hda disco.qcow2
```

> **Para el examen:** La opción `-enable-kvm` o `-accel kvm` activa la aceleración KVM. Sin ella, QEMU funciona en modo emulación pura, mucho más lento.

## qemu-system-x86_64

Comando principal para ejecutar máquinas virtuales x86_64:

```bash
# Ejemplo completo de arranque de VM
qemu-system-x86_64 \
  -enable-kvm \
  -m 2048 \
  -smp 2 \
  -cpu host \
  -hda /var/lib/libvirt/images/vm.qcow2 \
  -cdrom /iso/ubuntu.iso \
  -boot d \
  -net nic -net user \
  -vnc :1 \
  -daemonize
```

### Opciones fundamentales

| Opción | Descripción |
|---|---|
| `-enable-kvm` | Activar aceleración KVM |
| `-m <MB>` | Memoria RAM en MB |
| `-smp <N>` | Número de CPUs virtuales |
| `-cpu host` | Exponer las características reales de la CPU |
| `-hda <imagen>` | Disco duro primario |
| `-cdrom <iso>` | CD-ROM virtual |
| `-boot <orden>` | Orden de arranque: c=disco, d=cdrom, n=red |
| `-daemonize` | Ejecutar en segundo plano |
| `-name <nombre>` | Nombre de la VM |
| `-nographic` | Sin interfaz gráfica (solo consola serial) |

## qemu-img: Gestión de Imágenes de Disco

### Crear imágenes

```bash
# Crear imagen qcow2 de 20GB (thin provisioning)
qemu-img create -f qcow2 disco.qcow2 20G

# Crear imagen raw de 10GB
qemu-img create -f raw disco.raw 10G

# Crear imagen con backing file (copy-on-write)
qemu-img create -f qcow2 -b base.qcow2 -F qcow2 snapshot.qcow2
```

### Obtener información

```bash
# Información de una imagen
qemu-img info disco.qcow2

# Información incluyendo cadena de backing files
qemu-img info --backing-chain disco.qcow2
```

### Convertir formatos

```bash
# Convertir raw a qcow2
qemu-img convert -f raw -O qcow2 disco.raw disco.qcow2

# Convertir qcow2 a vmdk (VMware)
qemu-img convert -f qcow2 -O vmdk disco.qcow2 disco.vmdk

# Convertir con compresión
qemu-img convert -c -f raw -O qcow2 disco.raw disco.qcow2
```

### Redimensionar

```bash
# Aumentar tamaño en 10GB
qemu-img resize disco.qcow2 +10G

# Establecer tamaño exacto
qemu-img resize disco.qcow2 50G

# Reducir tamaño (requiere --shrink)
qemu-img resize --shrink disco.qcow2 15G
```

### Snapshots

```bash
# Crear snapshot interno
qemu-img snapshot -c snap1 disco.qcow2

# Listar snapshots
qemu-img snapshot -l disco.qcow2

# Aplicar (revertir a) snapshot
qemu-img snapshot -a snap1 disco.qcow2

# Eliminar snapshot
qemu-img snapshot -d snap1 disco.qcow2
```

> **Para el examen:** Los snapshots internos solo están soportados en formato qcow2. Las imágenes raw no soportan snapshots.

## Formatos de Imagen

| Formato | Extensión | Características |
|---|---|---|
| **raw** | `.img`, `.raw` | Sin overhead, mejor rendimiento, sin snapshots, tamaño completo |
| **qcow2** | `.qcow2` | Nativo QEMU, thin provisioning, snapshots, compresión, cifrado |
| **vmdk** | `.vmdk` | Formato VMware |
| **vdi** | `.vdi` | Formato VirtualBox |
| **vhd/vhdx** | `.vhd`, `.vhdx` | Formato Microsoft Hyper-V |

### Comparativa de formatos

| Característica | raw | qcow2 | vmdk | vdi |
|---|---|---|---|---|
| Thin provisioning | No | Sí | Sí | Sí |
| Snapshots | No | Sí | Limitado | No |
| Compresión | No | Sí | Sí | No |
| Cifrado | No | Sí (LUKS) | No | No |
| Backing files | No | Sí | No | No |
| Rendimiento | Máximo | Muy bueno | Bueno | Bueno |

## Snapshots: Internos vs Externos

### Snapshots Internos

Se almacenan dentro del propio archivo qcow2. Capturan el estado del disco (y opcionalmente RAM y dispositivos).

```bash
# Crear snapshot interno desde QEMU Monitor
(qemu) savevm mi-snapshot

# Restaurar snapshot
(qemu) loadvm mi-snapshot

# Desde línea de comandos
qemu-img snapshot -c mi-snapshot disco.qcow2
```

### Snapshots Externos

Crean un nuevo archivo qcow2 que usa la imagen original como backing file. La imagen original queda en modo solo lectura.

```bash
# Crear snapshot externo
qemu-img create -f qcow2 -b disco.qcow2 -F qcow2 disco-snap1.qcow2

# Cadena de backing files
# base.qcow2 ← snap1.qcow2 ← snap2.qcow2 (activa)
```

> **Para el examen:** Los snapshots externos usan copy-on-write: solo almacenan los bloques que han cambiado respecto al backing file. Son más eficientes para workflows de ramificación.

## QEMU Monitor

Interfaz interactiva de control de QEMU accesible durante la ejecución:

```bash
# Acceder al monitor (Ctrl+Alt+2 en ventana gráfica)
# O iniciar con monitor en stdio
qemu-system-x86_64 -monitor stdio ...
```

### Comandos del Monitor

| Comando | Descripción |
|---|---|
| `info status` | Estado de la VM |
| `info snapshots` | Listar snapshots |
| `info block` | Información de dispositivos de bloque |
| `info network` | Información de red |
| `savevm <nombre>` | Crear snapshot (estado completo) |
| `loadvm <nombre>` | Restaurar snapshot |
| `stop` | Pausar la VM |
| `cont` | Reanudar la VM |
| `quit` | Salir de QEMU |
| `system_reset` | Reiniciar la VM |
| `system_powerdown` | Apagado ACPI |
| `migrate <uri>` | Migrar la VM |
| `change vnc :2` | Cambiar puerto VNC |

## Emulación de Dispositivos

### Red

```bash
# Red de usuario (NAT, sin configuración)
-net nic -net user

# TAP device (bridging)
-netdev tap,id=net0,ifname=tap0,script=no -device virtio-net-pci,netdev=net0

# Bridge directo
-netdev bridge,id=net0,br=br0 -device virtio-net-pci,netdev=net0
```

### Almacenamiento

```bash
# Disco con interfaz virtio (mejor rendimiento)
-drive file=disco.qcow2,format=qcow2,if=virtio

# Disco IDE clásico
-drive file=disco.qcow2,format=qcow2,if=ide

# Múltiples discos
-drive file=disco1.qcow2,if=virtio,index=0 \
-drive file=disco2.qcow2,if=virtio,index=1
```

### Dispositivos genéricos

```bash
# USB tablet (mejor integración del ratón)
-device usb-tablet

# Tarjeta de sonido
-device ich9-intel-hda -device hda-output

# Puerto serie redirigido a stdio
-serial stdio
```

## Consola Serial

```bash
# Redirigir consola serial a la terminal
qemu-system-x86_64 -nographic -serial mon:stdio ...

# El guest necesita configurar la consola serial en GRUB:
# GRUB_CMDLINE_LINUX="console=ttyS0,115200n8"
```

## VNC y SPICE

```bash
# Habilitar VNC en display :1 (puerto 5901)
qemu-system-x86_64 -vnc :1 ...

# VNC con contraseña
qemu-system-x86_64 -vnc :1,password=on ...

# SPICE (mejor rendimiento para escritorio)
qemu-system-x86_64 \
  -spice port=5930,disable-ticketing=on \
  -device virtio-vga \
  -device virtio-serial-pci \
  -chardev spicevmc,id=spicechannel0,name=vdagent \
  -device virtserialport,chardev=spicechannel0,name=com.redhat.spice.0
```

> **Para el examen:** SPICE ofrece mejor rendimiento para entornos de escritorio que VNC, soportando audio, USB remoto y copiar/pegar bidireccional. VNC es más universal y simple.

## Resumen

| Concepto | Detalle clave |
|---|---|
| `-enable-kvm` | Activa aceleración hardware |
| qcow2 | Formato nativo, soporta snapshots y thin provisioning |
| raw | Mejor rendimiento, sin funcionalidades avanzadas |
| `qemu-img` | Herramienta para crear, convertir y gestionar imágenes |
| QEMU Monitor | Control interactivo de la VM en ejecución |
| virtio | Drivers PV para mejor rendimiento en E/S |
| SPICE > VNC | SPICE para escritorio, VNC para acceso básico |
