# 103.3 - Gestion basica de archivos: Comandos clave

## Listar archivos: ls

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `ls` | Lista archivos del directorio actual | `ls` |
| `ls -l` | Formato largo detallado | `ls -l /etc` |
| `ls -a` | Incluye archivos ocultos | `ls -a ~` |
| `ls -A` | Ocultos sin . y .. | `ls -A` |
| `ls -h` | Tamanhos legibles (con -l) | `ls -lh` |
| `ls -R` | Listado recursivo | `ls -R /var/log` |
| `ls -i` | Muestra numero de inodo | `ls -li archivo.txt` |
| `ls -d` | Muestra el directorio, no su contenido | `ls -ld /tmp` |
| `ls -t` | Ordena por fecha (reciente primero) | `ls -lt` |
| `ls -S` | Ordena por tamanho (mayor primero) | `ls -lS` |
| `ls -r` | Invierte el orden | `ls -ltr` |
| `ls -F` | Indicador de tipo (/ * @) | `ls -F /usr/bin` |
| `ls -1` | Una entrada por linea | `ls -1` |

## Copiar: cp

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `cp origen destino` | Copia archivo | `cp a.txt b.txt` |
| `cp -r dir/ destino/` | Copia recursiva (directorios) | `cp -r src/ backup/` |
| `cp -p origen destino` | Preserva permisos y timestamps | `cp -p config.txt bak/` |
| `cp -a dir/ destino/` | Archive (preserva todo, recursivo) | `cp -a /home/ /backup/` |
| `cp -i origen destino` | Pregunta antes de sobreescribir | `cp -i a.txt b.txt` |
| `cp -u origen destino` | Solo si origen es mas nuevo | `cp -u *.txt /backup/` |
| `cp -v origen destino` | Muestra progreso | `cp -v *.conf /etc/` |
| `cp -l origen destino` | Crea hard link | `cp -l archivo link` |
| `cp -s origen destino` | Crea symbolic link | `cp -s archivo link` |

## Mover y renombrar: mv

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `mv origen destino` | Mueve o renombra | `mv a.txt b.txt` |
| `mv -i origen destino` | Pregunta antes de sobreescribir | `mv -i a.txt dir/` |
| `mv -u origen destino` | Solo si origen es mas nuevo | `mv -u *.log /archive/` |
| `mv -v origen destino` | Muestra progreso | `mv -v docs/ /backup/` |
| `mv -f origen destino` | Fuerza sin preguntar | `mv -f tmp.txt /dev/null` |

## Eliminar: rm y rmdir

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `rm archivo` | Elimina archivo | `rm temp.txt` |
| `rm -r directorio/` | Elimina recursivamente | `rm -r old_project/` |
| `rm -f archivo` | Fuerza eliminacion | `rm -f lock.pid` |
| `rm -rf directorio/` | Fuerza eliminacion recursiva | `rm -rf /tmp/cache/` |
| `rm -i archivo` | Pide confirmacion | `rm -i importante.txt` |
| `rm -v archivo` | Muestra lo eliminado | `rm -v *.tmp` |
| `rmdir directorio/` | Elimina directorio vacio | `rmdir vacio/` |
| `rmdir -p a/b/c/` | Elimina jerarquia vacia | `rmdir -p padre/hijo/` |

## Crear directorios y archivos

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `mkdir nombre` | Crea directorio | `mkdir proyecto` |
| `mkdir -p a/b/c` | Crea padres si no existen | `mkdir -p src/main/java` |
| `mkdir -m 755 nombre` | Crea con permisos | `mkdir -m 700 privado` |
| `touch archivo` | Crea vacio o actualiza timestamp | `touch nuevo.txt` |
| `touch -a archivo` | Actualiza solo atime | `touch -a datos.txt` |
| `touch -m archivo` | Actualiza solo mtime | `touch -m datos.txt` |
| `touch -t YYYYMMDDhhmm archivo` | Establece fecha | `touch -t 202601150830 f.txt` |
| `touch -r ref archivo` | Copia timestamp de referencia | `touch -r old.txt new.txt` |

## Tipo de archivo

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `file archivo` | Determina tipo por contenido | `file imagen.dat` |
| `file -i archivo` | Muestra tipo MIME | `file -i documento.pdf` |
| `file -L enlace` | Sigue enlaces simbolicos | `file -L /usr/bin/python` |

## Globbing (comodines)

| Patron | Descripcion | Ejemplo |
|--------|-------------|---------|
| `*` | Cero o mas caracteres | `ls *.txt` |
| `?` | Un caracter cualquiera | `ls archivo?.log` |
| `[abc]` | Uno de los listados | `ls [abc]*.txt` |
| `[a-z]` | Uno del rango | `ls [a-z]*.conf` |
| `[!abc]` o `[^abc]` | Cualquiera excepto los listados | `ls [!0-9]*` |
| `[[:alpha:]]` | Cualquier letra | `ls [[:alpha:]]*` |
| `[[:digit:]]` | Cualquier digito | `ls [[:digit:]]*` |
| `[[:upper:]]` | Letra mayuscula | `ls [[:upper:]]*` |
| `[[:lower:]]` | Letra minuscula | `ls [[:lower:]]*` |

## find

### Busqueda por nombre y tipo

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `find ruta -name "patron"` | Busca por nombre | `find / -name "*.conf"` |
| `find ruta -iname "patron"` | Nombre sin importar mayusc. | `find / -iname "readme*"` |
| `find ruta -type f` | Solo archivos regulares | `find /var -type f` |
| `find ruta -type d` | Solo directorios | `find /etc -type d` |
| `find ruta -type l` | Solo enlaces simbolicos | `find /usr -type l` |

### Busqueda por tamanho

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `find ruta -size +10M` | Mayor de 10 MB | `find / -size +100M` |
| `find ruta -size -1k` | Menor de 1 KB | `find /tmp -size -1k` |
| `find ruta -size 100c` | Exactamente 100 bytes | `find . -size 100c` |
| `find ruta -empty` | Archivos vacios | `find /tmp -empty` |

### Busqueda por tiempo

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `find ruta -mtime -N` | Modificado hace menos de N dias | `find / -mtime -7` |
| `find ruta -mtime +N` | Modificado hace mas de N dias | `find /var -mtime +30` |
| `find ruta -atime -N` | Accedido hace menos de N dias | `find . -atime -1` |
| `find ruta -ctime -N` | Metadatos cambiados en N dias | `find /etc -ctime -1` |
| `find ruta -mmin -N` | Modificado hace menos de N min | `find . -mmin -60` |
| `find ruta -newer ref` | Mas nuevo que archivo ref | `find . -newer marca.txt` |

### Busqueda por propietario y permisos

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `find ruta -user nombre` | Por usuario propietario | `find / -user sandra` |
| `find ruta -group nombre` | Por grupo | `find / -group users` |
| `find ruta -nouser` | Sin usuario valido | `find / -nouser` |
| `find ruta -perm 644` | Permisos exactos | `find /var -perm 644` |
| `find ruta -perm -644` | Al menos estos permisos | `find / -perm -4000` |

### Profundidad y acciones

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `find ruta -maxdepth N` | Profundidad maxima | `find / -maxdepth 2 -name "*.log"` |
| `find ruta -mindepth N` | Profundidad minima | `find / -mindepth 2 -type f` |
| `find ruta -exec cmd {} \;` | Ejecuta por cada resultado | `find . -name "*.tmp" -exec rm {} \;` |
| `find ruta -exec cmd {} +` | Ejecuta agrupando resultados | `find . -name "*.txt" -exec ls -l {} +` |
| `find ruta -ok cmd {} \;` | Ejecuta pidiendo confirmacion | `find . -name "*.bak" -ok rm {} \;` |
| `find ruta -delete` | Elimina resultados | `find /tmp -name "*.tmp" -delete` |

### Operadores logicos en find

| Operador | Descripcion | Ejemplo |
|----------|-------------|---------|
| `-and` (o espacio) | Y logico (por defecto) | `find . -name "*.txt" -size +1M` |
| `-or` | O logico | `find . -name "*.txt" -or -name "*.log"` |
| `-not` o `!` | Negacion | `find . -not -name "*.tmp"` |
| `\( ... \)` | Agrupacion | `find . \( -name "*.txt" -or -name "*.md" \)` |

## tar (archivador)

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `tar -cvf arch.tar dir/` | Crear tar | `tar -cvf backup.tar /home/` |
| `tar -czvf arch.tar.gz dir/` | Crear tar + gzip | `tar -czvf backup.tar.gz /etc/` |
| `tar -cjvf arch.tar.bz2 dir/` | Crear tar + bzip2 | `tar -cjvf docs.tar.bz2 docs/` |
| `tar -cJvf arch.tar.xz dir/` | Crear tar + xz | `tar -cJvf src.tar.xz src/` |
| `tar -xvf arch.tar` | Extraer tar | `tar -xvf backup.tar` |
| `tar -xzvf arch.tar.gz` | Extraer tar.gz | `tar -xzvf backup.tar.gz` |
| `tar -xjvf arch.tar.bz2` | Extraer tar.bz2 | `tar -xjvf docs.tar.bz2` |
| `tar -xJvf arch.tar.xz` | Extraer tar.xz | `tar -xJvf src.tar.xz` |
| `tar -tvf arch.tar` | Listar contenido | `tar -tvf backup.tar` |
| `tar -xvf arch.tar -C dir/` | Extraer en directorio | `tar -xvf backup.tar -C /tmp/` |

## cpio

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `cmd \| cpio -o > arch` | Crear archivo cpio | `find . \| cpio -o > backup.cpio` |
| `cpio -id < arch` | Extraer cpio | `cpio -idv < backup.cpio` |
| `cpio -it < arch` | Listar contenido | `cpio -it < backup.cpio` |
| `cmd \| cpio -pdv destino/` | Copiar directamente | `find . \| cpio -pdv /backup/` |

## Compresion

| Comando | Descripcion | Extension |
|---------|-------------|-----------|
| `gzip archivo` | Comprime con gzip | .gz |
| `gunzip archivo.gz` | Descomprime gzip | - |
| `gzip -k archivo` | Comprime manteniendo original | .gz |
| `gzip -d archivo.gz` | Descomprime (= gunzip) | - |
| `bzip2 archivo` | Comprime con bzip2 | .bz2 |
| `bunzip2 archivo.bz2` | Descomprime bzip2 | - |
| `xz archivo` | Comprime con xz | .xz |
| `unxz archivo.xz` | Descomprime xz | - |
| `zip arch.zip archivos` | Comprime con zip | .zip |
| `zip -r arch.zip dir/` | Comprime directorio | .zip |
| `unzip arch.zip` | Descomprime zip | - |
| `unzip -l arch.zip` | Lista contenido zip | - |

## dd

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `dd if=IN of=OUT` | Copia bloques | `dd if=/dev/sda of=disk.img` |
| `dd if=IN of=OUT bs=SIZE` | Con tamanho de bloque | `dd if=f.iso of=/dev/sdb bs=4M` |
| `dd if=IN of=OUT count=N` | Copia N bloques | `dd if=/dev/zero of=f bs=1M count=100` |
| `dd ... status=progress` | Muestra progreso | `dd if=/dev/sda of=d.img status=progress` |
| `dd if=/dev/zero of=OUT` | Llena con ceros | `dd if=/dev/zero of=/dev/sda` |
| `dd if=/dev/sda of=mbr bs=512 count=1` | Backup del MBR | Copia los primeros 512 bytes |
