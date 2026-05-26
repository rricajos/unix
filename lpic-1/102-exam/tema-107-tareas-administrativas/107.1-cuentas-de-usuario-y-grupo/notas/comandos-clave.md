# 107.1 - Comandos clave: Cuentas de usuario y grupo

## Archivos del sistema

| Archivo | Campos | Descripcion |
|---------|--------|-------------|
| `/etc/passwd` | 7 | `usuario:x:UID:GID:GECOS:home:shell` |
| `/etc/shadow` | 9 | `usuario:hash:lastchg:min:max:warn:inactive:expire:reserved` |
| `/etc/group` | 4 | `grupo:x:GID:miembros` |
| `/etc/gshadow` | 4 | `grupo:password:admins:miembros` |
| `/etc/login.defs` | - | Valores por defecto (UID_MIN, PASS_MAX_DAYS, etc.) |
| `/etc/skel/` | - | Archivos plantilla para nuevos usuarios |

## Rangos de UID

| Rango | Tipo |
|-------|------|
| 0 | root |
| 1-999 | Usuarios del sistema |
| 1000-60000 | Usuarios regulares |

## Valores del campo password en /etc/shadow

| Valor | Significado |
|-------|-------------|
| `$6$...` | SHA-512 (comun) |
| `$5$...` | SHA-256 |
| `$y$...` | yescrypt |
| `$1$...` | MD5 (obsoleto) |
| `!` o `!!` | Cuenta bloqueada |
| `*` | Cuenta deshabilitada |
| (vacio) | Sin contrasena |

## useradd - Crear usuarios

| Opcion | Descripcion |
|--------|-------------|
| `-m` | Crear directorio home (copia /etc/skel/) |
| `-M` | NO crear directorio home |
| `-d /ruta` | Directorio home personalizado |
| `-s /shell` | Shell de login |
| `-g grupo` | Grupo primario |
| `-G g1,g2` | Grupos secundarios |
| `-u UID` | UID especifico |
| `-c "texto"` | Campo GECOS (comentario) |
| `-e YYYY-MM-DD` | Fecha de expiracion de la cuenta |
| `-r` | Crear usuario del sistema (UID < 1000) |

## usermod - Modificar usuarios

| Opcion | Descripcion |
|--------|-------------|
| `-l nuevo` | Cambiar nombre de login |
| `-d /ruta` | Cambiar home (sin mover) |
| `-d /ruta -m` | Cambiar home Y mover contenido |
| `-s /shell` | Cambiar shell |
| `-g grupo` | Cambiar grupo primario |
| `-G g1,g2` | Establecer grupos secundarios (REEMPLAZA todos) |
| `-aG grupo` | AGREGAR a grupo secundario (sin perder otros) |
| `-L` | Bloquear cuenta (agrega ! al hash) |
| `-U` | Desbloquear cuenta |
| `-e YYYY-MM-DD` | Fecha de expiracion |
| `-c "texto"` | Cambiar GECOS |
| `-u UID` | Cambiar UID |

**CRITICO:** `-G` reemplaza, `-aG` agrega

## userdel - Eliminar usuarios

| Opcion | Descripcion |
|--------|-------------|
| (sin opciones) | Elimina usuario, conserva /home |
| `-r` | Elimina usuario + home + mail spool |

## groupadd / groupmod / groupdel

| Comando | Descripcion |
|---------|-------------|
| `groupadd grupo` | Crear grupo |
| `groupadd -g GID grupo` | Crear grupo con GID especifico |
| `groupadd -r grupo` | Crear grupo del sistema |
| `groupmod -n nuevo viejo` | Renombrar grupo |
| `groupmod -g GID grupo` | Cambiar GID |
| `groupdel grupo` | Eliminar grupo |

## passwd - Contrasenas

| Opcion | Descripcion |
|--------|-------------|
| `passwd` | Cambiar contrasena propia |
| `passwd usuario` | Cambiar contrasena (root) |
| `-l` | Bloquear cuenta (lock) |
| `-u` | Desbloquear cuenta (unlock) |
| `-e` | Forzar cambio en proximo login (expire) |
| `-d` | Eliminar contrasena (delete) |
| `-S` | Mostrar estado (Status) |
| `-n dias` | Dias minimos entre cambios |
| `-x dias` | Dias maximos de validez |
| `-w dias` | Dias de aviso |

## chage - Envejecimiento de contrasenas

| Opcion | Descripcion |
|--------|-------------|
| `-l` | Listar informacion de envejecimiento |
| `-E YYYY-MM-DD` | Fecha de expiracion de la cuenta |
| `-E -1` | Eliminar expiracion |
| `-M dias` | Dias maximos de validez de contrasena |
| `-m dias` | Dias minimos entre cambios |
| `-W dias` | Dias de aviso antes de caducidad |
| `-I dias` | Dias de inactividad tras expirar |
| `-d 0` | Forzar cambio de contrasena al proximo login |

## Consulta de informacion

| Comando | Descripcion |
|---------|-------------|
| `id` | UID, GID y grupos del usuario actual |
| `id usuario` | UID, GID y grupos de un usuario |
| `id -u usuario` | Solo UID |
| `id -g usuario` | Solo GID primario |
| `id -G usuario` | Todos los GIDs |
| `id -Gn usuario` | Todos los nombres de grupos |
| `getent passwd usuario` | Consultar entrada en passwd |
| `getent group grupo` | Consultar entrada en group |
| `getent shadow usuario` | Consultar entrada en shadow (root) |

## newgrp y gpasswd

| Comando | Descripcion |
|---------|-------------|
| `newgrp grupo` | Cambiar grupo primario temporalmente |
| `gpasswd grupo` | Establecer contrasena del grupo |
| `gpasswd -a user grupo` | Agregar usuario a grupo |
| `gpasswd -d user grupo` | Eliminar usuario de grupo |
| `gpasswd -A user grupo` | Hacer administrador del grupo |
| `gpasswd -r grupo` | Eliminar contrasena del grupo |
| `gpasswd -M u1,u2 grupo` | Establecer lista de miembros |
