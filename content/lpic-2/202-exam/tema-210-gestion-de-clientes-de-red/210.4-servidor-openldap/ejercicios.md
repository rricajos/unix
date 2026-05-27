---
title: "210.4 - Servidor OpenLDAP"
tags: [lpic-2, examen-202, tema-210, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.4"
---

# 210.4 - Ejercicios: Servidor OpenLDAP

### Pregunta 1

¿Cuál es el método de configuración recomendado en las versiones modernas de OpenLDAP?

a) slapd.conf (archivo estático)
b) OLC (Online Configuration) con cn=config
c) /etc/openldap/openldap.conf
d) Configuración vía variables de entorno

<details><summary>Respuesta</summary>

**b) OLC (Online Configuration) con cn=config**

OLC (Online Configuration), también conocido como cn=config, es el método recomendado en las versiones modernas de OpenLDAP. Permite modificar la configuración en caliente sin reiniciar el servidor, y almacena la configuración como entradas LDAP en el directorio `/etc/ldap/slapd.d/`.
</details>

### Pregunta 2

¿Qué herramienta se utiliza para exportar el contenido de la base de datos OpenLDAP a formato LDIF?

a) ldapexport
b) slapdump
c) slapcat
d) ldapbackup

<details><summary>Respuesta</summary>

**c) slapcat**

`slapcat` exporta el contenido de la base de datos directamente a formato LDIF. Opera directamente sobre los archivos de la base de datos, sin pasar por el demonio slapd, por lo que puede ejecutarse incluso con el servidor detenido.
</details>

### Pregunta 3

¿Qué backend de base de datos es el recomendado para nuevas instalaciones de OpenLDAP?

a) bdb
b) hdb
c) mdb
d) sql

<details><summary>Respuesta</summary>

**c) mdb**

MDB (Memory-Mapped Database) es el backend recomendado para OpenLDAP. Es más rápido, fiable y sencillo de administrar que los backends antiguos bdb y hdb (basados en BerkeleyDB), que están obsoletos.
</details>

### Pregunta 4

¿Qué requisito tienen `slapadd` y `slapindex` para funcionar correctamente?

a) Deben ejecutarse como usuario ldap
b) El servidor slapd debe estar detenido
c) Se requiere conexión de red activa
d) Deben ejecutarse desde el directorio /var/lib/ldap

<details><summary>Respuesta</summary>

**b) El servidor slapd debe estar detenido**

`slapadd` y `slapindex` operan directamente sobre los archivos de la base de datos sin pasar por el demonio slapd. Por lo tanto, el servidor debe estar detenido para evitar corrupciones. Después de ejecutarlos, se deben ajustar los permisos: `chown -R openldap:openldap /var/lib/ldap`.
</details>

### Pregunta 5

¿Dónde se almacena la configuración OLC (cn=config) en un sistema Debian?

a) /etc/ldap/cn=config/
b) /var/lib/ldap/config/
c) /etc/ldap/slapd.d/
d) /etc/openldap/config.d/

<details><summary>Respuesta</summary>

**c) /etc/ldap/slapd.d/**

La configuración OLC se almacena en el directorio `/etc/ldap/slapd.d/` en sistemas Debian/Ubuntu (en RHEL/CentOS es `/etc/openldap/slapd.d/`). Este directorio contiene archivos LDIF que representan la configuración como entradas LDAP y no deben editarse manualmente.
</details>

### Pregunta 6

¿Qué comando genera un hash de contraseña para usar en la configuración de OpenLDAP?

a) ldappasswd
b) slappasswd
c) openssl passwd
d) slapauth

<details><summary>Respuesta</summary>

**b) slappasswd**

`slappasswd` genera hashes de contraseñas en formatos como SSHA, SHA, MD5 o CRYPT. El hash resultante se usa como valor de `rootpw` en slapd.conf o `olcRootPW` en OLC. `ldappasswd` es diferente: cambia la contraseña de un usuario vía protocolo LDAP.
</details>

### Pregunta 7

En la configuración de ACLs de OpenLDAP, ¿qué nivel de acceso permite leer, buscar y comparar pero NO escribir?

a) search
b) compare
c) read
d) write

<details><summary>Respuesta</summary>

**c) read**

El nivel `read` incluye los permisos de `search`, `compare` y `auth` de forma acumulada. Es el nivel más alto que permite consultar datos sin poder modificarlos. El siguiente nivel, `write`, añade la capacidad de modificación.
</details>

### Pregunta 8

¿Cuál es la directiva OLC equivalente a `suffix` de slapd.conf?

a) olcBaseDN
b) olcSuffix
c) olcRootSuffix
d) olcDatabaseSuffix

<details><summary>Respuesta</summary>

**b) olcSuffix**

En OLC, las directivas de slapd.conf se traducen añadiendo el prefijo `olc`. Así, `suffix` se convierte en `olcSuffix`, `rootdn` en `olcRootDN`, `rootpw` en `olcRootPW`, y así sucesivamente.
</details>

### Pregunta 9

¿Qué tipo de replicación SyncRepl mantiene una conexión persistente para recibir cambios en tiempo real?

a) refreshOnly
b) refreshAndPersist
c) pushReplication
d) realTimeSync

<details><summary>Respuesta</summary>

**b) refreshAndPersist**

En modo `refreshAndPersist`, el consumidor establece una conexión persistente con el proveedor. Tras una sincronización inicial, el proveedor envía los cambios en tiempo real. En contraste, `refreshOnly` realiza consultas periódicas (polling).
</details>

### Pregunta 10

¿Qué comando se utiliza para convertir un archivo slapd.conf al formato de directorio OLC (slapd.d)?

a) slapd -convert
b) slaptest -f /etc/ldap/slapd.conf -F /etc/ldap/slapd.d
c) ldapconvert -f slapd.conf -d slapd.d
d) slapadd -c /etc/ldap/slapd.conf

<details><summary>Respuesta</summary>

**b) slaptest -f /etc/ldap/slapd.conf -F /etc/ldap/slapd.d**

`slaptest` con las opciones `-f` (archivo de configuración de origen) y `-F` (directorio OLC de destino) convierte la configuración del formato estático slapd.conf al formato dinámico OLC. Es útil para migrar servidores al método de configuración moderno.
</details>
