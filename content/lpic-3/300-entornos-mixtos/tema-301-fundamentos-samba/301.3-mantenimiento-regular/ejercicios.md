---
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.3"
titulo: "Mantenimiento Regular - Ejercicios"
peso: 2
tags:
  - lpic-3
  - tema-301
  - ejercicios
---

# Ejercicios - 301.3 Mantenimiento Regular

### Pregunta 1
¿Qué comando muestra las conexiones activas y los archivos bloqueados en un servidor Samba?

a) smbclient -L
b) smbstatus
c) net status
d) testparm

<details><summary>Respuesta</summary>

**b) smbstatus**

`smbstatus` es la herramienta principal para monitorizar el estado de un servidor Samba en tiempo real. Muestra las conexiones activas, los recursos compartidos en uso y los archivos con bloqueos (oplocks). Se puede usar con `-b` para un resumen breve o `-S` para ver solo los recursos compartidos.
</details>

### Pregunta 2
¿Qué herramienta se utiliza para crear copias de seguridad de bases de datos TDB de Samba?

a) tdbdump
b) tdbtool
c) tdbbackup
d) tdbcopy

<details><summary>Respuesta</summary>

**c) tdbbackup**

`tdbbackup` crea copias de seguridad de bases de datos TDB y también puede verificar su integridad con la opción `-v`. Si detecta corrupción, puede restaurar desde la última copia válida. `tdbdump` solo muestra el contenido y `tdbtool` es una herramienta interactiva de gestión.
</details>

### Pregunta 3
¿Qué comando de `rpcclient` se utiliza para listar los usuarios de un dominio?

a) srvinfo
b) netshareenum
c) enumdomusers
d) queryuser

<details><summary>Respuesta</summary>

**c) enumdomusers**

El comando `enumdomusers` dentro de `rpcclient` enumera todos los usuarios del dominio con sus RIDs (Relative IDs). `srvinfo` muestra información del servidor, `netshareenum` lista recursos compartidos y `queryuser` muestra detalles de un usuario específico por su RID.
</details>

### Pregunta 4
¿Cuál es la forma correcta de listar los recursos compartidos de un servidor remoto con smbclient?

a) `smbclient --list servidor`
b) `smbclient -L //servidor -U usuario`
c) `smbclient -s //servidor`
d) `smbclient -e //servidor -U usuario`

<details><summary>Respuesta</summary>

**b) `smbclient -L //servidor -U usuario`**

La opción `-L` (list) seguida de la dirección del servidor muestra los recursos compartidos disponibles. `-U` especifica el usuario para autenticación. Para listar sin autenticación (sesión anónima), se usa `-N` en lugar de `-U`.
</details>

### Pregunta 5
¿Qué subcomando de `net` se utiliza para unirse a un dominio Active Directory?

a) `net rpc join`
b) `net ads join`
c) `net domain join`
d) `net ad connect`

<details><summary>Respuesta</summary>

**b) `net ads join`**

`net ads join -U admin` une el servidor Samba a un dominio Active Directory. `net rpc join` se usa para dominios NT4. Después de unirse, se puede verificar la membresía con `net ads testjoin`. El comando `net ads` requiere que Samba esté compilado con soporte para Active Directory.
</details>

### Pregunta 6
¿Qué base de datos TDB almacena los secretos de la máquina y la contraseña del dominio?

a) passdb.tdb
b) registry.tdb
c) secrets.tdb
d) locking.tdb

<details><summary>Respuesta</summary>

**c) secrets.tdb**

`secrets.tdb` almacena información crítica como la contraseña de la cuenta de máquina en el dominio, secretos LDAP y otras credenciales de seguridad. Se encuentra en `/var/lib/samba/private/`. `passdb.tdb` almacena las cuentas de usuario Samba y `registry.tdb` contiene el registro de Samba.
</details>

### Pregunta 7
¿Cómo se puede recargar la configuración de Samba sin reiniciar los servicios?

a) `systemctl reload samba`
b) `smbcontrol all reload-config`
c) `testparm --reload`
d) `kill -HUP $(pidof smbd)`

<details><summary>Respuesta</summary>

**b) `smbcontrol all reload-config`**

`smbcontrol all reload-config` envía una señal a todos los procesos de Samba para que relean la configuración de smb.conf. Esto es más seguro que reiniciar los servicios, ya que no interrumpe las conexiones activas. `smbcontrol` también puede enviar otros mensajes a los demonios de Samba.
</details>

### Pregunta 8
¿Qué comando de `nmblookup` muestra la tabla completa de nombres NetBIOS de un host remoto?

a) `nmblookup -S host`
b) `nmblookup -A 192.168.1.10`
c) `nmblookup -M host`
d) `nmblookup -R host`

<details><summary>Respuesta</summary>

**b) `nmblookup -A 192.168.1.10`**

La opción `-A` (node status) de `nmblookup` consulta la tabla de nombres NetBIOS de un host remoto identificado por su dirección IP. Muestra todos los nombres y tipos de servicio registrados en ese host. `-M` busca el Master Browser, `-S` muestra servicios y `-R` consulta vía WINS.
</details>

### Pregunta 9
¿Cuál es la función de `tdbtool` en el mantenimiento de Samba?

a) Solo crear copias de seguridad de bases TDB
b) Volcar el contenido completo de una base TDB
c) Herramienta interactiva para inspeccionar y manipular bases TDB
d) Convertir bases TDB entre versiones de Samba

<details><summary>Respuesta</summary>

**c) Herramienta interactiva para inspeccionar y manipular bases TDB**

`tdbtool` es una herramienta interactiva que permite inspeccionar, consultar, modificar y eliminar entradas en bases de datos TDB. Incluye comandos como `info`, `keys`, `show`, `delete`, `dump` y `check`. A diferencia de `tdbdump` (solo lectura) y `tdbbackup` (solo backup), `tdbtool` permite operaciones de lectura y escritura.
</details>

### Pregunta 10
Un administrador necesita verificar que un servidor Samba está correctamente unido a un dominio AD. ¿Qué comando debe usar?

a) `smbstatus -d`
b) `net ads testjoin`
c) `testparm --domain`
d) `wbinfo -p`

<details><summary>Respuesta</summary>

**b) `net ads testjoin`**

`net ads testjoin` verifica que la cuenta de la máquina es válida en el dominio Active Directory y que la unión al dominio está funcionando correctamente. Si la prueba falla, puede ser necesario volver a unirse con `net ads join`. `wbinfo -p` solo verifica la comunicación con winbindd, no la membresía del dominio.
</details>
