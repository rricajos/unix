---
title: "212.3 - SSH: Comandos clave"
tags: [lpic-2, examen-202, tema-212, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.3"
---

# 212.3 - SSH: Comandos clave

## Gestión de claves

| Comando | Descripción |
|---------|-------------|
| `ssh-keygen -t ed25519` | Generar par de claves Ed25519 |
| `ssh-keygen -t rsa -b 4096` | Generar par de claves RSA de 4096 bits |
| `ssh-keygen -p -f ~/.ssh/id_ed25519` | Cambiar passphrase de una clave |
| `ssh-keygen -l -f clave.pub` | Ver huella digital de una clave |
| `ssh-keygen -R hostname` | Eliminar entrada de known_hosts |
| `ssh-keygen -F hostname` | Buscar host en known_hosts |
| `ssh-keygen -H -f ~/.ssh/known_hosts` | Hashear entradas de known_hosts |
| `ssh-copy-id usuario@servidor` | Copiar clave pública al servidor |
| `ssh-copy-id -i ~/.ssh/id_rsa.pub usuario@servidor` | Copiar clave específica |

## Agente SSH

| Comando | Descripción |
|---------|-------------|
| `eval $(ssh-agent)` | Iniciar agente SSH |
| `ssh-add` | Añadir clave por defecto al agente |
| `ssh-add ~/.ssh/id_ed25519` | Añadir clave específica al agente |
| `ssh-add -l` | Listar claves cargadas en el agente |
| `ssh-add -D` | Eliminar todas las claves del agente |
| `ssh-add -t 3600 ~/.ssh/id_ed25519` | Añadir clave con tiempo de vida |

## Conexión y túneles

| Comando | Descripción |
|---------|-------------|
| `ssh usuario@servidor` | Conexión básica |
| `ssh -p 2222 usuario@servidor` | Conexión a puerto personalizado |
| `ssh -i ~/.ssh/id_web usuario@servidor` | Usar clave específica |
| `ssh -L 8080:localhost:80 usuario@servidor` | Túnel local (local forwarding) |
| `ssh -R 8080:localhost:80 usuario@servidor` | Túnel remoto (remote forwarding) |
| `ssh -D 1080 usuario@servidor` | Proxy SOCKS dinámico |
| `ssh -J bastion usuario@interno` | Saltar a través de bastion host (ProxyJump) |
| `ssh -N -f -L 3306:localhost:3306 usuario@servidor` | Túnel en segundo plano sin shell |
| `ssh -X usuario@servidor` | Conexión con reenvío X11 |
| `ssh -A usuario@servidor` | Conexión con reenvío de agente |

## Transferencia de archivos

| Comando | Descripción |
|---------|-------------|
| `scp archivo usuario@servidor:/ruta/` | Copiar archivo al servidor |
| `scp usuario@servidor:/ruta/archivo .` | Copiar archivo del servidor |
| `scp -r directorio/ usuario@servidor:/ruta/` | Copiar directorio recursivamente |
| `scp -P 2222 archivo usuario@servidor:/ruta/` | Copiar usando puerto específico |
| `sftp usuario@servidor` | Iniciar sesión SFTP interactiva |

## Directivas principales de sshd_config

| Directiva | Descripción |
|-----------|-------------|
| `Port 22` | Puerto de escucha |
| `PermitRootLogin no` | Bloquear acceso root |
| `PasswordAuthentication no` | Deshabilitar autenticación por contraseña |
| `PubkeyAuthentication yes` | Habilitar autenticación por clave pública |
| `AllowUsers user1 user2` | Limitar acceso a usuarios específicos |
| `AllowGroups grupo1` | Limitar acceso a grupos específicos |
| `X11Forwarding yes` | Habilitar reenvío de X11 |
| `MaxAuthTries 3` | Máximo de intentos de autenticación |
| `UsePAM yes` | Usar módulos PAM |
| `Banner /etc/ssh/banner.txt` | Mostrar banner antes del login |
| `ClientAliveInterval 300` | Intervalo de keepalive (segundos) |
| `Match User/Group/Address` | Bloque de configuración condicional |
| `ChrootDirectory /home/%u` | Directorio chroot (en bloque Match) |
| `ForceCommand internal-sftp` | Forzar solo SFTP (en bloque Match) |

## Archivos de configuración y claves

| Archivo | Descripción |
|---------|-------------|
| `/etc/ssh/sshd_config` | Configuración del servidor SSH |
| `/etc/ssh/ssh_config` | Configuración global del cliente SSH |
| `~/.ssh/config` | Configuración del cliente por usuario |
| `~/.ssh/authorized_keys` | Claves públicas autorizadas |
| `~/.ssh/known_hosts` | Huellas de servidores conocidos |
| `~/.ssh/id_ed25519` / `~/.ssh/id_rsa` | Claves privadas del usuario |
| `~/.ssh/id_ed25519.pub` / `~/.ssh/id_rsa.pub` | Claves públicas del usuario |
| `/etc/ssh/ssh_host_*_key` | Claves del host del servidor |
