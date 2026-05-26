---
title: "107.1 - Ejercicios: Gestionar cuentas de usuario y grupo"
tags:
  - lpic-1
  - examen-102
  - tema-107
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "107"
subtema: "107.1"
---

# 107.1 - Ejercicios: Gestionar cuentas de usuario y grupo

## Ejercicio 1
Dada la siguiente linea de `/etc/passwd`, identifica cada campo y explica que informacion proporciona:
```
carlos:x:1001:1001:Carlos Lopez,,,:/home/carlos:/bin/bash
```

<details>
<summary>Respuesta</summary>

Los 7 campos separados por `:` son:

| Campo | Valor | Significado |
|-------|-------|-------------|
| 1. usuario | `carlos` | Nombre de login |
| 2. password | `x` | La contrasena esta en /etc/shadow |
| 3. UID | `1001` | User ID numerico |
| 4. GID | `1001` | Group ID del grupo primario |
| 5. GECOS | `Carlos Lopez,,,` | Informacion del usuario (nombre completo y campos adicionales vacios) |
| 6. home | `/home/carlos` | Directorio home del usuario |
| 7. shell | `/bin/bash` | Shell que se ejecuta al iniciar sesion |

El UID 1001 indica que es un usuario regular (>= 1000). La `x` en el campo password es estandar y significa que la contrasena real (cifrada) se almacena en `/etc/shadow`.
</details>

---

## Ejercicio 2
Cual es la diferencia critica entre `usermod -G sudo,docker sandra` y `usermod -aG docker sandra`? Que ocurre con los grupos existentes en cada caso?

<details>
<summary>Respuesta</summary>

**`usermod -G sudo,docker sandra`** (sin `-a`):
- **REEMPLAZA** completamente los grupos secundarios del usuario
- Si sandra pertenecia a los grupos `sudo, developers, audio`, despues de este comando solo pertenecera a `sudo, docker`
- Los grupos `developers` y `audio` se pierden

**`usermod -aG docker sandra`** (con `-a`):
- **AGREGA** el grupo `docker` a los grupos secundarios existentes
- Si sandra pertenecia a `sudo, developers, audio`, despues del comando pertenecera a `sudo, developers, audio, docker`
- Ningun grupo existente se pierde

**Regla:** Siempre usar `-aG` (con la `a` de append) cuando se quiera agregar un grupo sin perder los existentes. Usar `-G` solo cuando se quiera redefinir la lista completa de grupos secundarios.

**NOTA:** Ninguna de estas opciones afecta al grupo primario (el definido en /etc/passwd). Para cambiar el grupo primario se usa `-g`.
</details>

---

## Ejercicio 3
Escribe los comandos necesarios para crear un usuario llamado `webadmin` con las siguientes caracteristicas: home en `/home/webadmin`, shell `/bin/bash`, grupo primario `www-data`, grupos adicionales `sudo` y `developers`, contrasena que expire en 90 dias con aviso 14 dias antes, cuenta que expire el 31 de diciembre de 2026.

<details>
<summary>Respuesta</summary>

```bash
# 1. Crear el usuario
useradd -m -d /home/webadmin -s /bin/bash -g www-data -G sudo,developers -c "Web Admin" -e 2026-12-31 webadmin

# 2. Establecer contrasena
passwd webadmin

# 3. Configurar politicas de envejecimiento de contrasena
chage -M 90 -W 14 webadmin

# 4. Verificar la configuracion
id webadmin
# uid=1002(webadmin) gid=33(www-data) groups=33(www-data),27(sudo),1001(developers)

getent passwd webadmin
# webadmin:x:1002:33:Web Admin:/home/webadmin:/bin/bash

chage -l webadmin
# Numero maximo de dias entre cambios: 90
# Dias de aviso antes de caducidad: 14
# La cuenta caduca: dic 31, 2026
```

Opciones usadas:
- `-m`: Crear directorio home
- `-d /home/webadmin`: Ruta del home
- `-s /bin/bash`: Shell
- `-g www-data`: Grupo primario
- `-G sudo,developers`: Grupos secundarios
- `-c "Web Admin"`: Comentario GECOS
- `-e 2026-12-31`: Expiracion de cuenta
- `chage -M 90`: Contrasena expira cada 90 dias
- `chage -W 14`: Aviso 14 dias antes
</details>

---

## Ejercicio 4
Explica los 9 campos de `/etc/shadow` usando esta linea de ejemplo:
```
sandra:$6$abc123$xyz789:19503:7:90:14:30:19900:
```

<details>
<summary>Respuesta</summary>

| Campo | Valor | Significado |
|-------|-------|-------------|
| 1. usuario | `sandra` | Nombre de login |
| 2. hash | `$6$abc123$xyz789` | Contrasena cifrada. `$6$` indica SHA-512, `abc123` es el salt |
| 3. lastchg | `19503` | Ultimo cambio de contrasena: 19503 dias desde 01/01/1970 |
| 4. min | `7` | Minimo 7 dias entre cambios de contrasena |
| 5. max | `90` | La contrasena expira cada 90 dias |
| 6. warn | `14` | Se avisa 14 dias antes de que expire |
| 7. inactive | `30` | 30 dias de gracia tras expirar la contrasena (cuenta inactiva) |
| 8. expire | `19900` | La cuenta expira el dia 19900 desde epoch |
| 9. reserved | (vacio) | Campo reservado para uso futuro |

**Calcular fechas:**
- Ultimo cambio (19503): `date -d "1970-01-01 + 19503 days"` = ~mayo 2023
- Expiracion cuenta (19900): `date -d "1970-01-01 + 19900 days"` = ~junio 2024

El flujo de vida de la contrasena es: tras el ultimo cambio, la contrasena es valida durante 90 dias (max). 14 dias antes de expirar se avisa (warn). Tras expirar, hay 30 dias de gracia (inactive). Si no se cambia, la cuenta se bloquea.
</details>

---

## Ejercicio 5
Que diferencia hay entre `passwd -l sandra`, `usermod -L sandra` y `chage -E 0 sandra`? Todas "bloquean" la cuenta, pero de formas diferentes. Explica cada una.

<details>
<summary>Respuesta</summary>

**`passwd -l sandra` y `usermod -L sandra`:**
- Ambos hacen lo mismo: agregan un `!` delante del hash de la contrasena en `/etc/shadow`
- Esto impide la autenticacion con contrasena
- PERO el usuario podria iniciar sesion con clave SSH u otros metodos que no usen contrasena
- Se desbloquean con `passwd -u sandra` o `usermod -U sandra`

**`chage -E 0 sandra`:**
- Establece la fecha de expiracion de la **cuenta** al dia 0 (01/01/1970), es decir, la cuenta ya ha expirado
- Bloquea COMPLETAMENTE la cuenta: no se puede iniciar sesion con ningun metodo
- Se revierte con `chage -E -1 sandra` (elimina la expiracion) o `chage -E YYYY-MM-DD sandra` (nueva fecha futura)

**Diferencia critica:**
- `passwd -l` / `usermod -L`: Solo bloquean la autenticacion por contrasena
- `chage -E 0`: Bloquea la cuenta completamente, independientemente del metodo de autenticacion

Para un bloqueo mas seguro y completo, `chage -E 0` es la opcion mas restrictiva.
</details>

---

## Ejercicio 6
Que hacen los comandos `getent`, `id` y `newgrp`? Proporciona un ejemplo practico de cada uno y explica cuando usarias cada herramienta.

<details>
<summary>Respuesta</summary>

**`getent` - Consultar bases de datos del sistema (NSS):**
```bash
getent passwd sandra
# sandra:x:1000:1000:Sandra Garcia:/home/sandra:/bin/bash

getent group sudo
# sudo:x:27:sandra,carlos
```
Se usa para consultar informacion de usuarios y grupos de CUALQUIER fuente (archivos locales, LDAP, NIS). Es mas completo que leer directamente `/etc/passwd` porque incluye fuentes remotas.

**`id` - Informacion rapida de UID/GID/grupos:**
```bash
id sandra
# uid=1000(sandra) gid=1000(sandra) groups=1000(sandra),27(sudo),999(docker)

id -Gn sandra
# sandra sudo docker
```
Se usa para ver rapidamente el UID, GID y todos los grupos de un usuario. Util para verificar si un usuario pertenece a un grupo.

**`newgrp` - Cambiar grupo primario temporalmente:**
```bash
newgrp developers
# Abre un nuevo shell con grupo primario "developers"
# Los archivos creados tendran grupo "developers"
touch archivo.txt    # El grupo sera "developers"
exit                 # Volver al grupo primario original
```
Se usa cuando se necesita crear archivos con un grupo diferente al grupo primario. Inicia un nuevo shell; al hacer `exit` se vuelve al shell anterior con el grupo original.
</details>

---

## Ejercicio 7
Un usuario llamado `ana` necesita ser eliminado del sistema. Describe las diferencias entre `userdel ana` y `userdel -r ana`. Que pasos previos recomendarias antes de eliminar un usuario?

<details>
<summary>Respuesta</summary>

**`userdel ana`** (sin opciones):
- Elimina la entrada del usuario de `/etc/passwd`, `/etc/shadow`, `/etc/group`
- **NO elimina** el directorio home (`/home/ana`) ni el mail spool
- Los archivos del usuario quedan "huerfanos" (pertenecen a un UID que ya no existe)

**`userdel -r ana`** (con `-r`):
- Elimina la entrada del usuario de todos los archivos
- **SI elimina** el directorio home y el mail spool (`/var/mail/ana`)
- Archivos fuera del home (por ejemplo en `/tmp`) no se eliminan

**Pasos previos recomendados:**
1. Verificar si el usuario tiene procesos activos: `ps -u ana`
2. Terminar los procesos del usuario: `killall -u ana`
3. Hacer backup del home si es necesario: `tar czf ana_backup.tar.gz /home/ana`
4. Buscar archivos del usuario fuera del home: `find / -user ana`
5. Bloquear la cuenta primero si no se va a eliminar inmediatamente: `usermod -L ana`
6. Eliminar el usuario: `userdel -r ana`
7. Buscar archivos huerfanos: `find / -nouser`
</details>

---

## Ejercicio 8
Describe el papel del archivo `/etc/login.defs` y del directorio `/etc/skel/`. Que parametros importantes se configuran en `login.defs`? Que relacion tiene `/etc/skel/` con el comando `useradd -m`?

<details>
<summary>Respuesta</summary>

**`/etc/login.defs`:**
Define los valores por defecto para la creacion de usuarios y politicas de contrasenas. Parametros importantes:

| Parametro | Descripcion | Valor tipico |
|-----------|-------------|--------------|
| `UID_MIN` | UID minimo para usuarios regulares | 1000 |
| `UID_MAX` | UID maximo para usuarios regulares | 60000 |
| `GID_MIN` / `GID_MAX` | Rango de GIDs | 1000-60000 |
| `PASS_MAX_DAYS` | Dias maximos de validez de contrasena | 99999 |
| `PASS_MIN_DAYS` | Dias minimos entre cambios | 0 |
| `PASS_WARN_AGE` | Dias de aviso antes de expirar | 7 |
| `CREATE_HOME` | Crear home automaticamente | yes/no |
| `ENCRYPT_METHOD` | Algoritmo de cifrado | SHA512 |
| `USERGROUPS_ENAB` | Crear grupo privado por usuario | yes |

**`/etc/skel/`:**
Es el directorio "esqueleto" que contiene archivos plantilla. Cuando se ejecuta `useradd -m usuario`, los archivos de `/etc/skel/` se copian al nuevo directorio `/home/usuario/`.

Contenido tipico:
- `.bashrc` - Configuracion del shell
- `.profile` - Variables de entorno
- `.bash_logout` - Acciones al cerrar sesion

**Relacion:** `useradd -m` crea el directorio home y copia el contenido de `/etc/skel/` al nuevo home. Sin la opcion `-m`, no se crea directorio home y `/etc/skel/` no se utiliza.

Para personalizar el entorno de nuevos usuarios, se modifican los archivos en `/etc/skel/`.
</details>
