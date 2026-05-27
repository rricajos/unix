---
title: "353.3 - Comandos Clave: cloud-init"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.3"
peso: 3
tags:
  - lpic-3
  - tema-353
  - comandos
  - cloud-init
  - user-data
  - nocloud
---

# Comandos Clave - 353.3 cloud-init

## Comandos de cloud-init

| Comando | Descripción |
|---|---|
| `cloud-init status` | Estado actual de cloud-init |
| `cloud-init status --long` | Estado detallado con errores |
| `cloud-init status --wait` | Esperar a que cloud-init termine |
| `cloud-init query instance_id` | Consultar instance-id |
| `cloud-init query userdata` | Consultar user-data |
| `cloud-init query ds.meta_data` | Consultar meta-data del datasource |
| `cloud-init query ds.meta_data.local_hostname` | Consultar dato específico |
| `cloud-init clean` | Limpiar estado (re-ejecución en próximo boot) |
| `cloud-init clean --logs` | Limpiar estado y logs |
| `cloud-init single --name <módulo> --frequency always` | Re-ejecutar módulo |
| `cloud-init analyze show` | Analizar tiempos de ejecución |
| `cloud-init analyze blame` | Módulos ordenados por tiempo |
| `cloud-init schema --docs` | Ver documentación de módulos |
| `cloud-init schema --config-file <file>` | Validar archivo cloud-config |
| `cloud-init collect-logs` | Recopilar logs para diagnóstico |

## Crear ISO NoCloud

| Comando | Descripción |
|---|---|
| `genisoimage -output seed.iso -volid cidata -joliet -rock user-data meta-data` | Crear ISO NoCloud |
| `mkisofs -output seed.iso -volid cidata -joliet -rock user-data meta-data` | Alternativa a genisoimage |
| `cloud-localds seed.iso user-data meta-data` | Crear ISO con cloud-utils |

## Módulos cloud-config Principales

| Módulo | Ejemplo | Descripción |
|---|---|---|
| `hostname` | `hostname: server1` | Configurar hostname |
| `users` | `users: [...]` | Crear y configurar usuarios |
| `packages` | `packages: [nginx, curl]` | Instalar paquetes |
| `package_update` | `package_update: true` | Actualizar lista de paquetes |
| `package_upgrade` | `package_upgrade: true` | Actualizar paquetes |
| `runcmd` | `runcmd: [cmd1, cmd2]` | Ejecutar comandos |
| `write_files` | `write_files: [...]` | Crear/escribir archivos |
| `ssh_authorized_keys` | Dentro de `users` | Inyectar claves SSH |
| `ssh_pwauth` | `ssh_pwauth: false` | Desactivar login SSH por password |
| `disable_root` | `disable_root: true` | Desactivar login root |
| `ntp` | `ntp: {enabled: true}` | Configurar NTP |
| `timezone` | `timezone: Europe/Madrid` | Configurar zona horaria |
| `locale` | `locale: es_ES.UTF-8` | Configurar locale |
| `power_state` | `power_state: {mode: reboot}` | Reiniciar/apagar tras config |

## Etapas de cloud-init (Systemd Units)

| Etapa | Unit | Descripción |
|---|---|---|
| init-local | `cloud-init-local.service` | Datasource local, antes de red |
| init | `cloud-init.service` | Metadata, configuración de red |
| config | `cloud-config.service` | Módulos de configuración |
| final | `cloud-final.service` | Scripts, runcmd, paquetes |

## Archivos y Directorios

| Ruta | Descripción |
|---|---|
| `/etc/cloud/cloud.cfg` | Configuración principal |
| `/etc/cloud/cloud.cfg.d/*.cfg` | Configuraciones adicionales |
| `/var/lib/cloud/` | Datos de runtime |
| `/var/lib/cloud/instance/` | Datos de la instancia actual |
| `/var/lib/cloud/seed/nocloud/` | Datos NoCloud locales |
| `/var/log/cloud-init.log` | Log principal |
| `/var/log/cloud-init-output.log` | Salida de scripts y comandos |
| `/run/cloud-init/status.json` | Estado actual en JSON |

## Datasources

| Datasource | Parámetro kernel | Plataforma |
|---|---|---|
| NoCloud | `ds=nocloud;s=<URL>` | Local (QEMU, VirtualBox) |
| NoCloud (red) | `ds=nocloud-net;s=http://IP/` | Local con red |
| EC2 | (automático) | AWS |
| GCE | (automático) | Google Cloud |
| Azure | (automático) | Microsoft Azure |
| OpenStack | (automático) | OpenStack |
| ConfigDrive | (automático) | OpenStack/libvirt |
