---
title: "102.6 - Linux como sistema guest de virtualizacion: Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.6"
---

# 102.6 - Linux como sistema guest de virtualizacion: Ejercicios

### Pregunta 1

Cual de las siguientes afirmaciones describe correctamente un hipervisor Tipo 1 (Bare Metal)?

a) Se ejecuta como una aplicacion sobre un sistema operativo anfitrion ya instalado
b) Se ejecuta directamente sobre el hardware sin un sistema operativo intermedio
c) Solo puede ejecutar contenedores, no maquinas virtuales completas
d) Requiere un sistema operativo Windows como base

<details><summary>Respuesta</summary>

**b) Se ejecuta directamente sobre el hardware sin un sistema operativo intermedio**

Un hipervisor Tipo 1 (Bare Metal) se ejecuta directamente sobre el hardware fisico, ofreciendo mejor rendimiento y menor sobrecarga. Ejemplos incluyen KVM (integrado en el kernel Linux), Xen, VMware ESXi y Microsoft Hyper-V. Un hipervisor Tipo 2 (Hosted), como VirtualBox o VMware Workstation, se ejecuta como una aplicacion sobre un sistema operativo ya instalado, con mayor sobrecarga. KVM se considera Tipo 1 porque convierte al kernel Linux en un hipervisor que opera directamente sobre el hardware.

</details>

---

### Pregunta 2

Cual es la diferencia fundamental entre una maquina virtual y un contenedor?

a) Las maquinas virtuales son mas ligeras y rapidas que los contenedores
b) Los contenedores comparten el kernel del host mientras que cada VM tiene su propio kernel
c) Los contenedores proporcionan mayor aislamiento que las maquinas virtuales
d) Las maquinas virtuales solo funcionan en la nube y los contenedores solo en local

<details><summary>Respuesta</summary>

**b) Los contenedores comparten el kernel del host mientras que cada VM tiene su propio kernel**

La diferencia fundamental es que los contenedores (Docker, LXC, Podman) comparten el kernel del sistema host y solo aislan el espacio de usuario, mientras que cada maquina virtual tiene su propio kernel completo. Esto hace que los contenedores sean mas ligeros (megabytes vs gigabytes), arranquen mas rapido (segundos vs minutos) y permitan mayor densidad (cientos/miles vs decenas por host). Sin embargo, las VMs ofrecen un aislamiento mas fuerte al tener hardware virtualizado independiente.

</details>

---

### Pregunta 3

En el modelo de servicios en la nube, cual es la definicion correcta de IaaS (Infrastructure as a Service)?

a) El proveedor gestiona toda la infraestructura y la aplicacion; el usuario solo usa el software
b) El proveedor proporciona hardware, red, almacenamiento y virtualizacion; el usuario gestiona el SO y las aplicaciones
c) El proveedor gestiona la plataforma completa incluyendo el SO; el usuario solo sube su codigo
d) El usuario gestiona todo, incluyendo el hardware fisico

<details><summary>Respuesta</summary>

**b) El proveedor proporciona hardware, red, almacenamiento y virtualizacion; el usuario gestiona el SO y las aplicaciones**

En IaaS (Infrastructure as a Service), el proveedor ofrece la infraestructura basica (servidores virtuales, red, almacenamiento) y el usuario es responsable de instalar y administrar el sistema operativo, middleware, aplicaciones y datos. Ejemplos: AWS EC2, Google Compute Engine, Azure VMs. En PaaS el proveedor tambien gestiona el SO y middleware (ej: Heroku). En SaaS el proveedor gestiona todo y el usuario solo usa la aplicacion (ej: Gmail).

</details>

---

### Pregunta 4

Despues de clonar una maquina virtual Linux, cual de los siguientes elementos es imprescindible regenerar para evitar conflictos?

a) Los archivos de log en `/var/log/`
b) El archivo `/etc/machine-id` y las claves SSH del host
c) El sistema de archivos completo con `mkfs`
d) La tabla de particiones con `fdisk`

<details><summary>Respuesta</summary>

**b) El archivo `/etc/machine-id` y las claves SSH del host**

Al clonar una VM, el clon es una copia exacta del original. Es imprescindible regenerar: el machine-id (`rm /etc/machine-id && systemd-machine-id-setup`), las claves SSH del host (`rm /etc/ssh/ssh_host_* && ssh-keygen -A`), y cambiar el hostname (`hostnamectl set-hostname nuevo-nombre`). Si no se regeneran las claves SSH, los clientes recibiran advertencias de "host key changed". El machine-id duplicado causa conflictos en D-Bus, DHCP y otros servicios. La herramienta `virt-sysprep` automatiza estas tareas.

</details>

---

### Pregunta 5

Cual es la funcion principal de las guest additions / guest tools en una maquina virtual?

a) Cifrar la comunicacion entre el host y el guest
b) Permitir que la VM acceda a Internet
c) Mejorar la integracion y el rendimiento entre el hipervisor y el sistema guest
d) Convertir una VM de un formato a otro

<details><summary>Respuesta</summary>

**c) Mejorar la integracion y el rendimiento entre el hipervisor y el sistema guest**

Las guest additions/tools son paquetes de software que se instalan dentro del guest para mejorar la integracion con el hipervisor. Proporcionan: controladores graficos optimizados, carpetas compartidas entre host y guest, portapapeles compartido, sincronizacion del reloj, redimensionado automatico de ventana y apagado limpio. En VirtualBox se llaman Guest Additions, en VMware son VMware Tools (o open-vm-tools en su version libre), y en KVM/QEMU se usa el qemu-guest-agent.

</details>

---

### Pregunta 6

Que comando permite detectar si un sistema Linux se esta ejecutando dentro de una maquina virtual?

a) `uname -a`
b) `systemd-detect-virt`
c) `lsblk --virt`
d) `cat /proc/version`

<details><summary>Respuesta</summary>

**b) `systemd-detect-virt`**

El comando `systemd-detect-virt` detecta si el sistema esta virtualizado y muestra el tipo de hipervisor: `kvm` para KVM/QEMU, `vmware` para VMware, `oracle` para VirtualBox, `xen` para Xen, `microsoft` para Hyper-V, `docker` para contenedores Docker. En un sistema fisico, la salida es `none` con codigo de retorno 1. Otros metodos incluyen `hostnamectl` (que muestra "Virtualization: tipo"), `lscpu | grep "Hypervisor vendor"` y `dmidecode -s system-product-name`.

</details>

---

### Pregunta 7

Que es D-Bus en el contexto de un sistema Linux?

a) Un bus de hardware que conecta dispositivos USB al sistema
b) Un sistema de comunicacion entre procesos (IPC) que permite a aplicaciones y servicios intercambiar mensajes
c) Un controlador de disco virtual para maquinas virtuales
d) Un protocolo de red para la transferencia de datos entre host y guest

<details><summary>Respuesta</summary>

**b) Un sistema de comunicacion entre procesos (IPC) que permite a aplicaciones y servicios intercambiar mensajes**

D-Bus (Desktop Bus) es un sistema de comunicacion entre procesos en Linux. Tiene dos tipos de buses: el System Bus (unico para todo el sistema, usado por servicios como systemd y guest agents) y el Session Bus (uno por cada sesion de usuario, usado por aplicaciones de escritorio). En el contexto de virtualizacion, los guest agents (qemu-guest-agent, open-vm-tools) utilizan D-Bus para comunicarse con el hipervisor, permitiendo solicitar apagados limpios, congelar el sistema de archivos para backups y reportar informacion del guest.

</details>

---

### Pregunta 8

Que es cloud-init y cuando se ejecuta?

a) Una herramienta para crear imagenes de disco de maquinas virtuales, se ejecuta manualmente
b) Un servicio de monitorizacion de instancias en la nube, se ejecuta continuamente
c) Una herramienta de configuracion automatica de instancias en la nube que se ejecuta durante el primer arranque
d) Un gestor de paquetes especifico para entornos cloud, se ejecuta al instalar software

<details><summary>Respuesta</summary>

**c) Una herramienta de configuracion automatica de instancias en la nube que se ejecuta durante el primer arranque**

cloud-init es la herramienta estandar de la industria para la configuracion automatica de instancias en la nube durante el primer arranque. Es compatible con AWS, Azure, Google Cloud, OpenStack y otros. Permite configurar el hostname, crear usuarios con claves SSH, instalar paquetes, ejecutar scripts y configurar la red. La configuracion se escribe en formato YAML y debe comenzar con la linea `#cloud-config`. La configuracion principal se encuentra en `/etc/cloud/cloud.cfg`.

</details>

---

### Pregunta 9

Cual es la diferencia entre una imagen de disco en formato RAW y una en formato qcow2?

a) RAW solo funciona en VMware y qcow2 solo en VirtualBox
b) RAW tiene tamano fijo y mejor rendimiento, qcow2 tiene tamano dinamico y soporta snapshots
c) qcow2 tiene mejor rendimiento que RAW en todos los casos
d) RAW soporta snapshots y cifrado, qcow2 no

<details><summary>Respuesta</summary>

**b) RAW tiene tamano fijo y mejor rendimiento, qcow2 tiene tamano dinamico y soporta snapshots**

El formato RAW ocupa el tamano completo del disco virtual desde el inicio (un disco de 20 GB ocupa 20 GB en el host), ofrece mejor rendimiento por acceso directo pero no soporta snapshots ni cifrado. El formato qcow2 (Copy-On-Write) solo ocupa el espacio de los datos realmente escritos (thin provisioning), soporta snapshots, compresion y cifrado, pero tiene un rendimiento ligeramente menor. qcow2 es el formato nativo de QEMU/KVM y el mas utilizado en entornos de virtualizacion Linux.

</details>

---

### Pregunta 10

Que extensiones de hardware del procesador son necesarias para que KVM funcione?

a) SSE4 y AVX2
b) Intel VT-x o AMD-V (AMD SVM)
c) Intel Turbo Boost o AMD Precision Boost
d) HyperThreading o SMT

<details><summary>Respuesta</summary>

**b) Intel VT-x o AMD-V (AMD SVM)**

KVM (Kernel-based Virtual Machine) requiere extensiones de virtualizacion por hardware: Intel VT-x (en procesadores Intel) o AMD-V / AMD SVM (en procesadores AMD). Estas extensiones deben estar habilitadas en la configuracion del BIOS/UEFI. Se puede verificar su disponibilidad con `grep -E '(vmx|svm)' /proc/cpuinfo`, donde `vmx` indica Intel VT-x y `svm` indica AMD-V. Sin estas extensiones habilitadas, KVM no podra crear maquinas virtuales.

</details>
