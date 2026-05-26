# 104.2 Mantener la integridad de los sistemas de archivos - Teoria

## 1. Conceptos fundamentales

### 1.1 Superbloque

El **superbloque** es una estructura de datos critica que contiene metadatos sobre el sistema de archivos:

- Tamano total del sistema de archivos
- Tamano de los bloques
- Numero total de inodos
- Numero de inodos y bloques libres
- Fecha del ultimo montaje
- Conteo de montajes
- Estado del sistema de archivos (limpio/sucio)

Los sistemas ext mantienen **copias de respaldo del superbloque** en ubicaciones predecibles. Si el superbloque principal se corrompe, se puede restaurar desde una copia.

```bash
# Ver ubicaciones de copias del superbloque
dumpe2fs /dev/sda1 | grep -i superblock

# Usar copia de respaldo para reparar
e2fsck -b 32768 /dev/sda1
```

### 1.2 Inodos

Un **inodo** (index node) es una estructura de datos que almacena metadatos de un archivo o directorio:

- Tipo de archivo (regular, directorio, enlace, etc.)
- Permisos (rwx)
- Propietario y grupo (UID/GID)
- Tamanos
- Timestamps (atime, mtime, ctime)
- Punteros a los bloques de datos en disco
- Conteo de enlaces duros

**Lo que NO contiene el inodo:** el nombre del archivo. El nombre se almacena en la entrada del directorio que apunta al inodo.

> **Dato clave para el examen:** Es posible quedarse sin inodos aunque quede espacio en disco. Esto ocurre cuando hay muchisimos archivos pequenos. Se verifica con `df -i`.

```bash
# Ver numero de inodo de un archivo
ls -i archivo.txt

# Ver uso de inodos
df -i

# Ver informacion completa del inodo
stat archivo.txt
```

### 1.3 Journaling

El **journaling** es un mecanismo que registra las operaciones pendientes en un "journal" (diario) antes de aplicarlas al sistema de archivos. Si el sistema se apaga inesperadamente, el journal permite recuperar rapidamente la consistencia sin necesidad de un fsck completo.

**Tipos de journaling:**
- **Journal de metadatos:** Solo registra cambios en metadatos (predeterminado en ext3/ext4)
- **Journal completo:** Registra metadatos + datos (mas seguro, mas lento)
- **Writeback:** Solo metadatos, sin orden garantizado (mas rapido, menos seguro)

**Sistemas con journaling:** ext3, ext4, XFS, Btrfs, JFS
**Sistemas sin journaling:** ext2, FAT, VFAT

---

## 2. Monitorizar el espacio en disco

### 2.1 df (disk free)

`df` muestra el espacio usado y disponible en los sistemas de archivos montados.

```bash
# Formato basico
df

# Formato legible para humanos (-h: human readable)
df -h

# Mostrar tipo de sistema de archivos
df -T

# Mostrar uso de inodos
df -i

# Combinar opciones
df -hT

# Solo un sistema de archivos especifico
df -h /dev/sda1
df -h /home
```

**Columnas de la salida de `df`:**

| Columna | Significado |
|---------|-------------|
| Filesystem | Dispositivo o fuente |
| Size / 1K-blocks | Tamano total |
| Used | Espacio usado |
| Avail | Espacio disponible |
| Use% | Porcentaje de uso |
| Mounted on | Punto de montaje |

> **Nota para el examen:** `df -i` muestra los inodos usados y disponibles. Es crucial para diagnosticar situaciones donde el disco "esta lleno" pero `df -h` muestra espacio libre (agotamiento de inodos).

### 2.2 du (disk usage)

`du` estima el espacio en disco usado por archivos y directorios.

```bash
# Uso basico (muestra cada subdirectorio)
du /var/log

# Resumen total de un directorio (-s: summary)
du -s /var/log

# Formato legible (-h: human readable)
du -sh /var/log

# Profundidad maxima de directorios
du --max-depth=1 /var
du -d 1 /var

# Total combinado de varios argumentos (-c: grand total)
du -shc /var/log /tmp /home

# Ordenar por tamano (combinado con sort)
du -sh /var/* | sort -h

# Ver que ocupa mas en un directorio
du -sh /home/* | sort -rh | head -10
```

**Opciones clave de `du`:**

| Opcion | Descripcion |
|--------|-------------|
| `-s` | Solo mostrar total (summary) |
| `-h` | Formato legible (human readable) |
| `-c` | Mostrar total general al final |
| `--max-depth=N` | Limitar profundidad de directorios |
| `-a` | Incluir archivos individuales |
| `--exclude=PATRON` | Excluir archivos que coincidan con patron |

---

## 3. Verificar y reparar sistemas de archivos

### 3.1 fsck (filesystem check)

`fsck` es el comando generico para verificar y reparar sistemas de archivos. Debe ejecutarse en **sistemas de archivos desmontados** (o montados en solo lectura).

```bash
# Verificar una particion (DESMONTADA)
fsck /dev/sda1

# Reparar automaticamente
fsck -y /dev/sda1

# Verificar sin reparar (solo reportar)
fsck -n /dev/sda1

# Forzar verificacion aunque parezca limpio
fsck -f /dev/sda1

# Especificar tipo de sistema de archivos
fsck -t ext4 /dev/sda1

# Verificar la particion raiz en modo de rescate
# (montar como solo lectura primero)
mount -o remount,ro /
fsck /dev/sda1
```

> **IMPORTANTE para el examen:** NUNCA ejecutar `fsck` en un sistema de archivos montado en modo lectura-escritura. Puede causar corrupcion de datos. El sistema de archivos debe estar desmontado o montado como solo lectura.

### 3.2 e2fsck

`e2fsck` es especifico para sistemas ext2/ext3/ext4.

```bash
# Verificar y reparar ext4
e2fsck /dev/sda1

# Reparar automaticamente (responder yes a todo)
e2fsck -y /dev/sda1

# Forzar verificacion
e2fsck -f /dev/sda1

# Solo verificar, no reparar
e2fsck -n /dev/sda1

# Usar superbloque de respaldo
e2fsck -b 32768 /dev/sda1

# Verificar y reconstruir el journal
e2fsck -j /dev/sda1
```

### 3.3 xfs_repair

`xfs_repair` es la herramienta para reparar sistemas de archivos XFS.

```bash
# Reparar XFS (el FS debe estar desmontado)
xfs_repair /dev/sda1

# Solo verificar sin reparar (dry-run)
xfs_repair -n /dev/sda1

# Forzar reparacion en log sucio
xfs_repair -L /dev/sda1
```

> **Nota:** Para XFS, NO se usa `fsck.xfs` para reparacion. `fsck.xfs` existe pero no hace nada real; es solo un placeholder. La herramienta real es `xfs_repair`.

---

## 4. Ajustar y consultar parametros del sistema de archivos

### 4.1 tune2fs (para ext2/ext3/ext4)

`tune2fs` permite ajustar parametros configurables de sistemas ext.

```bash
# Mostrar toda la informacion del FS
tune2fs -l /dev/sda1

# Establecer maximo de montajes antes de fsck automatico
tune2fs -c 30 /dev/sda1

# Desactivar verificacion por conteo de montajes
tune2fs -c 0 /dev/sda1
tune2fs -c -1 /dev/sda1

# Establecer intervalo de tiempo para fsck (dias)
tune2fs -i 30d /dev/sda1

# Desactivar verificacion por tiempo
tune2fs -i 0 /dev/sda1

# Anadir journal a ext2 (convertir a ext3)
tune2fs -j /dev/sda1

# Cambiar etiqueta del volumen
tune2fs -L "datos" /dev/sda1

# Establecer bloques reservados para root (porcentaje)
tune2fs -m 5 /dev/sda1

# Establecer UUID
tune2fs -U random /dev/sda1
```

**Opciones clave de tune2fs:**

| Opcion | Descripcion |
|--------|-------------|
| `-l` | Listar informacion del superbloque |
| `-c N` | Max montajes antes de fsck (0 o -1 desactiva) |
| `-i Nd` | Intervalo de tiempo para fsck (0 desactiva) |
| `-j` | Anadir journal (ext2 -> ext3) |
| `-L etiqueta` | Cambiar etiqueta del volumen |
| `-m N` | Porcentaje de bloques reservados para root |
| `-U uuid` | Cambiar UUID |

### 4.2 dumpe2fs (para ext2/ext3/ext4)

`dumpe2fs` muestra informacion detallada del superbloque y los grupos de bloques.

```bash
# Mostrar toda la informacion
dumpe2fs /dev/sda1

# Solo informacion del superbloque (sin grupos de bloques)
dumpe2fs -h /dev/sda1

# Buscar informacion especifica
dumpe2fs -h /dev/sda1 | grep -i "block count"
dumpe2fs -h /dev/sda1 | grep -i "inode count"
dumpe2fs -h /dev/sda1 | grep -i "mount count"
dumpe2fs /dev/sda1 | grep -i superblock
```

**Informacion relevante que muestra:**
- Conteo de inodos y bloques
- Tamano de bloques
- Conteo de montajes y maximo de montajes
- Estado del FS (clean/not clean)
- Ultimo montaje y ultima verificacion
- Features del FS (has_journal, extents, etc.)
- Ubicaciones de los superbloques de respaldo

### 4.3 xfs_info

`xfs_info` muestra informacion sobre un sistema XFS. A diferencia de `dumpe2fs`, acepta el **punto de montaje** (el FS debe estar montado).

```bash
# Mostrar informacion de un XFS montado
xfs_info /mnt/datos

# Tambien funciona con el dispositivo
xfs_info /dev/sda1
```

---

## 5. Herramientas de depuracion de sistemas de archivos

### 5.1 debugfs (para ext2/ext3/ext4)

`debugfs` es un depurador interactivo para sistemas de archivos ext2/ext3/ext4. Permite examinar y modificar estructuras internas del sistema de archivos a bajo nivel.

```bash
# Abrir en modo solo lectura (seguro)
debugfs /dev/sda1

# Abrir en modo lectura-escritura (peligroso)
debugfs -w /dev/sda1
```

**Comandos internos de debugfs:**

| Comando | Descripcion |
|---------|-------------|
| `ls` | Listar archivos del directorio actual |
| `cd directorio` | Cambiar directorio |
| `stat archivo` | Mostrar informacion del inodo de un archivo |
| `cat archivo` | Mostrar contenido de un archivo |
| `lsdel` | Listar inodos de archivos borrados |
| `undel inodo nombre` | Intentar recuperar un archivo borrado |
| `dump archivo destino` | Extraer un archivo del FS |
| `icheck bloque` | Ver que inodo usa un bloque |
| `ncheck inodo` | Ver el nombre de archivo de un inodo |
| `quit` | Salir |

```bash
# Ejemplo: examinar un archivo borrado
debugfs /dev/sda1
debugfs:  lsdel              # Lista archivos borrados con sus inodos
debugfs:  stat <12345>       # Ver datos del inodo 12345
debugfs:  quit
```

> **Para el examen**: `debugfs` es util para examinar la estructura interna de ext2/ext3/ext4 y para recuperar archivos borrados. El FS debe estar preferiblemente desmontado o montado como solo lectura.

### 5.2 xfs_db (depurador para XFS)

`xfs_db` es el depurador de bajo nivel para sistemas de archivos XFS. Permite examinar y modificar las estructuras internas de XFS.

```bash
# Examinar un sistema XFS (debe estar desmontado)
xfs_db /dev/sda1

# Modo solo lectura explicito
xfs_db -r /dev/sda1
```

**Comandos internos de xfs_db:**

| Comando | Descripcion |
|---------|-------------|
| `sb` | Examinar el superbloque |
| `sb 0` | Ir al superbloque primario |
| `print` | Imprimir la estructura actual |
| `inode N` | Examinar el inodo N |
| `freesp` | Mostrar estadisticas de espacio libre |
| `quit` | Salir |

```bash
# Ejemplo: ver informacion del superbloque
xfs_db /dev/sda1
xfs_db> sb 0
xfs_db> print
xfs_db> quit
```

### 5.3 xfs_fsr (desfragmentacion de XFS)

`xfs_fsr` (XFS filesystem reorganizer) desfragmenta un sistema de archivos XFS que esta **montado**. A diferencia de ext4 (que rara vez necesita desfragmentacion), XFS puede beneficiarse de la reorganizacion.

```bash
# Desfragmentar todo el sistema XFS montado (se ejecuta durante un tiempo limitado)
xfs_fsr /dev/sda1

# Desfragmentar un archivo especifico
xfs_fsr /ruta/al/archivo

# Ejecutar durante un tiempo especifico (en segundos)
xfs_fsr -t 600 /dev/sda1

# Modo verbose
xfs_fsr -v /dev/sda1
```

> **Para el examen**: `xfs_fsr` funciona en sistemas XFS **montados** (a diferencia de la mayoria de herramientas de reparacion que requieren FS desmontado). `xfs_db` es el equivalente XFS de `debugfs` para ext.

---

## 6. Puntos clave para el examen

1. **`fsck` solo en FS desmontado** o montado como solo lectura. NUNCA en FS montado en lectura-escritura.

2. **`df -i`** muestra el uso de inodos. Un FS puede estar "lleno" por agotamiento de inodos aunque quede espacio en bloques.

3. **`df -h`** para espacio legible, **`df -T`** para ver el tipo de FS.

4. **`du -sh`** da un resumen en formato legible del tamano de un directorio.

5. **`tune2fs -l`** muestra informacion del superbloque (solo ext). **`tune2fs -c`** y **`tune2fs -i`** configuran la verificacion automatica.

6. **`tune2fs -j`** anade journaling a ext2, convirtiendolo efectivamente en ext3.

7. **`dumpe2fs`** muestra informacion detallada incluyendo ubicaciones de superbloques de respaldo.

8. **`xfs_repair`** es la herramienta real para reparar XFS (no `fsck.xfs`).

9. **`xfs_info`** necesita que el FS este montado y acepta el punto de montaje.

10. El **superbloque** contiene metadatos criticos del FS. Los sistemas ext mantienen copias de respaldo.

11. Los **inodos** contienen metadatos de archivos pero NO el nombre del archivo.
