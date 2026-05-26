# 103.1 - Trabajar en la linea de comandos: Teoria

## 1. Shells en Linux

### Que es un shell
El **shell** es un programa que actua como intermediario entre el usuario y el kernel de Linux. Interpreta los comandos que el usuario escribe y los traduce en instrucciones que el sistema operativo puede ejecutar.

### Bash como shell por defecto
**Bash** (Bourne Again Shell) es el shell por defecto en la mayoria de distribuciones Linux. Es una mejora del shell Bourne original (`sh`) y ofrece:
- Autocompletado con `Tab`
- Historial de comandos
- Alias
- Expansion de llaves y globbing
- Scripting avanzado

Para saber que shell estamos usando:
```bash
echo $SHELL        # Muestra el shell de login
echo $0            # Muestra el shell actual
cat /etc/shells    # Lista todos los shells disponibles
```

### Otros shells comunes
| Shell | Descripcion |
|-------|-------------|
| `sh` | Bourne Shell, el shell original de Unix. Mas limitado que bash |
| `zsh` | Z Shell, muy popular, con autocompletado avanzado y temas |
| `csh` | C Shell, con sintaxis similar al lenguaje C |
| `tcsh` | Version mejorada de csh |
| `ksh` | Korn Shell, combina caracteristicas de sh y csh |
| `dash` | Debian Almquist Shell, ligero y rapido, usado para scripts del sistema |

Para cambiar de shell temporalmente basta con escribir su nombre (ej: `zsh`). Para cambiar el shell de login permanente:
```bash
chsh -s /bin/zsh
```

---

## 2. Tipos de comandos: internos vs externos

### Comandos internos (builtins)
Son comandos integrados directamente en el shell. **No existen como archivos ejecutables** en el sistema de archivos. Se ejecutan directamente por el proceso del shell sin crear un proceso hijo.

Ejemplos de builtins de bash:
- `cd`, `echo`, `pwd`, `export`, `alias`, `history`, `type`, `set`, `unset`, `source`, `exec`, `exit`, `read`, `test`, `kill`, `jobs`, `bg`, `fg`

### Comandos externos
Son programas almacenados como archivos ejecutables en el sistema de archivos. Cuando se ejecutan, el shell crea un nuevo proceso hijo.

Ejemplos: `ls`, `cp`, `mv`, `grep`, `find`, `cat`

### Identificar el tipo de comando

#### `type`
El comando mas importante para el examen. Muestra el tipo de un comando:
```bash
type cd          # cd is a shell builtin
type ls          # ls is aliased to 'ls --color=auto'
type grep        # grep is /usr/bin/grep
type -a echo     # Muestra TODAS las ubicaciones (builtin Y externo)
type -t cd       # Muestra solo el tipo: builtin, alias, file, function, keyword
```

Tipos posibles con `type -t`:
- `builtin` - Comando interno del shell
- `alias` - Un alias definido
- `file` - Comando externo (archivo ejecutable)
- `function` - Una funcion del shell
- `keyword` - Palabra reservada del shell (if, while, for...)

#### `which`
Muestra la ruta del ejecutable externo. **Solo busca en PATH**, no conoce builtins ni alias:
```bash
which ls         # /usr/bin/ls
which cd         # No muestra nada o muestra error (es builtin)
which -a python  # Muestra TODAS las coincidencias en PATH
```

#### `whereis`
Busca el binario, las paginas de manual y el codigo fuente de un comando:
```bash
whereis ls       # ls: /usr/bin/ls /usr/share/man/man1/ls.1.gz
whereis -b ls    # Solo binario
whereis -m ls    # Solo manual
```

> **IMPORTANTE para el examen**: `type` es un builtin de bash y reconoce builtins, alias y funciones. `which` es un comando externo que solo busca ejecutables en PATH.

---

## 3. Variables de entorno

### Conceptos fundamentales
Las variables del shell almacenan informacion que puede ser utilizada por el shell y los programas. Existen dos tipos:
- **Variables locales**: Solo disponibles en el shell actual
- **Variables de entorno (exportadas)**: Disponibles para el shell actual y todos los procesos hijos

### Variables de entorno importantes

| Variable | Descripcion |
|----------|-------------|
| `PATH` | Lista de directorios donde el shell busca comandos ejecutables, separados por `:` |
| `HOME` | Directorio personal del usuario (`~`) |
| `USER` | Nombre del usuario actual |
| `LOGNAME` | Nombre del usuario de login |
| `SHELL` | Shell de login del usuario |
| `PS1` | Prompt principal (el que se ve normalmente) |
| `PS2` | Prompt secundario (se muestra en lineas de continuacion, por defecto `>`) |
| `LANG` | Configuracion regional/idioma del sistema |
| `TERM` | Tipo de terminal |
| `PWD` | Directorio de trabajo actual |
| `OLDPWD` | Directorio de trabajo anterior (usado por `cd -`) |
| `HOSTNAME` | Nombre del equipo |
| `HISTSIZE` | Numero maximo de comandos en la memoria del historial |
| `HISTFILESIZE` | Numero maximo de lineas en el archivo de historial |
| `HISTFILE` | Ruta del archivo de historial (por defecto `~/.bash_history`) |

### Definir y usar variables
```bash
# Definir variable local (sin espacios alrededor del =)
MI_VARIABLE="Hola Mundo"

# Acceder al valor
echo $MI_VARIABLE
echo ${MI_VARIABLE}    # Con llaves (recomendado en contextos ambiguos)

# Variable de entorno (disponible para procesos hijos)
export MI_VARIABLE="Hola Mundo"
# O en dos pasos:
MI_VARIABLE="Hola Mundo"
export MI_VARIABLE
```

> **IMPORTANTE**: No debe haber espacios alrededor del `=` al asignar variables. `VAR = valor` da error.

### Comandos para gestionar variables

#### `export`
Convierte una variable local en variable de entorno:
```bash
export EDITOR=vim        # Definir y exportar en un paso
export -n MI_VARIABLE    # Quitar la propiedad de exportacion
export -p                # Listar todas las variables exportadas
```

#### `env`
Muestra las variables de entorno o ejecuta un comando en un entorno modificado:
```bash
env                          # Lista todas las variables de entorno
env -i bash                  # Inicia un shell con entorno limpio
env VAR1=valor1 comando      # Ejecuta comando con variable temporal
```

#### `set`
Muestra todas las variables (locales y de entorno) y funciones del shell. Tambien configura opciones del shell:
```bash
set                          # Lista TODAS las variables y funciones
set -o noclobber             # Activar opcion (evita sobreescribir con >)
set +o noclobber             # Desactivar opcion
set -x                       # Activa modo debug (muestra comandos antes de ejecutarlos)
```

> **Diferencia clave**: `env` muestra solo variables de entorno. `set` muestra todas las variables (locales + entorno) y funciones.

#### `unset`
Elimina una variable o funcion:
```bash
unset MI_VARIABLE            # Elimina la variable
unset -f mi_funcion          # Elimina una funcion
```

### Modificar PATH
```bash
# Agregar directorio al final de PATH
export PATH=$PATH:/nuevo/directorio

# Agregar directorio al inicio de PATH (prioridad mas alta)
export PATH=/nuevo/directorio:$PATH
```

---

## 4. Historial de comandos

### El comando `history`
Bash mantiene un historial de todos los comandos ejecutados, tanto en memoria (sesion actual) como en un archivo.

```bash
history           # Muestra todo el historial
history 10        # Muestra los ultimos 10 comandos
history -c        # Limpia el historial en memoria
history -w        # Escribe el historial en memoria al archivo
history -r        # Lee el archivo de historial a la memoria
history -d 42     # Elimina la entrada numero 42
```

### Archivo de historial
- **`~/.bash_history`**: Archivo donde se almacena el historial entre sesiones
- El historial se guarda al cerrar la sesion (o con `history -w`)

### Variables de historial
| Variable | Descripcion |
|----------|-------------|
| `HISTSIZE` | Numero maximo de comandos en memoria (sesion actual) |
| `HISTFILESIZE` | Numero maximo de lineas en `~/.bash_history` |
| `HISTFILE` | Ruta del archivo de historial |
| `HISTCONTROL` | Controla que se guarda: `ignoredups`, `ignorespace`, `ignoreboth`, `erasedups` |

### Atajos de historial
| Atajo | Descripcion |
|-------|-------------|
| `!!` | Repite el ultimo comando completo |
| `!n` | Ejecuta el comando numero `n` del historial |
| `!-n` | Ejecuta el comando `n` posiciones atras |
| `!cadena` | Ejecuta el ultimo comando que empieza por `cadena` |
| `!?cadena` | Ejecuta el ultimo comando que contiene `cadena` |
| `^antiguo^nuevo` | Repite el ultimo comando reemplazando `antiguo` por `nuevo` |
| `Ctrl+R` | Busqueda inversa interactiva en el historial |

Ejemplo practico:
```bash
sudo !!            # Repite el ultimo comando con sudo
!grep              # Ejecuta el ultimo comando que empezaba por "grep"
```

---

## 5. Comillas y escape

### Comillas simples (`' '`)
**Eliminan el significado especial de TODOS los caracteres** dentro de ellas. No hay expansion de variables ni interpretacion de caracteres especiales:
```bash
echo 'El valor de $HOME es $HOME'
# Salida: El valor de $HOME es $HOME
```

### Comillas dobles (`" "`)
Permiten la **expansion de variables** (`$`) y la **sustitucion de comandos** (`` ` ` `` y `$()`), pero protegen espacios y la mayoria de caracteres especiales:
```bash
echo "Mi directorio es $HOME"
# Salida: Mi directorio es /home/usuario

echo "Hoy es $(date)"
# Salida: Hoy es mar may 26 10:00:00 CEST 2026
```

Dentro de comillas dobles, los siguientes caracteres conservan su significado especial: `$`, `` ` ``, `\`, `!`, `"`

### Backticks (`` ` ` ``)
Realizan **sustitucion de comandos** (ejecutan el comando y lo reemplazan por su salida). Equivalente moderno: `$()`:
```bash
echo "Estamos en `pwd`"
echo "Estamos en $(pwd)"      # Forma moderna y preferida
```

> **IMPORTANTE**: Se prefiere `$()` sobre backticks porque se pueden anidar facilmente: `echo $(echo $(date))`

### Reglas detalladas de quoting

| Tipo de comillas | Variables `$var` | Sustitucion de comandos | Caracteres especiales | Ejemplo |
|------------------|:-:|:-:|:-:|---------|
| Sin comillas | Si se expanden | Si | Si se interpretan | `echo $HOME` -> `/home/sandra` |
| Comillas simples `' '` | No | No | No (todo literal) | `echo '$HOME'` -> `$HOME` |
| Comillas dobles `" "` | Si se expanden | Si (`$()` y `` ` ` ``) | Solo `$`, `` ` ``, `\`, `!`, `"` | `echo "$HOME"` -> `/home/sandra` |
| Backticks `` ` ` `` | N/A | Si (forma antigua) | N/A | `` echo `date` `` |
| `$()` | N/A | Si (forma moderna) | N/A | `echo $(date)` |

```bash
# Comillas simples: TODO es literal, nada se interpreta
echo 'El valor es $HOME y $(date)'
# Salida: El valor es $HOME y $(date)

# Comillas dobles: se expanden variables y sustituciones de comandos
echo "El valor es $HOME y $(date)"
# Salida: El valor es /home/sandra y mar may 26 10:00:00 CEST 2026

# Backticks vs $(): ambos sustituyen comandos, pero $() es anidable
echo "Usuarios: $(wc -l < /etc/passwd)"
echo "Usuarios: `wc -l < /etc/passwd`"  # Equivalente pero menos legible

# Anidamiento solo funciona bien con $()
echo "Hoy es $(date -d "$(cat /tmp/fecha.txt)")"   # Correcto
# Con backticks el anidamiento requiere escapar: dificil y propenso a errores
```

### Caracter de escape (`\`)
La barra invertida elimina el significado especial del caracter que le sigue:
```bash
echo "El precio es \$100"     # Salida: El precio es $100
echo "Linea 1\nLinea 2"       # \n no se interpreta en echo sin -e
echo -e "Linea 1\nLinea 2"    # Ahora si se interpreta el salto de linea
```

---

## 6. Secuencias de comandos

### Punto y coma (`;`)
Ejecuta comandos secuencialmente, **independientemente del resultado** del comando anterior:
```bash
comando1 ; comando2 ; comando3
# comando2 se ejecuta aunque comando1 falle
```

### AND logico (`&&`)
El siguiente comando **solo se ejecuta si el anterior tuvo exito** (codigo de salida 0):
```bash
mkdir /tmp/test && cd /tmp/test
# Solo entra al directorio si se creo correctamente
```

### OR logico (`||`)
El siguiente comando **solo se ejecuta si el anterior fallo** (codigo de salida distinto de 0):
```bash
cd /directorio || echo "No se pudo acceder al directorio"
```

### Combinacion practica
```bash
make && make install || echo "Error en la compilacion"
```

### Codigo de salida
Cada comando devuelve un codigo de salida almacenado en `$?`:
- `0` = exito
- `1-255` = error (distintos codigos para distintos errores)

```bash
ls /tmp
echo $?    # 0 (exito)

ls /directorio_inexistente
echo $?    # 2 (error)
```

---

## 7. Paginas de manual (man)

### Uso basico
```bash
man ls            # Abre la pagina de manual de ls
man 5 passwd      # Abre la pagina de passwd en la seccion 5
man -k keyword    # Busca paginas que contengan "keyword" en su descripcion
man -f comando    # Muestra una linea de descripcion del comando
```

### Secciones del manual
| Seccion | Contenido |
|---------|-----------|
| 1 | Comandos de usuario |
| 2 | Llamadas al sistema (kernel) |
| 3 | Funciones de libreria (C) |
| 4 | Archivos especiales (dispositivos en /dev) |
| 5 | Formatos de archivos de configuracion |
| 6 | Juegos |
| 7 | Miscelanea (convenciones, protocolos) |
| 8 | Comandos de administracion del sistema (requieren root) |

> **Ejemplo clasico del examen**: `passwd` existe en seccion 1 (comando) y seccion 5 (formato del archivo /etc/passwd). `man passwd` abre la seccion 1, `man 5 passwd` abre la seccion 5.

### Navegacion dentro de man
| Tecla | Accion |
|-------|--------|
| `q` | Salir |
| `/patron` | Buscar hacia adelante |
| `?patron` | Buscar hacia atras |
| `n` | Siguiente resultado de busqueda |
| `N` | Resultado anterior |
| `Space` | Pagina siguiente |
| `b` | Pagina anterior |
| `g` | Ir al inicio |
| `G` | Ir al final |

### Comandos relacionados
```bash
apropos palabra   # Equivalente a man -k. Busca en las descripciones de man
whatis comando    # Equivalente a man -f. Muestra descripcion corta
manpath           # Muestra las rutas donde se buscan las paginas de man
```

> **Para el examen**: `apropos` = `man -k` (buscar). `whatis` = `man -f` (descripcion corta).

---

## 8. Paginas info

El sistema **info** proporciona documentacion mas detallada que man, organizada en nodos con hiperenlaces (estilo hipertexto).

```bash
info coreutils        # Informacion sobre las utilidades GNU core
info bash             # Manual completo de bash
```

### Navegacion en info
| Tecla | Accion |
|-------|--------|
| `Enter` | Seguir un enlace (marcado con `*`) |
| `n` | Siguiente nodo |
| `p` | Nodo anterior |
| `u` | Subir un nivel |
| `l` | Volver al ultimo nodo visitado |
| `q` | Salir |
| `s` / `/` | Buscar |

### El comando `help`

`help` es un comando **builtin de bash** que muestra informacion sobre los comandos internos del shell. Solo funciona con builtins, no con comandos externos.

```bash
help              # Lista todos los builtins disponibles
help cd           # Muestra ayuda sobre el builtin cd
help -s export    # Muestra solo la sintaxis (formato corto)
help -d set       # Muestra solo una descripcion breve
```

> **Para el examen**: `man` y `info` son para comandos externos. `help` es exclusivo para builtins de bash. Por ejemplo, `man cd` puede no existir, pero `help cd` siempre funciona en bash.

### Otra documentacion
- `/usr/share/doc/`: Directorio con documentacion adicional de paquetes
- Muchos comandos tienen la opcion `--help`: `ls --help`

---

## 9. Alias

Los alias permiten crear atajos para comandos largos o frecuentes.

```bash
# Crear alias
alias ll='ls -la'
alias rm='rm -i'          # Pedir confirmacion antes de borrar
alias grep='grep --color=auto'

# Listar todos los alias
alias

# Eliminar un alias
unalias ll

# Eliminar todos los alias
unalias -a
```

### Persistencia de alias
Los alias definidos en la linea de comandos se pierden al cerrar la sesion. Para hacerlos permanentes, se anaden a:
- `~/.bashrc` (para shells interactivos no-login)
- `~/.bash_profile` o `~/.profile` (para shells de login)

### Evadir un alias
Si `rm` esta aliasado a `rm -i`, se puede ejecutar el comando original de varias formas:
```bash
\rm archivo            # Barra invertida antes del comando
command rm archivo     # Usando command
/bin/rm archivo        # Ruta completa
```

---

## 10. Expansion de llaves

La expansion de llaves genera cadenas arbitrarias. **No depende de la existencia de archivos** (a diferencia del globbing).

```bash
echo {1..10}              # 1 2 3 4 5 6 7 8 9 10
echo {a..z}               # a b c d e f ... z
echo {A..Z}               # A B C D E F ... Z
echo {1..10..2}           # 1 3 5 7 9 (con incremento de 2)
echo {a,b,c}              # a b c
echo archivo{1,2,3}.txt   # archivo1.txt archivo2.txt archivo3.txt
echo {01..12}             # 01 02 03 ... 12 (con ceros a la izquierda)

# Uso practico: crear multiples directorios
mkdir -p proyecto/{src,bin,doc,test}

# Combinaciones
echo {A,B}{1,2}           # A1 A2 B1 B2
```

---

## 11. Globbing (comodines de archivos)

El globbing permite hacer coincidir nombres de archivo usando patrones. **A diferencia de la expansion de llaves, el globbing depende de los archivos que existan**.

| Patron | Descripcion | Ejemplo |
|--------|-------------|---------|
| `*` | Coincide con cero o mas caracteres | `*.txt` - todos los archivos .txt |
| `?` | Coincide con exactamente un caracter | `archivo?.txt` - archivo1.txt, archivoA.txt |
| `[abc]` | Coincide con uno de los caracteres listados | `archivo[123].txt` - archivo1.txt, archivo2.txt, archivo3.txt |
| `[a-z]` | Coincide con un rango de caracteres | `[a-z]*.txt` - archivos que empiezan por minuscula |
| `[!abc]` o `[^abc]` | Coincide con cualquier caracter que NO este listado | `archivo[!0-9].txt` - archivos que no tienen digito |

### Ejemplos practicos
```bash
ls *.conf                 # Archivos que terminan en .conf
ls archivo?.log           # archivo1.log, archivoA.log, etc.
ls [Aa]rchivo.txt         # Archivo.txt o archivo.txt
ls imagen[0-9][0-9].jpg   # imagen00.jpg hasta imagen99.jpg
ls [!.]*.txt              # Archivos .txt que no empiezan por punto
```

> **IMPORTANTE**: El globbing NO coincide con archivos ocultos (que empiezan por `.`) a menos que se especifique explicitamente: `ls .*` o `ls .?*`

---

## 12. El comando exec

`exec` reemplaza el shell actual con el comando especificado. **El shell deja de existir** y es sustituido por el nuevo proceso. No se crea proceso hijo.

```bash
exec ls        # Ejecuta ls y cierra el terminal (el shell fue reemplazado)
```

### Uso con redirecciones
`exec` tambien se usa para redirigir descriptores de archivo para todo el script:
```bash
exec > salida.log     # Redirige toda la salida del shell a salida.log
exec 2> errores.log   # Redirige todos los errores a errores.log
```

---

## 13. El comando uname

Muestra informacion del sistema:

```bash
uname              # Nombre del kernel (ej: Linux)
uname -a           # Toda la informacion
uname -r           # Version del kernel
uname -n           # Nombre de red del equipo (hostname)
uname -m           # Arquitectura de la maquina (ej: x86_64)
uname -s           # Nombre del kernel
uname -o           # Sistema operativo (ej: GNU/Linux)
uname -p           # Tipo de procesador
```

> **Para el examen**: `uname -r` para version del kernel y `uname -a` para toda la informacion son los mas preguntados.

---

## 14. Archivos de configuracion del shell

### Shell de login vs shell interactivo no-login

#### Shell de login
Un **shell de login** se inicia cuando el usuario abre sesion en el sistema (consola de texto, SSH, `su -`, `bash --login`). Lee los siguientes archivos **en este orden**:

1. `/etc/profile` (configuracion global para todos los usuarios)
2. Luego busca **el primero que exista** de estos tres, en orden:
   - `~/.bash_profile`
   - `~/.bash_login`
   - `~/.profile`
3. Al cerrar sesion: `~/.bash_logout`

#### Shell interactivo no-login
Un **shell interactivo no-login** se abre cuando se lanza una nueva terminal dentro de una sesion grafica o cuando se ejecuta `bash` sin opciones. Lee:

1. `/etc/bash.bashrc` (global, segun distribucion)
2. `~/.bashrc`

#### Shell no interactivo
Un **shell no interactivo** se usa para ejecutar scripts. No lee los archivos anteriores, pero puede leer el archivo indicado en la variable `$BASH_ENV` si esta definida.

#### Como identificar el tipo de shell
```bash
# Verificar si es un shell de login
echo $0           # Si muestra "-bash" (con guion), es shell de login
shopt login_shell # Muestra "on" si es shell de login

# Verificar si es interactivo
echo $-           # Si contiene "i", es interactivo
```

#### Ejemplo de flujo
```
Inicio de sesion (SSH, consola):
  /etc/profile -> ~/.bash_profile (o ~/.bash_login o ~/.profile)

Abrir terminal en escritorio:
  /etc/bash.bashrc -> ~/.bashrc

Ejecutar un script:
  Solo $BASH_ENV (si esta definida)

Cerrar sesion de login:
  ~/.bash_logout
```

> **Para el examen**: Es muy comun que `~/.bash_profile` contenga un `source ~/.bashrc` para reutilizar la configuracion. Asi, los alias y funciones definidos en `.bashrc` tambien estan disponibles en shells de login.

### Archivos de configuracion
| Archivo | Descripcion |
|---------|-------------|
| `/etc/profile` | Configuracion global para shells de login |
| `/etc/profile.d/` | Directorio con scripts adicionales ejecutados por /etc/profile |
| `~/.bash_profile` | Configuracion personal para shells de login |
| `~/.bash_login` | Alternativa a .bash_profile |
| `~/.profile` | Alternativa a .bash_profile (leido tambien por sh) |
| `~/.bashrc` | Configuracion personal para shells interactivos no-login |
| `~/.bash_logout` | Se ejecuta al cerrar un shell de login |

> **Consejo**: Es comun que `~/.bash_profile` incluya un `source ~/.bashrc` para compartir configuraciones.

---

## 15. El comando `hash`

El shell bash mantiene una **tabla hash interna** que almacena las rutas de los comandos externos ya ejecutados. Esto evita que el shell tenga que buscar en todos los directorios de `$PATH` cada vez que se ejecuta un comando conocido.

```bash
hash              # Muestra la tabla hash (comandos usados y sus rutas)
hash -r           # Limpia (resetea) la tabla hash completa
hash -d ls        # Elimina la entrada de "ls" de la tabla hash
hash -p /usr/local/bin/python3 python3  # Establece manualmente una ruta para un comando
hash -t ls        # Muestra la ruta almacenada para "ls"
```

### Cuando es util
Si se instala una nueva version de un programa en una ubicacion diferente, el shell podria seguir usando la ruta antigua almacenada en el hash. En ese caso, se usa `hash -r` para forzar una nueva busqueda.

```bash
# Ejemplo: despues de instalar una nueva version de python
hash -r           # Limpia la cache
which python3     # Ahora buscara la nueva ubicacion
```

> **Para el examen**: `hash` es un builtin de bash. La tabla hash se limpia automaticamente al iniciar un nuevo shell. Se usa `hash -r` para resetear la tabla cuando se han movido o instalado nuevos ejecutables.
