---
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.5"
titulo: "Gestión Local de Usuarios - Ejercicios"
peso: 2
tags:
  - lpic-3
  - tema-302
  - ejercicios
---

# Ejercicios - 302.5 Gestión Local de Usuarios

### Pregunta 1
¿Qué requisito debe cumplirse antes de poder añadir un usuario a la base de datos de Samba con `smbpasswd -a`?

a) El usuario debe existir en Active Directory
b) El usuario debe existir en el sistema Linux (/etc/passwd)
c) El usuario debe tener un directorio home
d) El usuario debe pertenecer al grupo samba

<details><summary>Respuesta</summary>

**b) El usuario debe existir en el sistema Linux (/etc/passwd)**

`smbpasswd -a` añade una contraseña Samba para un usuario que ya debe existir como usuario UNIX en `/etc/passwd`. Si el usuario no existe en el sistema, el comando fallará. Primero se debe crear el usuario con `useradd` y luego añadirlo a Samba con `smbpasswd -a`.
</details>

### Pregunta 2
¿Qué ventaja tiene `pdbedit` sobre `smbpasswd` para la gestión de usuarios locales de Samba?

a) pdbedit es más rápido
b) pdbedit permite modificar atributos extendidos como perfil, script de login y home de red
c) pdbedit no requiere que el usuario exista en /etc/passwd
d) pdbedit funciona con Active Directory

<details><summary>Respuesta</summary>

**b) pdbedit permite modificar atributos extendidos como perfil, script de login y home de red**

`pdbedit` es más completo que `smbpasswd`: permite gestionar atributos como el nombre completo, directorio home de red, letra de unidad, script de login, perfil de usuario y descripción. Además, permite exportar/importar la base de datos y migrar entre backends (de smbpasswd a tdbsam, por ejemplo).
</details>

### Pregunta 3
En el archivo de mapeo de usuarios (`username map`), ¿qué hace la entrada `root = administrator admin`?

a) Crea los usuarios administrator y admin como alias de root
b) Mapea los nombres Windows "administrator" y "admin" al usuario Unix "root"
c) Impide que administrator y admin se conecten como root
d) Sincroniza las contraseñas entre root, administrator y admin

<details><summary>Respuesta</summary>

**b) Mapea los nombres Windows "administrator" y "admin" al usuario Unix "root"**

El formato del archivo username map es `usuario_unix = nombre_windows1 [nombre_windows2 ...]`. Cuando un cliente se conecta como "administrator" o "admin", Samba traduce ese nombre a "root" antes de la autenticación. Esto es útil para que el administrador de Windows pueda gestionar recursos como root.
</details>

### Pregunta 4
¿Qué efecto tiene `force group = +proyecto` en un recurso compartido?

a) Fuerza el grupo "proyecto" para todos los usuarios
b) Fuerza el grupo "proyecto" solo si el usuario ya es miembro de ese grupo
c) Añade automáticamente al usuario al grupo "proyecto"
d) Crea el grupo "proyecto" si no existe

<details><summary>Respuesta</summary>

**b) Fuerza el grupo "proyecto" solo si el usuario ya es miembro de ese grupo**

El signo `+` antes del nombre del grupo indica que `force group` solo aplica si el usuario autenticado ya pertenece al grupo "proyecto". Si el usuario no es miembro, se utiliza su grupo primario normal. Sin el `+`, el grupo se fuerza para todos los usuarios sin importar su membresía.
</details>

### Pregunta 5
¿Cuál es la diferencia entre `map to guest = Bad User` y `map to guest = Bad Password`?

a) No hay diferencia
b) "Bad User" mapea a invitado si el usuario no existe; "Bad Password" si la contraseña falla
c) "Bad User" es más moderno; "Bad Password" es legacy
d) "Bad User" requiere winbind; "Bad Password" no

<details><summary>Respuesta</summary>

**b) "Bad User" mapea a invitado si el usuario no existe; "Bad Password" si la contraseña falla**

`Bad User` mapea a la cuenta de invitado cuando el nombre de usuario enviado no existe en la base de datos de Samba. `Bad Password` mapea a invitado incluso cuando el usuario existe pero la contraseña es incorrecta, lo cual es inseguro porque un usuario legítimo con contraseña errónea obtendría acceso de invitado en lugar de un error de autenticación.
</details>

### Pregunta 6
¿Cómo se exporta la base de datos de usuarios de Samba al formato smbpasswd con pdbedit?

a) `pdbedit --export smbpasswd`
b) `pdbedit -e smbpasswd:/tmp/export.txt`
c) `pdbedit -L -w > /tmp/export.txt`
d) `pdbedit --dump /tmp/export.txt`

<details><summary>Respuesta</summary>

**b) `pdbedit -e smbpasswd:/tmp/export.txt`**

La opción `-e` (export) de `pdbedit` exporta la base de datos al formato especificado. La sintaxis es `pdbedit -e backend:ruta`. Se puede exportar a formato smbpasswd (texto plano) o tdbsam (base TDB). Para importar se usa `-i`: `pdbedit -i smbpasswd:/tmp/export.txt`. La opción `-L -w` también lista en formato smbpasswd pero es solo para visualización.
</details>

### Pregunta 7
¿Qué cuenta Unix se utiliza por defecto para los accesos de invitado en Samba?

a) guest
b) samba
c) nobody
d) anonymous

<details><summary>Respuesta</summary>

**c) nobody**

Por defecto, Samba utiliza la cuenta `nobody` como cuenta de invitado (`guest account = nobody` en smb.conf). Esta cuenta debe existir en el sistema Linux. Los archivos creados por usuarios invitados pertenecerán a esta cuenta. Se puede cambiar con el parámetro `guest account` en la sección [global].
</details>

### Pregunta 8
Un administrador quiere que todos los archivos creados en el recurso compartido "web" pertenezcan al usuario "www-data" y al grupo "www-data". ¿Qué configuración necesita?

a) `valid users = www-data`
b) `force user = www-data` y `force group = www-data`
c) `create mask = www-data:www-data`
d) `owner = www-data`

<details><summary>Respuesta</summary>

**b) `force user = www-data` y `force group = www-data`**

La combinación de `force user = www-data` y `force group = www-data` hace que todas las operaciones de archivos en el recurso compartido se realicen con la identidad de www-data, independientemente del usuario que se haya autenticado. Esto es común en recursos para servidores web donde todos los archivos deben pertenecer al usuario del servidor web.
</details>

### Pregunta 9
¿Qué parámetro de smb.conf debe estar activado para que `getent passwd` muestre los usuarios del dominio a través de winbind?

a) `winbind use default domain = yes`
b) `winbind enum users = yes`
c) `security = ads`
d) `passdb backend = tdbsam`

<details><summary>Respuesta</summary>

**b) `winbind enum users = yes`**

El parámetro `winbind enum users = yes` permite que winbind enumere todos los usuarios del dominio, lo que hace posible que `getent passwd` (sin argumentos) liste los usuarios de dominio. Sin este parámetro, `getent passwd usuario_específico` puede funcionar, pero la lista completa no se mostrará. En dominios grandes, la enumeración puede ser lenta.
</details>

### Pregunta 10
¿Cuál es el propósito del comodín `!nobody = *` al final de un archivo username map?

a) Eliminar al usuario nobody
b) Bloquear todos los accesos no mapeados
c) Mapear todos los usuarios no mapeados previamente a "nobody" y detener la búsqueda
d) Crear un usuario nobody para cada conexión

<details><summary>Respuesta</summary>

**c) Mapear todos los usuarios no mapeados previamente a "nobody" y detener la búsqueda**

El carácter `!` indica que se debe detener el procesamiento del archivo de mapeo en esa línea. El `*` coincide con cualquier nombre de usuario. Juntos, `!nobody = *` mapea cualquier usuario que no haya coincidido con reglas anteriores al usuario Unix "nobody" y detiene la búsqueda. Sin el `!`, el procesamiento continuaría innecesariamente.
</details>
