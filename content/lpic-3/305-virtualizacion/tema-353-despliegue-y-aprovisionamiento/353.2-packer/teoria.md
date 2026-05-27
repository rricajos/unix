---
title: "353.2 - Packer"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.2"
peso: 2
tags:
  - lpic-3
  - tema-353
  - packer
  - imagenes
  - builders
  - provisioners
---

# 353.2 Packer

## Introducción

Packer es una herramienta de HashiCorp para crear imágenes de máquinas idénticas para múltiples plataformas desde una única configuración. Permite automatizar la creación de imágenes para QEMU/KVM, VirtualBox, VMware, AWS, Azure, GCP y más.

## Conceptos Fundamentales

| Concepto | Descripción |
|---|---|
| **Builder** | Plugin que crea la imagen para una plataforma específica (QEMU, VirtualBox, AWS, etc.) |
| **Provisioner** | Configura la imagen durante la construcción (shell, Ansible, file, etc.) |
| **Post-processor** | Procesa la imagen después de la construcción (comprimir, subir, convertir) |
| **Template** | Archivo de configuración que define builders, provisioners y post-processors |
| **Source** | Definición de la imagen base y el builder en HCL2 |
| **Build** | Bloque que asocia sources con provisioners |

```
┌─────────────────────────────────────────────────┐
│                  Packer Template                 │
├─────────────┬──────────────┬────────────────────┤
│  Builder    │ Provisioner  │ Post-processor     │
│             │              │                    │
│ ·QEMU      │ ·Shell       │ ·Compress          │
│ ·VirtualBox │ ·Ansible     │ ·Upload (cloud)    │
│ ·VMware    │ ·File        │ ·Vagrant           │
│ ·Amazon EBS│ ·PowerShell  │ ·Docker push       │
│ ·Docker    │              │ ·Checksum          │
└─────────────┴──────────────┴────────────────────┘
```

## Formato de Template HCL2

Packer usa HCL2 (HashiCorp Configuration Language v2) como formato de template moderno (reemplazó al formato JSON anterior).

### Estructura básica

```hcl
# variables.pkr.hcl
variable "iso_url" {
  type    = string
  default = "https://releases.ubuntu.com/22.04/ubuntu-22.04.3-live-server-amd64.iso"
}

variable "iso_checksum" {
  type    = string
  default = "sha256:abcdef1234567890"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "ssh_password" {
  type      = string
  default   = "ubuntu"
  sensitive = true
}
```

```hcl
# ubuntu.pkr.hcl

# Definir source (builder)
source "qemu" "ubuntu" {
  iso_url          = var.iso_url
  iso_checksum     = var.iso_checksum
  output_directory = "output-ubuntu"
  disk_size        = "20G"
  format           = "qcow2"
  accelerator      = "kvm"
  vm_name          = "ubuntu-22.04.qcow2"
  memory           = 2048
  cpus             = 2

  ssh_username     = var.ssh_username
  ssh_password     = var.ssh_password
  ssh_timeout      = "30m"

  http_directory   = "http"
  boot_command     = [
    "<esc><wait>",
    "linux /casper/vmlinuz autoinstall ",
    "ds=nocloud-net;s=http://{{ .HTTPIP }}:{{ .HTTPPort }}/ ",
    "--- <enter>"
  ]

  shutdown_command = "echo '${var.ssh_password}' | sudo -S shutdown -P now"
}

# Definir build
build {
  sources = ["source.qemu.ubuntu"]

  # Provisioner: shell
  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get upgrade -y",
      "sudo apt-get install -y nginx curl"
    ]
  }

  # Provisioner: file
  provisioner "file" {
    source      = "files/nginx.conf"
    destination = "/tmp/nginx.conf"
  }

  provisioner "shell" {
    inline = [
      "sudo mv /tmp/nginx.conf /etc/nginx/nginx.conf",
      "sudo systemctl enable nginx"
    ]
  }

  # Provisioner: Ansible
  provisioner "ansible" {
    playbook_file = "ansible/playbook.yml"
    extra_arguments = [
      "--extra-vars", "env=production"
    ]
  }

  # Post-processor: comprimir
  post-processor "compress" {
    output = "output/ubuntu-22.04.qcow2.gz"
  }
}
```

> **Para el examen:** HCL2 es el formato actual de Packer (desde v1.7+). El formato JSON antiguo sigue siendo soportado pero HCL2 es el recomendado. Los archivos usan la extensión `.pkr.hcl`.

## Builders

### Builder QEMU/KVM

Crea imágenes para QEMU/KVM:

```hcl
source "qemu" "linux" {
  iso_url          = "ubuntu.iso"
  iso_checksum     = "sha256:..."
  disk_size        = "20G"
  format           = "qcow2"
  accelerator      = "kvm"
  memory           = 2048
  cpus             = 2
  headless         = true
  ssh_username     = "user"
  ssh_password     = "pass"
  shutdown_command = "sudo shutdown -P now"
}
```

### Builder VirtualBox

```hcl
source "virtualbox-iso" "linux" {
  iso_url          = "ubuntu.iso"
  iso_checksum     = "sha256:..."
  guest_os_type    = "Ubuntu_64"
  disk_size        = 20480
  memory           = 2048
  cpus             = 2
  ssh_username     = "user"
  ssh_password     = "pass"
  shutdown_command = "sudo shutdown -P now"
  format           = "ova"
}
```

### Builder VMware

```hcl
source "vmware-iso" "linux" {
  iso_url          = "ubuntu.iso"
  iso_checksum     = "sha256:..."
  guest_os_type    = "ubuntu-64"
  disk_size        = 20480
  memory           = 2048
  cpus             = 2
  ssh_username     = "user"
  ssh_password     = "pass"
  shutdown_command = "sudo shutdown -P now"
}
```

### Builder para Cloud

```hcl
# Amazon EBS
source "amazon-ebs" "ubuntu" {
  ami_name      = "mi-ami-{{timestamp}}"
  instance_type = "t2.micro"
  region        = "eu-west-1"
  source_ami    = "ami-0c55b159cbfafe1f0"
  ssh_username  = "ubuntu"
}
```

## Provisioners

### Shell Provisioner

```hcl
provisioner "shell" {
  inline = [
    "sudo apt-get update",
    "sudo apt-get install -y nginx"
  ]
}

provisioner "shell" {
  script = "scripts/setup.sh"
}

provisioner "shell" {
  scripts = [
    "scripts/base.sh",
    "scripts/cleanup.sh"
  ]
}
```

### File Provisioner

```hcl
provisioner "file" {
  source      = "configs/app.conf"
  destination = "/tmp/app.conf"
}

# Subir directorio completo
provisioner "file" {
  source      = "files/"
  destination = "/tmp/files"
}
```

### Ansible Provisioner

```hcl
provisioner "ansible" {
  playbook_file   = "ansible/site.yml"
  inventory_file  = "ansible/inventory"
  extra_arguments = [
    "--extra-vars", "version=1.0"
  ]
}
```

> **Para el examen:** El file provisioner sube archivos a la imagen durante la construcción. Para moverlos a rutas protegidas (como /etc/), se sube a /tmp/ primero y luego se mueve con un shell provisioner usando sudo.

## Post-processors

```hcl
# Comprimir imagen
post-processor "compress" {
  output = "output/imagen.qcow2.gz"
}

# Generar checksum
post-processor "checksum" {
  checksum_types = ["sha256"]
  output         = "output/imagen.checksum"
}

# Convertir a Vagrant box
post-processor "vagrant" {
  output = "output/ubuntu.box"
}

# Subir a Docker Hub
post-processor "docker-push" {
  login          = true
  login_username = "usuario"
  login_password = "clave"
}
```

## Comandos Packer

```bash
# Validar template
packer validate .
packer validate ubuntu.pkr.hcl

# Inspeccionar template
packer inspect ubuntu.pkr.hcl

# Construir imagen
packer build .
packer build ubuntu.pkr.hcl

# Construir con variables
packer build -var "iso_url=ubuntu.iso" ubuntu.pkr.hcl
packer build -var-file=variables.pkrvars.hcl ubuntu.pkr.hcl

# Construir solo un builder específico
packer build -only=qemu.ubuntu ubuntu.pkr.hcl

# Modo debug (paso a paso)
packer build -debug ubuntu.pkr.hcl

# Inicializar plugins
packer init .

# Formatear archivos HCL
packer fmt .
```

## Builds Multi-plataforma

```hcl
# Construir para múltiples plataformas simultáneamente
source "qemu" "linux" {
  # ... configuración QEMU
}

source "virtualbox-iso" "linux" {
  # ... configuración VirtualBox
}

source "amazon-ebs" "linux" {
  # ... configuración AWS
}

build {
  sources = [
    "source.qemu.linux",
    "source.virtualbox-iso.linux",
    "source.amazon-ebs.linux"
  ]

  provisioner "shell" {
    inline = ["sudo apt-get update && sudo apt-get upgrade -y"]
  }

  provisioner "ansible" {
    playbook_file = "ansible/site.yml"
  }
}
```

> **Para el examen:** Packer puede construir imágenes para múltiples plataformas en paralelo desde un único template. Esto garantiza que todas las imágenes sean idénticas independientemente del hipervisor o cloud.

## Flujo de Trabajo Típico

```
1. packer init .          ← Descargar plugins
2. packer validate .      ← Verificar sintaxis
3. packer fmt .           ← Formatear código
4. packer build .         ← Construir imagen(es)
```

## Resumen

| Concepto | Detalle clave |
|---|---|
| Builder | Crea imagen para plataforma específica |
| Provisioner | Configura la imagen (shell, ansible, file) |
| Post-processor | Procesa imagen resultante (compress, checksum, vagrant) |
| HCL2 | Formato actual de templates (`.pkr.hcl`) |
| `packer build` | Construir imagen |
| `packer validate` | Verificar template |
| Multi-plataforma | Un template, múltiples imágenes |
| File provisioner | Subir archivos a /tmp/, luego mover con shell |
