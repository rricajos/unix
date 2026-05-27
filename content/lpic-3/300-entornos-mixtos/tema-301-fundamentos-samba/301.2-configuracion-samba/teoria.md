---
tipo: teoria
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.2"
titulo: "Configuración Samba"
peso: 4
tags:
  - lpic-3
  - tema-301
  - teoria
---

# 301.2 Configuración Samba

## Objetivos del subtema

Este subtema abarca la configuración detallada de Samba mediante smb.conf, incluyendo modos de seguridad, backends de autenticación, módulos VFS y optimización de rendimiento. Es el subtema con mayor peso del tema 301.

## Estructura de smb.conf

### Secciones del archivo

El archivo `/etc/samba/smb.conf` se organiza en secciones delimitadas por corchetes:

```ini
[global]
# Configuración general del servidor
workgroup = MIDOMINIO
server role = standalone server

[homes]
# Sección especial: directorios home de usuarios
comment = Directorio personal
browseable = no
writable = yes

[printers]
# Sección especial: impresoras del sistema
comment = Impresoras
path = /var/spool/samba
printable = yes

[datos]
# Recurso compartido personalizado
comment = Datos compartidos
path = /srv/samba/datos
read only = no
valid users = @usuarios
```

### Secciones especiales

- **[global]**: Configuración que aplica a todo el servidor y valores predeterminados para recursos
- **[homes]**: Sección dinámica que crea automáticamente un recurso para el directorio home de cada usuario
- **[printers]**: Sección dinámica que comparte automáticamente las impresoras del sistema
- **[print$]**: Recurso para drivers de impresoras (distribución automática)

### Sintaxis general

- Los comentarios comienzan con `#` o `;`
- Los parámetros usan formato `nombre = valor`
- Los nombres de parámetros no distinguen mayúsculas/minúsculas
- Se permite usar sinónimos (ej: `writable = yes` equivale a `read only = no`)
- Las líneas largas se pueden continuar con `\`
- Se pueden incluir archivos externos: `include = /etc/samba/smb.conf.%m`

> **Para el examen:** `testparm` es la herramienta obligatoria para verificar la sintaxis de smb.conf. Siempre debe ejecutarse después de cada cambio.

## Validación con testparm

```bash
# Verificar sintaxis y mostrar configuración efectiva
testparm

# Mostrar sin pausa interactiva
testparm -s

# Verificar un archivo específico
testparm /ruta/al/smb.conf

# Mostrar configuración para un host específico
testparm -s --section-name=datos

# Mostrar valor de un parámetro específico
testparm -s -v --parameter-name="server role"
```

## Modos de seguridad (server role)

El parámetro `server role` (anteriormente `security`) define el rol del servidor:

| Valor | Descripción |
|-------|-------------|
| `standalone server` | Servidor independiente con autenticación local |
| `member server` | Miembro de un dominio AD o NT4 |
| `classic primary domain controller` | PDC de dominio NT4 (legacy) |
| `classic backup domain controller` | BDC de dominio NT4 (legacy) |
| `active directory domain controller` | Controlador de dominio AD |

### Equivalencia con el parámetro legacy `security`

| security (legacy) | server role (actual) |
|-------------------|---------------------|
| `security = user` | `standalone server` o `member server` |
| `security = domain` | `member server` (NT4) |
| `security = ads` | `member server` (AD) |

> **Para el examen:** El parámetro `security = share` fue eliminado en Samba 4. `server role` es la forma moderna y preferida de configurar el modo de seguridad.

## Backends de autenticación (passdb backend)

El parámetro `passdb backend` define dónde se almacenan las credenciales:

### tdbsam (predeterminado)

```ini
[global]
passdb backend = tdbsam
# Almacena en /var/lib/samba/private/passdb.tdb
```

- Base de datos TDB local (Trivial Database)
- Formato predeterminado desde Samba 3
- Bueno para servidores independientes y pequeños entornos
- Administrado con `pdbedit` y `smbpasswd`

### smbpasswd (legacy)

```ini
[global]
passdb backend = smbpasswd:/etc/samba/smbpasswd
```

- Archivo de texto plano similar a `/etc/passwd`
- Formato legacy, no recomendado
- No almacena atributos extendidos de cuenta
- Solo mantiene hashes LM y NT

### ldapsam

```ini
[global]
passdb backend = ldapsam:ldap://ldap.ejemplo.com
ldap suffix = dc=ejemplo,dc=com
ldap user suffix = ou=Users
ldap group suffix = ou=Groups
ldap admin dn = cn=admin,dc=ejemplo,dc=com
```

- Almacena cuentas Samba en un servidor LDAP externo
- Útil para entornos con múltiples servidores Samba
- Requiere esquema LDAP de Samba instalado
- Permite centralización de usuarios

> **Para el examen:** `tdbsam` es el backend predeterminado. `ldapsam` se usa para entornos distribuidos. `smbpasswd` es legacy y no recomendado.

## Configuración de red

### Interfaces y bind

```ini
[global]
# Limitar interfaces de escucha
interfaces = eth0 lo 192.168.1.0/24
bind interfaces only = yes
```

- `interfaces`: Define en qué interfaces o subredes escucha Samba
- `bind interfaces only = yes`: Restringe estrictamente a esas interfaces
- Importante para seguridad en servidores con múltiples interfaces

### Hosts allow/deny

```ini
[global]
hosts allow = 192.168.1. 10.0.0.0/8 127.
hosts deny = ALL

[confidencial]
hosts allow = 192.168.1.10 192.168.1.11
```

- Se pueden aplicar globalmente o por recurso compartido
- `hosts allow` se evalúa primero; si coincide, se permite el acceso
- `hosts deny` se evalúa después si no hubo coincidencia en allow

## Registro de logs

### Configuración de logs

```ini
[global]
# Archivo de log (puede usar variables)
log file = /var/log/samba/log.%m

# Tamaño máximo en KB (0 = ilimitado)
max log size = 5000

# Nivel de log (0-10)
log level = 1

# Log detallado por componente
log level = 3 passdb:5 auth:10 winbind:2

# Usar syslog en lugar de archivos propios
logging = syslog
```

### Variables de sustitución en smb.conf

| Variable | Significado |
|----------|-------------|
| `%m` | Nombre NetBIOS del cliente |
| `%I` | Dirección IP del cliente |
| `%U` | Nombre de usuario (solicitado) |
| `%u` | Nombre de usuario (efectivo) |
| `%H` | Directorio home del usuario |
| `%S` | Nombre del recurso compartido |
| `%g` | Grupo primario del usuario |
| `%D` | Nombre del dominio |
| `%L` | Nombre NetBIOS del servidor |

## Conjuntos de caracteres

```ini
[global]
# Codificación para nombres de archivos en disco
unix charset = UTF-8

# Codificación para comunicación con clientes
dos charset = CP850

# Mostrar nombres con codificación correcta
display charset = UTF-8
```

- `unix charset`: Codificación del sistema de archivos Linux (normalmente UTF-8)
- `dos charset`: Codificación para clientes DOS/Windows antiguos
- Importante para nombres de archivos con caracteres especiales (tildes, eñes)

## Módulos VFS (Virtual File System)

Los módulos VFS extienden la funcionalidad de los recursos compartidos:

```ini
[datos]
path = /srv/samba/datos
vfs objects = acl_xattr recycle full_audit
```

### Módulos VFS comunes

| Módulo | Función |
|--------|---------|
| `acl_xattr` | Almacena ACLs NT en atributos extendidos |
| `recycle` | Papelera de reciclaje para archivos eliminados |
| `full_audit` | Auditoría detallada de operaciones |
| `shadow_copy2` | Versiones anteriores (integración con snapshots) |
| `fruit` | Compatibilidad con macOS (Time Machine) |
| `catia` | Mapeo de caracteres ilegales en NTFS |
| `streams_xattr` | Flujos de datos alternativos NTFS |
| `crossrename` | Permite renombrar entre sistemas de archivos |

### Ejemplo: módulo recycle

```ini
[datos]
vfs objects = recycle
recycle:repository = .papelera
recycle:keeptree = yes
recycle:versions = yes
recycle:maxsize = 104857600
```

### Ejemplo: módulo full_audit

```ini
[datos]
vfs objects = full_audit
full_audit:prefix = %u|%I|%S
full_audit:success = mkdir rmdir rename unlink write
full_audit:failure = none
full_audit:facility = local5
full_audit:priority = notice
```

## Optimización de rendimiento

### Parámetros de rendimiento

```ini
[global]
# Tamaño de buffers de lectura/escritura
read raw = yes
write raw = yes
socket options = TCP_NODELAY IPTOS_LOWDELAY

# Caché de directorio
directory cache size = 0

# Aceleración de creación de conexiones
change notify = no

# Deshabilitar bloqueos estrictos
strict locking = Auto

# Usar sendfile para transferencias grandes
use sendfile = yes

# Async I/O
aio read size = 16384
aio write size = 16384
```

### Recomendaciones de rendimiento

- Habilitar `use sendfile = yes` para mejorar transferencia de archivos grandes
- Usar SMB2/SMB3 que tienen mejor rendimiento que SMB1
- Configurar `read raw = yes` y `write raw = yes` para transferencias sin procesar
- Ajustar `socket options` según la red
- Deshabilitar `change notify` si no se necesitan notificaciones de cambio
- Considerar `strict allocate = yes` para archivos grandes preasignados

> **Para el examen:** Conocer los parámetros de rendimiento más comunes y los módulos VFS principales. `testparm` es imprescindible para verificar la configuración.

## Definición de recursos compartidos

### Parámetros esenciales de un recurso

```ini
[proyecto]
comment = Archivos del proyecto
path = /srv/samba/proyecto
browseable = yes
read only = no
valid users = @desarrollo, admin
write list = @desarrollo
create mask = 0660
directory mask = 0770
force group = desarrollo
inherit permissions = yes
```

| Parámetro | Función |
|-----------|---------|
| `path` | Ruta del directorio en el sistema |
| `browseable` | Visible al listar recursos |
| `read only` / `writable` | Control de escritura |
| `valid users` | Usuarios con acceso permitido |
| `write list` | Usuarios con permiso de escritura |
| `create mask` | Permisos para nuevos archivos |
| `directory mask` | Permisos para nuevos directorios |
| `force user` / `force group` | Forzar identidad para operaciones |
| `inherit permissions` | Heredar permisos del directorio padre |
| `guest ok` | Permitir acceso sin autenticación |

## Resumen de conceptos clave

- smb.conf se divide en [global] y secciones de recursos compartidos
- `testparm` es obligatorio para validar la configuración
- `server role` reemplaza el antiguo parámetro `security`
- `tdbsam` es el backend de autenticación predeterminado
- Los módulos VFS extienden funcionalidad (recycle, audit, ACLs)
- Las variables como `%m`, `%U`, `%I` permiten configuraciones dinámicas
- La optimización incluye sendfile, async I/O y ajustes de socket
