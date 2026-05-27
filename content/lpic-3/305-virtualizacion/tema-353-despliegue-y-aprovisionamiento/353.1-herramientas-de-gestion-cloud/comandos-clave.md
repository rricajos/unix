---
title: "353.1 - Comandos Clave: Herramientas de Gestión Cloud"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.1"
peso: 2
tags:
  - lpic-3
  - tema-353
  - comandos
  - terraform
  - ansible
  - openstack
---

# Comandos Clave - 353.1 Herramientas de Gestión Cloud

## Terraform

| Comando | Descripción |
|---|---|
| `terraform init` | Inicializar directorio (descargar providers/módulos) |
| `terraform plan` | Vista previa de cambios |
| `terraform apply` | Aplicar cambios |
| `terraform apply -auto-approve` | Aplicar sin confirmación |
| `terraform destroy` | Destruir infraestructura |
| `terraform show` | Ver estado actual |
| `terraform state list` | Listar recursos en el estado |
| `terraform state mv <old> <new>` | Renombrar recurso en estado |
| `terraform state rm <recurso>` | Eliminar del estado (no destruir) |
| `terraform import <recurso> <id>` | Importar recurso existente |
| `terraform fmt` | Formatear archivos HCL |
| `terraform validate` | Validar configuración |
| `terraform output` | Ver outputs definidos |
| `terraform workspace list` | Listar workspaces |
| `terraform workspace new <ws>` | Crear workspace |

## Ansible

| Comando | Descripción |
|---|---|
| `ansible-playbook -i inventario site.yml` | Ejecutar playbook |
| `ansible-playbook site.yml --check` | Dry-run (verificar sin aplicar) |
| `ansible-playbook site.yml --diff` | Mostrar diferencias |
| `ansible-playbook site.yml -l webservers` | Limitar a grupo |
| `ansible-playbook site.yml -e "var=valor"` | Variable extra |
| `ansible all -i inventario -m ping` | Ping a todos los hosts |
| `ansible all -m shell -a "uptime"` | Comando ad-hoc |
| `ansible-galaxy init mi-role` | Crear estructura de role |
| `ansible-galaxy install <role>` | Instalar role |
| `ansible-inventory --list` | Ver inventario resuelto |
| `ansible-vault encrypt archivo.yml` | Cifrar archivo |
| `ansible-vault decrypt archivo.yml` | Descifrar archivo |

## OpenStack CLI

| Comando | Descripción |
|---|---|
| `openstack server list` | Listar servidores |
| `openstack server create --flavor X --image Y --network Z <nombre>` | Crear servidor |
| `openstack server delete <nombre>` | Eliminar servidor |
| `openstack server show <nombre>` | Detalle de servidor |
| `openstack image list` | Listar imágenes |
| `openstack network list` | Listar redes |
| `openstack network create <red>` | Crear red |
| `openstack flavor list` | Listar sabores |
| `openstack volume list` | Listar volúmenes |
| `openstack security group list` | Listar grupos de seguridad |

## CloudFormation (AWS CLI)

| Comando | Descripción |
|---|---|
| `aws cloudformation create-stack --stack-name X --template-body file://Y` | Crear stack |
| `aws cloudformation update-stack --stack-name X --template-body file://Y` | Actualizar stack |
| `aws cloudformation delete-stack --stack-name X` | Eliminar stack |
| `aws cloudformation describe-stacks` | Listar stacks |
| `aws cloudformation validate-template --template-body file://Y` | Validar template |

## Pulumi

| Comando | Descripción |
|---|---|
| `pulumi new <template>` | Crear proyecto nuevo |
| `pulumi up` | Desplegar infraestructura |
| `pulumi preview` | Vista previa de cambios |
| `pulumi destroy` | Destruir infraestructura |
| `pulumi stack ls` | Listar stacks |

## Archivos Importantes

| Ruta/Archivo | Descripción |
|---|---|
| `main.tf` | Archivo principal de Terraform |
| `variables.tf` | Definición de variables Terraform |
| `outputs.tf` | Definición de outputs Terraform |
| `terraform.tfstate` | Archivo de estado de Terraform |
| `terraform.tfvars` | Valores de variables Terraform |
| `/etc/ansible/hosts` | Inventario por defecto de Ansible |
| `site.yml` | Playbook principal de Ansible |
| `/etc/ansible/ansible.cfg` | Configuración global de Ansible |
