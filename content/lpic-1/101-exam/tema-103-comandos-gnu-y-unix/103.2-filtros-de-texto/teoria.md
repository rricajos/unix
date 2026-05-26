---
title: "103.2 - Procesar flujos de texto con filtros: Teoria"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.2"
---

# 103.2 - Procesar flujos de texto con filtros: Teoria

## 1. cat y tac

### cat (concatenar y mostrar)
`cat` es uno de los comandos mas basicos de Linux. Lee archivos y muestra su contenido en la salida estandar. Tambien se usa para concatenar varios archivos.

```bash
cat archivo.txt                   # Muestra el contenido del archivo
cat archivo1.txt archivo2.txt     # Concatena y muestra ambos archivos
cat -n archivo.txt                # Muestra con numeros de linea (todas las lineas)
cat -b archivo.txt                # Numera solo las lineas no vacias
cat -s archivo.txt                # Suprime lineas vacias consecutivas (squeeze)
cat -A archivo.txt                # Muestra caracteres no imprimibles (tabs como ^I, fin de linea como $)
cat -E archivo.txt                # Muestra $ al final de cada linea
cat -T archivo.txt                # Muestra tabulaciones como ^I
```

### tac (cat invertido)
`tac` muestra el contenido de un archivo con las **lineas en orden inverso** (la ultima linea primero):

```bash
tac archivo.txt                   # Muestra el archivo con las lineas invertidas
tac archivo1.txt archivo2.txt     # Invierte cada archivo independientemente
```

> **Para el examen**: `tac` es simplemente `cat` escrito al reves y hace exactamente eso: invierte el orden de las lineas.

---

## 2. head y tail

### head
Muestra las **primeras lineas** de un archivo (por defecto 10):

```bash
head archivo.txt                  # Primeras 10 lineas
head -n 5 archivo.txt             # Primeras 5 lineas
head -5 archivo.txt               # Forma abreviada de lo anterior
head -n -3 archivo.txt            # Todas las lineas EXCEPTO las 3 ultimas
head -c 100 archivo.txt           # Primeros 100 bytes
```

### tail
Muestra las **ultimas lineas** de un archivo (por defecto 10):

```bash
tail archivo.txt                  # Ultimas 10 lineas
tail -n 5 archivo.txt             # Ultimas 5 lineas
tail -5 archivo.txt               # Forma abreviada
tail -n +3 archivo.txt            # Desde la linea 3 hasta el final
tail -c 100 archivo.txt           # Ultimos 100 bytes
tail -f archivo.log               # SEGUIR el archivo en tiempo real (follow)
tail -f -n 20 archivo.log         # Seguir mostrando las ultimas 20 lineas y nuevas
```

> **IMPORTANTE para el examen**: `tail -f` es muy utilizado para monitorizar logs en tiempo real. Tambien existe `tail -F` que sigue el archivo incluso si es rotado (reemplazado por otro archivo con el mismo nombre).

---

## 2b. Paginadores: less y more

Los **paginadores** permiten visualizar archivos largos pagina por pagina, sin cargar todo el contenido a la vez.

### more

`more` es el paginador mas antiguo. Permite avanzar pero tiene navegacion limitada.

```bash
more archivo.txt                  # Visualizar archivo pagina a pagina
more -10 archivo.txt              # Mostrar 10 lineas a la vez
more +20 archivo.txt              # Empezar desde la linea 20
more +/patron archivo.txt         # Empezar desde la primera coincidencia del patron
ls -la /etc | more                # Paginar la salida de otro comando
```

**Teclas de navegacion en more:**
| Tecla | Accion |
|-------|--------|
| `Space` | Avanzar una pagina |
| `Enter` | Avanzar una linea |
| `b` | Retroceder una pagina (no en todos los sistemas) |
| `/patron` | Buscar hacia adelante |
| `q` | Salir |
| `h` | Ayuda |

### less

`less` es una version mejorada de `more` con navegacion completa en ambas direcciones. Su nombre viene del dicho "less is more" (menos es mas).

```bash
less archivo.txt                  # Visualizar archivo
less -N archivo.txt               # Mostrar numeros de linea
less -S archivo.txt               # No ajustar lineas largas (desplazar horizontalmente)
less +F archivo.txt               # Modo follow (como tail -f), salir con Ctrl+C
cat /var/log/syslog | less        # Paginar la salida de otro comando
```

**Teclas de navegacion en less:**
| Tecla | Accion |
|-------|--------|
| `Space` o `f` | Avanzar una pagina |
| `b` | Retroceder una pagina |
| `j` o `Enter` | Avanzar una linea |
| `k` | Retroceder una linea |
| `g` | Ir al inicio del archivo |
| `G` | Ir al final del archivo |
| `/patron` | Buscar hacia adelante |
| `?patron` | Buscar hacia atras |
| `n` | Siguiente coincidencia de busqueda |
| `N` | Coincidencia anterior |
| `q` | Salir |
| `h` | Ayuda |
| `v` | Abrir el archivo en el editor ($EDITOR) |
| `-N` | Alternar numeros de linea (estando dentro de less) |

> **Para el examen**: `less` es mas potente que `more` (permite retroceder, buscar hacia atras). Las paginas de manual (`man`) usan `less` como paginador por defecto. Las teclas de navegacion de less son iguales a las de `man` y vi.

---

## 3. sort

`sort` ordena las lineas de un archivo o flujo de texto.

```bash
sort archivo.txt                  # Orden alfabetico (por defecto)
sort -n archivo.txt               # Orden NUMERICO
sort -r archivo.txt               # Orden REVERSO
sort -k 2 archivo.txt             # Ordena por el campo (columna) 2
sort -k 2,2 archivo.txt           # Ordena SOLO por el campo 2
sort -k 2n archivo.txt            # Ordena por campo 2 numericamente
sort -t ":" -k 3 -n /etc/passwd   # Usa ":" como delimitador, ordena numericamente por campo 3
sort -u archivo.txt               # Ordena y elimina duplicados (unique)
sort -f archivo.txt               # Ignora mayusculas/minusculas (fold case)
sort -h archivo.txt               # Ordena por tamanho legible (1K, 2M, 3G)
sort -o salida.txt archivo.txt    # Guarda la salida en un archivo
sort -c archivo.txt               # Verifica si el archivo ya esta ordenado
```

### Ordenar por multiples campos
```bash
# Ordena por campo 1 alfabeticamente, luego por campo 2 numericamente
sort -k 1,1 -k 2,2n archivo.txt
```

> **IMPORTANTE**: `-t` define el delimitador de campos. Por defecto, sort usa espacios y tabulaciones como delimitadores. Para archivos como `/etc/passwd` se usa `-t ":"`.

---

## 4. uniq

`uniq` filtra lineas **adyacentes** duplicadas. **Requiere que la entrada este ordenada** para eliminar todos los duplicados (o se usa en combinacion con `sort`).

```bash
uniq archivo.txt                  # Elimina lineas adyacentes duplicadas
uniq -c archivo.txt               # Cuenta las ocurrencias de cada linea
uniq -d archivo.txt               # Muestra SOLO las lineas duplicadas
uniq -u archivo.txt               # Muestra SOLO las lineas unicas (no duplicadas)
uniq -i archivo.txt               # Ignora mayusculas/minusculas
uniq -f 2 archivo.txt             # Ignora los primeros 2 campos al comparar
```

### Patron tipico: sort + uniq
```bash
sort archivo.txt | uniq              # Elimina todos los duplicados
sort archivo.txt | uniq -c           # Cuenta ocurrencias de cada linea
sort archivo.txt | uniq -c | sort -rn  # Cuenta y ordena por frecuencia descendente
```

> **Para el examen**: `uniq` solo elimina duplicados **adyacentes**. Si las lineas duplicadas no estan juntas, no las detectara. Por eso casi siempre se usa junto con `sort`.

---

## 5. wc (word count)

`wc` cuenta lineas, palabras y bytes de un archivo.

```bash
wc archivo.txt                    # Muestra: lineas  palabras  bytes  nombre_archivo
wc -l archivo.txt                 # Solo numero de lineas
wc -w archivo.txt                 # Solo numero de palabras
wc -c archivo.txt                 # Solo numero de bytes
wc -m archivo.txt                 # Solo numero de caracteres
wc -L archivo.txt                 # Longitud de la linea mas larga
wc -l *.txt                       # Cuenta lineas de todos los .txt (con total)
```

### Uso con pipes
```bash
ls /etc | wc -l                   # Cuenta cuantos archivos hay en /etc
cat /etc/passwd | wc -l           # Cuenta cuantos usuarios hay en el sistema
```

---

## 6. cut

`cut` extrae secciones (columnas o campos) de cada linea de un archivo.

```bash
cut -d ":" -f 1 /etc/passwd       # Extrae el campo 1 usando ":" como delimitador
cut -d ":" -f 1,3 /etc/passwd     # Campos 1 y 3
cut -d ":" -f 1-3 /etc/passwd     # Campos del 1 al 3
cut -d ":" -f 3- /etc/passwd      # Del campo 3 hasta el final
cut -c 1-10 archivo.txt           # Caracteres del 1 al 10 de cada linea
cut -c 5 archivo.txt              # Solo el caracter 5 de cada linea
cut -c -5 archivo.txt             # Los primeros 5 caracteres
cut -c 5- archivo.txt             # Del caracter 5 hasta el final
cut -b 1-10 archivo.txt           # Bytes del 1 al 10
```

> **Para el examen**: `-d` define el delimitador (por defecto TAB), `-f` selecciona campos, `-c` selecciona caracteres.

---

## 7. paste

`paste` une lineas de multiples archivos lado a lado (por columnas), usando un delimitador (TAB por defecto).

```bash
paste archivo1.txt archivo2.txt           # Une por columnas con TAB
paste -d "," archivo1.txt archivo2.txt    # Une con coma como delimitador
paste -d ":" archivo1.txt archivo2.txt    # Une con dos puntos
paste -s archivo.txt                      # Une todas las lineas en una sola linea
paste -s -d "," archivo.txt              # Une todas las lineas separadas por comas
```

### Ejemplo
Si `nombres.txt` contiene "Ana\nPedro" y `edades.txt` contiene "25\n30":
```bash
paste nombres.txt edades.txt
# Ana     25
# Pedro   30
```

---

## 8. join

`join` une lineas de dos archivos que comparten un **campo comun** (similar a un JOIN en SQL). Los archivos deben estar **ordenados** por el campo de union.

```bash
join archivo1.txt archivo2.txt            # Une por el primer campo (por defecto)
join -1 2 -2 1 archivo1.txt archivo2.txt  # Campo 2 del archivo 1 con campo 1 del archivo 2
join -t ":" archivo1.txt archivo2.txt     # Usa ":" como delimitador
join -a 1 archivo1.txt archivo2.txt       # Incluye lineas no emparejadas del archivo 1
```

### Ejemplo
```
# empleados.txt:    # departamentos.txt:
# 1 Ana             # 1 Ventas
# 2 Pedro           # 2 IT

join empleados.txt departamentos.txt
# 1 Ana Ventas
# 2 Pedro IT
```

---

## 9. tr (translate)

`tr` traduce, elimina o comprime caracteres. **Solo lee de la entrada estandar** (no acepta archivos como argumento).

```bash
echo "hola" | tr 'a-z' 'A-Z'             # Convertir a mayusculas
echo "HOLA" | tr 'A-Z' 'a-z'             # Convertir a minusculas
echo "hola mundo" | tr ' ' '_'            # Reemplazar espacios por guiones bajos
echo "hola" | tr 'aeiou' '*'              # Reemplazar vocales por *
cat archivo.txt | tr -d '\r'              # Eliminar retornos de carro (Windows -> Linux)
echo "hooolaa" | tr -s 'o'               # Squeeze: comprime caracteres repetidos -> "holaa"
echo "hola123mundo" | tr -d '0-9'         # Eliminar todos los digitos -> "holamundo"
echo "hola123" | tr -dc '0-9'            # Eliminar todo EXCEPTO digitos -> "123"
echo "hola" | tr -d '\n'                 # Eliminar saltos de linea
```

### Clases de caracteres en tr
| Clase | Descripcion |
|-------|-------------|
| `[:alpha:]` | Letras |
| `[:digit:]` | Digitos |
| `[:alnum:]` | Letras y digitos |
| `[:upper:]` | Mayusculas |
| `[:lower:]` | Minusculas |
| `[:space:]` | Espacios en blanco |

```bash
echo "Hola Mundo 123" | tr -d '[:digit:]'   # Elimina digitos -> "Hola Mundo "
echo "hola" | tr '[:lower:]' '[:upper:]'     # -> "HOLA"
```

> **IMPORTANTE**: `tr` NO acepta nombres de archivo como argumento. Siempre se alimenta a traves de pipe o redireccion: `tr 'a' 'b' < archivo.txt`

---

## 10. expand y unexpand

### expand
Convierte **tabulaciones en espacios**:
```bash
expand archivo.txt                        # Convierte tabs a espacios (8 espacios por defecto)
expand -t 4 archivo.txt                   # Convierte tabs a 4 espacios
```

### unexpand
Convierte **espacios en tabulaciones**:
```bash
unexpand archivo.txt                      # Convierte espacios iniciales a tabs
unexpand -a archivo.txt                   # Convierte TODOS los espacios a tabs
unexpand -t 4 archivo.txt                 # Usa 4 espacios como un tab
```

---

## 11. fmt

`fmt` reformatea texto ajustando el ancho de las lineas:

```bash
fmt archivo.txt                           # Reformatea a 75 caracteres por linea (defecto)
fmt -w 60 archivo.txt                     # Reformatea a 60 caracteres por linea
fmt -u archivo.txt                        # Espaciado uniforme (un espacio entre palabras, dos despues de punto)
```

---

## 12. pr

`pr` prepara archivos de texto para impresion, anadiendo cabeceras con fecha, nombre del archivo y numero de pagina.

```bash
pr archivo.txt                            # Formatea para impresion con cabecera
pr -d archivo.txt                         # Doble espacio entre lineas
pr -h "Mi titulo" archivo.txt             # Cabecera personalizada
pr -l 40 archivo.txt                      # 40 lineas por pagina
pr -o 5 archivo.txt                       # Margen izquierdo de 5 espacios
pr -2 archivo.txt                         # Formato en 2 columnas
pr -t archivo.txt                         # Sin cabecera ni pie de pagina
```

---

## 13. nl (numerar lineas)

`nl` numera las lineas de un archivo con mas opciones que `cat -n`:

```bash
nl archivo.txt                            # Numera lineas no vacias (por defecto)
nl -b a archivo.txt                       # Numera TODAS las lineas (incluidas vacias)
nl -b t archivo.txt                       # Numera solo no vacias (defecto, "t" = text)
nl -b p'^[A-Z]' archivo.txt              # Numera solo lineas que coincidan con el patron
nl -s '. ' archivo.txt                    # Separador despues del numero: "1. linea..."
nl -w 3 archivo.txt                       # Ancho del numero (3 digitos)
nl -n rz archivo.txt                      # Numeros alineados a la derecha con ceros: 001, 002...
```

> **Diferencia con cat -n**: `nl` por defecto NO numera lineas vacias, `cat -n` si. `cat -b` se comporta igual que `nl` por defecto.

---

## 14. od y hexdump

### od (octal dump)
Muestra el contenido de un archivo en formato octal (u otros formatos):

```bash
od archivo.bin                            # Formato octal (por defecto)
od -A x archivo.bin                       # Direcciones en hexadecimal
od -A d archivo.bin                       # Direcciones en decimal
od -t x1 archivo.bin                      # Contenido en hexadecimal (1 byte)
od -t c archivo.bin                       # Muestra caracteres (con escapados como \n, \t)
od -t d1 archivo.bin                      # Decimal con signo (1 byte)
od -c archivo.bin                         # Equivalente a -t c
```

### hexdump
Similar a `od` pero con formato hexadecimal por defecto:

```bash
hexdump archivo.bin                       # Formato hexadecimal
hexdump -C archivo.bin                    # Formato canonico (hex + ASCII)
hexdump -n 32 archivo.bin                # Solo los primeros 32 bytes
```

---

## 15. split

`split` divide un archivo grande en archivos mas pequenos:

```bash
split archivo.txt                         # Divide en partes de 1000 lineas (xaa, xab, xac...)
split -l 100 archivo.txt                  # Divide en partes de 100 lineas
split -b 1M archivo.txt                   # Divide en partes de 1 MB
split -b 500K archivo.txt parte_          # Prefijo personalizado: parte_aa, parte_ab...
split -n 5 archivo.txt                    # Divide en 5 partes iguales
split -d archivo.txt parte_               # Usa sufijos numericos: parte_00, parte_01...
```

Para reconstruir el archivo:
```bash
cat parte_* > archivo_reconstruido.txt
```

---

## 16. sed (stream editor)

`sed` es un editor de flujos que transforma texto linea por linea. Es extremadamente poderoso y solo se cubren los basicos en este objetivo.

### Sustitucion
```bash
sed 's/patron/reemplazo/' archivo.txt           # Reemplaza primera ocurrencia por linea
sed 's/patron/reemplazo/g' archivo.txt          # Reemplaza TODAS las ocurrencias (global)
sed 's/patron/reemplazo/gi' archivo.txt         # Global e ignora mayusculas/minusculas
sed 's/patron/reemplazo/2' archivo.txt          # Reemplaza solo la 2a ocurrencia por linea
sed -i 's/patron/reemplazo/g' archivo.txt       # Modifica el archivo IN-PLACE
sed -i.bak 's/patron/reemplazo/g' archivo.txt   # In-place con backup (.bak)
```

### Borrar lineas
```bash
sed 'd' archivo.txt                             # Borra todas las lineas
sed '3d' archivo.txt                            # Borra la linea 3
sed '2,5d' archivo.txt                          # Borra las lineas 2 a 5
sed '$d' archivo.txt                            # Borra la ultima linea
sed '/patron/d' archivo.txt                     # Borra las lineas que contienen "patron"
```

### Imprimir lineas
```bash
sed -n '5p' archivo.txt                         # Imprime solo la linea 5
sed -n '2,5p' archivo.txt                       # Imprime lineas 2 a 5
sed -n '/patron/p' archivo.txt                  # Imprime lineas que contienen "patron"
```

> **IMPORTANTE**: `-n` suprime la salida por defecto. Sin `-n`, `p` duplicaria las lineas. Con `-n`, solo se muestran las lineas que coinciden con `p`.

### Otros usos
```bash
sed '3i\Texto nuevo' archivo.txt                # Inserta texto ANTES de la linea 3
sed '3a\Texto nuevo' archivo.txt                # Inserta texto DESPUES de la linea 3
sed 'y/abc/ABC/' archivo.txt                    # Transliterar (similar a tr)
```

---

## 17. Checksums (sumas de verificacion)

Los checksums se usan para verificar la integridad de archivos. Generan un hash unico basado en el contenido.

### md5sum
```bash
md5sum archivo.iso                               # Genera hash MD5
md5sum -c archivo.md5                            # Verifica contra archivo de sumas
md5sum archivo1 archivo2 > sumas.md5             # Genera sumas para multiples archivos
```

### sha256sum y sha512sum
```bash
sha256sum archivo.iso                            # Genera hash SHA-256 (mas seguro que MD5)
sha256sum -c archivo.sha256                      # Verifica
sha512sum archivo.iso                            # Genera hash SHA-512 (el mas seguro)
sha512sum -c archivo.sha512                      # Verifica
```

### Verificacion de integridad
```bash
# Generar:
sha256sum ubuntu.iso > ubuntu.sha256

# Verificar:
sha256sum -c ubuntu.sha256
# ubuntu.iso: OK
```

> **Para el examen**: MD5 se considera inseguro para criptografia pero sigue siendo util para verificacion de integridad basica. SHA-256 y SHA-512 son mas seguros.

---

## 18. Lectores de archivos comprimidos

Estos comandos permiten ver el contenido de archivos comprimidos sin descomprimirlos:

| Comando | Formato | Descripcion |
|---------|---------|-------------|
| `zcat` | gzip (.gz) | Equivale a `gunzip -c` |
| `bzcat` | bzip2 (.bz2) | Equivale a `bunzip2 -c` |
| `xzcat` | xz (.xz) | Equivale a `unxz -c` |

```bash
zcat archivo.txt.gz | head           # Ver las primeras lineas de un .gz
bzcat archivo.txt.bz2 | grep patron  # Buscar en un .bz2 sin descomprimir
xzcat archivo.txt.xz | wc -l        # Contar lineas en un .xz
```
