---
tipo: comandos
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.3"
titulo: "Gestión de Usuarios AD - Comandos Clave"
peso: 3
tags:
  - lpic-3
  - tema-302
  - comandos
---

# Comandos clave - 302.3 Gestión de Usuarios en Active Directory

## Gestión de usuarios

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool user create` | Crear usuario | `samba-tool user create pedro 'P@ss123'` |
| `samba-tool user create --unix` | Crear con atributos POSIX | `samba-tool user create pedro 'P@ss' --uid-number=10001 --login-shell=/bin/bash` |
| `samba-tool user list` | Listar usuarios | `samba-tool user list` |
| `samba-tool user show` | Detalles de un usuario | `samba-tool user show pedro` |
| `samba-tool user delete` | Eliminar usuario | `samba-tool user delete pedro` |
| `samba-tool user disable` | Deshabilitar usuario | `samba-tool user disable pedro` |
| `samba-tool user enable` | Habilitar usuario | `samba-tool user enable pedro` |
| `samba-tool user setpassword` | Cambiar contraseña | `samba-tool user setpassword pedro --newpassword='Nueva1'` |
| `samba-tool user setexpiry` | Configurar expiración | `samba-tool user setexpiry pedro --days=90` |
| `samba-tool user setexpiry --noexpiry` | Sin expiración | `samba-tool user setexpiry pedro --noexpiry` |
| `samba-tool user move` | Mover a otra OU | `samba-tool user move pedro "OU=Ventas,DC=empresa,DC=com"` |

## Gestión de grupos

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool group add` | Crear grupo | `samba-tool group add desarrollo` |
| `samba-tool group list` | Listar grupos | `samba-tool group list` |
| `samba-tool group show` | Detalles de grupo | `samba-tool group show desarrollo` |
| `samba-tool group delete` | Eliminar grupo | `samba-tool group delete desarrollo` |
| `samba-tool group addmembers` | Añadir miembros | `samba-tool group addmembers desarrollo pedro,maria` |
| `samba-tool group removemembers` | Quitar miembros | `samba-tool group removemembers desarrollo pedro` |
| `samba-tool group listmembers` | Listar miembros | `samba-tool group listmembers desarrollo` |

## Políticas de contraseñas

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool domain passwordsettings show` | Mostrar política actual | `samba-tool domain passwordsettings show` |
| `samba-tool domain passwordsettings set --min-pwd-length` | Longitud mínima | `samba-tool domain passwordsettings set --min-pwd-length=8` |
| `samba-tool domain passwordsettings set --complexity` | Complejidad | `samba-tool domain passwordsettings set --complexity=on` |
| `samba-tool domain passwordsettings set --history-length` | Historial | `samba-tool domain passwordsettings set --history-length=12` |
| `samba-tool domain passwordsettings set --max-pwd-age` | Edad máxima | `samba-tool domain passwordsettings set --max-pwd-age=90` |
| `samba-tool domain passwordsettings set --min-pwd-age` | Edad mínima | `samba-tool domain passwordsettings set --min-pwd-age=1` |
| `samba-tool domain passwordsettings set --account-lockout-threshold` | Bloqueo | `samba-tool domain passwordsettings set --account-lockout-threshold=5` |

## GPOs

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool gpo listall` | Listar todas las GPOs | `samba-tool gpo listall` |
| `samba-tool gpo list usuario` | GPOs de un usuario | `samba-tool gpo list pedro` |
| `samba-tool gpo create` | Crear GPO | `samba-tool gpo create "Mi GPO" -U admin` |
| `samba-tool gpo show` | Detalles de GPO | `samba-tool gpo show {GUID}` |
| `samba-tool gpo setlink` | Vincular GPO a OU | `samba-tool gpo setlink {GUID} "OU=X,DC=e,DC=com"` |
| `samba-tool gpo dellink` | Desvincular GPO | `samba-tool gpo dellink {GUID} "OU=X,DC=e,DC=com"` |
| `samba-tool gpo getinheritance` | Ver herencia GPO | `samba-tool gpo getinheritance "OU=X,DC=e,DC=com"` |

## Unidades organizativas

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool ou create` | Crear OU | `samba-tool ou create "OU=Ventas,DC=empresa,DC=com"` |
| `samba-tool ou list` | Listar OUs | `samba-tool ou list` |
| `samba-tool ou delete` | Eliminar OU | `samba-tool ou delete "OU=Ventas,DC=empresa,DC=com"` |

## Consultas LDAP

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `ldbsearch -H ldap://localhost` | Buscar en AD con ldbsearch | `ldbsearch -H ldap://localhost -U admin "(cn=pedro)"` |
| `ldapsearch -H ldap://dc` | Buscar con ldapsearch | `ldapsearch -H ldap://dc.empresa.com -D "admin@empresa.com" -W "(cn=pedro)"` |
| `samba-tool user show` | Consultar atributos de usuario | `samba-tool user show pedro --attributes=uidNumber,gidNumber` |

## Configuración idmap

| Parámetro | Función | Ejemplo en smb.conf |
|-----------|---------|---------------------|
| `idmap config * : backend` | Backend general | `idmap config * : backend = tdb` |
| `idmap config * : range` | Rango general | `idmap config * : range = 10000-19999` |
| `idmap config DOM : backend` | Backend del dominio | `idmap config EMPRESA : backend = rid` |
| `idmap config DOM : range` | Rango del dominio | `idmap config EMPRESA : range = 20000-99999` |
| `idmap config DOM : schema_mode` | Esquema para backend ad | `idmap config EMPRESA : schema_mode = rfc2307` |
