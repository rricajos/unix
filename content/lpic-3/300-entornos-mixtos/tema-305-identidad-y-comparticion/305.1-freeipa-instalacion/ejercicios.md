---
title: "305.1 - Ejercicios: FreeIPA Instalación"
description: "Ejercicios de práctica para instalación de FreeIPA"
tipo: ejercicios
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "Tema 305 - Identidad y Compartición"
subtema: "305.1"
peso: 2
tags:
  - lpic-3
  - tema-305
  - freeipa
  - ejercicios
---

# 305.1 Ejercicios - FreeIPA Instalación

### Pregunta 1
¿Cuáles son los cuatro componentes principales integrados en FreeIPA?

a) OpenLDAP, Heimdal Kerberos, OpenSSL CA, PowerDNS
b) 389 Directory Server, MIT Kerberos, Dogtag CA, BIND
c) Active Directory, Windows Kerberos, Microsoft CA, Microsoft DNS
d) OpenDJ, MIT Kerberos, Let's Encrypt, Unbound

<details><summary>Respuesta</summary>

**b) 389 Directory Server, MIT Kerberos, Dogtag CA, BIND**

FreeIPA integra 389 DS como servidor LDAP, MIT Kerberos para autenticación, Dogtag CA como autoridad de certificación y BIND como servidor DNS integrado.
</details>

### Pregunta 2
¿Qué comando instala un servidor FreeIPA?

a) `freeipa-install --server`
b) `ipa-server-install`
c) `ipa install server`
d) `yum install freeipa && freeipa-setup`

<details><summary>Respuesta</summary>

**b) `ipa-server-install`**

`ipa-server-install` es el comando que realiza la instalación y configuración completa de un servidor FreeIPA, incluyendo 389 DS, MIT Kerberos, Dogtag CA y opcionalmente BIND.
</details>

### Pregunta 3
¿Qué parámetro de `ipa-server-install` activa la integración DNS con BIND?

a) `--dns`
b) `--enable-dns`
c) `--setup-dns`
d) `--bind-dns`

<details><summary>Respuesta</summary>

**c) `--setup-dns`**

`--setup-dns` configura BIND como servidor DNS integrado con FreeIPA. Esto permite la gestión centralizada de DNS y la creación automática de registros SRV necesarios para el descubrimiento de servicios.
</details>

### Pregunta 4
¿Qué hace `ipa-client-install --mkhomedir`?

a) Crea el directorio home del administrador en el servidor
b) Configura la creación automática de directorios home para usuarios del dominio
c) Crea un directorio para almacenar las claves del cliente
d) Monta el directorio home desde el servidor NFS

<details><summary>Respuesta</summary>

**b) Configura la creación automática de directorios home para usuarios del dominio**

`--mkhomedir` configura el módulo PAM `pam_mkhomedir` (u `oddjob-mkhomedir`) para que se cree automáticamente el directorio home del usuario del dominio la primera vez que inicia sesión en ese equipo.
</details>

### Pregunta 5
¿Cómo se instala una réplica FreeIPA a partir de la versión 4.x?

a) Se copia la base de datos del servidor principal
b) Se prepara un archivo de réplica con `ipa-replica-prepare` y se copia al nuevo servidor
c) Se inscribe como cliente y luego se promueve con `ipa-replica-install`
d) Se ejecuta `ipa-server-install --replica` directamente

<details><summary>Respuesta</summary>

**c) Se inscribe como cliente y luego se promueve con `ipa-replica-install`**

Desde FreeIPA 4.x, el proceso de réplica se simplificó: primero se instala el sistema como cliente FreeIPA con `ipa-client-install`, y luego se promueve a réplica con `ipa-replica-install`.
</details>

### Pregunta 6
¿Qué servicio se encarga de la renovación automática de certificados en FreeIPA?

a) Dogtag
b) Certmonger
c) Let's Encrypt
d) ACME

<details><summary>Respuesta</summary>

**b) Certmonger**

Certmonger es el servicio que monitoriza los certificados y gestiona su renovación automática antes de que expiren. Dogtag CA es la autoridad de certificación que emite los certificados, pero Certmonger es quien gestiona el ciclo de vida.
</details>

### Pregunta 7
¿Qué comando muestra el estado de todos los servicios de FreeIPA?

a) `systemctl status freeipa`
b) `ipa status`
c) `ipactl status`
d) `ipa-server-status`

<details><summary>Respuesta</summary>

**c) `ipactl status`**

`ipactl status` muestra el estado de todos los servicios que componen FreeIPA (389 DS, KDC, httpd, etc.). `ipactl` también permite iniciar, detener y reiniciar todos los servicios con `start`, `stop` y `restart`.
</details>

### Pregunta 8
¿Qué protocolo usa FreeIPA como almacén principal de identidades?

a) SQL
b) LDAP (389 Directory Server)
c) Active Directory
d) Archivos planos

<details><summary>Respuesta</summary>

**b) LDAP (389 Directory Server)**

FreeIPA utiliza 389 Directory Server como su almacén LDAP principal. Toda la información de usuarios, grupos, políticas y configuración se almacena en el directorio LDAP.
</details>

### Pregunta 9
¿Cuál es la contraseña que se configura con `--ds-password` durante la instalación de FreeIPA?

a) La contraseña del usuario admin de FreeIPA
b) La contraseña del Directory Manager (administrador LDAP raíz)
c) La contraseña del realm Kerberos
d) La contraseña de root del sistema

<details><summary>Respuesta</summary>

**b) La contraseña del Directory Manager (administrador LDAP raíz)**

`--ds-password` establece la contraseña del Directory Manager (cn=Directory Manager), que es la cuenta de superadministrador del servidor LDAP 389 DS. `--admin-password` es la contraseña del usuario admin de FreeIPA.
</details>

### Pregunta 10
Después de instalar FreeIPA, ¿cómo se accede a la interfaz web de administración?

a) `http://servidor:8080/admin`
b) `https://servidor.dominio/ipa/ui/`
c) `https://servidor:9090/freeipa`
d) `http://servidor/webui`

<details><summary>Respuesta</summary>

**b) `https://servidor.dominio/ipa/ui/`**

La interfaz web de FreeIPA está disponible en `https://FQDN/ipa/ui/`. Se accede mediante HTTPS y se puede autenticar con ticket Kerberos (si el navegador está configurado para negociación SPNEGO) o con usuario y contraseña.
</details>
