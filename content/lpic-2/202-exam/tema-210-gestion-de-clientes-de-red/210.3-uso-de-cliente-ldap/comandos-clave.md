---
title: "210.3 - Uso de cliente LDAP"
tags: [lpic-2, examen-202, tema-210, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.3"
---

# 210.3 - Comandos clave: Uso de cliente LDAP

## Comandos de cliente LDAP

| Comando | Descripción |
|---------|-------------|
| `ldapsearch` | Buscar entradas en el directorio LDAP |
| `ldapadd` | Añadir nuevas entradas desde un archivo LDIF |
| `ldapmodify` | Modificar entradas existentes |
| `ldapdelete` | Eliminar entradas del directorio |
| `ldapwhoami` | Verificar la identidad del bind actual |
| `ldappasswd` | Cambiar contraseña de un usuario LDAP |

## Opciones comunes a todos los comandos

| Opción | Descripción |
|--------|-------------|
| `-x` | Autenticación simple (no SASL) |
| `-D "bindDN"` | DN del usuario para autenticarse |
| `-W` | Solicitar contraseña de forma interactiva |
| `-w contraseña` | Contraseña en la línea de comandos |
| `-H ldap://servidor` | URI del servidor LDAP |
| `-Z` | Intentar STARTTLS |
| `-ZZ` | Forzar STARTTLS (fallo si no disponible) |
| `-f archivo.ldif` | Leer operaciones de un archivo LDIF |

## Opciones específicas de ldapsearch

| Opción | Descripción |
|--------|-------------|
| `-b "baseDN"` | Base DN para la búsqueda |
| `-s base/one/sub` | Alcance de búsqueda |
| `-L` | Salida formato LDIF |
| `-LL` | LDIF sin comentarios |
| `-LLL` | LDIF sin comentarios ni versión |

## Ejemplos de uso frecuente

```bash
# Buscar todos los usuarios
ldapsearch -x -b "dc=ejemplo,dc=com" "(objectClass=posixAccount)" -LLL

# Buscar un usuario concreto
ldapsearch -x -b "dc=ejemplo,dc=com" "(uid=juan)" cn mail -LLL

# Añadir entrada desde LDIF
ldapadd -x -D "cn=admin,dc=ejemplo,dc=com" -W -f usuario.ldif

# Modificar entrada
ldapmodify -x -D "cn=admin,dc=ejemplo,dc=com" -W -f cambios.ldif

# Eliminar entrada
ldapdelete -x -D "cn=admin,dc=ejemplo,dc=com" -W "uid=juan,ou=personas,dc=ejemplo,dc=com"

# Cambiar contraseña
ldappasswd -x -D "cn=admin,dc=ejemplo,dc=com" -W -S "uid=juan,ou=personas,dc=ejemplo,dc=com"
```

## Terminología LDAP

| Término | Significado | Ejemplo |
|---------|-------------|---------|
| DN | Distinguished Name (nombre completo) | `uid=juan,ou=personas,dc=ejemplo,dc=com` |
| RDN | Relative Distinguished Name | `uid=juan` |
| Base DN | Punto de inicio para búsquedas | `dc=ejemplo,dc=com` |
| objectClass | Tipo de entrada (define atributos) | `posixAccount`, `inetOrgPerson` |
| LDIF | LDAP Data Interchange Format | Formato de texto para datos LDAP |

## Archivos de configuración

| Archivo | Función |
|---------|---------|
| `/etc/ldap/ldap.conf` | Configuración cliente LDAP (Debian) |
| `/etc/openldap/ldap.conf` | Configuración cliente LDAP (RHEL) |
| `/etc/nsswitch.conf` | Fuentes de resolución de nombres |
| `/etc/sssd/sssd.conf` | Configuración SSSD |

## Directivas de ldap.conf

| Directiva | Descripción |
|-----------|-------------|
| `BASE` | Base DN por defecto |
| `URI` | URI del servidor LDAP |
| `TLS_CACERT` | Ruta al certificado CA |
| `TLS_CACERTDIR` | Directorio de certificados CA |
| `TLS_REQCERT` | Nivel de verificación: `never`, `allow`, `try`, `demand` |

## Puertos LDAP

| Puerto | Protocolo |
|--------|-----------|
| 389 | LDAP sin cifrar / STARTTLS |
| 636 | LDAPS (LDAP sobre SSL/TLS) |
