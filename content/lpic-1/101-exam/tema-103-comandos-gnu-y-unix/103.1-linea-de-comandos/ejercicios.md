---
title: "103.1 - Trabajar en la linea de comandos: Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.1"
---

# 103.1 - Trabajar en la linea de comandos: Ejercicios

## Pregunta 1
Un administrador necesita saber si el comando `echo` es un comando interno del shell o un programa externo. Cual de los siguientes comandos muestra esta informacion de forma mas completa?

A) `which echo`
B) `whereis echo`
C) `type -a echo`
D) `find / -name echo`

<details>
<summary>Respuesta</summary>

**C) `type -a echo`**

`type -a` muestra **todas** las formas en que un comando puede ser encontrado: como builtin, alias, funcion o archivo externo. En el caso de `echo`, mostraria que es tanto un builtin como un archivo en `/usr/bin/echo`. `which` solo busca ejecutables en PATH y no reconoce builtins. `whereis` busca binarios, manuales y fuentes pero tampoco identifica builtins. `find` busca archivos en el sistema de archivos pero no conoce los builtins del shell.
</details>

---

## Pregunta 2
Cual es la diferencia entre ejecutar `env` y `set` sin argumentos?

A) `env` muestra las variables locales y `set` las de entorno
B) `env` muestra las variables de entorno y `set` muestra todas las variables (locales, de entorno y funciones)
C) Son equivalentes, ambos muestran las mismas variables
D) `set` solo muestra las opciones del shell activas

<details>
<summary>Respuesta</summary>

**B) `env` muestra las variables de entorno y `set` muestra todas las variables (locales, de entorno y funciones)**

`env` sin argumentos lista unicamente las variables de entorno (las que han sido exportadas y estan disponibles para procesos hijos). `set` sin argumentos muestra todas las variables del shell, incluyendo las variables locales, las variables de entorno y las funciones definidas. Esta es una distincion importante para el examen LPIC-1.
</details>

---

## Pregunta 3
Un usuario ejecuta los siguientes comandos:
```bash
ANIMAL=gato
export FRUTA=manzana
bash
echo $ANIMAL
echo $FRUTA
```
Que se mostrara en las dos ultimas lineas?

A) `gato` y `manzana`
B) Una linea vacia y `manzana`
C) `gato` y una linea vacia
D) Dos lineas vacias

<details>
<summary>Respuesta</summary>

**B) Una linea vacia y `manzana`**

`ANIMAL=gato` crea una variable local que solo existe en el shell actual. `export FRUTA=manzana` crea una variable de entorno que se hereda a los procesos hijos. Al ejecutar `bash`, se abre un nuevo shell hijo. En este shell hijo, `ANIMAL` no existe (era local del padre), por lo que `echo $ANIMAL` muestra una linea vacia. `FRUTA` si fue exportada, por lo que `echo $FRUTA` muestra `manzana`.
</details>

---

## Pregunta 4
Que comando buscaria en las descripciones de las paginas de manual todas las entradas relacionadas con "password"?

A) `man password`
B) `man -f password`
C) `man -k password`
D) `info password`

<details>
<summary>Respuesta</summary>

**C) `man -k password`**

`man -k` (equivalente a `apropos`) busca la palabra clave en las descripciones cortas de todas las paginas de manual del sistema y muestra las coincidencias. `man -f` (equivalente a `whatis`) solo muestra la descripcion de un comando exacto, no busca en las descripciones. `man password` intentaria abrir una pagina de manual llamada "password" (que podria no existir). `info password` abriria la pagina info de "password" si existiese.
</details>

---

## Pregunta 5
Dado el siguiente comando:
```bash
echo "El directorio home es $HOME y el usuario es $(whoami)"
```
Que ocurre con las variables y la sustitucion de comando?

A) No se expande nada, se muestra el texto literal
B) Se expande `$HOME` pero no `$(whoami)` porque las comillas dobles no permiten sustitucion de comandos
C) Se expande tanto `$HOME` como `$(whoami)` con sus valores reales
D) Se produce un error de sintaxis

<details>
<summary>Respuesta</summary>

**C) Se expande tanto `$HOME` como `$(whoami)` con sus valores reales**

Las comillas dobles permiten la expansion de variables (`$VARIABLE`) y la sustitucion de comandos (`$(comando)` o `` `comando` ``). Solo las comillas simples evitan toda expansion. Por lo tanto, `$HOME` se reemplaza por el directorio home del usuario y `$(whoami)` se reemplaza por el nombre de usuario. La salida seria algo como: `El directorio home es /home/sandra y el usuario es sandra`.
</details>

---

## Pregunta 6
Un usuario quiere crear los directorios `proyecto/src`, `proyecto/bin` y `proyecto/doc` con un solo comando. Cual de las siguientes opciones es correcta?

A) `mkdir proyecto/src proyecto/bin proyecto/doc`
B) `mkdir -p proyecto/{src,bin,doc}`
C) `mkdir proyecto/[src,bin,doc]`
D) `mkdir -r proyecto/src,bin,doc`

<details>
<summary>Respuesta</summary>

**B) `mkdir -p proyecto/{src,bin,doc}`**

La expansion de llaves `{src,bin,doc}` genera tres cadenas: `proyecto/src`, `proyecto/bin` y `proyecto/doc`. La opcion `-p` de `mkdir` crea los directorios padre si no existen (en este caso, `proyecto/`). La opcion A funcionaria solo si el directorio `proyecto/` ya existiese. La opcion C usa globbing `[]` que solo coincide con un caracter, no con listas de palabras. La opcion D usa `-r` que no es una opcion valida de `mkdir`.
</details>

---

## Pregunta 7
Cual es la diferencia entre los operadores `&&` y `;` en la linea de comandos?

A) `;` ejecuta comandos en paralelo, `&&` en secuencia
B) `&&` ejecuta el segundo comando solo si el primero tuvo exito, `;` ejecuta ambos sin importar el resultado
C) Son equivalentes, ambos ejecutan comandos en secuencia
D) `;` es para scripts y `&&` para la linea de comandos

<details>
<summary>Respuesta</summary>

**B) `&&` ejecuta el segundo comando solo si el primero tuvo exito, `;` ejecuta ambos sin importar el resultado**

El operador `;` ejecuta los comandos secuencialmente sin importar el codigo de salida del comando anterior. El operador `&&` (AND logico) solo ejecuta el siguiente comando si el anterior devolvio un codigo de salida 0 (exito). Ejemplo: `cd /tmp && rm archivo.txt` solo ejecutara `rm` si el `cd` fue exitoso, mientras que `cd /tmp ; rm archivo.txt` ejecutara `rm` independientemente de si el `cd` fallo o no (lo cual podria ser peligroso).
</details>

---

## Pregunta 8
Un usuario ejecuta `!grep` en la linea de comandos. Que ocurre?

A) Se busca la palabra "grep" en el directorio actual
B) Se ejecuta el ultimo comando del historial que comienza con "grep"
C) Se abre la pagina de manual de grep
D) Se ejecuta grep sin argumentos

<details>
<summary>Respuesta</summary>

**B) Se ejecuta el ultimo comando del historial que comienza con "grep"**

El operador `!cadena` busca en el historial de comandos el ultimo comando que comienza con la cadena especificada y lo ejecuta. Por ejemplo, si anteriormente se ejecuto `grep -r "error" /var/log/`, al escribir `!grep` se volveria a ejecutar exactamente ese comando. Otros operadores utiles del historial son `!!` (repite el ultimo comando), `!N` (ejecuta el comando numero N) y `!?cadena` (busca comandos que contengan la cadena en cualquier posicion).
</details>
