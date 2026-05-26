---
title: "103.4 - Flujos, pipes y redirecciones: Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.4"
---

# 103.4 - Flujos, pipes y redirecciones: Comandos clave

## Descriptores de archivo

| Descriptor | Nombre | Abreviatura | Por defecto |
|:----------:|--------|-------------|-------------|
| 0 | Entrada estandar | stdin | Teclado |
| 1 | Salida estandar | stdout | Pantalla |
| 2 | Error estandar | stderr | Pantalla |

## Redireccion de salida estandar (stdout)

| Operador | Descripcion | Ejemplo |
|----------|-------------|---------|
| `>` | Redirige stdout a archivo (sobreescribe) | `ls > listado.txt` |
| `1>` | Igual que `>` (forma explicita) | `ls 1> listado.txt` |
| `>>` | Redirige stdout a archivo (anade al final) | `echo "linea" >> log.txt` |
| `1>>` | Igual que `>>` (forma explicita) | `echo "linea" 1>> log.txt` |
| `>|` | Fuerza sobreescritura con noclobber activo | `ls >| archivo.txt` |

## Redireccion de entrada estandar (stdin)

| Operador | Descripcion | Ejemplo |
|----------|-------------|---------|
| `<` | Usa archivo como entrada estandar | `sort < nombres.txt` |
| `0<` | Igual que `<` (forma explicita) | `sort 0< nombres.txt` |

## Redireccion de error estandar (stderr)

| Operador | Descripcion | Ejemplo |
|----------|-------------|---------|
| `2>` | Redirige stderr a archivo (sobreescribe) | `cmd 2> errores.txt` |
| `2>>` | Redirige stderr a archivo (anade) | `cmd 2>> errores.txt` |
| `2> /dev/null` | Descarta los errores | `find / -name "f" 2> /dev/null` |

## Combinar stdout y stderr

| Operador | Descripcion | Ejemplo |
|----------|-------------|---------|
| `&>` | Redirige stdout+stderr a archivo | `cmd &> todo.txt` |
| `&>>` | Anade stdout+stderr a archivo | `cmd &>> todo.txt` |
| `> f 2>&1` | Redirige ambos al mismo archivo | `cmd > salida.txt 2>&1` |
| `2>&1` | stderr va a donde apunte stdout | `cmd 2>&1 \| grep error` |
| `1>&2` | stdout va a donde apunte stderr | `echo "error" 1>&2` |

> **CUIDADO con el orden**: `cmd > archivo 2>&1` (correcto) vs `cmd 2>&1 > archivo` (stderr sigue en pantalla)

## /dev/null

| Uso | Descripcion | Ejemplo |
|-----|-------------|---------|
| `> /dev/null` | Descarta stdout | `ls > /dev/null` |
| `2> /dev/null` | Descarta stderr | `cmd 2> /dev/null` |
| `&> /dev/null` | Descarta stdout y stderr | `cmd &> /dev/null` |
| `> /dev/null 2>&1` | Descarta todo (forma clasica) | `cmd > /dev/null 2>&1` |
| `cat /dev/null > archivo` | Vacia un archivo | `cat /dev/null > log.txt` |

## Pipes

| Operador | Descripcion | Ejemplo |
|----------|-------------|---------|
| `\|` | Conecta stdout de cmd1 a stdin de cmd2 | `ls \| grep ".txt"` |
| `\|&` | Conecta stdout+stderr al siguiente cmd | `cmd \|& grep error` |

### Ejemplos de pipes encadenados

| Pipeline | Descripcion |
|----------|-------------|
| `cat /etc/passwd \| cut -d ":" -f 1 \| sort` | Extrae y ordena usuarios |
| `ps aux \| grep apache \| wc -l` | Cuenta procesos de apache |
| `du -sh /var/* \| sort -h \| tail -5` | Top 5 mayores en /var |
| `history \| awk '{print $2}' \| sort \| uniq -c \| sort -rn \| head` | Comandos mas usados |
| `dmesg \| tail -20` | Ultimos 20 mensajes del kernel |
| `ls -l \| grep "^d"` | Solo directorios del listado |

## tee

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `cmd \| tee archivo` | Muestra y guarda en archivo | `ls \| tee listado.txt` |
| `cmd \| tee -a archivo` | Muestra y anade a archivo | `date \| tee -a log.txt` |
| `cmd \| tee f1 f2` | Escribe en multiples archivos | `ls \| tee f1.txt f2.txt` |
| `cmd \| tee f \| cmd2` | Guarda salida intermedia | `ls \| tee tmp.txt \| wc -l` |
| `echo "x" \| sudo tee archivo` | Escribir como root | `echo "1" \| sudo tee /proc/x` |

## xargs

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `cmd \| xargs cmd2` | Convierte stdin en argumentos | `find . -name "*.tmp" \| xargs rm` |
| `cmd \| xargs -I {} cmd2 {}` | Placeholder para argumento | `find . \| xargs -I {} cp {} /bak/` |
| `cmd \| xargs -n N cmd2` | N argumentos por invocacion | `echo "a b c" \| xargs -n 1 echo` |
| `cmd \| xargs -0 cmd2` | Delimitador null (espacios en nombres) | `find . -print0 \| xargs -0 rm` |
| `cmd \| xargs -p cmd2` | Pide confirmacion | `find . \| xargs -p rm` |
| `cmd \| xargs -t cmd2` | Muestra el comando | `ls \| xargs -t file` |
| `cmd \| xargs -d "D" cmd2` | Define delimitador | `echo "a:b:c" \| xargs -d ":" echo` |

### Patron comun: find + xargs

| Pipeline | Descripcion |
|----------|-------------|
| `find . -name "*.log" \| xargs rm` | Elimina todos los .log |
| `find . -name "*.txt" \| xargs grep "patron"` | Busca patron en .txt |
| `find . -name "*.jpg" -print0 \| xargs -0 mv -t /fotos/` | Mueve jpgs (nombres con espacios) |
| `find . -type f \| xargs chmod 644` | Cambia permisos de archivos |
| `find . -name "*.c" \| xargs wc -l` | Cuenta lineas de codigo C |

## Here documents

| Sintaxis | Descripcion | Ejemplo |
|----------|-------------|---------|
| `<< DELIM ... DELIM` | Bloque de texto como stdin | `cat << EOF ... EOF` |
| `<< 'DELIM' ... DELIM` | Sin expansion de variables | `cat << 'EOF' ... EOF` |
| `<<- DELIM ... DELIM` | Ignora tabulaciones iniciales | `cat <<- EOF ... EOF` |

### Ejemplos de here documents
```bash
# Crear archivo con contenido
cat << EOF > config.txt
servidor=192.168.1.1
puerto=8080
EOF

# Enviar comandos a programa interactivo
ftp servidor << EOF
get archivo.txt
bye
EOF
```

## Here strings

| Sintaxis | Descripcion | Ejemplo |
|----------|-------------|---------|
| `<<< "cadena"` | Pasa cadena como stdin | `wc -w <<< "uno dos tres"` |
| `<<< $variable` | Pasa variable como stdin | `tr 'a-z' 'A-Z' <<< $nombre` |

### Ejemplos de here strings
```bash
bc <<< "5 + 3"              # Calcula: 8
tr 'a-z' 'A-Z' <<< "hola"  # HOLA
grep "error" <<< "$salida"  # Busca en variable
read a b <<< "valor1 valor2"  # Asigna a variables
```

## Named pipes (FIFOs)

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `mkfifo nombre` | Crea named pipe | `mkfifo mi_pipe` |
| `mkfifo -m permisos nombre` | Crea con permisos | `mkfifo -m 644 mi_pipe` |
| `echo "datos" > pipe` | Escribe en la pipe (bloqueante) | `echo "hola" > mi_pipe` |
| `cat < pipe` | Lee de la pipe (bloqueante) | `cat < mi_pipe` |
| `rm pipe` | Elimina la named pipe | `rm mi_pipe` |

### Comparacion pipe normal vs named pipe

| Caracteristica | Pipe normal (\|) | Named pipe (FIFO) |
|---------------|------------------|-------------------|
| Persistencia | Temporal (solo durante ejecucion) | Persiste en el filesystem |
| Creacion | Automatica con \| | Manual con mkfifo |
| Visibilidad | Solo comandos en la misma linea | Cualquier proceso |
| Eliminacion | Automatica | Manual con rm |
| Tipo en ls -l | N/A | p (prw-r--r--) |

## Proteccion noclobber

| Comando | Descripcion |
|---------|-------------|
| `set -o noclobber` | Activa proteccion (> no sobreescribe) |
| `set +o noclobber` | Desactiva proteccion |
| `>\| archivo` | Fuerza sobreescritura con noclobber activo |
