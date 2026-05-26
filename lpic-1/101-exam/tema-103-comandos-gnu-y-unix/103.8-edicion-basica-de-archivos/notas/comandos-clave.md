# 103.8 - Edicion basica de archivos: Comandos clave

## Abrir archivos con vi

| Comando | Descripcion |
|---------|-------------|
| `vi archivo` | Abrir archivo (crear si no existe) |
| `vi +N archivo` | Abrir en la linea N |
| `vi +/patron archivo` | Abrir en la primera coincidencia del patron |
| `vi -R archivo` | Abrir en modo solo lectura |
| `view archivo` | Equivalente a vi -R |

## Modos de vi

| Modo | Descripcion | Entrar | Salir |
|------|-------------|--------|-------|
| Normal | Navegacion y comandos (por defecto) | `Esc` | Entrar a otro modo |
| Insercion | Escribir texto | `i`, `I`, `a`, `A`, `o`, `O` | `Esc` |
| Comando (ex) | Comandos de linea con `:` | `:` | `Enter` o `Esc` |
| Visual | Seleccionar texto | `v`, `V`, `Ctrl+v` | `Esc` |

## Navegacion en modo normal

### Movimiento basico
| Tecla | Movimiento |
|-------|------------|
| `h` | Izquierda |
| `j` | Abajo |
| `k` | Arriba |
| `l` | Derecha |

### Movimiento por palabras
| Tecla | Movimiento |
|-------|------------|
| `w` | Siguiente palabra |
| `b` | Palabra anterior |
| `e` | Final de palabra |

### Movimiento en la linea
| Tecla | Movimiento |
|-------|------------|
| `0` | Inicio de linea |
| `^` | Primer caracter no blanco |
| `$` | Final de linea |

### Movimiento en el archivo
| Tecla | Movimiento |
|-------|------------|
| `gg` | Primera linea |
| `G` | Ultima linea |
| `nG` o `:n` | Ir a linea n |
| `Ctrl+f` | Pagina adelante (forward) |
| `Ctrl+b` | Pagina atras (backward) |

## Entrar en modo insercion

| Tecla | Accion |
|-------|--------|
| `i` | Insertar antes del cursor |
| `I` | Insertar al inicio de la linea |
| `a` | Insertar despues del cursor (append) |
| `A` | Insertar al final de la linea |
| `o` | Nueva linea debajo |
| `O` | Nueva linea encima |
| `R` | Modo reemplazo (sobreescribir) |

## Borrar (cortar)

| Tecla | Accion |
|-------|--------|
| `x` | Borrar caracter bajo el cursor |
| `X` | Borrar caracter antes del cursor |
| `dd` | Borrar linea completa |
| `dw` | Borrar hasta siguiente palabra |
| `d$` o `D` | Borrar hasta final de linea |
| `d0` | Borrar hasta inicio de linea |
| `dG` | Borrar hasta final del archivo |
| `dgg` | Borrar hasta inicio del archivo |
| `3dd` | Borrar 3 lineas |

## Copiar y pegar

| Tecla | Accion |
|-------|--------|
| `yy` o `Y` | Copiar linea completa |
| `yw` | Copiar palabra |
| `y$` | Copiar hasta final de linea |
| `3yy` | Copiar 3 lineas |
| `p` | Pegar despues del cursor / debajo |
| `P` | Pegar antes del cursor / encima |

## Buscar

| Tecla | Accion |
|-------|--------|
| `/patron` | Buscar hacia adelante |
| `?patron` | Buscar hacia atras |
| `n` | Siguiente coincidencia |
| `N` | Coincidencia anterior |
| `*` | Buscar palabra bajo el cursor (adelante) |
| `#` | Buscar palabra bajo el cursor (atras) |

## Sustituir (buscar y reemplazar)

| Comando | Accion |
|---------|--------|
| `:s/viejo/nuevo/` | Reemplazar primera ocurrencia en la linea |
| `:s/viejo/nuevo/g` | Reemplazar todas en la linea |
| `:%s/viejo/nuevo/g` | Reemplazar en todo el archivo |
| `:%s/viejo/nuevo/gc` | Reemplazar con confirmacion |
| `:%s/viejo/nuevo/gi` | Reemplazar ignorando mayusculas |
| `:10,20s/viejo/nuevo/g` | Reemplazar entre lineas 10 y 20 |

## Deshacer y rehacer

| Tecla | Accion |
|-------|--------|
| `u` | Deshacer |
| `Ctrl+r` | Rehacer |
| `.` | Repetir ultima accion |
| `U` | Deshacer todos los cambios en la linea actual |

## Guardar y salir

| Comando | Accion |
|---------|--------|
| `:w` | Guardar |
| `:w archivo.txt` | Guardar como |
| `:w!` | Forzar guardado |
| `:q` | Salir (sin cambios pendientes) |
| `:q!` | Salir sin guardar |
| `:wq` | Guardar y salir |
| `:wq!` | Forzar guardar y salir |
| `:x` | Guardar si hay cambios y salir |
| `:e!` | Recargar archivo (descartar cambios) |
| `ZZ` | Guardar y salir (modo normal) |
| `ZQ` | Salir sin guardar (modo normal) |

## Comandos externos desde vi

| Comando | Accion |
|---------|--------|
| `:!comando` | Ejecutar comando del shell |
| `:!ls` | Listar archivos |
| `:r archivo` | Insertar contenido de archivo |
| `:r !comando` | Insertar salida de comando |
| `:r !date` | Insertar fecha actual |

## Modo visual

| Tecla | Tipo de seleccion |
|-------|-------------------|
| `v` | Seleccion por caracteres |
| `V` | Seleccion por lineas |
| `Ctrl+v` | Seleccion en bloque (rectangular) |

Acciones tras seleccionar: `d` (borrar), `y` (copiar), `>` (indentar), `<` (desindentar), `~` (cambiar caso)

## Configuracion de vi

| Comando | Accion |
|---------|--------|
| `:set number` | Mostrar numeros de linea |
| `:set nonumber` | Ocultar numeros de linea |
| `:set tabstop=4` | Tabulaciones de 4 espacios |
| `:set expandtab` | Espacios en vez de tabs |
| `:set autoindent` | Indentacion automatica |
| `:set hlsearch` | Resaltar busquedas |
| `:set paste` | Modo pegar (sin autoindent) |

Archivo de configuracion permanente: `~/.vimrc`

## Atajos de nano

| Atajo | Accion |
|-------|--------|
| `Ctrl+O` | Guardar |
| `Ctrl+X` | Salir |
| `Ctrl+K` | Cortar linea |
| `Ctrl+U` | Pegar linea |
| `Ctrl+W` | Buscar |
| `Ctrl+\` | Buscar y reemplazar |
| `Ctrl+G` | Ayuda |
| `Ctrl+C` | Mostrar posicion del cursor |
| `Ctrl+_` | Ir a linea/columna |
| `Alt+U` | Deshacer |
| `Alt+E` | Rehacer |

## Editor predeterminado

| Comando | Descripcion |
|---------|-------------|
| `export EDITOR=vi` | Establecer vi como editor por defecto |
| `export VISUAL=vi` | Establecer vi como editor visual |
| `select-editor` | Selector interactivo (Debian/Ubuntu) |
| `update-alternatives --config editor` | Configurar editor del sistema |
