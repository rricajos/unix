---
tipo: comandos
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.5"
titulo: "Gestión Local de Usuarios - Comandos Clave"
peso: 2
tags:
  - lpic-3
  - tema-302
  - comandos
---

# Comandos clave - 302.5 Gestión Local de Usuarios

## smbpasswd

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `smbpasswd -a usuario` | Añadir usuario a Samba | `smbpasswd -a pedro` |
| `smbpasswd usuario` | Cambiar contraseña | `smbpasswd pedro` |
| `smbpasswd -d usuario` | Deshabilitar cuenta | `smbpasswd -d pedro` |
| `smbpasswd -e usuario` | Habilitar cuenta | `smbpasswd -e pedro` |
| `smbpasswd -x usuario` | Eliminar de Samba | `smbpasswd -x pedro` |
| `smbpasswd -n usuario` | Contraseña nula | `smbpasswd -n pedro` (requiere null passwords = yes) |
| `smbpasswd -m` | Cambiar contraseña de máquina | `smbpasswd -m` |
| `smbpasswd -r servidor` | Cambiar en servidor remoto | `smbpasswd -r dc.empresa.com -U pedro` |

## pdbedit

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `pdbedit -L` | Listar usuarios | `pdbedit -L` |
| `pdbedit -L -v` | Listar con detalles | `pdbedit -L -v` |
| `pdbedit -L -w` | Listar en formato smbpasswd | `pdbedit -L -w` |
| `pdbedit -a -u usuario` | Añadir usuario | `pdbedit -a -u pedro` |
| `pdbedit -x -u usuario` | Eliminar usuario | `pdbedit -x -u pedro` |
| `pdbedit -v -u usuario` | Detalles de usuario | `pdbedit -v -u pedro` |
| `pdbedit -u user --fullname` | Cambiar nombre completo | `pdbedit -u pedro --fullname="Pedro García"` |
| `pdbedit -u user --homedir` | Cambiar home de red | `pdbedit -u pedro --homedir="\\\\srv\\pedro"` |
| `pdbedit -u user --drive` | Asignar letra de unidad | `pdbedit -u pedro --drive="H:"` |
| `pdbedit -u user --profile` | Ruta del perfil | `pdbedit -u pedro --profile="\\\\srv\\profiles\\pedro"` |
| `pdbedit -u user --logon-script` | Script de login | `pdbedit -u pedro --logon-script="login.bat"` |
| `pdbedit -e backend:ruta` | Exportar base de datos | `pdbedit -e smbpasswd:/tmp/export.txt` |
| `pdbedit -i backend:ruta` | Importar base de datos | `pdbedit -i smbpasswd:/tmp/import.txt` |

## Parámetros de mapeo de usuarios en smb.conf

| Parámetro | Función | Ejemplo |
|-----------|---------|---------|
| `username map` | Archivo de mapeo de usuarios | `username map = /etc/samba/smbusers` |
| `username map script` | Script para mapeo dinámico | `username map script = /usr/local/bin/map.sh` |
| `force user` | Forzar usuario para operaciones | `force user = www-data` |
| `force group` | Forzar grupo para operaciones | `force group = proyecto` |
| `force group = +grupo` | Forzar grupo solo si es miembro | `force group = +equipo` |
| `guest account` | Cuenta UNIX para invitados | `guest account = nobody` |
| `map to guest` | Cuándo mapear a invitado | `map to guest = Bad User` |
| `guest ok` | Permitir acceso anónimo al recurso | `guest ok = yes` |

## Formato del archivo username map

| Sintaxis | Función | Ejemplo |
|----------|---------|---------|
| `unix = windows` | Mapeo simple | `root = administrator` |
| `unix = "Nombre Con Espacios"` | Mapeo con espacios | `root = "Admin Principal"` |
| `unix = win1 win2 win3` | Mapeo múltiple | `root = administrator admin sysadmin` |
| `!unix = *` | Comodín (detiene búsqueda) | `!nobody = *` |

## Verificación con getent y winbind

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `getent passwd` | Listar usuarios (locales + dominio) | `getent passwd` |
| `getent passwd usuario` | Buscar usuario específico | `getent passwd pedro` |
| `getent group` | Listar grupos (locales + dominio) | `getent group` |
| `getent group grupo` | Buscar grupo específico | `getent group "Domain Users"` |
| `id usuario` | UID, GID y grupos | `id pedro` |
| `groups usuario` | Grupos de un usuario | `groups pedro` |
| `wbinfo -i usuario` | Info completa de usuario winbind | `wbinfo -i pedro` |

## Control de acceso por recurso

| Parámetro | Función | Ejemplo |
|-----------|---------|---------|
| `valid users` | Usuarios con acceso | `valid users = @grupo, user1` |
| `invalid users` | Usuarios sin acceso | `invalid users = root` |
| `read list` | Usuarios con solo lectura | `read list = @lectores` |
| `write list` | Usuarios con escritura | `write list = @editores` |
| `admin users` | Usuarios con permisos de root | `admin users = admin` |
| `read only` | Recurso solo lectura | `read only = yes` |
| `writable` | Recurso con escritura | `writable = yes` |

## Rangos idmap locales

| Parámetro | Función | Ejemplo |
|-----------|---------|---------|
| `idmap config * : backend` | Backend para dominios no configurados | `idmap config * : backend = tdb` |
| `idmap config * : range` | Rango para backend comodín | `idmap config * : range = 3000-7999` |
| `winbind enum users` | Enumerar usuarios vía winbind | `winbind enum users = yes` |
| `winbind enum groups` | Enumerar grupos vía winbind | `winbind enum groups = yes` |
| `winbind use default domain` | Omitir prefijo de dominio | `winbind use default domain = yes` |
