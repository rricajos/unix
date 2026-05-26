---
title: "103.2 - Procesar flujos de texto con filtros: Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-103
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "103"
subtema: "103.2"
---

# 103.2 - Procesar flujos de texto con filtros: Comandos clave

## Visualizacion de archivos

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `cat archivo` | Muestra contenido del archivo | `cat /etc/hosts` |
| `cat -n archivo` | Muestra con numeros de linea | `cat -n script.sh` |
| `cat -b archivo` | Numera solo lineas no vacias | `cat -b datos.txt` |
| `cat -s archivo` | Suprime lineas vacias repetidas | `cat -s registro.log` |
| `cat -A archivo` | Muestra caracteres especiales | `cat -A config.txt` |
| `tac archivo` | Muestra lineas en orden inverso | `tac access.log` |

## Primeras y ultimas lineas

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `head archivo` | Primeras 10 lineas | `head /etc/passwd` |
| `head -n N archivo` | Primeras N lineas | `head -n 5 archivo.txt` |
| `head -n -N archivo` | Todas excepto las N ultimas | `head -n -3 archivo.txt` |
| `head -c N archivo` | Primeros N bytes | `head -c 100 archivo.bin` |
| `tail archivo` | Ultimas 10 lineas | `tail /var/log/syslog` |
| `tail -n N archivo` | Ultimas N lineas | `tail -n 20 archivo.txt` |
| `tail -n +N archivo` | Desde la linea N hasta el final | `tail -n +5 archivo.txt` |
| `tail -f archivo` | Seguir en tiempo real | `tail -f /var/log/syslog` |
| `tail -F archivo` | Seguir incluso si se rota | `tail -F app.log` |

## Ordenacion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `sort archivo` | Orden alfabetico | `sort nombres.txt` |
| `sort -n archivo` | Orden numerico | `sort -n numeros.txt` |
| `sort -r archivo` | Orden reverso | `sort -r archivo.txt` |
| `sort -k N archivo` | Ordena por campo N | `sort -k 2 datos.txt` |
| `sort -t "D" archivo` | Define delimitador D | `sort -t ":" /etc/passwd` |
| `sort -u archivo` | Ordena y elimina duplicados | `sort -u lista.txt` |
| `sort -f archivo` | Ignora mayusculas/minusculas | `sort -f mezcla.txt` |
| `sort -h archivo` | Tamanhos legibles (1K, 2M) | `sort -h tamanhos.txt` |
| `sort -c archivo` | Verifica si esta ordenado | `sort -c lista.txt` |
| `sort -o salida archivo` | Guarda resultado en archivo | `sort -o sorted.txt data.txt` |

## Filtrado de duplicados

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `uniq archivo` | Elimina duplicados adyacentes | `sort datos.txt \| uniq` |
| `uniq -c archivo` | Cuenta ocurrencias | `sort datos.txt \| uniq -c` |
| `uniq -d archivo` | Solo muestra duplicados | `sort datos.txt \| uniq -d` |
| `uniq -u archivo` | Solo muestra unicos | `sort datos.txt \| uniq -u` |
| `uniq -i archivo` | Ignora mayusculas/minusculas | `sort datos.txt \| uniq -i` |

## Conteo

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `wc archivo` | Lineas, palabras, bytes | `wc archivo.txt` |
| `wc -l archivo` | Solo lineas | `wc -l /etc/passwd` |
| `wc -w archivo` | Solo palabras | `wc -w documento.txt` |
| `wc -c archivo` | Solo bytes | `wc -c archivo.bin` |
| `wc -m archivo` | Solo caracteres | `wc -m texto.txt` |
| `wc -L archivo` | Linea mas larga | `wc -L codigo.py` |

## Extraccion de columnas y campos

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `cut -d "D" -f N` | Campo N con delimitador D | `cut -d ":" -f 1 /etc/passwd` |
| `cut -d "D" -f N,M` | Campos N y M | `cut -d ":" -f 1,3 /etc/passwd` |
| `cut -d "D" -f N-M` | Campos N a M | `cut -d ":" -f 1-3 /etc/passwd` |
| `cut -c N-M` | Caracteres N a M | `cut -c 1-10 archivo.txt` |
| `cut -b N-M` | Bytes N a M | `cut -b 1-10 archivo.bin` |

## Union de archivos

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `paste f1 f2` | Une por columnas (TAB) | `paste nombres.txt edades.txt` |
| `paste -d "D" f1 f2` | Une con delimitador D | `paste -d "," f1.txt f2.txt` |
| `paste -s archivo` | Une lineas en una sola | `paste -s lista.txt` |
| `join f1 f2` | Une por campo comun | `join emp.txt dept.txt` |
| `join -1 N -2 M f1 f2` | Campos especificos | `join -1 2 -2 1 f1.txt f2.txt` |
| `join -t "D" f1 f2` | Con delimitador | `join -t ":" f1.txt f2.txt` |

## Traduccion y eliminacion de caracteres

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `tr 'a-z' 'A-Z'` | Convertir a mayusculas | `echo "hola" \| tr 'a-z' 'A-Z'` |
| `tr 'A-Z' 'a-z'` | Convertir a minusculas | `echo "HOLA" \| tr 'A-Z' 'a-z'` |
| `tr ' ' '_'` | Reemplazar caracter | `echo "hola mundo" \| tr ' ' '_'` |
| `tr -d 'chars'` | Eliminar caracteres | `echo "abc123" \| tr -d '0-9'` |
| `tr -s 'char'` | Comprimir repetidos | `echo "hooolaa" \| tr -s 'o'` |
| `tr -dc 'chars'` | Eliminar todo excepto | `echo "abc123" \| tr -dc '0-9'` |

## Tabulaciones y formato

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `expand archivo` | Tabs a espacios (8 por defecto) | `expand codigo.c` |
| `expand -t N archivo` | Tabs a N espacios | `expand -t 4 codigo.c` |
| `unexpand archivo` | Espacios iniciales a tabs | `unexpand texto.txt` |
| `unexpand -a archivo` | Todos los espacios a tabs | `unexpand -a texto.txt` |
| `fmt archivo` | Reformatea a 75 columnas | `fmt parrafo.txt` |
| `fmt -w N archivo` | Reformatea a N columnas | `fmt -w 60 texto.txt` |
| `pr archivo` | Formatea para impresion | `pr informe.txt` |
| `pr -2 archivo` | En 2 columnas | `pr -2 lista.txt` |
| `pr -h "titulo" archivo` | Con titulo personalizado | `pr -h "Informe" datos.txt` |

## Numeracion de lineas

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `nl archivo` | Numera lineas no vacias | `nl script.sh` |
| `nl -b a archivo` | Numera todas las lineas | `nl -b a texto.txt` |
| `nl -s '. ' archivo` | Separador personalizado | `nl -s '. ' lista.txt` |
| `nl -w N archivo` | Ancho del numero | `nl -w 3 archivo.txt` |
| `nl -n rz archivo` | Con ceros a la izquierda | `nl -n rz lista.txt` |

## Volcado binario

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `od archivo` | Volcado octal | `od archivo.bin` |
| `od -t x1 archivo` | Volcado hexadecimal | `od -t x1 archivo.bin` |
| `od -c archivo` | Mostrar caracteres | `od -c texto.txt` |
| `hexdump -C archivo` | Hex + ASCII canonico | `hexdump -C archivo.bin` |

## Division de archivos

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `split archivo` | Divide en partes de 1000 lineas | `split datos.csv` |
| `split -l N archivo` | Partes de N lineas | `split -l 100 datos.csv` |
| `split -b SIZE archivo` | Partes de SIZE bytes | `split -b 1M archivo.iso` |
| `split -n N archivo` | En N partes iguales | `split -n 5 datos.csv` |
| `split -d archivo prefijo` | Sufijos numericos | `split -d datos.csv parte_` |

## sed (editor de flujos)

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `sed 's/a/b/' archivo` | Reemplaza primera ocurrencia | `sed 's/error/ERROR/' log.txt` |
| `sed 's/a/b/g' archivo` | Reemplaza todas (global) | `sed 's/foo/bar/g' datos.txt` |
| `sed -i 's/a/b/g' archivo` | Reemplazo in-place | `sed -i 's/old/new/g' config` |
| `sed -i.bak 's/a/b/g' archivo` | In-place con backup | `sed -i.bak 's/old/new/g' f` |
| `sed 'Nd' archivo` | Borra la linea N | `sed '5d' archivo.txt` |
| `sed 'N,Md' archivo` | Borra lineas N a M | `sed '2,5d' archivo.txt` |
| `sed '/patron/d' archivo` | Borra lineas con patron | `sed '/^#/d' config.txt` |
| `sed -n 'Np' archivo` | Imprime solo linea N | `sed -n '10p' archivo.txt` |
| `sed -n '/patron/p' archivo` | Imprime lineas con patron | `sed -n '/error/p' log.txt` |

## Checksums

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `md5sum archivo` | Genera hash MD5 | `md5sum imagen.iso` |
| `md5sum -c archivo.md5` | Verifica hash MD5 | `md5sum -c sumas.md5` |
| `sha256sum archivo` | Genera hash SHA-256 | `sha256sum imagen.iso` |
| `sha256sum -c archivo.sha256` | Verifica SHA-256 | `sha256sum -c sumas.sha256` |
| `sha512sum archivo` | Genera hash SHA-512 | `sha512sum imagen.iso` |
| `sha512sum -c archivo.sha512` | Verifica SHA-512 | `sha512sum -c sumas.sha512` |

## Lectores de archivos comprimidos

| Comando | Formato | Equivalente |
|---------|---------|-------------|
| `zcat archivo.gz` | gzip | `gunzip -c` |
| `bzcat archivo.bz2` | bzip2 | `bunzip2 -c` |
| `xzcat archivo.xz` | xz | `unxz -c` |
