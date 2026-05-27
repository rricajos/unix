---
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.2"
titulo: "Configuración Samba - Ejercicios"
peso: 4
tags:
  - lpic-3
  - tema-301
  - ejercicios
---

# Ejercicios - 301.2 Configuración Samba

### Pregunta 1
¿Qué herramienta se debe utilizar para verificar la sintaxis del archivo smb.conf?

a) smbclient
b) testparm
c) smbstatus
d) pdbedit

<details><summary>Respuesta</summary>

**b) testparm**

`testparm` es la herramienta oficial para verificar la sintaxis y la validez de la configuración en smb.conf. Muestra advertencias sobre parámetros incorrectos o en desuso y presenta la configuración efectiva. Se recomienda ejecutarlo después de cada cambio en smb.conf.
</details>

### Pregunta 2
¿Cuál es el backend de autenticación predeterminado en Samba 4?

a) smbpasswd
b) ldapsam
c) tdbsam
d) mysqlsam

<details><summary>Respuesta</summary>

**c) tdbsam**

`tdbsam` es el backend predeterminado desde Samba 3. Almacena las cuentas en una base de datos TDB (Trivial Database) en `/var/lib/samba/private/passdb.tdb`. Es adecuado para servidores independientes y entornos pequeños. `smbpasswd` es el formato legacy y `ldapsam` se usa para entornos distribuidos.
</details>

### Pregunta 3
¿Qué sección especial de smb.conf crea automáticamente un recurso compartido para el directorio personal de cada usuario?

a) [printers]
b) [global]
c) [homes]
d) [users]

<details><summary>Respuesta</summary>

**c) [homes]**

La sección `[homes]` es una sección especial que crea dinámicamente un recurso compartido para el directorio home de cada usuario autenticado. Cuando un usuario se conecta, Samba busca primero un recurso con su nombre y, si no existe, comprueba si existe la sección [homes] y el usuario en el sistema.
</details>

### Pregunta 4
En smb.conf, ¿qué variable se sustituye por el nombre NetBIOS del cliente que se conecta?

a) `%U`
b) `%I`
c) `%m`
d) `%L`

<details><summary>Respuesta</summary>

**c) `%m`**

La variable `%m` se sustituye por el nombre NetBIOS del cliente. `%U` es el nombre de usuario solicitado, `%I` es la dirección IP del cliente y `%L` es el nombre NetBIOS del servidor. Estas variables son útiles para crear logs separados por cliente: `log file = /var/log/samba/log.%m`.
</details>

### Pregunta 5
¿Qué valor del parámetro `server role` configura Samba como miembro de un dominio?

a) `standalone server`
b) `member server`
c) `active directory domain controller`
d) `domain member`

<details><summary>Respuesta</summary>

**b) `member server`**

El valor `member server` configura Samba como miembro de un dominio Active Directory o NT4. En este modo, Samba delega la autenticación al controlador de dominio. `standalone server` es para servidores independientes y `active directory domain controller` es para actuar como DC.
</details>

### Pregunta 6
¿Cuál es la función del módulo VFS `recycle`?

a) Comprime archivos antiguos automáticamente
b) Implementa una papelera de reciclaje para archivos eliminados
c) Recicla las conexiones inactivas
d) Libera espacio en disco automáticamente

<details><summary>Respuesta</summary>

**b) Implementa una papelera de reciclaje para archivos eliminados**

El módulo VFS `recycle` intercepta las operaciones de eliminación de archivos y los mueve a un directorio de papelera (configurado con `recycle:repository`) en lugar de eliminarlos definitivamente. Permite configurar opciones como mantener la estructura de directorios (`keeptree`), versionar archivos (`versions`) y limitar el tamaño máximo.
</details>

### Pregunta 7
¿Qué parámetro de smb.conf limita las interfaces de red en las que Samba escucha peticiones?

a) `network interfaces`
b) `listen on`
c) `interfaces` junto con `bind interfaces only`
d) `socket address`

<details><summary>Respuesta</summary>

**c) `interfaces` junto con `bind interfaces only`**

El parámetro `interfaces` define las interfaces o subredes en las que Samba acepta conexiones (ej: `interfaces = eth0 lo 192.168.1.0/24`). Para que la restricción sea efectiva, debe combinarse con `bind interfaces only = yes`. Sin este segundo parámetro, Samba escucha en todas las interfaces.
</details>

### Pregunta 8
¿Qué diferencia hay entre `create mask` y `force create mode` en smb.conf?

a) No hay diferencia, son sinónimos
b) `create mask` aplica un AND lógico; `force create mode` aplica un OR lógico
c) `create mask` se aplica a directorios; `force create mode` a archivos
d) `create mask` es para SMB1; `force create mode` para SMB2

<details><summary>Respuesta</summary>

**b) `create mask` aplica un AND lógico; `force create mode` aplica un OR lógico**

`create mask` (también llamado `create mode`) aplica una operación AND bit a bit con los permisos del archivo creado, eliminando bits de permiso. `force create mode` aplica una operación OR bit a bit, asegurando que ciertos bits estén siempre activos. Por ejemplo, `create mask = 0660` garantiza que "otros" nunca tengan permisos, mientras que `force create mode = 0040` asegura lectura para el grupo.
</details>

### Pregunta 9
Un administrador necesita que todos los archivos creados en un recurso compartido pertenezcan al grupo "contabilidad". ¿Qué parámetro debe usar?

a) `valid users = @contabilidad`
b) `write list = @contabilidad`
c) `force group = contabilidad`
d) `group = contabilidad`

<details><summary>Respuesta</summary>

**c) `force group = contabilidad`**

El parámetro `force group = contabilidad` hace que todas las operaciones de archivos en el recurso compartido se realicen con la identidad del grupo "contabilidad", independientemente del grupo primario del usuario. `valid users` restringe quién puede acceder y `write list` define quién puede escribir, pero ninguno cambia la propiedad de los archivos.
</details>

### Pregunta 10
¿Cuál de las siguientes configuraciones de `passdb backend` permite centralizar usuarios en un directorio LDAP?

a) `passdb backend = tdbsam`
b) `passdb backend = smbpasswd`
c) `passdb backend = ldapsam:ldap://ldap.ejemplo.com`
d) `passdb backend = adsam`

<details><summary>Respuesta</summary>

**c) `passdb backend = ldapsam:ldap://ldap.ejemplo.com`**

El backend `ldapsam` permite almacenar las cuentas Samba en un servidor LDAP externo, facilitando la centralización de usuarios en entornos con múltiples servidores. Requiere que el esquema LDAP de Samba esté instalado en el servidor LDAP. `tdbsam` y `smbpasswd` son backends locales.
</details>
