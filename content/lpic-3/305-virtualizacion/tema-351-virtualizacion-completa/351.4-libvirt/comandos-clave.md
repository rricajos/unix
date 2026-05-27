---
title: "351.4 - Comandos Clave: Libvirt"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.4"
peso: 9
tags:
  - lpic-3
  - tema-351
  - comandos
  - libvirt
  - virsh
  - virt-install
---

# Comandos Clave - 351.4 Libvirt

## virsh - Gestión de Dominios

| Comando | Descripción |
|---|---|
| `virsh list` | Listar VMs activas |
| `virsh list --all` | Listar todas las VMs |
| `virsh start <vm>` | Iniciar VM |
| `virsh shutdown <vm>` | Apagado ordenado (ACPI) |
| `virsh destroy <vm>` | Apagado forzado |
| `virsh reboot <vm>` | Reiniciar VM |
| `virsh suspend <vm>` | Pausar VM |
| `virsh resume <vm>` | Reanudar VM |
| `virsh define <xml>` | Definir VM persistente |
| `virsh create <xml>` | Crear VM transitoria |
| `virsh undefine <vm>` | Eliminar definición |
| `virsh undefine <vm> --remove-all-storage` | Eliminar VM y discos |
| `virsh edit <vm>` | Editar XML de la VM |
| `virsh dumpxml <vm>` | Ver XML completo |
| `virsh dominfo <vm>` | Información del dominio |
| `virsh domblklist <vm>` | Listar discos |
| `virsh domiflist <vm>` | Listar interfaces de red |
| `virsh console <vm>` | Conectar a consola serial |
| `virsh autostart <vm>` | Habilitar autostart |
| `virsh autostart --disable <vm>` | Deshabilitar autostart |

## virsh - Snapshots

| Comando | Descripción |
|---|---|
| `virsh snapshot-create-as <vm> --name <snap>` | Crear snapshot |
| `virsh snapshot-list <vm>` | Listar snapshots |
| `virsh snapshot-info <vm> <snap>` | Info del snapshot |
| `virsh snapshot-revert <vm> <snap>` | Revertir a snapshot |
| `virsh snapshot-delete <vm> <snap>` | Eliminar snapshot |
| `virsh snapshot-current <vm>` | Snapshot actual |

## virsh - Migración

| Comando | Descripción |
|---|---|
| `virsh migrate --live <vm> <uri>` | Migración en vivo |
| `virsh migrate --live --p2p --tunnelled <vm> <uri>` | Migración con túnel |
| `virsh migrate --live --copy-storage-all <vm> <uri>` | Migración con copia de disco |
| `virsh migrate --offline --persistent <vm> <uri>` | Migración offline |

## virsh - Redes

| Comando | Descripción |
|---|---|
| `virsh net-list --all` | Listar redes |
| `virsh net-define <xml>` | Definir red |
| `virsh net-start <red>` | Iniciar red |
| `virsh net-destroy <red>` | Detener red |
| `virsh net-undefine <red>` | Eliminar red |
| `virsh net-autostart <red>` | Autostart de red |
| `virsh net-dumpxml <red>` | Ver XML de red |
| `virsh net-edit <red>` | Editar red |

## virsh - Almacenamiento

| Comando | Descripción |
|---|---|
| `virsh pool-list --all` | Listar pools |
| `virsh pool-define-as <pool> dir --target <path>` | Definir pool de directorio |
| `virsh pool-build <pool>` | Construir pool |
| `virsh pool-start <pool>` | Iniciar pool |
| `virsh pool-autostart <pool>` | Autostart de pool |
| `virsh pool-info <pool>` | Info del pool |
| `virsh pool-refresh <pool>` | Refrescar pool |
| `virsh vol-list <pool>` | Listar volúmenes |
| `virsh vol-create-as <pool> <vol> <tam> --format qcow2` | Crear volumen |
| `virsh vol-delete <vol> --pool <pool>` | Eliminar volumen |
| `virsh vol-clone <vol> <nuevo> --pool <pool>` | Clonar volumen |

## Herramientas Complementarias

| Comando | Descripción |
|---|---|
| `virt-install --name X --ram Y --disk Z ...` | Crear VM nueva |
| `virt-install --osinfo list` | Listar variantes de SO |
| `virt-clone --original <vm> --auto-clone` | Clonar VM |
| `virt-manager` | Interfaz gráfica de gestión |
| `virt-viewer <vm>` | Visor de consola gráfica |

## Archivos Importantes

| Ruta | Descripción |
|---|---|
| `/etc/libvirt/libvirtd.conf` | Configuración de libvirtd |
| `/etc/libvirt/qemu/` | XMLs de dominios QEMU/KVM |
| `/etc/libvirt/qemu/networks/` | XMLs de redes virtuales |
| `/etc/libvirt/storage/` | XMLs de pools de almacenamiento |
| `/var/lib/libvirt/images/` | Imágenes de disco (pool default) |
| `/var/log/libvirt/qemu/` | Logs de VMs |
