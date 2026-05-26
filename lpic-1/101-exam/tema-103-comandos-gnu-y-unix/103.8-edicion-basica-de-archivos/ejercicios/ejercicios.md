# 103.8 - Edicion basica de archivos: Ejercicios

## Pregunta 1
Un usuario ha abierto un archivo con `vi` y ha realizado varios cambios. Ahora quiere guardar los cambios y salir. Cual de los siguientes comandos NO logra este objetivo?

A) `:wq`
B) `ZZ`
C) `:x`
D) `:q!`

<details>
<summary>Respuesta</summary>

**D) `:q!`**

`:q!` sale de vi **descartando todos los cambios** sin guardarlos. Es el comando para "salir sin guardar". Las otras tres opciones si guardan y salen: `:wq` (write and quit), `ZZ` (atajo en modo normal equivalente a `:wq`), y `:x` (guarda solo si hay cambios y sale). Para el examen, es importante recordar que `!` despues de `:q` fuerza la salida sin guardar.
</details>

---

## Pregunta 2
En vi, un usuario esta en modo normal y quiere insertar texto al final de la linea actual. Cual es la tecla correcta?

A) `i`
B) `a`
C) `A`
D) `o`

<details>
<summary>Respuesta</summary>

**C) `A`**

`A` (mayuscula) mueve el cursor al **final de la linea actual** y entra en modo insercion. `i` inserta **antes** del cursor (en su posicion actual). `a` inserta **despues** del cursor (un caracter a la derecha). `o` abre una **nueva linea debajo** de la actual y entra en modo insercion. La diferencia entre `a` y `A` es que `a` inserta despues de la posicion actual del cursor, mientras que `A` siempre va al final de la linea.
</details>

---

## Pregunta 3
Que comando de vi reemplaza todas las ocurrencias de "foo" por "bar" en todo el archivo, pidiendo confirmacion en cada una?

A) `:%s/foo/bar/g`
B) `:%s/foo/bar/gc`
C) `:s/foo/bar/gc`
D) `:%s/foo/bar/c`

<details>
<summary>Respuesta</summary>

**B) `:%s/foo/bar/gc`**

`:%s/foo/bar/gc` es el comando correcto. `%` indica todo el archivo, `s` es sustituir, `g` es global (todas las ocurrencias en cada linea, no solo la primera), y `c` pide confirmacion (confirm) antes de cada reemplazo. La opcion A reemplaza todo sin pedir confirmacion. La opcion C solo actua sobre la **linea actual** (falta el `%`). La opcion D reemplaza en todo el archivo con confirmacion pero solo la **primera ocurrencia** de cada linea (falta `g`).
</details>

---

## Pregunta 4
Un usuario abre vi y quiere ir directamente a la linea 50 del archivo. Cual de los siguientes metodos es correcto?

A) Escribir `50` y luego presionar `G`
B) Ejecutar `:50` en modo comando
C) Abrir con `vi +50 archivo.txt`
D) Todas las anteriores son correctas

<details>
<summary>Respuesta</summary>

**D) Todas las anteriores son correctas**

Las tres formas son validas para ir a la linea 50: `50G` en modo normal antepone el numero al comando `G` (ir a linea). `:50` en modo comando mueve el cursor a la linea 50. Y `vi +50 archivo.txt` abre el archivo directamente en la linea 50 desde la linea de comandos. Todas son formas validas y pueden aparecer en el examen.
</details>

---

## Pregunta 5
En vi, cual es la diferencia entre `dd` y `yy`?

A) `dd` borra la linea y `yy` la copia; ambos almacenan en el buffer
B) `dd` borra la linea permanentemente y `yy` la mueve al buffer
C) `dd` y `yy` hacen lo mismo pero en diferente modo
D) `dd` borra un caracter y `yy` copia un caracter

<details>
<summary>Respuesta</summary>

**A) `dd` borra la linea y `yy` la copia; ambos almacenan en el buffer**

`dd` **corta** (borra) la linea completa actual y la almacena en el buffer. `yy` **copia** (yank) la linea completa actual al buffer sin borrarla. En ambos casos, el contenido queda en el buffer y puede ser pegado con `p` (despues/debajo) o `P` (antes/encima). La diferencia clave es que `dd` elimina la linea del texto mientras que `yy` la deja intacta. `dd` funciona como "cortar" y `yy` como "copiar" en editores convencionales.
</details>

---

## Pregunta 6
En nano, cual es el atajo de teclado para guardar un archivo?

A) `Ctrl+S`
B) `Ctrl+W`
C) `Ctrl+O`
D) `Ctrl+X`

<details>
<summary>Respuesta</summary>

**C) `Ctrl+O`**

En nano, `Ctrl+O` (Write Out) guarda el archivo. Nano pide confirmacion del nombre del archivo y luego lo escribe a disco. `Ctrl+S` no es un atajo estandar de nano (es comun en otros editores). `Ctrl+W` es para buscar texto (Where is). `Ctrl+X` es para salir de nano (si hay cambios sin guardar, pregunta si desea guardarlos antes de salir). Los atajos de nano son diferentes a los de otros editores, y se muestran en la parte inferior de la pantalla.
</details>

---

## Pregunta 7
Un administrador necesita deshacer los ultimos 5 cambios realizados en vi. Que debe hacer?

A) Presionar `u` cinco veces
B) Presionar `U` una vez
C) Ejecutar `:undo 5`
D) Presionar `Ctrl+Z` cinco veces

<details>
<summary>Respuesta</summary>

**A) Presionar `u` cinco veces**

En vim, la tecla `u` deshace la ultima accion, y se puede presionar multiples veces para deshacer acciones sucesivas (deshacer multinivel). Presionar `u` cinco veces deshace los ultimos 5 cambios. `U` (mayuscula) deshace todos los cambios realizados en la linea actual, pero solo mientras no te hayas movido a otra linea; no es lo mismo que deshacer 5 acciones. `:undo 5` no es un comando estandar de vi. `Ctrl+Z` no deshace en vi; en modo normal no tiene efecto y en la terminal suspendia el proceso.
</details>

---

## Pregunta 8
Que variable de entorno se utiliza para definir el editor de texto predeterminado en Linux?

A) `SHELL`
B) `EDITOR`
C) `TERM`
D) `DISPLAY`

<details>
<summary>Respuesta</summary>

**B) `EDITOR`**

La variable de entorno `EDITOR` define el editor de texto predeterminado que utilizan muchos programas cuando necesitan que el usuario edite texto (por ejemplo, `crontab -e`, `visudo`, `git commit`). Tambien existe `VISUAL`, que se usa para editores de pantalla completa. `SHELL` define el shell por defecto del usuario. `TERM` define el tipo de terminal. `DISPLAY` se usa para indicar el servidor X Window. Para configurar el editor, se usa `export EDITOR=vi` (o `nano`, `vim`, etc.) en `~/.bashrc` o `~/.profile`.
</details>
