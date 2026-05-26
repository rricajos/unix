# 105.1 - Ejercicios: Personalizar y usar el entorno del shell

## Ejercicio 1
Un usuario inicia sesion en el sistema mediante SSH. Tiene los archivos `~/.bash_profile`, `~/.bash_login` y `~/.profile` en su directorio home. Cual de estos archivos sera ejecutado por bash?

<details>
<summary>Respuesta</summary>

Solo se ejecutara `~/.bash_profile`. Bash busca estos tres archivos en orden (`~/.bash_profile` --> `~/.bash_login` --> `~/.profile`) y ejecuta **unicamente el primero** que encuentre. Como `~/.bash_profile` existe, los otros dos son ignorados.

Ademas, previamente se habra ejecutado `/etc/profile` (y los scripts en `/etc/profile.d/`) por ser un login shell.
</details>

---

## Ejercicio 2
Cual es la diferencia entre ejecutar `source ~/.bashrc` y ejecutar `bash ~/.bashrc`? En que situaciones usarias cada uno?

<details>
<summary>Respuesta</summary>

- `source ~/.bashrc` (o `. ~/.bashrc`): Ejecuta el archivo en el **shell actual**. Todas las variables, alias y funciones definidas en el archivo quedan disponibles en la sesion actual. Es la forma correcta de recargar la configuracion.

- `bash ~/.bashrc`: Ejecuta el archivo en un **subshell** (proceso hijo). Las variables, alias y funciones se crean en el subshell y se pierden al terminar. Los cambios **no afectan** al shell actual.

Se usa `source` para recargar configuraciones. Se usa `bash script.sh` para ejecutar scripts independientes.
</details>

---

## Ejercicio 3
Crea una variable local `MI_VAR="hola"` y luego verifica que NO aparece al ejecutar `env`. Despues, exportala y verifica que SI aparece con `env`. Que comandos usarias?

<details>
<summary>Respuesta</summary>

```bash
# Crear variable local
MI_VAR="hola"

# Verificar que NO aparece en env (variables de entorno)
env | grep MI_VAR          # No produce salida

# Verificar que SI aparece con set (todas las variables)
set | grep MI_VAR          # Muestra: MI_VAR=hola

# Exportarla como variable de entorno
export MI_VAR

# Verificar que ahora SI aparece en env
env | grep MI_VAR          # Muestra: MI_VAR=hola
```

La diferencia clave es que `set` muestra todas las variables (locales y de entorno), mientras que `env` solo muestra las variables de entorno (exportadas).
</details>

---

## Ejercicio 4
Un administrador quiere que todos los nuevos usuarios creados en el sistema tengan un alias `ll='ls -la'` disponible automaticamente. Que archivo debe modificar y en que directorio?

<details>
<summary>Respuesta</summary>

Debe agregar la linea `alias ll='ls -la'` al archivo `/etc/skel/.bashrc`.

```bash
echo "alias ll='ls -la'" >> /etc/skel/.bashrc
```

El directorio `/etc/skel/` contiene los archivos plantilla que se copian al directorio home de cada nuevo usuario cuando se crea con `useradd -m`. Al modificar `/etc/skel/.bashrc`, todos los usuarios creados a partir de ese momento tendran el alias.

**Nota:** Esto NO afecta a los usuarios ya existentes. Para ellos, habria que modificar sus `~/.bashrc` individuales o usar `/etc/bash.bashrc` para una configuracion global inmediata.
</details>

---

## Ejercicio 5
Escribe una funcion de bash llamada `mkcd` que cree un directorio y entre en el. Donde la colocarias para que este disponible en cada sesion?

<details>
<summary>Respuesta</summary>

La funcion:
```bash
mkcd() {
    mkdir -p "$1" && cd "$1"
}
```

O con la sintaxis alternativa:
```bash
function mkcd {
    mkdir -p "$1" && cd "$1"
}
```

Se debe colocar en `~/.bashrc` para que este disponible en cada nueva sesion de shell interactivo. Si se quiere que este disponible tambien en login shells, hay que asegurarse de que `~/.bash_profile` invoque a `~/.bashrc` con:
```bash
if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi
```
</details>

---

## Ejercicio 6
Que sucede al ejecutar los siguientes comandos? Explica cada paso.
```bash
PS1="\u@\h:\w\$ "
export PATH="$HOME/scripts:$PATH"
alias cls='clear'
```

<details>
<summary>Respuesta</summary>

1. `PS1="\u@\h:\w\$ "` - Cambia el prompt del shell para mostrar `usuario@hostname:/directorio/actual$ `. Las secuencias `\u`, `\h`, `\w` y `\$` son reemplazadas dinamicamente por bash.

2. `export PATH="$HOME/scripts:$PATH"` - Agrega el directorio `$HOME/scripts` al **inicio** del PATH (dandole prioridad sobre los demas directorios). Al exportar, los procesos hijos tambien heredan este PATH modificado.

3. `alias cls='clear'` - Crea un alias para que al escribir `cls` se ejecute el comando `clear` (limpiar la pantalla).

**Importante:** Estos tres cambios son temporales y se pierden al cerrar la sesion. Para hacerlos permanentes, deben agregarse a `~/.bashrc`.
</details>

---

## Ejercicio 7
Cual es la diferencia entre `/etc/profile` y `/etc/environment`? En que tipo de sistemas se usa cada uno?

<details>
<summary>Respuesta</summary>

**`/etc/profile`:**
- Es un **script de shell** ejecutado por login shells
- Soporta logica de programacion, expansiones de variables, condicionales
- Puede ejecutar scripts de `/etc/profile.d/`
- Es estandar en todas las distribuciones Linux

**`/etc/environment`:**
- **NO es un script**. Es un archivo simple con formato `VARIABLE=valor`
- Es leido por el modulo PAM (`pam_env`), no por bash directamente
- NO soporta expansiones de variables (no se puede usar `$HOME`)
- Se aplica a todas las sesiones, incluyendo las no interactivas
- Es especifico de sistemas con PAM (principalmente Debian/Ubuntu)

Ejemplo de `/etc/environment`:
```
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin"
LANG="es_ES.UTF-8"
```
</details>

---

## Ejercicio 8
Un usuario abre una terminal grafica en su escritorio GNOME. Es un login shell o un non-login shell? Que archivos de inicio se ejecutan? Si el usuario quiere que un alias definido en `~/.bashrc` funcione tambien al conectarse por SSH, que debe hacer?

<details>
<summary>Respuesta</summary>

**Terminal grafica:** Es un **non-login shell** (shell interactivo no-login). Los archivos ejecutados son:
1. `/etc/bash.bashrc` (global)
2. `~/.bashrc` (usuario)

**Conexion SSH:** Es un **login shell**. Los archivos ejecutados son:
1. `/etc/profile` (y `/etc/profile.d/*.sh`)
2. `~/.bash_profile` (o `~/.bash_login` o `~/.profile`)

Para que un alias definido en `~/.bashrc` funcione tambien en sesiones SSH (login shells), el usuario debe asegurarse de que su archivo `~/.bash_profile` (o el que tenga) incluya la siguiente linea:

```bash
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
```

Esto hace que el login shell tambien cargue `~/.bashrc`, unificando la configuracion en ambos tipos de sesion.
</details>
