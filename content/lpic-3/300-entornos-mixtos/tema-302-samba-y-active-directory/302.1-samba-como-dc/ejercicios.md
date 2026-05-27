---
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.1"
titulo: "Samba como DC - Ejercicios"
peso: 5
tags:
  - lpic-3
  - tema-302
  - ejercicios
---

# Ejercicios - 302.1 Samba como Controlador de Dominio

### Pregunta 1
¿Qué comando se utiliza para aprovisionar un nuevo dominio Active Directory con Samba?

a) `samba-tool domain create`
b) `samba-tool domain provision`
c) `net ads provision`
d) `samba-tool ad setup`

<details><summary>Respuesta</summary>

**b) `samba-tool domain provision`**

`samba-tool domain provision` es el comando que crea un nuevo dominio Active Directory. Requiere parámetros como `--realm` (nombre Kerberos), `--domain` (nombre NetBIOS), `--server-role=dc` y `--dns-backend`. El proceso genera la base de datos LDAP, configura Kerberos, crea las zonas DNS y genera el archivo smb.conf.
</details>

### Pregunta 2
¿Cuáles de los roles FSMO tienen alcance a nivel de bosque (forest)?

a) PDC Emulator y RID Master
b) Schema Master y Domain Naming Master
c) Infrastructure Master y Schema Master
d) RID Master y Domain Naming Master

<details><summary>Respuesta</summary>

**b) Schema Master y Domain Naming Master**

Los roles FSMO a nivel de bosque son el Schema Master (controla modificaciones al esquema AD) y el Domain Naming Master (gestiona la adición y eliminación de dominios en el bosque). Los roles a nivel de dominio son: PDC Emulator, RID Master e Infrastructure Master.
</details>

### Pregunta 3
¿Qué opción del aprovisionamiento habilita las extensiones RFC2307 para atributos POSIX en AD?

a) `--posix-attributes`
b) `--use-rfc2307`
c) `--enable-unix`
d) `--unix-extensions`

<details><summary>Respuesta</summary>

**b) `--use-rfc2307`**

La opción `--use-rfc2307` del comando `samba-tool domain provision` habilita las extensiones RFC2307 que permiten almacenar atributos POSIX (uidNumber, gidNumber, loginShell, etc.) directamente en los objetos de Active Directory. Esto es esencial para la integración con sistemas Linux.
</details>

### Pregunta 4
¿Qué herramienta se usa para replicar SYSVOL entre controladores de dominio Samba?

a) DFS-R (integrado en Samba)
b) samba-tool drs replicate
c) rsync (herramienta externa)
d) samba-tool sysvol sync

<details><summary>Respuesta</summary>

**c) rsync (herramienta externa)**

Samba no implementa DFS-R (Distributed File System Replication) que es el mecanismo nativo de Microsoft para replicar SYSVOL. Por lo tanto, se debe usar una herramienta externa como rsync para sincronizar el directorio SYSVOL entre controladores de dominio, normalmente programado con cron.
</details>

### Pregunta 5
¿Cuál es la diferencia entre `samba-tool fsmo transfer` y `samba-tool fsmo seize`?

a) No hay diferencia, son sinónimos
b) `transfer` es para roles de bosque y `seize` para roles de dominio
c) `transfer` realiza una transferencia ordenada; `seize` toma el rol forzosamente
d) `transfer` mueve todos los roles; `seize` solo uno

<details><summary>Respuesta</summary>

**c) `transfer` realiza una transferencia ordenada; `seize` toma el rol forzosamente**

`samba-tool fsmo transfer` realiza una transferencia ordenada (graceful) del rol al DC actual, comunicándose con el titular actual del rol. `samba-tool fsmo seize` toma el rol forzosamente sin comunicarse con el titular anterior, y solo debe usarse cuando el DC que tenía el rol ya no está disponible.
</details>

### Pregunta 6
¿Qué backends DNS soporta Samba al actuar como controlador de dominio AD?

a) Solo BIND9
b) SAMBA_INTERNAL y BIND9_DLZ
c) Solo DNS interno
d) PowerDNS y BIND9

<details><summary>Respuesta</summary>

**b) SAMBA_INTERNAL y BIND9_DLZ**

Samba soporta dos backends DNS: `SAMBA_INTERNAL` (servidor DNS integrado en el proceso samba, más simple) y `BIND9_DLZ` (BIND9 con módulo DLZ que lee las zonas AD desde la base de datos de Samba). También existe la opción `NONE` para no configurar DNS, pero no es recomendable.
</details>

### Pregunta 7
¿Qué comando verifica el estado de la replicación entre controladores de dominio Samba?

a) `samba-tool domain repl status`
b) `samba-tool drs showrepl`
c) `net ads repl`
d) `samba-tool fsmo show`

<details><summary>Respuesta</summary>

**b) `samba-tool drs showrepl`**

`samba-tool drs showrepl` muestra el estado de la replicación DRS (Directory Replication Service) entre los controladores de dominio. Incluye información sobre las últimas replicaciones exitosas y fallidas, particiones replicadas y socios de replicación. `samba-tool drs replicate` permite forzar una replicación.
</details>

### Pregunta 8
Al aprovisionar un dominio AD con Samba, ¿dónde se almacena la base de datos principal de Active Directory?

a) `/etc/samba/ad.db`
b) `/var/lib/samba/private/sam.ldb`
c) `/var/lib/samba/passdb.tdb`
d) `/var/lib/samba/ad/ntds.dit`

<details><summary>Respuesta</summary>

**b) `/var/lib/samba/private/sam.ldb`**

La base de datos principal de Active Directory en Samba se almacena en `/var/lib/samba/private/sam.ldb`, que es una base de datos LDB (LDAP Database). Este archivo contiene toda la información del directorio, incluyendo usuarios, grupos, esquema y configuración. Es el equivalente de ntds.dit en Windows.
</details>

### Pregunta 9
¿Qué comando se utiliza para unir un segundo controlador de dominio a un dominio AD existente en Samba?

a) `net ads join`
b) `samba-tool domain join empresa.com DC`
c) `samba-tool domain provision --join`
d) `samba-tool dc add`

<details><summary>Respuesta</summary>

**b) `samba-tool domain join empresa.com DC`**

Para unir un DC adicional se usa `samba-tool domain join` especificando el dominio y el rol `DC`. El comando replica la base de datos AD desde un DC existente, configura Kerberos y DNS. `net ads join` se usa para unir un servidor miembro (no un DC) a un dominio AD.
</details>

### Pregunta 10
¿Cuál es el requisito de sincronización de tiempo para que Kerberos funcione correctamente en un dominio AD?

a) La diferencia máxima permitida es de 1 minuto
b) La diferencia máxima permitida es de 5 minutos
c) La diferencia máxima permitida es de 15 minutos
d) No hay requisito de sincronización de tiempo

<details><summary>Respuesta</summary>

**b) La diferencia máxima permitida es de 5 minutos**

Kerberos requiere que la diferencia de tiempo entre el cliente y el servidor sea menor a 5 minutos (valor predeterminado del clock skew). Si la diferencia es mayor, la autenticación Kerberos falla. Por esta razón, es fundamental tener NTP correctamente configurado en todos los equipos del dominio. El PDC Emulator suele actuar como fuente de tiempo para el dominio.
</details>
