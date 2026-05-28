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

### Pregunta 1

Dada la siguiente linea de `/etc/passwd`, que indica el valor `x` en el segundo campo?
```
carlos:x:1001:1001:Carlos Lopez,,,:/home/carlos:/bin/bash
```

a) Que la cuenta del usuario esta bloqueada
b) Que la contrasena real se almacena cifrada en `/etc/shadow`
c) Que el usuario no tiene contrasena asignada
d) Que el usuario debe cambiar su contrasena en el proximo inicio de sesion

<details><summary>Respuesta</summary>

**b) Que la contrasena real se almacena cifrada en `/etc/shadow`**

La `x` en el campo de password de `/etc/passwd` es el valor estandar que indica que la contrasena cifrada se encuentra en `/etc/shadow`, un archivo que solo es legible por root. Los 7 campos de `/etc/passwd` son: usuario (`carlos`), password (`x`), UID (`1001`), GID (`1001`), GECOS (`Carlos Lopez,,,`), directorio home (`/home/carlos`) y shell (`/bin/bash`). El UID 1001 indica un usuario regular (>= 1000).

</details>

---

### Pregunta 2

Cual es la diferencia critica entre `usermod -G sudo,docker sandra` y `usermod -aG docker sandra`?

a) `-G` agrega grupos y `-aG` los reemplaza
b) `-G` sin `-a` REEMPLAZA todos los grupos secundarios; `-aG` AGREGA el grupo sin perder los existentes
c) Ambos comandos agregan grupos secundarios de la misma forma
d) `-G` afecta al grupo primario y `-aG` afecta a los grupos secundarios

<details><summary>Respuesta</summary>

**b) `-G` sin `-a` REEMPLAZA todos los grupos secundarios; `-aG` AGREGA el grupo sin perder los existentes**

`usermod -G sudo,docker sandra` **reemplaza completamente** los grupos secundarios: si sandra pertenecia a `sudo, developers, audio`, despues solo pertenecera a `sudo, docker`. `usermod -aG docker sandra` **agrega** el grupo `docker` a los existentes: si pertenecia a `sudo, developers, audio`, despues tendra `sudo, developers, audio, docker`. Siempre usar `-aG` (con la `a` de append) cuando se quiera agregar un grupo sin perder los demas. Ninguna opcion afecta al grupo primario (para eso se usa `-g`).

</details>

---

### Pregunta 3

Un administrador ejecuta `chage -d 0 sandra`. Que efecto tiene este comando?

a) Elimina la contrasena del usuario sandra
b) Bloquea la cuenta del usuario sandra permanentemente
c) Fuerza al usuario sandra a cambiar su contrasena en el proximo inicio de sesion
d) Establece la fecha de expiracion de la cuenta al dia actual

<details><summary>Respuesta</summary>

**c) Fuerza al usuario sandra a cambiar su contrasena en el proximo inicio de sesion**

`chage -d 0 sandra` establece la fecha del ultimo cambio de contrasena al dia 0 (01/01/1970, epoch). Como la contrasena "caduco" hace decadas segun esta fecha, el sistema obliga al usuario a cambiarla en el proximo login. Es equivalente en efecto a `passwd -e sandra`. Para verificar la politica de envejecimiento se usa `chage -l sandra`. La opcion `-d` establece el campo "lastchg" de `/etc/shadow`.

</details>

---

### Pregunta 4

En el archivo `/etc/shadow`, que indica el prefijo `$6$` en el campo de la contrasena cifrada?

a) Que la contrasena fue cifrada con MD5
b) Que la contrasena fue cifrada con SHA-256
c) Que la contrasena fue cifrada con SHA-512
d) Que la contrasena tiene una longitud minima de 6 caracteres

<details><summary>Respuesta</summary>

**c) Que la contrasena fue cifrada con SHA-512**

El prefijo `$6$` indica que se uso el algoritmo **SHA-512** para cifrar la contrasena. Otros prefijos comunes: `$5$` = SHA-256, `$y$` = yescrypt (moderno), `$1$` = MD5 (obsoleto e inseguro). Despues del prefijo viene el **salt** (cadena aleatoria usada en el cifrado) y luego el hash resultante. El formato completo es `$id$salt$hash`. El algoritmo se configura en `/etc/login.defs` con el parametro `ENCRYPT_METHOD`.

</details>

---

### Pregunta 5

Cual es la diferencia entre `passwd -l sandra` y `chage -E 0 sandra` para bloquear una cuenta?

a) Ambos bloquean la cuenta de forma identica, impidiendo todo acceso
b) `passwd -l` agrega `!` al hash en shadow (bloquea solo autenticacion por contrasena); `chage -E 0` expira la cuenta completamente (bloquea todo acceso)
c) `passwd -l` elimina la contrasena; `chage -E 0` la cifra con un algoritmo mas seguro
d) `passwd -l` bloquea todo acceso; `chage -E 0` solo bloquea la autenticacion por contrasena

<details><summary>Respuesta</summary>

**b) `passwd -l` agrega `!` al hash en shadow (bloquea solo autenticacion por contrasena); `chage -E 0` expira la cuenta completamente (bloquea todo acceso)**

`passwd -l` (y `usermod -L`) agregan un `!` delante del hash en `/etc/shadow`, lo que impide la autenticacion con contrasena pero el usuario podria iniciar sesion con clave SSH u otros metodos. Se desbloquea con `passwd -u` o `usermod -U`. `chage -E 0` establece la fecha de expiracion de la cuenta al dia 0 (01/01/1970), bloqueando COMPLETAMENTE la cuenta sin importar el metodo de autenticacion. Se revierte con `chage -E -1` (elimina la expiracion).

</details>

---

### Pregunta 6

Que ventaja tiene `getent passwd sandra` sobre leer directamente `/etc/passwd` con `grep`?

a) `getent` es mas rapido porque usa cache del kernel
b) `getent` consulta todas las fuentes NSS (archivos locales, LDAP, NIS), no solo los archivos locales
c) `getent` muestra la contrasena cifrada, mientras que `grep` no puede acceder a ella
d) `getent` permite editar la informacion del usuario directamente

<details><summary>Respuesta</summary>

**b) `getent` consulta todas las fuentes NSS (archivos locales, LDAP, NIS), no solo los archivos locales**

`getent` consulta las bases de datos NSS (Name Service Switch) configuradas en `/etc/nsswitch.conf`, lo que incluye archivos locales (`/etc/passwd`), **LDAP**, **NIS/NIS+** y otras bases de datos remotas. En entornos empresariales donde los usuarios se gestionan centralmente con LDAP, `grep` sobre `/etc/passwd` no mostraria los usuarios remotos, pero `getent` si. Por eso `getent` es la forma recomendada de consultar informacion de usuarios y grupos.

</details>

---

### Pregunta 7

Que diferencia hay entre `userdel ana` y `userdel -r ana`?

a) `userdel` elimina usuario y home; `userdel -r` solo elimina el usuario
b) `userdel` elimina solo la entrada del usuario; `userdel -r` elimina tambien el directorio home y el mail spool
c) `userdel -r` hace una copia de seguridad antes de eliminar
d) No hay diferencia, ambos eliminan el usuario y todos sus archivos

<details><summary>Respuesta</summary>

**b) `userdel` elimina solo la entrada del usuario; `userdel -r` elimina tambien el directorio home y el mail spool**

`userdel ana` elimina la entrada del usuario de `/etc/passwd`, `/etc/shadow` y `/etc/group`, pero **NO elimina** el directorio home (`/home/ana`) ni el mail spool; los archivos quedan "huerfanos" (pertenecen a un UID que ya no existe). `userdel -r ana` elimina la entrada del usuario Y su directorio home y mail spool (`/var/mail/ana`). Archivos fuera del home (por ejemplo en `/tmp`) no se eliminan en ningun caso. Se recomienda buscar archivos huerfanos con `find / -nouser`.

</details>

---

### Pregunta 8

Que archivo define los valores por defecto como `UID_MIN`, `PASS_MAX_DAYS` y `ENCRYPT_METHOD` para la creacion de usuarios?

a) `/etc/passwd`
b) `/etc/shadow`
c) `/etc/login.defs`
d) `/etc/skel/.bashrc`

<details><summary>Respuesta</summary>

**c) `/etc/login.defs`**

`/etc/login.defs` define los valores por defecto para la creacion de usuarios y politicas de contrasenas. Parametros importantes: `UID_MIN`/`UID_MAX` (rango de UIDs para usuarios regulares, tipicamente 1000-60000), `PASS_MAX_DAYS` (dias maximos de validez de contrasena), `PASS_MIN_DAYS`, `PASS_WARN_AGE`, `UMASK` (mascara de permisos), `CREATE_HOME`, `ENCRYPT_METHOD` (algoritmo de cifrado, tipicamente SHA512) y `USERGROUPS_ENAB` (crear grupo privado por usuario).

</details>

---

### Pregunta 9

Que hace el comando `newgrp developers` y como se vuelve al grupo primario original?

a) Cambia permanentemente el grupo primario del usuario a `developers`
b) Cambia temporalmente el grupo primario abriendo un nuevo shell; se vuelve al original con `exit`
c) Agrega al usuario al grupo `developers` de forma permanente
d) Elimina al usuario de todos los grupos excepto `developers`

<details><summary>Respuesta</summary>

**b) Cambia temporalmente el grupo primario abriendo un nuevo shell; se vuelve al original con `exit`**

`newgrp developers` inicia un nuevo shell con el grupo primario cambiado a `developers`. Los archivos creados en ese shell tendran `developers` como grupo propietario. Al ejecutar `exit`, se vuelve al shell anterior con el grupo primario original. El usuario debe pertenecer al grupo o conocer su contrasena. Es util cuando se necesita crear archivos con un grupo diferente al grupo primario habitual, sin cambiar la configuracion permanente.

</details>

---

### Pregunta 10

Que comandos se utilizan para cambiar la informacion GECOS y el shell de login de un usuario, respectivamente?

a) `usermod -c` y `usermod -s`
b) `chfn` y `chsh`
c) `passwd -c` y `passwd -s`
d) `chage -c` y `chage -s`

<details><summary>Respuesta</summary>

**b) `chfn` y `chsh`**

**`chfn`** (change finger) permite modificar el campo GECOS (campo 5 de `/etc/passwd`), que contiene informacion personal como nombre completo, oficina y telefonos. Se puede usar interactivamente o con opciones: `chfn -f "Sandra Garcia" sandra`. **`chsh`** (change shell) permite cambiar el shell de login (campo 7 de `/etc/passwd`): `chsh -s /bin/zsh sandra`. Solo se pueden asignar shells listados en `/etc/shells`. `usermod -c` y `usermod -s` tambien funcionan, pero `chfn` y `chsh` son los comandos especificos del examen LPIC-1.

</details>
