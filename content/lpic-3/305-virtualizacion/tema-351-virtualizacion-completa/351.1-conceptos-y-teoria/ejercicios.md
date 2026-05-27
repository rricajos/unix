---
title: "351.1 - Ejercicios: Conceptos y Teoría"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.1"
peso: 6
tags:
  - lpic-3
  - tema-351
  - ejercicios
  - virtualizacion
  - kvm
---

# Ejercicios - 351.1 Conceptos y Teoría

### Pregunta 1
¿Qué tipo de hipervisor se ejecuta directamente sobre el hardware sin un sistema operativo anfitrión?

a) Hipervisor Tipo 2
b) Hipervisor Tipo 1
c) Hipervisor Tipo 3
d) Hipervisor Hosted

<details><summary>Respuesta</summary>

**b) Hipervisor Tipo 1**

Los hipervisores Tipo 1 (bare-metal) se ejecutan directamente sobre el hardware. Ejemplos: Xen, VMware ESXi, KVM. Los Tipo 2 se ejecutan como aplicación dentro de un SO anfitrión.
</details>

### Pregunta 2
¿Qué comando permite verificar si un procesador Intel soporta virtualización por hardware?

a) `grep -c svm /proc/cpuinfo`
b) `lsmod | grep vt-x`
c) `grep -c vmx /proc/cpuinfo`
d) `cat /sys/kernel/kvm/enabled`

<details><summary>Respuesta</summary>

**c) `grep -c vmx /proc/cpuinfo`**

La flag `vmx` en `/proc/cpuinfo` indica soporte Intel VT-x. La flag `svm` corresponde a AMD-V. Ambas son necesarias para usar KVM.
</details>

### Pregunta 3
¿Qué módulo del kernel proporciona aceleración de red moviendo el procesamiento de paquetes del espacio de usuario al kernel?

a) `kvm-intel`
b) `virtio-net`
c) `vhost-net`
d) `bridge`

<details><summary>Respuesta</summary>

**c) `vhost-net`**

El módulo `vhost-net` mueve el procesamiento de paquetes de red de QEMU (espacio de usuario) al kernel, reduciendo latencia y consumo de CPU significativamente.
</details>

### Pregunta 4
¿Qué tecnología permite que un único dispositivo PCI físico se presente como múltiples dispositivos virtuales independientes?

a) VT-d
b) IOMMU
c) PCI Passthrough
d) SR-IOV

<details><summary>Respuesta</summary>

**d) SR-IOV**

SR-IOV (Single Root I/O Virtualization) permite que un dispositivo físico (Physical Function) genere múltiples Virtual Functions que se asignan directamente a las VMs. VT-d/IOMMU permiten passthrough de dispositivos completos.
</details>

### Pregunta 5
¿Cuál es la diferencia principal entre paravirtualización y virtualización completa?

a) La paravirtualización requiere hardware VT-x, la completa no
b) La paravirtualización requiere que el SO guest sea modificado o use drivers especiales
c) La virtualización completa ofrece mejor rendimiento que la paravirtualización
d) La paravirtualización solo funciona con hipervisores Tipo 2

<details><summary>Respuesta</summary>

**b) La paravirtualización requiere que el SO guest sea modificado o use drivers especiales**

En paravirtualización, el guest es consciente del hipervisor y usa hypercalls para comunicarse directamente. Esto requiere modificaciones en el kernel o drivers PV (como virtio), pero ofrece mejor rendimiento que la virtualización completa pura.
</details>

### Pregunta 6
¿Cómo se clasifica KVM en términos de tipo de hipervisor?

a) Tipo 2, ya que se ejecuta sobre Linux
b) Tipo 1, ya que convierte el kernel Linux en hipervisor
c) Tipo 1.5, categoría híbrida
d) Depende de si se usa con QEMU o sin él

<details><summary>Respuesta</summary>

**b) Tipo 1, ya que convierte el kernel Linux en hipervisor**

Aunque KVM se ejecuta sobre un kernel Linux, al cargarse como módulo (`kvm.ko`) convierte el propio kernel en un hipervisor bare-metal, clasificándose como Tipo 1. El kernel Linux pasa a ser el hipervisor.
</details>

### Pregunta 7
¿Qué mecanismo de gestión de memoria utiliza traducción de direcciones en hardware con dos niveles de tablas de páginas?

a) Shadow Page Tables
b) Balloon Driver
c) EPT (Extended Page Tables)
d) KSM (Kernel Same-page Merging)

<details><summary>Respuesta</summary>

**c) EPT (Extended Page Tables)**

EPT (Intel) y NPT/RVI (AMD) realizan la traducción de direcciones Guest Virtual → Guest Physical → Host Physical directamente en hardware, con mejor rendimiento que las Shadow Page Tables que lo hacen por software.
</details>

### Pregunta 8
¿Qué parámetro debe añadirse a la línea de arranque del kernel para activar IOMMU en sistemas Intel?

a) `kvm.iommu=on`
b) `intel_iommu=on`
c) `iommu=intel`
d) `vt-d=enable`

<details><summary>Respuesta</summary>

**b) `intel_iommu=on`**

Se añade en `/etc/default/grub` en la variable `GRUB_CMDLINE_LINUX`. Para AMD se usa `amd_iommu=on`. Adicionalmente `iommu=pt` mejora el rendimiento en modo passthrough.
</details>

### Pregunta 9
¿Cuál de las siguientes afirmaciones sobre QEMU es correcta?

a) QEMU solo puede funcionar como virtualizador, nunca como emulador
b) QEMU requiere siempre extensiones de hardware VT-x/AMD-V
c) QEMU puede emular arquitecturas diferentes a la del host sin necesidad de KVM
d) QEMU es un hipervisor Tipo 1 por sí mismo

<details><summary>Respuesta</summary>

**c) QEMU puede emular arquitecturas diferentes a la del host sin necesidad de KVM**

QEMU funciona como emulador puro (traduciendo instrucciones de cualquier arquitectura por software) o como virtualizador con KVM (ejecutando código nativo para la misma arquitectura). Sin KVM es mucho más lento pero puede emular ARM en x86, por ejemplo.
</details>

### Pregunta 10
¿Qué comando muestra la configuración actual de un switch Open vSwitch?

a) `ovs-vsctl list-bridges`
b) `ovs-vsctl show`
c) `ovs-ofctl show br0`
d) `brctl show`

<details><summary>Respuesta</summary>

**b) `ovs-vsctl show`**

`ovs-vsctl show` muestra la configuración completa de OVS incluyendo bridges, puertos e interfaces. `brctl show` es para bridges Linux estándar, no para OVS. `ovs-ofctl` gestiona reglas OpenFlow.
</details>
