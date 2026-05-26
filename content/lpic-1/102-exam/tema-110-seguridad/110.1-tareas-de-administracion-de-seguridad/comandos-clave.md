---
title: "110.1 Tareas de administracion de seguridad - Comandos clave"
tags:
  - lpic-1
  - examen-102
  - tema-110
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "110"
subtema: "110.1"
---

# 110.1 Tareas de administracion de seguridad - Comandos clave

## find (permisos especiales)

| Comando | Descripcion |
|---------|-------------|
| `find / -perm -4000 -type f` | Archivos con SUID |
| `find / -perm -2000 -type f` | Archivos con SGID |
| `find / -perm /6000 -type f` | Archivos con SUID o SGID |
| `find / -nouser` | Archivos sin propietario |
| `find / -nogroup` | Archivos sin grupo |

## passwd

| Comando | Descripcion |
|---------|-------------|
| `passwd` | Cambiar propia contrasena |
| `passwd usuario` | Cambiar contrasena de usuario (root) |
| `passwd -l usuario` | Bloquear cuenta |
| `passwd -u usuario` | Desbloquear cuenta |
| `passwd -e usuario` | Forzar cambio en proximo login |
| `passwd -S usuario` | Estado de la contrasena |
| `passwd -d usuario` | Eliminar contrasena |

## chage

| Comando | Descripcion |
|---------|-------------|
| `chage -l usuario` | Listar info de caducidad |
| `chage -M 90 usuario` | Max 90 dias de validez |
| `chage -m 7 usuario` | Min 7 dias entre cambios |
| `chage -W 14 usuario` | Avisar 14 dias antes |
| `chage -E 2024-12-31 usuario` | Expiracion de cuenta |
| `chage -I 30 usuario` | Dias de inactividad |
| `chage -d 0 usuario` | Forzar cambio inmediato |

## ulimit

| Comando | Descripcion |
|---------|-------------|
| `ulimit -a` | Mostrar todos los limites |
| `ulimit -u` | Max procesos |
| `ulimit -n` | Max archivos abiertos |
| `ulimit -f` | Max tamano de archivo |
| `ulimit -Su` | Limite soft de procesos |
| `ulimit -Hu` | Limite hard de procesos |

## lsof

| Comando | Descripcion |
|---------|-------------|
| `lsof -i` | Conexiones de red |
| `lsof -i :80` | Proceso en puerto 80 |
| `lsof -u usuario` | Archivos del usuario |
| `lsof -p PID` | Archivos del proceso |
| `lsof archivo` | Procesos usando archivo |

## fuser

| Comando | Descripcion |
|---------|-------------|
| `fuser -v archivo` | Procesos usando archivo |
| `fuser -k archivo` | Matar procesos del archivo |
| `fuser -n tcp 80` | Proceso en puerto TCP 80 |
| `fuser -km /mnt/usb` | Matar procesos del montaje |

## nmap

| Comando | Descripcion |
|---------|-------------|
| `nmap host` | Escaneo basico |
| `nmap -p 22,80,443 host` | Puertos especificos |
| `nmap -sn 192.168.1.0/24` | Descubrir hosts |

## sudo / su

| Comando | Descripcion |
|---------|-------------|
| `sudo comando` | Ejecutar como root |
| `sudo -l` | Listar permisos sudo |
| `sudo -u usuario comando` | Ejecutar como usuario |
| `visudo` | Editar /etc/sudoers |
| `su -` | Cambiar a root |
| `su - usuario` | Cambiar a otro usuario |

## Formato de /etc/sudoers

```
usuario  host=(usuario_ejecutar:grupo)  comandos
juan     ALL=(ALL:ALL) ALL
maria    ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart apache2
%admin   ALL=(ALL:ALL) ALL
```

## Sesiones de usuarios

| Comando | Descripcion |
|---------|-------------|
| `who` | Usuarios conectados ahora |
| `w` | Conectados + actividad actual |
| `last` | Historico de logins |
| `lastb` | Intentos de login fallidos |

## /etc/security/limits.conf

```
# dominio  tipo   recurso  valor
juan       hard   nproc    100
@devs      soft   nofile   4096
*          hard   core     0
```
