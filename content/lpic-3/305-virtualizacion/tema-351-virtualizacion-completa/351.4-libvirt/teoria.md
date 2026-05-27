---
title: "351.4 - Libvirt y Herramientas Relacionadas"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.4"
peso: 9
tags:
  - lpic-3
  - tema-351
  - libvirt
  - virsh
  - virt-install
  - virt-manager
---

# 351.4 Libvirt y Herramientas Relacionadas

## Introducción

Libvirt es la capa de abstracción estándar para gestionar plataformas de virtualización en Linux. Con un peso de 9 puntos, este es el subtema más importante de toda la especialidad LPIC-3 305. Proporciona una API unificada, un demonio de gestión y herramientas de línea de comandos para controlar múltiples hipervisores.

## Arquitectura de Libvirt

```
┌──────────────────────────────────────────────┐
│ Herramientas de usuario                       │
│ virsh │ virt-manager │ virt-install │ oVirt   │
├──────────────────────────────────────────────┤
│              libvirt API (C, Python)          │
├──────────────────────────────────────────────┤
│              libvirtd (demonio)               │
├──────┬───────┬────────┬───────┬──────────────┤
│ QEMU │ KVM   │ Xen    │ LXC   │ VirtualBox   │
│driver│driver │driver  │driver │driver         │
└──────┴───────┴────────┴───────┴──────────────┘
```

### Componentes principales

| Componente | Descripción |
|---|---|
| **libvirtd** | Demonio que gestiona conexiones, autenticación y operaciones de virtualización |
| **API libvirt** | API en C con bindings para Python, Perl, Java, Go, etc. |
| **Drivers** | Backends para cada tecnología: QEMU/KVM, Xen, LXC, VirtualBox |
| **XML de dominio** | Formato declarativo para definir VMs |

### URIs de Conexión

Las URIs identifican el hipervisor y el host al que conectarse:

| URI | Descripción |
|---|---|
| `qemu:///system` | KVM/QEMU local con privilegios de sistema |
| `qemu:///session` | KVM/QEMU local como usuario sin privilegios |
| `qemu+ssh://host/system` | KVM/QEMU remoto vía SSH |
| `qemu+tcp://host/system` | KVM/QEMU remoto vía TCP |
| `xen:///` | Xen local |
| `lxc:///` | Contenedores LXC locales |
| `test:///default` | Driver de pruebas |

```bash
# Conectar a hipervisor local
virsh -c qemu:///system

# Conectar a hipervisor remoto por SSH
virsh -c qemu+ssh://usuario@host/system
```

> **Para el examen:** La diferencia entre `qemu:///system` y `qemu:///session` es crucial. `system` ejecuta VMs como root con acceso completo a redes bridge. `session` ejecuta VMs como usuario normal con red NAT.

## virsh: Herramienta Principal

### Gestión de Dominios

```bash
# Listar VMs activas
virsh list

# Listar todas las VMs (activas e inactivas)
virsh list --all

# Iniciar una VM definida
virsh start mi-vm

# Apagado ordenado (ACPI)
virsh shutdown mi-vm

# Apagado forzado
virsh destroy mi-vm

# Reiniciar
virsh reboot mi-vm

# Suspender (pausa)
virsh suspend mi-vm

# Reanudar
virsh resume mi-vm
```

### Definir y Crear Dominios

```bash
# Definir VM persistente desde XML (no la arranca)
virsh define mi-vm.xml

# Crear VM transitoria desde XML (la arranca inmediatamente)
virsh create mi-vm.xml

# Eliminar definición de VM (no borra discos)
virsh undefine mi-vm

# Eliminar definición incluyendo almacenamiento
virsh undefine mi-vm --remove-all-storage
```

> **Para el examen:** `define` crea una VM persistente (sobrevive reinicios del host). `create` crea una VM transitoria (desaparece al apagarse). `undefine` elimina la definición pero NO los discos a menos que se use `--remove-all-storage`.

### Información del Dominio

```bash
# Información general
virsh dominfo mi-vm

# Listar discos de la VM
virsh domblklist mi-vm

# Listar interfaces de red de la VM
virsh domiflist mi-vm

# Ver XML completo de definición
virsh dumpxml mi-vm

# Editar XML de la VM
virsh edit mi-vm

# Estadísticas de CPU
virsh cpu-stats mi-vm

# Estadísticas de bloque
virsh domblkstat mi-vm vda
```

### Consola

```bash
# Conectar a la consola serial de la VM
virsh console mi-vm

# Salir con Ctrl+]
```

### Autostart

```bash
# Habilitar arranque automático con el host
virsh autostart mi-vm

# Deshabilitar arranque automático
virsh autostart --disable mi-vm
```

## Snapshots con virsh

```bash
# Crear snapshot
virsh snapshot-create-as mi-vm --name snap1 --description "Antes de actualizar"

# Listar snapshots
virsh snapshot-list mi-vm

# Ver información del snapshot
virsh snapshot-info mi-vm snap1

# Revertir a un snapshot
virsh snapshot-revert mi-vm snap1

# Eliminar snapshot
virsh snapshot-delete mi-vm snap1

# Ver snapshot actual
virsh snapshot-current mi-vm
```

## Migración de VMs

### Migración en Vivo (Live Migration)

La VM continúa funcionando durante la migración. Requiere:
- Almacenamiento compartido (NFS, iSCSI, Ceph, etc.)
- Misma arquitectura de CPU
- Conectividad de red entre hosts
- libvirtd ejecutándose en ambos hosts

```bash
# Migración en vivo
virsh migrate --live mi-vm qemu+ssh://host-destino/system

# Migración en vivo con túnel
virsh migrate --live --p2p --tunnelled mi-vm qemu+ssh://host-destino/system

# Migración con copia de almacenamiento
virsh migrate --live --copy-storage-all mi-vm qemu+ssh://host-destino/system

# Migración offline (VM apagada)
virsh migrate --offline --persistent mi-vm qemu+ssh://host-destino/system
```

> **Para el examen:** La migración en vivo (`--live`) transfiere la memoria mientras la VM sigue funcionando. La opción `--copy-storage-all` permite migrar sin almacenamiento compartido copiando los discos.

## virt-install

Herramienta para crear VMs de forma automatizada:

```bash
# Instalación básica desde ISO
virt-install \
  --name mi-vm \
  --ram 2048 \
  --vcpus 2 \
  --disk path=/var/lib/libvirt/images/mi-vm.qcow2,size=20,format=qcow2 \
  --cdrom /iso/ubuntu-22.04.iso \
  --os-variant ubuntu22.04 \
  --network bridge=br0 \
  --graphics vnc,listen=0.0.0.0 \
  --noautoconsole

# Instalación desde red (PXE)
virt-install \
  --name mi-vm \
  --ram 2048 \
  --vcpus 2 \
  --disk size=20 \
  --pxe \
  --network bridge=br0 \
  --os-variant centos-stream9

# Instalación con ubicación de red (Kickstart)
virt-install \
  --name mi-vm \
  --ram 2048 \
  --disk size=20 \
  --location http://mirror.centos.org/centos/9-stream/BaseOS/x86_64/os/ \
  --extra-args "ks=http://server/ks.cfg" \
  --os-variant centos-stream9

# Listar variantes de SO disponibles
virt-install --osinfo list
```

## virt-manager

Interfaz gráfica para gestionar VMs a través de libvirt. Permite:
- Crear, configurar y eliminar VMs
- Ver consola gráfica (VNC/SPICE)
- Gestionar redes virtuales y almacenamiento
- Monitorizar rendimiento
- Conectar a hipervisores remotos vía SSH

## virt-clone

Clonar una VM existente:

```bash
# Clonar VM con nuevo nombre y disco
virt-clone \
  --original mi-vm \
  --name mi-vm-clon \
  --file /var/lib/libvirt/images/mi-vm-clon.qcow2

# Clonar con autodescubrimiento de discos
virt-clone --original mi-vm --auto-clone
```

## Configuración XML del Dominio

### Estructura básica

```xml
<domain type='kvm'>
  <name>mi-vm</name>
  <memory unit='MiB'>2048</memory>
  <vcpu placement='static'>2</vcpu>
  <os>
    <type arch='x86_64' machine='pc-q35-6.2'>hvm</type>
    <boot dev='hd'/>
  </os>
  <features>
    <acpi/>
    <apic/>
  </features>
  <cpu mode='host-passthrough'/>
  <devices>
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2'/>
      <source file='/var/lib/libvirt/images/mi-vm.qcow2'/>
      <target dev='vda' bus='virtio'/>
    </disk>
    <interface type='bridge'>
      <source bridge='br0'/>
      <model type='virtio'/>
    </interface>
    <graphics type='vnc' port='-1' autoport='yes'/>
    <console type='pty'/>
  </devices>
</domain>
```

## Redes Virtuales

### Tipos de red

| Tipo | Descripción | Uso |
|---|---|---|
| **NAT** | Red privada con NAT al exterior (default) | Desarrollo, pruebas |
| **Bridge** | VM conectada directamente al bridge del host | Producción |
| **Isolated** | Red solo entre VMs, sin acceso exterior | Laboratorios aislados |
| **Macvtap** | Conexión directa a interfaz del host | Rendimiento |

### Gestión de redes

```bash
# Listar redes virtuales
virsh net-list --all

# Ver XML de red
virsh net-dumpxml default

# Crear red desde XML
virsh net-define red.xml

# Iniciar red
virsh net-start mi-red

# Activar autostart
virsh net-autostart mi-red

# Eliminar red
virsh net-destroy mi-red
virsh net-undefine mi-red

# Editar red existente
virsh net-edit mi-red
```

### XML de red NAT (default)

```xml
<network>
  <name>default</name>
  <bridge name='virbr0'/>
  <forward mode='nat'/>
  <ip address='192.168.122.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.122.2' end='192.168.122.254'/>
    </dhcp>
  </ip>
</network>
```

## Storage Pools y Volumes

### Storage Pools

```bash
# Listar pools de almacenamiento
virsh pool-list --all

# Crear pool tipo directorio
virsh pool-define-as mi-pool dir --target /var/lib/libvirt/images/mi-pool

# Construir pool
virsh pool-build mi-pool

# Iniciar pool
virsh pool-start mi-pool

# Autostart
virsh pool-autostart mi-pool

# Información del pool
virsh pool-info mi-pool

# Refrescar contenido
virsh pool-refresh mi-pool
```

### Volumes

```bash
# Listar volúmenes de un pool
virsh vol-list mi-pool

# Crear volumen
virsh vol-create-as mi-pool mi-disco.qcow2 20G --format qcow2

# Información del volumen
virsh vol-info mi-disco.qcow2 --pool mi-pool

# Eliminar volumen
virsh vol-delete mi-disco.qcow2 --pool mi-pool

# Clonar volumen
virsh vol-clone mi-disco.qcow2 mi-disco-copia.qcow2 --pool mi-pool
```

## Archivos Importantes

| Ruta | Descripción |
|---|---|
| `/etc/libvirt/libvirtd.conf` | Configuración del demonio libvirtd |
| `/etc/libvirt/qemu/` | XMLs de dominios definidos |
| `/var/lib/libvirt/images/` | Directorio por defecto de imágenes |
| `/var/lib/libvirt/qemu/` | Estado de runtime de las VMs |
| `/var/log/libvirt/qemu/` | Logs de las VMs QEMU/KVM |
| `/etc/libvirt/qemu/networks/` | Definiciones de redes virtuales |
| `/etc/libvirt/storage/` | Definiciones de pools de almacenamiento |

## Resumen

| Concepto | Detalle clave |
|---|---|
| `virsh define` vs `create` | Persistente vs transitoria |
| `virsh undefine` | No borra discos (sin --remove-all-storage) |
| `qemu:///system` vs `session` | Root con bridge vs usuario con NAT |
| Migración `--live` | VM sigue funcionando durante la migración |
| virt-install | Automatizar creación de VMs |
| virt-clone | Clonar VMs existentes |
| Storage pools | Abstracción de almacenamiento en libvirt |
| Redes: NAT, bridge, isolated | Tres modos principales de red |
