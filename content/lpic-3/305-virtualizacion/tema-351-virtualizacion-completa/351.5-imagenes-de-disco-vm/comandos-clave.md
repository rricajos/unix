---
title: "351.5 - Comandos Clave: Imágenes de Disco VM"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.5"
peso: 3
tags:
  - lpic-3
  - tema-351
  - comandos
  - imagenes
  - qemu-img
  - libguestfs
---

# Comandos Clave - 351.5 Imágenes de Disco VM

## qemu-img - Operaciones de Imagen

| Comando | Descripción |
|---|---|
| `qemu-img create -f qcow2 disco.qcow2 20G` | Crear imagen qcow2 |
| `qemu-img create -f qcow2 -b base.qcow2 -F qcow2 overlay.qcow2` | Crear overlay con backing file |
| `qemu-img info disco.qcow2` | Información de imagen |
| `qemu-img info --backing-chain disco.qcow2` | Ver cadena completa de backing files |
| `qemu-img convert -f qcow2 -O vmdk disco.qcow2 disco.vmdk` | Convertir qcow2 a vmdk |
| `qemu-img convert -f vmdk -O qcow2 disco.vmdk disco.qcow2` | Convertir vmdk a qcow2 |
| `qemu-img convert -f vdi -O qcow2 disco.vdi disco.qcow2` | Convertir vdi a qcow2 |
| `qemu-img convert -c -O qcow2 disco.raw disco.qcow2` | Convertir con compresión |
| `qemu-img resize disco.qcow2 +10G` | Aumentar tamaño |
| `qemu-img resize --shrink disco.qcow2 15G` | Reducir tamaño |
| `qemu-img check disco.qcow2` | Verificar integridad |
| `qemu-img check -r all disco.qcow2` | Reparar imagen |
| `qemu-img rebase -b nuevo.qcow2 -F qcow2 overlay.qcow2` | Cambiar backing file |
| `qemu-img measure -f raw -O qcow2 disco.raw` | Estimar espacio tras conversión |

## virt-sparsify

| Comando | Descripción |
|---|---|
| `virt-sparsify --in-place disco.qcow2` | Reducir espacio in-place |
| `virt-sparsify disco.qcow2 disco-sparse.qcow2` | Crear copia reducida |
| `virt-sparsify --compress disco.qcow2 disco-comp.qcow2` | Reducir con compresión |
| `virt-sparsify disco.raw --convert qcow2 disco.qcow2` | Reducir y convertir formato |

## virt-resize

| Comando | Descripción |
|---|---|
| `virt-resize --expand /dev/sda2 old.qcow2 new.qcow2` | Expandir partición |
| `virt-resize --LV-expand /dev/vg/root old.qcow2 new.qcow2` | Expandir LV |
| `virt-resize --shrink /dev/sda1 old.qcow2 new.qcow2` | Reducir partición |

## libguestfs - Acceso al Filesystem

| Comando | Descripción |
|---|---|
| `guestfish -a disco.qcow2` | Abrir shell interactivo |
| `guestfish -a disco.qcow2 -i cat /etc/hostname` | Leer archivo directamente |
| `guestmount -a disco.qcow2 -i /mnt/guest` | Montar filesystem en el host |
| `guestunmount /mnt/guest` | Desmontar filesystem |
| `virt-filesystems -a disco.qcow2 --all --long` | Listar filesystems |
| `virt-inspector disco.qcow2` | Inspeccionar SO |
| `virt-edit -a disco.qcow2 /etc/hostname` | Editar archivo |
| `virt-log -a disco.qcow2` | Ver logs del guest |
| `virt-customize -a disco.qcow2 --hostname X` | Personalizar imagen |
| `virt-v2v -i ova vm.ova -o libvirt -of qcow2` | Convertir OVA a libvirt |

## Comandos guestfish Internos

| Comando | Descripción |
|---|---|
| `run` | Iniciar el backend de libguestfs |
| `list-filesystems` | Listar filesystems de la imagen |
| `mount /dev/sda1 /` | Montar partición |
| `ls /directorio/` | Listar archivos |
| `cat /ruta/archivo` | Ver contenido de archivo |
| `edit /ruta/archivo` | Editar archivo |
| `upload local.txt /ruta/destino` | Subir archivo al guest |
| `download /ruta/origen local.txt` | Descargar archivo del guest |

## Formatos y Conversión

| Origen → Destino | Flag `-f` / `-O` |
|---|---|
| raw → qcow2 | `-f raw -O qcow2` |
| qcow2 → vmdk | `-f qcow2 -O vmdk` |
| vmdk → qcow2 | `-f vmdk -O qcow2` |
| vdi → qcow2 | `-f vdi -O qcow2` |
| vhd → qcow2 | `-f vpc -O qcow2` |
