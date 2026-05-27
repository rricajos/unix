---
title: "351.4 - Ejercicios: Libvirt"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.4"
peso: 9
tags:
  - lpic-3
  - tema-351
  - ejercicios
  - libvirt
  - virsh
---

# Ejercicios - 351.4 Libvirt

### Pregunta 1
¿Cuál es la diferencia entre `virsh define` y `virsh create`?

a) `define` arranca la VM inmediatamente, `create` solo la registra
b) `define` registra la VM de forma persistente, `create` la arranca como transitoria
c) No hay diferencia, son sinónimos
d) `define` se usa para KVM y `create` para Xen

<details><summary>Respuesta</summary>

**b) `define` registra la VM de forma persistente, `create` la arranca como transitoria**

`virsh define` lee un XML y registra la VM de forma persistente (sobrevive reinicios del host) pero no la arranca. `virsh create` arranca la VM inmediatamente pero es transitoria: desaparece al apagarse.
</details>

### Pregunta 2
¿Qué URI se utiliza para conectar a KVM/QEMU local con privilegios de sistema?

a) `kvm:///local`
b) `qemu:///session`
c) `qemu:///system`
d) `qemu://localhost/system`

<details><summary>Respuesta</summary>

**c) `qemu:///system`**

`qemu:///system` conecta al demonio libvirtd local con privilegios de sistema (root). `qemu:///session` conecta como usuario sin privilegios. La triple barra `///` indica conexión local.
</details>

### Pregunta 3
¿Qué comando muestra los discos asignados a una VM?

a) `virsh disk-list mi-vm`
b) `virsh domblklist mi-vm`
c) `virsh show-disks mi-vm`
d) `virsh vol-list mi-vm`

<details><summary>Respuesta</summary>

**b) `virsh domblklist mi-vm`**

`virsh domblklist` lista los dispositivos de bloque (discos) asignados a un dominio. `virsh vol-list` lista volúmenes de un storage pool, no discos de una VM específica.
</details>

### Pregunta 4
¿Qué opción de `virsh migrate` permite migrar una VM sin almacenamiento compartido?

a) `--live`
b) `--copy-storage-all`
c) `--p2p`
d) `--tunnelled`

<details><summary>Respuesta</summary>

**b) `--copy-storage-all`**

`--copy-storage-all` copia los discos de la VM al host destino durante la migración, eliminando la necesidad de almacenamiento compartido. `--live` mantiene la VM funcionando durante la migración pero requiere almacenamiento compartido por sí solo.
</details>

### Pregunta 5
¿Qué hace `virsh undefine mi-vm` por defecto?

a) Apaga y elimina la VM y sus discos
b) Elimina la definición XML de la VM pero NO borra los discos
c) Solo apaga la VM
d) Elimina la VM, sus discos y sus snapshots

<details><summary>Respuesta</summary>

**b) Elimina la definición XML de la VM pero NO borra los discos**

`virsh undefine` solo elimina la definición (archivo XML) de la VM. Los discos permanecen en el sistema. Para eliminar también los discos se debe usar `virsh undefine mi-vm --remove-all-storage`.
</details>

### Pregunta 6
¿Cuál es el directorio por defecto donde libvirt almacena las imágenes de disco?

a) `/etc/libvirt/images/`
b) `/var/lib/libvirt/images/`
c) `/opt/libvirt/disks/`
d) `/var/lib/qemu/images/`

<details><summary>Respuesta</summary>

**b) `/var/lib/libvirt/images/`**

Este directorio es el storage pool predeterminado (llamado "default") de libvirt. Las definiciones XML de las VMs se almacenan en `/etc/libvirt/qemu/`.
</details>

### Pregunta 7
¿Qué herramienta permite crear una VM de forma automatizada especificando parámetros en la línea de comandos?

a) `virsh create`
b) `virt-manager`
c) `virt-install`
d) `virt-builder`

<details><summary>Respuesta</summary>

**c) `virt-install`**

`virt-install` permite crear VMs de forma automatizada desde la línea de comandos, especificando nombre, RAM, disco, fuente de instalación, red, etc. Es ideal para scripts y aprovisionamiento automatizado.
</details>

### Pregunta 8
¿Qué tipo de red virtual libvirt proporciona acceso a la red externa a través de NAT?

a) Bridge
b) Isolated
c) NAT (forward mode='nat')
d) Macvtap

<details><summary>Respuesta</summary>

**c) NAT (forward mode='nat')**

La red NAT es la red por defecto en libvirt (`default`, usando `virbr0`). Las VMs obtienen IPs privadas y acceden a la red externa a través de NAT. Bridge conecta directamente al bridge del host. Isolated no tiene salida al exterior.
</details>

### Pregunta 9
¿Qué comando crea un snapshot de una VM con nombre y descripción?

a) `virsh snapshot mi-vm --name snap1`
b) `virsh snapshot-create mi-vm snap1`
c) `virsh snapshot-create-as mi-vm --name snap1 --description "descripcion"`
d) `virsh save mi-vm snap1`

<details><summary>Respuesta</summary>

**c) `virsh snapshot-create-as mi-vm --name snap1 --description "descripcion"`**

`snapshot-create-as` permite crear un snapshot especificando nombre y descripción directamente en la línea de comandos. `snapshot-create` acepta un XML. `virsh save` guarda el estado de la VM a un archivo (no es un snapshot).
</details>

### Pregunta 10
¿Qué diferencia hay entre `qemu:///system` y `qemu:///session`?

a) `system` solo funciona localmente, `session` permite conexiones remotas
b) `system` ejecuta VMs como root con acceso a redes bridge, `session` como usuario con red NAT
c) `system` es para producción, `session` es para pruebas
d) No hay diferencia funcional, solo organizativa

<details><summary>Respuesta</summary>

**b) `system` ejecuta VMs como root con acceso a redes bridge, `session` como usuario con red NAT**

`qemu:///system` se conecta al demonio libvirtd que ejecuta como root, permitiendo acceso a redes bridge, storage pools del sistema, etc. `qemu:///session` ejecuta un proceso libvirt como usuario normal, limitado a red NAT (slirp) y almacenamiento en el directorio del usuario.
</details>
