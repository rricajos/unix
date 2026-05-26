# 105.1 - Comandos clave: Entorno del shell

## Variables y entorno

| Comando | Descripcion |
|---------|-------------|
| `set` | Muestra todas las variables (locales + entorno) y funciones |
| `unset VAR` | Elimina una variable o funcion (`unset -f func`) |
| `export VAR=valor` | Crea/exporta variable de entorno (heredada por hijos) |
| `export -n VAR` | Des-exporta variable (la vuelve local) |
| `export` | Sin argumentos: lista variables exportadas |
| `env` | Muestra solo variables de entorno |
| `env VAR=val cmd` | Ejecuta comando con variable de entorno temporal |
| `printenv` | Muestra variables de entorno |
| `printenv VAR` | Muestra valor de una variable especifica |

## Alias

| Comando | Descripcion |
|---------|-------------|
| `alias nombre='comando'` | Crea un alias |
| `alias` | Lista todos los alias definidos |
| `alias nombre` | Muestra la definicion de un alias |
| `unalias nombre` | Elimina un alias |
| `unalias -a` | Elimina todos los alias |
| `\comando` | Ejecuta el comando original, ignorando el alias |

## Funciones

| Comando | Descripcion |
|---------|-------------|
| `function nombre { cmds; }` | Define funcion (sintaxis bash) |
| `nombre() { cmds; }` | Define funcion (sintaxis POSIX) |
| `declare -f` | Muestra todas las funciones con su cuerpo |
| `declare -F` | Muestra solo nombres de funciones |
| `unset -f nombre` | Elimina una funcion |

## source y ejecucion

| Comando | Descripcion |
|---------|-------------|
| `source archivo` | Ejecuta archivo en el shell actual |
| `. archivo` | Identico a `source` |
| `bash script.sh` | Ejecuta en un subshell (cambios no afectan al padre) |
| `./script.sh` | Ejecuta en un subshell (requiere permiso de ejecucion) |

## Archivos de inicio - Login shell (orden de ejecucion)

| Orden | Archivo | Ambito |
|-------|---------|--------|
| 1 | `/etc/profile` | Global |
| 1.1 | `/etc/profile.d/*.sh` | Global (invocados por /etc/profile) |
| 2 | `~/.bash_profile` | Usuario (1ra opcion) |
| 2 alt | `~/.bash_login` | Usuario (2da opcion, si no hay .bash_profile) |
| 2 alt | `~/.profile` | Usuario (3ra opcion, si no hay anteriores) |
| Cierre | `~/.bash_logout` | Usuario (al cerrar login shell) |

## Archivos de inicio - Non-login shell

| Orden | Archivo | Ambito |
|-------|---------|--------|
| 1 | `/etc/bash.bashrc` | Global |
| 2 | `~/.bashrc` | Usuario |

## Otros archivos importantes

| Archivo | Descripcion |
|---------|-------------|
| `/etc/skel/` | Plantilla para directorio home de nuevos usuarios |
| `/etc/environment` | Variables globales (formato `VAR=valor`, no es script) |

## Personalizacion del prompt PS1

| Secuencia | Significado |
|-----------|-------------|
| `\u` | Nombre de usuario |
| `\h` | Hostname corto |
| `\H` | Hostname completo |
| `\w` | Directorio actual (ruta completa) |
| `\W` | Directorio actual (solo nombre) |
| `\d` | Fecha |
| `\t` | Hora 24h (HH:MM:SS) |
| `\$` | `$` para usuario, `#` para root |
| `\n` | Salto de linea |

## PATH

| Operacion | Comando |
|-----------|---------|
| Ver PATH | `echo $PATH` |
| Agregar al final | `export PATH="$PATH:/nuevo/dir"` |
| Agregar al inicio | `export PATH="/nuevo/dir:$PATH"` |
| Hacer permanente | Agregar la linea `export PATH=...` en `~/.bashrc` o `~/.profile` |

## Identificar tipo de shell

| Comando | Resultado |
|---------|-----------|
| `echo $0` | `-bash` = login shell, `bash` = non-login |
| `shopt login_shell` | `on` = login, `off` = non-login |
