---
title: "304.2 - Ejercicios: Clientes CIFS Linux"
description: "Ejercicios de práctica para clientes CIFS en Linux"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 304 - Configuración de Clientes Samba"
subtema: "304.2"
peso: 3
tags:
  - lpic-3
  - tema-304
  - samba
  - cifs
  - ejercicios
---

# 304.2 Ejercicios - Clientes CIFS Linux

### Pregunta 1
¿Cuál es la forma más segura de proporcionar credenciales al montar un share CIFS?

a) `mount -t cifs //srv/share /mnt -o username=user,password=pass`
b) `mount -t cifs //srv/share /mnt -o credentials=/etc/samba/creds`
c) Exportar las variables de entorno USER y PASSWD
d) Escribir la contraseña en /etc/fstab

<details><summary>Respuesta</summary>

**b) `mount -t cifs //srv/share /mnt -o credentials=/etc/samba/creds`**

Usar un archivo de credenciales con la opción `credentials=` es la forma más segura porque el archivo puede protegerse con permisos 0600. Las contraseñas en línea de comandos son visibles con `ps` y en /etc/fstab son legibles por cualquier usuario.
</details>

### Pregunta 2
¿Qué opción `sec=` proporciona Kerberos con cifrado de datos?

a) sec=krb5
b) sec=krb5i
c) sec=krb5p
d) sec=krb5e

<details><summary>Respuesta</summary>

**c) sec=krb5p**

`sec=krb5p` proporciona autenticación Kerberos con cifrado de datos (privacidad). `krb5` solo autentica, `krb5i` añade verificación de integridad, y `krb5p` añade cifrado completo de los datos transmitidos.
</details>

### Pregunta 3
¿Qué opción en /etc/fstab indica al sistema que espere a que la red esté disponible antes de montar un share CIFS?

a) `noauto`
b) `network`
c) `_netdev`
d) `x-systemd.requires=network`

<details><summary>Respuesta</summary>

**c) `_netdev`**

`_netdev` es la opción estándar que indica al sistema que el montaje depende de la red. Sin esta opción, el sistema podría intentar montar el share CIFS antes de que la interfaz de red esté activa, causando un fallo en el arranque.
</details>

### Pregunta 4
¿Qué formato se utiliza en el archivo de mapa de autofs para especificar un recurso CIFS?

a) `share -fstype=cifs //servidor/share`
b) `share -fstype=cifs ://servidor/share`
c) `share -fstype=smb \\servidor\share`
d) `share -fstype=cifs smb://servidor/share`

<details><summary>Respuesta</summary>

**b) `share -fstype=cifs ://servidor/share`**

En autofs, el formato para recursos CIFS incluye dos puntos antes de la ruta: `://servidor/share`. Los dos puntos separan el host de la ubicación en el formato estándar de autofs.
</details>

### Pregunta 5
¿Qué permite la opción `multiuser` en un montaje CIFS?

a) Que múltiples usuarios monten el mismo share simultáneamente
b) Que cada usuario acceda al share con sus propias credenciales
c) Que el share sea accesible desde múltiples puntos de montaje
d) Que varios servidores compartan el mismo recurso

<details><summary>Respuesta</summary>

**b) Que cada usuario acceda al share con sus propias credenciales**

Con `multiuser`, el montaje se realiza una sola vez (generalmente por root), pero cada usuario puede establecer sus propias credenciales mediante `cifscreds`. El kernel aplica los permisos individuales basándose en las credenciales de cada usuario.
</details>

### Pregunta 6
¿Qué comando de smbclient lista los recursos compartidos disponibles en un servidor?

a) `smbclient //servidor -c "ls"`
b) `smbclient -L //servidor -U usuario`
c) `smbclient --list //servidor`
d) `smbclient //servidor/share -c "shares"`

<details><summary>Respuesta</summary>

**b) `smbclient -L //servidor -U usuario`**

La opción `-L` (o `--list`) de smbclient lista todos los recursos compartidos disponibles en el servidor especificado, incluyendo shares de archivos, impresoras e IPC$.
</details>

### Pregunta 7
¿Qué herramienta se usa para monitorizar las estadísticas de I/O de montajes CIFS?

a) iostat
b) cifsstat
c) cifsiostat
d) smbstat

<details><summary>Respuesta</summary>

**c) cifsiostat**

`cifsiostat` es la herramienta específica para monitorizar estadísticas de I/O de montajes CIFS, mostrando bytes leídos/escritos, operaciones por segundo y aperturas/cierres de archivos.
</details>

### Pregunta 8
¿Cuál es el contenido correcto de un archivo de credenciales CIFS?

a) `user:password:domain`
b) `username=user\npassword=pass\ndomain=DOM`
c) `USUARIO=user PASSWORD=pass DOMAIN=DOM`
d) `credentials: user/pass@DOM`

<details><summary>Respuesta</summary>

**b) `username=user\npassword=pass\ndomain=DOM`**

El archivo de credenciales usa el formato `clave=valor` con cada campo en una línea separada: `username=`, `password=` y opcionalmente `domain=`. El archivo debe tener permisos 0600.
</details>

### Pregunta 9
¿Cómo se ejecuta un comando en modo batch con smbclient?

a) `smbclient //srv/share -U user --batch "ls"`
b) `smbclient //srv/share -U user -c "ls"`
c) `smbclient //srv/share -U user -e "ls"`
d) `smbclient //srv/share -U user < "ls"`

<details><summary>Respuesta</summary>

**b) `smbclient //srv/share -U user -c "ls"`**

La opción `-c` de smbclient ejecuta los comandos especificados en modo batch (no interactivo) y luego finaliza. Se pueden encadenar múltiples comandos separándolos con punto y coma.
</details>

### Pregunta 10
Un administrador necesita montar un share CIFS automáticamente solo cuando un usuario accede al directorio, y desmontarlo tras 5 minutos de inactividad. ¿Qué solución es la más adecuada?

a) Entrada en /etc/fstab con `auto`
b) Autofs con `--timeout=300`
c) Script cron que ejecuta mount cada minuto
d) Entrada en /etc/fstab con `noauto`

<details><summary>Respuesta</summary>

**b) Autofs con `--timeout=300`**

Autofs monta automáticamente el recurso cuando un usuario accede al directorio y lo desmonta tras el período de inactividad especificado por `--timeout` (en segundos, 300 = 5 minutos). Esto es más eficiente que un montaje permanente y más elegante que un script cron.
</details>
