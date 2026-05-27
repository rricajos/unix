---
tipo: comandos
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.2"
titulo: "Configuración Samba - Comandos Clave"
peso: 4
tags:
  - lpic-3
  - tema-301
  - comandos
---

# Comandos clave - 301.2 Configuración Samba

## Validación de configuración

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `testparm` | Verificar sintaxis de smb.conf | `testparm /etc/samba/smb.conf` |
| `testparm -s` | Mostrar config sin pausa interactiva | `testparm -s` |
| `testparm -v` | Mostrar todos los parámetros (incluidos defaults) | `testparm -s -v` |
| `testparm --parameter-name` | Consultar valor de un parámetro | `testparm -s --parameter-name="server role"` |
| `testparm --section-name` | Mostrar config de un recurso específico | `testparm -s --section-name=datos` |

## Gestión de usuarios Samba

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `smbpasswd -a usuario` | Añadir usuario a la base de datos Samba | `smbpasswd -a pedro` |
| `smbpasswd -x usuario` | Eliminar usuario de Samba | `smbpasswd -x pedro` |
| `smbpasswd -d usuario` | Deshabilitar cuenta Samba | `smbpasswd -d pedro` |
| `smbpasswd -e usuario` | Habilitar cuenta Samba | `smbpasswd -e pedro` |
| `smbpasswd usuario` | Cambiar contraseña de usuario | `smbpasswd pedro` |
| `pdbedit -L` | Listar usuarios de la base de datos | `pdbedit -L -v` |
| `pdbedit -a usuario` | Añadir usuario con pdbedit | `pdbedit -a -u pedro` |
| `pdbedit -x usuario` | Eliminar usuario con pdbedit | `pdbedit -x pedro` |
| `pdbedit -Lw` | Listar en formato smbpasswd | `pdbedit -Lw` |

## Parámetros clave de [global]

| Parámetro | Función | Ejemplo |
|-----------|---------|---------|
| `workgroup` | Grupo de trabajo o nombre de dominio | `workgroup = EMPRESA` |
| `server role` | Rol del servidor | `server role = member server` |
| `netbios name` | Nombre NetBIOS del servidor | `netbios name = SRVFILES` |
| `passdb backend` | Backend de autenticación | `passdb backend = tdbsam` |
| `log file` | Ruta del archivo de log | `log file = /var/log/samba/log.%m` |
| `log level` | Nivel de detalle del log | `log level = 3 auth:5` |
| `max log size` | Tamaño máximo de log (KB) | `max log size = 5000` |
| `interfaces` | Interfaces de red activas | `interfaces = eth0 lo` |
| `bind interfaces only` | Limitar a interfaces definidas | `bind interfaces only = yes` |
| `hosts allow` | Hosts permitidos | `hosts allow = 192.168.1. 127.` |
| `hosts deny` | Hosts denegados | `hosts deny = ALL` |
| `unix charset` | Codificación del sistema | `unix charset = UTF-8` |
| `dos charset` | Codificación para clientes Windows | `dos charset = CP850` |

## Parámetros de recursos compartidos

| Parámetro | Función | Ejemplo |
|-----------|---------|---------|
| `path` | Ruta del directorio compartido | `path = /srv/samba/datos` |
| `browseable` | Visible al listar recursos | `browseable = yes` |
| `read only` | Solo lectura | `read only = no` |
| `writable` | Permite escritura (sinónimo inverso) | `writable = yes` |
| `valid users` | Usuarios/grupos con acceso | `valid users = @grupo, user1` |
| `write list` | Usuarios con escritura | `write list = @editores` |
| `create mask` | Máscara para archivos nuevos | `create mask = 0664` |
| `directory mask` | Máscara para directorios nuevos | `directory mask = 0775` |
| `force user` | Forzar usuario para operaciones | `force user = www-data` |
| `force group` | Forzar grupo para operaciones | `force group = proyecto` |
| `guest ok` | Permitir acceso anónimo | `guest ok = yes` |
| `vfs objects` | Módulos VFS a cargar | `vfs objects = recycle full_audit` |
| `inherit permissions` | Heredar permisos del padre | `inherit permissions = yes` |

## Rendimiento

| Parámetro | Función | Ejemplo |
|-----------|---------|---------|
| `use sendfile` | Usar sendfile del kernel | `use sendfile = yes` |
| `read raw` | Lecturas sin procesar | `read raw = yes` |
| `write raw` | Escrituras sin procesar | `write raw = yes` |
| `aio read size` | Tamaño de lectura asíncrona | `aio read size = 16384` |
| `aio write size` | Tamaño de escritura asíncrona | `aio write size = 16384` |
| `socket options` | Opciones del socket TCP | `socket options = TCP_NODELAY` |
| `strict locking` | Control de bloqueos estrictos | `strict locking = Auto` |
