---
title: "353.2 - Comandos Clave: Packer"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.2"
peso: 2
tags:
  - lpic-3
  - tema-353
  - comandos
  - packer
  - builders
  - provisioners
---

# Comandos Clave - 353.2 Packer

## Comandos Packer

| Comando | Descripción |
|---|---|
| `packer init .` | Inicializar y descargar plugins necesarios |
| `packer validate .` | Validar sintaxis del template |
| `packer validate ubuntu.pkr.hcl` | Validar archivo específico |
| `packer inspect ubuntu.pkr.hcl` | Inspeccionar template (sources, vars, builds) |
| `packer build .` | Construir imagen(es) |
| `packer build ubuntu.pkr.hcl` | Construir desde archivo específico |
| `packer build -var "key=value" .` | Construir con variable |
| `packer build -var-file=vars.pkrvars.hcl .` | Construir con archivo de variables |
| `packer build -only=qemu.ubuntu .` | Construir solo un source específico |
| `packer build -except=virtualbox-iso.linux .` | Excluir un source |
| `packer build -debug .` | Modo debug paso a paso |
| `packer build -force .` | Forzar reconstrucción |
| `packer fmt .` | Formatear archivos HCL |
| `packer fmt -check .` | Verificar formato sin modificar |

## Bloques HCL2 Principales

| Bloque | Descripción |
|---|---|
| `packer { }` | Configuración de Packer (plugins requeridos) |
| `variable "nombre" { }` | Definición de variable |
| `source "builder" "nombre" { }` | Definición de source/builder |
| `build { }` | Definición de build (sources + provisioners + post-processors) |
| `provisioner "tipo" { }` | Provisioner dentro de build |
| `post-processor "tipo" { }` | Post-processor dentro de build |

## Builders Soportados

| Builder | Identificador | Formato de salida |
|---|---|---|
| QEMU/KVM | `qemu` | qcow2, raw |
| VirtualBox | `virtualbox-iso` | ovf, ova |
| VMware | `vmware-iso` | vmx, vmdk |
| Amazon EC2 | `amazon-ebs` | AMI |
| Google Cloud | `googlecompute` | Imagen GCE |
| Azure | `azure-arm` | Imagen Azure |
| Docker | `docker` | Imagen Docker |

## Provisioners

| Provisioner | Uso |
|---|---|
| `shell` | Ejecutar scripts/comandos shell |
| `file` | Subir archivos al guest |
| `ansible` | Ejecutar playbook Ansible |
| `ansible-local` | Ansible ejecutado dentro del guest |
| `powershell` | Scripts PowerShell (Windows) |
| `windows-shell` | CMD de Windows |

## Post-processors

| Post-processor | Uso |
|---|---|
| `compress` | Comprimir imagen resultante |
| `checksum` | Generar checksums |
| `vagrant` | Convertir a Vagrant box |
| `docker-push` | Subir imagen Docker |
| `docker-tag` | Etiquetar imagen Docker |
| `manifest` | Generar archivo de manifiesto |

## Archivos y Extensiones

| Archivo | Descripción |
|---|---|
| `*.pkr.hcl` | Template Packer en formato HCL2 |
| `*.pkrvars.hcl` | Archivo de variables |
| `*.auto.pkrvars.hcl` | Variables cargadas automáticamente |
| `*.pkr.json` | Template en formato JSON (legacy) |
| `http/` | Directorio servido por HTTP durante el build |
| `scripts/` | Scripts de provisioning (convención) |
| `output-*/` | Directorio de salida con imágenes generadas |
