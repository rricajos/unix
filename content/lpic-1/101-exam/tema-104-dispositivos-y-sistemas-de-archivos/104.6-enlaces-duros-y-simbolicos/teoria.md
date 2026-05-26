---
title: "104.6 Crear y cambiar enlaces duros y simbolicos - Teoria"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.6"
---

# 104.6 Crear y cambiar enlaces duros y simbolicos - Teoria

## 1. Conceptos fundamentales: Inodos

Para entender los enlaces, primero hay que entender los **inodos**.

### 1.1 ¿Que es un inodo?

Un **inodo** es una estructura de datos en el sistema de archivos que almacena toda la informacion sobre un archivo EXCEPTO su nombre:

- Tipo de archivo
- Permisos
- Propietario (UID) y grupo (GID)
- Tamano
- Timestamps (atime, mtime, ctime)
- Punteros a los bloques de datos en disco
- **Conteo de enlaces duros** (numero de nombres que apuntan a este inodo)

**El nombre del archivo NO esta en el inodo.** El nombre se almacena en la **entrada de directorio** que asocia un nombre con un numero de inodo.

```bash
# Ver el numero de inodo de un archivo
ls -i archivo.txt
# 1234567 archivo.txt

# Ver informacion completa del inodo
stat archivo.txt
```

### 1.2 Relacion nombre-inodo

Un directorio es esencialmente una tabla que asocia nombres con numeros de inodo:

```
Directorio /home/sandra:
  "documento.txt"  -> inodo 1234567
  "foto.jpg"       -> inodo 1234568
  "script.sh"      -> inodo 1234569
```

---

## 2. Enlaces duros (hard links)

### 2.1 ¿Que es un enlace duro?

Un **enlace duro** es simplemente **otra entrada de directorio que apunta al mismo inodo**. Es otro nombre para el mismo archivo.

```
Entrada directorio A: "archivo.txt"     -> inodo 1234567
Entrada directorio B: "enlace_duro.txt" -> inodo 1234567
                                              |
                                              v
                                         [bloques de datos en disco]
```

Ambos nombres son **absolutamente equivalentes**. No hay un "original" y una "copia"; ambos son el mismo archivo con el mismo inodo.

### 2.2 Crear enlaces duros

```bash
# Sintaxis: ln archivo_existente nuevo_nombre
ln archivo.txt enlace_duro.txt

# Verificar que comparten el mismo inodo
ls -li archivo.txt enlace_duro.txt
# 1234567 -rw-r--r-- 2 sandra sandra 1024 ... archivo.txt
# 1234567 -rw-r--r-- 2 sandra sandra 1024 ... enlace_duro.txt
#  ^inodo             ^conteo de enlaces (ahora es 2)
```

### 2.3 Caracteristicas de los enlaces duros

| Caracteristica | Detalle |
|---------------|---------|
| **Mismo inodo** | El enlace duro y el original comparten el mismo numero de inodo |
| **Mismo contenido** | Modificar uno modifica el otro (son el MISMO archivo) |
| **Conteo de enlaces** | El campo de enlaces en el inodo se incrementa |
| **No cruzan filesystems** | Ambos deben estar en el mismo sistema de archivos |
| **No para directorios** | No se pueden crear enlaces duros a directorios (excepto `.` y `..` que el sistema crea automaticamente) |
| **Borrado seguro** | Borrar un enlace duro solo elimina una referencia. Los datos se eliminan cuando el conteo llega a 0 |
| **Sin indicador especial en ls -l** | No se distinguen visualmente de archivos normales |
| **Permisos compartidos** | Cambiar permisos en uno los cambia en ambos (mismo inodo) |

### 2.4 Comportamiento al borrar

```bash
# Crear archivo y enlace duro
echo "datos" > original.txt
ln original.txt enlace.txt

ls -li original.txt enlace.txt
# 1234567 -rw-r--r-- 2 sandra sandra 6 ... original.txt
# 1234567 -rw-r--r-- 2 sandra sandra 6 ... enlace.txt

# Borrar el "original"
rm original.txt

# El enlace duro sigue funcionando (los datos persisten)
cat enlace.txt
# datos

ls -li enlace.txt
# 1234567 -rw-r--r-- 1 sandra sandra 6 ... enlace.txt
#                     ^conteo ahora es 1
```

> **Clave para el examen:** Los datos se eliminan del disco solo cuando el conteo de enlaces duros llega a **0** (y no hay procesos con el archivo abierto).

---

## 3. Enlaces simbolicos (soft links / symlinks)

### 3.1 ¿Que es un enlace simbolico?

Un **enlace simbolico** es un **archivo especial** que contiene la **ruta** (path) a otro archivo o directorio. Es similar a un "acceso directo".

```
"enlace_simb.txt" (inodo 9999999) -> contiene la ruta "archivo.txt"
                                          |
"archivo.txt" (inodo 1234567)             |
      |                                    |
      v                                    |
  [bloques de datos en disco]    <---------+
```

### 3.2 Crear enlaces simbolicos

```bash
# Sintaxis: ln -s objetivo nombre_del_enlace
ln -s archivo.txt enlace_simbolico.txt

# Para directorios
ln -s /var/log /home/sandra/logs

# Verificar
ls -l enlace_simbolico.txt
# lrwxrwxrwx 1 sandra sandra 11 ... enlace_simbolico.txt -> archivo.txt
# ^tipo 'l'                         ^muestra el destino
```

### 3.3 Caracteristicas de los enlaces simbolicos

| Caracteristica | Detalle |
|---------------|---------|
| **Inodo diferente** | El enlace tiene su propio inodo, distinto del archivo original |
| **Archivo especial** | Es un archivo de tipo `l` (link) que contiene una ruta |
| **Cruzan filesystems** | Pueden apuntar a archivos en diferentes sistemas de archivos |
| **Para directorios** | Si se pueden crear enlaces simbolicos a directorios |
| **Se pueden romper** | Si se elimina el archivo original, el enlace queda "roto" (dangling) |
| **Indicador en ls -l** | Muestra `l` al inicio y `-> destino` al final |
| **Permisos propios** | Los permisos del enlace simbolico (`lrwxrwxrwx`) son irrelevantes; se usan los permisos del archivo destino |
| **Tamano** | El tamano del enlace es la longitud de la ruta que almacena |

### 3.4 Enlaces simbolicos rotos

```bash
# Crear archivo y enlace
echo "datos" > original.txt
ln -s original.txt enlace.txt

# Borrar el original
rm original.txt

# El enlace existe pero esta roto
ls -l enlace.txt
# lrwxrwxrwx 1 sandra sandra 12 ... enlace.txt -> original.txt

cat enlace.txt
# cat: enlace.txt: No such file or directory
```

> **Diferencia clave:** Al borrar el original, un enlace duro sigue funcionando (los datos persisten). Un enlace simbolico se rompe.

### 3.5 Rutas relativas vs absolutas en enlaces simbolicos

```bash
# Enlace con ruta absoluta (siempre funciona independientemente de donde se mueva)
ln -s /home/sandra/documento.txt /tmp/enlace.txt

# Enlace con ruta relativa (relativa a la ubicacion del enlace)
ln -s ../sandra/documento.txt /tmp/enlace.txt
```

> **Recomendacion:** Usar rutas absolutas para evitar problemas si el enlace se mueve.

---

## 4. Tabla comparativa: enlaces duros vs simbolicos

| Caracteristica | Enlace duro | Enlace simbolico |
|---------------|-------------|-----------------|
| **Comando** | `ln` | `ln -s` |
| **Inodo** | Mismo que el original | Diferente (propio) |
| **Cruza filesystems** | No | Si |
| **Enlazar directorios** | No | Si |
| **Si se borra el original** | Datos persisten | Enlace roto (dangling) |
| **Tipo en ls -l** | `-` (archivo normal) | `l` (link) |
| **Tamaño en disco** | Solo una entrada de directorio | Archivo que contiene la ruta |
| **Conteo de enlaces** | Se incrementa | No afecta al original |
| **Indicador visual** | Ninguno especial | `-> destino` en ls -l |
| **Puede ser a archivo inexistente** | No | Si (enlace roto) |
| **Permisos** | Compartidos (mismo inodo) | Propios (irrelevantes, se usan los del destino) |

---

## 5. Comandos utiles

### 5.1 readlink

```bash
# Ver destino de un enlace simbolico
readlink enlace.txt
# archivo.txt

# Ver destino resolviendo toda la cadena de enlaces (-f: canonicalize)
readlink -f enlace.txt
# /home/sandra/archivo.txt

# Resolver ruta completa aunque haya multiples enlaces
readlink -e enlace.txt   # Error si el destino final no existe
readlink -m enlace.txt   # No error si no existe
```

### 5.2 stat

```bash
# Informacion del enlace (no del destino)
stat enlace.txt

# Informacion del archivo destino (siguiendo el enlace)
stat -L enlace.txt
```

### 5.3 find (buscar enlaces)

```bash
# Buscar todos los enlaces simbolicos en un directorio
find /etc -type l

# Buscar enlaces simbolicos rotos
find /etc -xtype l

# Buscar archivos con mas de 1 enlace duro
find / -type f -links +1
```

---

## 6. Casos de uso practicos

### 6.1 Enlaces simbolicos en administracion

- `/etc/alternatives/` - Sistema de alternativas (ej: `java` -> version especifica)
- `/usr/bin/python` -> `/usr/bin/python3.10`
- `/etc/localtime` -> `/usr/share/zoneinfo/Europe/Madrid`
- `/lib` -> `/usr/lib` (en distribuciones con UsrMerge)

### 6.2 Enlaces duros en administracion

- Backups eficientes (hard link backups con rsync `--link-dest`)
- Los directorios `.` (apunta a si mismo) y `..` (apunta al padre) son enlaces duros mantenidos por el sistema

---

## 7. Puntos clave para el examen

1. **`ln`** crea enlaces duros. **`ln -s`** crea enlaces simbolicos.

2. Los enlaces duros **comparten inodo**. Los simbolicos tienen **inodo propio**.

3. Los enlaces duros **NO cruzan filesystems**. Los simbolicos **si**.

4. Los enlaces duros **NO pueden apuntar a directorios**. Los simbolicos **si**.

5. **Borrar el original:** el enlace duro sigue funcionando; el simbolico se rompe.

6. `ls -l` muestra `l` al inicio para enlaces simbolicos y `-> destino`.

7. `ls -i` muestra el numero de inodo. Dos enlaces duros al mismo archivo muestran el mismo inodo.

8. **`readlink`** muestra el destino de un enlace simbolico. **`readlink -f`** resuelve la ruta completa.

9. El conteo de enlaces en `ls -l` (segundo campo) indica cuantos enlaces duros apuntan al inodo.

10. Un directorio vacio tiene conteo de enlaces **2** (su propia entrada y `.` dentro de el). Cada subdirectorio anade 1 mas (por el `..` del subdirectorio).
