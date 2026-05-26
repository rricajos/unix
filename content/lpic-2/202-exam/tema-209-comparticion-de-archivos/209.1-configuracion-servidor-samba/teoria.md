---
title: "209.1 - Configuración del servidor Samba"
tags: [lpic-2, examen-202, tema-209, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "209"
subtema: "209.1"
---

# 209.1 - Configuración del servidor Samba

## Peso: 5

## Introducción

Samba es la implementación libre del protocolo SMB/CIFS que permite a sistemas Linux compartir archivos e impresoras con clientes Windows y otros sistemas. Con un peso de 5, este es uno de los subtemas más importantes del examen LPIC-2 202. Se requiere un conocimiento profundo de la configuración de `smb.conf`, herramientas de administración, modos de seguridad y la integración con Active Directory.

## Instalación

```bash
# Debian/Ubuntu
apt install samba samba-client cifs-utils

# Red Hat/CentOS
yum install samba samba-client samba-common cifs-utils
```

### Demonios de Samba

- **smbd**: Gestiona las conexiones de compartición de archivos e impresoras (puertos TCP 139 y 445).
- **nmbd**: Proporciona servicios de nombres NetBIOS y navegación de red (puertos UDP 137 y 138).
- **winbindd**: Integración con Active Directory para mapeo de usuarios y grupos.

```bash
systemctl enable smb nmb
systemctl start smb nmb
```

## Archivo de configuración smb.conf

El archivo principal de configuración es `/etc/samba/smb.conf`. Se divide en secciones identificadas por corchetes.

### Secciones especiales

```ini
[global]
# Configuración general del servidor Samba

[homes]
# Compartición automática de directorios home de los usuarios

[printers]
# Compartición automática de impresoras del sistema
```

### Sección [global]

```ini
[global]
    workgroup = MIGRUPO
    server string = Servidor Samba %v
    netbios name = SERVIDOR
    security = user
    map to guest = Bad User
    dns proxy = no

    # Logging
    log file = /var/log/samba/log.%m
    max log size = 1000
    log level = 1

    # Interfaces de red
    interfaces = eth0 lo
    bind interfaces only = yes

    # Rendimiento
    socket options = TCP_NODELAY IPTOS_LOWDELAY
```

> **Para el examen:** La directiva `workgroup` define el grupo de trabajo o dominio Windows al que pertenece el servidor. `security = user` es el modo predeterminado y el más utilizado, que requiere autenticación con usuario y contraseña de Samba.

## Modos de seguridad

| Modo | Descripción |
|---|---|
| `security = user` | Autenticación contra la base de datos local de Samba (predeterminado) |
| `security = ads` | El servidor se une a un dominio Active Directory como miembro |
| `security = domain` | El servidor se une a un dominio NT4 (obsoleto) |

> **Para el examen:** El modo `security = share` fue eliminado en Samba 4. Los modos actuales son `user` (predeterminado) y `ads` (para integración con Active Directory). El modo `domain` es para dominios NT4 y está prácticamente obsoleto.

## Definición de recursos compartidos

### Compartición de directorios

```ini
[documentos]
    comment = Documentos compartidos
    path = /srv/samba/documentos
    browseable = yes
    read only = no
    writable = yes
    valid users = @grupo_docs, usuario1
    write list = @editores
    create mask = 0664
    directory mask = 0775
    force user = nobody
    force group = nogroup
    guest ok = no
```

### Directivas de compartición importantes

| Directiva | Descripción |
|---|---|
| `path` | Ruta del directorio en el sistema de archivos |
| `browseable` | Si el recurso aparece al explorar la red (`yes`/`no`) |
| `read only` | Solo lectura (`yes`/`no`) |
| `writable` | Permite escritura (opuesto a `read only`) |
| `valid users` | Usuarios o grupos (@grupo) con acceso |
| `write list` | Usuarios o grupos con permiso de escritura |
| `read list` | Usuarios o grupos con permiso solo de lectura |
| `create mask` | Permisos para archivos nuevos |
| `directory mask` | Permisos para directorios nuevos |
| `force user` | Fuerza que todas las operaciones se hagan como este usuario |
| `force group` | Fuerza que todas las operaciones se hagan como este grupo |
| `guest ok` | Permite acceso sin autenticación (`yes`/`no`) |
| `hosts allow` | IPs o redes con acceso permitido |
| `hosts deny` | IPs o redes con acceso denegado |

### Sección [homes]

```ini
[homes]
    comment = Directorio personal de %U
    browseable = no
    writable = yes
    valid users = %S
    create mask = 0700
    directory mask = 0700
```

> **Para el examen:** La sección `[homes]` crea automáticamente un recurso compartido para cada usuario que se conecta, mapeándolo a su directorio home. La variable `%S` se reemplaza por el nombre del recurso solicitado (que coincide con el nombre de usuario) y `%U` con el nombre de usuario.

### Compartir impresoras

```ini
[printers]
    comment = Todas las impresoras
    path = /var/spool/samba
    browseable = no
    printable = yes
    guest ok = no
    writable = no
    create mask = 0700

[impresora_oficina]
    comment = Impresora de la oficina
    path = /var/spool/samba
    printable = yes
    printer name = HP_LaserJet
```

## Gestión de usuarios de Samba

### smbpasswd

```bash
# Añadir usuario de Samba (el usuario UNIX debe existir primero)
smbpasswd -a usuario1

# Cambiar contraseña de un usuario
smbpasswd usuario1

# Habilitar un usuario deshabilitado
smbpasswd -e usuario1

# Deshabilitar un usuario
smbpasswd -d usuario1

# Eliminar un usuario
smbpasswd -x usuario1
```

### pdbedit

```bash
# Listar todos los usuarios de Samba
pdbedit -L

# Listar con información detallada
pdbedit -L -v

# Añadir un usuario
pdbedit -a usuario1

# Eliminar un usuario
pdbedit -x usuario1

# Mostrar información de un usuario específico
pdbedit -v usuario1

# Exportar la base de datos en formato smbpasswd
pdbedit -e smbpasswd:/tmp/samba-backup
```

> **Para el examen:** Tanto `smbpasswd` como `pdbedit` gestionan los usuarios de Samba, pero `pdbedit` es más completo y permite administrar diferentes backends de base de datos (tdbsam, ldapsam). Recuerda que el usuario Unix debe existir antes de crear el usuario Samba.

## Herramientas de diagnóstico y cliente

### testparm

```bash
# Verificar la sintaxis de smb.conf
testparm

# Verificar y mostrar solo la configuración activa
testparm -s

# Verificar la configuración vista desde una IP específica
testparm /etc/samba/smb.conf 192.168.1.100
```

### smbclient

```bash
# Listar recursos compartidos de un servidor
smbclient -L //servidor -U usuario

# Conectarse a un recurso compartido
smbclient //servidor/compartido -U usuario

# Comandos dentro de smbclient
# smb: \> ls
# smb: \> get archivo.txt
# smb: \> put archivo.txt
# smb: \> mkdir directorio
# smb: \> cd directorio
# smb: \> exit

# Conectarse con un usuario de dominio
smbclient //servidor/compartido -U dominio\\usuario
```

### smbstatus

```bash
# Mostrar conexiones activas
smbstatus

# Mostrar solo los recursos compartidos en uso
smbstatus -S

# Mostrar solo los procesos
smbstatus -p

# Mostrar solo los archivos bloqueados
smbstatus -L
```

### nmblookup

```bash
# Resolver un nombre NetBIOS
nmblookup SERVIDOR

# Buscar el maestro de navegación del grupo de trabajo
nmblookup -M MIGRUPO

# Consultar un servidor específico
nmblookup -U 192.168.1.1 -R SERVIDOR

# Buscar todos los hosts en la red
nmblookup '*'
```

## Montaje de recursos CIFS

### Montaje manual

```bash
# Montar un recurso compartido
mount -t cifs //servidor/compartido /mnt/samba -o username=usuario,password=clave

# Montar con archivo de credenciales (más seguro)
mount -t cifs //servidor/compartido /mnt/samba -o credentials=/root/.smbcredentials

# Contenido de /root/.smbcredentials
# username=usuario
# password=clave
# domain=MIDOMINIO
```

### Montaje permanente en /etc/fstab

```
//servidor/compartido  /mnt/samba  cifs  credentials=/root/.smbcredentials,uid=1000,gid=1000,iocharset=utf8  0  0
```

## Samba como miembro de Active Directory

### Unir el servidor a un dominio AD

```bash
# Configuración en smb.conf
# [global]
#     security = ads
#     realm = EMPRESA.COM
#     workgroup = EMPRESA
#     idmap config * : backend = tdb
#     idmap config * : range = 10000-20000
#     idmap config EMPRESA : backend = rid
#     idmap config EMPRESA : range = 20001-30000
#     winbind use default domain = yes

# Unir al dominio
net ads join -U administrador

# Verificar la unión al dominio
net ads testjoin

# Obtener información del dominio
net ads info
```

### Comando net

```bash
# Listar recursos compartidos remotos
net rpc share list -U usuario -S servidor

# Unir al dominio
net ads join -U admin

# Salir del dominio
net ads leave -U admin

# Mostrar información del dominio
net ads info

# Ver hora del servidor
net time -S servidor
```

## Variables de sustitución en smb.conf

| Variable | Descripción |
|---|---|
| `%U` | Nombre de usuario de la sesión |
| `%G` | Grupo principal del usuario |
| `%H` | Directorio home del usuario |
| `%m` | Nombre NetBIOS del cliente |
| `%L` | Nombre NetBIOS del servidor |
| `%M` | Nombre DNS del cliente |
| `%I` | Dirección IP del cliente |
| `%S` | Nombre del recurso compartido |
| `%v` | Versión de Samba |

> **Para el examen:** Las variables de sustitución son muy útiles para crear configuraciones dinámicas. Por ejemplo, `log file = /var/log/samba/log.%m` crea un archivo de log separado para cada cliente que se conecta.

## Mapeo de usuarios

```ini
[global]
    # Archivo de mapeo de nombres de usuario
    username map = /etc/samba/smbusers
```

Contenido de `/etc/samba/smbusers`:
```
# usuario_unix = nombre_windows
root = administrador admin
juan = jperez "Juan Perez"
```

> **Para el examen:** El archivo de mapeo de usuarios permite que los usuarios de Windows inicien sesión con nombres diferentes a los de sus cuentas Unix. El formato es `usuario_unix = nombre_windows [nombre_windows2 ...]`.
