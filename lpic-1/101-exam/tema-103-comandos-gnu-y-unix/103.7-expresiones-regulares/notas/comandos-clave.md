# 103.7 - Buscar texto con expresiones regulares: Comandos clave

## Opciones de grep

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `grep "patron" archivo` | Buscar patron en archivo | `grep "error" log.txt` |
| `grep -i "patron" archivo` | Ignorar mayusculas/minusculas | `grep -i "error" log.txt` |
| `grep -v "patron" archivo` | Mostrar lineas que NO coinciden | `grep -v "^#" config.txt` |
| `grep -c "patron" archivo` | Contar lineas coincidentes | `grep -c "error" log.txt` |
| `grep -l "patron" archivos` | Solo nombres de archivos con coincidencias | `grep -l "TODO" *.py` |
| `grep -L "patron" archivos` | Solo nombres de archivos SIN coincidencias | `grep -L "TODO" *.py` |
| `grep -r "patron" directorio` | Busqueda recursiva en directorio | `grep -r "error" /var/log/` |
| `grep -n "patron" archivo` | Mostrar numero de linea | `grep -n "error" log.txt` |
| `grep -w "patron" archivo` | Coincidir solo palabras completas | `grep -w "log" archivo.txt` |
| `grep -o "patron" archivo` | Mostrar solo la parte coincidente | `grep -o "[0-9]\+" datos.txt` |
| `grep -E "patron" archivo` | Usar expresiones regulares extendidas | `grep -E "err\|warn" log.txt` |
| `grep -F "cadena" archivo` | Tratar como cadena fija (sin regex) | `grep -F "a.b.c" archivo.txt` |
| `grep -A N "patron" archivo` | N lineas despues (After) | `grep -A 3 "error" log.txt` |
| `grep -B N "patron" archivo` | N lineas antes (Before) | `grep -B 2 "error" log.txt` |
| `grep -C N "patron" archivo` | N lineas contexto (antes y despues) | `grep -C 2 "error" log.txt` |
| `grep -x "patron" archivo` | Coincidir con linea completa | `grep -x "exacto" archivo.txt` |
| `grep -q "patron" archivo` | Silencioso (solo codigo de retorno) | `grep -q "ok" f && echo "si"` |

## Variantes de grep

| Comando | Equivalente | Uso |
|---------|-------------|-----|
| `egrep "patron"` | `grep -E "patron"` | Regex extendidas (ERE) |
| `fgrep "cadena"` | `grep -F "cadena"` | Cadena fija, sin regex |

## Metacaracteres - Referencia rapida

| Metacaracter | Significado | Funciona en |
|--------------|-------------|-------------|
| `.` | Cualquier caracter | BRE y ERE |
| `*` | Cero o mas del anterior | BRE y ERE |
| `^` | Inicio de linea | BRE y ERE |
| `$` | Fin de linea | BRE y ERE |
| `[abc]` | Uno de los caracteres listados | BRE y ERE |
| `[^abc]` | Cualquier caracter excepto los listados | BRE y ERE |
| `[a-z]` | Rango de caracteres | BRE y ERE |
| `\` | Escape (caracter literal) | BRE y ERE |
| `\b` | Limite de palabra | BRE y ERE |

## Cuantificadores BRE vs ERE

| Funcion | BRE | ERE |
|---------|-----|-----|
| Cero o mas | `*` | `*` |
| Una o mas | `\+` | `+` |
| Cero o una | `\?` | `?` |
| Exactamente n | `\{n\}` | `{n}` |
| Al menos n | `\{n,\}` | `{n,}` |
| Entre n y m | `\{n,m\}` | `{n,m}` |
| Agrupacion | `\( \)` | `( )` |
| Alternancia | `\|` | `\|` |

## Clases POSIX

| Clase | Equivalente | Significado |
|-------|-------------|-------------|
| `[[:alpha:]]` | `[a-zA-Z]` | Letras |
| `[[:digit:]]` | `[0-9]` | Digitos |
| `[[:alnum:]]` | `[a-zA-Z0-9]` | Letras y digitos |
| `[[:upper:]]` | `[A-Z]` | Mayusculas |
| `[[:lower:]]` | `[a-z]` | Minusculas |
| `[[:space:]]` | espacios/tabs/newlines | Espacios en blanco |
| `[[:blank:]]` | espacio/tab | Espacio y tabulador |
| `[[:punct:]]` | | Puntuacion |

## sed con regex

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `sed 's/viejo/nuevo/' archivo` | Reemplazar primera ocurrencia por linea | `sed 's/error/ERROR/' log.txt` |
| `sed 's/viejo/nuevo/g' archivo` | Reemplazar todas las ocurrencias | `sed 's/error/ERROR/g' log.txt` |
| `sed 's/viejo/nuevo/gi' archivo` | Reemplazar todas, case insensitive | `sed 's/error/ERROR/gi' log.txt` |
| `sed -i 's/viejo/nuevo/g' archivo` | Editar archivo in-place | `sed -i 's/foo/bar/g' config.txt` |
| `sed '/patron/d' archivo` | Eliminar lineas que coinciden | `sed '/^#/d' config.txt` |
| `sed '/^$/d' archivo` | Eliminar lineas vacias | `sed '/^$/d' archivo.txt` |
| `sed -E 's/regex/nuevo/g' archivo` | Usar ERE en sed | `sed -E 's/[0-9]+/NUM/g' f.txt` |
| `sed 's\|viejo\|nuevo\|g' archivo` | Delimitador alternativo | `sed 's\|/usr\|/opt\|g' paths.txt` |

## Patrones frecuentes en examenes

| Patron | Que busca |
|--------|-----------|
| `^texto` | Lineas que empiezan con "texto" |
| `texto$` | Lineas que terminan con "texto" |
| `^$` | Lineas vacias |
| `^[^#]` | Lineas que NO empiezan con # |
| `^[[:space:]]*$` | Lineas vacias o solo con espacios |
| `.*` | Cualquier cosa (cero o mas caracteres) |
| `[0-9]\{3\}` (BRE) | Exactamente 3 digitos |
| `[0-9]{3}` (ERE) | Exactamente 3 digitos |
| `\bpalabra\b` | "palabra" como palabra completa |
| `grep -v "^$"` | Lineas no vacias |
| `grep -v "^#"` | Lineas que no son comentarios |

## Codigos de retorno de grep

| Codigo | Significado |
|--------|-------------|
| 0 | Se encontraron coincidencias |
| 1 | No se encontraron coincidencias |
| 2 | Error (archivo no existe, regex invalida, etc.) |
