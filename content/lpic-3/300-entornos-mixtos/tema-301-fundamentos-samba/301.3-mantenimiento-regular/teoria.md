---
tipo: teoria
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.3"
titulo: "Mantenimiento Regular"
peso: 2
tags:
  - lpic-3
  - tema-301
  - teoria
---

# 301.3 Mantenimiento Regular

## Objetivos del subtema

Este subtema cubre las herramientas y procedimientos necesarios para el mantenimiento diario de un servidor Samba, incluyendo monitorización de conexiones, consultas de red, gestión de bases de datos TDB y tareas de mantenimiento rutinario.

## Monitorización con smbstatus

El comando `smbstatus` muestra información en tiempo real sobre las conexiones activas:

```bash
# Mostrar todas las conexiones, archivos abiertos y bloqueos
smbstatus

# Solo conexiones activas (resumen breve)
smbstatus -b

# Solo archivos abiertos con bloqueos
smbstatus -L

# Solo recursos compartidos en uso
smbstatus -S

# Filtrar por usuario específico
smbstatus -u usuario

# Salida en formato parseable (para scripts)
smbstatus -p
```

### Información proporcionada por smbstatus

- **Conexiones**: PID del proceso, usuario, grupo, máquina cliente, protocolo SMB, cifrado
- **Recursos compartidos**: Qué recursos están siendo accedidos y por quién
- **Archivos bloqueados**: Archivos con bloqueos oportunistas (oplocks) activos
- **Versión del protocolo**: Muestra si el cliente usa SMB1, SMB2 o SMB3

> **Para el examen:** `smbstatus` es la herramienta principal para verificar conexiones activas. La opción `-b` muestra un resumen breve y `-S` muestra los recursos compartidos en uso.

## Consultas de red con nmblookup

`nmblookup` consulta nombres NetBIOS y servicios WINS:

```bash
# Resolver un nombre NetBIOS
nmblookup SERVIDOR

# Consultar la tabla de nombres de un host por IP
nmblookup -A 192.168.1.10

# Buscar el Master Browser del dominio
nmblookup -M MIGRUPO

# Consultar servicios registrados
nmblookup -S SERVIDOR

# Usar un servidor WINS específico
nmblookup -R -U 10.0.0.1 SERVIDOR

# Buscar todas las estaciones del grupo
nmblookup 'MIGRUPO#1e'

# Usar broadcast en una subred específica
nmblookup -B 192.168.1.255 SERVIDOR
```

## Acceso con smbclient

`smbclient` es un cliente SMB similar a un cliente FTP:

```bash
# Listar recursos compartidos de un servidor
smbclient -L //servidor -U usuario

# Conectarse a un recurso compartido
smbclient //servidor/recurso -U usuario

# Listar sin autenticación (acceso anónimo)
smbclient -L //servidor -N

# Ejecutar un comando directamente
smbclient //servidor/recurso -U usuario -c "ls; get archivo.txt"

# Usar Kerberos para autenticación
smbclient //servidor/recurso -k

# Subir un archivo
smbclient //servidor/recurso -U usuario -c "put archivo_local.txt archivo_remoto.txt"

# Descargar un archivo
smbclient //servidor/recurso -U usuario -c "get archivo_remoto.txt"

# Especificar protocolo máximo
smbclient -L //servidor -U usuario -m SMB3
```

### Comandos interactivos de smbclient

| Comando | Función |
|---------|---------|
| `ls` | Listar archivos |
| `cd directorio` | Cambiar directorio remoto |
| `lcd directorio` | Cambiar directorio local |
| `get archivo` | Descargar archivo |
| `put archivo` | Subir archivo |
| `mget patrón` | Descargar múltiples archivos |
| `mput patrón` | Subir múltiples archivos |
| `mkdir directorio` | Crear directorio |
| `rmdir directorio` | Eliminar directorio |
| `del archivo` | Eliminar archivo |
| `exit` | Salir |

## Administración remota con rpcclient

`rpcclient` permite ejecutar llamadas RPC contra servidores SMB:

```bash
# Conectarse a un servidor
rpcclient -U usuario servidor

# Conexión anónima (null session)
rpcclient -U "" -N servidor
```

### Comandos interactivos de rpcclient

| Comando | Función |
|---------|---------|
| `srvinfo` | Información del servidor |
| `enumdomusers` | Listar usuarios del dominio |
| `enumdomgroups` | Listar grupos del dominio |
| `queryuser RID` | Información detallada de un usuario |
| `querygroup RID` | Información de un grupo |
| `lookupnames nombre` | Obtener SID de un nombre |
| `lookupsids SID` | Obtener nombre de un SID |
| `enumprivs` | Listar privilegios disponibles |
| `netshareenum` | Listar recursos compartidos |
| `netsharegetinfo nombre` | Información de un recurso |
| `getdompwinfo` | Política de contraseñas |

> **Para el examen:** `rpcclient` es útil para enumerar usuarios, grupos y recursos. Conocer los comandos básicos como `enumdomusers`, `srvinfo` y `netshareenum`.

## El comando net

El comando `net` es una herramienta versátil con múltiples subcomandos:

### net rpc

```bash
# Listar usuarios remotos
net rpc user list -U admin -S servidor

# Añadir un usuario
net rpc user add usuario contraseña -U admin -S servidor

# Listar grupos
net rpc group list -U admin -S servidor

# Listar recursos compartidos
net rpc share list -U admin -S servidor

# Unirse a un dominio NT4
net rpc join -U admin

# Información del dominio
net rpc info -U admin -S servidor
```

### net ads

```bash
# Unirse a un dominio Active Directory
net ads join -U admin

# Verificar la unión al dominio
net ads testjoin

# Listar información del dominio AD
net ads info

# Buscar en LDAP de AD
net ads search "(sAMAccountName=usuario)"

# Listar GPOs
net ads gpo list

# Buscar controladores de dominio
net ads lookup

# Renovar ticket Kerberos de la máquina
net ads keytab create
```

### net registry

```bash
# Listar claves del registro Samba
net registry enumerate HKLM\\Software

# Obtener valor de una clave
net registry getvalue HKLM\\Software\\Samba valor

# Establecer un valor
net registry setvalue HKLM\\Software\\Samba clave tipo valor
```

### Otros subcomandos de net

```bash
# Mostrar hora del servidor
net time -S servidor

# Listar sesiones
net status sessions

# Listar archivos abiertos
net status shares

# Sincronizar contraseña de máquina
net changesecretpw

# Caché de nombres
net cache list
net cache flush
```

## Herramientas de bases de datos TDB

Samba utiliza bases de datos TDB (Trivial Database) para almacenar estado interno. Las herramientas para gestionarlas son fundamentales:

### tdbbackup

```bash
# Crear copia de seguridad de una base TDB
tdbbackup /var/lib/samba/registry.tdb

# Verificar integridad y restaurar si es corrupta
tdbbackup -v /var/lib/samba/passdb.tdb

# Copia de seguridad con sufijo personalizado
tdbbackup -s .backup /var/lib/samba/secrets.tdb
```

### tdbtool

```bash
# Abrir una base TDB interactivamente
tdbtool /var/lib/samba/registry.tdb

# Comandos interactivos:
# info      - Información de la base de datos
# keys      - Listar todas las claves
# show key  - Mostrar valor de una clave
# delete key - Eliminar una clave
# dump      - Volcar todo el contenido
# check     - Verificar integridad
```

### tdbdump

```bash
# Volcar contenido completo de una base TDB
tdbdump /var/lib/samba/wins.dat.tdb

# Volcar base de datos de registro
tdbdump /var/lib/samba/registry.tdb
```

### Bases de datos TDB importantes

| Archivo | Función |
|---------|---------|
| `secrets.tdb` | Secretos de máquina, contraseña de dominio |
| `passdb.tdb` | Base de datos de usuarios Samba (tdbsam) |
| `registry.tdb` | Registro de Samba |
| `wins.dat` / `wins.tdb` | Base de datos WINS |
| `brlock.tdb` | Bloqueos de bytes de archivos |
| `locking.tdb` | Información de bloqueos compartidos |
| `sessionid.tdb` | Sesiones activas |
| `connections.tdb` | Conexiones activas |
| `account_policy.tdb` | Políticas de cuentas |
| `group_mapping.tdb` | Mapeo de grupos Windows a Unix |

> **Para el examen:** Conocer las tres herramientas TDB (`tdbbackup`, `tdbtool`, `tdbdump`) y las bases de datos más importantes como `secrets.tdb` y `passdb.tdb`.

## Monitorización de logs

### Archivos de log de Samba

```bash
# Logs principales
/var/log/samba/log.smbd      # Log del demonio smbd
/var/log/samba/log.nmbd      # Log del demonio nmbd
/var/log/samba/log.winbindd  # Log del demonio winbindd
/var/log/samba/log.samba     # Log del demonio AD DC
/var/log/samba/log.<cliente> # Logs por cliente (si se usa %m)

# Monitorizar logs en tiempo real
tail -f /var/log/samba/log.smbd

# Buscar errores
grep -i error /var/log/samba/log.*
```

### Rotación de logs

- `max log size` en smb.conf controla el tamaño máximo (KB)
- Cuando se alcanza el límite, Samba renombra el archivo con extensión `.old`
- Se recomienda configurar logrotate para gestión avanzada

## Procedimientos de mantenimiento

### Copias de seguridad

```bash
# Detener Samba antes del backup
systemctl stop smbd nmbd winbindd

# Backup de archivos críticos
tar czf samba-backup.tar.gz \
  /etc/samba/ \
  /var/lib/samba/private/ \
  /var/lib/samba/*.tdb

# Reiniciar Samba
systemctl start smbd nmbd winbindd
```

### Actualizaciones de Samba

- Siempre leer las notas de la versión antes de actualizar
- Hacer backup completo antes de la actualización
- Ejecutar `testparm` después de actualizar para verificar parámetros obsoletos
- Las bases TDB pueden requerir conversión entre versiones mayores
- En modo AD DC, usar `samba-tool dbcheck` después de actualizar

## Resumen de conceptos clave

- `smbstatus` para monitorizar conexiones activas y bloqueos
- `nmblookup` para consultas de nombres NetBIOS y WINS
- `smbclient` como cliente SMB interactivo o por línea de comandos
- `rpcclient` para administración RPC remota
- `net` con subcomandos rpc, ads y registry para gestión avanzada
- `tdbbackup`, `tdbtool` y `tdbdump` para bases de datos TDB
- Las copias de seguridad deben incluir `/etc/samba/` y `/var/lib/samba/private/`
