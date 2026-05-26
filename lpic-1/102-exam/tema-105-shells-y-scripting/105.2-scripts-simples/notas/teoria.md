# 105.2 - Teoria: Personalizar o escribir scripts simples

## 1. Shebang y ejecucion de scripts

### Shebang (hashbang)
La primera linea de un script indica que interprete debe usarse para ejecutarlo:
```bash
#!/bin/bash       # Usar bash
#!/bin/sh         # Usar sh (POSIX compatible)
#!/usr/bin/env bash   # Buscar bash en el PATH (mas portable)
#!/usr/bin/python3    # Script Python
```

**IMPORTANTE:** El shebang DEBE ser la primera linea del archivo, sin espacios antes de `#!`.

### **`#!/usr/bin/env bash` - Shebang portable (IMPORTANTE para el examen)**

La forma **`#!/usr/bin/env bash`** es la alternativa portable recomendada frente a `#!/bin/bash`:

- **`#!/bin/bash`**: Ruta absoluta. Asume que bash esta en `/bin/bash`. Puede fallar en sistemas donde bash esta en otra ubicacion (ej: `/usr/local/bin/bash` en FreeBSD).
- **`#!/usr/bin/env bash`**: Usa el comando `env` para buscar `bash` en el `PATH` del sistema. Funciona independientemente de donde este instalado bash.

```bash
#!/usr/bin/env bash
# Este script funcionara en cualquier sistema donde bash este en el PATH,
# sin importar su ubicacion exacta en el sistema de archivos.
echo "Script portable ejecutandose con bash"
```

**Ventaja:** Maxima portabilidad entre diferentes distribuciones Linux, BSD y macOS.
**Desventaja:** No se pueden pasar opciones adicionales al interprete de forma portable (ej: `#!/usr/bin/env bash -x` puede no funcionar en todos los sistemas).

### Permisos de ejecucion
```bash
# Dar permiso de ejecucion
chmod +x mi_script.sh
chmod 755 mi_script.sh

# Formas de ejecutar un script
./mi_script.sh          # Requiere permiso de ejecucion y shebang
bash mi_script.sh       # No requiere permiso de ejecucion ni shebang
source mi_script.sh     # Ejecuta en el shell actual (sin subshell)
```

---

## 2. Variables

### Asignacion y uso
```bash
# Asignar (SIN espacios alrededor del =)
nombre="Sandra"
edad=25

# Acceder al valor
echo $nombre
echo ${nombre}      # Con llaves (recomendado para evitar ambiguedades)
echo "${nombre}_backup"   # Necesario cuando hay texto pegado

# Variable sin valor / vacia
vacia=""
echo ${vacia:-"valor_defecto"}   # Usa "valor_defecto" si vacia esta vacia o no definida
```

### Comillas y expansiones
```bash
# Comillas dobles: permiten expansion de variables y comandos
echo "Hola $nombre"       # Hola Sandra
echo "Fecha: $(date)"     # Fecha: lun 26 may 2026 ...

# Comillas simples: todo es literal, sin expansion
echo 'Hola $nombre'       # Hola $nombre

# Backticks (obsoleto, pero aun valido): sustitucion de comandos
echo "Fecha: `date`"      # Equivalente a $(date)
```

### Sustitucion de comandos
```bash
# Forma moderna (recomendada)
archivos=$(ls /tmp)
fecha=$(date +%Y-%m-%d)

# Forma antigua (backticks)
archivos=`ls /tmp`
```

---

## 3. Parametros posicionales y variables especiales

| Variable | Descripcion |
|----------|-------------|
| `$0` | Nombre del script |
| `$1` a `$9` | Parametros posicionales (argumentos) |
| `${10}` | Parametro 10 en adelante (requiere llaves) |
| `$#` | Numero de parametros pasados al script |
| `$@` | Todos los parametros como palabras separadas (`"$@"` = `"$1" "$2" "$3"`) |
| `$*` | Todos los parametros como una sola cadena (`"$*"` = `"$1 $2 $3"`) |
| `$?` | Codigo de salida del ultimo comando (0 = exito, distinto de 0 = error) |
| `$$` | PID del shell actual |
| `$!` | PID del ultimo proceso en segundo plano |

### Diferencia entre `$@` y `$*`
```bash
#!/bin/bash
# Si se ejecuta: ./script.sh "arg 1" "arg 2" "arg 3"

# Con "$@" (preserva las comillas de cada argumento)
for arg in "$@"; do
    echo "Argumento: $arg"
done
# Argumento: arg 1
# Argumento: arg 2
# Argumento: arg 3

# Con "$*" (todo es un solo string)
for arg in "$*"; do
    echo "Argumento: $arg"
done
# Argumento: arg 1 arg 2 arg 3
```

**Para el examen:** `"$@"` es casi siempre la opcion correcta para iterar sobre argumentos.

---

## 4. Lectura de entrada: read

```bash
# Leer una variable
echo "Cual es tu nombre?"
read nombre
echo "Hola, $nombre"

# Leer con prompt integrado (-p)
read -p "Introduce tu edad: " edad

# Leer en silencio (-s) - para contrasenas
read -sp "Password: " password
echo    # Salto de linea despues de -s

# Leer multiples variables
read -p "Nombre y apellido: " nombre apellido

# Leer con timeout (-t segundos)
read -t 5 -p "Tienes 5 segundos: " respuesta

# Leer con limite de caracteres (-n)
read -n 1 -p "Continuar? (s/n): " opcion
```

---

## 5. Evaluacion de condiciones: test, [ ] y [[ ]]

### El comando test y [ ]
`test` y `[ ]` son equivalentes. `[` es literalmente un comando (requiere espacio despues y `]` al final).

```bash
# Son equivalentes:
test -f /etc/passwd
[ -f /etc/passwd ]
```

### Comparaciones numericas

| Operador | Significado |
|----------|-------------|
| `-eq` | Igual (equal) |
| `-ne` | No igual (not equal) |
| `-gt` | Mayor que (greater than) |
| `-lt` | Menor que (less than) |
| `-ge` | Mayor o igual (greater or equal) |
| `-le` | Menor o igual (less or equal) |

```bash
[ $edad -eq 25 ]     # $edad es igual a 25?
[ $num -gt 10 ]      # $num es mayor que 10?
```

### Comparaciones de cadenas

| Operador | Significado |
|----------|-------------|
| `=` | Cadenas iguales |
| `!=` | Cadenas diferentes |
| `-z` | Cadena vacia (zero length) |
| `-n` | Cadena no vacia (non-zero length) |

```bash
[ "$nombre" = "Sandra" ]   # Son iguales?
[ -z "$variable" ]         # Esta vacia?
[ -n "$variable" ]         # NO esta vacia?
```

**IMPORTANTE:** Siempre usar comillas dobles alrededor de las variables en `[ ]` para evitar errores si la variable esta vacia.

### Operadores de archivos

| Operador | Significado |
|----------|-------------|
| `-e` | Existe (exist) |
| `-f` | Es un archivo regular (file) |
| `-d` | Es un directorio (directory) |
| `-r` | Tiene permiso de lectura (read) |
| `-w` | Tiene permiso de escritura (write) |
| `-x` | Tiene permiso de ejecucion (execute) |
| `-s` | Existe y tiene tamano mayor que cero (size) |
| `-L` | Es un enlace simbolico (link) |

```bash
[ -f /etc/passwd ]       # Es un archivo regular?
[ -d /home/sandra ]      # Es un directorio?
[ -x /usr/bin/vim ]      # Tiene permiso de ejecucion?
```

### Operadores logicos en [ ]

| Operador | Significado |
|----------|-------------|
| `-a` | AND (dentro de [ ]) |
| `-o` | OR (dentro de [ ]) |
| `!` | NOT (negacion) |

```bash
[ -f /etc/passwd -a -r /etc/passwd ]   # Existe Y es legible?
[ -d /tmp -o -d /var/tmp ]             # Uno u otro es directorio?
[ ! -f /tmp/lock ]                      # NO existe el archivo?
```

### [[ ]] - Version extendida de bash

`[[ ]]` es una construccion de bash (no POSIX) con ventajas:

| Caracteristica | `[ ]` | `[[ ]]` |
|----------------|-------|---------|
| Operadores logicos | `-a`, `-o` | `&&`, `\|\|` |
| Pattern matching | No | Si (`==` con globbing) |
| Regex | No | Si (`=~`) |
| Word splitting | Si (riesgo) | No (mas seguro) |
| POSIX compatible | Si | No (solo bash) |

```bash
[[ -f /etc/passwd && -r /etc/passwd ]]   # AND con &&
[[ "$nombre" == S* ]]                     # Pattern matching
[[ "$email" =~ ^[a-z]+@[a-z]+\.[a-z]+$ ]]  # Regex
```

---

## 6. Estructuras de control

### if / elif / else / fi
```bash
#!/bin/bash
if [ $# -eq 0 ]; then
    echo "No se proporcionaron argumentos"
elif [ $# -eq 1 ]; then
    echo "Se proporciono un argumento: $1"
else
    echo "Se proporcionaron $# argumentos"
fi
```

### case / esac
Ideal para comparar una variable contra multiples patrones:
```bash
#!/bin/bash
case "$1" in
    start)
        echo "Iniciando servicio..."
        ;;
    stop)
        echo "Deteniendo servicio..."
        ;;
    restart|reload)
        echo "Reiniciando servicio..."
        ;;
    *)
        echo "Uso: $0 {start|stop|restart}"
        exit 1
        ;;
esac
```

**Nota:** Cada patron termina con `)`, cada bloque termina con `;;`, y la estructura completa con `esac` (case al reves).

### for / do / done
```bash
# Iterar sobre una lista
for fruta in manzana pera naranja; do
    echo "Fruta: $fruta"
done

# Iterar sobre archivos
for archivo in /tmp/*.log; do
    echo "Procesando: $archivo"
done

# Iterar sobre la salida de un comando
for usuario in $(cat /etc/passwd | cut -d: -f1); do
    echo "Usuario: $usuario"
done

# Con seq (secuencia numerica)
for i in $(seq 1 10); do
    echo "Numero: $i"
done

# Estilo C (solo bash)
for ((i=0; i<10; i++)); do
    echo "Iteracion: $i"
done
```

### while / do / done
Ejecuta mientras la condicion sea verdadera:
```bash
#!/bin/bash
contador=1
while [ $contador -le 5 ]; do
    echo "Contador: $contador"
    contador=$((contador + 1))
done

# Leer archivo linea por linea
while read linea; do
    echo "Linea: $linea"
done < /etc/hostname
```

### until / do / done
Ejecuta **hasta que** la condicion sea verdadera (opuesto a while):
```bash
#!/bin/bash
contador=1
until [ $contador -gt 5 ]; do
    echo "Contador: $contador"
    contador=$((contador + 1))
done
```

---

## 7. seq - Generar secuencias numericas

```bash
seq 5              # 1 2 3 4 5
seq 3 7            # 3 4 5 6 7
seq 0 2 10         # 0 2 4 6 8 10 (inicio incremento fin)
seq -w 1 10        # 01 02 03 ... 10 (con ceros a la izquierda)
seq -s "," 1 5     # 1,2,3,4,5 (separador personalizado)
```

---

## 8. Aritmetica del shell

```bash
# $(( )) - Expansion aritmetica (forma recomendada)
resultado=$((5 + 3))
echo $((10 / 3))        # 3 (division entera)
echo $((10 % 3))        # 1 (modulo)
echo $((2 ** 10))       # 1024 (potencia)

# Incremento/decremento
i=$((i + 1))
((i++))                  # Incrementar
((i--))                  # Decrementar

# let (alternativa)
let "resultado = 5 + 3"
let "i++"

# expr (externo, mas antiguo)
resultado=$(expr 5 + 3)   # Necesita espacios alrededor de operadores
```

---

## 9. Codigos de salida (exit codes)

Todo comando en Linux devuelve un codigo de salida:
- `0` = exito
- `1-255` = error (distintos codigos para diferentes errores)

```bash
# Verificar el codigo del ultimo comando
echo $?

# Establecer el codigo de salida de un script
exit 0       # Termina con exito
exit 1       # Termina con error

# Uso en condicionales
if grep -q "patron" archivo.txt; then
    echo "Patron encontrado"
else
    echo "Patron no encontrado"
fi

# Operadores logicos con codigos de salida
comando1 && comando2    # comando2 se ejecuta SOLO si comando1 tiene exito (0)
comando1 || comando2    # comando2 se ejecuta SOLO si comando1 falla (no 0)
```

---

## 10. exec

`exec` reemplaza el shell actual con el comando especificado (no crea un nuevo proceso):

```bash
# Reemplazar el shell por otro programa
exec /bin/zsh          # El shell actual se reemplaza por zsh

# Redireccion permanente de file descriptors
exec > /tmp/salida.log    # Toda la salida estandar va al archivo
exec 2>&1                 # stderr redirigido a stdout
exec 3< /etc/passwd       # Abre archivo en file descriptor 3
```

**IMPORTANTE:** Despues de `exec comando`, el script no continua (el proceso fue reemplazado). Con `exec` de redireccion, el script si continua.

---

## 11. Here Documents (heredoc)

Permite pasar bloques de texto como entrada estandar a un comando:

```bash
# Heredoc basico
cat << EOF
Hola $nombre
Fecha: $(date)
Esto es un heredoc
EOF

# Heredoc sin expansion de variables (comillas en el delimitador)
cat << 'EOF'
Esto es literal: $nombre
No se expande: $(date)
EOF

# Heredoc con supresion de tabulaciones (<<-)
cat <<- EOF
	Esta linea tiene tabulacion
	Pero <<- la elimina
EOF

# Uso practico: crear archivos
cat << EOF > /tmp/config.txt
servidor=192.168.1.1
puerto=8080
usuario=$USER
EOF
```

---

## 12. Ejemplo completo de script

```bash
#!/bin/bash
# Script de backup con parametros

# Verificar argumentos
if [ $# -lt 1 ]; then
    echo "Uso: $0 <directorio> [destino]"
    exit 1
fi

ORIGEN="$1"
DESTINO="${2:-/tmp/backups}"
FECHA=$(date +%Y%m%d_%H%M%S)

# Verificar que el origen existe
if [ ! -d "$ORIGEN" ]; then
    echo "Error: $ORIGEN no es un directorio valido"
    exit 2
fi

# Crear directorio de destino si no existe
[ -d "$DESTINO" ] || mkdir -p "$DESTINO"

# Crear backup
NOMBRE_BACKUP="backup_${FECHA}.tar.gz"
tar czf "${DESTINO}/${NOMBRE_BACKUP}" "$ORIGEN" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "Backup creado exitosamente: ${DESTINO}/${NOMBRE_BACKUP}"
    exit 0
else
    echo "Error al crear el backup"
    exit 3
fi
```

---

## Resumen para el examen

1. **Shebang** `#!/bin/bash` debe ser la primera linea; **`#!/usr/bin/env bash`** es la alternativa portable
2. `$@` preserva argumentos individuales; `$*` los une en uno solo
3. `$?` contiene el codigo de salida del ultimo comando (0 = exito)
4. `[ ]` es POSIX compatible; `[[ ]]` es extension de bash con mas funciones
5. En `[ ]`: usar `-a`/`-o` para logica; en `[[ ]]`: usar `&&`/`||`
6. Comparaciones numericas: `-eq`, `-ne`, `-gt`, `-lt`, `-ge`, `-le`
7. Comparaciones de cadenas: `=`, `!=`, `-z` (vacia), `-n` (no vacia)
8. `case` termina con `esac`; cada opcion con `)`; cada bloque con `;;`
9. `$(( ))` para aritmetica; `$( )` para sustitucion de comandos
10. Siempre entrecomillar variables en `[ ]`: `[ "$var" = "valor" ]`
