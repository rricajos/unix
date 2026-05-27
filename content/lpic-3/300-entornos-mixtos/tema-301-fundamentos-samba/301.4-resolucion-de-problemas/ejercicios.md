---
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.4"
titulo: "Resolución de Problemas - Ejercicios"
peso: 3
tags:
  - lpic-3
  - tema-301
  - ejercicios
---

# Ejercicios - 301.4 Resolución de Problemas

### Pregunta 1
¿Qué comando permite cambiar el nivel de log de smbd en caliente sin reiniciar el servicio?

a) `smbcontrol smbd debug 3`
b) `testparm --debug 3`
c) `smbstatus -d 3`
d) `smbd --log-level 3`

<details><summary>Respuesta</summary>

**a) `smbcontrol smbd debug 3`**

`smbcontrol` permite enviar mensajes de control a los demonios de Samba en ejecución. Con `smbcontrol smbd debug 3` se cambia el nivel de log del demonio smbd al nivel 3 sin necesidad de reiniciar. Para cambiar todos los demonios simultáneamente se usa `smbcontrol all debug 3`.
</details>

### Pregunta 2
¿Cuál es el orden predeterminado de resolución de nombres en Samba (parámetro `name resolve order`)?

a) host wins bcast lmhosts
b) lmhosts wins host bcast
c) dns wins netbios bcast
d) wins host lmhosts bcast

<details><summary>Respuesta</summary>

**b) lmhosts wins host bcast**

El orden predeterminado es: primero el archivo lmhosts local, luego el servidor WINS, después la resolución DNS del sistema (host) y finalmente broadcast NetBIOS. Este orden puede modificarse en smb.conf con `name resolve order = ...`.
</details>

### Pregunta 3
Un usuario recibe el error `NT_STATUS_LOGON_FAILURE` al intentar acceder a un recurso compartido. ¿Cuál es la causa más probable?

a) El recurso compartido no existe
b) Las credenciales del usuario son incorrectas o la cuenta no existe en passdb
c) El firewall bloquea el puerto 445
d) El directorio no tiene permisos de lectura

<details><summary>Respuesta</summary>

**b) Las credenciales del usuario son incorrectas o la cuenta no existe en passdb**

`NT_STATUS_LOGON_FAILURE` indica un fallo de autenticación. Puede deberse a contraseña incorrecta, usuario no registrado en la base de datos de Samba (passdb), cuenta deshabilitada o problema con Kerberos/AD. Se debe verificar con `pdbedit -L` para usuarios locales o `wbinfo -a` para usuarios de dominio.
</details>

### Pregunta 4
¿Qué comando de `wbinfo` verifica que la relación de confianza con el dominio está funcionando?

a) `wbinfo -p`
b) `wbinfo -u`
c) `wbinfo -t`
d) `wbinfo -a`

<details><summary>Respuesta</summary>

**c) `wbinfo -t`**

`wbinfo -t` (trust) verifica que la relación de confianza entre el servidor Samba y el controlador de dominio es válida. `wbinfo -p` solo verifica que el demonio winbindd responde (ping). `wbinfo -u` lista usuarios y `wbinfo -a` prueba la autenticación de un usuario específico.
</details>

### Pregunta 5
¿Qué nivel de log de Samba es recomendable para diagnosticar problemas de acceso a archivos sin generar excesiva información?

a) 0
b) 1
c) 3
d) 10

<details><summary>Respuesta</summary>

**c) 3**

El nivel 3 muestra operaciones detalladas de archivos sin ser excesivamente verboso. Es el nivel más comúnmente utilizado para diagnóstico de problemas de acceso. El nivel 0 solo muestra errores críticos, el nivel 1 es para operación normal y el nivel 10 genera volcados completos que pueden llenar el disco rápidamente.
</details>

### Pregunta 6
¿Qué herramienta de línea de comandos permite capturar tráfico SMB para análisis posterior con Wireshark?

a) nmap
b) tcpdump
c) netstat
d) smbclient

<details><summary>Respuesta</summary>

**b) tcpdump**

`tcpdump` permite capturar tráfico de red y guardarlo en archivos pcap que pueden analizarse posteriormente con Wireshark. Para capturar tráfico SMB: `tcpdump -i eth0 port 445 -w captura.pcap`. También se puede usar `tshark` (versión CLI de Wireshark) para captura y análisis directo.
</details>

### Pregunta 7
Un administrador ejecuta `getent passwd usuario_ad` y no obtiene resultado, pero `wbinfo -u` sí muestra el usuario. ¿Cuál es la causa más probable?

a) winbindd no está funcionando
b) El archivo `/etc/nsswitch.conf` no incluye winbind
c) El usuario no tiene contraseña
d) El servidor DNS no funciona

<details><summary>Respuesta</summary>

**b) El archivo `/etc/nsswitch.conf` no incluye winbind**

Si `wbinfo -u` muestra el usuario pero `getent passwd` no, significa que winbindd funciona correctamente pero NSS no está configurado para consultarlo. Se debe verificar que `/etc/nsswitch.conf` contenga `winbind` en las líneas de passwd y group: `passwd: files winbind` y `group: files winbind`.
</details>

### Pregunta 8
¿Qué puerto se debe filtrar con tcpdump para capturar tráfico de resolución de nombres NetBIOS?

a) 445
b) 139
c) 137
d) 88

<details><summary>Respuesta</summary>

**c) 137**

El puerto UDP 137 es el utilizado por el servicio de nombres NetBIOS (NetBIOS Name Service). Las consultas y registros de nombres NetBIOS, incluyendo WINS, usan este puerto. El puerto 138 es para datagramas NetBIOS, 139 para sesiones NetBIOS (SMB) y 445 para SMB directo sobre TCP.
</details>

### Pregunta 9
¿Qué comando verifica que los registros SRV de DNS necesarios para Active Directory están correctamente configurados?

a) `nmblookup -S dc`
b) `dig _ldap._tcp.dominio.com SRV`
c) `wbinfo --dsgetdcname`
d) `net ads lookup`

<details><summary>Respuesta</summary>

**b) `dig _ldap._tcp.dominio.com SRV`**

El comando `dig` con el tipo de registro `SRV` permite verificar que los registros de servicio necesarios para AD están presentes en DNS. Los registros `_ldap._tcp` y `_kerberos._tcp` son esenciales para que los clientes localicen los controladores de dominio. `net ads lookup` también localiza DCs, pero `dig` es más específico para diagnóstico DNS.
</details>

### Pregunta 10
¿Cómo se pueden configurar niveles de log diferentes para distintos componentes de Samba?

a) Creando archivos de log separados para cada componente
b) Usando la sintaxis `log level = 1 auth:5 winbind:3` en smb.conf
c) Ejecutando cada demonio con un nivel de log diferente
d) No es posible, el nivel es global para todos los componentes

<details><summary>Respuesta</summary>

**b) Usando la sintaxis `log level = 1 auth:5 winbind:3` en smb.conf**

Samba permite configurar niveles de log granulares por componente. La sintaxis es `log level = NIVEL_GLOBAL componente1:nivel componente2:nivel`. Por ejemplo, `log level = 1 auth:5 winbind:3` establece nivel 1 global, nivel 5 para autenticación y nivel 3 para winbind. Los componentes incluyen auth, passdb, winbind, smb, vfs, idmap, entre otros.
</details>
