---
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.3"
titulo: "Gestión de Usuarios AD - Ejercicios"
peso: 3
tags:
  - lpic-3
  - tema-302
  - ejercicios
---

# Ejercicios - 302.3 Gestión de Usuarios en Active Directory

### Pregunta 1
¿Qué comando crea un nuevo usuario "maria" con contraseña en el dominio AD de Samba?

a) `samba-tool user add maria 'P@ss123'`
b) `samba-tool user create maria 'P@ss123'`
c) `smbpasswd -a maria`
d) `net ads user add maria`

<details><summary>Respuesta</summary>

**b) `samba-tool user create maria 'P@ss123'`**

`samba-tool user create` es el comando para crear usuarios en un dominio AD de Samba. La contraseña debe cumplir la política de complejidad del dominio. `smbpasswd -a` solo funciona para usuarios locales de Samba (no AD). `net ads user add` no es un comando válido.
</details>

### Pregunta 2
¿Qué comando muestra la política de contraseñas actual del dominio AD?

a) `samba-tool password policy`
b) `samba-tool domain passwordsettings show`
c) `net ads passwordsettings`
d) `samba-tool user passwordpolicy`

<details><summary>Respuesta</summary>

**b) `samba-tool domain passwordsettings show`**

`samba-tool domain passwordsettings show` muestra la configuración actual de la política de contraseñas del dominio, incluyendo longitud mínima, complejidad, historial, edades mínima y máxima, y parámetros de bloqueo de cuenta. Se modifica con `samba-tool domain passwordsettings set`.
</details>

### Pregunta 3
¿Qué backend idmap calcula el UID/GID directamente a partir del RID del SID, sin necesidad de almacenamiento adicional?

a) tdb
b) ad
c) rid
d) autorid

<details><summary>Respuesta</summary>

**c) rid**

El backend `rid` calcula el UID/GID aplicando una fórmula basada en el RID (Relative ID) del SID de Windows, sumándolo al inicio del rango configurado. No requiere almacenamiento de estado ni atributos adicionales en AD. El resultado es determinista: el mismo SID siempre produce el mismo UID/GID en cualquier servidor con la misma configuración.
</details>

### Pregunta 4
¿Qué herramienta de Windows se utiliza para administrar usuarios y grupos en un dominio Samba AD?

a) Windows PowerShell
b) Computer Management
c) Active Directory Users and Computers (RSAT)
d) Control Panel

<details><summary>Respuesta</summary>

**c) Active Directory Users and Computers (RSAT)**

Active Directory Users and Computers (ADUC), parte de las herramientas RSAT (Remote Server Administration Tools), es la herramienta gráfica estándar para administrar usuarios, grupos, OUs y equipos en un dominio AD. Funciona con Samba AD DC desde un equipo Windows unido al dominio.
</details>

### Pregunta 5
¿Cómo se añaden los usuarios "pedro" y "maria" al grupo "desarrollo" en un dominio Samba AD?

a) `samba-tool group add desarrollo pedro maria`
b) `samba-tool group addmembers desarrollo pedro,maria`
c) `samba-tool user addgroup pedro,maria desarrollo`
d) `net ads group addmembers desarrollo pedro maria`

<details><summary>Respuesta</summary>

**b) `samba-tool group addmembers desarrollo pedro,maria`**

`samba-tool group addmembers` añade uno o más usuarios a un grupo existente. Los nombres de los miembros se separan con comas sin espacios. Para quitar miembros se usa `samba-tool group removemembers` y para listar los miembros `samba-tool group listmembers`.
</details>

### Pregunta 6
¿Qué extensión del esquema AD permite almacenar atributos POSIX como uidNumber y loginShell?

a) LDAP Extensions for DIT Content Rules
b) RFC2307
c) POSIX-AD Schema
d) Unix ID Mapping

<details><summary>Respuesta</summary>

**b) RFC2307**

RFC2307 define un esquema LDAP que incluye atributos POSIX como `uidNumber`, `gidNumber`, `loginShell`, `unixHomeDirectory` y `gecos`. En Samba AD, se habilita con la opción `--use-rfc2307` durante el aprovisionamiento. Esto permite almacenar identidades Unix directamente en los objetos de AD.
</details>

### Pregunta 7
¿Qué comando establece que las contraseñas del dominio deben tener al menos 10 caracteres?

a) `samba-tool user passwordlength 10`
b) `samba-tool domain passwordsettings set --min-pwd-length=10`
c) `samba-tool password set --minimum=10`
d) `samba-tool domain policy --password-length=10`

<details><summary>Respuesta</summary>

**b) `samba-tool domain passwordsettings set --min-pwd-length=10`**

El subcomando `samba-tool domain passwordsettings set` permite configurar los parámetros de la política de contraseñas del dominio. `--min-pwd-length` establece la longitud mínima. Otros parámetros incluyen `--complexity`, `--history-length`, `--max-pwd-age` y `--account-lockout-threshold`.
</details>

### Pregunta 8
¿Qué comando de samba-tool se utiliza para crear una Unidad Organizativa (OU)?

a) `samba-tool ou add "OU=Ventas,DC=empresa,DC=com"`
b) `samba-tool ou create "OU=Ventas,DC=empresa,DC=com"`
c) `samba-tool container create "OU=Ventas,DC=empresa,DC=com"`
d) `samba-tool domain ou new Ventas`

<details><summary>Respuesta</summary>

**b) `samba-tool ou create "OU=Ventas,DC=empresa,DC=com"`**

`samba-tool ou create` crea una nueva Unidad Organizativa especificando su Distinguished Name (DN) completo. Las OUs permiten organizar objetos jerárquicamente y aplicar GPOs de forma selectiva. Se pueden crear OUs anidadas y mover usuarios entre ellas con `samba-tool user move`.
</details>

### Pregunta 9
¿Qué diferencia hay entre el backend idmap `ad` y el backend `rid`?

a) `ad` es más rápido; `rid` es más seguro
b) `ad` lee UIDs/GIDs de atributos RFC2307 en AD; `rid` los calcula algorítmicamente
c) `ad` es para dominios NT4; `rid` para AD
d) No hay diferencia funcional

<details><summary>Respuesta</summary>

**b) `ad` lee UIDs/GIDs de atributos RFC2307 en AD; `rid` los calcula algorítmicamente**

El backend `ad` consulta los atributos `uidNumber` y `gidNumber` almacenados en los objetos de Active Directory (requiere RFC2307). El backend `rid` calcula los UIDs/GIDs algorítmicamente a partir del RID del SID, sin necesitar datos adicionales en AD. `ad` permite control manual de los IDs, mientras que `rid` es automático y predecible.
</details>

### Pregunta 10
¿Por qué la edición completa de GPOs generalmente requiere RSAT desde Windows en un entorno Samba AD?

a) Porque samba-tool no puede crear GPOs
b) Porque las GPOs usan un formato binario que solo Windows puede editar
c) Porque samba-tool tiene soporte limitado para editar el contenido detallado de las GPOs
d) Porque Linux no soporta políticas de grupo

<details><summary>Respuesta</summary>

**c) Porque samba-tool tiene soporte limitado para editar el contenido detallado de las GPOs**

Aunque `samba-tool gpo` puede crear, listar, vincular y desvincular GPOs, la edición detallada de las configuraciones dentro de una GPO (registro, scripts, configuración de seguridad, etc.) requiere el editor de políticas de grupo (GPMC) disponible en las herramientas RSAT de Windows. Samba implementa la infraestructura de GPO pero no todas las herramientas de edición.
</details>
