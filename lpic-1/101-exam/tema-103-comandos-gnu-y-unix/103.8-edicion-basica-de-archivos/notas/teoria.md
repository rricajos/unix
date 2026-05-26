# 103.8 - Edicion basica de archivos: Teoria

## 1. Introduccion a vi/vim

### Que es vi
**vi** (Visual Editor) es el editor de texto estandar en todos los sistemas Unix/Linux. Esta **siempre disponible** en cualquier sistema, incluso en instalaciones minimas. Por esta razon, es esencial conocerlo para el examen LPIC-1.

### vi vs vim
**vim** (Vi IMproved) es una version mejorada de vi con funcionalidades adicionales como:
- Resaltado de sintaxis
- Deshacer multinivel
- Modo visual
- Autocompletado
- Soporte de plugins

En la mayoria de distribuciones modernas, al ejecutar `vi` realmente se ejecuta `vim` en modo compatible. Para el examen, se asume el uso de vi/vim indistintamente.

### Abrir archivos con vi
```bash
vi archivo.txt            # Abrir archivo (lo crea si no existe)
vi +10 archivo.txt        # Abrir en la linea 10
vi +/patron archivo.txt   # Abrir en la primera coincidencia de "patron"
vi -R archivo.txt         # Abrir en modo solo lectura
view archivo.txt          # Equivalente a vi -R
vi archivo1 archivo2      # Abrir varios archivos
vi -o archivo1 archivo2   # Abrir en paneles horizontales (vim)
vi -O archivo1 archivo2   # Abrir en paneles verticales (vim)
```

---

## 2. Modos de vi

vi funciona con diferentes **modos** de operacion. Este es el concepto mas importante para entender vi.

### Los modos principales

| Modo | Descripcion | Como entrar | Como salir |
|------|-------------|-------------|------------|
| **Normal** (comando) | Modo por defecto. Se navega y se ejecutan comandos | `Esc` desde cualquier modo | Entrar a otro modo |
| **Insercion** | Se escribe texto | `i`, `I`, `a`, `A`, `o`, `O` desde normal | `Esc` |
| **Comando** (ex) | Se ejecutan comandos de linea | `:` desde normal | `Enter` o `Esc` |
| **Visual** | Se selecciona texto | `v`, `V`, `Ctrl+v` desde normal | `Esc` |

### Diagrama de transicion de modos
```
                    i, I, a, A, o, O
    +----------+  ------------------>  +-------------+
    |          |                       |             |
    |  NORMAL  |  <------ Esc ------  |  INSERCION  |
    |          |                       |             |
    +----------+                       +-------------+
      |      ^
      | :    | Esc/Enter
      v      |
    +----------+
    |          |
    |  COMANDO |
    |  (ex)    |
    +----------+

      v, V, Ctrl+v
    +----------+  ------------------>  +----------+
    |  NORMAL  |                       |  VISUAL  |
    +----------+  <------ Esc ------  +----------+
```

> **Para el examen**: Si estas perdido en vi, presiona `Esc` varias veces para volver al modo normal. Desde ahi puedes navegar o salir.

---

## 3. Navegacion en modo normal

### Movimiento basico (h, j, k, l)
| Tecla | Movimiento | Mnemotecnia |
|-------|------------|-------------|
| `h` | Izquierda (un caracter) | "h" esta a la izquierda en el teclado |
| `j` | Abajo (una linea) | "j" parece una flecha hacia abajo |
| `k` | Arriba (una linea) | "k" apunta hacia arriba |
| `l` | Derecha (un caracter) | "l" esta a la derecha en el teclado |

> Las teclas de flechas tambien funcionan en vim, pero h/j/k/l son las teclas clasicas de vi.

### Movimiento por palabras
| Tecla | Movimiento |
|-------|------------|
| `w` | Inicio de la siguiente palabra (word) |
| `b` | Inicio de la palabra anterior (back) |
| `e` | Final de la palabra actual/siguiente (end) |
| `W` | Siguiente PALABRA (delimitada por espacios) |
| `B` | PALABRA anterior |
| `E` | Final de la PALABRA |

### Movimiento en la linea
| Tecla | Movimiento |
|-------|------------|
| `0` | Inicio de la linea (columna 0) |
| `^` | Primer caracter no blanco de la linea |
| `$` | Final de la linea |
| `f{c}` | Siguiente ocurrencia del caracter {c} en la linea |
| `F{c}` | Anterior ocurrencia del caracter {c} en la linea |

### Movimiento en el archivo
| Tecla | Movimiento |
|-------|------------|
| `gg` | Primera linea del archivo |
| `G` | Ultima linea del archivo |
| `nG` o `:n` | Ir a la linea n (ej: `10G` o `:10`) |
| `Ctrl+f` | Avanzar una pantalla (forward) |
| `Ctrl+b` | Retroceder una pantalla (backward) |
| `Ctrl+d` | Avanzar media pantalla (down) |
| `Ctrl+u` | Retroceder media pantalla (up) |
| `H` | Parte superior de la pantalla (High) |
| `M` | Parte media de la pantalla (Middle) |
| `L` | Parte inferior de la pantalla (Low) |

### Multiplicadores
Se puede anteponer un numero a cualquier movimiento:
```
5j        -> Bajar 5 lineas
3w        -> Avanzar 3 palabras
10G       -> Ir a la linea 10
2Ctrl+f   -> Avanzar 2 pantallas
```

---

## 4. Modo de insercion

### Comandos para entrar en modo insercion

| Tecla | Accion | Descripcion |
|-------|--------|-------------|
| `i` | Insert | Insertar **antes** del cursor |
| `I` | Insert at beginning | Insertar al **inicio** de la linea (primer caracter no blanco) |
| `a` | Append | Insertar **despues** del cursor |
| `A` | Append at end | Insertar al **final** de la linea |
| `o` | Open below | Abrir nueva linea **debajo** y entrar en insercion |
| `O` | Open above | Abrir nueva linea **encima** y entrar en insercion |
| `s` | Substitute | Borrar caracter bajo el cursor e insertar |
| `S` | Substitute line | Borrar toda la linea e insertar |
| `R` | Replace mode | Modo reemplazo (sobreescribe caracteres) |

> **Para el examen**: Las teclas mas importantes son `i` (insertar), `a` (append), `o` (abrir linea abajo), `O` (abrir linea arriba), `I` (insertar al inicio) y `A` (insertar al final).

Para salir del modo insercion, presionar **`Esc`**.

---

## 5. Borrar (delete) en modo normal

### Comandos de borrado

| Tecla | Accion |
|-------|--------|
| `x` | Borrar caracter bajo el cursor (como Supr) |
| `X` | Borrar caracter antes del cursor (como Retroceso) |
| `dd` | Borrar (cortar) la linea completa |
| `dw` | Borrar desde el cursor hasta el inicio de la siguiente palabra |
| `d$` o `D` | Borrar desde el cursor hasta el final de la linea |
| `d0` | Borrar desde el cursor hasta el inicio de la linea |
| `dG` | Borrar desde la linea actual hasta el final del archivo |
| `dgg` | Borrar desde la linea actual hasta el inicio del archivo |
| `d{movimiento}` | Borrar hasta donde lleve el movimiento |

### Multiplicadores con borrado
```
3dd       -> Borrar 3 lineas
5x        -> Borrar 5 caracteres
d3w       -> Borrar 3 palabras
2dw       -> Borrar 2 palabras
```

> **Importante**: En vi, "borrar" es en realidad "cortar". El texto borrado se guarda en un buffer y puede ser pegado con `p`.

---

## 6. Copiar (yank) y pegar (put)

### Copiar
| Tecla | Accion |
|-------|--------|
| `yy` o `Y` | Copiar (yank) la linea completa |
| `yw` | Copiar desde el cursor hasta el inicio de la siguiente palabra |
| `y$` | Copiar desde el cursor hasta el final de la linea |
| `y0` | Copiar desde el cursor hasta el inicio de la linea |
| `yG` | Copiar desde la linea actual hasta el final del archivo |
| `y{movimiento}` | Copiar hasta donde lleve el movimiento |

### Pegar
| Tecla | Accion |
|-------|--------|
| `p` | Pegar (put) despues del cursor / debajo de la linea actual |
| `P` | Pegar antes del cursor / encima de la linea actual |

### Multiplicadores
```
3yy       -> Copiar 3 lineas
5p        -> Pegar 5 veces
```

### Combinaciones utiles
```
ddp       -> Intercambiar la linea actual con la de abajo (cortar + pegar debajo)
xp        -> Intercambiar dos caracteres (cortar caracter + pegar despues)
yyp       -> Duplicar la linea actual
```

---

## 7. Buscar y reemplazar

### Buscar
| Tecla | Accion |
|-------|--------|
| `/patron` | Buscar hacia adelante |
| `?patron` | Buscar hacia atras |
| `n` | Siguiente coincidencia (misma direccion) |
| `N` | Siguiente coincidencia (direccion contraria) |
| `*` | Buscar la siguiente ocurrencia de la palabra bajo el cursor |
| `#` | Buscar la anterior ocurrencia de la palabra bajo el cursor |

### Buscar y reemplazar (sustituir)
La sustitucion se realiza desde el modo comando con la sintaxis:
```
:[rango]s/patron/reemplazo/[flags]
```

| Comando | Accion |
|---------|--------|
| `:s/viejo/nuevo/` | Reemplazar primera ocurrencia en la linea actual |
| `:s/viejo/nuevo/g` | Reemplazar todas las ocurrencias en la linea actual |
| `:%s/viejo/nuevo/g` | Reemplazar en todo el archivo |
| `:%s/viejo/nuevo/gc` | Reemplazar en todo el archivo, pidiendo confirmacion |
| `:%s/viejo/nuevo/gi` | Reemplazar en todo el archivo, ignorar mayusculas |
| `:10,20s/viejo/nuevo/g` | Reemplazar entre las lineas 10 y 20 |
| `:.,$s/viejo/nuevo/g` | Desde la linea actual hasta el final |
| `:.,+5s/viejo/nuevo/g` | Desde la linea actual, 5 lineas mas |

### Flags de sustitucion
| Flag | Significado |
|------|-------------|
| `g` | Global (todas las ocurrencias en cada linea) |
| `c` | Confirm (pedir confirmacion para cada cambio) |
| `i` | Case insensitive (ignorar mayusculas/minusculas) |
| `I` | Case sensitive |

---

## 8. Deshacer y rehacer

| Tecla | Accion |
|-------|--------|
| `u` | Deshacer (undo) la ultima accion |
| `U` | Deshacer todos los cambios en la linea actual (mientras no te hayas movido) |
| `Ctrl+r` | Rehacer (redo) - revertir el ultimo undo |
| `.` | Repetir la ultima accion |

> **Nota**: vi original solo soporta un nivel de undo. vim soporta deshacer multinivel.

---

## 9. Guardar y salir

### Desde modo comando (`:`)

| Comando | Accion |
|---------|--------|
| `:w` | Guardar (write) |
| `:w archivo.txt` | Guardar como (con otro nombre) |
| `:w!` | Forzar guardado (ej: archivo de solo lectura si eres root) |
| `:q` | Salir (quit) - solo si no hay cambios sin guardar |
| `:q!` | Salir sin guardar (forzar) - **descarta todos los cambios** |
| `:wq` | Guardar y salir |
| `:wq!` | Forzar guardar y salir |
| `:x` | Guardar (solo si hay cambios) y salir |
| `:e!` | Recargar el archivo desde disco (descartar cambios) |
| `:e archivo2.txt` | Abrir otro archivo |

### Desde modo normal

| Tecla | Accion |
|-------|--------|
| `ZZ` | Guardar y salir (equivalente a `:wq`) |
| `ZQ` | Salir sin guardar (equivalente a `:q!`) |

> **Para el examen**: `ZZ` (doble Z mayuscula) es una forma rapida de guardar y salir. Es una de las preguntas mas frecuentes.

---

## 10. Ejecutar comandos externos

Desde el modo comando, se pueden ejecutar comandos del shell:

| Comando | Accion |
|---------|--------|
| `:!comando` | Ejecutar un comando del shell |
| `:!ls` | Listar archivos sin salir de vi |
| `:!bash` | Abrir un shell (volver a vi con `exit`) |
| `:r archivo` | Insertar el contenido de un archivo |
| `:r !comando` | Insertar la salida de un comando |
| `:r !date` | Insertar la fecha actual |

---

## 11. Modo visual (vim)

### Entrar en modo visual

| Tecla | Tipo de seleccion |
|-------|-------------------|
| `v` | Seleccion por caracteres |
| `V` | Seleccion por lineas completas |
| `Ctrl+v` | Seleccion en bloque (rectangular) |

### Acciones en modo visual
Una vez seleccionado el texto:
- `d` - Borrar la seleccion
- `y` - Copiar la seleccion
- `>` - Indentar a la derecha
- `<` - Indentar a la izquierda
- `~` - Cambiar mayusculas/minusculas
- `:s/viejo/nuevo/g` - Sustituir dentro de la seleccion
- `U` - Convertir a mayusculas
- `u` - Convertir a minusculas

### Ejemplo de edicion en bloque (Ctrl+v)
```
1. Seleccionar un bloque vertical con Ctrl+v + movimiento
2. Presionar I para insertar al inicio del bloque
3. Escribir el texto
4. Presionar Esc para aplicar a todas las lineas seleccionadas
```

---

## 12. Configuracion de vi/vim

### Configurar desde dentro de vi
| Comando | Accion |
|---------|--------|
| `:set number` o `:set nu` | Mostrar numeros de linea |
| `:set nonumber` o `:set nonu` | Ocultar numeros de linea |
| `:set tabstop=4` o `:set ts=4` | Tabulaciones de 4 espacios |
| `:set expandtab` o `:set et` | Usar espacios en lugar de tabulaciones |
| `:set autoindent` o `:set ai` | Indentacion automatica |
| `:set ignorecase` o `:set ic` | Busquedas sin distinguir mayusculas |
| `:set hlsearch` o `:set hls` | Resaltar coincidencias de busqueda |
| `:set incsearch` o `:set is` | Busqueda incremental |
| `:set syntax=on` | Activar resaltado de sintaxis |
| `:set paste` | Modo pegar (desactiva autoindent al pegar) |
| `:set list` | Mostrar caracteres invisibles (tabs, fin de linea) |

### Archivo de configuracion permanente
La configuracion permanente de vim se guarda en `~/.vimrc`:
```vim
set number
set tabstop=4
set expandtab
set autoindent
set hlsearch
set incsearch
syntax on
```

---

## 13. El editor nano

### Caracteristicas de nano
`nano` es un editor de texto simple y amigable para principiantes. Muestra las combinaciones de teclas disponibles en la parte inferior de la pantalla.

### Abrir archivos con nano
```bash
nano archivo.txt              # Abrir archivo
nano +10 archivo.txt          # Abrir en linea 10
nano -B archivo.txt           # Crear backup antes de editar
nano -l archivo.txt           # Mostrar numeros de linea
nano -w archivo.txt           # No ajustar lineas largas (no word wrap)
```

### Atajos principales de nano
En nano, `^` significa `Ctrl` y `M-` significa `Alt`.

| Atajo | Accion |
|-------|--------|
| `Ctrl+O` | Guardar (Write Out) |
| `Ctrl+X` | Salir (pide guardar si hay cambios) |
| `Ctrl+K` | Cortar linea actual |
| `Ctrl+U` | Pegar linea cortada (Uncut) |
| `Ctrl+W` | Buscar texto (Where is) |
| `Ctrl+\` | Buscar y reemplazar |
| `Ctrl+G` | Ayuda |
| `Ctrl+C` | Mostrar posicion del cursor (linea/columna) |
| `Ctrl+_` o `Ctrl+/` | Ir a linea/columna |
| `Alt+U` | Deshacer |
| `Alt+E` | Rehacer |
| `Ctrl+A` | Inicio de linea |
| `Ctrl+E` | Final de linea |
| `Alt+\` | Inicio del archivo |
| `Alt+/` | Final del archivo |
| `Ctrl+Space` | Avanzar una palabra |
| `Alt+Space` | Retroceder una palabra |

> **Para el examen**: Los atajos mas importantes de nano son `Ctrl+O` (guardar), `Ctrl+X` (salir), `Ctrl+K` (cortar), `Ctrl+U` (pegar) y `Ctrl+W` (buscar).

---

## 14. Configurar el editor predeterminado

### Variables de entorno
```bash
# Establecer vi como editor predeterminado
export EDITOR=vi
export VISUAL=vi

# Establecer nano como editor predeterminado
export EDITOR=nano
export VISUAL=nano
```

- **EDITOR**: Editor por defecto para programas de linea de comandos
- **VISUAL**: Editor por defecto para programas que soportan terminales con capacidades de pantalla completa

Para que sea permanente, agregar al archivo `~/.bashrc` o `~/.profile`.

### Comando select-editor / update-alternatives
```bash
# En Debian/Ubuntu
select-editor                 # Selector interactivo
update-alternatives --config editor   # Configurar editor del sistema
```

---

## 15. Resumen de lo mas importante para el examen

### Modos de vi
```
Normal  -->  i/a/o  -->  Insercion  -->  Esc  -->  Normal
Normal  -->  :      -->  Comando    -->  Enter/Esc --> Normal
Normal  -->  v/V    -->  Visual     -->  Esc  -->  Normal
```

### Comandos imprescindibles
```
Guardar:          :w
Salir:            :q
Guardar y salir:  :wq  o  ZZ
Salir sin guardar: :q!
Buscar:           /patron
Reemplazar todo:  :%s/viejo/nuevo/g
Deshacer:         u
Rehacer:          Ctrl+r
Copiar linea:     yy
Pegar:            p
Borrar linea:     dd
```
