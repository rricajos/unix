---
title: "103.1 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "103.1"
---

# Flashcards: 103.1 - Linea De Comandos

> 24 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-001">
<div class="flashcard-front">

**P:** Un administrador necesita saber si el comando `echo` es un comando interno del shell o un programa externo. Cual de los siguientes comandos muestra esta informacion de forma mas completa?

</div>
<div class="flashcard-back">

**R:** C) `type -a echo`. `type -a` muestra **todas** las formas en que un comando puede ser encontrado: como builtin, alias, funcion o archivo externo. En el caso de `echo`, mostraria que es tanto un builtin como un archivo en `/usr/bin/echo`. `which` solo busca ejecutables en PATH y no reconoce builtins. `whereis` busca binarios, manuales y fuentes pero tampoco identifica builtins. `find` busca archivos en el sistema de archivos pero no conoce los builtins del shell.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-002">
<div class="flashcard-front">

**P:** Cual es la diferencia entre ejecutar `env` y `set` sin argumentos?

</div>
<div class="flashcard-back">

**R:** B) `env` muestra las variables de entorno y `set` muestra todas las variables (locales, de entorno y funciones). `env` sin argumentos lista unicamente las variables de entorno (las que han sido exportadas y estan disponibles para procesos hijos). `set` sin argumentos muestra todas las variables del shell, incluyendo las variables locales, las variables de entorno y las funciones definidas. Esta es una distincion importante para el examen LPIC-1.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-003">
<div class="flashcard-front">

**P:** Un usuario ejecuta los siguientes comandos: ```bash ANIMAL=gato export FRUTA=manzana bash echo $ANIMAL echo $FRUTA ``` Que se mostrara en las dos ultimas lineas?

</div>
<div class="flashcard-back">

**R:** B) Una linea vacia y `manzana`. `ANIMAL=gato` crea una variable local que solo existe en el shell actual. `export FRUTA=manzana` crea una variable de entorno que se hereda a los procesos hijos. Al ejecutar `bash`, se abre un nuevo shell hijo. En este shell hijo, `ANIMAL` no existe (era local del padre), por lo que `echo $ANIMAL` muestra una linea vacia. `FRUTA` si fue exportada, por lo que `echo $FRUTA` muestra `manzana`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-004">
<div class="flashcard-front">

**P:** Que comando buscaria en las descripciones de las paginas de manual todas las entradas relacionadas con "password"?

</div>
<div class="flashcard-back">

**R:** C) `man -k password`. `man -k` (equivalente a `apropos`) busca la palabra clave en las descripciones cortas de todas las paginas de manual del sistema y muestra las coincidencias. `man -f` (equivalente a `whatis`) solo muestra la descripcion de un comando exacto, no busca en las descripciones. `man password` intentaria abrir una pagina de manual llamada "password" (que podria no existir). `info password` abriria la pagina info de "password" si existiese.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-005">
<div class="flashcard-front">

**P:** Dado el siguiente comando: ```bash echo "El directorio home es $HOME y el usuario es $(whoami)" ``` Que ocurre con las variables y la sustitucion de comando?

</div>
<div class="flashcard-back">

**R:** C) Se expande tanto `$HOME` como `$(whoami)` con sus valores reales. Las comillas dobles permiten la expansion de variables (`$VARIABLE`) y la sustitucion de comandos (`$(comando)` o `` `comando` ``). Solo las comillas simples evitan toda expansion. Por lo tanto, `$HOME` se reemplaza por el directorio home del usuario y `$(whoami)` se reemplaza por el nombre de usuario. La salida seria algo como: `El directorio home es /home/sandra y el usuario es sandra`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-006">
<div class="flashcard-front">

**P:** Un usuario quiere crear los directorios `proyecto/src`, `proyecto/bin` y `proyecto/doc` con un solo comando. Cual de las siguientes opciones es correcta?

</div>
<div class="flashcard-back">

**R:** B) `mkdir -p proyecto/{src,bin,doc}`. La expansion de llaves `{src,bin,doc}` genera tres cadenas: `proyecto/src`, `proyecto/bin` y `proyecto/doc`. La opcion `-p` de `mkdir` crea los directorios padre si no existen (en este caso, `proyecto/`). La opcion A funcionaria solo si el directorio `proyecto/` ya existiese. La opcion C usa globbing `[]` que solo coincide con un caracter, no con listas de palabras. La opcion D usa `-r` que no es una opcion valida de `mkdir`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-007">
<div class="flashcard-front">

**P:** Cual es la diferencia entre los operadores `&&` y `;` en la linea de comandos?

</div>
<div class="flashcard-back">

**R:** B) `&&` ejecuta el segundo comando solo si el primero tuvo exito, `;` ejecuta ambos sin importar el resultado. El operador `;` ejecuta los comandos secuencialmente sin importar el codigo de salida del comando anterior. El operador `&&` (AND logico) solo ejecuta el siguiente comando si el anterior devolvio un codigo de salida 0 (exito). Ejemplo: `cd /tmp && rm archivo.txt` solo ejecutara `rm` si el `cd` fue exitoso, mientras que `cd /tmp ; rm archivo.txt` ejecutara `rm` independientemente de si el `cd` fallo o no (lo cual podria ser peligroso).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-008">
<div class="flashcard-front">

**P:** Un usuario ejecuta `!grep` en la linea de comandos. Que ocurre?

</div>
<div class="flashcard-back">

**R:** B) Se ejecuta el ultimo comando del historial que comienza con "grep". El operador `!cadena` busca en el historial de comandos el ultimo comando que comienza con la cadena especificada y lo ejecuta. Por ejemplo, si anteriormente se ejecuto `grep -r "error" /var/log/`, al escribir `!grep` se volveria a ejecutar exactamente ese comando. Otros operadores utiles del historial son `!!` (repite el ultimo comando), `!N` (ejecuta el comando numero N) y `!?cadena` (busca comandos que contengan la cadena en cualquier posicion).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-009">
<div class="flashcard-front">

**P:** Tip de examen: `apropos` = `man -k` (buscar). `whatis` = `man -f` (descripcion corta).

</div>
<div class="flashcard-back">

**R:** `apropos` = `man -k` (buscar). `whatis` = `man -f` (descripcion corta).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-010">
<div class="flashcard-front">

**P:** Tip de examen: `man` y `info` son para comandos externos. `help` es exclusivo para builtins de ...

</div>
<div class="flashcard-back">

**R:** `man` y `info` son para comandos externos. `help` es exclusivo para builtins de bash. Por ejemplo, `man cd` puede no existir, pero `help cd` siempre funciona en bash.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-011">
<div class="flashcard-front">

**P:** Tip de examen: `uname -r` para version del kernel y `uname -a` para toda la informacion son los...

</div>
<div class="flashcard-back">

**R:** `uname -r` para version del kernel y `uname -a` para toda la informacion son los mas preguntados.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-012">
<div class="flashcard-front">

**P:** Tip de examen: Es muy comun que `~/.bash_profile` contenga un `source ~/.bashrc` para reutiliza...

</div>
<div class="flashcard-back">

**R:** Es muy comun que `~/.bash_profile` contenga un `source ~/.bashrc` para reutilizar la configuracion. Asi, los alias y funciones definidos en `.bashrc` tambien estan disponibles en shells de login.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-013">
<div class="flashcard-front">

**P:** Que hace el comando `sh`?

</div>
<div class="flashcard-back">

**R:** Bourne Shell, el shell original de Unix. Mas limitado que bash

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-014">
<div class="flashcard-front">

**P:** Que hace el comando `zsh`?

</div>
<div class="flashcard-back">

**R:** Z Shell, muy popular, con autocompletado avanzado y temas

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `csh`?

</div>
<div class="flashcard-back">

**R:** C Shell, con sintaxis similar al lenguaje C

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-016">
<div class="flashcard-front">

**P:** Que hace el comando `tcsh`?

</div>
<div class="flashcard-back">

**R:** Version mejorada de csh

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-017">
<div class="flashcard-front">

**P:** Que hace el comando `ksh`?

</div>
<div class="flashcard-back">

**R:** Korn Shell, combina caracteristicas de sh y csh

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-018">
<div class="flashcard-front">

**P:** Que es/son 8. Paginas info?

</div>
<div class="flashcard-back">

**R:** El sistema **info** proporciona documentacion mas detallada que man, organizada en nodos con hiperenlaces (estilo hipertexto).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-019">
<div class="flashcard-front">

**P:** Que es/son 9. Alias?

</div>
<div class="flashcard-back">

**R:** Los alias permiten crear atajos para comandos largos o frecuentes.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-020">
<div class="flashcard-front">

**P:** Que es/son 10. Expansion de llaves?

</div>
<div class="flashcard-back">

**R:** La expansion de llaves genera cadenas arbitrarias. **No depende de la existencia de archivos** (a diferencia del globbing).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-021">
<div class="flashcard-front">

**P:** Que es/son 11. Globbing (comodines de archivos)?

</div>
<div class="flashcard-back">

**R:** El globbing permite hacer coincidir nombres de archivo usando patrones. **A diferencia de la expansion de llaves, el globbing depende de los archivos que existan**.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-022">
<div class="flashcard-front">

**P:** Que es/son 12. El comando exec?

</div>
<div class="flashcard-back">

**R:** `exec` reemplaza el shell actual con el comando especificado. **El shell deja de existir** y es sustituido por el nuevo proceso. No se crea proceso hijo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-023">
<div class="flashcard-front">

**P:** Que es/son 13. El comando uname?

</div>
<div class="flashcard-back">

**R:** Muestra informacion del sistema:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.1">
</div>

<div class="flashcard" data-id="103.1-fc-024">
<div class="flashcard-front">

**P:** Que es/son 15. El comando `hash`?

</div>
<div class="flashcard-back">

**R:** El shell bash mantiene una **tabla hash interna** que almacena las rutas de los comandos externos ya ejecutados. Esto evita que el shell tenga que buscar en todos los directorios de `$PATH` cada vez qu

</div>
</div>

---

