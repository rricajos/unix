---
title: "351.3 - Comandos Clave: QEMU"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.3"
peso: 4
tags:
  - lpic-3
  - tema-351
  - comandos
  - qemu
  - qemu-img
---

# Comandos Clave - 351.3 QEMU

## qemu-system-x86_64

| Opción | Descripción |
|---|---|
| `-enable-kvm` | Activar aceleración KVM |
| `-accel kvm` | Forma alternativa de activar KVM |
| `-m <MB>` | Memoria RAM (ej. `-m 2048`) |
| `-smp <N>` | Número de vCPUs |
| `-cpu host` | Pasar modelo de CPU real al guest |
| `-hda <imagen>` | Disco duro primario |
| `-hdb <imagen>` | Disco duro secundario |
| `-cdrom <iso>` | Unidad de CD-ROM |
| `-boot d` | Arrancar desde CD-ROM (c=disco, n=red) |
| `-vnc :N` | Habilitar VNC en display N (puerto 5900+N) |
| `-nographic` | Sin gráficos, solo consola serial |
| `-serial stdio` | Redirigir puerto serie a terminal |
| `-daemonize` | Ejecutar como demonio |
| `-monitor stdio` | Monitor QEMU en terminal |
| `-device <tipo>` | Añadir dispositivo emulado |
| `-drive file=X,format=Y,if=Z` | Definir disco con opciones |
| `-netdev <tipo>,id=X` | Definir backend de red |
| `-spice port=N,...` | Habilitar protocolo SPICE |

## qemu-img

| Comando | Descripción |
|---|---|
| `qemu-img create -f qcow2 disco.qcow2 20G` | Crear imagen qcow2 de 20GB |
| `qemu-img create -f raw disco.raw 10G` | Crear imagen raw de 10GB |
| `qemu-img create -f qcow2 -b base.qcow2 -F qcow2 snap.qcow2` | Crear imagen con backing file |
| `qemu-img info disco.qcow2` | Mostrar información de imagen |
| `qemu-img info --backing-chain disco.qcow2` | Mostrar cadena de backing files |
| `qemu-img convert -f raw -O qcow2 in.raw out.qcow2` | Convertir de raw a qcow2 |
| `qemu-img convert -c -O qcow2 in.raw out.qcow2` | Convertir con compresión |
| `qemu-img resize disco.qcow2 +10G` | Aumentar tamaño 10GB |
| `qemu-img resize --shrink disco.qcow2 15G` | Reducir a 15GB |
| `qemu-img snapshot -c snap1 disco.qcow2` | Crear snapshot interno |
| `qemu-img snapshot -l disco.qcow2` | Listar snapshots |
| `qemu-img snapshot -a snap1 disco.qcow2` | Aplicar/revertir snapshot |
| `qemu-img snapshot -d snap1 disco.qcow2` | Eliminar snapshot |
| `qemu-img check disco.qcow2` | Verificar integridad de imagen |

## Comandos del QEMU Monitor

| Comando | Descripción |
|---|---|
| `info status` | Estado de la VM |
| `info snapshots` | Listar snapshots |
| `info block` | Info de dispositivos de bloque |
| `info network` | Info de interfaces de red |
| `savevm <nombre>` | Crear snapshot completo |
| `loadvm <nombre>` | Restaurar snapshot |
| `stop` / `cont` | Pausar / reanudar VM |
| `system_reset` | Reiniciar VM |
| `system_powerdown` | Enviar señal ACPI de apagado |
| `quit` | Cerrar QEMU |

## Formatos de Imagen Soportados

| Formato | Flag `-f` / `-O` | Uso principal |
|---|---|---|
| raw | `raw` | Máximo rendimiento |
| qcow2 | `qcow2` | Nativo QEMU, snapshots, compresión |
| vmdk | `vmdk` | Compatibilidad VMware |
| vdi | `vdi` | Compatibilidad VirtualBox |
| vhd | `vpc` | Compatibilidad Hyper-V |
