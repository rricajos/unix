---
title: "305.4 - Ejercicios: NFS"
description: "Ejercicios de práctica para NFSv4 con Kerberos e integración FreeIPA"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 305 - Identidad y Compartición"
subtema: "305.4"
peso: 3
tags:
  - lpic-3
  - tema-305
  - nfs
  - kerberos
  - ejercicios
---

# 305.4 Ejercicios - NFS

### Pregunta 1
¿Qué nivel de seguridad NFSv4 proporciona autenticación Kerberos con cifrado completo de datos?

a) sec=krb5
b) sec=krb5i
c) sec=krb5p
d) sec=krb5e

<details><summary>Respuesta</summary>

**c) sec=krb5p**

`sec=krb5p` proporciona el nivel más alto de seguridad: autenticación Kerberos, verificación de integridad y cifrado completo (privacidad) de todos los datos transmitidos. La "p" significa "privacy" (privacidad).
</details>

### Pregunta 2
En `/etc/exports`, ¿cómo se especifica que una exportación acepta tanto `krb5` como `krb5i`?

a) `sec=krb5,krb5i`
b) `sec=krb5:krb5i`
c) `sec=krb5+krb5i`
d) `sec=krb5|krb5i`

<details><summary>Respuesta</summary>

**b) `sec=krb5:krb5i`**

En `/etc/exports`, los múltiples mecanismos de seguridad se separan con dos puntos (`:`). Por ejemplo, `sec=krb5:krb5i:krb5p` acepta cualquiera de los tres niveles de seguridad Kerberos.
</details>

### Pregunta 3
¿Qué servicio moderno gestiona las credenciales GSS-API (Kerberos) para NFS?

a) rpc.gssd
b) rpc.svcgssd
c) gssproxy
d) krb5kdc

<details><summary>Respuesta</summary>

**c) gssproxy**

`gssproxy` es el servicio moderno que reemplaza a `rpc.gssd` (cliente) y `rpc.svcgssd` (servidor) para la gestión de credenciales GSS-API en NFS con Kerberos. Proporciona una gestión más segura y eficiente de las credenciales.
</details>

### Pregunta 4
¿Qué sucede si el parámetro `Domain` en `/etc/idmapd.conf` no coincide entre el servidor y el cliente NFSv4?

a) La conexión NFS falla completamente
b) Todos los archivos aparecen como propiedad de nobody:nobody
c) Los archivos se montan como solo lectura
d) El rendimiento se degrada significativamente

<details><summary>Respuesta</summary>

**b) Todos los archivos aparecen como propiedad de nobody:nobody**

Si el `Domain` de idmapd no coincide entre servidor y cliente, el mapeo de identidades falla y todos los archivos se muestran con propietario y grupo `nobody:nobody`, ya que el sistema no puede traducir los nombres de usuario correctamente.
</details>

### Pregunta 5
¿Qué principal Kerberos necesita el servidor NFS en su keytab?

a) `host/nfsserver@REALM`
b) `nfs/nfsserver.dominio@REALM`
c) `krbtgt/REALM@REALM`
d) `HTTP/nfsserver@REALM`

<details><summary>Respuesta</summary>

**b) `nfs/nfsserver.dominio@REALM`**

El servidor NFS necesita un keytab con el principal `nfs/FQDN@REALM`. Este principal se crea en FreeIPA con `ipa service-add nfs/nfsserver.dominio` y el keytab se obtiene con `ipa-getkeytab`.
</details>

### Pregunta 6
¿Cómo se almacenan los mapas de automount centralizadamente en FreeIPA?

a) En archivos /etc/auto.* sincronizados por rsync
b) En el directorio LDAP de FreeIPA, accesibles vía SSSD
c) En una base de datos SQL de FreeIPA
d) En el share SYSVOL de FreeIPA

<details><summary>Respuesta</summary>

**b) En el directorio LDAP de FreeIPA, accesibles vía SSSD**

FreeIPA almacena los mapas de automount en su directorio LDAP (389 DS). Los clientes acceden a estos mapas a través de SSSD configurando `automount: sss` en `/etc/nsswitch.conf`.
</details>

### Pregunta 7
¿Qué comando de FreeIPA se usa para crear un servicio NFS antes de obtener su keytab?

a) `ipa nfs-add nfsserver.empresa.local`
b) `ipa service-add nfs/nfsserver.empresa.local`
c) `ipa host-add-service nfsserver nfs`
d) `ipa-getkeytab -p nfs/nfsserver`

<details><summary>Respuesta</summary>

**b) `ipa service-add nfs/nfsserver.empresa.local`**

`ipa service-add` registra un servicio Kerberos en FreeIPA. El formato del principal es `servicio/FQDN`. Después de crear el servicio, se obtiene el keytab con `ipa-getkeytab`.
</details>

### Pregunta 8
¿Qué diferencia hay entre `sec=sys` y `sec=krb5` en NFSv4?

a) No hay diferencia, son equivalentes
b) `sys` usa UID/GID sin verificar identidad; `krb5` autentica mediante Kerberos
c) `sys` es más seguro porque verifica el sistema operativo
d) `krb5` solo funciona con NFSv3

<details><summary>Respuesta</summary>

**b) `sys` usa UID/GID sin verificar identidad; `krb5` autentica mediante Kerberos**

`sec=sys` confía en el UID/GID que envía el cliente sin verificación (susceptible a suplantación si un usuario tiene el mismo UID en otra máquina). `sec=krb5` usa Kerberos para verificar criptográficamente la identidad del usuario.
</details>

### Pregunta 9
¿Qué comando limpia la caché de mapeo de identidades de NFSv4?

a) `nfsidmap -c`
b) `idmap --clear`
c) `nfs-cache clear`
d) `exportfs -c`

<details><summary>Respuesta</summary>

**a) `nfsidmap -c`**

`nfsidmap -c` limpia la caché de mapeo de identidades del kernel NFSv4. Esto es útil cuando se han realizado cambios en `/etc/idmapd.conf` o en la configuración de NSS y se necesita que los nuevos mapeos surtan efecto.
</details>

### Pregunta 10
Un administrador quiere configurar automount centralizado en FreeIPA para que los clientes monten `/nfs/datos` desde `nfsserver.empresa.local:/export/datos` con Kerberos. ¿Cuál es la secuencia correcta de comandos?

a) Solo crear el archivo `/etc/auto.nfs` en cada cliente
b) `ipa automountmap-add`, luego `ipa automountkey-add` para auto.master y para el mapa
c) `ipa nfs-export-add` seguido de `ipa automount-enable`
d) Configurar SSSD con `nfs_provider = ipa`

<details><summary>Respuesta</summary>

**b) `ipa automountmap-add`, luego `ipa automountkey-add` para auto.master y para el mapa**

La secuencia correcta es: 1) `ipa automountmap-add default auto.nfs` para crear el mapa, 2) `ipa automountkey-add default auto.master --key=/nfs --info=auto.nfs` para añadir la entrada en auto.master, 3) `ipa automountkey-add default auto.nfs --key=datos --info="-fstype=nfs4,sec=krb5 nfsserver.empresa.local:/export/datos"` para definir el punto de montaje.
</details>
