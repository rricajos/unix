# 103.3 - Gestion basica de archivos: Teoria

## 1. Listar archivos: ls

`ls` es el comando fundamental para listar el contenido de directorios.

### Opciones principales

```bash
ls                      # Lista archivos del directorio actual
ls -l                   # Formato largo (permisos, propietario, tamanho, fecha)
ls -a                   # Muestra TODOS los archivos, incluyendo ocultos (. y ..)
ls -A                   # Muestra ocultos pero sin . y ..
ls -h                   # Tamanhos legibles (K, M, G) - usar con -l
ls -R                   # Recursivo (lista subdirectorios)
ls -i                   # Muestra el numero de inodo
ls -d                   # Muestra el directorio en si, no su contenido
ls -t                   # Ordena por fecha de modificacion (mas reciente primero)
ls -S                   # Ordena por tamanho (mayor primero)
ls -r                   # Invierte el orden
ls -1                   # Una entrada por linea
ls -F                   # Agrega indicador de tipo (/ directorio, * ejecutable, @ enlace)
```

### Formato largo detallado (-l)
```
-rw-r--r-- 1 sandra users 4096 may 26 10:00 archivo.txt
|________| | |_____| |___| |__| |__________| |_________|
  permisos  |  dueno  grupo tam    fecha      nombre
          enlaces
```

### Combinaciones comunes
```bash
ls -la                  # Lista larga con ocultos
ls -lh                  # Lista larga con tamanhos legibles
ls -lt                  # Lista larga ordenada por fecha
ls -lS                  # Lista larga ordenada por tamanho
ls -ltr                 # Lista larga, por fecha, orden inverso (mas antiguo primero)
ls -lid /tmp            # Muestra inodo y datos del directorio /tmp
```

---

## 2. Copiar archivos y directorios: cp

```bash
cp origen destino                    # Copia un archivo
cp archivo1 archivo2 directorio/     # Copia multiples archivos a un directorio
cp -r directorio_origen/ destino/    # Copia recursiva (directorios)
cp -R directorio_origen/ destino/    # Igual que -r
cp -p archivo destino                # Preserva permisos, propietario y timestamps
cp -a directorio_origen/ destino/    # Archive: equivale a -dR --preserve=all (preserva TODO)
cp -i archivo destino                # Interactivo: pregunta antes de sobreescribir
cp -u archivo destino                # Update: solo copia si el origen es mas nuevo
cp -v archivo destino                # Verbose: muestra lo que se esta copiando
cp -l archivo destino                # Crea hard link en vez de copiar
cp -s archivo destino                # Crea symbolic link en vez de copiar
cp -f archivo destino                # Fuerza la copia (sobreescribe sin preguntar)
```

### Diferencia entre -r, -p y -a
| Opcion | Preserva permisos | Recursivo | Preserva enlaces simbolicos | Preserva timestamps |
|--------|:-:|:-:|:-:|:-:|
| `-r` | No | Si | No (copia el contenido) | No |
| `-p` | Si | No | No | Si |
| `-a` | Si | Si | Si (preserva como enlace) | Si |

> **Para el examen**: `cp -a` es la forma mas completa de copiar directorios preservando todas las propiedades. Es equivalente a `cp -dR --preserve=all`.

---

## 3. Mover y renombrar: mv

`mv` mueve archivos/directorios y tambien sirve para renombrar.

```bash
mv archivo.txt nuevo_nombre.txt      # Renombrar archivo
mv archivo.txt /ruta/destino/        # Mover archivo a otro directorio
mv archivo.txt /ruta/destino/nuevo.txt  # Mover y renombrar
mv directorio/ nueva_ubicacion/      # Mover directorio (no necesita -r)
mv -i archivo.txt destino/           # Interactivo: pregunta antes de sobreescribir
mv -u archivo.txt destino/           # Update: solo mueve si el origen es mas nuevo
mv -v archivo.txt destino/           # Verbose: muestra lo que se esta haciendo
mv -f archivo.txt destino/           # Fuerza sin preguntar
```

> **IMPORTANTE**: `mv` no necesita `-r` para mover directorios, a diferencia de `cp`.

---

## 4. Eliminar archivos y directorios: rm y rmdir

### rm
```bash
rm archivo.txt                       # Elimina un archivo
rm archivo1.txt archivo2.txt         # Elimina multiples archivos
rm -r directorio/                    # Elimina directorio y todo su contenido (recursivo)
rm -R directorio/                    # Igual que -r
rm -f archivo.txt                    # Fuerza: no pregunta, no muestra errores
rm -rf directorio/                   # Elimina forzosamente directorio y contenido
rm -i archivo.txt                    # Interactivo: pide confirmacion
rm -I directorio/                    # Pide confirmacion una vez (si hay mas de 3 archivos)
rm -v archivo.txt                    # Verbose: muestra lo que se elimina
```

> **ADVERTENCIA**: `rm -rf /` puede destruir todo el sistema. Las distribuciones modernas incluyen proteccion con `--preserve-root` activado por defecto.

### rmdir
Elimina **solo directorios vacios**:
```bash
rmdir directorio_vacio/              # Elimina un directorio vacio
rmdir -p padre/hijo/nieto/           # Elimina la jerarquia si todos estan vacios
```

### Diferencia entre rmdir y rm -r
| Comando | Borra archivos | Borra directorios vacios | Borra directorios con contenido |
|---------|:-:|:-:|:-:|
| `rmdir` | No | Si | No (da error) |
| `rm -r` | Si | Si | Si |

---

## 5. Crear directorios y archivos

### mkdir
```bash
mkdir directorio                     # Crea un directorio
mkdir dir1 dir2 dir3                 # Crea multiples directorios
mkdir -p padre/hijo/nieto            # Crea directorios padre si no existen
mkdir -m 755 directorio              # Crea con permisos especificos
mkdir -v directorio                  # Verbose
```

### touch
`touch` tiene dos funciones principales:
1. **Crear archivos vacios** si no existen
2. **Actualizar los timestamps** (fecha de acceso y modificacion) si el archivo ya existe

```bash
touch archivo.txt                    # Crea archivo vacio o actualiza timestamp
touch -a archivo.txt                 # Actualiza solo fecha de acceso (atime)
touch -m archivo.txt                 # Actualiza solo fecha de modificacion (mtime)
touch -t 202601151030 archivo.txt    # Establece fecha especifica (YYYYMMDDhhmm)
touch -d "2026-01-15 10:30" archivo.txt  # Fecha con formato legible
touch -r referencia.txt archivo.txt  # Copia los timestamps de otro archivo
```

---

## 6. Determinar tipo de archivo: file

`file` determina el tipo de un archivo **examinando su contenido** (no se basa en la extension):

```bash
file archivo.txt                     # "ASCII text"
file imagen.jpg                      # "JPEG image data"
file script.sh                       # "Bourne-Again shell script, ASCII text executable"
file /bin/ls                         # "ELF 64-bit LSB pie executable, x86-64"
file enlace_simbolico                # Muestra info del enlace
file -L enlace_simbolico             # Sigue el enlace y muestra info del archivo destino
file -i archivo.txt                  # Muestra el tipo MIME
```

> **Para el examen**: `file` analiza el contenido real del archivo usando "numeros magicos" (magic numbers) internos, no la extension del nombre.

---

## 7. Globbing (comodines)

El globbing permite seleccionar archivos usando patrones. La expansion la realiza el shell antes de pasar los argumentos al comando.

| Patron | Descripcion | Ejemplo |
|--------|-------------|---------|
| `*` | Cero o mas caracteres cualesquiera | `*.txt` - todos los .txt |
| `?` | Exactamente un caracter cualquiera | `archivo?.txt` |
| `[abc]` | Un caracter de los listados | `[abc]*.txt` |
| `[a-z]` | Un caracter del rango | `[a-z]*.log` |
| `[!abc]` | Cualquier caracter EXCEPTO los listados | `[!0-9]*` |
| `[^abc]` | Igual que [!abc] | `[^aeiou]*` |
| `[[:alpha:]]` | Cualquier letra | `[[:alpha:]]*` |
| `[[:digit:]]` | Cualquier digito | `[[:digit:]]*` |
| `[[:upper:]]` | Letra mayuscula | `[[:upper:]]*` |
| `[[:lower:]]` | Letra minuscula | `[[:lower:]]*` |

### Ejemplos practicos
```bash
ls *.conf                 # Archivos que terminan en .conf
rm *.tmp                  # Elimina todos los .tmp
cp imagen[0-9].jpg /fotos/  # imagen0.jpg a imagen9.jpg
mv [A-Z]* /mayusculas/   # Mueve archivos que empiezan por mayuscula
ls archivo[!0-9].txt      # archivo con caracter no numerico
ls .??*                    # Archivos ocultos (excepto . y ..)
```

> **IMPORTANTE**: El globbing NO coincide con archivos ocultos (que empiezan por `.`) a menos que el patron empiece explicitamente con `.`

---

## 8. Buscar archivos: find

`find` es un comando extremadamente potente para buscar archivos en el sistema de archivos. Busca recursivamente a partir de un directorio dado.

### Busqueda por nombre
```bash
find /ruta -name "archivo.txt"           # Busca por nombre exacto
find /ruta -name "*.conf"                # Busca con comodines
find /ruta -iname "*.TXT"               # Busca ignorando mayusculas/minusculas
```

### Busqueda por tipo
```bash
find /ruta -type f                       # Solo archivos regulares
find /ruta -type d                       # Solo directorios
find /ruta -type l                       # Solo enlaces simbolicos
find /ruta -type b                       # Dispositivos de bloque
find /ruta -type c                       # Dispositivos de caracter
```

### Busqueda por tamanho
```bash
find /ruta -size +10M                    # Archivos mayores de 10 MB
find /ruta -size -1k                     # Archivos menores de 1 KB
find /ruta -size 100c                    # Archivos de exactamente 100 bytes
find /ruta -size +1G                     # Archivos mayores de 1 GB
```

Sufijos de tamanho: `c` (bytes), `k` (kilobytes), `M` (megabytes), `G` (gigabytes)

### Busqueda por tiempo
```bash
find /ruta -mtime -7                     # Modificados en los ultimos 7 dias
find /ruta -mtime +30                    # Modificados hace mas de 30 dias
find /ruta -mtime 1                      # Modificados exactamente hace 1 dia
find /ruta -atime -3                     # Accedidos en los ultimos 3 dias
find /ruta -ctime -1                     # Cambiados (metadatos) en el ultimo dia
find /ruta -mmin -60                     # Modificados en los ultimos 60 minutos
find /ruta -newer referencia.txt         # Mas nuevos que referencia.txt
```

> **Diferencia**: `-mtime` = tiempo de modificacion (contenido), `-atime` = tiempo de acceso, `-ctime` = tiempo de cambio (metadatos/permisos). Los tiempos son en dias (24h). `-mmin` usa minutos.

### Busqueda por propietario y permisos
```bash
find /ruta -user sandra                  # Archivos del usuario sandra
find /ruta -group users                  # Archivos del grupo users
find /ruta -nouser                       # Archivos sin usuario valido
find /ruta -nogroup                      # Archivos sin grupo valido
find /ruta -perm 644                     # Permisos exactos 644
find /ruta -perm -644                    # Al menos estos permisos (644 o mas)
find /ruta -perm /644                    # Cualquiera de estos permisos
```

### Limitar profundidad
```bash
find /ruta -maxdepth 1 -name "*.txt"     # Solo en el directorio especificado
find /ruta -maxdepth 2 -name "*.txt"     # Hasta 2 niveles de profundidad
find /ruta -mindepth 2 -name "*.txt"     # Empezando desde 2 niveles de profundidad
```

### Operadores logicos
```bash
find /ruta -name "*.txt" -and -size +1M     # AND (es el operador por defecto)
find /ruta -name "*.txt" -size +1M          # Equivalente (AND implicito)
find /ruta -name "*.txt" -or -name "*.log"  # OR
find /ruta -not -name "*.tmp"               # NOT (negacion)
find /ruta ! -name "*.tmp"                  # NOT (forma alternativa)
find /ruta \( -name "*.txt" -or -name "*.log" \) -size +1M  # Agrupacion
```

### Ejecutar acciones
```bash
# -exec: ejecuta un comando por cada resultado
find /ruta -name "*.tmp" -exec rm {} \;           # Elimina cada .tmp encontrado
find /ruta -name "*.log" -exec gzip {} \;         # Comprime cada .log
find /ruta -type f -exec chmod 644 {} \;          # Cambia permisos

# -exec con + (mas eficiente, agrupa argumentos)
find /ruta -name "*.txt" -exec ls -l {} +         # Lista todos los .txt de una vez

# -ok: como -exec pero pide confirmacion
find /ruta -name "*.tmp" -ok rm {} \;             # Pregunta antes de borrar cada uno

# -delete: accion integrada para eliminar
find /ruta -name "*.tmp" -delete                  # Elimina (mas rapido que -exec rm)
```

> **IMPORTANTE para el examen**: En `-exec`, `{}` se reemplaza por el nombre del archivo encontrado. `\;` indica el fin del comando (el `\` escapa el `;` del shell). Con `+` en vez de `\;`, se agrupan multiples archivos en una sola invocacion del comando.

---

## 9. Archivadores

### tar (tape archive)
`tar` agrupa multiples archivos en un solo archivo (tarball). No comprime por si solo, pero puede invocar compresion.

#### Opciones principales
| Opcion | Descripcion |
|--------|-------------|
| `-c` | **Crear** archivo tar |
| `-x` | **Extraer** archivo tar |
| `-t` | **Listar** contenido del tar |
| `-v` | **Verbose** (mostrar progreso) |
| `-f archivo` | Especifica el nombre del **archivo** tar |
| `-z` | Comprimir/descomprimir con **gzip** (.tar.gz o .tgz) |
| `-j` | Comprimir/descomprimir con **bzip2** (.tar.bz2) |
| `-J` | Comprimir/descomprimir con **xz** (.tar.xz) |
| `-p` | Preservar permisos |
| `-C directorio` | Cambiar al directorio antes de extraer |

#### Ejemplos
```bash
# CREAR archivos tar
tar -cvf archivo.tar directorio/               # Crear tar sin compresion
tar -czvf archivo.tar.gz directorio/           # Crear tar comprimido con gzip
tar -cjvf archivo.tar.bz2 directorio/          # Crear tar comprimido con bzip2
tar -cJvf archivo.tar.xz directorio/           # Crear tar comprimido con xz

# EXTRAER archivos tar
tar -xvf archivo.tar                           # Extraer tar
tar -xzvf archivo.tar.gz                       # Extraer tar.gz
tar -xjvf archivo.tar.bz2                      # Extraer tar.bz2
tar -xJvf archivo.tar.xz                       # Extraer tar.xz
tar -xvf archivo.tar -C /destino/              # Extraer en directorio especifico

# LISTAR contenido
tar -tvf archivo.tar                           # Listar contenido del tar
tar -tzvf archivo.tar.gz                       # Listar contenido del tar.gz
```

> **Regla mnemotecnica para el examen**: Siempre recordar el orden: accion (`c`, `x`, `t`), opciones (`z`, `j`, `J`, `v`), y archivo (`f nombre`). La opcion `-f` siempre va seguida del nombre del archivo.

### cpio
`cpio` es un archivador mas antiguo que tar. Lee la lista de archivos desde la entrada estandar.

```bash
# Crear archivo cpio
find /ruta -name "*.txt" | cpio -o > backup.cpio
ls | cpio -ov > backup.cpio

# Extraer archivo cpio
cpio -id < backup.cpio                          # -i extraer, -d crear directorios
cpio -idv < backup.cpio                         # Con verbose

# Listar contenido
cpio -it < backup.cpio                          # -t listar

# Modo pass-through (copiar directamente)
find . -name "*.conf" | cpio -pdv /backup/      # Copia archivos a /backup/
```

Opciones de cpio:
| Opcion | Descripcion |
|--------|-------------|
| `-o` | Crear (output/copy-out) |
| `-i` | Extraer (input/copy-in) |
| `-p` | Pass-through (copiar directamente) |
| `-d` | Crear directorios necesarios |
| `-v` | Verbose |
| `-t` | Listar contenido |

---

## 10. Compresion

### gzip / gunzip
```bash
gzip archivo.txt                    # Comprime -> archivo.txt.gz (elimina el original)
gzip -k archivo.txt                 # Comprime y mantiene el original (-k = keep)
gzip -d archivo.txt.gz              # Descomprime (equivale a gunzip)
gunzip archivo.txt.gz               # Descomprime -> archivo.txt
gzip -l archivo.txt.gz              # Muestra informacion de compresion
gzip -r directorio/                 # Comprime todos los archivos en el directorio
gzip -1 archivo.txt                 # Compresion rapida (menor compresion)
gzip -9 archivo.txt                 # Compresion maxima (mas lento)
```

### bzip2 / bunzip2
Mejor compresion que gzip pero mas lento:
```bash
bzip2 archivo.txt                   # Comprime -> archivo.txt.bz2
bzip2 -k archivo.txt                # Comprime manteniendo original
bzip2 -d archivo.txt.bz2            # Descomprime (equivale a bunzip2)
bunzip2 archivo.txt.bz2             # Descomprime -> archivo.txt
```

### xz / unxz
Mejor compresion que bzip2 pero aun mas lento:
```bash
xz archivo.txt                      # Comprime -> archivo.txt.xz
xz -k archivo.txt                   # Comprime manteniendo original
xz -d archivo.txt.xz                # Descomprime (equivale a unxz)
unxz archivo.txt.xz                 # Descomprime -> archivo.txt
```

### zip / unzip
Formato compatible con Windows:
```bash
zip archivo.zip archivo1.txt archivo2.txt       # Comprimir archivos
zip -r archivo.zip directorio/                  # Comprimir directorio recursivamente
unzip archivo.zip                               # Descomprimir
unzip -l archivo.zip                            # Listar contenido
unzip archivo.zip -d /destino/                  # Descomprimir en directorio especifico
```

### Comparacion de compresion
| Herramienta | Extension | Velocidad | Compresion | Opcion tar |
|-------------|-----------|-----------|------------|------------|
| gzip | .gz | Rapido | Buena | `-z` |
| bzip2 | .bz2 | Medio | Mejor | `-j` |
| xz | .xz | Lento | La mejor | `-J` |
| zip | .zip | Rapido | Buena | N/A |

> **IMPORTANTE**: gzip, bzip2 y xz solo comprimen archivos individuales. Para comprimir directorios, primero se archivan con `tar` y luego se comprimen, o se usa `tar` con las opciones de compresion integradas.

---

## 11. dd (disk dump)

`dd` copia y convierte datos a nivel de bloques. Es muy potente y peligroso si se usa incorrectamente.

```bash
dd if=/dev/sda of=backup.img                         # Clonar disco completo
dd if=/dev/sda of=backup.img bs=4M status=progress   # Con tamanho de bloque y progreso
dd if=ubuntu.iso of=/dev/sdb bs=4M                   # Crear USB booteable
dd if=/dev/zero of=archivo.img bs=1M count=100       # Crear archivo de 100 MB con ceros
dd if=/dev/urandom of=aleatorio.bin bs=1M count=10   # Crear archivo de 10 MB aleatorio
dd if=/dev/sda1 of=/dev/sdb1 bs=64K                  # Clonar particion
```

### Opciones principales
| Opcion | Descripcion |
|--------|-------------|
| `if=` | Input file (archivo/dispositivo de entrada) |
| `of=` | Output file (archivo/dispositivo de salida) |
| `bs=` | Block size (tamanho de bloque para lectura Y escritura) |
| `ibs=` | Input block size |
| `obs=` | Output block size |
| `count=` | Numero de bloques a copiar |
| `skip=` | Salta N bloques al inicio de la entrada |
| `seek=` | Salta N bloques al inicio de la salida |
| `status=progress` | Muestra progreso de la operacion |
| `conv=notrunc` | No truncar el archivo de salida |
| `conv=sync` | Rellena bloques con ceros |

### Ejemplos practicos
```bash
# Crear backup del MBR (Master Boot Record) - primeros 512 bytes
dd if=/dev/sda of=mbr_backup.img bs=512 count=1

# Restaurar el MBR
dd if=mbr_backup.img of=/dev/sda bs=512 count=1

# Borrar un disco con ceros
dd if=/dev/zero of=/dev/sda bs=1M status=progress

# Crear archivo swap de 1 GB
dd if=/dev/zero of=/swapfile bs=1M count=1024
```

> **ADVERTENCIA**: `dd` no pide confirmacion y puede destruir datos si se especifican mal `if=` y `of=`. Se le conoce como "disk destroyer" en broma. Siempre verificar los dispositivos antes de ejecutar.
