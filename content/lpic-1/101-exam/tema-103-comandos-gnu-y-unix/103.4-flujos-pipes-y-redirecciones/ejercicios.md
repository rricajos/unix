---
title: "103.4 - Flujos, pipes y redirecciones: Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.4"
---

# 103.4 - Flujos, pipes y redirecciones: Ejercicios

### Pregunta 1
Un administrador quiere ejecutar un comando y guardar tanto la salida estandar como los errores en el mismo archivo `log.txt`. Cuales de las siguientes opciones son correctas? (Seleccione DOS)

A) `comando > log.txt 2>&1`
B) `comando 2>&1 > log.txt`
C) `comando &> log.txt`
D) `comando > log.txt > log.txt`

<details>
<summary>Respuesta</summary>

**A) `comando > log.txt 2>&1` y C) `comando &> log.txt`**

La opcion A primero redirige stdout al archivo `log.txt`, y luego `2>&1` redirige stderr a donde apunte stdout (que ya es log.txt). La opcion C usa `&>` que es un atajo de bash para redirigir ambos flujos al mismo archivo. La opcion B es incorrecta porque `2>&1` se evalua primero (stderr va a donde stdout apunta en ese momento, que es la pantalla), y luego `> log.txt` solo redirige stdout al archivo; stderr sigue yendo a la pantalla. La opcion D no es valida para combinar ambos flujos.
</details>

---

### Pregunta 2
Que hace el siguiente comando?
```bash
find /var/log -name "*.log" -mtime +30 | xargs rm
```

A) Lista todos los archivos .log de /var/log modificados en los ultimos 30 dias
B) Elimina todos los archivos .log de /var/log modificados hace mas de 30 dias
C) Comprime los archivos .log de /var/log mayores de 30 MB
D) Mueve los archivos .log antiguos a la papelera

<details>
<summary>Respuesta</summary>

**B) Elimina todos los archivos .log de /var/log modificados hace mas de 30 dias**

`find /var/log -name "*.log" -mtime +30` busca todos los archivos que terminan en `.log` dentro de `/var/log` que fueron modificados hace mas de 30 dias. El operador `|` pasa esta lista de archivos a `xargs`, que convierte cada linea de la entrada estandar en argumentos para el comando `rm`. El resultado es que `rm` elimina cada uno de los archivos encontrados. Si los nombres de archivo pudieran contener espacios, seria mas seguro usar `find ... -print0 | xargs -0 rm`.
</details>

---

### Pregunta 3
Cual de los siguientes comandos muestra la salida del comando `ls -l` en la pantalla Y al mismo tiempo la guarda en el archivo `listado.txt`?

A) `ls -l > listado.txt`
B) `ls -l >> listado.txt`
C) `ls -l | tee listado.txt`
D) `ls -l | cat > listado.txt`

<details>
<summary>Respuesta</summary>

**C) `ls -l | tee listado.txt`**

`tee` lee de la entrada estandar y escribe simultaneamente en la salida estandar (pantalla) y en el archivo especificado. Es la unica forma de dividir el flujo de datos para que vaya a dos destinos al mismo tiempo. La opcion A redirige toda la salida al archivo (no muestra nada en pantalla). La opcion B anade al archivo pero tampoco muestra en pantalla. La opcion D tambien redirige todo al archivo sin mostrar en pantalla. Si se quisiera anadir al archivo en vez de sobreescribir, se usaria `tee -a`.
</details>

---

### Pregunta 4
Que son los descriptores de archivo 0, 1 y 2 en Linux?

A) 0=stdout, 1=stdin, 2=stderr
B) 0=stdin, 1=stderr, 2=stdout
C) 0=stdin, 1=stdout, 2=stderr
D) 0=stderr, 1=stdin, 2=stdout

<details>
<summary>Respuesta</summary>

**C) 0=stdin, 1=stdout, 2=stderr**

Los tres descriptores de archivo estandar en Linux son: **0** para la entrada estandar (stdin, por defecto el teclado), **1** para la salida estandar (stdout, por defecto la pantalla) y **2** para la salida de error estandar (stderr, por defecto tambien la pantalla). Estos numeros son fundamentales para las redirecciones: `>` equivale a `1>`, `<` equivale a `0<`, y `2>` redirige especificamente los errores. Todo proceso en Linux hereda estos tres descriptores al ser creado.
</details>

---

### Pregunta 5
Un script genera mucha salida que no interesa y tambien mensajes de error que tampoco se quieren ver. Cual es la forma correcta de descartar TODA la salida?

A) `script.sh > /dev/zero`
B) `script.sh &> /dev/null`
C) `script.sh > /dev/null`
D) `script.sh 2> /dev/null`

<details>
<summary>Respuesta</summary>

**B) `script.sh &> /dev/null`**

`&>` redirige tanto stdout como stderr al mismo destino. `/dev/null` es un archivo especial que descarta todo lo que se escribe en el. Otra forma equivalente seria `script.sh > /dev/null 2>&1`. La opcion A usa `/dev/zero` que es un dispositivo que genera ceros al leer de el, no es un sumidero para descartar datos (aunque escribir en el no causa error, no es idiomatico). La opcion C solo descarta stdout, los errores seguirian apareciendo en pantalla. La opcion D solo descarta stderr, la salida normal seguiria en pantalla.
</details>

---

### Pregunta 6
Que hace el operador `<<` en el siguiente ejemplo?
```bash
cat << FIN
Hola $USER
Fecha: $(date)
FIN
```

A) Lee el archivo llamado "FIN" y muestra su contenido
B) Crea un here document que pasa el bloque de texto como stdin a cat, con expansion de variables
C) Escribe "FIN" en la salida estandar
D) Redirige la salida de cat al archivo FIN

<details>
<summary>Respuesta</summary>

**B) Crea un here document que pasa el bloque de texto como stdin a cat, con expansion de variables**

El operador `<<` seguido de un delimitador (en este caso `FIN`) crea un "here document". Todo el texto entre `<< FIN` y la linea que contiene solo `FIN` se pasa como entrada estandar al comando `cat`. Dentro del here document, las variables como `$USER` y las sustituciones de comandos como `$(date)` se expanden con sus valores reales. Si se quisiera evitar la expansion, se usarian comillas en el delimitador: `<< 'FIN'`. El delimitador de cierre debe estar solo en su propia linea, sin espacios antes ni despues.
</details>

---

### Pregunta 7
Un administrador quiere encontrar todos los archivos `.conf` en `/etc` y copiarlos a `/backup/configs/`. Los nombres de algunos archivos contienen espacios. Cual de los siguientes comandos es el mas seguro?

A) `find /etc -name "*.conf" | xargs cp /backup/configs/`
B) `find /etc -name "*.conf" -print0 | xargs -0 cp -t /backup/configs/`
C) `find /etc -name "*.conf" | cp /backup/configs/`
D) `find /etc -name "*.conf" > xargs cp /backup/configs/`

<details>
<summary>Respuesta</summary>

**B) `find /etc -name "*.conf" -print0 | xargs -0 cp -t /backup/configs/`**

Cuando los nombres de archivo pueden contener espacios u otros caracteres especiales, es fundamental usar `-print0` en `find` (que separa los resultados con el caracter null `\0` en vez de saltos de linea) y `-0` en `xargs` (que usa null como delimitador de entrada). La opcion `-t` de `cp` especifica el directorio destino, permitiendo que los nombres de archivo vayan como argumentos finales. La opcion A fallaria con nombres que contienen espacios porque xargs los interpretaria como argumentos separados. La opcion C no funcionaria porque `cp` no lee de stdin. La opcion D redirige la salida de find a un archivo llamado "xargs", no ejecuta xargs.
</details>

---

### Pregunta 8
Cual es la funcion del comando `mkfifo` y como se diferencia de un pipe normal?

A) `mkfifo` crea un archivo temporal que se borra al cerrarse
B) `mkfifo` crea un pipe con nombre (FIFO) que persiste en el sistema de archivos y puede ser usado por procesos no relacionados
C) `mkfifo` crea un pipe que solo puede ser usado por el usuario root
D) `mkfifo` es un alias de `|` para usar en scripts

<details>
<summary>Respuesta</summary>

**B) `mkfifo` crea un pipe con nombre (FIFO) que persiste en el sistema de archivos y puede ser usado por procesos no relacionados**

`mkfifo` crea una named pipe (FIFO - First In, First Out) que aparece como un archivo especial en el sistema de archivos (identificado con `p` en `ls -l`). A diferencia del pipe normal (`|`) que solo conecta dos comandos en la misma linea y es temporal, una named pipe persiste hasta que se elimine con `rm`, y puede ser utilizada por procesos completamente independientes (incluso en distintas sesiones de terminal). Un proceso puede escribir en la pipe (`echo "datos" > mi_pipe`) y otro puede leer de ella (`cat < mi_pipe`). La operacion es bloqueante: el escritor espera a que alguien lea, y viceversa.
</details>
