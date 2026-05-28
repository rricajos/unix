---
title: "103.2 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "103.2"
---

# Flashcards: 103.2 - Filtros De Texto

> 33 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-001">
<div class="flashcard-front">

**P:** Un administrador necesita ver en tiempo real las nuevas lineas que se van anadiendo a un archivo de log. Cual de los siguientes comandos es el mas adecuado?

</div>
<div class="flashcard-back">

**R:** C) `tail -f /var/log/syslog`. La opcion `-f` (follow) de `tail` permite monitorizar un archivo en tiempo real, mostrando las nuevas lineas a medida que se escriben. Es el metodo estandar para seguir archivos de log. `head` no tiene opcion `-f`. `cat -f` no es una opcion valida para este proposito. `less` se usa para visualizacion interactiva paginada, no para seguimiento en tiempo real.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-002">
<div class="flashcard-front">

**P:** Dado el archivo `datos.txt` con el siguiente contenido: ``` manzana naranja manzana pera naranja manzana ``` Que comando muestra cada fruta unica con su numero de ocurrencias, ordenado de mayor a menor frecuencia?

</div>
<div class="flashcard-back">

**R:** B) `sort datos.txt | uniq -c | sort -rn`. `uniq` solo elimina duplicados **adyacentes**, por lo que primero debemos ordenar con `sort` para que las lineas identicas queden juntas. Luego `uniq -c` cuenta las ocurrencias de cada linea. Finalmente `sort -rn` ordena numericamente en orden reverso (de mayor a menor). La opcion A fallaria porque `uniq` sin `sort` previo no eliminaria todos los duplicados. La opcion C tiene el mismo problema. La opcion D solo contaria cuantas frutas unicas hay, sin dar la frecuencia.  La salida seria: ```       3 manzana       2 naranja       1 pera ```

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-003">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos extrae correctamente los nombres de usuario (primer campo) del archivo `/etc/passwd`?

</div>
<div class="flashcard-back">

**R:** B) `cut -d ":" -f 1 /etc/passwd`. El archivo `/etc/passwd` usa `:` como delimitador de campos. La opcion `-d ":"` define el delimitador y `-f 1` selecciona el primer campo (nombre de usuario). La opcion A usa el delimitador por defecto (TAB), que no es correcto para `/etc/passwd`. La opcion C extrae solo el primer caracter de cada linea, no el primer campo. La opcion D usa espacio como delimitador, que tampoco es correcto.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-004">
<div class="flashcard-front">

**P:** Que hace el siguiente comando?

</div>
<div class="flashcard-back">

**R:** C) Reemplaza todas las ocurrencias de "error" por "ERROR" en el archivo, guardando una copia del original como registro.log.bak. El comando `sed` con la opcion `-i.bak` modifica el archivo in-place (directamente en el archivo) y guarda una copia del archivo original con la extension `.bak` (registro.log.bak). El patron `s/error/ERROR/g` sustituye (`s`) todas (`g` = global) las ocurrencias de "error" por "ERROR". Sin la `g` al final, solo se reemplazaria la primera ocurrencia en cada linea.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-005">
<div class="flashcard-front">

**P:** Un usuario tiene un archivo con lineas de texto que contienen retornos de carro de Windows (`\r\n`) y necesita convertirlo al formato Linux (`\n`). Cual es el comando correcto?

</div>
<div class="flashcard-back">

**R:** B) `tr -d '\r' < archivo.txt > archivo_limpio.txt`. El comando `tr -d '\r'` elimina todos los caracteres de retorno de carro (`\r`, que es el caracter adicional que Windows usa en los finales de linea). La entrada se redirige desde el archivo con `<` (ya que `tr` no acepta nombres de archivo como argumento, solo lee de stdin) y la salida limpia se redirige a un nuevo archivo. La opcion A haria lo contrario (anadira retornos de carro). Las opciones C y D no estan disenadas para este proposito.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-006">
<div class="flashcard-front">

**P:** Que comando se utilizaria para dividir un archivo de 10 GB en partes de 500 MB cada una con el prefijo "parte_"?

</div>
<div class="flashcard-back">

**R:** C) `split -b 500M archivo.bin parte_`. `split -b 500M` divide el archivo en partes de 500 megabytes cada una. El prefijo "parte_" se usa para nombrar los archivos resultantes (parte_aa, parte_ab, parte_ac, etc.). La opcion A divide por lineas (-l), no por tamanho. La opcion B usa `cut` que es para extraer columnas/campos, no para dividir archivos. La opcion D usa `dd` que puede copiar bloques pero no divide automaticamente en multiples archivos con nombres secuenciales.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-007">
<div class="flashcard-front">

**P:** Dado el siguiente archivo `numeros.txt`: ``` 5 3 8 3 1 5 ``` Cual sera la salida del comando `sort -n numeros.txt | uniq -d`?

</div>
<div class="flashcard-back">

**R:** A) `3` y `5` (las lineas duplicadas). Primero `sort -n` ordena numericamente: 1, 3, 3, 5, 5, 8. Luego `uniq -d` muestra **solo las lineas que aparecen mas de una vez** (duplicadas). Como 3 y 5 aparecen dos veces cada una, esas son las que se muestran. La opcion `-d` de uniq es lo contrario de `-u` (que mostraria solo las unicas: 1 y 8).  La salida seria: ``` 3 5 ```

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-008">
<div class="flashcard-front">

**P:** Un administrador necesita verificar que un archivo ISO descargado no se ha corrompido. Dispone del hash SHA-256 proporcionado por el sitio web. Cual de los siguientes comandos genera el hash SHA-256 del archivo descargado para compararlo?

</div>
<div class="flashcard-back">

**R:** B) `sha256sum ubuntu.iso`. `sha256sum` genera el hash SHA-256 de un archivo, que se puede comparar con el hash proporcionado por la fuente original para verificar la integridad del archivo. La opcion A genera un hash MD5, que es un algoritmo diferente y su hash no coincidiria con un SHA-256. La opcion C no es un comando valido en Linux. La opcion D genera un hash SHA-512, que tampoco coincidiria con un SHA-256. Tambien se puede verificar automaticamente con `sha256sum -c archivo.sha256` si se tiene un archivo con el hash esperado.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-009">
<div class="flashcard-front">

**P:** Tip de examen: `tac` es simplemente `cat` escrito al reves y hace exactamente eso: invierte el ...

</div>
<div class="flashcard-back">

**R:** `tac` es simplemente `cat` escrito al reves y hace exactamente eso: invierte el orden de las lineas.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-010">
<div class="flashcard-front">

**P:** Tip de examen: `less` es mas potente que `more` (permite retroceder, buscar hacia atras). Las p...

</div>
<div class="flashcard-back">

**R:** `less` es mas potente que `more` (permite retroceder, buscar hacia atras). Las paginas de manual (`man`) usan `less` como paginador por defecto. Las teclas de navegacion de less son iguales a las de `man` y vi.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-011">
<div class="flashcard-front">

**P:** Tip de examen: `uniq` solo elimina duplicados **adyacentes**. Si las lineas duplicadas no estan...

</div>
<div class="flashcard-back">

**R:** `uniq` solo elimina duplicados **adyacentes**. Si las lineas duplicadas no estan juntas, no las detectara. Por eso casi siempre se usa junto con `sort`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-012">
<div class="flashcard-front">

**P:** Tip de examen: `-d` define el delimitador (por defecto TAB), `-f` selecciona campos, `-c` selec...

</div>
<div class="flashcard-back">

**R:** `-d` define el delimitador (por defecto TAB), `-f` selecciona campos, `-c` selecciona caracteres.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-013">
<div class="flashcard-front">

**P:** Tip de examen: MD5 se considera inseguro para criptografia pero sigue siendo util para verifica...

</div>
<div class="flashcard-back">

**R:** MD5 se considera inseguro para criptografia pero sigue siendo util para verificacion de integridad basica. SHA-256 y SHA-512 son mas seguros.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-014">
<div class="flashcard-front">

**P:** Que hace el comando `Space`?

</div>
<div class="flashcard-back">

**R:** Avanzar una pagina

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `Enter`?

</div>
<div class="flashcard-back">

**R:** Avanzar una linea

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-016">
<div class="flashcard-front">

**P:** Que hace el comando `b`?

</div>
<div class="flashcard-back">

**R:** Retroceder una pagina (no en todos los sistemas)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-017">
<div class="flashcard-front">

**P:** Que hace el comando `/patron`?

</div>
<div class="flashcard-back">

**R:** Buscar hacia adelante

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-018">
<div class="flashcard-front">

**P:** Que hace el comando `q`?

</div>
<div class="flashcard-back">

**R:** Salir

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-019">
<div class="flashcard-front">

**P:** Que es/son 2b. Paginadores: less y more?

</div>
<div class="flashcard-back">

**R:** Los **paginadores** permiten visualizar archivos largos pagina por pagina, sin cargar todo el contenido a la vez.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-020">
<div class="flashcard-front">

**P:** Que es/son 3. sort?

</div>
<div class="flashcard-back">

**R:** `sort` ordena las lineas de un archivo o flujo de texto.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-021">
<div class="flashcard-front">

**P:** Que es/son 4. uniq?

</div>
<div class="flashcard-back">

**R:** `uniq` filtra lineas **adyacentes** duplicadas. **Requiere que la entrada este ordenada** para eliminar todos los duplicados (o se usa en combinacion con `sort`).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-022">
<div class="flashcard-front">

**P:** Que es/son 5. wc (word count)?

</div>
<div class="flashcard-back">

**R:** `wc` cuenta lineas, palabras y bytes de un archivo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-023">
<div class="flashcard-front">

**P:** Que es/son 6. cut?

</div>
<div class="flashcard-back">

**R:** `cut` extrae secciones (columnas o campos) de cada linea de un archivo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-024">
<div class="flashcard-front">

**P:** Que es/son 7. paste?

</div>
<div class="flashcard-back">

**R:** `paste` une lineas de multiples archivos lado a lado (por columnas), usando un delimitador (TAB por defecto).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-025">
<div class="flashcard-front">

**P:** Que es/son 8. join?

</div>
<div class="flashcard-back">

**R:** `join` une lineas de dos archivos que comparten un **campo comun** (similar a un JOIN en SQL). Los archivos deben estar **ordenados** por el campo de union.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-026">
<div class="flashcard-front">

**P:** Que es/son 9. tr (translate)?

</div>
<div class="flashcard-back">

**R:** `tr` traduce, elimina o comprime caracteres. **Solo lee de la entrada estandar** (no acepta archivos como argumento).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-027">
<div class="flashcard-front">

**P:** Que es/son 11. fmt?

</div>
<div class="flashcard-back">

**R:** `fmt` reformatea texto ajustando el ancho de las lineas:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-028">
<div class="flashcard-front">

**P:** Que es/son 12. pr?

</div>
<div class="flashcard-back">

**R:** `pr` prepara archivos de texto para impresion, anadiendo cabeceras con fecha, nombre del archivo y numero de pagina.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-029">
<div class="flashcard-front">

**P:** Que es/son 13. nl (numerar lineas)?

</div>
<div class="flashcard-back">

**R:** `nl` numera las lineas de un archivo con mas opciones que `cat -n`:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-030">
<div class="flashcard-front">

**P:** Que es/son 15. split?

</div>
<div class="flashcard-back">

**R:** `split` divide un archivo grande en archivos mas pequenos:

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-031">
<div class="flashcard-front">

**P:** Que es/son 16. sed (stream editor)?

</div>
<div class="flashcard-back">

**R:** `sed` es un editor de flujos que transforma texto linea por linea. Es extremadamente poderoso y solo se cubren los basicos en este objetivo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-032">
<div class="flashcard-front">

**P:** Que es/son 17. Checksums (sumas de verificacion)?

</div>
<div class="flashcard-back">

**R:** Los checksums se usan para verificar la integridad de archivos. Generan un hash unico basado en el contenido.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.2">
</div>

<div class="flashcard" data-id="103.2-fc-033">
<div class="flashcard-front">

**P:** Que es/son 18. Lectores de archivos comprimidos?

</div>
<div class="flashcard-back">

**R:** Estos comandos permiten ver el contenido de archivos comprimidos sin descomprimirlos:

</div>
</div>

---

