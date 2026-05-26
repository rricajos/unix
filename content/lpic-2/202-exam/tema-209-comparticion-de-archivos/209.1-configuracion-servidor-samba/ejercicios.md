---
title: "209.1 - Configuración del servidor Samba"
tags: [lpic-2, examen-202, tema-209, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "209"
subtema: "209.1"
---

# 209.1 - Ejercicios: Configuración del servidor Samba

### Pregunta 1
¿Qué comando se utiliza para verificar la sintaxis del archivo de configuración smb.conf?

a) smbcheck
b) samba -t
c) testparm
d) smb --verify

<details>
<summary>Respuesta</summary>

**c) testparm**

El comando `testparm` analiza el archivo `/etc/samba/smb.conf` y reporta cualquier error de sintaxis o parámetros desconocidos. Con la opción `-s` muestra únicamente la configuración activa (omitiendo los valores por defecto). Es una herramienta esencial antes de reiniciar el servicio Samba.
</details>

---

### Pregunta 2
¿Cuál es el modo de seguridad predeterminado en Samba 4?

a) security = share
b) security = user
c) security = ads
d) security = server

<details>
<summary>Respuesta</summary>

**b) security = user**

El modo `security = user` es el predeterminado en Samba 4. En este modo, los clientes deben autenticarse con un nombre de usuario y contraseña que existan en la base de datos de usuarios de Samba. El modo `share` fue eliminado en Samba 4 y `server` está obsoleto.
</details>

---

### Pregunta 3
Un administrador necesita añadir el usuario "jperez" (que ya existe como usuario Unix) a la base de datos de Samba. ¿Qué comando debe utilizar?

a) smbpasswd -c jperez
b) pdbedit -c jperez
c) smbpasswd -a jperez
d) useradd -smb jperez

<details>
<summary>Respuesta</summary>

**c) smbpasswd -a jperez**

El comando `smbpasswd -a` añade un usuario a la base de datos de Samba. Es requisito previo que el usuario exista como usuario Unix en el sistema. La opción `-a` (add) indica que se está añadiendo un nuevo usuario, no modificando uno existente. También se podría usar `pdbedit -a jperez`.
</details>

---

### Pregunta 4
¿Qué demonio de Samba es responsable del servicio de nombres NetBIOS?

a) smbd
b) nmbd
c) winbindd
d) netbiosd

<details>
<summary>Respuesta</summary>

**b) nmbd**

El demonio `nmbd` proporciona servicios de nombres NetBIOS y navegación de red. Escucha en los puertos UDP 137 y 138. El demonio `smbd` gestiona las conexiones de compartición de archivos e impresoras (puertos TCP 139 y 445), y `winbindd` se encarga de la integración con Active Directory.
</details>

---

### Pregunta 5
¿Qué directiva en smb.conf permite que los archivos creados en un recurso compartido tengan permisos específicos?

a) file permissions
b) new file mode
c) create mask
d) umask

<details>
<summary>Respuesta</summary>

**c) create mask**

La directiva `create mask` (también conocida como `create mode`) define los permisos máximos que se asignan a los archivos nuevos creados en el recurso compartido. Por ejemplo, `create mask = 0664` permite lectura y escritura para el propietario y el grupo, y solo lectura para otros. Para directorios se usa `directory mask`.
</details>

---

### Pregunta 6
¿Qué comando muestra las conexiones activas al servidor Samba, incluyendo los recursos compartidos en uso y los archivos abiertos?

a) smbclient -status
b) net status
c) smbstatus
d) samba --connections

<details>
<summary>Respuesta</summary>

**c) smbstatus**

El comando `smbstatus` muestra información sobre las conexiones activas al servidor Samba: procesos de conexión, recursos compartidos en uso y archivos bloqueados. Con la opción `-S` muestra solo los recursos, con `-p` solo los procesos y con `-L` solo los bloqueos de archivos.
</details>

---

### Pregunta 7
¿Qué sección especial de smb.conf crea automáticamente un recurso compartido para el directorio home de cada usuario que se conecta?

a) [users]
b) [home]
c) [homes]
d) [personal]

<details>
<summary>Respuesta</summary>

**c) [homes]**

La sección `[homes]` es una sección especial de Samba que crea dinámicamente un recurso compartido para cada usuario que se conecta, mapeándolo a su directorio home en el sistema. Cuando un usuario solicita un recurso con su nombre de usuario, Samba lo busca primero como recurso explícito y, si no existe, lo crea automáticamente desde `[homes]`.
</details>

---

### Pregunta 8
¿Cuál es el comando correcto para unir un servidor Samba a un dominio Active Directory?

a) net join ads -U administrador
b) net ads join -U administrador
c) samba-tool domain join -U administrador
d) realm join -U administrador

<details>
<summary>Respuesta</summary>

**b) net ads join -U administrador**

El comando `net ads join -U administrador` une el servidor Samba a un dominio Active Directory. Requiere que la sección `[global]` de smb.conf tenga `security = ads` y `realm = DOMINIO.COM` correctamente configurados. Después de la unión, se puede verificar con `net ads testjoin`.
</details>

---

### Pregunta 9
¿Qué comando se utiliza para listar los recursos compartidos de un servidor SMB remoto?

a) smbclient -L //servidor -U usuario
b) nmblookup -S servidor
c) smbstatus -L //servidor
d) net share list //servidor

<details>
<summary>Respuesta</summary>

**a) smbclient -L //servidor -U usuario**

El comando `smbclient -L` (list) muestra los recursos compartidos disponibles en un servidor remoto. Se debe especificar el servidor con la notación `//nombre_servidor` y opcionalmente el usuario con `-U`. También muestra información sobre los grupos de trabajo y servidores maestros de la red.
</details>

---

### Pregunta 10
Un administrador quiere montar permanentemente un recurso compartido CIFS usando un archivo de credenciales. ¿Cuál es la entrada correcta en /etc/fstab?

a) `//servidor/recurso /mnt/samba smbfs credentials=/root/.smbcred 0 0`
b) `//servidor/recurso /mnt/samba cifs credentials=/root/.smbcredentials 0 0`
c) `\\servidor\recurso /mnt/samba cifs user=/root/.smbcredentials 0 0`
d) `smb://servidor/recurso /mnt/samba auto credentials=/root/.smbcredentials 0 0`

<details>
<summary>Respuesta</summary>

**b) `//servidor/recurso /mnt/samba cifs credentials=/root/.smbcredentials 0 0`**

En `/etc/fstab`, los recursos CIFS se especifican con la notación de barra inclinada `//servidor/recurso`, el tipo de sistema de archivos es `cifs` (no `smbfs` que está obsoleto), y se usa la opción `credentials` para indicar el archivo con las credenciales de acceso. El archivo de credenciales contiene `username=`, `password=` y opcionalmente `domain=`.
</details>

---
