---
title: "212.3 - SSH"
tags: [lpic-2, examen-202, tema-212, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.3"
---

# 212.3 - SSH

## Introducción a SSH

SSH (Secure Shell) proporciona comunicación cifrada entre sistemas, reemplazando protocolos inseguros como telnet, rsh y rlogin. OpenSSH es la implementación estándar en sistemas Linux y ofrece acceso remoto seguro, transferencia de archivos y túneles cifrados.

## Configuración del servidor: sshd_config

El archivo principal de configuración del demonio SSH es `/etc/ssh/sshd_config`.

### Directivas de seguridad fundamentales

```bash
# Puerto de escucha (cambiar del predeterminado por seguridad)
Port 22

# Protocolo (solo v2, v1 está obsoleto)
Protocol 2

# Direcciones de escucha
ListenAddress 0.0.0.0
ListenAddress ::

# Deshabilitar acceso root directo
PermitRootLogin no
# Opciones: yes, no, prohibit-password, forced-commands-only

# Autenticación por contraseña
PasswordAuthentication no

# Autenticación por clave pública
PubkeyAuthentication yes

# Archivo de claves autorizadas
AuthorizedKeysFile .ssh/authorized_keys

# Intentos máximos de autenticación
MaxAuthTries 3

# Máximo de sesiones por conexión
MaxSessions 5

# Tiempo de gracia para autenticación
LoginGraceTime 60

# Usar PAM para autenticación
UsePAM yes
```

> **Para el examen:** `PermitRootLogin prohibit-password` permite el acceso root solo con clave pública, bloqueando la autenticación por contraseña. Es la opción recomendada si se necesita acceso root remoto.

### Control de acceso por usuarios y grupos

```bash
# Permitir solo usuarios específicos
AllowUsers admin deploy usuario1

# Permitir solo grupos específicos
AllowGroups sshusers admins

# Denegar usuarios específicos
DenyUsers guest test

# Denegar grupos específicos
DenyGroups noremote
```

**Orden de evaluación**: DenyUsers -> AllowUsers -> DenyGroups -> AllowGroups

> **Para el examen:** Si se define `AllowUsers` o `AllowGroups`, solo los usuarios/grupos listados tendrán acceso. Todos los demás quedan implícitamente denegados.

### Funcionalidades adicionales

```bash
# Reenvío X11 (aplicaciones gráficas remotas)
X11Forwarding yes

# Reenvío de agente SSH
AllowAgentForwarding yes

# Permitir túneles TCP
AllowTcpForwarding yes

# Reenvío de puertos por gateway
GatewayPorts no

# Banner de advertencia antes del login
Banner /etc/ssh/banner.txt

# Intervalo de keepalive
ClientAliveInterval 300
ClientAliveCountMax 3
```

### Bloques Match: configuración condicional

Los bloques `Match` permiten aplicar configuración específica según criterios:

```bash
# Restricciones para un grupo específico
Match Group sftponly
    ChrootDirectory /home/%u
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no

# Restricciones para una dirección de origen
Match Address 10.0.0.0/8
    PasswordAuthentication yes

# Restricciones para un usuario específico
Match User backup
    ForceCommand /usr/local/bin/backup-script.sh
    PasswordAuthentication no
```

> **Para el examen:** `ForceCommand internal-sftp` combinado con `ChrootDirectory` es la forma estándar de crear usuarios que solo pueden usar SFTP, confinados a un directorio específico. El directorio chroot debe ser propiedad de root.

## Configuración del cliente: ssh_config

El archivo `/etc/ssh/ssh_config` (global) o `~/.ssh/config` (por usuario) configura el comportamiento del cliente SSH.

```bash
# Configuración por host
Host servidor-web
    HostName 192.168.1.10
    User admin
    Port 2222
    IdentityFile ~/.ssh/id_web

Host bastion
    HostName bastion.ejemplo.com
    User deploy
    ForwardAgent yes

# Saltar a través de un bastion host
Host servidor-interno
    HostName 10.0.0.50
    User admin
    ProxyJump bastion

# Configuración global
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes
```

### Multiplexación de conexiones (ControlMaster)

Permite reutilizar una conexión SSH existente para múltiples sesiones:

```bash
Host *
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h-%p
    ControlPersist 600
```

- **ControlMaster auto**: establece una conexión maestra automáticamente si no existe
- **ControlPath**: ruta del socket Unix para la conexión compartida
- **ControlPersist**: mantiene la conexión maestra activa N segundos después de cerrar la última sesión

> **Para el examen:** La multiplexación con ControlMaster acelera las conexiones SSH posteriores al mismo host, ya que no necesitan repetir la negociación del protocolo.

## Gestión de claves SSH

### Generación de claves con ssh-keygen

```bash
# Generar clave RSA de 4096 bits
ssh-keygen -t rsa -b 4096 -C "usuario@ejemplo.com"

# Generar clave Ed25519 (recomendada)
ssh-keygen -t ed25519 -C "usuario@ejemplo.com"

# Generar clave ECDSA
ssh-keygen -t ecdsa -b 521

# Especificar archivo de salida
ssh-keygen -t ed25519 -f ~/.ssh/id_servidor

# Cambiar la passphrase de una clave existente
ssh-keygen -p -f ~/.ssh/id_ed25519

# Ver huella digital de una clave
ssh-keygen -l -f ~/.ssh/id_ed25519.pub
```

### Copiar clave pública al servidor

```bash
# Método estándar
ssh-copy-id usuario@servidor

# Especificar clave concreta
ssh-copy-id -i ~/.ssh/id_ed25519.pub usuario@servidor

# Método manual (equivalente)
cat ~/.ssh/id_ed25519.pub | ssh usuario@servidor "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Formato del archivo authorized_keys

```
opciones tipo-clave clave-base64 comentario
```

Ejemplo con opciones de restricción:

```
command="/usr/bin/backup",no-pty,no-port-forwarding ssh-ed25519 AAAAC3Nza... backup@server
from="192.168.1.0/24" ssh-rsa AAAAB3Nza... admin@office
```

Opciones disponibles: `command=`, `from=`, `no-pty`, `no-port-forwarding`, `no-X11-forwarding`, `no-agent-forwarding`, `environment=`

### Agente SSH (ssh-agent y ssh-add)

El agente SSH mantiene las claves privadas descifradas en memoria:

```bash
# Iniciar el agente
eval $(ssh-agent)

# Añadir clave al agente
ssh-add ~/.ssh/id_ed25519

# Listar claves cargadas
ssh-add -l

# Eliminar todas las claves del agente
ssh-add -D

# Añadir clave con tiempo de vida (segundos)
ssh-add -t 3600 ~/.ssh/id_ed25519
```

## Archivo known_hosts

`~/.ssh/known_hosts` almacena las huellas digitales de los servidores previamente conectados para detectar ataques man-in-the-middle.

```bash
# Eliminar entrada de un host
ssh-keygen -R servidor.ejemplo.com

# Buscar una entrada
ssh-keygen -F servidor.ejemplo.com

# Hashing de known_hosts para mayor privacidad
ssh-keygen -H -f ~/.ssh/known_hosts
```

> **Para el examen:** Si la huella digital del servidor cambia (por reinstalación o ataque), SSH muestra una advertencia. El usuario debe eliminar la entrada antigua con `ssh-keygen -R` antes de reconectarse.

## Túneles SSH

### Túnel local (-L): acceder a un servicio remoto desde el host local

```bash
# Acceder al puerto 3306 del servidor remoto desde localhost:13306
ssh -L 13306:localhost:3306 usuario@servidor

# Acceder a un tercer host a través del servidor SSH
ssh -L 8080:servidor-web-interno:80 usuario@bastion
```

### Túnel remoto (-R): exponer un servicio local al servidor remoto

```bash
# Hacer accesible el puerto 80 local como puerto 8080 en el servidor remoto
ssh -R 8080:localhost:80 usuario@servidor
```

### Proxy SOCKS dinámico (-D)

```bash
# Crear un proxy SOCKS5 en el puerto local 1080
ssh -D 1080 usuario@servidor
```

> **Para el examen:** `-L` redirige un puerto local hacia un destino remoto. `-R` redirige un puerto remoto hacia un destino local. `-D` crea un proxy SOCKS dinámico que puede redirigir tráfico a cualquier destino.

## Transferencia de archivos

### SCP (Secure Copy)

```bash
# Copiar archivo local al servidor
scp archivo.txt usuario@servidor:/ruta/destino/

# Copiar archivo del servidor al local
scp usuario@servidor:/ruta/archivo.txt /local/

# Copiar directorio recursivamente
scp -r directorio/ usuario@servidor:/ruta/

# Especificar puerto
scp -P 2222 archivo.txt usuario@servidor:/ruta/
```

### SFTP (SSH File Transfer Protocol)

```bash
# Iniciar sesión SFTP
sftp usuario@servidor

# Comandos interactivos SFTP
sftp> put archivo_local.txt
sftp> get archivo_remoto.txt
sftp> ls
sftp> cd /ruta
sftp> mkdir nuevo_dir
sftp> bye
```

## ProxyJump: salto a través de hosts intermedios

```bash
# Desde línea de comandos
ssh -J bastion@bastion.ejemplo.com usuario@servidor-interno

# Múltiples saltos
ssh -J bastion1,bastion2 usuario@destino

# En ssh_config
Host interno
    HostName 10.0.0.50
    ProxyJump bastion
```

## Permisos requeridos para archivos SSH

| Archivo/Directorio | Permiso |
|--------------------|---------|
| `~/.ssh/` | 700 |
| `~/.ssh/authorized_keys` | 600 |
| `~/.ssh/id_*` (clave privada) | 600 |
| `~/.ssh/id_*.pub` (clave pública) | 644 |
| `~/.ssh/config` | 600 |
| `~/.ssh/known_hosts` | 644 |
