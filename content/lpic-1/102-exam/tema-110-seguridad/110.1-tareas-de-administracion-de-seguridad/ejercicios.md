---
title: "110.1 Tareas de administracion de seguridad - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-110
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "110"
subtema: "110.1"
---

# 110.1 Tareas de administracion de seguridad - Ejercicios

## Ejercicio 1
¿Como encontrarias todos los archivos con permisos SUID en el sistema? ¿Por que es importante auditar estos archivos?

<details><summary>Respuesta</summary>

```bash
find / -perm -4000 -type f 2>/dev/null
```

Para incluir tambien SGID:
```bash
find / -perm /6000 -type f -ls 2>/dev/null
```

Es importante auditar estos archivos porque un archivo con SUID se ejecuta con los permisos del **propietario** (normalmente root), no del usuario que lo ejecuta. Un atacante podria explotar vulnerabilidades en programas SUID para obtener acceso root al sistema. Se recomienda auditar periodicamente y eliminar el bit SUID de programas que no lo necesiten.

</details>

## Ejercicio 2
Escribe la linea en `/etc/sudoers` que permita al usuario `maria` reiniciar el servicio nginx sin pedir contrasena.

<details><summary>Respuesta</summary>

```
maria   ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
```

Campos:
- `maria`: El usuario
- `ALL`: Desde cualquier host
- `(ALL)`: Ejecutar como cualquier usuario
- `NOPASSWD:`: Sin pedir contrasena
- `/usr/bin/systemctl restart nginx`: Solo este comando especifico

Recordar: siempre editar con `visudo` para validar la sintaxis antes de guardar.

</details>

## Ejercicio 3
¿Cual es la diferencia entre `su` y `sudo`? ¿Y entre `su -` y `su`?

<details><summary>Respuesta</summary>

**`su` vs `sudo`**:
- **`su`** (Switch User): Cambia al usuario completo, requiere la contrasena **del usuario destino** (normalmente root).
- **`sudo`** (Superuser Do): Ejecuta un comando con privilegios elevados, requiere la contrasena **del propio usuario** y debe estar autorizado en `/etc/sudoers`.

**`su` vs `su -`**:
- **`su`**: Cambia al usuario root pero **mantiene** el entorno actual (variables, directorio, PATH).
- **`su -`**: Cambia al usuario root con un **login shell completo**, cargando el entorno de root (/root como HOME, PATH de root, etc.).

Se recomienda usar `sudo` sobre `su` porque permite control granular y registro de comandos.

</details>

## Ejercicio 4
¿Como configurarias la politica de contrasena del usuario `juan` para que: a) la contrasena expire en 60 dias, b) no pueda cambiarla antes de 7 dias, c) reciba aviso 14 dias antes?

<details><summary>Respuesta</summary>

```bash
chage -M 60 juan     # Maximo 60 dias de validez
chage -m 7 juan      # Minimo 7 dias entre cambios
chage -W 14 juan     # Avisar 14 dias antes de caducidad
```

Verificar la configuracion:
```bash
chage -l juan
```

Para forzar el cambio de contrasena en el proximo login:
```bash
chage -d 0 juan
# o equivalentemente:
passwd -e juan
```

</details>

## Ejercicio 5
¿Que comando usarias para saber que proceso esta usando el puerto TCP 80? Indica al menos tres formas.

<details><summary>Respuesta</summary>

```bash
# Con lsof
lsof -i :80

# Con fuser
fuser -n tcp 80

# Con ss
ss -tulnp | grep :80

# Con netstat (legacy)
netstat -tulnp | grep :80

# Con nmap (escaneo local)
nmap -p 80 localhost
```

`lsof -i :80` y `fuser -n tcp 80` son las respuestas mas directas para el examen.

</details>

## Ejercicio 6
¿Cual es la diferencia entre limites `soft` y `hard` en `ulimit` y `/etc/security/limits.conf`?

<details><summary>Respuesta</summary>

- **Soft limit**: Es el limite actual en efecto. El usuario **puede aumentarlo** hasta el valor del hard limit.
- **Hard limit**: Es el limite maximo absoluto. **Solo root puede aumentarlo**. El usuario puede reducirlo pero no volver a subirlo.

En `ulimit`:
```bash
ulimit -Su     # Ver soft limit de procesos
ulimit -Hu     # Ver hard limit de procesos
```

En `/etc/security/limits.conf`:
```
juan    soft    nproc    50      # Limite actual: 50 procesos
juan    hard    nproc    100     # Maximo: 100 procesos
juan    -       nofile   4096   # El - establece ambos (soft y hard)
```

</details>

## Ejercicio 7
¿Que informacion muestra cada uno de estos comandos: `who`, `w`, `last`, `lastb`?

<details><summary>Respuesta</summary>

- **`who`**: Muestra los usuarios **conectados actualmente** al sistema (usuario, terminal, fecha/hora de login, host remoto).

- **`w`**: Muestra los usuarios **conectados actualmente** con informacion adicional: tiempo de inactividad (idle), carga del sistema, y **que comando estan ejecutando** en este momento.

- **`last`**: Muestra el **historico de logins** del sistema (lee `/var/log/wtmp`). Incluye logins exitosos, logouts y reinicios.

- **`lastb`**: Muestra los **intentos de login fallidos** (lee `/var/log/btmp`). Requiere permisos de root.

En resumen: `who`/`w` = presente, `last`/`lastb` = pasado.

</details>

## Ejercicio 8
Escribe una configuracion en `/etc/security/limits.conf` que: a) limite a 200 procesos al grupo `developers`, b) permita 8192 archivos abiertos al usuario `webserver`, c) deshabilite los core dumps para todos.

<details><summary>Respuesta</summary>

```
# Limitar procesos del grupo developers
@developers    soft    nproc     100
@developers    hard    nproc     200

# Archivos abiertos para webserver
webserver      soft    nofile    4096
webserver      hard    nofile    8192

# Deshabilitar core dumps para todos
*              hard    core      0
```

Para verificar que los limites se aplican, el usuario puede usar:
```bash
ulimit -a
```

Los cambios en `limits.conf` se aplican en el proximo login (son gestionados por PAM).

</details>
