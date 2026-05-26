---
title: "210.3 - Uso de cliente LDAP"
tags: [lpic-2, examen-202, tema-210, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.3"
---

# 210.3 - Uso de cliente LDAP

## Peso: 2

## Conceptos fundamentales de LDAP

LDAP (Lightweight Directory Access Protocol) es un protocolo para acceder y gestionar servicios de directorio. Funciona sobre el puerto **389** (sin cifrar) y **636** (LDAPS con TLS/SSL).

### Estructura del directorio LDAP

LDAP organiza la información en una estructura jerárquica de árbol (DIT - Directory Information Tree):

```
dc=ejemplo,dc=com
├── ou=personas
│   ├── uid=juan
│   └── uid=maria
├── ou=grupos
│   ├── cn=administradores
│   └── cn=usuarios
└── ou=equipos
    └── cn=servidor01
```

### Terminología clave

| Término | Descripción | Ejemplo |
|---------|-------------|---------|
| **DN** (Distinguished Name) | Nombre completo y único de una entrada | `uid=juan,ou=personas,dc=ejemplo,dc=com` |
| **RDN** (Relative DN) | Componente relativo del DN | `uid=juan` |
| **Base DN** | Punto de inicio para las búsquedas | `dc=ejemplo,dc=com` |
| **objectClass** | Define qué atributos puede/debe tener una entrada | `inetOrgPerson`, `posixAccount` |
| **Atributo** | Par clave-valor dentro de una entrada | `cn: Juan García` |

> **Para el examen:** Entender la diferencia entre DN, RDN y Base DN es fundamental. El DN es la ruta completa, el RDN es el nombre relativo, y el Base DN es el punto de inicio de búsquedas.

### ObjectClasses comunes

| objectClass | Uso |
|-------------|-----|
| `top` | Clase base obligatoria |
| `person` | Información básica de persona (cn, sn) |
| `organizationalPerson` | Extensión de person con datos organizativos |
| `inetOrgPerson` | Persona con datos de Internet (mail, uid) |
| `posixAccount` | Cuenta POSIX (uidNumber, gidNumber, homeDirectory) |
| `posixGroup` | Grupo POSIX (gidNumber, memberUid) |
| `organizationalUnit` | Unidad organizativa (ou) |

## Formato LDIF

LDIF (LDAP Data Interchange Format) es el formato de texto para representar entradas LDAP y modificaciones.

### Ejemplo de entrada LDIF

```ldif
dn: uid=juan,ou=personas,dc=ejemplo,dc=com
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: inetOrgPerson
objectClass: posixAccount
uid: juan
cn: Juan García
sn: García
givenName: Juan
mail: juan@ejemplo.com
uidNumber: 1001
gidNumber: 1001
homeDirectory: /home/juan
loginShell: /bin/bash
userPassword: {SSHA}hash_de_contraseña
```

### LDIF para modificaciones

```ldif
# Modificar un atributo
dn: uid=juan,ou=personas,dc=ejemplo,dc=com
changetype: modify
replace: mail
mail: juan.garcia@ejemplo.com

# Añadir un atributo
dn: uid=juan,ou=personas,dc=ejemplo,dc=com
changetype: modify
add: telephoneNumber
telephoneNumber: +34 600 123 456

# Eliminar un atributo
dn: uid=juan,ou=personas,dc=ejemplo,dc=com
changetype: modify
delete: telephoneNumber
```

> **Para el examen:** Conocer la sintaxis LDIF es imprescindible: cada entrada empieza con `dn:`, las entradas se separan con líneas en blanco, y las modificaciones usan `changetype: modify` con `add`, `replace` o `delete`.

## Herramientas de cliente LDAP

### ldapsearch

Realiza búsquedas en el directorio LDAP:

```bash
# Búsqueda básica
ldapsearch -x -b "dc=ejemplo,dc=com" "(uid=juan)"

# Búsqueda con autenticación
ldapsearch -x -D "cn=admin,dc=ejemplo,dc=com" -W -b "dc=ejemplo,dc=com" "(objectClass=posixAccount)"

# Buscar solo atributos específicos
ldapsearch -x -b "dc=ejemplo,dc=com" "(uid=juan)" cn mail uidNumber

# Búsqueda con STARTTLS
ldapsearch -x -ZZ -b "dc=ejemplo,dc=com" "(uid=juan)"

# Búsqueda en servidor específico
ldapsearch -x -H ldap://ldap.ejemplo.com -b "dc=ejemplo,dc=com" "(cn=*)"
```

### Opciones comunes de ldapsearch

| Opción | Descripción |
|--------|-------------|
| `-x` | Autenticación simple (en lugar de SASL) |
| `-b` | Base DN para la búsqueda |
| `-D` | DN del usuario para autenticarse (bind DN) |
| `-W` | Solicitar contraseña de forma interactiva |
| `-w` | Contraseña en la línea de comandos |
| `-H` | URI del servidor LDAP |
| `-ZZ` | Forzar STARTTLS (falla si no es posible) |
| `-Z` | Intentar STARTTLS (continúa si falla) |
| `-s` | Alcance de búsqueda: `base`, `one`, `sub` |
| `-L` | Salida en formato LDIF |
| `-LL` | LDIF sin comentarios |
| `-LLL` | LDIF sin comentarios ni versión |

### Alcance de búsqueda (-s)

| Alcance | Descripción |
|---------|-------------|
| `base` | Solo la entrada especificada por el Base DN |
| `one` | Solo un nivel por debajo del Base DN |
| `sub` | Todo el subárbol desde el Base DN (por defecto) |

### ldapadd

Añade nuevas entradas al directorio desde un archivo LDIF:

```bash
# Añadir desde un archivo LDIF
ldapadd -x -D "cn=admin,dc=ejemplo,dc=com" -W -f nueva_entrada.ldif

# Añadir con contraseña en línea
ldapadd -x -D "cn=admin,dc=ejemplo,dc=com" -w secreto -f usuarios.ldif
```

### ldapmodify

Modifica entradas existentes en el directorio:

```bash
# Modificar desde un archivo LDIF
ldapmodify -x -D "cn=admin,dc=ejemplo,dc=com" -W -f cambios.ldif

# Ejemplo de archivo de cambios
# changetype: modify
# replace: mail
# mail: nuevo@ejemplo.com
```

### ldapdelete

Elimina entradas del directorio:

```bash
# Eliminar una entrada específica
ldapdelete -x -D "cn=admin,dc=ejemplo,dc=com" -W "uid=juan,ou=personas,dc=ejemplo,dc=com"

# Eliminar recursivamente
ldapdelete -x -D "cn=admin,dc=ejemplo,dc=com" -W -r "ou=temporal,dc=ejemplo,dc=com"
```

> **Para el examen:** Todos los comandos de cliente LDAP comparten las opciones `-x` (autenticación simple), `-D` (bind DN), `-W` (pedir contraseña) y `-H` (servidor). Memoriza estas opciones comunes.

## Configuración del cliente LDAP

### Archivo /etc/ldap/ldap.conf

Este archivo configura los valores por defecto para las herramientas de cliente LDAP:

```bash
# /etc/ldap/ldap.conf (Debian/Ubuntu)
# /etc/openldap/ldap.conf (RHEL/CentOS)

BASE    dc=ejemplo,dc=com
URI     ldap://ldap.ejemplo.com ldaps://ldap.ejemplo.com

# Configuración TLS
TLS_CACERT      /etc/ssl/certs/ca-certificates.crt
TLS_REQCERT     demand
TLS_CACERTDIR   /etc/ssl/certs

# Timeout
TIMEOUT     15
NETWORK_TIMEOUT 10
```

### Directivas principales de ldap.conf

| Directiva | Descripción |
|-----------|-------------|
| `BASE` | Base DN por defecto para búsquedas |
| `URI` | URI del servidor LDAP |
| `TLS_CACERT` | Ruta al certificado CA |
| `TLS_CACERTDIR` | Directorio de certificados CA |
| `TLS_REQCERT` | Nivel de verificación de certificado: `never`, `allow`, `try`, `demand` |
| `TIMEOUT` | Timeout general de operación (segundos) |
| `NETWORK_TIMEOUT` | Timeout de conexión de red (segundos) |

## Configuración TLS/STARTTLS

### Niveles de verificación TLS_REQCERT

| Valor | Comportamiento |
|-------|---------------|
| `never` | No se verifica el certificado del servidor |
| `allow` | Se verifica pero se permite la conexión aunque falle |
| `try` | Se verifica si el servidor presenta certificado |
| `demand` | Se requiere un certificado válido (recomendado en producción) |

## Integración LDAP con NSS y PAM

### Configuración con nss-ldap

El archivo `/etc/nsswitch.conf` se modifica para incluir LDAP como fuente de nombres:

```bash
# /etc/nsswitch.conf
passwd:     files ldap
group:      files ldap
shadow:     files ldap
```

### Configuración con SSSD

SSSD es la solución moderna para integrar autenticación LDAP:

```bash
# /etc/sssd/sssd.conf
[sssd]
services = nss, pam
domains = ejemplo.com

[domain/ejemplo.com]
id_provider = ldap
auth_provider = ldap
ldap_uri = ldap://ldap.ejemplo.com
ldap_search_base = dc=ejemplo,dc=com
ldap_tls_reqcert = demand
ldap_tls_cacert = /etc/ssl/certs/ca-certificates.crt
```

> **Para el examen:** SSSD es la forma recomendada actualmente para integrar LDAP con el sistema. Conocer tanto la configuración tradicional (nss-ldap/pam_ldap) como la moderna (SSSD) es necesario.

## Resumen de archivos clave

| Archivo | Función |
|---------|---------|
| `/etc/ldap/ldap.conf` | Configuración del cliente LDAP (Debian) |
| `/etc/openldap/ldap.conf` | Configuración del cliente LDAP (RHEL) |
| `/etc/nsswitch.conf` | Fuentes de resolución de nombres |
| `/etc/sssd/sssd.conf` | Configuración de SSSD |
| `/etc/nslcd.conf` | Configuración del demonio nslcd (nss-ldap) |
