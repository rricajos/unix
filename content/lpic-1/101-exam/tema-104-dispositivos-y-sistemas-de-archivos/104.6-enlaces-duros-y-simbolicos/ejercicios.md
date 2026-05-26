---
title: "104.6 Crear y cambiar enlaces duros y simbolicos - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.6"
---

# 104.6 Crear y cambiar enlaces duros y simbolicos - Ejercicios

## Ejercicio 1
**Creas un archivo y un enlace duro:**
```bash
echo "hola" > archivo.txt
ln archivo.txt enlace_duro.txt
```
**Luego borras `archivo.txt`. ¿Que sucede al ejecutar `cat enlace_duro.txt`? ¿Por que?**

<details>
<summary>Ver respuesta</summary>

`cat enlace_duro.txt` **muestra "hola" correctamente**.

Esto ocurre porque un enlace duro comparte el mismo inodo que el archivo original. Borrar `archivo.txt` solo elimina una de las entradas de directorio que apuntan a ese inodo. El conteo de enlaces pasa de 2 a 1, pero los datos en disco persisten porque aun hay una referencia (el enlace duro).

Los datos solo se liberan del disco cuando el conteo de enlaces llega a **0** y ningun proceso tiene el archivo abierto.

</details>

---

## Ejercicio 2
**¿Cual de los siguientes comandos fallaria y por que?**
- a) `ln /home/sandra/archivo.txt /home/sandra/enlace.txt`
- b) `ln -s /home/sandra/archivo.txt /mnt/usb/enlace.txt`
- c) `ln /home/sandra/archivo.txt /mnt/usb/enlace.txt`
- d) `ln -s /home/sandra/directorio/ /tmp/enlace_dir`
- e) `ln /home/sandra/directorio/ /tmp/enlace_dir`

*Asume que `/home` y `/mnt/usb` son sistemas de archivos diferentes.*

<details>
<summary>Ver respuesta</summary>

| Comando | Resultado | Explicacion |
|---------|-----------|-------------|
| a) `ln archivo enlace` (mismo FS) | **Funciona** | Enlace duro en el mismo sistema de archivos |
| b) `ln -s archivo enlace` (diferente FS) | **Funciona** | Los enlaces simbolicos pueden cruzar filesystems |
| c) `ln archivo enlace` (diferente FS) | **FALLA** | Los enlaces duros NO pueden cruzar filesystems |
| d) `ln -s directorio enlace` | **Funciona** | Los enlaces simbolicos SI pueden apuntar a directorios |
| e) `ln directorio enlace` | **FALLA** | Los enlaces duros NO pueden apuntar a directorios |

Los comandos **c** y **e** fallarian.

</details>

---

## Ejercicio 3
**Observa la siguiente salida de `ls -li`. ¿Cuales son enlaces duros entre si? ¿Cuales son enlaces simbolicos?**

```
1234567 -rw-r--r-- 3 sandra sandra 2048 Jan 10 file_a.txt
1234567 -rw-r--r-- 3 sandra sandra 2048 Jan 10 file_b.txt
1234567 -rw-r--r-- 3 sandra sandra 2048 Jan 10 file_c.txt
9876543 lrwxrwxrwx 1 sandra sandra   10 Jan 10 file_d.txt -> file_a.txt
5555555 -rw-r--r-- 1 sandra sandra 2048 Jan 10 file_e.txt
```

<details>
<summary>Ver respuesta</summary>

**Enlaces duros entre si:** `file_a.txt`, `file_b.txt` y `file_c.txt`
- Los tres tienen el **mismo inodo** (1234567)
- El conteo de enlaces es **3** (correcto, son 3 nombres para el mismo inodo)
- Son absolutamente equivalentes; no hay un "original"

**Enlace simbolico:** `file_d.txt`
- Tiene **inodo diferente** (9876543)
- El tipo es **`l`** (link)
- Muestra **`-> file_a.txt`** indicando el destino
- Su tamano es **10 bytes** (la longitud de "file_a.txt")

**Archivo independiente:** `file_e.txt`
- **Inodo diferente** (5555555)
- Conteo de enlaces **1** (sin enlaces duros adicionales)
- Es un archivo completamente separado

</details>

---

## Ejercicio 4
**Un directorio vacio `/home/sandra/proyecto` muestra un conteo de enlaces de 2 en `ls -ld`. ¿Por que? Si creas 3 subdirectorios dentro, ¿cual sera el nuevo conteo?**

<details>
<summary>Ver respuesta</summary>

**Conteo de enlaces = 2 para directorio vacio:**
1. La entrada del directorio padre que apunta a `proyecto/` (en `/home/sandra`)
2. La entrada `.` dentro del propio directorio `proyecto/` (que apunta a si mismo)

**Despues de crear 3 subdirectorios, el conteo sera 5:**
1. Entrada del padre (`proyecto/` en `/home/sandra`)
2. `.` dentro de `proyecto/`
3. `..` dentro del primer subdirectorio (apunta a `proyecto/`)
4. `..` dentro del segundo subdirectorio (apunta a `proyecto/`)
5. `..` dentro del tercer subdirectorio (apunta a `proyecto/`)

**Formula:** Conteo de enlaces de un directorio = 2 + numero de subdirectorios directos

> Nota: `.` y `..` son enlaces duros que el sistema crea y mantiene automaticamente.

</details>

---

## Ejercicio 5
**¿Como encontrarias todos los enlaces simbolicos rotos en `/etc`? ¿Y como encontrarias todos los archivos que tienen mas de un enlace duro en `/home`?**

<details>
<summary>Ver respuesta</summary>

```bash
# Buscar enlaces simbolicos rotos en /etc
find /etc -xtype l
# -xtype l: busca archivos que serian de tipo 'l' si NO se siguiera
# el enlace, pero cuyo destino no existe

# Alternativa:
find /etc -type l ! -exec test -e {} \; -print

# Buscar archivos con mas de 1 enlace duro en /home
find /home -type f -links +1
# -type f: solo archivos regulares
# -links +1: mas de 1 enlace duro
```

Para buscar todos los enlaces duros de un archivo especifico:
```bash
# Encontrar todos los nombres que comparten inodo con archivo.txt
find / -samefile /home/sandra/archivo.txt

# O por numero de inodo
ls -i archivo.txt  # Obtener el inodo (ej: 1234567)
find / -inum 1234567
```

</details>

---

## Ejercicio 6
**Creas un enlace simbolico con ruta relativa:**
```bash
cd /home/sandra
ln -s documentos/informe.txt /tmp/enlace_informe.txt
```
**Al acceder a `/tmp/enlace_informe.txt`, ¿funcionara? ¿Por que?**

<details>
<summary>Ver respuesta</summary>

**No funcionara.** El enlace esta roto.

La ruta relativa `documentos/informe.txt` se almacena literalmente en el enlace simbolico. Cuando se accede al enlace desde `/tmp/enlace_informe.txt`, el sistema busca la ruta **relativa a la ubicacion del enlace**, es decir, busca `/tmp/documentos/informe.txt`, que no existe.

**Solucion 1 - Usar ruta absoluta:**
```bash
ln -s /home/sandra/documentos/informe.txt /tmp/enlace_informe.txt
```

**Solucion 2 - Usar ruta relativa correcta:**
```bash
ln -s ../home/sandra/documentos/informe.txt /tmp/enlace_informe.txt
```

> **Regla:** Las rutas relativas en enlaces simbolicos son relativas a la **ubicacion del enlace**, no al directorio de trabajo actual cuando se crea.

</details>

---

## Ejercicio 7
**Explica con tus palabras la diferencia entre copiar un archivo y crear un enlace duro. ¿Que pasa si modificas el contenido en cada caso?**

<details>
<summary>Ver respuesta</summary>

**Copiar (`cp`):**
- Crea un **nuevo archivo** con **nuevo inodo** y **copia independiente** de los datos
- Duplica el espacio en disco
- Las modificaciones en la copia NO afectan al original y viceversa

```bash
cp archivo.txt copia.txt
# archivo.txt: inodo 111, datos "hola"
# copia.txt:   inodo 222, datos "hola" (copia independiente)

echo "mundo" >> copia.txt
# archivo.txt: "hola"      (sin cambios)
# copia.txt:   "hola mundo" (modificado independientemente)
```

**Enlace duro (`ln`):**
- Crea una **nueva entrada de directorio** que apunta al **mismo inodo** y los **mismos datos**
- NO duplica espacio en disco (solo una entrada de directorio adicional)
- Las modificaciones a traves de cualquiera de los nombres afectan a AMBOS (son el mismo archivo)

```bash
ln archivo.txt enlace.txt
# archivo.txt: inodo 111, datos "hola"
# enlace.txt:  inodo 111, datos "hola" (MISMOS datos)

echo "mundo" >> enlace.txt
# archivo.txt: "hola mundo" (TAMBIEN modificado, mismo inodo)
# enlace.txt:  "hola mundo"
```

</details>

---

## Ejercicio 8
**¿Que muestra el comando `readlink -f` y en que se diferencia de `readlink` sin opciones? Da un ejemplo con una cadena de enlaces.**

<details>
<summary>Ver respuesta</summary>

```bash
# Crear cadena de enlaces
echo "datos" > original.txt
ln -s original.txt enlace1.txt
ln -s enlace1.txt enlace2.txt
ln -s enlace2.txt enlace3.txt
```

**`readlink` (sin opciones):** Muestra solo el destino inmediato del enlace (un nivel).
```bash
readlink enlace3.txt
# enlace2.txt

readlink enlace2.txt
# enlace1.txt

readlink enlace1.txt
# original.txt
```

**`readlink -f`:** Resuelve TODA la cadena de enlaces y devuelve la ruta absoluta canonicalizada del archivo final.
```bash
readlink -f enlace3.txt
# /home/sandra/original.txt
```

Resuelve: enlace3 -> enlace2 -> enlace1 -> original.txt y devuelve la ruta absoluta.

Variantes:
- `readlink -f`: Resuelve todo, el ultimo componente puede no existir
- `readlink -e`: Todos los componentes deben existir (error si no)
- `readlink -m`: No requiere que ningun componente exista

</details>
