---
title: "351.5 - Ejercicios: Imágenes de Disco VM"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.5"
peso: 3
tags:
  - lpic-3
  - tema-351
  - ejercicios
  - imagenes
  - qcow2
  - libguestfs
---

# Ejercicios - 351.5 Imágenes de Disco VM

### Pregunta 1
¿Qué formato de imagen de disco ofrece thin provisioning, snapshots internos y compresión de forma nativa?

a) raw
b) vmdk
c) qcow2
d) vdi

<details><summary>Respuesta</summary>

**c) qcow2**

qcow2 (QEMU Copy-On-Write v2) es el formato nativo de QEMU/KVM que soporta thin provisioning, snapshots internos, compresión zlib, cifrado LUKS y backing files. Es el formato más versátil para entornos KVM.
</details>

### Pregunta 2
¿Qué sucede si se elimina el backing file de una imagen qcow2 que depende de él?

a) La imagen derivada sigue funcionando sin problemas
b) La imagen derivada se convierte automáticamente en imagen independiente
c) La imagen derivada queda corrupta e inutilizable
d) Se crea automáticamente una copia del backing file

<details><summary>Respuesta</summary>

**c) La imagen derivada queda corrupta e inutilizable**

Las imágenes con backing files dependen completamente de la imagen base. Si se elimina, modifica o mueve el backing file, todas las imágenes derivadas dejan de funcionar ya que solo contienen los bloques que difieren de la base.
</details>

### Pregunta 3
¿Qué herramienta permite reducir el tamaño físico de una imagen eliminando espacio no utilizado?

a) `qemu-img resize`
b) `virt-sparsify`
c) `virt-resize`
d) `qemu-img compress`

<details><summary>Respuesta</summary>

**b) `virt-sparsify`**

`virt-sparsify` rellena con ceros el espacio libre dentro del filesystem del guest y luego elimina esos bloques de ceros, reduciendo el tamaño real del archivo. `virt-resize` redimensiona particiones dentro de la imagen.
</details>

### Pregunta 4
¿Qué herramienta permite montar el filesystem de una imagen de disco directamente en el host sin arrancar la VM?

a) `mount -o loop`
b) `guestmount`
c) `virt-mount`
d) `qemu-mount`

<details><summary>Respuesta</summary>

**b) `guestmount`**

`guestmount -a disco.qcow2 -i /mnt/guest` monta el filesystem de la imagen usando libguestfs (a través de FUSE). La opción `-i` realiza la inspección automática del SO para montar los filesystems correctos. Se desmonta con `guestunmount`.
</details>

### Pregunta 5
¿Qué es un archivo OVA?

a) Un formato de imagen de disco de Oracle
b) Un archivo TAR que contiene archivos OVF (descriptor XML, imagen de disco y checksums)
c) Un archivo de configuración de OpenStack
d) Un formato de snapshot comprimido

<details><summary>Respuesta</summary>

**b) Un archivo TAR que contiene archivos OVF (descriptor XML, imagen de disco y checksums)**

OVA (Open Virtual Appliance) es un paquete TAR que contiene un archivo .ovf (descriptor XML), las imágenes de disco (.vmdk u otro formato) y un archivo .mf con checksums. Es el formato estándar para distribuir VMs entre hipervisores.
</details>

### Pregunta 6
¿Qué comando crea una imagen qcow2 derivada de un backing file existente?

a) `qemu-img create -f qcow2 -b base.qcow2 -F qcow2 overlay.qcow2`
b) `qemu-img clone base.qcow2 overlay.qcow2`
c) `qemu-img derive -b base.qcow2 overlay.qcow2`
d) `qemu-img snapshot -c overlay base.qcow2`

<details><summary>Respuesta</summary>

**a) `qemu-img create -f qcow2 -b base.qcow2 -F qcow2 overlay.qcow2`**

`-b` especifica el backing file y `-F` su formato. La imagen resultante (overlay) es de tipo copy-on-write: solo almacena los bloques que difieren de la base. No se especifica tamaño porque se hereda del backing file.
</details>

### Pregunta 7
¿Qué herramienta de libguestfs permite personalizar una imagen de VM (cambiar hostname, instalar paquetes, inyectar SSH keys)?

a) `guestfish`
b) `virt-customize`
c) `virt-edit`
d) `virt-builder`

<details><summary>Respuesta</summary>

**b) `virt-customize`**

`virt-customize` permite realizar múltiples operaciones de personalización en una sola ejecución: `--hostname`, `--install`, `--ssh-inject`, `--run-command`, etc. `guestfish` es un shell interactivo más genérico. `virt-edit` solo edita un archivo individual.
</details>

### Pregunta 8
¿Cuál es el flag correcto de formato para convertir una imagen VHD (Hyper-V) con qemu-img?

a) `-f vhd`
b) `-f hyperv`
c) `-f vpc`
d) `-f vhdx`

<details><summary>Respuesta</summary>

**c) `-f vpc`**

En qemu-img, el formato VHD de Hyper-V se especifica como `vpc` (Virtual PC, nombre histórico). Ejemplo: `qemu-img convert -f vpc -O qcow2 disco.vhd disco.qcow2`.
</details>

### Pregunta 9
¿Qué hace el comando `virt-resize --expand /dev/sda2 viejo.qcow2 nuevo.qcow2`?

a) Expande el archivo de imagen viejo.qcow2
b) Copia la imagen a nuevo.qcow2 expandiendo la partición /dev/sda2
c) Redimensiona solo la partición sin copiar
d) Comprime la partición /dev/sda2

<details><summary>Respuesta</summary>

**b) Copia la imagen a nuevo.qcow2 expandiendo la partición /dev/sda2**

`virt-resize` siempre crea una copia de la imagen en el destino, nunca modifica la imagen original. La imagen destino debe existir previamente y tener mayor tamaño. `--expand` indica qué partición debe crecer para ocupar el espacio adicional.
</details>

### Pregunta 10
¿Qué comando de guestfish permite subir un archivo desde el host al sistema de archivos de una imagen de VM?

a) `copy archivo /destino`
b) `upload archivo-local /ruta/destino`
c) `put archivo /destino`
d) `send archivo /destino`

<details><summary>Respuesta</summary>

**b) `upload archivo-local /ruta/destino`**

En guestfish, `upload` copia un archivo del host al filesystem de la imagen y `download` hace la operación inversa. Primero hay que ejecutar `run` y montar el filesystem con `mount`.
</details>
