---
title: "103.4 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "103.4"
---

# Flashcards: 103.4 - Flujos Pipes Y Redirecciones

> 26 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-001">
<div class="flashcard-front">

**P:** Un administrador quiere ejecutar un comando y guardar tanto la salida estandar como los errores en el mismo archivo `log.txt`. Cuales de las siguientes opciones son correctas? (Seleccione DOS) A) `comando > log.txt 2>&1` B) `comando 2>&1 > log.txt` C) `comando &> log.txt` D) `comando > log.txt > log.txt`

</div>
<div class="flashcard-back">

**R:** A) `comando > log.txt 2>&1` y C) `comando &> log.txt`. La opcion A primero redirige stdout al archivo `log.txt`, y luego `2>&1` redirige stderr a donde apunte stdout (que ya es log.txt). La opcion C usa `&>` que es un atajo de bash para redirigir ambos flujos al mismo archivo. La opcion B es incorrecta porque `2>&1` se evalua primero (stderr va a donde stdout apunta en ese momento, que es la pantalla), y luego `> log.txt` solo redirige stdout al archivo; stderr sigue yendo a la pantalla. La opcion D no es valida para combinar ambos flujos.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-002">
<div class="flashcard-front">

**P:** Que hace el siguiente comando?

</div>
<div class="flashcard-back">

**R:** B) Elimina todos los archivos .log de /var/log modificados hace mas de 30 dias. `find /var/log -name "*.log" -mtime +30` busca todos los archivos que terminan en `.log` dentro de `/var/log` que fueron modificados hace mas de 30 dias. El operador `|` pasa esta lista de archivos a `xargs`, que convierte cada linea de la entrada estandar en argumentos para el comando `rm`. El resultado es que `rm` elimina cada uno de los archivos encontrados. Si los nombres de archivo pudieran contener espacios, seria mas seguro usar `find ... -print0 | xargs -0 rm`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-003">
<div class="flashcard-front">

**P:** Cual de los siguientes comandos muestra la salida del comando `ls -l` en la pantalla Y al mismo tiempo la guarda en el archivo `listado.txt`?

</div>
<div class="flashcard-back">

**R:** C) `ls -l | tee listado.txt`. `tee` lee de la entrada estandar y escribe simultaneamente en la salida estandar (pantalla) y en el archivo especificado. Es la unica forma de dividir el flujo de datos para que vaya a dos destinos al mismo tiempo. La opcion A redirige toda la salida al archivo (no muestra nada en pantalla). La opcion B anade al archivo pero tampoco muestra en pantalla. La opcion D tambien redirige todo al archivo sin mostrar en pantalla. Si se quisiera anadir al archivo en vez de sobreescribir, se usaria `tee -a`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-004">
<div class="flashcard-front">

**P:** Que son los descriptores de archivo 0, 1 y 2 en Linux?

</div>
<div class="flashcard-back">

**R:** C) 0=stdin, 1=stdout, 2=stderr. Los tres descriptores de archivo estandar en Linux son: **0** para la entrada estandar (stdin, por defecto el teclado), **1** para la salida estandar (stdout, por defecto la pantalla) y **2** para la salida de error estandar (stderr, por defecto tambien la pantalla). Estos numeros son fundamentales para las redirecciones: `>` equivale a `1>`, `<` equivale a `0<`, y `2>` redirige especificamente los errores. Todo proceso en Linux hereda estos tres descriptores al ser creado.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-005">
<div class="flashcard-front">

**P:** Un script genera mucha salida que no interesa y tambien mensajes de error que tampoco se quieren ver. Cual es la forma correcta de descartar TODA la salida?

</div>
<div class="flashcard-back">

**R:** B) `script.sh &> /dev/null`. `&>` redirige tanto stdout como stderr al mismo destino. `/dev/null` es un archivo especial que descarta todo lo que se escribe en el. Otra forma equivalente seria `script.sh > /dev/null 2>&1`. La opcion A usa `/dev/zero` que es un dispositivo que genera ceros al leer de el, no es un sumidero para descartar datos (aunque escribir en el no causa error, no es idiomatico). La opcion C solo descarta stdout, los errores seguirian apareciendo en pantalla. La opcion D solo descarta stderr, la salida normal seguiria en pantalla.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-006">
<div class="flashcard-front">

**P:** Que hace el operador `<<` en el siguiente ejemplo?

</div>
<div class="flashcard-back">

**R:** B) Crea un here document que pasa el bloque de texto como stdin a cat, con expansion de variables. El operador `<<` seguido de un delimitador (en este caso `FIN`) crea un "here document". Todo el texto entre `<< FIN` y la linea que contiene solo `FIN` se pasa como entrada estandar al comando `cat`. Dentro del here document, las variables como `$USER` y las sustituciones de comandos como `$(date)` se expanden con sus valores reales. Si se quisiera evitar la expansion, se usarian comillas en el delimitador: `<< 'FIN'`. El delimitador de cierre debe estar solo en su propia linea, sin espacios antes ni despues.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-007">
<div class="flashcard-front">

**P:** Un administrador quiere encontrar todos los archivos `.conf` en `/etc` y copiarlos a `/backup/configs/`. Los nombres de algunos archivos contienen espacios. Cual de los siguientes comandos es el mas seguro?

</div>
<div class="flashcard-back">

**R:** B) `find /etc -name "*.conf" -print0 | xargs -0 cp -t /backup/configs/`. Cuando los nombres de archivo pueden contener espacios u otros caracteres especiales, es fundamental usar `-print0` en `find` (que separa los resultados con el caracter null `\0` en vez de saltos de linea) y `-0` en `xargs` (que usa null como delimitador de entrada). La opcion `-t` de `cp` especifica el directorio destino, permitiendo que los nombres de archivo vayan como argumentos finales. La opcion A fallaria con nombres que contienen espacios porque xargs los interpretaria como argumentos separados. La opcion C no funcionaria porque `cp` no lee de stdin. La opcion D redirige la salida de find a un archivo llamado "xargs", no ejecuta xargs.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-008">
<div class="flashcard-front">

**P:** Cual es la funcion del comando `mkfifo` y como se diferencia de un pipe normal?

</div>
<div class="flashcard-back">

**R:** B) `mkfifo` crea un pipe con nombre (FIFO) que persiste en el sistema de archivos y puede ser usado por procesos no relacionados. `mkfifo` crea una named pipe (FIFO - First In, First Out) que aparece como un archivo especial en el sistema de archivos (identificado con `p` en `ls -l`). A diferencia del pipe normal (`|`) que solo conecta dos comandos en la misma linea y es temporal, una named pipe persiste hasta que se elimine con `rm`, y puede ser utilizada por procesos completamente independientes (incluso en distintas sesiones de terminal). Un proceso puede escribir en la pipe (`echo "datos" > mi_pipe`) y otro puede leer de ella (`cat < mi_pipe`). La operacion es bloqueante: el escritor espera a que alguien lea, y viceversa.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-009">
<div class="flashcard-front">

**P:** Tip de examen: `/dev/null` es la forma estandar de descartar salida no deseada. Es un "sumidero...

</div>
<div class="flashcard-back">

**R:** `/dev/null` es la forma estandar de descartar salida no deseada. Es un "sumidero" (sink) que acepta cualquier cantidad de datos y los descarta.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-010">
<div class="flashcard-front">

**P:** Tip de examen: `xargs` es necesario cuando el comando destino espera **argumentos** (no stdin)....

</div>
<div class="flashcard-back">

**R:** `xargs` es necesario cuando el comando destino espera **argumentos** (no stdin). Por ejemplo, `rm`, `cp`, `mv`, `chmod` necesitan nombres de archivo como argumentos, no datos por stdin.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-011">
<div class="flashcard-front">

**P:** Tip de examen: La sustitucion de procesos es especifica de bash (no funciona en `sh`). Es parti...

</div>
<div class="flashcard-back">

**R:** La sustitucion de procesos es especifica de bash (no funciona en `sh`). Es particularmente util con `diff` para comparar la salida de dos comandos, y con `while read` para evitar problemas de subshell creados por pipes.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-012">
<div class="flashcard-front">

**P:** Que hace el comando `El pipe`?

</div>
<div class="flashcard-back">

**R:** ` conecta la **salida estandar** de un comando con la **entrada estandar** del siguiente comando. Es uno de los conceptos mas poderosos de Unix.  ```bash ls -l /etc

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-013">
<div class="flashcard-front">

**P:** Que hace el comando `tee >(wc -l)`?

</div>
<div class="flashcard-back">

**R:** > **Para el examen**: La sustitucion de procesos es especifica de bash (no funciona en `sh`). Es particularmente util con `diff` para comparar la salida de dos comandos, y con `while read` para evitar problemas de subshell creados por pipes.  ---  ## 13. Named pipes (FIFOs): mkfifo  Una **named pipe** (tuberia con nombre) o **FIFO** (First In, First Out) es un archivo especial en el sistema de archivos que actua como un canal de comunicacion entre procesos. A diferencia de los pipes normales (`

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-014">
<div class="flashcard-front">

**P:** Que hace el comando `>`?

</div>
<div class="flashcard-back">

**R:** Redirige stdout a archivo (sobreescribe)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `>>`?

</div>
<div class="flashcard-back">

**R:** Redirige stdout a archivo (anade)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-016">
<div class="flashcard-front">

**P:** Que hace el comando `<`?

</div>
<div class="flashcard-back">

**R:** Redirige archivo a stdin

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-017">
<div class="flashcard-front">

**P:** Que es/son 1. Descriptores de archivo?

</div>
<div class="flashcard-back">

**R:** En Linux, cada proceso tiene tres flujos de datos estandar abiertos por defecto, identificados por **descriptores de archivo** (file descriptors):

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-018">
<div class="flashcard-front">

**P:** Que es/son 6. /dev/null: el agujero negro?

</div>
<div class="flashcard-back">

**R:** `/dev/null` es un archivo especial que **descarta todo lo que se escribe en el**. Leer de el produce inmediatamente un fin de archivo (EOF).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-019">
<div class="flashcard-front">

**P:** Que es/son 7. Pipes (tuberias): `|`?

</div>
<div class="flashcard-back">

**R:** El pipe `|` conecta la **salida estandar** de un comando con la **entrada estandar** del siguiente comando. Es uno de los conceptos mas poderosos de Unix.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-020">
<div class="flashcard-front">

**P:** Que es/son 8. tee: dividir la salida?

</div>
<div class="flashcard-back">

**R:** `tee` lee de stdin y escribe simultaneamente en **stdout** y en uno o mas **archivos**. Es como una "T" en una tuberia de agua que divide el flujo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-021">
<div class="flashcard-front">

**P:** Que es/son 9. xargs: construir comandos desde stdin?

</div>
<div class="flashcard-back">

**R:** `xargs` lee datos de la entrada estandar y los convierte en **argumentos** para otro comando. Es esencial cuando un comando no acepta datos por stdin pero necesita recibirlos de un pipe.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-022">
<div class="flashcard-front">

**P:** Que es/son 10. Here documents: `<< EOF`?

</div>
<div class="flashcard-back">

**R:** Un **here document** permite pasar un bloque de texto como entrada estandar a un comando, sin necesidad de un archivo externo. El texto se define entre un delimitador (tipicamente `EOF`, pero puede ser

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-023">
<div class="flashcard-front">

**P:** Que es/son 11. Here strings: `<<<`?

</div>
<div class="flashcard-back">

**R:** Un **here string** es una version simplificada del here document que pasa una **sola cadena** como entrada estandar a un comando.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-024">
<div class="flashcard-front">

**P:** Que es/son 12. Sustitucion de procesos: `<()` y `>()`?

</div>
<div class="flashcard-back">

**R:** La **sustitucion de procesos** (process substitution) es una funcionalidad avanzada de bash que permite usar la salida de un comando como si fuera un archivo, o enviar datos a un comando como si fuera

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-025">
<div class="flashcard-front">

**P:** Que es/son 13. Named pipes (FIFOs): mkfifo?

</div>
<div class="flashcard-back">

**R:** Una **named pipe** (tuberia con nombre) o **FIFO** (First In, First Out) es un archivo especial en el sistema de archivos que actua como un canal de comunicacion entre procesos. A diferencia de los pip

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.4">
</div>

<div class="flashcard" data-id="103.4-fc-026">
<div class="flashcard-front">

**P:** Que es/son 14. Resumen de redirecciones?

</div>
<div class="flashcard-back">

**R:** | Operador | Descripcion | Ejemplo |

</div>
</div>

---

