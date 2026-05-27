---
tipo: teoria
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.3"
titulo: "Gestión de Usuarios en Active Directory"
peso: 3
tags:
  - lpic-3
  - tema-302
  - teoria
---

# 302.3 Gestión de Usuarios en Active Directory

## Objetivos del subtema

Este subtema cubre la gestión de usuarios y grupos en un dominio Active Directory administrado por Samba, incluyendo herramientas de línea de comandos, RSAT desde Windows, políticas de contraseñas, GPOs básicas, integración LDAP y mapeo de UIDs/GIDs.

## Gestión de usuarios con samba-tool

### Crear usuarios

```bash
# Crear usuario con contraseña interactiva
samba-tool user create pedro

# Crear usuario con contraseña en línea de comandos
samba-tool user create pedro 'P@ssw0rd123'

# Crear usuario con atributos adicionales
samba-tool user create pedro 'P@ssw0rd123' \
  --given-name="Pedro" \
  --surname="García" \
  --mail-address="pedro@empresa.com" \
  --login-shell="/bin/bash" \
  --uid-number=10001 \
  --gid-number=10000 \
  --unix-home="/home/pedro"

# Crear usuario que debe cambiar la contraseña en el primer inicio
samba-tool user create pedro 'TempPass1' --must-change-at-next-login
```

### Administrar usuarios existentes

```bash
# Listar usuarios
samba-tool user list

# Mostrar detalles de un usuario
samba-tool user show pedro

# Deshabilitar un usuario
samba-tool user disable pedro

# Habilitar un usuario
samba-tool user enable pedro

# Eliminar un usuario
samba-tool user delete pedro

# Cambiar contraseña
samba-tool user setpassword pedro --newpassword='NuevaPass123'

# Forzar cambio de contraseña en el próximo login
samba-tool user setpassword pedro --newpassword='TempPass1' --must-change-at-next-login

# Establecer caducidad de contraseña
samba-tool user setexpiry pedro --days=90

# Configurar contraseña que nunca caduca
samba-tool user setexpiry pedro --noexpiry
```

> **Para el examen:** `samba-tool user create` requiere que la contraseña cumpla con la política de complejidad de AD (mayúsculas, minúsculas, números, caracteres especiales, mínimo 7 caracteres por defecto).

## Gestión de grupos con samba-tool

### Tipos de grupos en AD

| Tipo | Alcance | Uso |
|------|---------|-----|
| Security (Seguridad) | Local, Global, Universal | Asignar permisos |
| Distribution (Distribución) | Local, Global, Universal | Listas de correo |

### Operaciones con grupos

```bash
# Crear grupo de seguridad (predeterminado)
samba-tool group add desarrollo

# Crear grupo con descripción
samba-tool group add desarrollo --description="Equipo de desarrollo"

# Crear grupo de tipo distribución
samba-tool group add lista-info --group-type=Distribution

# Listar grupos
samba-tool group list

# Mostrar detalles de un grupo
samba-tool group show desarrollo

# Añadir miembros al grupo
samba-tool group addmembers desarrollo pedro,maria,carlos

# Quitar miembros del grupo
samba-tool group removemembers desarrollo carlos

# Listar miembros de un grupo
samba-tool group listmembers desarrollo

# Eliminar grupo
samba-tool group delete desarrollo
```

## RSAT (Remote Server Administration Tools)

Las herramientas RSAT permiten administrar Samba AD DC desde un equipo Windows:

### Herramientas RSAT principales

| Herramienta | Función |
|-------------|---------|
| Active Directory Users and Computers (ADUC) | Gestionar usuarios, grupos, OUs, equipos |
| Active Directory Domains and Trusts | Gestionar confianzas entre dominios |
| Active Directory Sites and Services | Gestionar sitios y replicación |
| DNS Manager | Gestionar zonas y registros DNS |
| Group Policy Management | Gestionar GPOs |

### Instalación de RSAT en Windows

```powershell
# Windows 10/11 - Instalar RSAT
Add-WindowsCapability -Online -Name Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0
Add-WindowsCapability -Online -Name Rsat.Dns.Tools~~~~0.0.1.0
Add-WindowsCapability -Online -Name Rsat.GroupPolicy.Management.Tools~~~~0.0.1.0
```

### Requisitos para usar RSAT con Samba

- El equipo Windows debe estar unido al dominio Samba AD
- El usuario debe tener privilegios de administrador del dominio
- DNS debe apuntar al DC Samba
- Kerberos debe funcionar correctamente entre Windows y Samba

> **Para el examen:** RSAT funciona con Samba AD DC y es la forma recomendada de administrar aspectos como GPOs complejas y gestión de sitios que no están completamente soportados por samba-tool.

## Políticas de contraseñas

### Configurar política de contraseñas del dominio

```bash
# Mostrar política actual
samba-tool domain passwordsettings show

# Configurar longitud mínima
samba-tool domain passwordsettings set --min-pwd-length=8

# Configurar historial de contraseñas
samba-tool domain passwordsettings set --history-length=12

# Configurar edad mínima (días)
samba-tool domain passwordsettings set --min-pwd-age=1

# Configurar edad máxima (días)
samba-tool domain passwordsettings set --max-pwd-age=90

# Configurar complejidad
samba-tool domain passwordsettings set --complexity=on

# Configurar bloqueo de cuenta
samba-tool domain passwordsettings set --account-lockout-threshold=5
samba-tool domain passwordsettings set --account-lockout-duration=30
samba-tool domain passwordsettings set --reset-account-lockout-after=15
```

### Políticas de contraseñas granulares (PSO)

Samba soporta políticas de contraseñas granulares (Fine-Grained Password Policies):

```bash
# Crear una PSO para un grupo específico
samba-tool domain passwordsettings pso create "PSO-Admins" 10 \
  --min-pwd-length=12 \
  --complexity=on \
  --history-length=24 \
  --max-pwd-age=30

# Aplicar PSO a un grupo
samba-tool domain passwordsettings pso apply "PSO-Admins" "Domain Admins"

# Listar PSOs
samba-tool domain passwordsettings pso list

# Mostrar detalles de una PSO
samba-tool domain passwordsettings pso show "PSO-Admins"
```

## GPO (Group Policy Objects) básicas

### Gestión de GPOs con samba-tool

```bash
# Listar todas las GPOs
samba-tool gpo listall

# Mostrar GPOs aplicadas a un usuario
samba-tool gpo list usuario

# Crear una nueva GPO
samba-tool gpo create "Política de escritorio" -U administrator

# Vincular GPO a una OU
samba-tool gpo setlink {GPO-GUID} "OU=Ventas,DC=empresa,DC=com" -U administrator

# Desvincular GPO de una OU
samba-tool gpo dellink {GPO-GUID} "OU=Ventas,DC=empresa,DC=com" -U administrator

# Mostrar detalles de una GPO
samba-tool gpo show {GPO-GUID}

# Obtener informe de GPO
samba-tool gpo getinheritance "OU=Ventas,DC=empresa,DC=com"
```

### GPOs predeterminadas

- **Default Domain Policy**: Política global del dominio (contraseñas, bloqueo de cuenta)
- **Default Domain Controllers Policy**: Política para los DCs

> **Para el examen:** La gestión completa de GPOs (edición de configuraciones) normalmente requiere RSAT desde Windows, ya que samba-tool tiene soporte limitado para la edición del contenido de las GPOs.

## Integración LDAP

Active Directory es un servicio LDAP, por lo que se puede consultar y modificar usando herramientas LDAP estándar:

### Consultas LDAP al AD de Samba

```bash
# Buscar un usuario
ldbsearch -H ldap://localhost -U administrator "(&(objectClass=user)(sAMAccountName=pedro))"

# Buscar todos los usuarios
ldbsearch -H ldap://localhost -U administrator "(objectClass=user)" cn sAMAccountName

# Buscar grupos
ldbsearch -H ldap://localhost -U administrator "(objectClass=group)" cn

# Buscar en una OU específica
ldbsearch -H ldap://localhost \
  -b "OU=Ventas,DC=empresa,DC=com" \
  -U administrator "(objectClass=user)" cn

# Usar ldapsearch estándar
ldapsearch -H ldap://dc.empresa.com -D "administrator@empresa.com" -W \
  -b "DC=empresa,DC=com" "(sAMAccountName=pedro)"
```

### Atributos LDAP importantes en AD

| Atributo | Descripción |
|----------|-------------|
| `sAMAccountName` | Nombre de login (pre-Windows 2000) |
| `userPrincipalName` | Nombre de login (formato UPN: user@domain) |
| `cn` | Nombre común |
| `distinguishedName` | DN completo del objeto |
| `memberOf` | Grupos a los que pertenece |
| `objectSid` | SID del objeto |
| `uidNumber` | UID POSIX (RFC2307) |
| `gidNumber` | GID POSIX (RFC2307) |
| `loginShell` | Shell de login (RFC2307) |
| `unixHomeDirectory` | Directorio home (RFC2307) |

## Mapeo de UIDs/GIDs (idmap)

El mapeo de identificadores entre Windows (SIDs) y Linux (UIDs/GIDs) es fundamental:

### Backends idmap principales

| Backend | Descripción | Uso |
|---------|-------------|-----|
| `tdb` | Mapeo almacenado en TDB local | Backend general para dominios de confianza |
| `rid` | Calcula UID/GID a partir del RID | Predecible, sin estado, bueno para dominios de confianza |
| `ad` | Lee atributos RFC2307 del AD | Requiere atributos POSIX en AD |
| `autorid` | Asignación automática basada en RID | Simple, automático, bueno para entornos multidominio |
| `ldap` | Lee mapeos de un servidor LDAP | Para entornos con LDAP independiente |

### Configuración de idmap en smb.conf

```ini
[global]
# Rango general para dominios desconocidos
idmap config * : backend = tdb
idmap config * : range = 10000-19999

# Rango para el dominio propio
idmap config EMPRESA : backend = rid
idmap config EMPRESA : range = 20000-99999

# O usar atributos RFC2307 del AD
idmap config EMPRESA : backend = ad
idmap config EMPRESA : range = 20000-99999
idmap config EMPRESA : schema_mode = rfc2307
```

> **Para el examen:** Conocer los diferentes backends idmap y cuándo usar cada uno. `rid` es predecible y no requiere datos adicionales en AD. `ad` requiere atributos RFC2307 pero permite control preciso.

## Unidades organizativas (OUs)

```bash
# Crear una OU
samba-tool ou create "OU=Ventas,DC=empresa,DC=com"

# Crear OU anidada
samba-tool ou create "OU=Madrid,OU=Ventas,DC=empresa,DC=com"

# Listar OUs
samba-tool ou list

# Mover un usuario a una OU
samba-tool user move pedro "OU=Ventas,DC=empresa,DC=com"

# Eliminar una OU
samba-tool ou delete "OU=Ventas,DC=empresa,DC=com"
```

## Esquema de Active Directory

- El esquema define los tipos de objetos y atributos disponibles en AD
- Samba 4 implementa un esquema compatible con Windows AD
- Las extensiones RFC2307 añaden atributos POSIX al esquema
- El Schema Master es el único DC que puede modificar el esquema
- Los cambios de esquema son irreversibles y se replican a todos los DCs

## Resumen de conceptos clave

- `samba-tool user/group` para gestión completa de usuarios y grupos AD
- RSAT desde Windows es necesario para administración avanzada de GPOs
- Las políticas de contraseñas se gestionan con `samba-tool domain passwordsettings`
- GPOs se crean y vinculan con `samba-tool gpo`, pero se editan desde RSAT
- AD es accesible vía LDAP estándar (ldbsearch, ldapsearch)
- idmap mapea SIDs a UIDs/GIDs con backends: tdb, rid, ad, autorid
- Las OUs organizan objetos jerárquicamente dentro del dominio
- RFC2307 permite almacenar atributos POSIX directamente en AD
