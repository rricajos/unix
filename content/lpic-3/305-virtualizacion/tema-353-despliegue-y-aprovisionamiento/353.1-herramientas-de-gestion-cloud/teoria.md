---
title: "353.1 - Herramientas de Gestión Cloud"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.1"
peso: 2
tags:
  - lpic-3
  - tema-353
  - terraform
  - ansible
  - iac
  - cloud
  - openstack
---

# 353.1 Herramientas de Gestión Cloud

## Introducción

Las herramientas de gestión cloud permiten automatizar la creación, configuración y gestión de infraestructura de forma reproducible y versionable. Este concepto se conoce como Infraestructura como Código (IaC).

## Infraestructura como Código (IaC)

IaC es la práctica de gestionar infraestructura mediante archivos de configuración declarativos o imperativos, en lugar de procesos manuales.

| Aspecto | Enfoque Declarativo | Enfoque Imperativo |
|---|---|---|
| Definición | Describe el estado deseado | Describe los pasos a ejecutar |
| Ejemplo | Terraform, CloudFormation | Scripts Bash, Ansible (parcialmente) |
| Idempotencia | Incorporada | Debe implementarse |
| Ventaja | Predecible, reproducible | Flexible, detallado |

### Beneficios de IaC

- **Reproducibilidad**: Misma infraestructura en cualquier entorno.
- **Versionado**: Control de cambios con Git.
- **Automatización**: Eliminación de errores manuales.
- **Documentación**: El código es la documentación.
- **Auditoría**: Historial completo de cambios.

## Terraform

Terraform es la herramienta de IaC más extendida. Permite gestionar infraestructura en múltiples proveedores cloud con un lenguaje declarativo unificado (HCL).

### Conceptos fundamentales

| Concepto | Descripción |
|---|---|
| **Provider** | Plugin que interactúa con una API (AWS, Azure, GCP, libvirt, etc.) |
| **Resource** | Componente de infraestructura (VM, red, disco, etc.) |
| **Data Source** | Datos consultados de la infraestructura existente |
| **Module** | Conjunto reutilizable de recursos |
| **State** | Archivo que mapea la configuración al estado real de la infraestructura |
| **Plan** | Vista previa de los cambios que se aplicarán |

### Ejemplo de configuración

```hcl
# Definir provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

# Definir recurso
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
  }
}

# Variables
variable "instance_type" {
  default     = "t2.micro"
  description = "Tipo de instancia EC2"
}

# Outputs
output "public_ip" {
  value = aws_instance.web.public_ip
}
```

### Flujo de trabajo Terraform

```bash
# Inicializar (descargar providers y módulos)
terraform init

# Planificar cambios (vista previa)
terraform plan

# Aplicar cambios
terraform apply

# Aplicar sin confirmación interactiva
terraform apply -auto-approve

# Destruir toda la infraestructura
terraform destroy

# Ver estado actual
terraform show

# Listar recursos en el estado
terraform state list

# Formatear archivos HCL
terraform fmt

# Validar configuración
terraform validate
```

### State (Estado)

```bash
# El estado se almacena en terraform.tfstate
# Puede almacenarse remotamente (S3, GCS, Consul, etc.)

# Listar recursos en el estado
terraform state list

# Mover recurso en el estado
terraform state mv aws_instance.old aws_instance.new

# Eliminar recurso del estado (sin destruirlo)
terraform state rm aws_instance.web

# Importar recurso existente al estado
terraform import aws_instance.web i-1234567890abcdef0
```

> **Para el examen:** El archivo de estado (`terraform.tfstate`) es crítico. Contiene el mapeo entre configuración y recursos reales. Nunca debe editarse manualmente y debe almacenarse de forma segura (puede contener datos sensibles).

### Módulos

```hcl
# Usar un módulo
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "mi-vpc"
  cidr = "10.0.0.0/16"
}

# Módulo local
module "web" {
  source = "./modules/web-server"

  instance_type = var.instance_type
}
```

## Ansible

Ansible es una herramienta de automatización y gestión de configuración sin agentes que usa SSH para conectarse a los hosts.

### Conceptos clave

| Concepto | Descripción |
|---|---|
| **Inventory** | Lista de hosts a gestionar |
| **Playbook** | Archivo YAML con tareas a ejecutar |
| **Role** | Conjunto reutilizable de tareas, variables y archivos |
| **Task** | Acción individual (instalar paquete, copiar archivo, etc.) |
| **Module** | Unidad de trabajo de Ansible (apt, copy, service, etc.) |
| **Handler** | Tarea que se ejecuta solo cuando es notificada |

### Inventory

```ini
# /etc/ansible/hosts o inventario personalizado
[webservers]
web1.ejemplo.com
web2.ejemplo.com ansible_user=admin

[databases]
db1.ejemplo.com ansible_port=2222

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

### Playbook

```yaml
# site.yml
---
- name: Configurar servidores web
  hosts: webservers
  become: yes
  vars:
    http_port: 80

  tasks:
    - name: Instalar nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Copiar configuración
      copy:
        src: nginx.conf
        dest: /etc/nginx/nginx.conf
      notify: Reiniciar nginx

    - name: Asegurar que nginx está activo
      service:
        name: nginx
        state: started
        enabled: yes

  handlers:
    - name: Reiniciar nginx
      service:
        name: nginx
        state: restarted
```

```bash
# Ejecutar playbook
ansible-playbook -i inventario site.yml

# Verificar sin aplicar cambios (dry-run)
ansible-playbook -i inventario site.yml --check

# Ejecutar comando ad-hoc
ansible webservers -i inventario -m ping
ansible all -m shell -a "uptime"
```

> **Para el examen:** Ansible es agentless (sin agente). Solo necesita SSH y Python en los hosts remotos. Terraform gestiona infraestructura; Ansible configura los sistemas ya creados. Son complementarias.

## CloudFormation

AWS CloudFormation es el servicio nativo de IaC de Amazon Web Services:

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  WebServer:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t2.micro
      Tags:
        - Key: Name
          Value: WebServer
```

```bash
# Crear stack
aws cloudformation create-stack --stack-name mi-stack --template-body file://template.yaml

# Actualizar stack
aws cloudformation update-stack --stack-name mi-stack --template-body file://template.yaml

# Eliminar stack
aws cloudformation delete-stack --stack-name mi-stack
```

## Pulumi

Pulumi permite definir infraestructura usando lenguajes de programación reales (Python, TypeScript, Go, etc.):

```python
# __main__.py
import pulumi
import pulumi_aws as aws

server = aws.ec2.Instance("web",
    ami="ami-0c55b159cbfafe1f0",
    instance_type="t2.micro",
    tags={"Name": "WebServer"}
)

pulumi.export("public_ip", server.public_ip)
```

```bash
# Desplegar
pulumi up

# Destruir
pulumi destroy

# Vista previa
pulumi preview
```

## OpenStack CLI

OpenStack es una plataforma de cloud privado. Su CLI permite gestionar recursos de computación, red y almacenamiento:

```bash
# Listar servidores
openstack server list

# Crear servidor
openstack server create --flavor m1.small --image ubuntu-22.04 \
  --network mi-red --key-name mi-clave mi-servidor

# Listar imágenes
openstack image list

# Listar redes
openstack network list

# Crear red
openstack network create mi-red

# Listar sabores (tipos de instancia)
openstack flavor list

# Eliminar servidor
openstack server delete mi-servidor
```

> **Para el examen:** OpenStack es relevante para entornos de cloud privado. Los comandos siguen el patrón `openstack <recurso> <acción>`.

## Resumen

| Herramienta | Tipo | Enfoque | Uso principal |
|---|---|---|---|
| Terraform | IaC | Declarativo | Provisionar infraestructura multi-cloud |
| Ansible | Configuración | Imperativo/Declarativo | Configurar sistemas (sin agente) |
| CloudFormation | IaC | Declarativo | Infraestructura en AWS |
| Pulumi | IaC | Programático | IaC con lenguajes reales |
| OpenStack CLI | CLI | Imperativo | Gestión de cloud privado |
