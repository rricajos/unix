---
title: "210.3 - Uso de cliente LDAP"
tags: [lpic-2, examen-202, tema-210, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.3"
---

# 210.3 - Ejercicios: Uso de cliente LDAP

## Pregunta 1

¿Qué significa DN en el contexto de LDAP?

a) Domain Name
b) Distinguished Name
c) Directory Node
d) Data Namespace

<details><summary>Respuesta</summary>

**b) Distinguished Name**

DN (Distinguished Name) es el nombre completo y único de una entrada en el directorio LDAP, que incluye la ruta completa desde la raíz. Ejemplo: `uid=juan,ou=personas,dc=ejemplo,dc=com`.
</details>

## Pregunta 2

¿Qué opción de `ldapsearch` se utiliza para especificar el punto de inicio de la búsqueda?

a) -s
b) -d
c) -b
d) -r

<details><summary>Respuesta</summary>

**c) -b**

La opción `-b` de `ldapsearch` especifica el Base DN, que es el punto de inicio en el árbol LDAP desde donde se realizará la búsqueda. Ejemplo: `ldapsearch -x -b "dc=ejemplo,dc=com"`.
</details>

## Pregunta 3

¿Qué puerto utiliza LDAP sobre SSL/TLS (LDAPS)?

a) 389
b) 443
c) 636
d) 993

<details><summary>Respuesta</summary>

**c) 636**

LDAPS utiliza el puerto 636. El puerto 389 es para LDAP sin cifrar o con STARTTLS. Es importante no confundir LDAPS (puerto 636) con STARTTLS (que usa el puerto 389 estándar).
</details>

## Pregunta 4

¿Qué comando se utiliza para añadir nuevas entradas al directorio LDAP desde un archivo LDIF?

a) ldapinsert
b) ldapadd
c) ldapnew
d) ldapcreate

<details><summary>Respuesta</summary>

**b) ldapadd**

`ldapadd` añade nuevas entradas al directorio LDAP. Se usa típicamente con un archivo LDIF: `ldapadd -x -D "cn=admin,dc=ejemplo,dc=com" -W -f nuevas_entradas.ldif`.
</details>

## Pregunta 5

En un archivo LDIF, ¿cómo se separan las diferentes entradas?

a) Con punto y coma
b) Con una línea que contiene "---"
c) Con una línea en blanco
d) Con la palabra "entry"

<details><summary>Respuesta</summary>

**c) Con una línea en blanco**

En formato LDIF, las entradas se separan con líneas en blanco. Cada entrada comienza con una línea `dn:` que indica su Distinguished Name, y se separa de la siguiente entrada con al menos una línea vacía.
</details>

## Pregunta 6

¿Qué opción de `ldapsearch` fuerza el uso de STARTTLS y falla si no es posible establecer la conexión cifrada?

a) -Z
b) -ZZ
c) -T
d) -SSL

<details><summary>Respuesta</summary>

**b) -ZZ**

La opción `-ZZ` fuerza el uso de STARTTLS y provoca un error si no se puede establecer la conexión cifrada. La opción `-Z` (una sola Z) intenta STARTTLS pero continúa sin cifrado si falla.
</details>

## Pregunta 7

¿En qué archivo se configura el Base DN y URI por defecto para los clientes LDAP en un sistema Debian?

a) /etc/ldap.conf
b) /etc/ldap/ldap.conf
c) /etc/openldap/ldap.conf
d) /etc/default/ldap

<details><summary>Respuesta</summary>

**b) /etc/ldap/ldap.conf**

En sistemas Debian/Ubuntu, la configuración del cliente LDAP se encuentra en `/etc/ldap/ldap.conf`. En sistemas RHEL/CentOS, la ruta es `/etc/openldap/ldap.conf`.
</details>

## Pregunta 8

¿Cuáles son los tres tipos de alcance (scope) de búsqueda en LDAP?

a) local, remote, global
b) base, one, sub
c) root, branch, leaf
d) simple, recursive, deep

<details><summary>Respuesta</summary>

**b) base, one, sub**

Los tres alcances de búsqueda LDAP son: `base` (solo la entrada del Base DN), `one` (solo un nivel por debajo del Base DN) y `sub` (todo el subárbol desde el Base DN, es el valor por defecto).
</details>

## Pregunta 9

¿Qué valor de `TLS_REQCERT` en ldap.conf es el más seguro y recomendado para producción?

a) never
b) allow
c) try
d) demand

<details><summary>Respuesta</summary>

**d) demand**

`TLS_REQCERT demand` requiere que el servidor presente un certificado válido y verificable. Es el valor más seguro y el recomendado para entornos de producción. `never` no verifica nada, `allow` permite conexiones con certificados inválidos y `try` verifica solo si el servidor presenta certificado.
</details>

## Pregunta 10

¿Qué changetype se utiliza en un archivo LDIF para modificar un atributo existente de una entrada LDAP?

a) changetype: update
b) changetype: modify
c) changetype: replace
d) changetype: edit

<details><summary>Respuesta</summary>

**b) changetype: modify**

El `changetype: modify` se utiliza en archivos LDIF para modificar entradas existentes. Dentro de un bloque modify, se pueden usar las operaciones `add` (añadir atributo), `replace` (reemplazar valor) y `delete` (eliminar atributo).
</details>
