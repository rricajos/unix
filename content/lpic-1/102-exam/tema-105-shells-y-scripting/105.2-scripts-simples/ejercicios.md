---
title: "105.2 - Ejercicios: Personalizar o escribir scripts simples"
tags:
  - lpic-1
  - examen-102
  - tema-105
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "105"
subtema: "105.2"
---

# 105.2 - Ejercicios: Personalizar o escribir scripts simples

### Pregunta 1

Cual es la diferencia entre `"$@"` y `"$*"` cuando se usan con comillas dobles en un script que se ejecuta con `./script.sh "uno dos" tres`?

a) `"$@"` genera una sola cadena `"uno dos tres"` y `"$*"` genera dos argumentos separados
b) `"$@"` genera dos argumentos (`"uno dos"` y `"tres"`) y `"$*"` genera una sola cadena con todos los argumentos
c) Ambos generan dos argumentos separados: `"uno dos"` y `"tres"`
d) Ambos generan tres argumentos separados: `"uno"`, `"dos"` y `"tres"`

<details><summary>Respuesta</summary>

**b) `"$@"` genera dos argumentos (`"uno dos"` y `"tres"`) y `"$*"` genera una sola cadena con todos los argumentos**

`"$@"` expande cada argumento como una palabra separada, respetando las comillas originales. En un bucle `for arg in "$@"`, se obtienen 2 iteraciones: `uno dos` y `tres`. `"$*"` expande todos los argumentos como una sola cadena (concatenados con el primer caracter de IFS). En un bucle `for arg in "$*"`, se obtiene 1 sola iteracion con `uno dos tres`. En la practica, `"$@"` es casi siempre la opcion correcta para iterar sobre argumentos.

</details>

---

### Pregunta 2

Cual de las siguientes lineas shebang es la forma mas portable de indicar que un script debe ejecutarse con bash?

a) `#!/bin/bash`
b) `#!/usr/bin/env bash`
c) `#!/usr/local/bin/bash`
d) `#!bash`

<details><summary>Respuesta</summary>

**b) `#!/usr/bin/env bash`**

`#!/usr/bin/env bash` usa el comando `env` para buscar `bash` en el `PATH` del sistema, lo que lo hace funcionar independientemente de donde este instalado bash. `#!/bin/bash` asume que bash esta en `/bin/bash`, lo cual puede fallar en sistemas donde bash esta en otra ubicacion (por ejemplo, `/usr/local/bin/bash` en FreeBSD). `#!/usr/local/bin/bash` es incluso menos portable. `#!bash` no es valido porque requiere una ruta absoluta o el uso de `env`.

</details>

---

### Pregunta 3

Que operador de test se usa para verificar si una cadena esta vacia y cual para verificar si un archivo es un directorio?

a) `-e` para cadena vacia y `-f` para directorio
b) `-z` para cadena vacia y `-d` para directorio
c) `-n` para cadena vacia y `-d` para directorio
d) `-z` para cadena vacia y `-f` para directorio

<details><summary>Respuesta</summary>

**b) `-z` para cadena vacia y `-d` para directorio**

`-z` (zero length) verifica si una cadena esta vacia: `[ -z "$variable" ]` es verdadero si la variable esta vacia o no definida. `-d` (directory) verifica si la ruta es un directorio: `[ -d /tmp ]` es verdadero si `/tmp` es un directorio. `-n` (non-zero) es lo opuesto a `-z` (verifica que la cadena NO este vacia). `-f` verifica si es un archivo regular (no directorio). `-e` verifica si existe (cualquier tipo).

</details>

---

### Pregunta 4

Cual de las siguientes afirmaciones sobre `[ ]` y `[[ ]]` es correcta?

a) `[ ]` es exclusivo de bash y `[[ ]]` es compatible con POSIX
b) `[ ]` es POSIX compatible y usa `-a`/`-o` para logica; `[[ ]]` es exclusivo de bash y usa `&&`/`||`
c) `[[ ]]` no soporta pattern matching ni expresiones regulares
d) Dentro de `[ ]` no es necesario entrecomillar variables porque bash maneja la expansion automaticamente

<details><summary>Respuesta</summary>

**b) `[ ]` es POSIX compatible y usa `-a`/`-o` para logica; `[[ ]]` es exclusivo de bash y usa `&&`/`||`**

`[ ]` (equivalente al comando `test`) es POSIX compatible y funciona en cualquier shell. Usa `-a` para AND y `-o` para OR, y requiere entrecomillar variables para evitar errores si estan vacias. `[[ ]]` es una extension de bash (no POSIX) que usa `&&` y `||` para operadores logicos, soporta pattern matching con `==` y expresiones regulares con `=~`, y no necesita entrecomillar variables porque bash maneja `[[ ]]` de forma especial sin word splitting.

</details>

---

### Pregunta 5

Que imprime el siguiente script?
```bash
#!/bin/bash
x=10
resultado=$((x * 2 + 5))
echo $resultado
echo $?
```

a) `25` y `25`
b) `25` y `0`
c) `15` y `0`
d) `25` y `1`

<details><summary>Respuesta</summary>

**b) `25` y `0`**

Primero, `x=10`. Luego, `resultado=$((x * 2 + 5))` realiza la aritmetica del shell: 10 * 2 + 5 = 25. Nota: dentro de `$(( ))` no se necesita `$` antes de la variable. `echo $resultado` imprime `25`. `echo $?` imprime `0` porque el `echo` anterior se ejecuto con exito (codigo de salida 0). `$?` siempre contiene el codigo de salida del ultimo comando ejecutado: 0 indica exito, cualquier otro valor indica error.

</details>

---

### Pregunta 6

En una estructura `case` en bash, cual es la sintaxis correcta para terminar cada bloque de patron y cual es la palabra clave que cierra la estructura completa?

a) Cada bloque termina con `;;` y la estructura cierra con `esac`
b) Cada bloque termina con `done` y la estructura cierra con `end`
c) Cada bloque termina con `break` y la estructura cierra con `esac`
d) Cada bloque termina con `;` y la estructura cierra con `case`

<details><summary>Respuesta</summary>

**a) Cada bloque termina con `;;` y la estructura cierra con `esac`**

En la estructura `case` de bash, cada patron termina con `)`, cada bloque de comandos termina con `;;` (doble punto y coma), y la estructura completa se cierra con `esac` (que es `case` escrito al reves). El patron comodin `*)` funciona como caso por defecto. Los patrones pueden usar `|` para combinar multiples opciones (por ejemplo, `start|begin)`). Esta es una sintaxis fundamental para el examen LPIC-1.

</details>

---

### Pregunta 7

Que hace `exec` cuando se usa con un comando versus cuando se usa solo con redirecciones?

a) Con un comando, abre un subshell; con redirecciones, modifica los file descriptors del shell actual
b) Con un comando, reemplaza el shell actual por ese comando; con solo redirecciones, modifica los file descriptors sin reemplazar el shell
c) En ambos casos reemplaza el shell actual por el comando o la redireccion
d) Con un comando, ejecuta en segundo plano; con redirecciones, redirige la salida temporalmente

<details><summary>Respuesta</summary>

**b) Con un comando, reemplaza el shell actual por ese comando; con solo redirecciones, modifica los file descriptors sin reemplazar el shell**

`exec comando` reemplaza el proceso actual del shell por el comando especificado; el shell deja de existir y cualquier linea posterior no se ejecutara. `exec > archivo` (solo redireccion, sin comando) modifica permanentemente los file descriptors del shell actual sin reemplazarlo; el script continua ejecutandose. Por ejemplo, `exec > /tmp/log.txt` redirige toda la salida estandar posterior al archivo. `exec 3< /etc/passwd` abre un file descriptor para lectura.

</details>

---

### Pregunta 8

Cual es la diferencia entre un here document con `<< EOF` y con `<< 'EOF'` (delimitador entre comillas)?

a) `<< 'EOF'` permite la expansion de variables, `<< EOF` no
b) `<< EOF` permite la expansion de variables y sustitucion de comandos, `<< 'EOF'` trata todo como texto literal
c) `<< 'EOF'` genera un error de sintaxis
d) No hay diferencia, ambos se comportan de la misma forma

<details><summary>Respuesta</summary>

**b) `<< EOF` permite la expansion de variables y sustitucion de comandos, `<< 'EOF'` trata todo como texto literal**

Con `<< EOF`, las variables como `$HOME` y las sustituciones de comandos como `$(date)` se expanden a sus valores reales dentro del bloque heredoc. Con `<< 'EOF'` (comillas simples en el delimitador), NINGUNA expansion se realiza: `$HOME` y `$(date)` aparecen como texto literal. Esto es util cuando se quiere generar un archivo que contenga literalmente sintaxis de variables de shell sin que se interpreten.

</details>

---

### Pregunta 9

Que variable especial contiene el numero de argumentos pasados a un script y cual contiene el nombre del propio script?

a) `$@` contiene el numero de argumentos y `$0` el nombre del script
b) `$#` contiene el numero de argumentos y `$1` el nombre del script
c) `$#` contiene el numero de argumentos y `$0` el nombre del script
d) `$*` contiene el numero de argumentos y `$$` el nombre del script

<details><summary>Respuesta</summary>

**c) `$#` contiene el numero de argumentos y `$0` el nombre del script**

`$#` devuelve el numero total de parametros posicionales pasados al script (sin contar `$0`). `$0` contiene el nombre del script tal como fue invocado. Otras variables especiales importantes: `$1` a `$9` son los parametros posicionales individuales, `$@` y `$*` representan todos los parametros, `$?` es el codigo de salida del ultimo comando, `$$` es el PID del shell actual, y `$!` es el PID del ultimo proceso ejecutado en segundo plano.

</details>

---

### Pregunta 10

Un script necesita leer `/etc/passwd` linea por linea usando `:` como separador de campos. Cual es la forma correcta de hacerlo con un bucle `while`?

a) `while read -d ":" linea; do echo "$linea"; done < /etc/passwd`
b) `while IFS=: read usuario password uid gid gecos home shell; do echo "$usuario"; done < /etc/passwd`
c) `for linea in $(cat /etc/passwd); do IFS=: read usuario <<< "$linea"; done`
d) `while read linea; do cut -d: -f1 "$linea"; done < /etc/passwd`

<details><summary>Respuesta</summary>

**b) `while IFS=: read usuario password uid gid gecos home shell; do echo "$usuario"; done < /etc/passwd`**

La forma correcta es establecer `IFS=:` (Internal Field Separator) antes de `read` para que los campos se separen por `:` en lugar del separador por defecto (espacio/tab/newline). Al especificar multiples variables en `read`, cada campo se asigna a la variable correspondiente. La redireccion `< /etc/passwd` alimenta el archivo como entrada del bucle `while`. Esta tecnica es fundamental para procesar archivos con campos delimitados en scripts de shell.

</details>
