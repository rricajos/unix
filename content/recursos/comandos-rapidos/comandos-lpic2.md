---
title: "Comandos Rapidos - LPIC-2"
tags:
  - contenido
  - recursos
  - referencia
tipo: contenido
---

# Comandos Rapidos - LPIC-2

(Pendiente de completar a medida que se avance con LPIC-2)

## Kernel

| Comando | Descripcion |
|---------|-------------|
| `uname -r` | Version del kernel |
| `make menuconfig` | Configurar kernel |
| `make` | Compilar kernel |
| `make modules_install` | Instalar modulos |
| `sysctl -a` | Parametros del kernel |
| `sysctl -w param=valor` | Modificar parametro |

## Almacenamiento avanzado

| Comando | Descripcion |
|---------|-------------|
| `pvcreate /dev/sdb` | Crear volumen fisico LVM |
| `vgcreate vg0 /dev/sdb` | Crear grupo de volumenes |
| `lvcreate -L 10G -n lv0 vg0` | Crear volumen logico |
| `lvextend -L +5G /dev/vg0/lv0` | Extender volumen |
| `mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sd[bc]` | Crear RAID 1 |

## Servicios de red

| Comando | Descripcion |
|---------|-------------|
| `named-checkconf` | Verificar config BIND |
| `named-checkzone` | Verificar zona DNS |
| `apachectl configtest` | Verificar config Apache |
| `nginx -t` | Verificar config Nginx |
| `smbclient -L //server` | Listar shares Samba |
| `exportfs -ra` | Reexportar NFS |
| `postconf` | Ver config de Postfix |

## SSH

| Comando | Descripcion |
|---------|-------------|
| `ssh-keygen -t ed25519` | Generar par de claves |
| `ssh-copy-id user@host` | Copiar clave publica |
| `ssh -L 8080:remote:80 user@host` | Tunel local |
| `ssh -R 8080:local:80 user@host` | Tunel remoto |
| `ssh -D 1080 user@host` | Proxy SOCKS |
