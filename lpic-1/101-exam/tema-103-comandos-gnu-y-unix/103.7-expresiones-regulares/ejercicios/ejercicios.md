# 103.7 - Buscar texto con expresiones regulares: Ejercicios

## Pregunta 1
Cual de los siguientes comandos muestra todas las lineas del archivo `config.txt` que NO son comentarios (no empiezan con `#`) y que NO estan vacias?

A) `grep -v "#" config.txt`
B) `grep -v "^#" config.txt | grep -v "^$"`
C) `grep "^[^#]" config.txt`
D) Tanto B como C son correctas

<details>
<summary>Respuesta</summary>

**D) Tanto B como C son correctas**

La opcion B usa dos comandos `grep` encadenados: el primero (`grep -v "^#"`) elimina las lineas que empiezan con `#` y el segundo (`grep -v "^$"`) elimina las lineas vacias. La opcion C usa `^[^#]` que busca lineas cuyo primer caracter NO es `#`; como requiere al menos un caracter, tambien excluye las lineas vacias. La opcion A es incorrecta porque `grep -v "#"` eliminaria cualquier linea que contenga `#` en cualquier posicion, no solo las que empiezan con `#`.
</details>

---

## Pregunta 2
Cual es la diferencia principal entre BRE (Basic Regular Expressions) y ERE (Extended Regular Expressions)?

A) ERE soporta mas metacaracteres que BRE
B) En BRE, los caracteres `+`, `?`, `{`, `}`, `(`, `)` necesitan `\` para ser metacaracteres; en ERE funcionan directamente
C) BRE no soporta clases de caracteres `[]`
D) ERE solo funciona con `egrep`, no con `grep`

<details>
<summary>Respuesta</summary>

**B) En BRE, los caracteres `+`, `?`, `{`, `}`, `(`, `)` necesitan `\` para ser metacaracteres; en ERE funcionan directamente**

La diferencia fundamental es como se interpretan ciertos metacaracteres. En BRE, los caracteres `+`, `?`, `{`, `}`, `(`, `)`, `|` son literales por defecto y necesitan ser escapados con `\` para funcionar como metacaracteres (ej: `\+`, `\{n\}`). En ERE, estos son metacaracteres por defecto y necesitan `\` para ser literales. Ambos tipos soportan las mismas funcionalidades; la diferencia es solo sintactica. ERE funciona con `grep -E` o `egrep`.
</details>

---

## Pregunta 3
Un administrador necesita encontrar todas las lineas que contienen una direccion IP en el archivo `access.log`. Cual de los siguientes comandos es mas adecuado?

A) `grep "[0-9].[0-9].[0-9].[0-9]" access.log`
B) `grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" access.log`
C) `grep "IP" access.log`
D) `fgrep "192.168" access.log`

<details>
<summary>Respuesta</summary>

**B) `grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" access.log`**

Esta opcion usa expresiones regulares extendidas (`-E`) con un patron que busca cuatro grupos de 1 a 3 digitos separados por puntos literales (`\.`). La opcion A es incorrecta porque el `.` sin escapar coincide con **cualquier caracter**, no solo con un punto literal, lo que generaria muchos falsos positivos. La opcion C busca el texto literal "IP", no direcciones IP. La opcion D solo buscaria direcciones que contengan "192.168", no cualquier IP.
</details>

---

## Pregunta 4
Dado el archivo `datos.txt` con el siguiente contenido:
```
color
colour
colr
colouur
```
Cual es la salida de `grep -E "colou?r" datos.txt`?

A) Solo "color"
B) Solo "colour"
C) "color" y "colour"
D) "color", "colour" y "colr"

<details>
<summary>Respuesta</summary>

**C) "color" y "colour"**

El patron `colou?r` usa el cuantificador `?` que significa "cero o una ocurrencia" del caracter anterior (`u`). Por lo tanto, el patron coincide con "color" (cero "u") y "colour" (una "u"). No coincide con "colr" porque falta la "o" antes de la "u" opcional. No coincide con "colouur" porque tiene dos "u" y `?` solo permite cero o una.
</details>

---

## Pregunta 5
Que comando muestra solo los nombres de los archivos en `/etc/` que contienen la palabra "root" (busqueda recursiva)?

A) `grep -r "root" /etc/`
B) `grep -rl "root" /etc/`
C) `grep -rc "root" /etc/`
D) `grep -rn "root" /etc/`

<details>
<summary>Respuesta</summary>

**B) `grep -rl "root" /etc/`**

La opcion `-l` (letter "L" minuscula) hace que `grep` muestre **solo los nombres de los archivos** que contienen al menos una coincidencia, sin mostrar las lineas coincidentes. Combinada con `-r` (recursivo), busca en todos los archivos dentro de `/etc/` y sus subdirectorios. La opcion A muestra los archivos Y las lineas coincidentes. La opcion C (`-c`) muestra el conteo de coincidencias por archivo. La opcion D (`-n`) muestra las lineas con sus numeros de linea.
</details>

---

## Pregunta 6
Cual de los siguientes comandos `sed` elimina todas las lineas vacias de un archivo?

A) `sed 's/^$//' archivo.txt`
B) `sed '/^$/d' archivo.txt`
C) `sed 'g/^$/d' archivo.txt`
D) `sed '/^$/r' archivo.txt`

<details>
<summary>Respuesta</summary>

**B) `sed '/^$/d' archivo.txt`**

En `sed`, la sintaxis `/patron/d` elimina las lineas que coinciden con el patron. `^$` es una expresion regular que coincide con lineas vacias (inicio de linea seguido inmediatamente por fin de linea). La opcion A usa `s///` (sustitucion) que reemplazaria la linea vacia por nada pero **no elimina la linea**, solo su contenido (la linea en blanco permanece). La opcion C tiene sintaxis incorrecta. La opcion D usa `r` que es para leer un archivo, no para eliminar.
</details>

---

## Pregunta 7
Un usuario ejecuta:
```bash
grep -E "^[A-Z][a-z]+ [A-Z][a-z]+" nombres.txt
```
Que tipo de lineas encontrara este comando?

A) Lineas que contienen solo mayusculas
B) Lineas que empiezan con dos palabras capitalizadas (primera letra mayuscula, resto minusculas)
C) Lineas que contienen cualquier combinacion de letras
D) Lineas que empiezan con una letra mayuscula

<details>
<summary>Respuesta</summary>

**B) Lineas que empiezan con dos palabras capitalizadas (primera letra mayuscula, resto minusculas)**

El patron se descompone asi: `^` = inicio de linea, `[A-Z]` = una letra mayuscula, `[a-z]+` = una o mas letras minusculas, ` ` = un espacio, `[A-Z]` = otra letra mayuscula, `[a-z]+` = una o mas letras minusculas. Esto coincide con lineas que empiezan con dos palabras capitalizadas, como "Juan Garcia", "Maria Lopez", etc. El `+` en ERE significa "una o mas repeticiones".
</details>

---

## Pregunta 8
Cual es la diferencia entre `grep -w "log" archivo.txt` y `grep "log" archivo.txt`?

A) No hay diferencia
B) `-w` busca solo en la primera palabra de cada linea
C) `-w` coincide solo cuando "log" es una palabra completa, no parte de otra palabra
D) `-w` busca solo en archivos de log

<details>
<summary>Respuesta</summary>

**C) `-w` coincide solo cuando "log" es una palabra completa, no parte de otra palabra**

La opcion `-w` (word) hace que `grep` solo coincida cuando el patron es una **palabra completa**, es decir, esta rodeado por limites de palabra (espacios, inicio/fin de linea, puntuacion). Sin `-w`, `grep "log" archivo.txt` coincidiria con lineas que contengan "log", "login", "catalog", "dialog", "logged", etc. Con `-w`, `grep -w "log" archivo.txt` solo coincide cuando aparece "log" como palabra independiente, sin ser parte de una palabra mas larga. Es equivalente a usar `grep "\blog\b" archivo.txt`.
</details>
