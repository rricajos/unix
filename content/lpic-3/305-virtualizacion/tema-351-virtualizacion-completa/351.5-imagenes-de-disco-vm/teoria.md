---
title: "351.5 - Imágenes de Disco de Máquinas Virtuales"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.5"
peso: 3
tags:
  - lpic-3
  - tema-351
  - imagenes
  - qcow2
  - raw
  - libguestfs
  - ovf
---

# 351.5 Imágenes de Disco de Máquinas Virtuales

## Introducción

La gestión de imágenes de disco es fundamental en entornos de virtualización. Este subtema cubre los diferentes formatos, herramientas de manipulación, conversión entre formatos y las técnicas avanzadas como backing files y copy-on-write.

## Comparación de Formatos de Imagen

| Formato | Hipervisor | Thin Prov. | Snapshots | Compresión | Cifrado |
|---|---|---|---|---|---|
| **raw** | Universal | No | No | No | No |
| **qcow2** | QEMU/KVM | Sí | Sí | Sí | Sí (LUKS) |
| **vmdk** | VMware | Sí | Limitado | Sí | Sí |
| **vdi** | VirtualBox | Sí | No | No | No |
| **vhd/vhdx** | Hyper-V | Sí | Sí (vhdx) | No | No |

### raw

- Copia exacta bloque a bloque del disco virtual.
- Sin metadatos ni overhead de formato.
- Mejor rendimiento de E/S.
- Ocupa el tamaño completo inmediatamente (sin thin provisioning nativo).
- Compatible con cualquier herramienta de manipulación de bloques.

```bash
# Crear imagen raw
qemu-img create -f raw disco.raw 20G

# También se puede crear con dd
dd if=/dev/zero of=disco.raw bs=1M count=0 seek=20480
```

### qcow2 (QEMU Copy-On-Write v2)

Formato nativo de QEMU/KVM, el más versátil:

- **Thin provisioning**: solo ocupa espacio según se escriben datos.
- **Snapshots internos**: múltiples estados dentro del mismo archivo.
- **Backing files**: cadenas de copy-on-write.
- **Compresión**: con zlib, reduce tamaño en disco.
- **Cifrado**: soporte LUKS nativo.
- **Preallocation**: `off`, `metadata`, `falloc`, `full`.

```bash
# Crear qcow2 con preallocación de metadatos
qemu-img create -f qcow2 -o preallocation=metadata disco.qcow2 20G

# Crear qcow2 con cifrado LUKS
qemu-img create -f qcow2 -o encryption=on,encrypt.format=luks disco.qcow2 20G
```

> **Para el examen:** qcow2 es el formato recomendado para QEMU/KVM. Ofrece el mejor balance entre funcionalidad y rendimiento. raw solo es preferible cuando se necesita rendimiento máximo sin funcionalidades avanzadas.

## Operaciones con qemu-img

### Operaciones principales

```bash
# Crear imagen
qemu-img create -f qcow2 disco.qcow2 20G

# Información detallada
qemu-img info disco.qcow2

# Convertir entre formatos
qemu-img convert -f qcow2 -O vmdk disco.qcow2 disco.vmdk

# Redimensionar
qemu-img resize disco.qcow2 +10G

# Verificar integridad
qemu-img check disco.qcow2

# Reparar imagen dañada
qemu-img check -r all disco.qcow2

# Comparar dos imágenes
qemu-img compare disco1.qcow2 disco2.qcow2

# Medir espacio necesario para conversión
qemu-img measure -f raw -O qcow2 disco.raw
```

### Conversiones entre hipervisores

```bash
# QEMU/KVM → VMware
qemu-img convert -f qcow2 -O vmdk disco.qcow2 disco.vmdk

# VMware → QEMU/KVM
qemu-img convert -f vmdk -O qcow2 disco.vmdk disco.qcow2

# VirtualBox → QEMU/KVM
qemu-img convert -f vdi -O qcow2 disco.vdi disco.qcow2

# Hyper-V → QEMU/KVM
qemu-img convert -f vpc -O qcow2 disco.vhd disco.qcow2

# Cualquier formato → raw (para máxima compatibilidad)
qemu-img convert -f qcow2 -O raw disco.qcow2 disco.raw
```

## Backing Files (Copy-on-Write Chains)

Los backing files permiten crear imágenes derivadas que solo almacenan los cambios respecto a una imagen base:

```
base.qcow2 (imagen original - solo lectura)
    ├── vm1.qcow2 (cambios de VM1)
    ├── vm2.qcow2 (cambios de VM2)
    └── vm3.qcow2 (cambios de VM3)
```

### Crear cadenas COW

```bash
# Crear imagen base
qemu-img create -f qcow2 base.qcow2 20G

# Instalar SO en la imagen base...

# Crear imágenes derivadas (overlay)
qemu-img create -f qcow2 -b base.qcow2 -F qcow2 vm1.qcow2
qemu-img create -f qcow2 -b base.qcow2 -F qcow2 vm2.qcow2

# Verificar backing file
qemu-img info vm1.qcow2
# ...
# backing file: base.qcow2
# backing file format: qcow2
```

### Cadenas multi-nivel

```bash
# base.qcow2 ← snap1.qcow2 ← snap2.qcow2 ← actual.qcow2
qemu-img create -f qcow2 -b base.qcow2 -F qcow2 snap1.qcow2
qemu-img create -f qcow2 -b snap1.qcow2 -F qcow2 snap2.qcow2
qemu-img create -f qcow2 -b snap2.qcow2 -F qcow2 actual.qcow2

# Ver toda la cadena
qemu-img info --backing-chain actual.qcow2
```

### Consolidar (flatten) una cadena

```bash
# Combinar todos los niveles en una sola imagen
qemu-img convert -f qcow2 -O qcow2 actual.qcow2 consolidada.qcow2

# O rebase para cambiar el backing file
qemu-img rebase -b nuevo-base.qcow2 -F qcow2 overlay.qcow2
```

> **Para el examen:** El backing file debe existir siempre y nunca debe ser modificado. Si se elimina o modifica el backing file, todas las imágenes derivadas quedan corruptas.

## virt-sparsify

Reduce el tamaño físico de una imagen eliminando espacio no utilizado:

```bash
# Reducir imagen in-place (requiere que la VM esté apagada)
virt-sparsify --in-place disco.qcow2

# Crear copia reducida
virt-sparsify disco.qcow2 disco-sparse.qcow2

# Convertir formato durante la operación
virt-sparsify disco.raw --convert qcow2 disco.qcow2

# Con compresión
virt-sparsify --compress disco.qcow2 disco-comprimido.qcow2
```

> **Para el examen:** `virt-sparsify` funciona rellenando con ceros el espacio libre dentro del filesystem del guest, y luego eliminando esos bloques de ceros del archivo de imagen.

## virt-resize

Redimensiona particiones dentro de una imagen de disco:

```bash
# Expandir partición /dev/sda2 usando todo el espacio disponible
virt-resize --expand /dev/sda2 disco-viejo.qcow2 disco-nuevo.qcow2

# Primero crear imagen más grande
qemu-img create -f qcow2 disco-nuevo.qcow2 40G

# Expandir con LVM
virt-resize --expand /dev/sda2 --LV-expand /dev/vg0/root \
  disco-viejo.qcow2 disco-nuevo.qcow2

# Reducir una partición y expandir otra
virt-resize --shrink /dev/sda1 --expand /dev/sda2 \
  disco-viejo.qcow2 disco-nuevo.qcow2
```

## libguestfs: guestfish y guestmount

libguestfs permite acceder y modificar el sistema de archivos de imágenes de disco sin necesidad de arrancar la VM.

### guestfish (shell interactivo)

```bash
# Abrir imagen de forma interactiva
guestfish -a disco.qcow2

# Dentro de guestfish:
><fs> run
><fs> list-filesystems
><fs> mount /dev/sda1 /
><fs> ls /etc/
><fs> cat /etc/hostname
><fs> edit /etc/network/interfaces
><fs> upload archivo-local.conf /etc/mi-config.conf
><fs> download /etc/passwd /tmp/passwd-backup
><fs> exit

# Modo no interactivo con comandos
guestfish -a disco.qcow2 -i cat /etc/hostname
```

### guestmount

Monta el sistema de archivos de una imagen directamente en el host:

```bash
# Montar imagen
mkdir /mnt/guest
guestmount -a disco.qcow2 -i /mnt/guest

# Acceder como filesystem normal
ls /mnt/guest/etc/
cat /mnt/guest/etc/hostname

# Desmontar
guestunmount /mnt/guest
```

### Otras herramientas libguestfs

```bash
# Listar filesystems en la imagen
virt-filesystems -a disco.qcow2 --all --long

# Inspeccionar SO instalado
virt-inspector disco.qcow2

# Ver logs del guest
virt-log -a disco.qcow2

# Listar paquetes instalados
virt-inspector disco.qcow2 | virt-inspector --xpath '//application/app_name'

# Editar un archivo directamente
virt-edit -a disco.qcow2 /etc/hostname

# Personalizar imagen (cambiar hostname, inyectar SSH keys, etc.)
virt-customize -a disco.qcow2 \
  --hostname nuevo-host \
  --ssh-inject root:file:/root/.ssh/id_rsa.pub \
  --install nginx \
  --run-command 'systemctl enable nginx'
```

> **Para el examen:** libguestfs NO requiere que la VM esté en ejecución. Opera directamente sobre archivos de imagen. Es esencial para automatizar la personalización de imágenes.

## Formato OVF/OVA

### OVF (Open Virtualization Format)

Estándar abierto para empaquetar y distribuir máquinas virtuales entre diferentes hipervisores:

- **Archivo .ovf**: Descriptor XML con metadatos (hardware virtual, redes, etc.).
- **Archivos .vmdk/.qcow2**: Imágenes de disco asociadas.
- **Archivo .mf**: Checksums (integridad).

### OVA (Open Virtual Appliance)

Archivo TAR que contiene todos los archivos OVF en un solo paquete:

```bash
# Un archivo .ova es simplemente un tar
tar tf mi-appliance.ova
# mi-appliance.ovf
# mi-appliance.vmdk
# mi-appliance.mf

# Extraer OVA
tar xf mi-appliance.ova

# Importar OVA con virt-v2v
virt-v2v -i ova mi-appliance.ova -o libvirt -of qcow2

# Crear OVA manualmente
tar cf mi-appliance.ova mi-appliance.ovf mi-appliance.vmdk mi-appliance.mf
```

## Conversión entre Hipervisores

### virt-v2v

Convierte VMs de un formato/hipervisor a otro:

```bash
# VMware → KVM/libvirt
virt-v2v -i vmx /vmfs/mi-vm.vmx -o libvirt -of qcow2

# OVA → KVM/libvirt
virt-v2v -i ova mi-vm.ova -o libvirt -of qcow2

# Salida a directorio local
virt-v2v -i ova mi-vm.ova -o local -os /var/lib/libvirt/images/
```

## Resumen

| Concepto | Detalle clave |
|---|---|
| raw | Mejor rendimiento, sin funciones avanzadas |
| qcow2 | Formato recomendado QEMU/KVM, thin provisioning, snapshots |
| Backing files | COW, imagen base + overlays de cambios |
| virt-sparsify | Reducir tamaño eliminando espacio no usado |
| virt-resize | Redimensionar particiones dentro de la imagen |
| guestfish/guestmount | Acceso al filesystem sin arrancar la VM |
| OVF/OVA | Formato portátil entre hipervisores |
| virt-v2v | Conversión entre plataformas |
