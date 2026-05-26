# 103.4 - Flujos, pipes y redirecciones: Teoria

## 1. Descriptores de archivo

En Linux, cada proceso tiene tres flujos de datos estandar abiertos por defecto, identificados por **descriptores de archivo** (file descriptors):

| Descriptor | Nombre | Abreviatura | Descripcion | Dispositivo por defecto |
|:----------:|--------|-------------|-------------|------------------------|
| **0** | Entrada estandar | stdin | Datos que entran al proceso | Teclado |
| **1** | Salida estandar | stdout | Datos que salen del proceso (resultado) | Pantalla (terminal) |
| **2** | Error estandar | stderr | Mensajes de error del proceso | Pantalla (terminal) |

### Concepto fundamental
Todo en Linux es un archivo. Los descriptores de archivo son numeros enteros que el kernel asigna a cada flujo abierto. Los tres primeros (0, 1, 2) se abren automaticamente para cada proceso. Los procesos pueden abrir descriptores adicionales (3, 4, 5...) para archivos, sockets, etc.

```
                    +------------------+
  stdin (0)  --->   |                  |  ---> stdout (1)  --> Pantalla
  [Teclado]         |     Proceso      |
                    |                  |  ---> stderr (2)  --> Pantalla
                    +------------------+
```

> **IMPORTANTE para el examen**: stdout (1) y stderr (2) van ambos a la pantalla por defecto, pero son flujos **separados** que se pueden redirigir de forma independiente.

---

## 2. Redireccion de salida estandar (stdout)

### Redirigir a archivo (sobreescribir): `>`
El operador `>` redirige stdout a un archivo. Si el archivo existe, lo **sobreescribe**.

```bash
ls /etc > listado.txt                # Guarda la salida de ls en listado.txt
echo "Hola mundo" > saludo.txt       # Crea/sobreescribe saludo.txt
date > fecha.txt                     # Guarda la fecha actual en fecha.txt
```

Equivalencia:
```bash
ls > archivo.txt      # Forma abreviada
ls 1> archivo.txt     # Forma explicita (descriptor 1)
```

### Redirigir a archivo (anadir): `>>`
El operador `>>` redirige stdout a un archivo **sin sobreescribirlo** (append/anadir al final):

```bash
echo "Primera linea" > log.txt       # Crea el archivo
echo "Segunda linea" >> log.txt      # Anade al final
echo "Tercera linea" >> log.txt      # Anade otra linea
date >> registro.txt                 # Anade la fecha al final del registro
```

### Proteccion contra sobreescritura: noclobber
```bash
set -o noclobber       # Activa proteccion: > no sobreescribe archivos existentes
ls > archivo.txt       # Error si archivo.txt ya existe
ls >| archivo.txt      # Fuerza la sobreescritura aunque noclobber este activo
set +o noclobber       # Desactiva la proteccion
```

---

## 3. Redireccion de entrada estandar (stdin)

### Redirigir desde archivo: `<`
El operador `<` usa un archivo como entrada estandar en lugar del teclado:

```bash
sort < nombres.txt                   # sort lee del archivo en vez del teclado
wc -l < /etc/passwd                  # Cuenta lineas de /etc/passwd
tr 'a-z' 'A-Z' < archivo.txt        # tr convierte a mayusculas leyendo del archivo
mail usuario@dominio.com < mensaje.txt  # Envia el archivo como cuerpo del correo
```

### Diferencia entre `<` y argumento de archivo
```bash
# Ambos producen la misma salida, pero funcionan diferente:
sort < nombres.txt      # El SHELL abre el archivo y se lo pasa a sort como stdin
sort nombres.txt        # sort MISMO abre el archivo
```

La diferencia practica: con `<`, el comando no sabe el nombre del archivo (solo recibe datos por stdin). Con argumento, el comando abre el archivo directamente.

---

## 4. Redireccion de error estandar (stderr)

### Redirigir errores a archivo: `2>`
```bash
ls /directorio_inexistente 2> errores.txt    # Redirige errores a un archivo
find / -name "*.conf" 2> /dev/null           # Descarta los errores
```

### Anadir errores a archivo: `2>>`
```bash
ls /no_existe 2>> log_errores.txt            # Anade errores al archivo
script.sh 2>> errores.log                    # Acumula errores de ejecucion
```

### Ejemplo completo: separar stdout y stderr
```bash
find / -name "*.conf" > resultados.txt 2> errores.txt
# stdout va a resultados.txt
# stderr va a errores.txt
```

---

## 5. Combinar stdout y stderr

### Redirigir ambos al mismo archivo: `&>`
```bash
ls /etc /no_existe &> todo.txt               # stdout Y stderr a todo.txt
comando &> /dev/null                         # Descarta TODA la salida (stdout + stderr)
```

### Redirigir stderr a stdout: `2>&1`
```bash
ls /etc /no_existe > todo.txt 2>&1           # Redirige stderr al mismo destino que stdout
comando > salida.txt 2>&1                    # Equivalente a &>
```

> **IMPORTANTE para el examen**: El orden importa. `2>&1` redirige stderr a donde stdout apunte **en ese momento**:
> ```bash
> # CORRECTO: primero redirige stdout, luego stderr sigue a stdout
> comando > archivo.txt 2>&1
>
> # INCORRECTO: 2>&1 redirige stderr a stdout (pantalla), luego stdout va al archivo
> comando 2>&1 > archivo.txt    # stderr sigue yendo a la pantalla!
> ```

### Anadir ambos: `&>>`
```bash
comando &>> log_completo.txt                 # Anade stdout Y stderr al archivo
# Equivalente a:
comando >> log_completo.txt 2>&1
```

---

## 6. /dev/null: el agujero negro

`/dev/null` es un archivo especial que **descarta todo lo que se escribe en el**. Leer de el produce inmediatamente un fin de archivo (EOF).

```bash
# Descartar salida estandar
ls > /dev/null                               # Descarta la salida normal

# Descartar errores
find / -name "*.txt" 2> /dev/null            # Descarta errores de permisos

# Descartar TODA la salida
comando &> /dev/null                         # Descarta stdout y stderr
comando > /dev/null 2>&1                     # Equivalente

# Vaciar un archivo
cat /dev/null > archivo.txt                  # Vacia el contenido del archivo
> archivo.txt                                # Forma mas corta de vaciar un archivo
```

> **Para el examen**: `/dev/null` es la forma estandar de descartar salida no deseada. Es un "sumidero" (sink) que acepta cualquier cantidad de datos y los descarta.

---

## 7. Pipes (tuberias): `|`

El pipe `|` conecta la **salida estandar** de un comando con la **entrada estandar** del siguiente comando. Es uno de los conceptos mas poderosos de Unix.

```bash
ls -l /etc | head -10                        # Muestra solo las 10 primeras lineas
cat /etc/passwd | sort                       # Ordena las lineas de passwd
ps aux | grep apache                         # Busca procesos de apache
dmesg | tail -20                             # Ultimos 20 mensajes del kernel
history | grep "git"                         # Busca comandos git en el historial
```

### Encadenar multiples pipes
```bash
cat /etc/passwd | cut -d ":" -f 1 | sort | head -5
# 1. Lee /etc/passwd
# 2. Extrae el primer campo (usuarios)
# 3. Ordena alfabeticamente
# 4. Muestra los 5 primeros

du -sh /var/log/* | sort -h | tail -10
# Muestra los 10 archivos mas grandes de /var/log

cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
# Top 10 IPs con mas accesos en un log de Apache
```

### Pipe solo redirige stdout
El pipe solo pasa **stdout** al siguiente comando. **stderr sigue yendo a la pantalla**:

```bash
ls /etc /no_existe | wc -l
# stderr (error de /no_existe) va a la pantalla
# stdout (listado de /etc) va a wc -l

# Para incluir stderr en el pipe:
ls /etc /no_existe 2>&1 | wc -l
# Ahora stderr tambien pasa por el pipe

# En bash 4+, existe el operador |&
ls /etc /no_existe |& wc -l                 # Pasa stdout Y stderr al pipe
```

---

## 8. tee: dividir la salida

`tee` lee de stdin y escribe simultaneamente en **stdout** y en uno o mas **archivos**. Es como una "T" en una tuberia de agua que divide el flujo.

```bash
ls -l | tee listado.txt                      # Muestra en pantalla Y guarda en archivo
ls -l | tee listado.txt | wc -l              # Guarda, muestra el conteo en pantalla
ls -l | tee -a listado.txt                   # Anade al archivo en vez de sobreescribir
ls -l | tee archivo1.txt archivo2.txt        # Escribe en multiples archivos
```

### Diagrama de flujo con tee
```
                     +-------> archivo.txt
                     |
comando --> tee -----+
                     |
                     +-------> stdout (pantalla o siguiente pipe)
```

### Uso practico: guardar salida intermedia en un pipeline
```bash
cat /etc/passwd | cut -d ":" -f 1 | tee usuarios.txt | sort | tee usuarios_ordenados.txt | wc -l
# Guarda la lista sin ordenar, luego la ordenada, y muestra el conteo
```

### Uso con sudo
```bash
# Esto NO funciona (la redireccion la hace el shell del usuario, no root):
sudo echo "linea" > /etc/archivo_protegido

# Esto SI funciona (tee se ejecuta como root):
echo "linea" | sudo tee /etc/archivo_protegido
echo "linea" | sudo tee -a /etc/archivo_protegido   # Anadir
```

---

## 9. xargs: construir comandos desde stdin

`xargs` lee datos de la entrada estandar y los convierte en **argumentos** para otro comando. Es esencial cuando un comando no acepta datos por stdin pero necesita recibirlos de un pipe.

### Uso basico
```bash
# Sin xargs: echo solo muestra texto
find /tmp -name "*.log" | echo           # No funciona como se espera

# Con xargs: convierte stdin en argumentos
find /tmp -name "*.log" | xargs rm       # Elimina todos los .log encontrados
find /tmp -name "*.log" | xargs ls -l    # Lista detalles de los .log
```

### Opciones importantes
```bash
# -I {}: Define un placeholder para colocar el argumento
find . -name "*.txt" | xargs -I {} cp {} /backup/
# Equivalente a: cp archivo1.txt /backup/ ; cp archivo2.txt /backup/ ; ...

# -n N: Pasa N argumentos por invocacion
echo "a b c d e f" | xargs -n 2 echo
# echo a b
# echo c d
# echo e f

# -d delimitador: Define el delimitador de entrada
echo "a:b:c" | xargs -d ":" echo        # echo a b c

# -0: Usa null como delimitador (para nombres con espacios)
find . -name "*.txt" -print0 | xargs -0 rm
# -print0 en find y -0 en xargs usan \0 como delimitador

# -p: Modo interactivo (pide confirmacion)
find . -name "*.tmp" | xargs -p rm       # Pregunta antes de ejecutar

# -t: Muestra el comando antes de ejecutarlo
find . -name "*.log" | xargs -t gzip     # Muestra y ejecuta
```

### Diferencia entre pipe y xargs
```bash
# Con pipe: wc recibe datos por stdin
cat archivo.txt | wc -l       # wc lee de stdin

# Con xargs: wc recibe el nombre del archivo como argumento
echo "archivo.txt" | xargs wc -l   # Ejecuta: wc -l archivo.txt
```

> **Para el examen**: `xargs` es necesario cuando el comando destino espera **argumentos** (no stdin). Por ejemplo, `rm`, `cp`, `mv`, `chmod` necesitan nombres de archivo como argumentos, no datos por stdin.

---

## 10. Here documents: `<< EOF`

Un **here document** permite pasar un bloque de texto como entrada estandar a un comando, sin necesidad de un archivo externo. El texto se define entre un delimitador (tipicamente `EOF`, pero puede ser cualquier cadena).

```bash
cat << EOF
Esta es la primera linea.
Esta es la segunda linea.
La variable HOME es $HOME
EOF
```

### Caracteristicas
- Las variables (`$HOME`, `$USER`) se **expanden** por defecto
- Para evitar la expansion, usar comillas en el delimitador: `<< 'EOF'`

```bash
# CON expansion de variables
cat << EOF
Usuario: $USER
Directorio: $HOME
EOF

# SIN expansion de variables (comillas en el delimitador)
cat << 'EOF'
Usuario: $USER
Directorio: $HOME
EOF
# Salida literal: $USER y $HOME no se expanden
```

### Uso con tabulacion: `<<-`
El operador `<<-` permite usar tabulaciones al inicio de las lineas del here document (las elimina). Util para mantener la indentacion en scripts:

```bash
if true; then
    cat <<-EOF
    Esta linea esta indentada con tab
    Pero se mostrara sin la indentacion
    EOF
fi
```

### Uso practico
```bash
# Crear un archivo con contenido
cat << EOF > /tmp/config.conf
# Archivo de configuracion
servidor=192.168.1.1
puerto=8080
EOF

# Enviar comandos a un programa interactivo
mysql -u root << EOF
CREATE DATABASE prueba;
USE prueba;
CREATE TABLE users (id INT, name VARCHAR(50));
EOF

# Script con multiples lineas
ssh usuario@servidor << EOF
cd /var/log
ls -la
tail -5 syslog
EOF
```

---

## 11. Here strings: `<<<`

Un **here string** es una version simplificada del here document que pasa una **sola cadena** como entrada estandar a un comando.

```bash
cat <<< "Hola Mundo"                         # Pasa "Hola Mundo" como stdin a cat
wc -w <<< "uno dos tres cuatro"              # Cuenta palabras: 4
tr 'a-z' 'A-Z' <<< "hola mundo"             # Convierte a mayusculas: HOLA MUNDO
bc <<< "5 + 3"                               # Calcula: 8
grep "error" <<< "este es un mensaje de error"  # Busca en la cadena
```

### Diferencia con echo + pipe
```bash
# Equivalentes:
echo "Hola Mundo" | cat
cat <<< "Hola Mundo"

# Pero here string es mas eficiente (no crea subproceso para echo)
```

### Expansion de variables
```bash
read nombre <<< "Sandra"
echo $nombre                                  # Sandra

# Las variables se expanden en here strings
cat <<< "Mi directorio es $HOME"
# Mi directorio es /home/sandra
```

---

## 12. Named pipes (FIFOs): mkfifo

Una **named pipe** (tuberia con nombre) o **FIFO** (First In, First Out) es un archivo especial en el sistema de archivos que actua como un canal de comunicacion entre procesos. A diferencia de los pipes normales (`|`), las named pipes **persisten en el sistema de archivos** y pueden ser usadas por procesos no relacionados.

### Crear una named pipe
```bash
mkfifo mi_pipe                               # Crea una named pipe llamada mi_pipe
mkfifo -m 644 mi_pipe                        # Crea con permisos especificos
ls -l mi_pipe                                # Muestra "prw-r--r--" (p = pipe)
```

### Usar una named pipe
Las named pipes se usan con dos procesos: uno escribe y otro lee. **El proceso escritor se bloquea hasta que alguien lea**, y viceversa.

```bash
# Terminal 1 (escritor): se bloquea hasta que alguien lea
echo "Hola desde otro proceso" > mi_pipe

# Terminal 2 (lector): lee lo que el escritor envio
cat < mi_pipe                                # Muestra: Hola desde otro proceso
```

### Ejemplo practico
```bash
# Crear la named pipe
mkfifo /tmp/datos_pipe

# Terminal 1: un proceso genera datos continuamente
tail -f /var/log/syslog > /tmp/datos_pipe

# Terminal 2: otro proceso los consume
grep "error" < /tmp/datos_pipe

# Limpiar
rm /tmp/datos_pipe
```

### Caracteristicas de las named pipes
- Aparecen en el sistema de archivos con tipo `p` (visible con `ls -l`)
- Son FIFO: los datos se leen en el mismo orden en que se escribieron
- Se bloquean: un extremo espera al otro
- No almacenan datos en disco (el kernel los mantiene en memoria)
- Se eliminan con `rm` como cualquier archivo
- Pueden ser usadas por procesos que no tienen relacion entre si

### Diferencia entre pipe normal y named pipe
| Caracteristica | Pipe normal (`\|`) | Named pipe (FIFO) |
|---------------|-------------------|-------------------|
| Persistencia | Solo durante la ejecucion | Persiste en el sistema de archivos |
| Visibilidad | Solo entre comandos del pipeline | Cualquier proceso puede usarla |
| Creacion | Automatica con `\|` | Manual con `mkfifo` |
| Eliminacion | Automatica al terminar | Manual con `rm` |
| Relacion entre procesos | Misma linea de comandos | Pueden ser procesos independientes |

---

## 13. Resumen de redirecciones

| Operador | Descripcion | Ejemplo |
|----------|-------------|---------|
| `>` | Redirige stdout a archivo (sobreescribe) | `ls > lista.txt` |
| `>>` | Redirige stdout a archivo (anade) | `echo "linea" >> log.txt` |
| `<` | Redirige archivo a stdin | `sort < datos.txt` |
| `2>` | Redirige stderr a archivo (sobreescribe) | `cmd 2> errores.txt` |
| `2>>` | Redirige stderr a archivo (anade) | `cmd 2>> errores.txt` |
| `&>` | Redirige stdout+stderr a archivo | `cmd &> todo.txt` |
| `&>>` | Anade stdout+stderr a archivo | `cmd &>> todo.txt` |
| `2>&1` | Redirige stderr a donde apunte stdout | `cmd > f.txt 2>&1` |
| `1>&2` | Redirige stdout a donde apunte stderr | `echo "error" 1>&2` |
| `\|` | Pipe: stdout del cmd1 a stdin del cmd2 | `ls \| grep txt` |
| `\|&` | Pipe: stdout+stderr al siguiente cmd | `cmd \|& grep error` |
| `<< DELIM` | Here document | `cat << EOF ... EOF` |
| `<<< "cadena"` | Here string | `cat <<< "texto"` |
| `> /dev/null` | Descarta stdout | `cmd > /dev/null` |
| `2> /dev/null` | Descarta stderr | `cmd 2> /dev/null` |
| `&> /dev/null` | Descarta todo | `cmd &> /dev/null` |
