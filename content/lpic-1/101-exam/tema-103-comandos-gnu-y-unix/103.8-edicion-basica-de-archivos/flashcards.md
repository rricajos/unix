---
title: "103.8 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "103.8"
---

# Flashcards: 103.8 - Edicion Basica De Archivos

> 21 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-001">
<div class="flashcard-front">

**P:** Un usuario ha abierto un archivo con `vi` y ha realizado varios cambios. Ahora quiere guardar los cambios y salir. Cual de los siguientes comandos NO logra este objetivo?

</div>
<div class="flashcard-back">

**R:** D) `:q!`. `:q!` sale de vi **descartando todos los cambios** sin guardarlos. Es el comando para "salir sin guardar". Las otras tres opciones si guardan y salen: `:wq` (write and quit), `ZZ` (atajo en modo normal equivalente a `:wq`), y `:x` (guarda solo si hay cambios y sale). Para el examen, es importante recordar que `!` despues de `:q` fuerza la salida sin guardar.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-002">
<div class="flashcard-front">

**P:** En vi, un usuario esta en modo normal y quiere insertar texto al final de la linea actual. Cual es la tecla correcta?

</div>
<div class="flashcard-back">

**R:** C) `A`. `A` (mayuscula) mueve el cursor al **final de la linea actual** y entra en modo insercion. `i` inserta **antes** del cursor (en su posicion actual). `a` inserta **despues** del cursor (un caracter a la derecha). `o` abre una **nueva linea debajo** de la actual y entra en modo insercion. La diferencia entre `a` y `A` es que `a` inserta despues de la posicion actual del cursor, mientras que `A` siempre va al final de la linea.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-003">
<div class="flashcard-front">

**P:** Que comando de vi reemplaza todas las ocurrencias de "foo" por "bar" en todo el archivo, pidiendo confirmacion en cada una?

</div>
<div class="flashcard-back">

**R:** B) `:%s/foo/bar/gc`. `:%s/foo/bar/gc` es el comando correcto. `%` indica todo el archivo, `s` es sustituir, `g` es global (todas las ocurrencias en cada linea, no solo la primera), y `c` pide confirmacion (confirm) antes de cada reemplazo. La opcion A reemplaza todo sin pedir confirmacion. La opcion C solo actua sobre la **linea actual** (falta el `%`). La opcion D reemplaza en todo el archivo con confirmacion pero solo la **primera ocurrencia** de cada linea (falta `g`).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-004">
<div class="flashcard-front">

**P:** Un usuario abre vi y quiere ir directamente a la linea 50 del archivo. Cual de los siguientes metodos es correcto?

</div>
<div class="flashcard-back">

**R:** D) Todas las anteriores son correctas. Las tres formas son validas para ir a la linea 50: `50G` en modo normal antepone el numero al comando `G` (ir a linea). `:50` en modo comando mueve el cursor a la linea 50. Y `vi +50 archivo.txt` abre el archivo directamente en la linea 50 desde la linea de comandos. Todas son formas validas y pueden aparecer en el examen.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-005">
<div class="flashcard-front">

**P:** En vi, cual es la diferencia entre `dd` y `yy`?

</div>
<div class="flashcard-back">

**R:** A) `dd` borra la linea y `yy` la copia; ambos almacenan en el buffer. `dd` **corta** (borra) la linea completa actual y la almacena en el buffer. `yy` **copia** (yank) la linea completa actual al buffer sin borrarla. En ambos casos, el contenido queda en el buffer y puede ser pegado con `p` (despues/debajo) o `P` (antes/encima). La diferencia clave es que `dd` elimina la linea del texto mientras que `yy` la deja intacta. `dd` funciona como "cortar" y `yy` como "copiar" en editores convencionales.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-006">
<div class="flashcard-front">

**P:** En nano, cual es el atajo de teclado para guardar un archivo?

</div>
<div class="flashcard-back">

**R:** C) `Ctrl+O`. En nano, `Ctrl+O` (Write Out) guarda el archivo. Nano pide confirmacion del nombre del archivo y luego lo escribe a disco. `Ctrl+S` no es un atajo estandar de nano (es comun en otros editores). `Ctrl+W` es para buscar texto (Where is). `Ctrl+X` es para salir de nano (si hay cambios sin guardar, pregunta si desea guardarlos antes de salir). Los atajos de nano son diferentes a los de otros editores, y se muestran en la parte inferior de la pantalla.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-007">
<div class="flashcard-front">

**P:** Un administrador necesita deshacer los ultimos 5 cambios realizados en vi. Que debe hacer?

</div>
<div class="flashcard-back">

**R:** A) Presionar `u` cinco veces. En vim, la tecla `u` deshace la ultima accion, y se puede presionar multiples veces para deshacer acciones sucesivas (deshacer multinivel). Presionar `u` cinco veces deshace los ultimos 5 cambios. `U` (mayuscula) deshace todos los cambios realizados en la linea actual, pero solo mientras no te hayas movido a otra linea; no es lo mismo que deshacer 5 acciones. `:undo 5` no es un comando estandar de vi. `Ctrl+Z` no deshace en vi; en modo normal no tiene efecto y en la terminal suspendia el proceso.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-008">
<div class="flashcard-front">

**P:** Que variable de entorno se utiliza para definir el editor de texto predeterminado en Linux?

</div>
<div class="flashcard-back">

**R:** B) `EDITOR`. La variable de entorno `EDITOR` define el editor de texto predeterminado que utilizan muchos programas cuando necesitan que el usuario edite texto (por ejemplo, `crontab -e`, `visudo`, `git commit`). Tambien existe `VISUAL`, que se usa para editores de pantalla completa. `SHELL` define el shell por defecto del usuario. `TERM` define el tipo de terminal. `DISPLAY` se usa para indicar el servidor X Window. Para configurar el editor, se usa `export EDITOR=vi` (o `nano`, `vim`, etc.) en `~/.bashrc` o `~/.profile`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-009">
<div class="flashcard-front">

**P:** Tip de examen: `vimtutor` es la herramienta oficial recomendada para aprender vim. Es un comand...

</div>
<div class="flashcard-back">

**R:** `vimtutor` es la herramienta oficial recomendada para aprender vim. Es un comando disponible en cualquier sistema con vim instalado.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-010">
<div class="flashcard-front">

**P:** Tip de examen: Si estas perdido en vi, presiona `Esc` varias veces para volver al modo normal. ...

</div>
<div class="flashcard-back">

**R:** Si estas perdido en vi, presiona `Esc` varias veces para volver al modo normal. Desde ahi puedes navegar o salir.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-011">
<div class="flashcard-front">

**P:** Tip de examen: Las teclas mas importantes son `i` (insertar), `a` (append), `o` (abrir linea ab...

</div>
<div class="flashcard-back">

**R:** Las teclas mas importantes son `i` (insertar), `a` (append), `o` (abrir linea abajo), `O` (abrir linea arriba), `I` (insertar al inicio) y `A` (insertar al final).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-012">
<div class="flashcard-front">

**P:** Tip de examen: Las marcas son utiles para navegar rapidamente entre posiciones en archivos gran...

</div>
<div class="flashcard-back">

**R:** Las marcas son utiles para navegar rapidamente entre posiciones en archivos grandes. Las mas comunes son las letras minusculas (`ma`, `'a`).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-013">
<div class="flashcard-front">

**P:** Tip de examen: `ZZ` (doble Z mayuscula) es una forma rapida de guardar y salir. Es una de las p...

</div>
<div class="flashcard-back">

**R:** `ZZ` (doble Z mayuscula) es una forma rapida de guardar y salir. Es una de las preguntas mas frecuentes.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-014">
<div class="flashcard-front">

**P:** Tip de examen: Los atajos mas importantes de nano son `Ctrl+O` (guardar), `Ctrl+X` (salir), `Ct...

</div>
<div class="flashcard-back">

**R:** Los atajos mas importantes de nano son `Ctrl+O` (guardar), `Ctrl+X` (salir), `Ctrl+K` (cortar), `Ctrl+U` (pegar) y `Ctrl+W` (buscar).

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `Esc`?

</div>
<div class="flashcard-back">

**R:** ### Diagrama de transicion de modos ```                     i, I, a, A, o, O     +----------+  ------------------>  +-------------+

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-016">
<div class="flashcard-front">

**P:** Que hace el comando `h`?

</div>
<div class="flashcard-back">

**R:** Izquierda (un caracter)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-017">
<div class="flashcard-front">

**P:** Que hace el comando `j`?

</div>
<div class="flashcard-back">

**R:** Abajo (una linea)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-018">
<div class="flashcard-front">

**P:** Que hace el comando `k`?

</div>
<div class="flashcard-back">

**R:** Arriba (una linea)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-019">
<div class="flashcard-front">

**P:** Que hace el comando `l`?

</div>
<div class="flashcard-back">

**R:** Derecha (un caracter)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-020">
<div class="flashcard-front">

**P:** Que es/son 2. Modos de vi?

</div>
<div class="flashcard-back">

**R:** vi funciona con diferentes **modos** de operacion. Este es el concepto mas importante para entender vi.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="103.8">
</div>

<div class="flashcard" data-id="103.8-fc-021">
<div class="flashcard-front">

**P:** Que es/son 10. Ejecutar comandos externos?

</div>
<div class="flashcard-back">

**R:** Desde el modo comando, se pueden ejecutar comandos del shell:

</div>
</div>

---

