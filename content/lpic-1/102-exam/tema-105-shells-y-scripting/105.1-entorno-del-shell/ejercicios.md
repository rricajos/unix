---
title: "105.1 - Ejercicios: Personalizar y usar el entorno del shell"
tags:
  - lpic-1
  - examen-102
  - tema-105
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "105"
subtema: "105.1"
---

# 105.1 - Ejercicios: Personalizar y usar el entorno del shell

### Pregunta 1

Un usuario inicia sesion en el sistema mediante SSH. Tiene los archivos `~/.bash_profile`, `~/.bash_login` y `~/.profile` en su directorio home. Cual de estos archivos sera ejecutado por bash?

a) Solo `~/.profile`, que es el archivo estandar POSIX
b) Los tres archivos se ejecutan en orden: `~/.bash_profile`, `~/.bash_login`, `~/.profile`
c) Solo `~/.bash_profile`, ya que bash ejecuta unicamente el primero que encuentra en el orden de busqueda
d) Solo `~/.bash_login`, porque tiene prioridad sobre los demas

<details><summary>Respuesta</summary>

**c) Solo `~/.bash_profile`, ya que bash ejecuta unicamente el primero que encuentra en el orden de busqueda**

Bash busca los archivos de inicio del usuario en un orden especifico: `~/.bash_profile` --> `~/.bash_login` --> `~/.profile`, y ejecuta **unicamente el primero** que encuentre. Como `~/.bash_profile` existe, los otros dos son completamente ignorados. Ademas, previamente se habra ejecutado `/etc/profile` (y los scripts en `/etc/profile.d/`) por ser un login shell (conexion SSH).

</details>

---

### Pregunta 2

Cual es la diferencia principal entre ejecutar `source ~/.bashrc` y ejecutar `bash ~/.bashrc`?

a) `source` ejecuta el archivo en un subshell, mientras que `bash` lo ejecuta en el shell actual
b) `source` ejecuta el archivo en el shell actual, mientras que `bash` lo ejecuta en un subshell
c) Ambos comandos son equivalentes y ejecutan el archivo en el shell actual
d) `source` solo funciona con archivos `.sh`, mientras que `bash` funciona con cualquier archivo

<details><summary>Respuesta</summary>

**b) `source` ejecuta el archivo en el shell actual, mientras que `bash` lo ejecuta en un subshell**

`source ~/.bashrc` (equivalente a `. ~/.bashrc`) ejecuta el archivo en el **shell actual**, por lo que todas las variables, alias y funciones definidas quedan disponibles en la sesion. `bash ~/.bashrc` ejecuta el archivo en un **subshell** (proceso hijo), donde las variables y alias se crean pero se pierden al terminar el subshell. Por eso, para recargar la configuracion del shell se usa siempre `source`.

</details>

---

### Pregunta 3

Un administrador quiere que todos los nuevos usuarios creados en el sistema tengan un alias `ll='ls -la'` disponible automaticamente. Que archivo debe modificar?

a) `/etc/bash.bashrc`
b) `/etc/profile`
c) `/etc/skel/.bashrc`
d) `/etc/environment`

<details><summary>Respuesta</summary>

**c) `/etc/skel/.bashrc`**

El directorio `/etc/skel/` contiene los archivos plantilla que se copian al directorio home de cada nuevo usuario cuando se crea con `useradd -m`. Al agregar `alias ll='ls -la'` en `/etc/skel/.bashrc`, todos los usuarios creados a partir de ese momento tendran el alias. `/etc/bash.bashrc` afectaria a todos los usuarios existentes de forma inmediata (no solo a los nuevos). `/etc/profile` se ejecuta solo en login shells. `/etc/environment` no es un script y no soporta alias.

</details>

---

### Pregunta 4

Que hace el comando `set -o noclobber` en un shell bash?

a) Impide que se eliminen archivos con el comando `rm`
b) Impide que se sobrescriban archivos existentes con la redireccion `>`, requiriendo usar `>|` para forzar
c) Impide la ejecucion de scripts que no tengan permiso de ejecucion
d) Impide que las variables no definidas se expandan como cadenas vacias

<details><summary>Respuesta</summary>

**b) Impide que se sobrescriban archivos existentes con la redireccion `>`, requiriendo usar `>|` para forzar**

La opcion `noclobber` protege archivos existentes de ser sobrescritos accidentalmente con el operador de redireccion `>`. Si el archivo ya existe, el shell mostrara un error. Para forzar la sobrescritura cuando `noclobber` esta activo, se usa `>|`. Se desactiva con `set +o noclobber`. La opcion que trata variables no definidas como error es `nounset` (`set -u`).

</details>

---

### Pregunta 5

Un usuario abre una terminal grafica en su escritorio GNOME. Que tipo de shell se inicia y que archivos de configuracion se ejecutan?

a) Login shell: `/etc/profile` y `~/.bash_profile`
b) Non-login shell interactivo: `/etc/bash.bashrc` y `~/.bashrc`
c) Non-login shell no interactivo: solo se lee `BASH_ENV`
d) Login shell: `/etc/environment` y `~/.profile`

<details><summary>Respuesta</summary>

**b) Non-login shell interactivo: `/etc/bash.bashrc` y `~/.bashrc`**

Al abrir una terminal grafica en un entorno de escritorio se inicia un **non-login shell** (shell interactivo no-login), ya que el usuario ya ha iniciado sesion previamente en el entorno grafico. Los archivos que se ejecutan son `/etc/bash.bashrc` (configuracion global para shells interactivos, en Debian/Ubuntu) y `~/.bashrc` (configuracion del usuario). Los archivos como `/etc/profile` y `~/.bash_profile` solo se ejecutan en login shells (SSH, consola de texto, `su -`).

</details>

---

### Pregunta 6

Cual de las siguientes afirmaciones sobre `/etc/environment` es correcta?

a) Es un script de shell que se ejecuta en cada login shell
b) Es un archivo simple de pares `VARIABLE=valor` leido por PAM, que no soporta expansiones de variables
c) Es equivalente a `/etc/profile` pero para shells no interactivos
d) Solo es leido por el comando `env` cuando se ejecuta sin argumentos

<details><summary>Respuesta</summary>

**b) Es un archivo simple de pares `VARIABLE=valor` leido por PAM, que no soporta expansiones de variables**

`/etc/environment` NO es un script de shell. Es un archivo simple con formato `VARIABLE=valor` que es leido por el modulo PAM (`pam_env`), no por bash directamente. No soporta expansiones de variables (por ejemplo, `$HOME` no funcionaria), ni comandos, ni logica de programacion. Se aplica a todas las sesiones, incluyendo las no interactivas, y es especifico de sistemas con PAM (principalmente Debian/Ubuntu).

</details>

---

### Pregunta 7

Que comando ejecuta un programa con un entorno completamente vacio, sin ninguna variable de entorno heredada?

a) `unset -a && programa`
b) `env -i programa`
c) `export -n && programa`
d) `set -o nounset && programa`

<details><summary>Respuesta</summary>

**b) `env -i programa`**

El comando `env -i` ejecuta el programa especificado con un entorno completamente vacio (sin ninguna variable de entorno heredada del shell actual). Es util para depuracion y pruebas, para verificar que un script funciona sin depender de variables del entorno del usuario. Se pueden especificar solo las variables necesarias: `env -i PATH=/usr/bin HOME=/tmp programa`. `unset -a` eliminaria las variables del shell actual, no crea un entorno limpio para un proceso hijo.

</details>

---

### Pregunta 8

Un usuario quiere crear una funcion llamada `mkcd` que cree un directorio y entre en el. Cual es la sintaxis correcta y donde debe colocarla para que este disponible en cada sesion?

a) Definirla en `/etc/profile` con la sintaxis `mkcd() { mkdir $1; cd $1; }`
b) Definirla en `~/.bashrc` con la sintaxis `mkcd() { mkdir -p "$1" && cd "$1"; }`
c) Definirla en `~/.bash_logout` con la sintaxis `function mkcd { mkdir "$1" && cd "$1"; }`
d) Definirla en `/etc/environment` con la sintaxis `mkcd=mkdir -p && cd`

<details><summary>Respuesta</summary>

**b) Definirla en `~/.bashrc` con la sintaxis `mkcd() { mkdir -p "$1" && cd "$1"; }`**

La funcion debe colocarse en `~/.bashrc` para que este disponible en cada nueva sesion de shell interactivo. La sintaxis usa `"$1"` entre comillas para manejar nombres con espacios, `-p` para crear directorios padre si es necesario, y `&&` para que `cd` solo se ejecute si `mkdir` tiene exito. `/etc/environment` no soporta funciones. `~/.bash_logout` se ejecuta al cerrar sesion, no al iniciarla. `/etc/profile` funcionaria solo para login shells.

</details>

---

### Pregunta 9

Que muestra el comando `set` sin argumentos en comparacion con el comando `env` sin argumentos?

a) `set` muestra solo las variables de entorno; `env` muestra todas las variables y funciones
b) `set` muestra todas las variables (locales, de entorno y funciones); `env` muestra solo las variables de entorno
c) Ambos muestran la misma informacion: todas las variables del shell
d) `set` muestra las opciones del shell activas; `env` muestra las variables de entorno

<details><summary>Respuesta</summary>

**b) `set` muestra todas las variables (locales, de entorno y funciones); `env` muestra solo las variables de entorno**

`set` sin argumentos lista todas las variables del shell, incluyendo las variables locales (no exportadas), las variables de entorno (exportadas) y las funciones definidas. `env` sin argumentos lista unicamente las variables de entorno, es decir, las que han sido exportadas y estan disponibles para procesos hijos. Esta distincion es fundamental para el examen LPIC-1. `printenv` es similar a `env` en este comportamiento.

</details>

---

### Pregunta 10

Un usuario tiene la siguiente configuracion en su `~/.bash_profile`:
```bash
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi
```
Cual es el proposito de este bloque de codigo?

a) Crear un backup de `~/.bashrc` cada vez que se inicia sesion
b) Verificar que `~/.bashrc` no contenga errores de sintaxis
c) Asegurar que las configuraciones de `~/.bashrc` se apliquen tambien en login shells
d) Evitar que `~/.bashrc` se ejecute dos veces en shells no interactivos

<details><summary>Respuesta</summary>

**c) Asegurar que las configuraciones de `~/.bashrc` se apliquen tambien en login shells**

Los login shells (SSH, consola de texto) ejecutan `~/.bash_profile` pero NO ejecutan `~/.bashrc`. Los non-login shells (terminal grafica) ejecutan `~/.bashrc` pero NO `~/.bash_profile`. Este bloque hace que el login shell tambien cargue `~/.bashrc`, unificando la configuracion en ambos tipos de sesion. Asi, los alias, funciones y variables definidos en `~/.bashrc` estaran disponibles tanto al conectarse por SSH como al abrir una terminal grafica. El punto (`.`) es equivalente a `source`.

</details>
