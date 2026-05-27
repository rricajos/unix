---
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.4"
titulo: "Membresía de Dominio - Ejercicios"
peso: 4
tags:
  - lpic-3
  - tema-302
  - ejercicios
---

# Ejercicios - 302.4 Membresía de Dominio

### Pregunta 1
¿Qué comando se utiliza para unir un servidor Linux a un dominio Active Directory mediante Samba?

a) `samba-tool domain join`
b) `net ads join -U administrator`
c) `realm connect empresa.com`
d) `net rpc join -U administrator`

<details><summary>Respuesta</summary>

**b) `net ads join -U administrator`**

`net ads join` es el comando de Samba para unir un servidor Linux como miembro de un dominio AD. Requiere credenciales de administrador del dominio y que Kerberos esté configurado correctamente. `samba-tool domain join` se usa para unir un DC (no un servidor miembro). `net rpc join` es para dominios NT4.
</details>

### Pregunta 2
¿Qué archivo debe configurarse para que el sistema Linux resuelva usuarios y grupos del dominio AD a través de winbind?

a) `/etc/samba/smb.conf`
b) `/etc/pam.d/common-auth`
c) `/etc/nsswitch.conf`
d) `/etc/krb5.conf`

<details><summary>Respuesta</summary>

**c) `/etc/nsswitch.conf`**

El archivo `/etc/nsswitch.conf` controla el orden en que el sistema consulta las fuentes de información de nombres. Para winbind, debe incluir `winbind` en las líneas passwd y group: `passwd: files winbind` y `group: files winbind`. Sin esta configuración, `getent passwd` no mostrará los usuarios del dominio.
</details>

### Pregunta 3
¿Qué diferencia principal tiene SSSD frente a winbind para la integración con Active Directory?

a) SSSD no soporta Kerberos
b) SSSD no puede integrarse con AD
c) Winbind es necesario cuando el servidor también comparte archivos vía SMB
d) Winbind no soporta caché de credenciales

<details><summary>Respuesta</summary>

**c) Winbind es necesario cuando el servidor también comparte archivos vía SMB**

Winbind está integrado con Samba y es necesario cuando el servidor Linux, además de autenticar usuarios AD, también comparte archivos mediante el protocolo SMB. SSSD es preferido para estaciones de trabajo y servidores que solo necesitan autenticación AD, ya que ofrece un mejor manejo de caché offline y configuración más sencilla con realmd.
</details>

### Pregunta 4
¿Qué comandos de Kerberos se utilizan para obtener, listar y destruir tickets?

a) `kget`, `kls`, `krm`
b) `kinit`, `klist`, `kdestroy`
c) `kticket get`, `kticket list`, `kticket del`
d) `krb5-init`, `krb5-list`, `krb5-destroy`

<details><summary>Respuesta</summary>

**b) `kinit`, `klist`, `kdestroy`**

`kinit` obtiene un TGT (Ticket Granting Ticket) del KDC Kerberos, `klist` muestra los tickets almacenados en la caché de credenciales y `kdestroy` elimina todos los tickets de la caché. Estos son los tres comandos fundamentales para trabajar con tickets Kerberos. El realm se especifica en MAYÚSCULAS: `kinit usuario@EMPRESA.COM`.
</details>

### Pregunta 5
¿Qué parámetro de smb.conf permite que los usuarios de dominio inicien sesión sin necesidad de prefijar el nombre del dominio?

a) `winbind enum users = yes`
b) `winbind use default domain = yes`
c) `security = ads`
d) `template shell = /bin/bash`

<details><summary>Respuesta</summary>

**b) `winbind use default domain = yes`**

Cuando `winbind use default domain = yes`, los usuarios pueden iniciar sesión con solo su nombre (ej: "pedro") en lugar de "EMPRESA\pedro" o "pedro@empresa.com". Winbind asume automáticamente el dominio predeterminado configurado en `workgroup`. Esto simplifica el uso pero puede causar conflictos si hay usuarios locales con el mismo nombre.
</details>

### Pregunta 6
¿Qué backend idmap es más apropiado para un entorno multidominio donde se desea asignación automática de rangos?

a) rid
b) ad
c) tdb
d) autorid

<details><summary>Respuesta</summary>

**d) autorid**

El backend `autorid` asigna automáticamente rangos de UIDs/GIDs a cada dominio que se descubre, sin necesidad de configuración por dominio. Es ideal para entornos multidominio con confianzas porque simplifica enormemente la configuración. Cada dominio recibe un bloque de IDs del rango total configurado. Sin embargo, los IDs pueden variar entre servidores.
</details>

### Pregunta 7
¿Qué módulo PAM se utiliza para crear automáticamente el directorio home de un usuario de dominio al iniciar sesión por primera vez?

a) `pam_winbind.so`
b) `pam_unix.so`
c) `pam_mkhomedir.so`
d) `pam_ldap.so`

<details><summary>Respuesta</summary>

**c) `pam_mkhomedir.so`**

El módulo `pam_mkhomedir.so` se configura en la sección de sesión de PAM (`/etc/pam.d/common-session`) y crea automáticamente el directorio home del usuario basándose en `/etc/skel` cuando el usuario inicia sesión por primera vez. Ejemplo: `session required pam_mkhomedir.so skel=/etc/skel umask=0077`.
</details>

### Pregunta 8
¿Qué comando alternativo a `net ads join` configura automáticamente SSSD, Kerberos, PAM y NSS al unirse a un dominio?

a) `sssd join`
b) `realm join empresa.com`
c) `adcli join empresa.com`
d) `samba-tool domain join`

<details><summary>Respuesta</summary>

**b) `realm join empresa.com`**

`realm join` (proporcionado por realmd) es una herramienta que automatiza el proceso completo de unión a un dominio: configura Kerberos (`/etc/krb5.conf`), SSSD (`/etc/sssd/sssd.conf`), PAM y NSS. Es más simple que `net ads join` que requiere configuración manual de cada componente. `adcli` es una herramienta complementaria que realm puede usar internamente.
</details>

### Pregunta 9
En la configuración idmap, ¿qué representa el backend con asterisco (`idmap config * : backend`)?

a) La configuración para todos los dominios
b) La configuración comodín para dominios no configurados explícitamente
c) Una configuración inválida
d) La configuración para el dominio local

<details><summary>Respuesta</summary>

**b) La configuración comodín para dominios no configurados explícitamente**

El asterisco (`*`) en la configuración idmap actúa como comodín y se aplica a cualquier dominio que no tenga una configuración específica. Es obligatorio definir al menos el backend y rango para `*`. Típicamente se usa `tdb` como backend comodín. Los dominios específicos se configuran por nombre: `idmap config EMPRESA : backend = rid`.
</details>

### Pregunta 10
Un administrador ejecuta `kinit pedro@EMPRESA.COM` pero recibe un error de preautenticación. ¿Cuál es la causa más probable?

a) El servidor DNS no funciona
b) La contraseña es incorrecta o la diferencia de tiempo con el DC excede 5 minutos
c) Winbind no está configurado
d) El archivo smb.conf tiene errores de sintaxis

<details><summary>Respuesta</summary>

**b) La contraseña es incorrecta o la diferencia de tiempo con el DC excede 5 minutos**

Los errores de preautenticación Kerberos se producen generalmente por contraseña incorrecta o por un desfase de tiempo (clock skew) superior a 5 minutos entre el cliente y el KDC. Se debe verificar la sincronización NTP con `ntpdate -q dc.empresa.com` o `timedatectl`. También puede deberse a una cuenta bloqueada o deshabilitada.
</details>
