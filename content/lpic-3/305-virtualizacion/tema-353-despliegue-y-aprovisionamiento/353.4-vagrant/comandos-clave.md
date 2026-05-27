---
title: "353.4 - Comandos Clave: Vagrant"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.4"
peso: 3
tags:
  - lpic-3
  - tema-353
  - comandos
  - vagrant
  - vagrantfile
---

# Comandos Clave - 353.4 Vagrant

## Ciclo de Vida de la VM

| Comando | Descripción |
|---|---|
| `vagrant init <box>` | Crear Vagrantfile con box especificado |
| `vagrant up` | Crear e iniciar VM |
| `vagrant up --provider=libvirt` | Iniciar con provider específico |
| `vagrant up --provision` | Iniciar forzando provisioning |
| `vagrant ssh` | Conectar por SSH a la VM |
| `vagrant ssh <nombre>` | SSH a VM específica (multi-máquina) |
| `vagrant halt` | Apagar VM (shutdown ordenado) |
| `vagrant suspend` | Suspender VM (guardar estado) |
| `vagrant resume` | Reanudar VM suspendida |
| `vagrant reload` | Reiniciar VM (halt + up) |
| `vagrant reload --provision` | Reiniciar con re-provisioning |
| `vagrant destroy` | Eliminar VM completamente |
| `vagrant destroy -f` | Eliminar sin confirmación |
| `vagrant status` | Estado de la VM actual |
| `vagrant global-status` | Estado de todas las VMs Vagrant |

## Provisioning

| Comando | Descripción |
|---|---|
| `vagrant provision` | Ejecutar provisioners |
| `vagrant provision --provision-with shell` | Ejecutar provisioner específico |
| `vagrant up --no-provision` | Iniciar sin provisioning |

## Gestión de Boxes

| Comando | Descripción |
|---|---|
| `vagrant box list` | Listar boxes instaladas |
| `vagrant box add <nombre>` | Descargar e instalar box |
| `vagrant box add <nombre> <url>` | Añadir box desde URL |
| `vagrant box add <nombre> --provider libvirt` | Añadir para provider específico |
| `vagrant box remove <nombre>` | Eliminar box |
| `vagrant box update` | Actualizar box a última versión |
| `vagrant box prune` | Eliminar versiones antiguas |
| `vagrant box prune --dry-run` | Ver qué se eliminaría |
| `vagrant box outdated` | Verificar si hay actualizaciones |

## Snapshots

| Comando | Descripción |
|---|---|
| `vagrant snapshot save <nombre>` | Crear snapshot |
| `vagrant snapshot list` | Listar snapshots |
| `vagrant snapshot restore <nombre>` | Restaurar snapshot |
| `vagrant snapshot delete <nombre>` | Eliminar snapshot |
| `vagrant snapshot push` | Push al stack de snapshots |
| `vagrant snapshot pop` | Pop del stack de snapshots |

## Plugins

| Comando | Descripción |
|---|---|
| `vagrant plugin install vagrant-libvirt` | Instalar plugin libvirt |
| `vagrant plugin list` | Listar plugins instalados |
| `vagrant plugin uninstall <plugin>` | Desinstalar plugin |
| `vagrant plugin update` | Actualizar plugins |

## Otros Comandos

| Comando | Descripción |
|---|---|
| `vagrant validate` | Validar Vagrantfile |
| `vagrant port` | Ver redirecciones de puertos |
| `vagrant ssh-config` | Ver configuración SSH |
| `vagrant cloud search <query>` | Buscar boxes en Vagrant Cloud |

## Opciones de Vagrantfile

| Opción | Descripción |
|---|---|
| `config.vm.box` | Box base a utilizar |
| `config.vm.hostname` | Hostname de la VM |
| `config.vm.network "forwarded_port", guest: X, host: Y` | Redirigir puertos |
| `config.vm.network "private_network", ip: "X"` | Red privada (host-only) |
| `config.vm.network "public_network"` | Red pública (bridge) |
| `config.vm.synced_folder "host", "guest"` | Carpeta compartida |
| `config.vm.provider "virtualbox" do \|vb\|` | Configurar provider |
| `config.vm.provision "shell", inline: "..."` | Provisioner shell inline |
| `config.vm.provision "shell", path: "script.sh"` | Provisioner shell externo |
| `config.vm.provision "ansible" do \|a\|` | Provisioner Ansible |
| `config.vm.define "nombre" do \|n\|` | Definir VM en multi-máquina |
| `config.vm.box_check_update = false` | Desactivar auto-update |

## Archivos y Directorios

| Ruta | Descripción |
|---|---|
| `Vagrantfile` | Archivo de configuración (en directorio del proyecto) |
| `.vagrant/` | Directorio de estado local del proyecto |
| `~/.vagrant.d/` | Directorio global de Vagrant (boxes, plugins) |
| `~/.vagrant.d/boxes/` | Boxes descargadas |
| `/vagrant` | Carpeta compartida por defecto dentro de la VM |
