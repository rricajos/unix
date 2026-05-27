---
title: "351.1 - Comandos Clave: Conceptos y Teoría"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.1"
peso: 6
tags:
  - lpic-3
  - tema-351
  - comandos
  - virtualizacion
  - kvm
  - hardware
---

# Comandos Clave - 351.1 Conceptos y Teoría

## Verificación de Soporte de Hardware

| Comando | Descripción |
|---|---|
| `grep -c vmx /proc/cpuinfo` | Verificar soporte Intel VT-x |
| `grep -c svm /proc/cpuinfo` | Verificar soporte AMD-V |
| `grep -E 'vmx|svm' /proc/cpuinfo` | Mostrar flags de virtualización |
| `lscpu` | Información detallada de la CPU incluyendo virtualización |
| `dmesg \| grep -i iommu` | Verificar estado de IOMMU (VT-d/AMD-Vi) |
| `cat /proc/cpuinfo \| grep -E 'ept|npt'` | Verificar Extended Page Tables |

## Módulos del Kernel KVM

| Comando | Descripción |
|---|---|
| `lsmod \| grep kvm` | Listar módulos KVM cargados |
| `modprobe kvm` | Cargar módulo principal KVM |
| `modprobe kvm-intel` | Cargar módulo KVM para Intel |
| `modprobe kvm-amd` | Cargar módulo KVM para AMD |
| `modprobe vhost-net` | Cargar aceleración de red vhost |
| `ls -la /dev/kvm` | Verificar dispositivo KVM disponible |
| `modinfo kvm` | Información del módulo KVM |

## IOMMU y Device Passthrough

| Comando | Descripción |
|---|---|
| `find /sys/kernel/iommu_groups/ -type l` | Listar grupos IOMMU |
| `lspci -vvv \| grep -i "single root"` | Verificar soporte SR-IOV |
| `echo N > /sys/class/net/eth0/device/sriov_numvfs` | Crear N funciones virtuales SR-IOV |
| `echo "vfio-pci" > /sys/.../driver_override` | Asignar driver VFIO a un dispositivo |

## Open vSwitch (OVS)

| Comando | Descripción |
|---|---|
| `ovs-vsctl add-br br0` | Crear bridge OVS |
| `ovs-vsctl add-port br0 eth0` | Añadir puerto al bridge |
| `ovs-vsctl show` | Mostrar configuración OVS |
| `ovs-vsctl del-br br0` | Eliminar bridge OVS |
| `ovs-ofctl dump-flows br0` | Ver reglas OpenFlow |

## Archivos y Rutas Importantes

| Ruta | Descripción |
|---|---|
| `/proc/cpuinfo` | Flags de CPU (vmx, svm, ept) |
| `/dev/kvm` | Dispositivo KVM |
| `/sys/kernel/iommu_groups/` | Grupos IOMMU del sistema |
| `/sys/module/kvm/` | Parámetros del módulo KVM |
| `/sys/class/net/<iface>/device/sriov_numvfs` | Control SR-IOV por interfaz |
| `/etc/modprobe.d/` | Configuración persistente de módulos |
| `/etc/default/grub` | Parámetros del kernel (intel_iommu=on) |

## Parámetros del Kernel

| Parámetro | Descripción |
|---|---|
| `intel_iommu=on` | Activar IOMMU Intel en el arranque |
| `amd_iommu=on` | Activar IOMMU AMD en el arranque |
| `iommu=pt` | Modo passthrough para rendimiento |
| `kvm.nested=1` | Habilitar virtualización anidada |
