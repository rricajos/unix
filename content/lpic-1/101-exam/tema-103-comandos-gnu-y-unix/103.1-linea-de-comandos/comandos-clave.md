---
title: "103.1 - Trabajar en la linea de comandos: Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.1"
---

# 103.1 - Trabajar en la linea de comandos: Comandos clave

## Identificacion de comandos

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `type comando` | Muestra el tipo de comando (builtin, alias, file...) | `type cd` -> builtin |
| `type -a comando` | Muestra todas las ubicaciones del comando | `type -a echo` |
| `type -t comando` | Muestra solo el tipo (builtin, alias, file, function, keyword) | `type -t ls` -> alias |
| `which comando` | Muestra la ruta del ejecutable (solo busca en PATH) | `which grep` -> /usr/bin/grep |
| `which -a comando` | Muestra todas las rutas en PATH | `which -a python` |
| `whereis comando` | Muestra binario, man page y fuente | `whereis ls` |
| `whereis -b comando` | Solo el binario | `whereis -b ls` |
| `whereis -m comando` | Solo la pagina de manual | `whereis -m ls` |

## Variables de entorno

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `echo $VARIABLE` | Muestra el valor de una variable | `echo $PATH` |
| `VARIABLE=valor` | Define una variable local | `NOMBRE="Sandra"` |
| `export VARIABLE=valor` | Define y exporta variable de entorno | `export EDITOR=vim` |
| `export VARIABLE` | Exporta variable existente | `export NOMBRE` |
| `export -n VARIABLE` | Des-exporta una variable | `export -n NOMBRE` |
| `unset VARIABLE` | Elimina una variable | `unset NOMBRE` |
| `env` | Lista variables de entorno | `env` |
| `env -i comando` | Ejecuta con entorno limpio | `env -i bash` |
| `set` | Lista todas las variables y funciones | `set` |
| `set -o opcion` | Activa opcion del shell | `set -o noclobber` |
| `set +o opcion` | Desactiva opcion del shell | `set +o noclobber` |

## Variables de entorno importantes

| Variable | Descripcion | Ejemplo de valor |
|----------|-------------|------------------|
| `PATH` | Directorios de busqueda de comandos | `/usr/local/bin:/usr/bin:/bin` |
| `HOME` | Directorio personal | `/home/sandra` |
| `USER` | Usuario actual | `sandra` |
| `SHELL` | Shell de login | `/bin/bash` |
| `PS1` | Prompt principal | `\u@\h:\w\$ ` |
| `PS2` | Prompt secundario | `> ` |
| `LANG` | Idioma/localizacion | `es_ES.UTF-8` |
| `PWD` | Directorio actual | `/home/sandra/docs` |
| `OLDPWD` | Directorio anterior | `/home/sandra` |
| `HISTSIZE` | Comandos en memoria | `1000` |
| `HISTFILESIZE` | Lineas en archivo historial | `2000` |
| `HISTFILE` | Archivo de historial | `~/.bash_history` |

## Historial de comandos

| Comando | Descripcion |
|---------|-------------|
| `history` | Muestra el historial completo |
| `history N` | Muestra los ultimos N comandos |
| `history -c` | Limpia el historial en memoria |
| `history -w` | Escribe la memoria al archivo |
| `history -r` | Lee el archivo a memoria |
| `history -d N` | Elimina la entrada N |
| `!!` | Repite el ultimo comando |
| `!N` | Ejecuta el comando numero N |
| `!-N` | Ejecuta el comando N posiciones atras |
| `!cadena` | Ultimo comando que empieza por cadena |
| `!?cadena` | Ultimo comando que contiene cadena |
| `^viejo^nuevo` | Reemplaza en ultimo comando |
| `Ctrl+R` | Busqueda inversa interactiva |

## Comillas y escape

| Sintaxis | Comportamiento | Ejemplo |
|----------|---------------|---------|
| `'texto'` | Sin expansion alguna | `echo '$HOME'` -> `$HOME` |
| `"texto"` | Expansion de `$`, `` ` `` y `\` | `echo "$HOME"` -> `/home/usuario` |
| `` `comando` `` | Sustitucion de comando (antigua) | `` echo `date` `` |
| `$(comando)` | Sustitucion de comando (moderna) | `echo $(date)` |
| `\caracter` | Escape de un caracter | `echo \$HOME` -> `$HOME` |

## Secuencias de comandos

| Operador | Comportamiento | Ejemplo |
|----------|---------------|---------|
| `;` | Ejecuta secuencialmente (siempre) | `cmd1 ; cmd2` |
| `&&` | Ejecuta siguiente solo si anterior tuvo exito | `mkdir dir && cd dir` |
| `\|\|` | Ejecuta siguiente solo si anterior fallo | `cd dir \|\| echo "Error"` |
| `$?` | Codigo de salida del ultimo comando | `echo $?` |

## Paginas de manual

| Comando | Descripcion |
|---------|-------------|
| `man comando` | Abre la pagina de manual |
| `man N comando` | Abre la seccion N de la pagina |
| `man -k palabra` | Busca en descripciones (= `apropos`) |
| `man -f comando` | Descripcion corta (= `whatis`) |
| `apropos palabra` | Igual que `man -k` |
| `whatis comando` | Igual que `man -f` |
| `info comando` | Abre la pagina info |

## Secciones del manual

| Seccion | Contenido |
|---------|-----------|
| 1 | Comandos de usuario |
| 2 | Llamadas al sistema |
| 3 | Funciones de libreria |
| 4 | Archivos especiales (/dev) |
| 5 | Formatos de archivos de configuracion |
| 6 | Juegos |
| 7 | Miscelanea |
| 8 | Comandos de administracion |

## Alias

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `alias nombre='comando'` | Crea un alias | `alias ll='ls -la'` |
| `alias` | Lista todos los alias | `alias` |
| `unalias nombre` | Elimina un alias | `unalias ll` |
| `unalias -a` | Elimina todos los alias | `unalias -a` |
| `\comando` | Ejecuta sin alias | `\rm archivo` |

## Expansion de llaves y globbing

| Sintaxis | Descripcion | Ejemplo |
|----------|-------------|---------|
| `{a,b,c}` | Lista de opciones | `echo {a,b,c}` -> `a b c` |
| `{1..10}` | Rango numerico | `echo {1..5}` -> `1 2 3 4 5` |
| `{a..z}` | Rango alfabetico | `echo {a..d}` -> `a b c d` |
| `{1..10..2}` | Rango con incremento | `echo {1..9..2}` -> `1 3 5 7 9` |
| `*` | Cero o mas caracteres | `ls *.txt` |
| `?` | Exactamente un caracter | `ls archivo?.log` |
| `[abc]` | Un caracter de la lista | `ls [abc].txt` |
| `[a-z]` | Un caracter del rango | `ls [a-z]*.txt` |
| `[!abc]` | Cualquier caracter excepto los listados | `ls [!0-9]*` |

## Otros comandos importantes

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `uname -a` | Toda la informacion del sistema | `uname -a` |
| `uname -r` | Version del kernel | `uname -r` |
| `uname -m` | Arquitectura | `uname -m` |
| `echo` | Muestra texto | `echo "Hola"` |
| `pwd` | Directorio actual | `pwd` |
| `exec comando` | Reemplaza el shell por el comando | `exec ls` |
| `chsh -s /ruta/shell` | Cambia el shell de login | `chsh -s /bin/zsh` |
