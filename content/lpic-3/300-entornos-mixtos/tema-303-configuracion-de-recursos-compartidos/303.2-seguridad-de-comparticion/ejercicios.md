---
title: "303.2 - Ejercicios: Seguridad de Compartición"
description: "Ejercicios de práctica para seguridad de shares en Samba"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 303 - Configuración de Recursos Compartidos"
subtema: "303.2"
peso: 4
tags:
  - lpic-3
  - tema-303
  - samba
  - seguridad
  - ejercicios
---

# 303.2 Ejercicios - Seguridad de Compartición

### Pregunta 1
Un share tiene `writable = yes` en smb.conf, pero el directorio en el sistema de archivos tiene permisos `drwxr-xr-x root root`. ¿Qué sucede cuando un usuario no-root intenta escribir?

a) Puede escribir porque Samba lo permite
b) No puede escribir porque los permisos del sistema de archivos lo impiden
c) Samba ajusta automáticamente los permisos del sistema de archivos
d) El acceso se deniega completamente, incluyendo la lectura

<details><summary>Respuesta</summary>

**b) No puede escribir porque los permisos del sistema de archivos lo impiden**

El acceso efectivo es la intersección de los permisos de Samba y los permisos del sistema de archivos. Samba nunca puede otorgar más permisos de los que permite el sistema de archivos subyacente.
</details>

### Pregunta 2
¿Qué herramienta se utiliza para gestionar ACLs NT en recursos compartidos de Samba desde la línea de comandos?

a) setfacl
b) chmod
c) smbcacls
d) ntacl

<details><summary>Respuesta</summary>

**c) smbcacls**

`smbcacls` es la herramienta de línea de comandos para ver y gestionar ACLs NT (Windows) en recursos compartidos de Samba. `setfacl` gestiona ACLs POSIX, no ACLs NT.
</details>

### Pregunta 3
¿Qué parámetro de smb.conf hace que los usuarios solo vean los shares a los que tienen acceso?

a) browseable = no
b) access based share enum = yes
c) hide unreadable = yes
d) valid users = %U

<details><summary>Respuesta</summary>

**b) access based share enum = yes**

`access based share enum = yes` filtra la lista de shares visibles basándose en los permisos del usuario. Solo muestra los shares a los que el usuario tiene acceso. `browseable = no` oculta un share para todos los usuarios.
</details>

### Pregunta 4
¿Cuál es el formato correcto para añadir una ACL NT con `smbcacls`?

a) `smbcacls //srv/share archivo -U admin -a "DOMINIO\usuario:rwx"`
b) `smbcacls //srv/share archivo -U admin -a "ACL:DOMINIO\usuario:ALLOWED/0x0/FULL"`
c) `smbcacls //srv/share archivo -U admin --add "usuario=FULL"`
d) `smbcacls //srv/share archivo -U admin -a "NT:DOMINIO\usuario:FULL_CONTROL"`

<details><summary>Respuesta</summary>

**b) `smbcacls //srv/share archivo -U admin -a "ACL:DOMINIO\usuario:ALLOWED/0x0/FULL"`**

El formato correcto de una ACL NT en smbcacls es `ACL:quien:TIPO/FLAGS/PERMISOS`. El tipo puede ser ALLOWED o DENIED, los flags controlan la herencia (0x0 = sin herencia), y los permisos pueden ser FULL, READ, CHANGE, WRITE o una máscara hexadecimal.
</details>

### Pregunta 5
¿Qué efecto tiene `inherit permissions = yes`?

a) Los nuevos archivos heredan las ACLs NT del directorio padre
b) Los nuevos archivos heredan los permisos POSIX del directorio padre, ignorando create mask
c) Los permisos de smb.conf se heredan entre shares
d) Los permisos del share se propagan a todos los subdirectorios existentes

<details><summary>Respuesta</summary>

**b) Los nuevos archivos heredan los permisos POSIX del directorio padre, ignorando create mask**

`inherit permissions = yes` hace que los nuevos archivos y directorios hereden los permisos POSIX del directorio padre en lugar de utilizar los valores de `create mask` y `directory mask`.
</details>

### Pregunta 6
Si se configuran tanto `hosts allow` como `hosts deny` en un share, ¿cuál tiene prioridad?

a) `hosts deny` siempre tiene prioridad
b) `hosts allow` tiene prioridad sobre `hosts deny`
c) El último definido en smb.conf tiene prioridad
d) Se produce un error de configuración

<details><summary>Respuesta</summary>

**b) `hosts allow` tiene prioridad sobre `hosts deny`**

Cuando ambos están presentes, `hosts allow` se evalúa primero. Si una IP coincide con `hosts allow`, se le permite el acceso incluso si también aparece en `hosts deny`.
</details>

### Pregunta 7
¿Qué módulo VFS permite almacenar ACLs NT completas en atributos extendidos del sistema de archivos?

a) vfs objects = recycle
b) vfs objects = acl_xattr
c) vfs objects = ntacl
d) vfs objects = full_audit

<details><summary>Respuesta</summary>

**b) vfs objects = acl_xattr**

El módulo `acl_xattr` almacena las ACLs NT completas como atributos extendidos (xattrs) en el sistema de archivos Linux, preservando toda la información de permisos Windows incluyendo herencia.
</details>

### Pregunta 8
¿Qué parámetro permite mapear los flags de herencia de ACLs NT a ACLs POSIX por defecto?

a) inherit permissions
b) inherit acls
c) map acl inherit
d) nt acl support

<details><summary>Respuesta</summary>

**c) map acl inherit**

`map acl inherit = yes` traduce los flags de herencia de las ACLs NT (como "aplicar a subcarpetas y archivos") a ACLs POSIX por defecto en Linux, permitiendo que la herencia configurada desde Windows funcione correctamente.
</details>

### Pregunta 9
¿Qué comando establece una ACL POSIX por defecto para que todos los archivos nuevos en un directorio sean legibles por el grupo `contabilidad`?

a) `setfacl -m g:contabilidad:r /srv/datos`
b) `setfacl -d -m g:contabilidad:r /srv/datos`
c) `chmod g+r /srv/datos`
d) `smbcacls //srv/datos -a "ACL:contabilidad:r"`

<details><summary>Respuesta</summary>

**b) `setfacl -d -m g:contabilidad:r /srv/datos`**

La opción `-d` (o `--default`) de `setfacl` establece una ACL por defecto que se aplica automáticamente a los nuevos archivos y directorios creados dentro del directorio especificado.
</details>

### Pregunta 10
Un administrador quiere que los usuarios de Windows puedan gestionar permisos desde la pestaña "Seguridad" de las propiedades de archivo. ¿Qué combinación de parámetros es necesaria?

a) `writable = yes` y `valid users = @todos`
b) `nt acl support = yes`, `inherit acls = yes` y `map acl inherit = yes`
c) `security = user` y `guest ok = yes`
d) `acl group control = yes` solamente

<details><summary>Respuesta</summary>

**b) `nt acl support = yes`, `inherit acls = yes` y `map acl inherit = yes`**

Para la integración completa con la pestaña de seguridad de Windows se necesita: `nt acl support = yes` (activado por defecto) para habilitar el soporte de ACLs NT, `inherit acls = yes` para la herencia de ACLs y `map acl inherit = yes` para mapear la herencia NT a POSIX.
</details>
