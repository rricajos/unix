---
title: "104.5 Gestionar permisos y propiedad de archivos - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.5"
---

# 104.5 Gestionar permisos y propiedad de archivos - Ejercicios

## Ejercicio 1
**Convierte los siguientes permisos entre notacion simbolica y octal:**
- a) `rwxr-x---` -> octal
- b) `rw-rw-r--` -> octal
- c) `755` -> simbolica
- d) `640` -> simbolica

<details>
<summary>Ver respuesta</summary>

| Simbolico | Calculo | Octal |
|-----------|---------|-------|
| a) `rwxr-x---` | (4+2+1)(4+0+1)(0+0+0) | **750** |
| b) `rw-rw-r--` | (4+2+0)(4+2+0)(4+0+0) | **664** |

| Octal | Calculo | Simbolico |
|-------|---------|-----------|
| c) `755` | 7=rwx, 5=r-x, 5=r-x | **rwxr-xr-x** |
| d) `640` | 6=rw-, 4=r--, 0=--- | **rw-r-----** |

</details>

---

## Ejercicio 2
**Si la umask es `027`, ¿que permisos tendran los archivos y directorios recien creados? Muestra el calculo.**

<details>
<summary>Ver respuesta</summary>

**Archivos nuevos:**
```
Base archivos:  666  (rw-rw-rw-)
umask:         -027
Resultado:      640  (rw-r-----)
```

**Directorios nuevos:**
```
Base directorios: 777  (rwxrwxrwx)
umask:           -027
Resultado:        750  (rwxr-x---)
```

Con umask `027`:
- Los archivos se crean con permisos `640`: el propietario puede leer y escribir, el grupo solo leer, otros sin acceso.
- Los directorios se crean con permisos `750`: el propietario tiene acceso total, el grupo puede leer y acceder, otros sin acceso.

</details>

---

## Ejercicio 3
**El archivo `/usr/bin/passwd` tiene los siguientes permisos: `-rwsr-xr-x 1 root root`. Explica:**
- a) ¿Que significa la `s` en la posicion del propietario?
- b) ¿Por que es necesario que este archivo tenga SUID?
- c) ¿Cual seria el valor octal completo de estos permisos?

<details>
<summary>Ver respuesta</summary>

**a)** La `s` en la posicion de ejecucion del propietario indica que tiene activado el bit **SUID (Set User ID)**. Cuando un usuario normal ejecuta este programa, se ejecuta con los permisos del propietario del archivo (en este caso, **root**).

**b)** Es necesario porque `passwd` necesita modificar el archivo `/etc/shadow` para cambiar contrasenas. `/etc/shadow` es propiedad de root y solo root puede escribir en el. Sin SUID, los usuarios normales no podrian cambiar sus propias contrasenas.

**c)** El valor octal completo es **`4755`**:
- `4` = SUID
- `7` = rwx (propietario, la `s` reemplaza a `x` pero el permiso de ejecucion sigue activo)
- `5` = r-x (grupo)
- `5` = r-x (otros)

</details>

---

## Ejercicio 4
**Necesitas configurar un directorio `/proyecto` para trabajo en equipo del grupo `developers`. Los requisitos son:**
- Todos los miembros del grupo pueden crear y editar archivos
- Los archivos nuevos deben pertenecer automaticamente al grupo `developers`
- Los usuarios no pueden borrar archivos de otros miembros

**¿Que comandos ejecutarias?**

<details>
<summary>Ver respuesta</summary>

```bash
# 1. Crear el directorio
mkdir /proyecto

# 2. Asignar propietario root y grupo developers
chown root:developers /proyecto

# 3. Establecer permisos: SGID (2) + Sticky (1) + rwxrwx--- (770)
#    SGID: archivos nuevos heredan grupo "developers"
#    Sticky: solo el propietario del archivo puede borrarlo
chmod 3770 /proyecto
```

Desglose de `3770`:
- `3` = SGID (2) + Sticky bit (1)
- `7` = rwx para propietario (root)
- `7` = rwx para grupo (developers)
- `0` = --- para otros

Verificacion:
```bash
ls -ld /proyecto
drwxrws--T 2 root developers ... /proyecto
```

Nota: La `T` mayuscula aparece porque otros no tienen permiso `x`. Si quisieras `t` minuscula, usarias `3771` o `3773`.

</details>

---

## Ejercicio 5
**¿Cual es la diferencia entre SGID aplicado a un archivo ejecutable y SGID aplicado a un directorio?**

<details>
<summary>Ver respuesta</summary>

| Aspecto | SGID en archivo ejecutable | SGID en directorio |
|---------|---------------------------|-------------------|
| **Efecto** | El proceso se ejecuta con los permisos del **grupo del archivo** | Los archivos y subdirectorios creados dentro **heredan el grupo del directorio** |
| **Proposito** | Permitir que un programa acceda a recursos del grupo | Facilitar trabajo en equipo manteniendo grupo consistente |
| **Ejemplo** | Un programa que necesita acceso a archivos de un grupo especifico | Directorio compartido `/proyecto` donde todo debe ser del grupo `devs` |
| **Indicador ls -l** | `s` o `S` en posicion `x` del grupo | `s` o `S` en posicion `x` del grupo |

**SGID en directorios** es mucho mas frecuente en el examen y en la practica real.

Sin SGID en un directorio, los archivos creados tendrian el grupo primario del usuario que los crea, lo que complica el trabajo colaborativo.

</details>

---

## Ejercicio 6
**Ejecuta mentalmente los siguientes comandos y determina los permisos resultantes:**

```bash
touch archivo.txt          # umask = 022
chmod 644 archivo.txt
chmod u+x archivo.txt
chmod g+w archivo.txt
chmod o= archivo.txt
```

**¿Cuales son los permisos finales en formato simbolico y octal?**

<details>
<summary>Ver respuesta</summary>

Paso a paso:
```
1. touch archivo.txt (umask 022) -> rw-r--r-- (644)
2. chmod 644                      -> rw-r--r-- (644)  [sin cambio]
3. chmod u+x                      -> rwxr--r-- (744)  [+x al propietario]
4. chmod g+w                      -> rwxrw-r-- (764)  [+w al grupo]
5. chmod o=                       -> rwxrw---- (760)  [quitar todo a otros]
```

**Permisos finales:** `rwxrw----` = **`760`**

</details>

---

## Ejercicio 7
**¿Que significan las `s`, `S`, `t` y `T` cuando aparecen en la salida de `ls -l`? Da un ejemplo de cada caso.**

<details>
<summary>Ver respuesta</summary>

| Caracter | Posicion | Significado | Ejemplo |
|----------|----------|-------------|---------|
| **`s`** (minuscula) | Posicion `x` del usuario | SUID activo **Y** permiso de ejecucion activo | `-rwsr-xr-x` (SUID + x) |
| **`S`** (mayuscula) | Posicion `x` del usuario | SUID activo **PERO** sin permiso de ejecucion | `-rwSr-xr-x` (SUID sin x) |
| **`s`** (minuscula) | Posicion `x` del grupo | SGID activo **Y** permiso de ejecucion activo | `-rwxr-sr-x` (SGID + x) |
| **`S`** (mayuscula) | Posicion `x` del grupo | SGID activo **PERO** sin permiso de ejecucion | `-rwxr-Sr-x` (SGID sin x) |
| **`t`** (minuscula) | Posicion `x` de otros | Sticky bit activo **Y** ejecucion activa | `drwxrwxrwt` (sticky + x) |
| **`T`** (mayuscula) | Posicion `x` de otros | Sticky bit activo **PERO** sin ejecucion | `drwxrwx--T` (sticky sin x) |

La mayuscula indica que el permiso especial esta activo pero **no tiene sentido real** porque falta el permiso de ejecucion subyacente.

</details>

---

## Ejercicio 8
**Un administrador ejecuta `umask 077`. Luego otro usuario del sistema crea un archivo y un directorio. ¿Afecta el umask del administrador al otro usuario? ¿Por que?**

<details>
<summary>Ver respuesta</summary>

**No, no afecta al otro usuario.**

La umask es un valor **por proceso/sesion**. Cada usuario tiene su propia umask en su sesion de shell. Cambiar la umask en una sesion solo afecta a los archivos creados en ESA sesion.

Para que el cambio de umask afecte a:
- **Un usuario especifico:** Configurar en su `~/.bashrc` o `~/.profile`
- **Todos los usuarios:** Configurar en `/etc/profile`, `/etc/bash.bashrc` o `/etc/login.defs` (variable `UMASK`)
- **Servicios PAM:** `/etc/pam.d/common-session` con `pam_umask.so`

Ademas, la umask se hereda de proceso padre a hijo, pero cada sesion de login tiene su propia umask definida por los archivos de perfil.

</details>
