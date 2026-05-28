---
title: "103.7 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "103.7"
---

# Flashcards: 103.7 - Expresiones Regulares

> 18 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-001">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos muestra todas las lineas del archivo `config.txt` que NO son comentarios (no empiezan con `#`) y que NO estan vacias?

</div>
<div class="flashcard-back">

**R:** D) Tanto B como C son correctas. La opcion B usa dos comandos `grep` encadenados: el primero (`grep -v "^#"`) elimina las lineas que empiezan con `#` y el segundo (`grep -v "^$"`) elimina las lineas vacias. La opcion C usa `^[^#]` que busca lineas cuyo primer caracter NO es `#`; como requiere al menos un caracter, tambien excluye las lineas vacias. La opcion A es incorrecta porque `grep -v "#"` eliminaria cualquier linea que contenga `#` en cualquier posicion, no solo las que empiezan con `#`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-002">
<div class="flashcard-front">

**P:** Cual es la diferencia principal entre BRE (Basic Regular Expressions) y ERE (Extended Regular Expressions)?

</div>
<div class="flashcard-back">

**R:** B) En BRE, los caracteres `+`, `?`, `{`, `}`, `(`, `)` necesitan `\` para ser metacaracteres; en ERE funcionan directamente. La diferencia fundamental es como se interpretan ciertos metacaracteres. En BRE, los caracteres `+`, `?`, `{`, `}`, `(`, `)`, `|` son literales por defecto y necesitan ser escapados con `\` para funcionar como metacaracteres (ej: `\+`, `\{n\}`). En ERE, estos son metacaracteres por defecto y necesitan `\` para ser literales. Ambos tipos soportan las mismas funcionalidades; la diferencia es solo sintactica. ERE funciona con `grep -E` o `egrep`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-003">
<div class="flashcard-front">

**P:** Un administrador necesita encontrar todas las lineas que contienen una direccion IP en el archivo `access.log`. Cual de los siguientes comandos es mas adecuado?

</div>
<div class="flashcard-back">

**R:** B) `grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" access.log`. Esta opcion usa expresiones regulares extendidas (`-E`) con un patron que busca cuatro grupos de 1 a 3 digitos separados por puntos literales (`\.`). La opcion A es incorrecta porque el `.` sin escapar coincide con **cualquier caracter**, no solo con un punto literal, lo que generaria muchos falsos positivos. La opcion C busca el texto literal "IP", no direcciones IP. La opcion D solo buscaria direcciones que contengan "192.168", no cualquier IP.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-004">
<div class="flashcard-front">

**P:** Dado el archivo `datos.txt` con el siguiente contenido: ``` color colour colr colouur ``` Cual es la salida de `grep -E "colou?r" datos.txt`?

</div>
<div class="flashcard-back">

**R:** C) "color" y "colour". El patron `colou?r` usa el cuantificador `?` que significa "cero o una ocurrencia" del caracter anterior (`u`). Por lo tanto, el patron coincide con "color" (cero "u") y "colour" (una "u"). No coincide con "colr" porque falta la "o" antes de la "u" opcional. No coincide con "colouur" porque tiene dos "u" y `?` solo permite cero o una.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-005">
<div class="flashcard-front">

**P:** Que comando muestra solo los nombres de los archivos en `/etc/` que contienen la palabra "root" (busqueda recursiva)?

</div>
<div class="flashcard-back">

**R:** B) `grep -rl "root" /etc/`. La opcion `-l` (letter "L" minuscula) hace que `grep` muestre **solo los nombres de los archivos** que contienen al menos una coincidencia, sin mostrar las lineas coincidentes. Combinada con `-r` (recursivo), busca en todos los archivos dentro de `/etc/` y sus subdirectorios. La opcion A muestra los archivos Y las lineas coincidentes. La opcion C (`-c`) muestra el conteo de coincidencias por archivo. La opcion D (`-n`) muestra las lineas con sus numeros de linea.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-006">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos `sed` elimina todas las lineas vacias de un archivo?

</div>
<div class="flashcard-back">

**R:** B) `sed '/^$/d' archivo.txt`. En `sed`, la sintaxis `/patron/d` elimina las lineas que coinciden con el patron. `^$` es una expresion regular que coincide con lineas vacias (inicio de linea seguido inmediatamente por fin de linea). La opcion A usa `s///` (sustitucion) que reemplazaria la linea vacia por nada pero **no elimina la linea**, solo su contenido (la linea en blanco permanece). La opcion C tiene sintaxis incorrecta. La opcion D usa `r` que es para leer un archivo, no para eliminar.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-007">
<div class="flashcard-front">

**P:** Un usuario ejecuta: ```bash grep -E "^[A-Z][a-z]+ [A-Z][a-z]+" nombres.txt ``` Que tipo de lineas encontrara este comando?

</div>
<div class="flashcard-back">

**R:** B) Lineas que empiezan con dos palabras capitalizadas (primera letra mayuscula, resto minusculas). El patron se descompone asi: `^` = inicio de linea, `[A-Z]` = una letra mayuscula, `[a-z]+` = una o mas letras minusculas, ` ` = un espacio, `[A-Z]` = otra letra mayuscula, `[a-z]+` = una o mas letras minusculas. Esto coincide con lineas que empiezan con dos palabras capitalizadas, como "Juan Garcia", "Maria Lopez", etc. El `+` en ERE significa "una o mas repeticiones".

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-008">
<div class="flashcard-front">

**P:** Cual es la diferencia entre `grep -w "log" archivo.txt` y `grep "log" archivo.txt`?

</div>
<div class="flashcard-back">

**R:** C) `-w` coincide solo cuando "log" es una palabra completa, no parte de otra palabra. La opcion `-w` (word) hace que `grep` solo coincida cuando el patron es una **palabra completa**, es decir, esta rodeado por limites de palabra (espacios, inicio/fin de linea, puntuacion). Sin `-w`, `grep "log" archivo.txt` coincidiria con lineas que contengan "log", "login", "catalog", "dialog", "logged", etc. Con `-w`, `grep -w "log" archivo.txt` solo coincide cuando aparece "log" como palabra independiente, sin ser parte de una palabra mas larga. Es equivalente a usar `grep "\blog\b" archivo.txt`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-009">
<div class="flashcard-front">

**P:** Tip de examen: `egrep` y `fgrep` se consideran comandos obsoletos (deprecated). Se recomienda u...

</div>
<div class="flashcard-back">

**R:** `egrep` y `fgrep` se consideran comandos obsoletos (deprecated). Se recomienda usar `grep -E` y `grep -F` en su lugar, pero ambas formas son validas.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-010">
<div class="flashcard-front">

**P:** Tip de examen: `\b` y `\w` funcionan en GNU grep. `\d` puede no funcionar en todas las versione...

</div>
<div class="flashcard-back">

**R:** `\b` y `\w` funcionan en GNU grep. `\d` puede no funcionar en todas las versiones; es mas seguro usar `[0-9]` o `[[:digit:]]`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-011">
<div class="flashcard-front">

**P:** Que hace el comando `.`?

</div>
<div class="flashcard-back">

**R:** Cualquier caracter (excepto salto de linea)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-012">
<div class="flashcard-front">

**P:** Que hace el comando `*`?

</div>
<div class="flashcard-back">

**R:** Cero o mas repeticiones del caracter anterior

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-013">
<div class="flashcard-front">

**P:** Que hace el comando `^`?

</div>
<div class="flashcard-back">

**R:** Inicio de linea

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-014">
<div class="flashcard-front">

**P:** Que hace el comando `$`?

</div>
<div class="flashcard-back">

**R:** Fin de linea

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `[]`?

</div>
<div class="flashcard-back">

**R:** Clase de caracteres (uno de los listados)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-016">
<div class="flashcard-front">

**P:** Que es/son 1. Que son las expresiones regulares?

</div>
<div class="flashcard-back">

**R:** Las **expresiones regulares** (regex o regexp) son patrones de texto que describen un conjunto de cadenas posibles. Permiten buscar, comparar y manipular texto de forma flexible y potente.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-017">
<div class="flashcard-front">

**P:** Que es/son 7. Clases de caracteres POSIX?

</div>
<div class="flashcard-back">

**R:** Las clases POSIX funcionan dentro de corchetes `[[:clase:]]`:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.7">
</div>

<div class="flashcard" data-id="103.7-fc-018">
<div class="flashcard-front">

**P:** Que es/son 8. Secuencias de escape comunes?

</div>
<div class="flashcard-back">

**R:** | Secuencia | Significado | Equivalente |

</div>
</div>

---

