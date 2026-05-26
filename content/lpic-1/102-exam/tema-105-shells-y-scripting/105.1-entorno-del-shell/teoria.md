---
title: "105.1 - Teoria: Personalizar y usar el entorno del shell"
tags:
  - lpic-1
  - examen-102
  - tema-105
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "102"
tema: "105"
subtema: "105.1"
---

# 105.1 - Teoria: Personalizar y usar el entorno del shell

## 1. Tipos de shell: Login vs Non-Login

### Login shell
Un **login shell** es el que se inicia cuando un usuario inicia sesion en el sistema. Se obtiene al:
- Iniciar sesion en una consola de texto (tty)
- Conectarse por SSH
- Usar `su - usuario` o `su -l usuario`
- Usar `bash --login`

### Non-login shell (shell interactivo)
Un **non-login shell** se inicia cuando ya existe una sesion activa:
- Abrir un nuevo terminal en un entorno grafico
- Ejecutar `bash` sin la opcion `--login`
- Usar `su usuario` (sin guion)
- Ejecutar un script

### Como identificar el tipo de shell
```bash
# Si el resultado empieza con guion (-bash), es login shell
echo $0

# Tambien se puede usar
shopt login_shell    # on = login, off = non-login
```

---

## 2. Archivos de inicio y orden de ejecucion

### Archivos globales (afectan a todos los usuarios)

| Archivo | Descripcion |
|---------|-------------|
| `/etc/profile` | Ejecutado por login shells. Configura variables de entorno globales, umask, PATH |
| `/etc/profile.d/` | Directorio con scripts `.sh` que `/etc/profile` ejecuta automaticamente. Forma modular de agregar configuraciones globales |
| `/etc/bash.bashrc` | Ejecutado por non-login shells interactivos (en Debian/Ubuntu). Configuraciones globales para shells interactivos |
| `/etc/environment` | Archivo simple de asignaciones `VARIABLE=valor` (no es un script). Leido por PAM, no por bash directamente |

### Archivos de usuario (afectan solo al usuario actual)

| Archivo | Descripcion |
|---------|-------------|
| `~/.bash_profile` | Ejecutado por login shells. Primer archivo buscado del usuario |
| `~/.bash_login` | Ejecutado por login shells SOLO si `~/.bash_profile` NO existe |
| `~/.profile` | Ejecutado por login shells SOLO si ni `~/.bash_profile` ni `~/.bash_login` existen |
| `~/.bashrc` | Ejecutado por non-login shells interactivos. Frecuentemente invocado desde `~/.bash_profile` |
| `~/.bash_logout` | Ejecutado al cerrar un login shell. Util para limpiar archivos temporales o mostrar mensajes |

### Orden de ejecucion - Login Shell
```
1. /etc/profile
   └── /etc/profile.d/*.sh (ejecutados por /etc/profile)
2. ~/.bash_profile  (si existe, se detiene aqui)
   OR ~/.bash_login  (si .bash_profile no existe)
   OR ~/.profile     (si ninguno de los anteriores existe)
```

**IMPORTANTE para el examen:** Bash busca `~/.bash_profile`, `~/.bash_login` y `~/.profile` EN ESE ORDEN y ejecuta SOLO EL PRIMERO que encuentre.

### Orden de ejecucion - Non-Login Shell (interactivo)
```
1. /etc/bash.bashrc  (en Debian/Ubuntu)
2. ~/.bashrc
```

### Practica comun
Es muy habitual que `~/.bash_profile` contenga una linea que invoque a `~/.bashrc`:
```bash
# Dentro de ~/.bash_profile
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi
```
Esto asegura que las configuraciones de `~/.bashrc` se apliquen tambien en login shells.

### Cierre de sesion
```
~/.bash_logout     (solo para login shells)
/etc/bash.bash_logout  (si existe, en algunos sistemas)
```

---

## 3. Ejecutar comandos con entorno limpio: `env -i`

El comando `env -i` permite ejecutar un comando con un entorno completamente vacio (sin ninguna variable de entorno heredada).

```bash
# Ejecutar un comando sin ninguna variable de entorno
env -i /bin/bash --norc --noprofile

# Ejecutar un comando con solo las variables que se especifiquen
env -i PATH=/usr/bin HOME=/tmp mi_script.sh

# Ver que no hay variables de entorno
env -i env    # No muestra nada (entorno vacio)
```

**Uso tipico:** Depuracion y pruebas para verificar que un script o programa funciona sin depender de variables del entorno del usuario.

---

## 4. Opciones del shell: `set -o` / `set +o`

El comando `set` permite activar y desactivar opciones de comportamiento del shell.

- **`set -o opcion`**: Activa la opcion (enable)
- **`set +o opcion`**: Desactiva la opcion (disable)

**Nota:** Es contraintuitivo: `-o` activa y `+o` desactiva.

### Opciones importantes para el examen

| Opcion | Efecto |
|--------|--------|
| `noclobber` | Impide sobrescribir archivos existentes con redireccion `>`. Usar `>\|` para forzar |
| `nounset` (`set -u`) | Trata las variables no definidas como error |
| `noglob` | Deshabilita la expansion de globbing (*, ?, [...]) |
| `noexec` (`set -n`) | Lee los comandos pero no los ejecuta (util para verificar sintaxis) |
| `xtrace` (`set -x`) | Muestra cada comando antes de ejecutarlo (depuracion) |
| `errexit` (`set -e`) | Sale del script si un comando falla (codigo de salida distinto de 0) |

```bash
# Activar noclobber (proteger archivos existentes)
set -o noclobber
echo "datos" > archivo.txt     # Error si archivo.txt ya existe
echo "datos" >| archivo.txt    # Forzar sobrescritura con >|

# Desactivar noclobber
set +o noclobber

# Activar nounset (error en variables no definidas)
set -o nounset
echo $VARIABLE_INEXISTENTE     # Error: unbound variable

# Ver todas las opciones del shell y su estado
set -o

# Formas abreviadas equivalentes
set -e    # Equivale a set -o errexit
set -u    # Equivale a set -o nounset
set -x    # Equivale a set -o xtrace
```

---

## 5. Variables del shell y de entorno

### Variables locales del shell
Solo existen en el shell actual; no son heredadas por procesos hijos.
```bash
MI_VARIABLE="valor"          # Crear variable local
echo $MI_VARIABLE            # Acceder al valor
unset MI_VARIABLE            # Eliminar variable
```

### Variables de entorno
Son heredadas por todos los procesos hijos del shell.
```bash
export MI_VARIABLE="valor"   # Crear variable de entorno
export MI_VARIABLE           # Exportar una variable local existente
MI_VARIABLE="valor"          # Primero asignar
export MI_VARIABLE           # Luego exportar (equivalente)
```

### Comandos para gestionar variables

| Comando | Descripcion |
|---------|-------------|
| `set` | Sin argumentos: muestra TODAS las variables (locales + entorno) y funciones |
| `env` | Sin argumentos: muestra SOLO las variables de entorno |
| `export` | Sin argumentos: muestra las variables exportadas. Con argumento: exporta variable |
| `export -n VAR` | Des-exporta una variable (la convierte en local) |
| `unset VAR` | Elimina completamente la variable |
| `printenv` | Muestra variables de entorno (similar a `env`) |
| `printenv VAR` | Muestra el valor de una variable especifica |

### Variables importantes del sistema

| Variable | Descripcion |
|----------|-------------|
| `PATH` | Rutas de busqueda de ejecutables, separadas por `:` |
| `HOME` | Directorio home del usuario |
| `USER` | Nombre del usuario actual |
| `SHELL` | Shell por defecto del usuario |
| `PS1` | Prompt principal del shell |
| `PS2` | Prompt secundario (continuacion de linea, por defecto `>`) |
| `LANG` | Configuracion regional/idioma |
| `TERM` | Tipo de terminal |
| `HISTFILE` | Archivo del historial de comandos |
| `HISTSIZE` | Numero de comandos en el historial en memoria |
| `HISTFILESIZE` | Numero de comandos en el archivo de historial |

---

## 6. Modificacion del PATH

El `PATH` es una lista de directorios separados por `:` donde el shell busca ejecutables.

```bash
# Ver el PATH actual
echo $PATH

# Agregar un directorio al final del PATH
export PATH="$PATH:/nuevo/directorio"

# Agregar un directorio al inicio del PATH (tiene prioridad)
export PATH="/nuevo/directorio:$PATH"

# Para que sea permanente, agregar la linea a ~/.bashrc o ~/.profile
echo 'export PATH="$PATH:$HOME/bin"' >> ~/.bashrc
```

**IMPORTANTE:** El directorio actual (`.`) NO esta en el PATH por defecto en Linux por razones de seguridad. Para ejecutar un programa del directorio actual se usa `./programa`.

---

## 7. Personalizacion del prompt (PS1)

El prompt se personaliza mediante la variable `PS1`. Secuencias de escape comunes:

| Secuencia | Significado |
|-----------|-------------|
| `\u` | Nombre de usuario |
| `\h` | Nombre del host (hasta el primer punto) |
| `\H` | Nombre completo del host |
| `\w` | Directorio de trabajo completo |
| `\W` | Solo el nombre del directorio actual |
| `\d` | Fecha (formato: "Dia Mes Fecha") |
| `\t` | Hora en formato 24h (HH:MM:SS) |
| `\T` | Hora en formato 12h |
| `\n` | Nueva linea |
| `\$` | `#` si es root, `$` si es usuario normal |
| `\!` | Numero en el historial |

```bash
# Ejemplo de prompt personalizado
PS1="\u@\h:\w\$ "       # usuario@host:/ruta$

# Con colores
PS1="\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ "
```

---

## 8. Alias

Los alias son atajos para comandos largos o frecuentes.

```bash
# Crear alias
alias ll='ls -la'
alias rm='rm -i'
alias grep='grep --color=auto'

# Ver todos los alias definidos
alias

# Ver un alias especifico
alias ll

# Eliminar un alias
unalias ll

# Eliminar todos los alias
unalias -a

# Ejecutar el comando original ignorando el alias
\rm archivo.txt       # La barra invertida evita el alias
command rm archivo.txt # Alternativa
```

Para que los alias sean permanentes, se definen en `~/.bashrc`.

---

## 9. Funciones del shell

Las funciones permiten agrupar comandos reutilizables. Son mas poderosas que los alias.

```bash
# Sintaxis 1 (con palabra clave function)
function saludo {
    echo "Hola, $1"
}

# Sintaxis 2 (con parentesis, estilo POSIX)
saludo() {
    echo "Hola, $1"
}

# Uso
saludo "Sandra"    # Imprime: Hola, Sandra

# Funcion con variables locales
function crear_backup {
    local archivo=$1
    local fecha=$(date +%Y%m%d)
    cp "$archivo" "${archivo}.${fecha}.bak"
    echo "Backup creado: ${archivo}.${fecha}.bak"
}

# Ver funciones definidas
declare -f           # Muestra todas las funciones con su cuerpo
declare -F           # Muestra solo los nombres de funciones
set                  # Tambien muestra funciones (junto con variables)

# Eliminar una funcion
unset -f nombre_funcion
```

Las funciones se definen en `~/.bashrc` para que esten disponibles en cada sesion.

---

## 10. source vs . (dot command)

Ambos comandos ejecutan un script en el contexto del shell actual (no crean un subshell).

```bash
# Son equivalentes:
source ~/.bashrc
. ~/.bashrc
```

**Diferencia clave con ejecutar un script directamente:**
- `./script.sh` o `bash script.sh` --> Crea un subshell. Los cambios en variables NO afectan al shell padre.
- `source script.sh` o `. script.sh` --> Ejecuta en el shell actual. Los cambios en variables SI afectan al shell actual.

**Uso tipico:** Recargar la configuracion del shell tras modificarla:
```bash
source ~/.bashrc    # Aplica los cambios inmediatamente
```

---

## 11. Directorio /etc/skel/ (skeleton)

El directorio `/etc/skel/` contiene los archivos plantilla que se copian al directorio home de cada nuevo usuario creado con `useradd -m`.

```bash
# Contenido tipico
ls -la /etc/skel/
.bash_logout
.bashrc
.profile

# Para personalizar el entorno de nuevos usuarios,
# se modifican los archivos en /etc/skel/
# Ejemplo: agregar un alias para todos los nuevos usuarios
echo "alias ll='ls -la'" >> /etc/skel/.bashrc
```

Cuando se ejecuta `useradd -m nuevo_usuario`, los archivos de `/etc/skel/` se copian a `/home/nuevo_usuario/`.

---

## 12. /etc/environment

Este archivo es diferente a los demas: **NO es un script de shell**. Es un archivo simple de pares `VARIABLE=valor` leido por el modulo PAM (`pam_env`).

```
# Formato de /etc/environment
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
LANG="es_ES.UTF-8"
```

- No soporta expansiones de variables (`$HOME` no funcionaria)
- No soporta comandos ni logica de shell
- Se aplica a todas las sesiones (incluyendo las no interactivas)
- Es especifico de sistemas basados en Debian/Ubuntu con PAM

---

## Resumen para el examen

1. **Login shell:** `/etc/profile` --> `/etc/profile.d/*.sh` --> `~/.bash_profile` OR `~/.bash_login` OR `~/.profile` (solo el primero encontrado)
2. **Non-login shell:** `/etc/bash.bashrc` --> `~/.bashrc`
3. `set` muestra todo (variables + funciones); `env` solo variables de entorno
4. `export` hace que una variable sea heredada por procesos hijos
5. **`env -i`** ejecuta un comando con entorno completamente vacio
6. **`set -o opcion`** activa una opcion del shell; **`set +o opcion`** la desactiva
7. **`noclobber`** impide sobrescribir archivos con `>`; **`nounset`** da error en variables no definidas
8. `source` y `.` ejecutan en el shell actual (sin subshell)
9. `/etc/skel/` es la plantilla para nuevos usuarios
10. El PATH se modifica con `export PATH="$PATH:/nuevo/dir"`
11. Los alias y funciones se hacen permanentes escribiendolos en `~/.bashrc`
