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

### Virtualizacion asistida por hardware (Intel VT-x / AMD-V)

Las extensiones de virtualizacion del procesador son instrucciones especiales del hardware que permiten ejecutar maquinas virtuales con rendimiento cercano al nativo:

**Intel VT-x (Virtualization Technology for x86)**:
- Extension de Intel para procesadores x86
- Proporciona un modo de ejecucion especial para el hipervisor (VMX root mode)
- Permite que el guest ejecute instrucciones privilegiadas de forma segura

**AMD-V (AMD Virtualization)**:
- Extension equivalente de AMD (tambien conocida como AMD SVM - Secure Virtual Machine)
- Funcionalidad similar a Intel VT-x

**Verificar soporte en el sistema:**
```bash
# Verificar si el procesador soporta virtualizacion
grep -E '(vmx|svm)' /proc/cpuinfo
# vmx = Intel VT-x, svm = AMD-V

# Verificar si KVM esta disponible
lsmod | grep kvm
# kvm_intel (Intel) o kvm_amd (AMD)
```

> **Para el examen:** KVM **requiere** extensiones de virtualizacion por hardware (Intel VT-x o AMD-V) para funcionar. Estas extensiones deben estar **habilitadas en la configuracion del BIOS/UEFI**. Si no estan habilitadas, KVM no podra crear maquinas virtuales.

### Tipos de almacenamiento de maquinas virtuales

Las maquinas virtuales utilizan archivos de imagen de disco para simular discos duros. Existen dos formatos principales:

**Imagen RAW (formato crudo)**:
- El archivo tiene exactamente el tamano del disco virtual (ej: un disco de 20GB ocupa 20GB en el host)
- Mejor rendimiento (acceso directo sin traduccion)
- No soporta snapshots de forma nativa
- Mayor consumo de espacio en disco
- Ejemplo: `/var/lib/libvirt/images/disco.raw`

**Imagen COW - qcow2 (Copy-On-Write)**:
- El archivo solo ocupa el espacio de los datos **realmente escritos** (thin provisioning)
- Un disco virtual de 20GB puede ocupar solo 2GB en el host si solo tiene 2GB de datos
- Soporta **snapshots** (instantaneas del estado del disco)
- Soporta **compresion** y **cifrado**
- Formato nativo de QEMU/KVM
- Ejemplo: `/var/lib/libvirt/images/disco.qcow2`

| Caracteristica | RAW | qcow2 (COW) |
|---------------|-----|-------------|
| Tamano del archivo | Fijo (tamano completo del disco) | Dinamico (crece segun se usa) |
| Rendimiento | Mejor (acceso directo) | Ligeramente menor (traduccion) |
| Snapshots | No soportados | Soportados |
| Compresion | No | Si |
| Cifrado | No | Si |
| Thin provisioning | No | Si |

```bash
# Crear una imagen qcow2 de 20GB
qemu-img create -f qcow2 disco.qcow2 20G

# Crear una imagen RAW de 20GB
qemu-img create -f raw disco.raw 20G

# Ver informacion de una imagen
qemu-img info disco.qcow2

# Convertir de un formato a otro
qemu-img convert -f raw -O qcow2 disco.raw disco.qcow2
```

> **Para el examen:** qcow2 es el formato preferido en entornos KVM/QEMU por su flexibilidad (snapshots, thin provisioning). RAW ofrece mejor rendimiento pero sin funcionalidades avanzadas.

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

Al clonar una VM, el clon es una copia exacta del original, lo que genera conflictos. Es imprescindible modificar los siguientes elementos en la maquina clonada:

| Problema | Descripcion | Solucion |
|----------|-------------|---------|
| **Machine ID** | `/etc/machine-id` y `/var/lib/dbus/machine-id` duplicados | Regenerar: `rm /etc/machine-id && systemd-machine-id-setup` |
| **Claves SSH del host** | Mismas claves SSH en ambas maquinas, lo que genera advertencias de seguridad en los clientes | Regenerar (ver abajo) |
| **Direccion MAC** | MAC de la interfaz de red duplicada | El hipervisor genera una nueva MAC al clonar |
| **Hostname** | Mismo nombre de host en la red | Cambiar con `hostnamectl set-hostname nuevo-nombre` |
| **UUID de sistema de archivos** | UUIDs de particiones duplicados | Generar nuevos UUIDs con `tune2fs -U random /dev/sdX` |
| **Direccion IP** | Si IP es estatica, sera duplicada | Asignar nueva IP o usar DHCP |

**Regenerar claves SSH del host (imprescindible tras la clonacion):**

```bash
# Eliminar las claves SSH del host existentes
rm /etc/ssh/ssh_host_*

# Regenerar nuevas claves (metodo Debian/Ubuntu)
dpkg-reconfigure openssh-server

# Regenerar nuevas claves (metodo Red Hat/CentOS)
ssh-keygen -A

# Reiniciar el servicio SSH
systemctl restart sshd
```

> **Para el examen:** Si no se regeneran las claves SSH del host despues de clonar, los clientes que se conecten a la maquina clonada recibiran advertencias de "host key changed" porque el fingerprint sera identico al de la maquina original.

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

### D-Bus machine ID

El **machine ID** es un identificador hexadecimal unico de 32 caracteres que identifica a cada instalacion de Linux. Es fundamental en entornos virtualizados porque las maquinas clonadas comparten el mismo ID, lo que causa conflictos.

**Archivos del machine ID:**

| Archivo | Descripcion |
|---------|-------------|
| `/etc/machine-id` | Machine ID principal del sistema, usado por systemd |
| `/var/lib/dbus/machine-id` | Machine ID de D-Bus. Normalmente es un enlace simbolico a `/etc/machine-id` o una copia identica |

**Comandos para gestionar el machine ID:**

```bash
# Ver el machine ID actual
cat /etc/machine-id
cat /var/lib/dbus/machine-id

# Generar un nuevo ID D-Bus aleatorio
dbus-uuidgen

# Asegurar que /var/lib/dbus/machine-id existe (lo crea si no existe)
dbus-uuidgen --ensure

# Obtener el machine ID de D-Bus actual
dbus-uuidgen --get

# Regenerar /etc/machine-id (metodo systemd)
rm /etc/machine-id
systemd-machine-id-setup
```

> **Para el examen:** Al clonar una VM, es imprescindible regenerar el machine-id. Dos maquinas con el mismo machine-id pueden causar conflictos en D-Bus, DHCP y otros servicios que dependen de este identificador unico.

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

**cloud-init** es la herramienta estandar de la industria para la configuracion automatica de instancias en la nube durante el **primer arranque**. Es soportada por la mayoria de proveedores cloud (AWS, Azure, Google Cloud, OpenStack, etc.) y distribuciones Linux.

### Funciones principales

- Configurar hostname
- Crear usuarios y establecer claves SSH autorizadas
- Configurar interfaces de red
- Ejecutar scripts personalizados (shell, Python)
- Instalar paquetes
- Montar sistemas de archivos
- Escribir archivos de configuracion
- Configurar resolucion DNS

### Fuentes de datos (datasources)

cloud-init obtiene su configuracion de diferentes fuentes segun el proveedor:
- **Metadatos del proveedor**: API HTTP (ej: `http://169.254.169.254/` en AWS)
- **User data**: Configuracion personalizada proporcionada al crear la instancia
- **Disco de configuracion**: ISO o particion con los datos de configuracion

### Configuracion YAML (user-data)

La configuracion de cloud-init se escribe en formato **YAML** y debe comenzar con la linea `#cloud-config`:

```yaml
#cloud-config

# Configurar hostname
hostname: mi-servidor
fqdn: mi-servidor.ejemplo.com

# Crear usuarios
users:
  - name: admin
    groups: sudo, docker
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAA... usuario@host

# Instalar paquetes
package_update: true
package_upgrade: true
packages:
  - nginx
  - git
  - curl
  - htop

# Configuracion de red (ejemplo con Netplan)
write_files:
  - path: /etc/netplan/50-cloud-init.yaml
    content: |
      network:
        version: 2
        ethernets:
          eth0:
            dhcp4: true

# Ejecutar comandos al primer arranque
runcmd:
  - systemctl enable --now nginx
  - echo "Instancia configurada" > /var/log/cloud-init-done.log

# Configurar zona horaria
timezone: Europe/Madrid

# Mensaje final
final_message: "Sistema listo despues de $UPTIME segundos"
```

### Archivos de configuracion de cloud-init

| Archivo / Directorio | Descripcion |
|----------------------|-------------|
| `/etc/cloud/cloud.cfg` | Configuracion principal de cloud-init |
| `/etc/cloud/cloud.cfg.d/` | Archivos de configuracion adicionales |
| `/var/lib/cloud/` | Datos de estado de cloud-init |
| `/var/log/cloud-init.log` | Log de ejecucion de cloud-init |
| `/var/log/cloud-init-output.log` | Salida de los comandos ejecutados |

```bash
# Ver el estado de cloud-init
cloud-init status

# Re-ejecutar cloud-init (util para depuracion)
cloud-init clean
cloud-init init

# Ver la configuracion aplicada
cloud-init query
```

> **Para el examen:** cloud-init se ejecuta solo durante el **primer arranque** de la instancia. La configuracion se proporciona en formato YAML con la directiva `#cloud-config` al inicio del archivo.

---

## Resumen para el examen

1. **Hipervisor Tipo 1** (bare metal): KVM, Xen, ESXi. **Tipo 2** (hosted): VirtualBox, VMware Workstation.
2. **Virtualizacion completa**: guest sin modificar. **Paravirtualizacion**: guest modificado para comunicarse con hipervisor.
3. **Intel VT-x / AMD-V**: extensiones de hardware necesarias para KVM. Verificar con `grep -E '(vmx|svm)' /proc/cpuinfo`. Deben estar habilitadas en BIOS/UEFI.
4. **Almacenamiento VM**: RAW (tamano fijo, mejor rendimiento) vs qcow2/COW (tamano dinamico, snapshots, thin provisioning).
5. **Contenedores** (Docker, LXC) comparten el kernel del host; las **VMs** tienen su propio kernel.
6. **IaaS** = infraestructura; **PaaS** = plataforma; **SaaS** = software completo.
7. **Guest additions/tools** mejoran la integracion: rendimiento, carpetas compartidas, reloj.
8. Al **clonar** una VM, regenerar: machine-id (`/etc/machine-id`), claves SSH del host (`/etc/ssh/ssh_host_*`), MAC, hostname.
9. **D-Bus machine ID**: `/etc/machine-id` y `/var/lib/dbus/machine-id`. Comandos: `dbus-uuidgen --ensure`, `dbus-uuidgen --get`.
10. **D-Bus** permite la comunicacion entre procesos y con el hipervisor.
11. **cloud-init** configura instancias automaticamente en el primer arranque, usa formato YAML con `#cloud-config`.
12. `systemd-detect-virt` detecta si el sistema esta virtualizado y que hipervisor usa.
