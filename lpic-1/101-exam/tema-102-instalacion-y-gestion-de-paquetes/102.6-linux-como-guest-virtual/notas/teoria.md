# 102.6 - Linux como sistema guest de virtualizacion: Teoria

## Introduccion

La virtualizacion permite ejecutar multiples sistemas operativos simultaneamente sobre un mismo hardware fisico. Comprender como Linux funciona como sistema invitado (guest) en entornos virtualizados y en la nube es fundamental para la administracion moderna de sistemas.

---

## 1. Conceptos basicos de virtualizacion

### Que es la virtualizacion

La virtualizacion es la tecnologia que permite crear versiones virtuales (no fisicas) de recursos de hardware: servidores, almacenamiento, redes, etc. Esto permite ejecutar multiples sistemas operativos aislados sobre una misma maquina fisica.

### Terminologia esencial

| Termino | Definicion |
|---------|-----------|
| **Host (anfitrion)** | Sistema fisico que ejecuta el software de virtualizacion |
| **Guest (invitado)** | Sistema operativo que se ejecuta dentro de la maquina virtual |
| **Hipervisor** | Software que gestiona las maquinas virtuales |
| **Maquina Virtual (VM)** | Emulacion por software de un ordenador completo |
| **Contenedor** | Entorno aislado que comparte el kernel del host |

---

## 2. Tipos de hipervisores

### Hipervisor Tipo 1 (Bare Metal)

Se ejecuta directamente sobre el hardware, sin necesidad de un sistema operativo intermedio.

```
+--------+  +--------+  +--------+
| Guest  |  | Guest  |  | Guest  |
|  OS 1  |  |  OS 2  |  |  OS 3  |
+--------+  +--------+  +--------+
+------------------------------------+
|     Hipervisor (Tipo 1)            |
+------------------------------------+
|          Hardware fisico           |
+------------------------------------+
```

**Ejemplos:**
- **KVM** (Kernel-based Virtual Machine) - integrado en el kernel Linux
- **Xen** - hipervisor de codigo abierto
- **VMware ESXi** - solucion empresarial de VMware
- **Microsoft Hyper-V** - solucion de Microsoft

**Caracteristicas:**
- Mayor rendimiento (acceso directo al hardware)
- Menor sobrecarga (overhead)
- Usado en servidores y centros de datos
- KVM convierte al kernel Linux en un hipervisor Tipo 1

### Hipervisor Tipo 2 (Hosted)

Se ejecuta como una aplicacion sobre un sistema operativo anfitrion existente.

```
+--------+  +--------+
| Guest  |  | Guest  |
|  OS 1  |  |  OS 2  |
+--------+  +--------+
+-----------------------------+
|   Hipervisor (Tipo 2)       |
+-----------------------------+
|   Sistema Operativo Host    |
+-----------------------------+
|     Hardware fisico          |
+-----------------------------+
```

**Ejemplos:**
- **VirtualBox** (Oracle) - codigo abierto, multiplataforma
- **VMware Workstation** / **VMware Player** - solucion de escritorio
- **QEMU** - emulador y virtualizador (puede usarse como Tipo 1 con KVM)
- **Parallels** (macOS)

**Caracteristicas:**
- Mas facil de instalar y usar
- Mayor sobrecarga (el host OS consume recursos)
- Usado en desarrollo y pruebas
- Ideal para ejecutar otro SO en un escritorio

---

## 3. Tipos de virtualizacion

### Virtualizacion completa (Full Virtualization)

- El hardware es emulado completamente
- El guest OS no necesita modificaciones
- El guest cree que se ejecuta en hardware real
- Requiere soporte de hardware (Intel VT-x / AMD-V) para buen rendimiento
- Ejemplos: KVM, VirtualBox, VMware

### Paravirtualizacion

- El guest OS sabe que esta virtualizado
- El guest OS esta modificado para comunicarse directamente con el hipervisor
- Mejor rendimiento que la virtualizacion completa sin soporte de hardware
- Usa "hypercalls" en lugar de instrucciones privilegiadas
- Ejemplo principal: **Xen** (modo paravirtualizado)

### Virtualizacion asistida por hardware

- El procesador proporciona instrucciones especiales para virtualizacion
- Intel VT-x / AMD-V
- Permite virtualizacion completa con rendimiento cercano al nativo
- KVM requiere estas extensiones

### Comparativa

| Caracteristica | Virtualizacion completa | Paravirtualizacion | Contenedores |
|---------------|------------------------|-------------------|-------------|
| Kernel | Propio por cada guest | Propio (modificado) | Compartido con host |
| Aislamiento | Completo | Completo | Parcial (a nivel de proceso) |
| Overhead | Medio-alto | Bajo | Minimo |
| Modificacion guest | No necesaria | Si necesaria | No aplica |
| Arranque | Lento (boot completo) | Medio | Rapido (segundos) |

---

## 4. Contenedores

### Concepto

Los contenedores proporcionan aislamiento a nivel de sistema operativo. Todos los contenedores comparten el **mismo kernel** del host, pero cada uno tiene su propio espacio de usuario (sistema de archivos, procesos, red, etc.).

```
+----------+  +----------+  +----------+
| App A    |  | App B    |  | App C    |
| Libs A   |  | Libs B   |  | Libs C   |
+----------+  +----------+  +----------+
+------------------------------------------+
|        Motor de contenedores             |
|        (Docker, LXC, containerd)         |
+------------------------------------------+
|        Kernel del Host Linux             |
+------------------------------------------+
|           Hardware fisico                |
+------------------------------------------+
```

### Tecnologias de contenedores

| Tecnologia | Descripcion |
|-----------|-------------|
| **LXC** (Linux Containers) | Contenedores de sistema operativo completo. Mas similar a una VM ligera |
| **Docker** | Contenedores de aplicacion. Empaqueta una aplicacion con todas sus dependencias |
| **containerd** | Runtime de contenedores de bajo nivel (usado por Docker y Kubernetes) |
| **Podman** | Alternativa a Docker sin demonio (daemonless) |

### Diferencias VM vs Contenedores

| Aspecto | Maquina Virtual | Contenedor |
|---------|----------------|-----------|
| Kernel | Propio (completo) | Compartido con el host |
| Tamano | Gigabytes | Megabytes |
| Arranque | Minutos | Segundos |
| Aislamiento | Fuerte (hardware virtual) | Medio (namespaces, cgroups) |
| Densidad | Decenas por host | Cientos/miles por host |
| Portabilidad | Imagen de disco completa | Imagen de contenedor ligera |
| Uso de recursos | Alto (SO completo) | Bajo (solo la aplicacion) |

---

## 5. Cloud Computing

### Modelos de servicio

| Modelo | Nombre | Que gestiona el proveedor | Que gestiona el usuario | Ejemplos |
|--------|--------|--------------------------|------------------------|----------|
| **IaaS** | Infrastructure as a Service | Hardware, red, almacenamiento, virtualizacion | SO, middleware, apps, datos | AWS EC2, Google Compute Engine, Azure VMs |
| **PaaS** | Platform as a Service | Todo lo de IaaS + SO, middleware | Aplicacion y datos | Heroku, Google App Engine, Azure App Service |
| **SaaS** | Software as a Service | Todo (infraestructura + aplicacion) | Solo usar la aplicacion | Gmail, Office 365, Salesforce |

```
                 Responsabilidad del usuario
                 <------------------------->

IaaS:    [Hardware | Virt | SO | Middleware | App | Datos]
          Proveedor-------->  Usuario-------------------->

PaaS:    [Hardware | Virt | SO | Middleware | App | Datos]
          Proveedor--------------------->  Usuario------->

SaaS:    [Hardware | Virt | SO | Middleware | App | Datos]
          Proveedor------------------------------------>
```

### Conceptos clave de IaaS para Linux

- **Instancias**: Maquinas virtuales en la nube
- **Imagenes**: Plantillas de SO preconfiguradas (AMI en AWS)
- **Almacenamiento en bloque**: Discos virtuales adjuntables (EBS en AWS)
- **Red virtual**: VPC, subredes, firewalls, IPs publicas
- **Autoescalado**: Crear/destruir instancias automaticamente segun demanda
- **cloud-init**: Herramienta para configuracion automatica de instancias al primer arranque

---

## 6. Linux como sistema guest

### Consideraciones especiales

Cuando Linux se ejecuta como sistema invitado en una maquina virtual, hay consideraciones especificas:

#### Controladores paravirtualizados (virtio)

- Los discos y la red virtuales usan controladores especiales para mejor rendimiento
- **virtio** es el estandar en KVM/QEMU:
  - `virtio-blk` / `virtio-scsi` - discos
  - `virtio-net` - red
  - `virtio-balloon` - gestion de memoria
- El kernel Linux incluye soporte para virtio de forma nativa

#### Deteccion de virtualizacion

El sistema guest puede detectar si esta virtualizado:

```bash
# Detectar si se ejecuta en una VM
systemd-detect-virt

# Salida posible: kvm, vmware, oracle (VirtualBox), xen, microsoft, none
```

Tambien se puede revisar en:
```bash
cat /sys/class/dmi/id/product_name
# o
dmidecode -s system-product-name
```

#### Reloj del sistema

- El reloj de la VM puede desviarse del real
- Es importante configurar sincronizacion NTP o usar el reloj del hipervisor
- En algunos hipervisores, el guest puede leer el reloj del host directamente

---

## 7. Guest Additions / Guest Tools

Son herramientas que se instalan en el sistema guest para mejorar la integracion con el hipervisor.

### VirtualBox Guest Additions

- Mejoran el rendimiento grafico (controlador de video)
- Permiten carpetas compartidas entre host y guest
- Portapapeles compartido
- Redimensionado automatico de la ventana
- Sincronizacion del reloj

Instalacion:
```bash
# Desde el menu de VirtualBox: Dispositivos -> Insertar imagen de CD de Guest Additions
mount /dev/cdrom /mnt
cd /mnt
./VBoxLinuxAdditions.run
```

### VMware Tools / open-vm-tools

- Mejoran el rendimiento
- Permiten carpetas compartidas
- Copiar/pegar entre host y guest
- Sincronizacion del reloj
- `open-vm-tools` es la version de codigo abierto incluida en muchas distros

```bash
# Instalar open-vm-tools
apt install open-vm-tools         # Debian/Ubuntu
yum install open-vm-tools         # Red Hat/CentOS
```

### QEMU Guest Agent

- Comunicacion entre el host y el guest en entornos KVM/QEMU
- Permite operaciones como: congelar el sistema de archivos, obtener informacion del guest, apagado limpio

```bash
apt install qemu-guest-agent      # Debian/Ubuntu
yum install qemu-guest-agent      # Red Hat/CentOS
systemctl enable --now qemu-guest-agent
```

---

## 8. Clonacion de maquinas virtuales

### Problemas de la clonacion

Al clonar una VM, el clon es una copia exacta del original, lo que genera conflictos:

| Problema | Descripcion | Solucion |
|----------|-------------|---------|
| **Machine ID** | `/etc/machine-id` duplicado | Regenerar: `rm /etc/machine-id && systemd-machine-id-setup` |
| **Direccion MAC** | MAC de la interfaz de red duplicada | El hipervisor genera una nueva MAC al clonar |
| **Claves SSH del host** | Mismas claves SSH en ambas maquinas | Regenerar: `rm /etc/ssh/ssh_host_* && dpkg-reconfigure openssh-server` |
| **UUID de sistema de archivos** | UUIDs de particiones duplicados | Generar nuevos UUIDs con `tune2fs -U random /dev/sdX` |
| **Hostname** | Mismo nombre de host | Cambiar con `hostnamectl set-hostname nuevo-nombre` |
| **Direccion IP** | Si IP es estatica, sera duplicada | Asignar nueva IP o usar DHCP |

### Plantillas (Templates)

- Una plantilla es una VM preconfigurada y "limpia" preparada para ser clonada
- Se deben generalizar antes de convertir en plantilla:
  - Eliminar `/etc/machine-id`
  - Eliminar claves SSH del host
  - Eliminar logs y archivos temporales
  - Herramientas como `virt-sysprep` automatizan este proceso

---

## 9. D-Bus y comunicacion con el hipervisor

### Que es D-Bus

D-Bus (Desktop Bus) es un sistema de comunicacion entre procesos (IPC) usado en Linux. Permite que diferentes aplicaciones y servicios del sistema se comuniquen entre si.

### Tipos de buses D-Bus

| Tipo | Descripcion | Ejemplo |
|------|-------------|---------|
| **System Bus** | Comunicacion entre servicios del sistema | Servicios del hipervisor, systemd |
| **Session Bus** | Comunicacion entre aplicaciones del usuario | Aplicaciones de escritorio |

### D-Bus en el contexto de virtualizacion

- El hipervisor puede comunicarse con el guest a traves de D-Bus
- Los guest agents (qemu-guest-agent, open-vm-tools) usan D-Bus para:
  - Recibir solicitudes del hipervisor (apagar, congelar FS)
  - Reportar informacion del guest al hipervisor (IP, memoria, disco)
  - Coordinar eventos (resize de disco, cambios de red)

### Herramientas D-Bus

```bash
# Ver mensajes del system bus
dbus-monitor --system

# Listar servicios disponibles
busctl list

# Enviar un mensaje D-Bus
dbus-send --system --dest=org.freedesktop.hostname1 \
  /org/freedesktop/hostname1 \
  org.freedesktop.DBus.Properties.Get \
  string:"org.freedesktop.hostname1" string:"Hostname"
```

---

## 10. cloud-init

Herramienta estandar para la configuracion automatica de instancias en la nube durante el primer arranque.

### Funciones principales

- Configurar hostname
- Crear usuarios y establecer claves SSH
- Configurar red
- Ejecutar scripts personalizados
- Instalar paquetes
- Montar sistemas de archivos

### Archivo de configuracion

```yaml
#cloud-config
hostname: mi-servidor
users:
  - name: admin
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAA...
packages:
  - nginx
  - git
runcmd:
  - systemctl enable --now nginx
```

---

## Resumen para el examen

1. **Hipervisor Tipo 1** (bare metal): KVM, Xen, ESXi. **Tipo 2** (hosted): VirtualBox, VMware Workstation.
2. **Virtualizacion completa**: guest sin modificar. **Paravirtualizacion**: guest modificado para comunicarse con hipervisor.
3. **Contenedores** (Docker, LXC) comparten el kernel del host; las **VMs** tienen su propio kernel.
4. **IaaS** = infraestructura; **PaaS** = plataforma; **SaaS** = software completo.
5. **Guest additions/tools** mejoran la integracion: rendimiento, carpetas compartidas, reloj.
6. Al **clonar** una VM, regenerar: machine-id, claves SSH, MAC, hostname.
7. **D-Bus** permite la comunicacion entre procesos y con el hipervisor.
8. **cloud-init** configura instancias automaticamente en el primer arranque.
9. `systemd-detect-virt` detecta si el sistema esta virtualizado y que hipervisor usa.
