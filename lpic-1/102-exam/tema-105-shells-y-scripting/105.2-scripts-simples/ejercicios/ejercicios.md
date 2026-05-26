# 105.2 - Ejercicios: Personalizar o escribir scripts simples

## Ejercicio 1
Cual es la diferencia entre `$@` y `$*` cuando se usan con comillas dobles? Dado el script `./test.sh "uno dos" tres`, que imprime cada variante en un bucle `for`?

<details>
<summary>Respuesta</summary>

**`"$@"`** expande cada argumento como una palabra separada, respetando las comillas originales:
```bash
for arg in "$@"; do echo "$arg"; done
# uno dos
# tres
```

**`"$*"`** expande todos los argumentos como una sola cadena:
```bash
for arg in "$*"; do echo "$arg"; done
# uno dos tres
```

Con `"$@"` se obtienen 2 iteraciones (preserva los argumentos originales). Con `"$*"` se obtiene 1 sola iteracion (todo junto). En la practica, `"$@"` es casi siempre la opcion correcta.
</details>

---

## Ejercicio 2
Escribe un script que reciba un nombre de archivo como argumento y determine si: existe, es archivo regular o directorio, y si tiene permisos de lectura, escritura y ejecucion.

<details>
<summary>Respuesta</summary>

```bash
#!/bin/bash
if [ $# -ne 1 ]; then
    echo "Uso: $0 <archivo>"
    exit 1
fi

ARCHIVO="$1"

if [ ! -e "$ARCHIVO" ]; then
    echo "$ARCHIVO no existe"
    exit 2
fi

if [ -f "$ARCHIVO" ]; then
    echo "$ARCHIVO es un archivo regular"
elif [ -d "$ARCHIVO" ]; then
    echo "$ARCHIVO es un directorio"
elif [ -L "$ARCHIVO" ]; then
    echo "$ARCHIVO es un enlace simbolico"
fi

[ -r "$ARCHIVO" ] && echo "Tiene permiso de lectura"
[ -w "$ARCHIVO" ] && echo "Tiene permiso de escritura"
[ -x "$ARCHIVO" ] && echo "Tiene permiso de ejecucion"
[ -s "$ARCHIVO" ] && echo "Tiene tamano mayor que cero"
```

Se usan los operadores de archivo de `test`: `-e` (existe), `-f` (archivo regular), `-d` (directorio), `-L` (enlace simbolico), `-r` (lectura), `-w` (escritura), `-x` (ejecucion), `-s` (tamano > 0).
</details>

---

## Ejercicio 3
Cual es la diferencia entre `[ ]` y `[[ ]]`? En que casos usarias uno u otro? Por que se recomienda entrecomillar variables dentro de `[ ]` pero no es estrictamente necesario en `[[ ]]`?

<details>
<summary>Respuesta</summary>

**`[ ]` (test):**
- Compatible con POSIX (funciona en cualquier shell)
- Usa `-a` y `-o` para AND/OR
- Requiere entrecomillar variables: si `$var` esta vacia, `[ $var = "algo" ]` genera error de sintaxis porque se expande a `[ = "algo" ]`
- No soporta pattern matching ni regex

**`[[ ]]` (bash extendido):**
- Exclusivo de bash (no POSIX)
- Usa `&&` y `||` para AND/OR (mas intuitivo)
- No necesita entrecomillar variables: `[[ $var = "algo" ]]` funciona incluso si `$var` esta vacia, porque bash maneja `[[ ]]` de forma especial sin word splitting
- Soporta pattern matching (`==` con globbing) y regex (`=~`)

**Cuando usar cada uno:**
- `[ ]`: En scripts que deben ser POSIX compatibles (ejecutados con `/bin/sh`)
- `[[ ]]`: En scripts bash donde se necesite pattern matching, regex o mayor seguridad
</details>

---

## Ejercicio 4
Escribe un script con `case` que reciba una extension de archivo como argumento y muestre el tipo de archivo. Incluye al menos 5 tipos y un caso por defecto.

<details>
<summary>Respuesta</summary>

```bash
#!/bin/bash
if [ $# -ne 1 ]; then
    echo "Uso: $0 <extension>"
    exit 1
fi

case "$1" in
    txt|text)
        echo "Archivo de texto plano"
        ;;
    sh|bash)
        echo "Script de shell"
        ;;
    py|python)
        echo "Script de Python"
        ;;
    jpg|jpeg|png|gif|bmp)
        echo "Archivo de imagen"
        ;;
    tar|gz|bz2|xz|zip)
        echo "Archivo comprimido"
        ;;
    conf|cfg|ini)
        echo "Archivo de configuracion"
        ;;
    *)
        echo "Tipo de archivo desconocido: $1"
        exit 1
        ;;
esac
```

**Puntos clave de `case`:**
- Cada patron termina con `)`
- Se pueden usar multiples patrones separados por `|` (OR)
- Cada bloque termina con `;;`
- `*)` es el caso por defecto (catch-all)
- La estructura cierra con `esac` (case al reves)
</details>

---

## Ejercicio 5
Que imprime el siguiente script y por que?
```bash
#!/bin/bash
x=10
if [ $x -gt 5 -a $x -lt 20 ]; then
    echo "A"
fi
if [[ $x -gt 5 && $x -lt 20 ]]; then
    echo "B"
fi
resultado=$((x * 2 + 5))
echo $resultado
echo $?
```

<details>
<summary>Respuesta</summary>

El script imprime:
```
A
B
25
0
```

**Explicacion:**
1. `x=10`
2. `[ $x -gt 5 -a $x -lt 20 ]`: 10 > 5 AND 10 < 20 = verdadero. Usa `-a` como AND dentro de `[ ]`. Imprime `A`.
3. `[[ $x -gt 5 && $x -lt 20 ]]`: Misma logica pero con `&&` dentro de `[[ ]]`. Imprime `B`.
4. `resultado=$((x * 2 + 5))`: Aritmetica del shell: 10 * 2 + 5 = 25. Nota: dentro de `$(( ))` no se necesita `$` antes de la variable.
5. `echo $resultado`: Imprime `25`.
6. `echo $?`: Imprime `0` porque el `echo` anterior se ejecuto con exito.
</details>

---

## Ejercicio 6
Escribe un script que use `while` y `read` para leer el archivo `/etc/passwd` linea por linea y muestre solo el nombre de usuario y su shell (campos 1 y 7), pero solo para usuarios cuyo UID (campo 3) sea mayor o igual a 1000.

<details>
<summary>Respuesta</summary>

```bash
#!/bin/bash
while IFS=: read usuario password uid gid gecos home shell; do
    if [ "$uid" -ge 1000 ] 2>/dev/null; then
        echo "Usuario: $usuario - Shell: $shell"
    fi
done < /etc/passwd
```

**Explicacion:**
- `IFS=:` establece el separador de campos como `:` (formato de /etc/passwd)
- `read usuario password uid gid gecos home shell` lee los 7 campos
- `[ "$uid" -ge 1000 ]` filtra por UID >= 1000 (usuarios regulares)
- `2>/dev/null` suprime errores si algun UID no es numerico (como `nfsnobody`)
- `done < /etc/passwd` redirige el archivo como entrada del bucle while

Alternativa mas simple con `cut`:
```bash
#!/bin/bash
while read linea; do
    uid=$(echo "$linea" | cut -d: -f3)
    if [ "$uid" -ge 1000 ] 2>/dev/null; then
        usuario=$(echo "$linea" | cut -d: -f1)
        shell=$(echo "$linea" | cut -d: -f7)
        echo "Usuario: $usuario - Shell: $shell"
    fi
done < /etc/passwd
```
</details>

---

## Ejercicio 7
Que hace `exec` en los siguientes contextos? Explica la diferencia entre cada uso.
```bash
# Caso 1
exec /bin/zsh

# Caso 2
exec > /tmp/log.txt
echo "Este mensaje va al archivo"

# Caso 3
exec 3< /etc/passwd
read linea <&3
```

<details>
<summary>Respuesta</summary>

**Caso 1: `exec /bin/zsh`**
Reemplaza el proceso actual del shell (bash) por `/bin/zsh`. El shell bash deja de existir y es sustituido por zsh. Cualquier linea despues de este `exec` NO se ejecutara porque el proceso original ya no existe.

**Caso 2: `exec > /tmp/log.txt`**
Redirige permanentemente la salida estandar (stdout) del shell actual al archivo `/tmp/log.txt`. A partir de esta linea, TODOS los `echo` y salidas van al archivo en lugar de la pantalla. El script SI continua ejecutandose (no hay comando que reemplace el shell).

**Caso 3: `exec 3< /etc/passwd`**
Abre el archivo `/etc/passwd` y lo asigna al file descriptor 3. Luego, `read linea <&3` lee una linea desde ese file descriptor. El script continua. Para cerrar el descriptor se usa `exec 3<&-`.

**Regla general:** `exec` con un comando reemplaza el shell. `exec` con solo redirecciones modifica los file descriptors del shell actual sin reemplazarlo.
</details>

---

## Ejercicio 8
Escribe un here document que genere un archivo HTML basico en `/tmp/pagina.html` usando variables del shell para el titulo y el contenido. Luego explica que pasaria si usaras `<< 'EOF'` en lugar de `<< EOF`.

<details>
<summary>Respuesta</summary>

```bash
#!/bin/bash
TITULO="Mi Pagina"
CONTENIDO="Bienvenido, $USER"
FECHA=$(date)

cat << EOF > /tmp/pagina.html
<!DOCTYPE html>
<html>
<head>
    <title>$TITULO</title>
</head>
<body>
    <h1>$TITULO</h1>
    <p>$CONTENIDO</p>
    <p>Generado: $FECHA</p>
</body>
</html>
EOF
```

**Con `<< EOF`:** Las variables `$TITULO`, `$CONTENIDO`, `$USER` y `$FECHA` se expanden a sus valores. El HTML tendra el contenido real.

**Con `<< 'EOF'` (comillas en el delimitador):** NINGUNA variable se expande. El archivo contendria literalmente `$TITULO`, `$CONTENIDO`, etc. como texto plano. Las comillas alrededor del delimitador desactivan toda expansion de variables y sustitucion de comandos dentro del heredoc.
</details>
