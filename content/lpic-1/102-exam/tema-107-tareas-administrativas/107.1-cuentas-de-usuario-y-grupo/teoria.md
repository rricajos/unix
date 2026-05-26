---
title: "107.1 - Teoria: Gestionar cuentas de usuario y grupo"
tags:
  - lpic-1
  - examen-102
  - tema-107
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "102"
tema: "107"
subtema: "107.1"
---

# 107.1 - Teoria: Gestionar cuentas de usuario y grupo

## 1. Archivos de base de datos de usuarios y grupos

### /etc/passwd - Informacion de cuentas de usuario
Contiene la informacion basica de cada cuenta de usuario. Es legible por todos los usuarios.

**Formato: 7 campos separados por `:`**
```
usuario:x:UID:GID:GECOS:home:shell
```

| Campo | Descripcion | Ejemplo |
|-------|-------------|---------|
| 1. usuario | Nombre de login | `sandra` |
| 2. password | `x` indica que la contrasena esta en /etc/shadow | `x` |
| 3. UID | User ID (identificador numerico) | `1000` |
| 4. GID | Group ID del grupo primario | `1000` |
| 5. GECOS | Comentario (nombre completo, info contacto) | `Sandra Garcia` |
| 6. home | Directorio home | `/home/sandra` |
| 7. shell | Shell de login | `/bin/bash` |

**Ejemplo:**
```
sandra:x:1000:1000:Sandra Garcia:/home/sandra:/bin/bash
root:x:0:0:root:/root:/bin/bash
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
```

**UIDs importantes:**
- `0` = root (superusuario)
- `1-999` = usuarios del sistema (servicios, daemons)
- `1000+` = usuarios regulares (en la mayoria de distribuciones)

---

### /etc/shadow - Contrasenas cifradas y politicas de envejecimiento
Contiene las contrasenas cifradas y la informacion de envejecimiento. Solo legible por root.

**Formato: 9 campos separados por `:`**
```
usuario:password_hash:lastchg:min:max:warn:inactive:expire:reserved
```

| Campo | Descripcion | Ejemplo |
|-------|-------------|---------|
| 1. usuario | Nombre de login | `sandra` |
| 2. password_hash | Contrasena cifrada | `$6$salt$hash...` |
| 3. lastchg | Dias desde 01/01/1970 del ultimo cambio | `19503` |
| 4. min | Dias minimos entre cambios de contrasena | `0` |
| 5. max | Dias maximos de validez de la contrasena | `99999` |
| 6. warn | Dias de aviso antes de expirar | `7` |
| 7. inactive | Dias de gracia tras expirar (cuenta inactiva) | `30` |
| 8. expire | Fecha de expiracion de la cuenta (dias desde epoch) | `19900` |
| 9. reserved | Reservado para uso futuro | (vacio) |

**Valores especiales del campo password:**
- `$6$...` = Contrasena cifrada con SHA-512 (lo mas comun)
- `$5$...` = SHA-256
- `$y$...` = yescrypt (moderno)
- `$1$...` = MD5 (obsoleto, inseguro)
- `!` o `!!` = Cuenta bloqueada (no se puede iniciar sesion con contrasena)
- `*` = Cuenta deshabilitada
- (vacio) = Sin contrasena (acceso sin contrasena)

---

### /etc/group - Informacion de grupos
Contiene la informacion de los grupos del sistema.

**Formato: 4 campos separados por `:`**
```
grupo:password:GID:miembros
```

| Campo | Descripcion | Ejemplo |
|-------|-------------|---------|
| 1. grupo | Nombre del grupo | `developers` |
| 2. password | `x` o vacio (raramente usado) | `x` |
| 3. GID | Group ID | `1001` |
| 4. miembros | Lista de usuarios separados por coma | `sandra,carlos,ana` |

**Ejemplo:**
```
root:x:0:
sandra:x:1000:
developers:x:1001:sandra,carlos
sudo:x:27:sandra
```

**NOTA:** El campo miembros NO lista a los usuarios cuyo grupo primario es este grupo (eso se define en /etc/passwd). Solo lista los miembros adicionales (grupo secundario).

---

### /etc/gshadow - Contrasenas de grupos
Contiene contrasenas cifradas de grupos y administradores de grupo. Solo legible por root.

**Formato: 4 campos separados por `:`**
```
grupo:password:admins:miembros
```

| Campo | Descripcion |
|-------|-------------|
| 1. grupo | Nombre del grupo |
| 2. password | Contrasena cifrada del grupo |
| 3. admins | Administradores del grupo (pueden agregar/eliminar miembros) |
| 4. miembros | Miembros del grupo |

---

## 2. Archivos de configuracion

### /etc/login.defs
Archivo de configuracion que define los valores por defecto para la creacion de usuarios y politicas de contrasenas.

```bash
# Rango de UIDs para usuarios regulares
UID_MIN         1000
UID_MAX         60000

# Rango de GIDs para grupos regulares
GID_MIN         1000
GID_MAX         60000

# Politica de contrasenas por defecto
PASS_MAX_DAYS   99999    # Dias maximos de validez
PASS_MIN_DAYS   0        # Dias minimos entre cambios
PASS_WARN_AGE   7        # Dias de aviso antes de expirar
PASS_MIN_LEN    5        # Longitud minima (no siempre respetado)

# Mascara de permisos por defecto para nuevos archivos
UMASK           077

# Crear directorio home automaticamente
CREATE_HOME     yes

# Algoritmo de cifrado de contrasenas
ENCRYPT_METHOD  SHA512

# Crear grupo privado del usuario (User Private Group)
USERGROUPS_ENAB yes

# Directorio con archivos plantilla
SKEL            /etc/skel
```

### /etc/skel/
Directorio que contiene los archivos plantilla que se copian al home de cada nuevo usuario creado con `useradd -m`.

```bash
ls -la /etc/skel/
.bash_logout
.bashrc
.profile
```

---

## 3. Gestion de usuarios

### useradd - Crear usuarios
```bash
# Crear usuario con opciones comunes
useradd -m -d /home/sandra -s /bin/bash -c "Sandra Garcia" -g users -G sudo,developers sandra

# Opciones principales:
useradd [opciones] usuario
```

| Opcion | Descripcion | Ejemplo |
|--------|-------------|---------|
| `-m` | Crear directorio home (copia /etc/skel/) | `useradd -m sandra` |
| `-d /ruta` | Especificar directorio home | `-d /home/sandra` |
| `-s /shell` | Shell de login | `-s /bin/bash` |
| `-g grupo` | Grupo primario | `-g users` |
| `-G grupo1,grupo2` | Grupos secundarios | `-G sudo,docker` |
| `-u UID` | Especificar UID | `-u 1500` |
| `-c "comentario"` | Campo GECOS (nombre completo) | `-c "Sandra Garcia"` |
| `-e YYYY-MM-DD` | Fecha de expiracion de la cuenta | `-e 2026-12-31` |
| `-M` | NO crear directorio home | `useradd -M servicio` |
| `-r` | Crear usuario del sistema (UID < 1000) | `useradd -r daemon1` |

**IMPORTANTE:** `useradd` sin opciones no crea directorio home ni establece contrasena. Hay que usar `-m` para crear el home y luego `passwd usuario` para establecer la contrasena.

### usermod - Modificar usuarios
```bash
usermod [opciones] usuario
```

| Opcion | Descripcion | Ejemplo |
|--------|-------------|---------|
| `-l nuevo_nombre` | Cambiar nombre de login | `usermod -l nuevo_sandra sandra` |
| `-d /nueva/ruta` | Cambiar directorio home | `usermod -d /home/nuevo sandra` |
| `-d /nueva/ruta -m` | Cambiar home Y mover contenido | `usermod -d /home/nuevo -m sandra` |
| `-s /shell` | Cambiar shell | `usermod -s /bin/zsh sandra` |
| `-g grupo` | Cambiar grupo primario | `usermod -g developers sandra` |
| `-G grupo1,grupo2` | Establecer grupos secundarios (REEMPLAZA) | `usermod -G sudo sandra` |
| `-aG grupo` | AGREGAR a grupo secundario (sin perder los otros) | `usermod -aG docker sandra` |
| `-L` | Bloquear cuenta (agrega `!` al password en shadow) | `usermod -L sandra` |
| `-U` | Desbloquear cuenta | `usermod -U sandra` |
| `-e YYYY-MM-DD` | Establecer fecha de expiracion | `usermod -e 2026-12-31 sandra` |
| `-c "comentario"` | Cambiar campo GECOS | `usermod -c "Sandra G." sandra` |
| `-u UID` | Cambiar UID | `usermod -u 2000 sandra` |

**CRITICO para el examen:**
- `usermod -G grupo usuario` --> **REEMPLAZA** todos los grupos secundarios
- `usermod -aG grupo usuario` --> **AGREGA** al grupo sin perder los existentes
- Siempre usar `-aG` (con `a`) para agregar a un grupo adicional

### userdel - Eliminar usuarios
```bash
userdel sandra          # Elimina usuario pero CONSERVA su directorio home
userdel -r sandra       # Elimina usuario Y su directorio home y mail spool
```

| Opcion | Descripcion |
|--------|-------------|
| (sin opciones) | Elimina el usuario pero conserva /home/usuario |
| `-r` | Elimina usuario, directorio home y mail spool |

---

## 4. Gestion de grupos

### groupadd - Crear grupos
```bash
groupadd developers                # Crear grupo con GID automatico
groupadd -g 2000 proyecto          # Crear grupo con GID especifico
groupadd -r sistema                # Crear grupo del sistema (GID < 1000)
```

### groupmod - Modificar grupos
```bash
groupmod -n nuevo_nombre viejo_nombre    # Renombrar grupo
groupmod -g 3000 grupo                   # Cambiar GID
```

### groupdel - Eliminar grupos
```bash
groupdel developers    # Eliminar grupo
```

**NOTA:** No se puede eliminar un grupo que sea el grupo primario de algun usuario. Primero se debe cambiar el grupo primario de esos usuarios.

---

## 5. Gestion de contrasenas

### passwd - Cambiar contrasena y opciones
```bash
passwd                    # Cambiar contrasena propia
passwd sandra             # Cambiar contrasena de otro usuario (solo root)
```

| Opcion | Descripcion | Ejemplo |
|--------|-------------|---------|
| `-l` | Bloquear cuenta (lock) | `passwd -l sandra` |
| `-u` | Desbloquear cuenta (unlock) | `passwd -u sandra` |
| `-e` | Forzar cambio de contrasena en el proximo login | `passwd -e sandra` |
| `-d` | Eliminar contrasena (cuenta sin contrasena) | `passwd -d sandra` |
| `-S` | Mostrar estado de la contrasena | `passwd -S sandra` |
| `-n dias` | Dias minimos entre cambios | `passwd -n 7 sandra` |
| `-x dias` | Dias maximos de validez | `passwd -x 90 sandra` |
| `-w dias` | Dias de aviso | `passwd -w 14 sandra` |

**Salida de `passwd -S`:**
```
sandra P 05/26/2026 0 99999 7 -1
```
- `P` = tiene contrasena, `L` = bloqueada, `NP` = sin contrasena

### chage - Gestionar envejecimiento de contrasenas
`chage` (change age) gestiona las politicas de envejecimiento de contrasenas.

```bash
chage sandra              # Modo interactivo (pide cada campo)
```

| Opcion | Descripcion | Ejemplo |
|--------|-------------|---------|
| `-l` | Listar informacion de envejecimiento | `chage -l sandra` |
| `-E YYYY-MM-DD` | Fecha de expiracion de la cuenta | `chage -E 2026-12-31 sandra` |
| `-E -1` | Eliminar expiracion de cuenta | `chage -E -1 sandra` |
| `-M dias` | Dias maximos de validez de contrasena | `chage -M 90 sandra` |
| `-m dias` | Dias minimos entre cambios | `chage -m 7 sandra` |
| `-W dias` | Dias de aviso antes de expirar | `chage -W 14 sandra` |
| `-I dias` | Dias de inactividad tras expirar | `chage -I 30 sandra` |
| `-d YYYY-MM-DD` | Fecha del ultimo cambio de contrasena | `chage -d 0 sandra` |

**TRUCO:** `chage -d 0 sandra` fuerza al usuario a cambiar la contrasena en el proximo inicio de sesion (establece la fecha del ultimo cambio en epoch 0).

**Ejemplo de `chage -l sandra`:**
```
Ultimo cambio de contrasena                     : may 26, 2026
La contrasena caduca                            : ago 24, 2026
Contrasena inactiva                             : sep 23, 2026
La cuenta caduca                                : dic 31, 2026
Numero minimo de dias entre cambios             : 7
Numero maximo de dias entre cambios             : 90
Dias de aviso antes de caducidad                : 14
```

---

## 6. Comandos para modificar informacion del usuario

### chfn - Cambiar informacion GECOS (finger)

`chfn` (change finger) permite modificar el campo GECOS (campo 5) de `/etc/passwd`, que contiene informacion personal del usuario.

```bash
# Modo interactivo (pide cada campo)
chfn sandra

# Cambiar el nombre completo
chfn -f "Sandra Garcia Lopez" sandra

# Cambiar la oficina
chfn -o "Oficina 301" sandra

# Cambiar telefono de oficina
chfn -p "555-1234" sandra

# Cambiar telefono de casa
chfn -h "555-5678" sandra

# Un usuario normal puede cambiar su propia informacion
chfn
```

**Formato del campo GECOS** (subcampos separados por coma):
```
Nombre completo,Oficina,Telefono oficina,Telefono casa
Sandra Garcia Lopez,Oficina 301,555-1234,555-5678
```

### chsh - Cambiar shell de login

`chsh` (change shell) permite cambiar el shell de login del usuario (campo 7 de `/etc/passwd`).

```bash
# Cambiar el shell de un usuario (como root)
chsh -s /bin/zsh sandra

# Cambiar el shell propio (usuario normal)
chsh -s /bin/bash

# Ver los shells validos disponibles
chsh -l
cat /etc/shells
```

**`/etc/shells`** - Lista de shells validos que se pueden asignar a un usuario. `chsh` solo permite asignar shells listados en este archivo.

```
# Contenido tipico de /etc/shells
/bin/sh
/bin/bash
/bin/zsh
/usr/bin/zsh
/usr/bin/fish
```

---

## 7. Comandos de consulta

### id - Informacion de usuario y grupos
```bash
id                    # Informacion del usuario actual
id sandra             # Informacion de un usuario especifico
id -u sandra          # Solo el UID
id -g sandra          # Solo el GID primario
id -G sandra          # Todos los GIDs (primario + secundarios)
id -Gn sandra         # Todos los nombres de grupos
```

**Ejemplo:**
```bash
$ id sandra
uid=1000(sandra) gid=1000(sandra) groups=1000(sandra),27(sudo),999(docker)
```

### getent - Consultar bases de datos del sistema
`getent` consulta las bases de datos NSS (Name Service Switch), incluyendo archivos locales, LDAP, NIS, etc.

```bash
getent passwd sandra       # Buscar usuario en passwd
getent passwd              # Listar todos los usuarios
getent group developers    # Buscar grupo
getent group               # Listar todos los grupos
getent shadow sandra       # Buscar en shadow (requiere permisos)
```

**Ventaja sobre `cat /etc/passwd`:** `getent` consulta todas las fuentes configuradas en `/etc/nsswitch.conf`, incluyendo **LDAP**, **NIS/NIS+** y otras bases de datos remotas. Por ello es la forma recomendada de consultar usuarios y grupos en entornos empresariales.

### newgrp - Cambiar grupo primario temporalmente
```bash
newgrp developers     # Cambia el grupo primario actual a "developers"
```
- Inicia un nuevo shell con el grupo primario cambiado
- El usuario debe pertenecer al grupo o conocer la contrasena del grupo
- Al salir del shell (`exit`), se vuelve al grupo primario original

### gpasswd - Administrar grupos
```bash
gpasswd grupo                    # Establecer contrasena del grupo
gpasswd -a usuario grupo         # Agregar usuario al grupo
gpasswd -d usuario grupo         # Eliminar usuario del grupo
gpasswd -A usuario grupo         # Hacer a usuario administrador del grupo
gpasswd -r grupo                 # Eliminar contrasena del grupo
gpasswd -M user1,user2 grupo     # Establecer la lista de miembros
```

---

## 8. Flujo completo: crear un usuario

```bash
# 1. Crear usuario con home directory
useradd -m -s /bin/bash -c "Sandra Garcia" -G sudo,developers sandra

# 2. Establecer contrasena
passwd sandra

# 3. Configurar politicas de contrasena
chage -M 90 -m 7 -W 14 sandra

# 4. Verificar
id sandra
getent passwd sandra
chage -l sandra
```

---

## Resumen para el examen

1. **/etc/passwd** tiene 7 campos: `usuario:x:UID:GID:GECOS:home:shell`
2. **/etc/shadow** tiene 9 campos con contrasena cifrada y politicas de envejecimiento
3. **/etc/group** tiene 4 campos: `grupo:x:GID:miembros`
4. **`usermod -aG grupo usuario`** agrega a grupo; **`-G`** sin `-a` REEMPLAZA grupos
5. **`userdel -r`** elimina usuario Y su home; sin `-r` conserva el home
6. **`passwd -l`** bloquea cuenta; **`passwd -e`** fuerza cambio de contrasena
7. **`chage -l`** lista info de envejecimiento; **`chage -d 0`** fuerza cambio al proximo login
8. **`getent`** consulta bases de datos NSS (incluye LDAP, NIS via `/etc/nsswitch.conf`)
9. **`/etc/login.defs`** define UID_MIN/MAX, PASS_MAX_DAYS, PASS_MIN_DAYS, PASS_WARN_AGE, UMASK, CREATE_HOME, USERGROUPS_ENAB
10. **`chfn`** cambia la informacion GECOS (finger); **`chsh`** cambia el shell de login
11. **`newgrp`** cambia grupo primario temporalmente
12. UID 0 = root; 1-999 = sistema; 1000+ = usuarios regulares
