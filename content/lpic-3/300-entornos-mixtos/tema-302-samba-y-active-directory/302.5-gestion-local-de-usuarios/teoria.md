---
tipo: teoria
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.5"
titulo: "Gestión Local de Usuarios"
peso: 2
tags:
  - lpic-3
  - tema-302
  - teoria
---

# 302.5 Gestión Local de Usuarios

## Objetivos del subtema

Este subtema cubre la gestión de usuarios locales de Samba, incluyendo las herramientas smbpasswd y pdbedit, el mapeo de nombres de usuario, opciones de forzar usuario/grupo, cuenta de invitado y la interacción entre usuarios locales y winbind.

## smbpasswd - Gestión de contraseñas Samba

`smbpasswd` es la herramienta clásica para gestionar contraseñas de usuarios en la base de datos local de Samba:

### Operaciones básicas

```bash
# Añadir un usuario a la base de datos Samba
# (el usuario debe existir previamente en /etc/passwd)
smbpasswd -a pedro

# Cambiar la contraseña de un usuario
smbpasswd pedro

# Deshabilitar una cuenta Samba
smbpasswd -d pedro

# Habilitar una cuenta Samba
smbpasswd -e pedro

# Eliminar un usuario de la base de datos Samba
smbpasswd -x pedro

# Establecer contraseña nula (sin contraseña)
smbpasswd -n pedro
# Requiere: null passwords = yes en smb.conf

# Cambiar la contraseña de la cuenta de máquina
smbpasswd -m
```

### Consideraciones importantes

- El usuario debe existir en el sistema Linux (`/etc/passwd`) antes de añadirlo a Samba
- La contraseña Samba es independiente de la contraseña del sistema Linux
- `smbpasswd` trabaja con el backend definido en `passdb backend`
- En entornos AD DC, no se usa `smbpasswd` sino `samba-tool user`
- La opción `-r servidor` permite cambiar la contraseña en un servidor remoto

> **Para el examen:** `smbpasswd -a` requiere que el usuario UNIX exista previamente. La contraseña Samba y la contraseña UNIX son bases de datos separadas.

## pdbedit - Gestión avanzada de la base de datos de usuarios

`pdbedit` es una herramienta más completa que `smbpasswd` para gestionar la base de datos passdb:

### Operaciones con pdbedit

```bash
# Listar todos los usuarios
pdbedit -L

# Listar con información detallada
pdbedit -L -v

# Listar en formato smbpasswd (legacy)
pdbedit -L -w

# Añadir un usuario
pdbedit -a -u pedro

# Eliminar un usuario
pdbedit -x -u pedro

# Mostrar información detallada de un usuario
pdbedit -v -u pedro

# Modificar atributos de un usuario
pdbedit -u pedro --fullname="Pedro García"
pdbedit -u pedro --homedir="\\\\servidor\\pedro"
pdbedit -u pedro --drive="H:"
pdbedit -u pedro --profile="\\\\servidor\\profiles\\pedro"
pdbedit -u pedro --logon-script="login.bat"

# Configurar políticas de cuenta
pdbedit -u pedro --account-policy="password history" --value=5

# Establecer horas de login permitidas
pdbedit -u pedro --logon-hours="FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"

# Exportar base de datos
pdbedit -e smbpasswd:/tmp/export.txt

# Importar base de datos
pdbedit -i smbpasswd:/tmp/export.txt

# Migrar entre backends
pdbedit -i smbpasswd:/etc/samba/smbpasswd -e tdbsam:/var/lib/samba/private/passdb.tdb
```

### Atributos gestionados por pdbedit

| Atributo | Opción | Descripción |
|----------|--------|-------------|
| Nombre completo | `--fullname` | Nombre para mostrar |
| Directorio home | `--homedir` | Ruta UNC del home en red |
| Unidad de disco | `--drive` | Letra de unidad para mapear home |
| Script de login | `--logon-script` | Script ejecutado al iniciar sesión |
| Perfil | `--profile` | Ruta UNC del perfil de usuario |
| Descripción | `--account-desc` | Descripción de la cuenta |
| Caducidad de cuenta | `--account-control` | Flags de control de cuenta |

> **Para el examen:** `pdbedit` permite operaciones que `smbpasswd` no puede, como migración entre backends, exportación/importación y modificación de atributos extendidos.

## Mapeo de nombres de usuario (username map)

El parámetro `username map` permite traducir nombres de usuario entre los que envía el cliente Windows y los que existen en el sistema Linux:

### Configuración del mapeo

```ini
# smb.conf
[global]
username map = /etc/samba/smbusers
```

### Formato del archivo de mapeo

```
# /etc/samba/smbusers
# Formato: usuario_unix = usuario_windows [usuario_windows2 ...]

# Mapear administrador de Windows a root
root = administrator admin "Admin Principal"

# Mapear usuario de red a usuario local
pedro = "Pedro Garcia" pgarcia

# Mapear múltiples usuarios de Windows a un usuario Unix
webmaster = "Web Admin" webadmin

# Usar comodín (cualquier usuario no mapeado usa su mismo nombre)
!nobody = *
```

### Reglas de mapeo

- Se evalúan en orden, la primera coincidencia gana
- Los nombres con espacios se encierran entre comillas
- El carácter `!` indica que se deja de buscar después de esa línea
- El comodín `*` coincide con cualquier nombre no mapeado previamente
- El mapeo se aplica antes de la autenticación

### username map script

Para mapeos dinámicos, se puede usar un script:

```ini
[global]
username map script = /usr/local/bin/samba-user-map.sh
```

```bash
#!/bin/bash
# /usr/local/bin/samba-user-map.sh
# Recibe el nombre de usuario como argumento
# Debe devolver el nombre mapeado

echo "${1,,}"  # Ejemplo: convertir a minúsculas
```

> **Para el examen:** El archivo de mapeo traduce nombres ANTES de la autenticación. Es especialmente útil para mapear "administrator" a "root" y para resolver diferencias de nombres entre Windows y Linux.

## Force user y force group

Estos parámetros fuerzan la identidad utilizada para operaciones de archivos en un recurso compartido:

### force user

```ini
[datos]
path = /srv/samba/datos
force user = sambauser
```

- Todas las operaciones de archivos se realizan como `sambauser`
- El usuario autenticado mantiene sus permisos Samba, pero los archivos se crean con la identidad forzada
- Útil para recursos donde todos los archivos deben pertenecer al mismo usuario

### force group

```ini
[proyecto]
path = /srv/samba/proyecto
force group = proyecto
```

- Todas las operaciones de archivos usan el grupo `proyecto`
- Se puede combinar con `force user`
- Útil para directorios colaborativos donde el grupo debe ser consistente

### force group con +

```ini
[compartido]
path = /srv/samba/compartido
force group = +equipo
```

- El signo `+` indica que solo se fuerza el grupo si el usuario ya es miembro del grupo `equipo`
- Si el usuario no pertenece al grupo, se usa su grupo primario normal
- Permite control más granular

### Ejemplo combinado

```ini
[web]
path = /var/www/html
read only = no
valid users = @webteam
force user = www-data
force group = www-data
create mask = 0664
directory mask = 0775
```

## Cuenta de invitado (guest account)

La cuenta de invitado permite acceso anónimo a recursos compartidos:

### Configuración

```ini
[global]
# Definir la cuenta Unix usada para accesos de invitado
guest account = nobody

# Qué hacer cuando falla la autenticación
map to guest = Bad User
# Opciones:
#   Never        - Nunca mapear a invitado (predeterminado)
#   Bad User     - Si el usuario no existe, tratarlo como invitado
#   Bad Password - Si la contraseña falla, tratarlo como invitado (inseguro)
#   Bad Uid      - Si el usuario no tiene cuenta Unix

[publico]
path = /srv/samba/publico
guest ok = yes
read only = yes
browseable = yes
```

### Consideraciones de seguridad

- `map to guest = Bad Password` es inseguro: un usuario con contraseña incorrecta accedería como invitado sin saberlo
- `map to guest = Bad User` es más seguro: solo usuarios inexistentes son mapeados a invitado
- La cuenta de invitado debe existir en el sistema (`nobody` es la opción estándar)
- Los archivos creados por el invitado pertenecen a la cuenta `guest account`

> **Para el examen:** Conocer las diferencias entre las opciones de `map to guest` y cuándo es seguro usar cada una. `Bad User` es la opción más comúnmente usada.

## Rangos idmap locales

Para servidores que usan tanto usuarios locales como de dominio, es importante definir rangos de ID no solapados:

```ini
[global]
# Rango para dominios desconocidos (comodín)
idmap config * : backend = tdb
idmap config * : range = 3000-7999

# Rango para el dominio AD
idmap config EMPRESA : backend = rid
idmap config EMPRESA : range = 10000-999999
```

### Reglas de rangos

- Los rangos NO deben solaparse entre backends
- Los UIDs/GIDs del sistema local (normalmente < 1000) no deben estar en ningún rango idmap
- El rango comodín (`*`) debe ser más pequeño que los rangos de dominio
- El rango debe ser suficientemente grande para todos los usuarios/grupos del dominio

## Integración de getent con winbind

### Verificar usuarios

```bash
# Listar todos los usuarios (locales + dominio)
getent passwd

# Buscar un usuario de dominio
getent passwd pedro
getent passwd EMPRESA\\pedro
getent passwd pedro@empresa.com

# Listar todos los grupos (locales + dominio)
getent group

# Buscar un grupo de dominio
getent group "Domain Users"
getent group "EMPRESA\\Domain Users"

# Verificar pertenencia a grupos
id pedro
groups pedro
```

### Solución de problemas con getent

```bash
# Si getent no muestra usuarios de dominio:

# 1. Verificar nsswitch.conf
grep winbind /etc/nsswitch.conf
# Debe mostrar: passwd: files winbind

# 2. Verificar que winbindd funciona
wbinfo -p

# 3. Verificar enumeración
# smb.conf debe tener:
# winbind enum users = yes
# winbind enum groups = yes

# 4. Verificar con wbinfo directamente
wbinfo -u
wbinfo -g

# 5. Verificar mapeo de un usuario específico
wbinfo -i pedro
```

### winbind use default domain

```ini
[global]
# Con winbind use default domain = yes:
# getent passwd pedro          -> funciona
# getent passwd EMPRESA\pedro  -> funciona

# Con winbind use default domain = no (predeterminado):
# getent passwd EMPRESA\pedro  -> funciona
# getent passwd pedro           -> NO funciona (sin prefijo)
```

## Gestión de acceso por recurso

### Combinación de controles de acceso

```ini
[confidencial]
path = /srv/samba/confidencial
# Autenticación: solo estos usuarios pueden acceder
valid users = @gerencia, director
# Escritura: solo director puede escribir
write list = director
# Lectura: gerencia solo puede leer
read list = @gerencia
# Identidad forzada para archivos
force group = gerencia
# Permisos de archivos nuevos
create mask = 0660
directory mask = 0770
# Sin acceso de invitado
guest ok = no
```

## Resumen de conceptos clave

- `smbpasswd` gestiona contraseñas locales de Samba; el usuario UNIX debe existir primero
- `pdbedit` permite gestión avanzada: atributos extendidos, migración, exportación/importación
- `username map` traduce nombres de usuario antes de la autenticación
- `force user` y `force group` fuerzan la identidad para operaciones de archivos
- `force group = +grupo` solo aplica si el usuario ya es miembro del grupo
- `guest account` define la cuenta UNIX para acceso anónimo
- `map to guest = Bad User` mapea usuarios inexistentes a invitado
- Los rangos idmap no deben solaparse entre backends ni con UIDs locales
- `getent passwd/group` verifica la integración NSS con winbind
- `winbind use default domain = yes` permite login sin prefijo de dominio
