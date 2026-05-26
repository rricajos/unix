---
title: "103.7 - Buscar texto con expresiones regulares: Teoria"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.7"
---

# 103.7 - Buscar texto con expresiones regulares: Teoria

## 1. Que son las expresiones regulares

Las **expresiones regulares** (regex o regexp) son patrones de texto que describen un conjunto de cadenas posibles. Permiten buscar, comparar y manipular texto de forma flexible y potente.

En Linux, las expresiones regulares se usan con herramientas como `grep`, `sed`, `awk`, `vi/vim` y muchos otros programas.

### Dos tipos de expresiones regulares

| Tipo | Abreviatura | Herramienta | Descripcion |
|------|-------------|-------------|-------------|
| **Basicas** | BRE (Basic Regular Expressions) | `grep`, `sed` | Los metacaracteres `()`, `{}`, `+`, `?`, `\|` necesitan barra invertida para ser especiales |
| **Extendidas** | ERE (Extended Regular Expressions) | `grep -E`, `egrep`, `sed -E` | Los metacaracteres `()`, `{}`, `+`, `?`, `\|` son especiales directamente |

> **Clave para el examen**: La diferencia principal entre BRE y ERE es que en BRE hay que escapar ciertos metacaracteres con `\` para que funcionen como especiales, mientras que en ERE funcionan directamente.

---

## 2. Metacaracteres fundamentales

### Metacaracteres comunes a BRE y ERE

| Metacaracter | Significado | Ejemplo | Coincide con |
|--------------|-------------|---------|--------------|
| `.` | Cualquier caracter (excepto salto de linea) | `a.c` | "abc", "a1c", "a-c" |
| `*` | Cero o mas repeticiones del caracter anterior | `ab*c` | "ac", "abc", "abbc", "abbbc" |
| `^` | Inicio de linea | `^Linux` | Lineas que empiezan por "Linux" |
| `$` | Fin de linea | `fin$` | Lineas que terminan en "fin" |
| `[]` | Clase de caracteres (uno de los listados) | `[aeiou]` | Cualquier vocal minuscula |
| `[^]` | Clase negada (cualquiera excepto los listados) | `[^0-9]` | Cualquier caracter que no sea digito |
| `\` | Caracter de escape | `\.` | Un punto literal |

### Clases de caracteres con corchetes
```
[abc]       -> a, b o c
[a-z]       -> cualquier minuscula
[A-Z]       -> cualquier mayuscula
[0-9]       -> cualquier digito
[a-zA-Z]    -> cualquier letra
[a-zA-Z0-9] -> cualquier alfanumerico
[^abc]      -> cualquier caracter que NO sea a, b ni c
[^0-9]      -> cualquier caracter que NO sea un digito
```

### Anclas
| Metacaracter | Significado | Ejemplo |
|--------------|-------------|---------|
| `^` | Inicio de linea | `^#` coincide con lineas que empiezan por `#` |
| `$` | Fin de linea | `;$` coincide con lineas que terminan en `;` |
| `^$` | Linea vacia | Coincide con lineas sin contenido |
| `\b` | Limite de palabra | `\blinux\b` coincide con "linux" como palabra completa |

---

## 3. Diferencias entre BRE y ERE

### Tabla comparativa

| Funcion | BRE (grep, sed) | ERE (grep -E, egrep) |
|---------|-----------------|----------------------|
| Cualquier caracter | `.` | `.` |
| Cero o mas | `*` | `*` |
| Una o mas repeticiones | `\+` | `+` |
| Cero o una repeticion | `\?` | `?` |
| Agrupacion | `\( \)` | `( )` |
| Alternancia (OR) | `\|` | `|` |
| Repeticion exacta | `\{n\}` | `{n}` |
| Repeticion rango | `\{n,m\}` | `{n,m}` |
| Inicio de linea | `^` | `^` |
| Fin de linea | `$` | `$` |
| Clase de caracteres | `[ ]` | `[ ]` |

> **Regla para recordar**: En BRE, los caracteres `+`, `?`, `{`, `}`, `(`, `)`, `|` son **literales** por defecto y necesitan `\` para ser metacaracteres. En ERE, son **metacaracteres** por defecto y necesitan `\` para ser literales.

### Cuantificadores

| Cuantificador | BRE | ERE | Significado |
|---------------|-----|-----|-------------|
| Cero o mas | `*` | `*` | `ab*` -> "a", "ab", "abb"... |
| Una o mas | `\+` | `+` | `ab+` -> "ab", "abb", "abbb"... (no "a") |
| Cero o una | `\?` | `?` | `ab?` -> "a" o "ab" |
| Exactamente n | `\{n\}` | `{n}` | `a{3}` -> "aaa" |
| Al menos n | `\{n,\}` | `{n,}` | `a{2,}` -> "aa", "aaa", "aaaa"... |
| Entre n y m | `\{n,m\}` | `{n,m}` | `a{2,4}` -> "aa", "aaa", "aaaa" |

### Agrupacion y alternancia

```bash
# ERE: Agrupacion con ()
echo "gato" | grep -E "(gato|perro)"     # Coincide: "gato" O "perro"

# BRE: Agrupacion con \( \)
echo "gato" | grep "\(gato\|perro\)"     # Equivalente en BRE

# ERE: Repetir un grupo
echo "abcabc" | grep -E "(abc){2}"       # "abc" repetido 2 veces

# BRE: Repetir un grupo
echo "abcabc" | grep "\(abc\)\{2\}"      # Equivalente en BRE
```

---

## 4. El comando `grep`

### Sintaxis basica
```bash
grep [OPCIONES] PATRON [ARCHIVOS]
```

### Opciones principales de grep

| Opcion | Descripcion | Ejemplo |
|--------|-------------|---------|
| `-i` | Ignorar mayusculas/minusculas (case insensitive) | `grep -i "error" log.txt` |
| `-v` | Invertir: mostrar lineas que NO coinciden | `grep -v "^#" config.txt` |
| `-c` | Contar lineas que coinciden (no mostrarlas) | `grep -c "error" log.txt` |
| `-l` | Solo nombres de archivos con coincidencias | `grep -l "TODO" *.py` |
| `-L` | Solo nombres de archivos SIN coincidencias | `grep -L "TODO" *.py` |
| `-r` o `-R` | Busqueda recursiva en directorios | `grep -r "patron" /etc/` |
| `-n` | Mostrar numero de linea | `grep -n "error" log.txt` |
| `-w` | Coincidir solo palabras completas | `grep -w "log" archivo.txt` |
| `-o` | Mostrar solo la parte que coincide (no la linea completa) | `grep -o "[0-9]\+" datos.txt` |
| `-E` | Usar expresiones regulares extendidas (ERE) | `grep -E "error|warning" log.txt` |
| `-F` | Tratar el patron como cadena fija (sin regex) | `grep -F "a.b" archivo.txt` |
| `-A N` | Mostrar N lineas despues de cada coincidencia (After) | `grep -A 3 "error" log.txt` |
| `-B N` | Mostrar N lineas antes de cada coincidencia (Before) | `grep -B 2 "error" log.txt` |
| `-C N` | Mostrar N lineas antes y despues (Context) | `grep -C 2 "error" log.txt` |
| `-x` | Coincidir con la linea completa | `grep -x "exacto" archivo.txt` |
| `-q` | Silencioso (solo codigo de retorno) | `grep -q "patron" archivo && echo "encontrado"` |
| `-s` | Suprimir mensajes de error | `grep -s "patron" *.txt` |

### Codigos de retorno de grep
| Codigo | Significado |
|--------|-------------|
| 0 | Se encontraron coincidencias |
| 1 | No se encontraron coincidencias |
| 2 | Error (archivo no encontrado, etc.) |

---

## 5. `egrep` y `fgrep`

### `egrep` - Equivalente a `grep -E`
```bash
# Estos dos comandos son equivalentes:
egrep "error|warning" log.txt
grep -E "error|warning" log.txt
```
`egrep` usa expresiones regulares extendidas (ERE) por defecto. Los metacaracteres `+`, `?`, `{`, `}`, `(`, `)`, `|` funcionan directamente sin necesidad de `\`.

### `fgrep` - Equivalente a `grep -F`
```bash
# Estos dos comandos son equivalentes:
fgrep "192.168.1.1" log.txt
grep -F "192.168.1.1" log.txt
```
`fgrep` trata el patron como una **cadena fija** (fixed string), no como una expresion regular. Los metacaracteres como `.`, `*`, `^`, `$` se tratan como caracteres literales. Es mas rapido cuando no se necesitan regex.

> **Para el examen**: `egrep` y `fgrep` se consideran comandos obsoletos (deprecated). Se recomienda usar `grep -E` y `grep -F` en su lugar, pero ambas formas son validas.

---

## 6. Ejemplos practicos de grep con regex

### Busquedas basicas
```bash
# Lineas que contienen "error" (case insensitive)
grep -i "error" /var/log/syslog

# Lineas que NO son comentarios (no empiezan con #)
grep -v "^#" /etc/fstab

# Lineas que NO estan vacias
grep -v "^$" archivo.txt

# Lineas que empiezan con un numero
grep "^[0-9]" archivo.txt

# Lineas que terminan con un punto
grep "\.$" archivo.txt
```

### Busquedas con ERE
```bash
# Buscar "error" o "warning" o "critical"
grep -E "error|warning|critical" log.txt

# Direcciones IP (patron simplificado)
grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" archivo.txt

# Direcciones email (patron simplificado)
grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" archivo.txt

# Palabras que empiezan con mayuscula
grep -E "\b[A-Z][a-z]+" archivo.txt

# Lineas con exactamente 3 digitos seguidos
grep -E "\b[0-9]{3}\b" archivo.txt

# Lineas con una o mas vocales consecutivas
grep -E "[aeiou]+" archivo.txt
```

### Busquedas con contexto
```bash
# Mostrar 3 lineas despues de cada error
grep -A 3 "ERROR" log.txt

# Mostrar 2 lineas antes de cada error
grep -B 2 "ERROR" log.txt

# Mostrar 2 lineas antes y despues
grep -C 2 "ERROR" log.txt
```

---

## 7. Clases de caracteres POSIX

Las clases POSIX funcionan dentro de corchetes `[[:clase:]]`:

| Clase POSIX | Equivalente | Significado |
|-------------|-------------|-------------|
| `[[:alpha:]]` | `[a-zA-Z]` | Letras |
| `[[:digit:]]` | `[0-9]` | Digitos |
| `[[:alnum:]]` | `[a-zA-Z0-9]` | Letras y digitos |
| `[[:upper:]]` | `[A-Z]` | Mayusculas |
| `[[:lower:]]` | `[a-z]` | Minusculas |
| `[[:space:]]` | `[ \t\n\r\f\v]` | Espacios en blanco |
| `[[:blank:]]` | `[ \t]` | Espacio y tabulador |
| `[[:punct:]]` | | Signos de puntuacion |
| `[[:print:]]` | | Caracteres imprimibles |

```bash
# Buscar lineas que empiezan con mayuscula
grep "^[[:upper:]]" archivo.txt

# Buscar lineas que solo contienen digitos
grep "^[[:digit:]]*$" archivo.txt
```

> **Nota**: Los dobles corchetes son necesarios: los externos pertenecen a la sintaxis de clase de caracteres `[]` y los internos a la clase POSIX `[:clase:]`.

---

## 8. Secuencias de escape comunes

| Secuencia | Significado | Equivalente |
|-----------|-------------|-------------|
| `\b` | Limite de palabra (word boundary) | |
| `\w` | Caracter de palabra (alfanumerico + _) | `[a-zA-Z0-9_]` |
| `\W` | Caracter que NO es de palabra | `[^a-zA-Z0-9_]` |
| `\d` | Digito (no todas las versiones de grep) | `[0-9]` |
| `\s` | Espacio en blanco | `[[:space:]]` |
| `\S` | No espacio en blanco | `[^[:space:]]` |

> **Para el examen**: `\b` y `\w` funcionan en GNU grep. `\d` puede no funcionar en todas las versiones; es mas seguro usar `[0-9]` o `[[:digit:]]`.

---

## 9. `sed` con expresiones regulares

### Uso basico de sed para sustitucion
```bash
sed 's/patron/reemplazo/' archivo         # Primera ocurrencia en cada linea
sed 's/patron/reemplazo/g' archivo        # Todas las ocurrencias (global)
sed 's/patron/reemplazo/gi' archivo       # Global e insensible a mayusculas
sed -i 's/patron/reemplazo/g' archivo     # Editar el archivo in-place
```

### Ejemplos de sed con regex
```bash
# Eliminar lineas en blanco
sed '/^$/d' archivo.txt

# Eliminar comentarios (lineas que empiezan con #)
sed '/^#/d' archivo.txt

# Eliminar espacios al final de las lineas
sed 's/[[:space:]]*$//' archivo.txt

# Reemplazar multiples espacios por uno solo
sed 's/  */ /g' archivo.txt

# Usar ERE con sed
sed -E 's/[0-9]{3}-[0-9]{4}/XXX-XXXX/g' archivo.txt

# Usar referencias hacia atras (backreferences)
sed 's/\(.*\)/[\1]/' archivo.txt          # Encierra cada linea entre []
sed -E 's/(.*)/[\1]/' archivo.txt         # Mismo en ERE

# Intercambiar dos palabras
sed -E 's/(palabra1)(.*)(palabra2)/\3\2\1/' archivo.txt
```

### Delimitadores alternativos en sed
```bash
# En lugar de / se puede usar cualquier caracter como delimitador
sed 's|/usr/local|/opt|g' archivo.txt
sed 's#http://#https://#g' archivo.txt
```

---

## 10. Resumen de patrones frecuentes para el examen

| Patron | Significado |
|--------|-------------|
| `^texto` | Lineas que empiezan con "texto" |
| `texto$` | Lineas que terminan con "texto" |
| `^$` | Lineas vacias |
| `^[^#]` | Lineas que NO empiezan con # |
| `.` | Cualquier caracter |
| `.*` | Cualquier cantidad de cualquier caracter |
| `[abc]` | a, b o c |
| `[^abc]` | Cualquier caracter excepto a, b, c |
| `[0-9]` | Cualquier digito |
| `[a-z]` | Cualquier minuscula |
| `\b` | Limite de palabra |
| `a+` (ERE) | Una o mas "a" |
| `a?` (ERE) | Cero o una "a" |
| `a{3}` (ERE) | Exactamente tres "a" |
| `a{2,5}` (ERE) | De dos a cinco "a" |
| `(abc|def)` (ERE) | "abc" o "def" |
