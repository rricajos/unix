---
title: "102.6 - Linux como sistema guest de virtualizacion: Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.6"
---

# 102.6 - Linux como sistema guest de virtualizacion: Comandos clave

## Deteccion de virtualizacion

| Comando | Descripcion | Ejemplo de salida |
|---------|-------------|-------------------|
| `systemd-detect-virt` | Detectar tipo de virtualizacion | `kvm`, `vmware`, `oracle`, `xen`, `none` |
| `cat /sys/class/dmi/id/product_name` | Nombre del producto (hardware/VM) | `VirtualBox`, `VMware Virtual Platform` |
| `dmidecode -s system-product-name` | Info del fabricante del sistema | `KVM`, `VirtualBox` |
| `hostnamectl` | Info del sistema (incluye virtualizacion) | Muestra "Virtualization: kvm" |
| `lscpu` | Info de CPU (muestra hipervisor) | "Hypervisor vendor: KVM" |
| `dmesg \| grep -i virtual` | Mensajes del kernel sobre virtualizacion | Mensajes de drivers virtuales |

## Hipervisores y tecnologias de virtualizacion

### Hipervisores Tipo 1 (Bare Metal)

| Tecnologia | Descripcion | Distribucion principal |
|-----------|-------------|----------------------|
| KVM | Integrado en el kernel Linux | Todas las distros Linux |
| Xen | Hipervisor de codigo abierto | Citrix, Amazon EC2 |
| VMware ESXi | Solucion empresarial | VMware vSphere |
| Hyper-V | Solucion de Microsoft | Windows Server |

### Hipervisores Tipo 2 (Hosted)

| Tecnologia | Descripcion | Plataforma |
|-----------|-------------|-----------|
| VirtualBox | Codigo abierto (Oracle) | Windows, Linux, macOS |
| VMware Workstation | Comercial | Windows, Linux |
| VMware Player | Gratuito (uso personal) | Windows, Linux |
| QEMU | Emulador/virtualizador | Linux |
| Parallels | Comercial | macOS |

## Contenedores

| Tecnologia | Tipo | Descripcion |
|-----------|------|-------------|
| Docker | Contenedor de aplicacion | Empaqueta app + dependencias |
| LXC | Contenedor de sistema | Similar a VM ligera |
| containerd | Runtime de contenedores | Backend de Docker |
| Podman | Contenedor de aplicacion | Alternativa a Docker sin demonio |

## Guest Additions / Guest Tools

### VirtualBox Guest Additions

```bash
# Montar el CD de Guest Additions
mount /dev/cdrom /mnt
cd /mnt
./VBoxLinuxAdditions.run

# Verificar que estan activas
lsmod | grep vbox
```

### VMware Tools (open-vm-tools)

```bash
# Instalar (Debian/Ubuntu)
apt install open-vm-tools
apt install open-vm-tools-desktop    # Si hay entorno grafico

# Instalar (Red Hat/CentOS)
yum install open-vm-tools

# Verificar estado
systemctl status vmtoolsd
```

### QEMU Guest Agent

```bash
# Instalar (Debian/Ubuntu)
apt install qemu-guest-agent

# Instalar (Red Hat/CentOS)
yum install qemu-guest-agent

# Activar y arrancar
systemctl enable --now qemu-guest-agent

# Verificar estado
systemctl status qemu-guest-agent
```

## Modelos de servicio en la nube

| Modelo | Significado | Responsabilidad del usuario | Ejemplos |
|--------|------------|---------------------------|----------|
| **IaaS** | Infrastructure as a Service | SO, apps, datos | AWS EC2, Azure VMs, GCE |
| **PaaS** | Platform as a Service | App y datos | Heroku, Google App Engine |
| **SaaS** | Software as a Service | Solo usar la app | Gmail, Office 365, Slack |

## Clonacion de VMs - Problemas y soluciones

| Elemento duplicado | Archivo/Ubicacion | Comando para regenerar |
|-------------------|-------------------|----------------------|
| Machine ID | `/etc/machine-id` | `rm /etc/machine-id && systemd-machine-id-setup` |
| Claves SSH host | `/etc/ssh/ssh_host_*` | `rm /etc/ssh/ssh_host_* && ssh-keygen -A` |
| Hostname | `/etc/hostname` | `hostnamectl set-hostname nuevo-nombre` |
| UUID de FS | Particiones | `tune2fs -U random /dev/sdX` |
| MAC address | Interfaz de red | El hipervisor genera nueva MAC al clonar |

### Herramienta de limpieza para plantillas

```bash
# virt-sysprep (en libguestfs-tools)
virt-sysprep -d nombre-vm
```

## D-Bus - Comunicacion entre procesos

| Comando | Descripcion |
|---------|-------------|
| `dbus-monitor --system` | Monitorizar mensajes del bus del sistema |
| `dbus-monitor --session` | Monitorizar mensajes del bus de sesion |
| `busctl list` | Listar servicios D-Bus disponibles |
| `busctl status` | Estado del bus |
| `dbus-send --system --dest=...` | Enviar mensaje D-Bus |

### Tipos de bus D-Bus

| Bus | Uso | Ejemplo |
|-----|-----|---------|
| System | Comunicacion entre servicios del sistema | Guest agent, systemd |
| Session | Comunicacion entre apps del usuario | Entorno de escritorio |

## cloud-init

| Comando | Descripcion |
|---------|-------------|
| `cloud-init status` | Ver estado de cloud-init |
| `cloud-init clean` | Limpiar datos de cloud-init (se re-ejecutara) |
| `cloud-init query` | Consultar metadatos de la instancia |
| `cat /var/log/cloud-init.log` | Ver logs de cloud-init |

### Ejemplo de cloud-config

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
```

## Comparativa rapida: VM vs Contenedor

| Aspecto | Maquina Virtual | Contenedor |
|---------|----------------|-----------|
| Kernel | Propio | Compartido con host |
| Tamano | GB | MB |
| Arranque | Minutos | Segundos |
| Aislamiento | Fuerte | Medio |
| Densidad | Decenas | Cientos/miles |
| Herramienta | VirtualBox, KVM, VMware | Docker, LXC, Podman |
