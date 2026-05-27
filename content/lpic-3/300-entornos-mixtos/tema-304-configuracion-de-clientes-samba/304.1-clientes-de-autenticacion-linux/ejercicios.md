---
title: "304.1 - Ejercicios: Clientes de Autenticación Linux"
description: "Ejercicios de práctica para autenticación Linux contra AD"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 304 - Configuración de Clientes Samba"
subtema: "304.1"
peso: 5
tags:
  - lpic-3
  - tema-304
  - samba
  - pam
  - sssd
  - ejercicios
---

# 304.1 Ejercicios - Clientes de Autenticación Linux

### Pregunta 1
¿Qué entrada en `/etc/nsswitch.conf` configura la resolución de usuarios a través de SSSD?

a) `passwd: files ldap`
b) `passwd: files sss`
c) `passwd: files sssd`
d) `passwd: sss files`

<details><summary>Respuesta</summary>

**b) `passwd: files sss`**

El módulo NSS de SSSD se llama `sss` (no `sssd`). El orden `files sss` asegura que los usuarios locales se resuelven primero (/etc/passwd), y luego se consulta SSSD para usuarios del dominio.
</details>

### Pregunta 2
¿Qué parámetro de sssd.conf genera automáticamente UIDs y GIDs a partir del SID de Windows sin necesidad de extensiones POSIX en AD?

a) `auto_id_mapping = true`
b) `ldap_id_mapping = true`
c) `id_provider = posix`
d) `sid_mapping = auto`

<details><summary>Respuesta</summary>

**b) `ldap_id_mapping = true`**

`ldap_id_mapping = true` hace que SSSD genere automáticamente UIDs y GIDs basándose en el SID de Windows mediante un algoritmo determinista. Esto elimina la necesidad de configurar atributos POSIX (uidNumber, gidNumber) en Active Directory.
</details>

### Pregunta 3
¿Qué módulo PAM crea automáticamente el directorio home del usuario en su primer inicio de sesión?

a) pam_unix.so
b) pam_sss.so
c) pam_mkhomedir.so
d) pam_homedir.so

<details><summary>Respuesta</summary>

**c) pam_mkhomedir.so**

`pam_mkhomedir.so` se configura en la pila de sesión PAM y crea automáticamente el directorio home del usuario la primera vez que inicia sesión, usando `/etc/skel` como plantilla.
</details>

### Pregunta 4
¿Cuál es el formato correcto del realm Kerberos en `/etc/krb5.conf`?

a) empresa.local (minúsculas)
b) EMPRESA.LOCAL (mayúsculas)
c) Empresa.Local (capitalizado)
d) empresa.LOCAL (mixto)

<details><summary>Respuesta</summary>

**b) EMPRESA.LOCAL (mayúsculas)**

Por convención, el realm Kerberos siempre se escribe en MAYÚSCULAS en `/etc/krb5.conf`. El dominio DNS correspondiente se escribe en minúsculas, pero el realm siempre es mayúsculas.
</details>

### Pregunta 5
¿Qué comando se usa para unir una máquina Linux a un dominio AD utilizando SSSD/realmd?

a) `net ads join -U admin`
b) `realm join dominio -U admin`
c) `sssd join dominio`
d) `adcli connect dominio`

<details><summary>Respuesta</summary>

**b) `realm join dominio -U admin`**

`realm join` es el comando recomendado para unir sistemas Linux a dominios AD cuando se usa SSSD. Automáticamente configura sssd.conf, krb5.conf y los archivos PAM/NSS necesarios. `net ads join` se usa con Winbind.
</details>

### Pregunta 6
¿Qué parámetro de Winbind en smb.conf permite que los usuarios inicien sesión como `usuario` en lugar de `DOMINIO\usuario`?

a) `winbind separator = \`
b) `winbind use default domain = yes`
c) `winbind domain prefix = no`
d) `winbind short names = yes`

<details><summary>Respuesta</summary>

**b) `winbind use default domain = yes`**

`winbind use default domain = yes` permite omitir el prefijo de dominio al iniciar sesión. Los usuarios pueden autenticarse simplemente como `usuario` sin necesidad de escribir `DOMINIO\usuario` o `usuario@dominio`.
</details>

### Pregunta 7
¿Qué comando limpia toda la caché de SSSD?

a) `sssd --clear-cache`
b) `sss_cache -E`
c) `realm cache --clear`
d) `systemctl restart sssd --clear`

<details><summary>Respuesta</summary>

**b) `sss_cache -E`**

`sss_cache -E` invalida todas las entradas de la caché de SSSD (usuarios, grupos, servicios). También se puede usar `sss_cache -u usuario` para limpiar la caché de un usuario específico.
</details>

### Pregunta 8
¿Qué diferencia principal tiene `oddjob-mkhomedir` respecto a `pam_mkhomedir`?

a) oddjob es más rápido
b) oddjob funciona mejor con SELinux al ejecutar como servicio privilegiado
c) oddjob soporta más distribuciones Linux
d) oddjob crea homes con permisos más restrictivos

<details><summary>Respuesta</summary>

**b) oddjob funciona mejor con SELinux al ejecutar como servicio privilegiado**

`oddjob-mkhomedir` ejecuta la creación del directorio home a través del servicio oddjobd, que tiene los contextos SELinux apropiados. `pam_mkhomedir` crea el directorio en el contexto del proceso de login, lo que puede causar problemas con SELinux.
</details>

### Pregunta 9
¿Cuál de los siguientes es el archivo de configuración principal de SSSD y qué permisos requiere?

a) `/etc/sssd.conf` con permisos 0644
b) `/etc/sssd/sssd.conf` con permisos 0600
c) `/etc/sss/sssd.conf` con permisos 0640
d) `/etc/sssd/sssd.conf` con permisos 0644

<details><summary>Respuesta</summary>

**b) `/etc/sssd/sssd.conf` con permisos 0600**

El archivo de configuración de SSSD está en `/etc/sssd/sssd.conf` y debe tener permisos 0600 (lectura/escritura solo para root). SSSD se negará a iniciar si los permisos son más permisivos, por seguridad.
</details>

### Pregunta 10
Un administrador quiere que solo los miembros del grupo AD `LinuxUsers` puedan iniciar sesión en un servidor Linux con SSSD. ¿Qué parámetro de sssd.conf debe configurar?

a) `valid_users = @LinuxUsers`
b) `access_provider = ad` con `ad_access_filter`
c) `login_filter = LinuxUsers`
d) `allowed_groups = LinuxUsers`

<details><summary>Respuesta</summary>

**b) `access_provider = ad` con `ad_access_filter`**

Con `access_provider = ad`, SSSD utiliza las políticas de acceso de AD. Se puede combinar con `ad_access_filter = memberOf=CN=LinuxUsers,OU=Groups,DC=empresa,DC=local` para restringir el acceso solo a miembros de un grupo AD específico.
</details>
