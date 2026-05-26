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

## Ejercicio 1
**Explica la diferencia entre un hipervisor Tipo 1 y un hipervisor Tipo 2. Da dos ejemplos de cada tipo.**

<details>
<summary>Ver respuesta</summary>

**Hipervisor Tipo 1 (Bare Metal)**:
- Se ejecuta **directamente sobre el hardware**, sin un sistema operativo intermedio.
- Ofrece mejor rendimiento y menor sobrecarga.
- Usado en servidores y centros de datos.
- Ejemplos: **KVM** (integrado en el kernel Linux), **Xen**, VMware ESXi, Microsoft Hyper-V.

**Hipervisor Tipo 2 (Hosted)**:
- Se ejecuta **como una aplicacion** sobre un sistema operativo anfitrion ya instalado.
- Mayor sobrecarga porque debe pasar a traves del SO host.
- Usado en desarrollo, pruebas y escritorios.
- Ejemplos: **VirtualBox** (Oracle), **VMware Workstation**, VMware Player, Parallels.

**Nota sobre KVM**: Aunque KVM convierte al kernel Linux en un hipervisor, se considera Tipo 1 porque el hipervisor es parte del propio kernel que se ejecuta directamente sobre el hardware.
</details>

---

## Ejercicio 2
**Cual es la diferencia entre virtualizacion completa, paravirtualizacion y contenedores? Que tecnologia representa cada tipo?**

<details>
<summary>Ver respuesta</summary>

| Tipo | Descripcion | Tecnologias |
|------|-------------|-------------|
| **Virtualizacion completa** | El hardware se emula completamente. El guest OS no necesita modificaciones y cree que esta en hardware real. | KVM, VirtualBox, VMware |
| **Paravirtualizacion** | El guest OS esta **modificado** para saber que esta virtualizado. Se comunica directamente con el hipervisor mediante "hypercalls". Mejor rendimiento. | Xen (modo paravirtualizado) |
| **Contenedores** | No virtualizan hardware. Los contenedores **comparten el kernel del host** y solo aislan el espacio de usuario. Arranque rapido y menor consumo de recursos. | Docker, LXC, Podman |

Diferencias clave:
- VM (completa/para): cada guest tiene su **propio kernel**
- Contenedor: todos comparten el **mismo kernel** del host
- Virtualizacion completa: guest **sin modificar**
- Paravirtualizacion: guest **modificado** para mejor rendimiento
</details>

---

## Ejercicio 3
**Explica las diferencias entre IaaS, PaaS y SaaS. Da un ejemplo practico de cada uno.**

<details>
<summary>Ver respuesta</summary>

| Modelo | Que gestiona el proveedor | Que gestiona el usuario | Ejemplo |
|--------|--------------------------|------------------------|---------|
| **IaaS** (Infrastructure as a Service) | Hardware, red, almacenamiento, virtualizacion | Sistema operativo, aplicaciones, datos | **AWS EC2**: el proveedor da una VM; tu instalas el SO, configuras todo e instalas tus aplicaciones |
| **PaaS** (Platform as a Service) | Todo lo de IaaS + SO + middleware + runtime | Solo la aplicacion y los datos | **Heroku**: subes tu codigo y la plataforma lo ejecuta; no te preocupas del servidor ni del SO |
| **SaaS** (Software as a Service) | Todo (infraestructura + aplicacion) | Solo usar la aplicacion | **Gmail**: usas el correo electronico sin gestionar nada de la infraestructura |

**Analogia**:
- IaaS = te dan el terreno y los materiales; tu construyes la casa
- PaaS = te dan la casa; tu pones los muebles (tu aplicacion)
- SaaS = te dan la casa amueblada; solo entras y la usas
</details>

---

## Ejercicio 4
**Has clonado una maquina virtual Linux. Que elementos debes cambiar o regenerar en el clon para evitar conflictos? Escribe los comandos necesarios.**

<details>
<summary>Ver respuesta</summary>

Al clonar una VM, los siguientes elementos son identicos al original y deben cambiarse:

**1. Machine ID:**
```bash
rm /etc/machine-id
systemd-machine-id-setup
```

**2. Hostname:**
```bash
hostnamectl set-hostname nuevo-nombre
# O editar /etc/hostname y /etc/hosts
```

**3. Claves SSH del host:**
```bash
rm /etc/ssh/ssh_host_*
ssh-keygen -A
# O: dpkg-reconfigure openssh-server (Debian)
systemctl restart sshd
```

**4. Direccion MAC:** Generalmente el hipervisor asigna una nueva MAC automaticamente al clonar. Si no, se debe cambiar manualmente en la configuracion de la VM.

**5. IP estatica:** Si la VM tenia IP estatica, cambiarla para evitar conflictos en la red.

**6. UUIDs del sistema de archivos** (si es necesario):
```bash
tune2fs -U random /dev/sda1
```

La herramienta `virt-sysprep` puede automatizar todas estas tareas.
</details>

---

## Ejercicio 5
**Que son las guest additions (o guest tools)? Nombra las equivalentes para VirtualBox, VMware y KVM, y describe al menos tres funcionalidades que proporcionan.**

<details>
<summary>Ver respuesta</summary>

Las **guest additions/tools** son paquetes de software que se instalan dentro del sistema guest para mejorar la integracion y el rendimiento con el hipervisor.

| Hipervisor | Herramienta |
|-----------|-------------|
| VirtualBox | **VirtualBox Guest Additions** |
| VMware | **VMware Tools** / **open-vm-tools** (version de codigo abierto) |
| KVM/QEMU | **QEMU Guest Agent** (`qemu-guest-agent`) |

Funcionalidades que proporcionan:

1. **Mejora del rendimiento grafico**: Controladores de video optimizados que permiten aceleracion grafica y resoluciones altas.

2. **Carpetas compartidas**: Permiten compartir directorios entre el sistema host y el guest, facilitando la transferencia de archivos.

3. **Portapapeles compartido**: Copiar y pegar texto e imagenes entre host y guest.

4. **Sincronizacion del reloj**: Mantienen el reloj del guest sincronizado con el host.

5. **Redimensionado automatico**: La resolucion del guest se ajusta al tamano de la ventana.

6. **Apagado limpio**: El hipervisor puede solicitar un apagado ordenado del guest.

7. **Informacion del guest**: El hipervisor puede consultar IP, memoria y estado del guest.
</details>

---

## Ejercicio 6
**Que comando usarias para verificar si un sistema Linux se esta ejecutando en una maquina virtual? Que resultado esperarias en un sistema fisico?**

<details>
<summary>Ver respuesta</summary>

El comando principal es:
```bash
systemd-detect-virt
```

Resultados posibles:

| Salida | Significado |
|--------|-------------|
| `kvm` | Se ejecuta en KVM/QEMU |
| `vmware` | Se ejecuta en VMware |
| `oracle` | Se ejecuta en VirtualBox |
| `xen` | Se ejecuta en Xen |
| `microsoft` | Se ejecuta en Hyper-V |
| `docker` | Se ejecuta en un contenedor Docker |
| `lxc` | Se ejecuta en un contenedor LXC |
| **`none`** | Sistema fisico (no virtualizado) |

En un **sistema fisico**, la salida seria **`none`** y el codigo de retorno seria 1 (error, lo que indica "no virtualizado").

Otros comandos utiles:
```bash
hostnamectl                              # Muestra "Virtualization: kvm" si aplica
lscpu | grep "Hypervisor vendor"         # Muestra el tipo de hipervisor
cat /sys/class/dmi/id/product_name       # Nombre del producto
dmidecode -s system-product-name         # Requiere root
```
</details>

---

## Ejercicio 7
**Que es D-Bus y que papel juega en el contexto de la virtualizacion? Describe los dos tipos de buses D-Bus.**

<details>
<summary>Ver respuesta</summary>

**D-Bus** (Desktop Bus) es un sistema de **comunicacion entre procesos (IPC)** en Linux. Permite que diferentes aplicaciones y servicios del sistema intercambien mensajes de forma estandarizada.

**Papel en la virtualizacion:**
- Los **guest agents** (como qemu-guest-agent, open-vm-tools) utilizan D-Bus para comunicarse con el hipervisor.
- Permite al hipervisor: solicitar apagados limpios, congelar el sistema de archivos para backups, obtener informacion del guest (IP, uso de memoria), y coordinar eventos como redimensionado de discos.

**Dos tipos de buses D-Bus:**

1. **System Bus** (bus del sistema):
   - Unico para todo el sistema
   - Comunicacion entre servicios del sistema y del kernel
   - Usado por systemd, guest agents, NetworkManager
   - Accesible por todos los usuarios (con restricciones de permisos)

2. **Session Bus** (bus de sesion):
   - Uno por cada sesion de usuario
   - Comunicacion entre aplicaciones del escritorio del usuario
   - Usado por aplicaciones graficas, notificaciones
   - Solo accesible dentro de la sesion del usuario

Comandos para inspeccionar D-Bus:
```bash
busctl list                    # Listar servicios
dbus-monitor --system          # Monitorizar bus del sistema
dbus-monitor --session         # Monitorizar bus de sesion
```
</details>

---

## Ejercicio 8
**Describe que es cloud-init y para que se utiliza. Escribe un ejemplo basico de archivo de configuracion cloud-config que establezca el hostname, cree un usuario con acceso sudo y instale dos paquetes.**

<details>
<summary>Ver respuesta</summary>

**cloud-init** es una herramienta estandar en la industria para la **configuracion automatica de instancias en la nube** durante el primer arranque. Es compatible con los principales proveedores de IaaS (AWS, Azure, Google Cloud, OpenStack).

Funciones principales:
- Establecer el hostname
- Crear usuarios y configurar claves SSH
- Instalar paquetes
- Ejecutar scripts
- Configurar la red
- Montar sistemas de archivos

Ejemplo de archivo `cloud-config`:

```yaml
#cloud-config
hostname: servidor-web-01

users:
  - name: admin
    groups: sudo
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAAB3NzaC1yc2EAAAA... usuario@equipo

packages:
  - nginx
  - git

runcmd:
  - systemctl enable --now nginx
```

Este archivo:
1. Establece el hostname como `servidor-web-01`
2. Crea un usuario `admin` con acceso sudo sin contrasena
3. Configura una clave SSH publica para acceso remoto
4. Instala los paquetes `nginx` y `git`
5. Habilita e inicia el servicio nginx

La primera linea `#cloud-config` es obligatoria e indica el formato del archivo.
</details>
