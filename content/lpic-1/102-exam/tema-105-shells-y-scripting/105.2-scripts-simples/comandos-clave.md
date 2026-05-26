---
title: "105.2 - Comandos clave: Scripts simples"
tags:
  - lpic-1
  - examen-102
  - tema-105
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "105"
subtema: "105.2"
---

# 105.2 - Comandos clave: Scripts simples

## Shebang y ejecucion

| Elemento | Descripcion |
|----------|-------------|
| `#!/bin/bash` | Shebang para bash |
| `#!/bin/sh` | Shebang para sh (POSIX) |
| `#!/usr/bin/env bash` | Shebang portable |
| `chmod +x script.sh` | Dar permiso de ejecucion |
| `./script.sh` | Ejecutar (requiere shebang y +x) |
| `bash script.sh` | Ejecutar con bash (no requiere +x) |

## Variables especiales

| Variable | Descripcion |
|----------|-------------|
| `$0` | Nombre del script |
| `$1` - `$9` | Parametros posicionales |
| `${10}` | Parametro 10+ (requiere llaves) |
| `$#` | Numero de parametros |
| `$@` | Todos los parametros (separados individualmente) |
| `$*` | Todos los parametros (como una sola cadena) |
| `$?` | Codigo de salida del ultimo comando |
| `$$` | PID del shell actual |
| `$!` | PID del ultimo proceso en background |

## read - Lectura de entrada

| Comando | Descripcion |
|---------|-------------|
| `read var` | Leer en variable |
| `read -p "texto: " var` | Leer con prompt |
| `read -s var` | Leer sin eco (passwords) |
| `read -t 5 var` | Leer con timeout de 5 segundos |
| `read -n 1 var` | Leer solo 1 caracter |
| `read a b c` | Leer multiples variables |

## Comparaciones numericas (test / [ ])

| Operador | Significado | Ejemplo |
|----------|-------------|---------|
| `-eq` | Igual | `[ $a -eq $b ]` |
| `-ne` | No igual | `[ $a -ne $b ]` |
| `-gt` | Mayor que | `[ $a -gt $b ]` |
| `-lt` | Menor que | `[ $a -lt $b ]` |
| `-ge` | Mayor o igual | `[ $a -ge $b ]` |
| `-le` | Menor o igual | `[ $a -le $b ]` |

## Comparaciones de cadenas

| Operador | Significado | Ejemplo |
|----------|-------------|---------|
| `=` | Igual | `[ "$a" = "$b" ]` |
| `!=` | Diferente | `[ "$a" != "$b" ]` |
| `-z` | Cadena vacia | `[ -z "$a" ]` |
| `-n` | Cadena no vacia | `[ -n "$a" ]` |

## Operadores de archivos

| Operador | Significado | Ejemplo |
|----------|-------------|---------|
| `-e` | Existe | `[ -e /ruta ]` |
| `-f` | Es archivo regular | `[ -f /ruta ]` |
| `-d` | Es directorio | `[ -d /ruta ]` |
| `-r` | Tiene lectura | `[ -r /ruta ]` |
| `-w` | Tiene escritura | `[ -w /ruta ]` |
| `-x` | Tiene ejecucion | `[ -x /ruta ]` |
| `-s` | Tamano > 0 | `[ -s /ruta ]` |
| `-L` | Es enlace simbolico | `[ -L /ruta ]` |

## Operadores logicos

| Contexto | AND | OR | NOT |
|----------|-----|-----|-----|
| `[ ]` / `test` | `-a` | `-o` | `!` |
| `[[ ]]` | `&&` | `\|\|` | `!` |
| Entre comandos | `&&` | `\|\|` | `!` |

## Estructuras de control

### if / elif / else
```bash
if [ condicion ]; then
    comandos
elif [ condicion ]; then
    comandos
else
    comandos
fi
```

### case
```bash
case "$var" in
    patron1) comandos ;;
    patron2|patron3) comandos ;;
    *) comandos_default ;;
esac
```

### for
```bash
for var in lista; do
    comandos
done
```

### while
```bash
while [ condicion ]; do
    comandos
done
```

### until
```bash
until [ condicion ]; do
    comandos
done
```

## seq - Secuencias numericas

| Comando | Resultado |
|---------|-----------|
| `seq 5` | 1 2 3 4 5 |
| `seq 3 7` | 3 4 5 6 7 |
| `seq 0 2 10` | 0 2 4 6 8 10 |
| `seq -w 1 10` | 01 02 ... 10 (ancho fijo) |
| `seq -s "," 1 5` | 1,2,3,4,5 |

## Aritmetica

| Forma | Ejemplo |
|-------|---------|
| `$(( ))` | `resultado=$((5 + 3))` |
| `(( ))` | `((i++))` |
| `let` | `let "i = i + 1"` |
| `expr` | `expr 5 + 3` (con espacios) |

## Codigos de salida y exec

| Comando | Descripcion |
|---------|-------------|
| `exit 0` | Terminar con exito |
| `exit 1` | Terminar con error |
| `$?` | Ver codigo del ultimo comando |
| `exec comando` | Reemplaza el shell actual con el comando |
| `exec > archivo` | Redirige toda la salida al archivo |

## Here Documents

| Sintaxis | Descripcion |
|----------|-------------|
| `<< EOF ... EOF` | Heredoc con expansion de variables |
| `<< 'EOF' ... EOF` | Heredoc sin expansion (literal) |
| `<<- EOF ... EOF` | Heredoc eliminando tabulaciones iniciales |

## [ ] vs [[ ]]

| Caracteristica | `[ ]` | `[[ ]]` |
|----------------|-------|---------|
| POSIX | Si | No (solo bash) |
| Logica AND/OR | `-a` / `-o` | `&&` / `\|\|` |
| Globbing | No | `[[ $a == *.txt ]]` |
| Regex | No | `[[ $a =~ patron ]]` |
| Requiere comillas | Si (recomendado) | No (mas seguro) |
