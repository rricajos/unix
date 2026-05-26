---
title: "210.4 - Servidor OpenLDAP"
tags: [lpic-2, examen-202, tema-210, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.4"
---

# 210.4 - Servidor OpenLDAP

## Peso: 4

## Introducción a OpenLDAP

OpenLDAP es la implementación de código abierto más utilizada de un servidor LDAP en Linux. El demonio principal es `slapd` (Stand-alone LDAP Daemon).

### Componentes principales

| Componente | Función |
|------------|---------|
| `slapd` | Demonio del servidor LDAP |
| `slap*` | Herramientas del lado del servidor (slapcat, slapadd, etc.) |
| `ldap*` | Herramientas del lado del cliente (ldapsearch, ldapadd, etc.) |

## Métodos de configuración

OpenLDAP soporta dos métodos de configuración:

### 1. Configuración tradicional: slapd.conf

Archivo de configuración estático ubicado en `/etc/ldap/slapd.conf` o `/etc/openldap/slapd.conf`:

```bash
# /etc/ldap/slapd.conf
include     /etc/ldap/schema/core.schema
include     /etc/ldap/schema/cosine.schema
include     /etc/ldap/schema/inetorgperson.schema
include     /etc/ldap/schema/nis.schema

pidfile     /var/run/slapd/slapd.pid
argsfile    /var/run/slapd/slapd.args

modulepath  /usr/lib/ldap
moduleload  back_mdb

database    mdb
maxsize     1073741824
suffix      "dc=ejemplo,dc=com"
rootdn      "cn=admin,dc=ejemplo,dc=com"
rootpw      {SSHA}hash_de_contraseña
directory   /var/lib/ldap

index       objectClass eq
index       uid         eq,pres,sub
index       cn          eq,pres,sub
```

### 2. Configuración dinámica: OLC (cn=config)

OLC (Online Configuration) permite modificar la configuración del servidor en caliente sin reiniciar. La configuración se almacena como entradas LDAP en el directorio `slapd.d`.

```
/etc/ldap/slapd.d/
├── cn=config.ldif
├── cn=config/
│   ├── cn=module{0}.ldif
│   ├── cn=schema.ldif
│   ├── cn=schema/
│   │   ├── cn={0}core.ldif
│   │   ├── cn={1}cosine.ldif
│   │   └── cn={2}inetorgperson.ldif
│   └── olcDatabase={1}mdb.ldif
```

> **Para el examen:** OLC (cn=config) es el método recomendado y el predeterminado en las distribuciones modernas. La configuración se almacena en `/etc/ldap/slapd.d/`. Los archivos dentro de este directorio NO deben editarse manualmente; se gestionan con ldapmodify.

### Correspondencia entre slapd.conf y OLC

| slapd.conf | OLC (cn=config) |
|------------|-----------------|
| `suffix` | `olcSuffix` |
| `rootdn` | `olcRootDN` |
| `rootpw` | `olcRootPW` |
| `directory` | `olcDbDirectory` |
| `database` | `olcDatabase` |
| `index` | `olcDbIndex` |
| `include` | `olcInclude` |
| `access` | `olcAccess` |
| `loglevel` | `olcLogLevel` |

### Modificación con OLC

```ldif
# Archivo: cambiar_loglevel.ldif
dn: cn=config
changetype: modify
replace: olcLogLevel
olcLogLevel: stats

# Aplicar el cambio
ldapmodify -Y EXTERNAL -H ldapi:/// -f cambiar_loglevel.ldif
```

## Esquemas (Schemas)

Los esquemas definen los tipos de objetos y atributos disponibles en el directorio.

### Esquemas principales

| Esquema | Contenido |
|---------|-----------|
| `core.schema` | Atributos y clases base de LDAP |
| `cosine.schema` | Clases del estándar X.500 |
| `inetorgperson.schema` | Clase inetOrgPerson para personas |
| `nis.schema` | Clases POSIX (posixAccount, posixGroup) |
| `misc.schema` | Definiciones misceláneas |

### Cargar un esquema con OLC

```bash
# Los esquemas se cargan como archivos LDIF
ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/cosine.ldif
```

## Backends de base de datos

| Backend | Descripción |
|---------|-------------|
| **mdb** | Memory-Mapped Database (recomendado, moderno, rápido) |
| **hdb** | Hierarchical Database (basado en BerkeleyDB, obsoleto) |
| **bdb** | Berkeley Database (obsoleto) |
| **ldif** | Almacenamiento en archivos LDIF planos |

> **Para el examen:** `mdb` es el backend recomendado para nuevas instalaciones. `hdb` y `bdb` están obsoletos pero pueden aparecer en preguntas sobre sistemas heredados.

## Herramientas del servidor (slap*)

### slapcat

Exporta el contenido de la base de datos a formato LDIF:

```bash
# Exportar toda la base de datos
slapcat -l backup.ldif

# Exportar una base de datos específica
slapcat -n 1 -l backup_db1.ldif

# Exportar con un filtro
slapcat -a "(objectClass=posixAccount)" -l usuarios.ldif
```

### slapadd

Importa datos LDIF directamente a la base de datos (el servidor debe estar detenido):

```bash
# Importar datos
systemctl stop slapd
slapadd -l datos.ldif
chown -R openldap:openldap /var/lib/ldap
systemctl start slapd
```

### slapindex

Regenera los índices de la base de datos (el servidor debe estar detenido):

```bash
systemctl stop slapd
slapindex
chown -R openldap:openldap /var/lib/ldap
systemctl start slapd
```

### slappasswd

Genera hashes de contraseñas para usar en la configuración:

```bash
# Generar hash SSHA (por defecto)
slappasswd
# Solicita la contraseña y devuelve: {SSHA}xxxxxxxxxxxx

# Generar hash con esquema específico
slappasswd -h {SHA}
slappasswd -h {MD5}
slappasswd -h {CRYPT}
```

### slaptest

Verifica la sintaxis del archivo de configuración:

```bash
# Verificar slapd.conf
slaptest -f /etc/ldap/slapd.conf

# Verificar configuración OLC
slaptest -F /etc/ldap/slapd.d

# Convertir slapd.conf a formato OLC
slaptest -f /etc/ldap/slapd.conf -F /etc/ldap/slapd.d
```

> **Para el examen:** `slapcat`, `slapadd` y `slapindex` operan directamente sobre la base de datos sin pasar por el demonio slapd. Por eso, `slapadd` y `slapindex` requieren que el servidor esté detenido. `slapcat` puede ejecutarse con el servidor en ejecución pero se recomienda detenerlo.

## Control de acceso (ACLs)

Las ACLs controlan quién puede acceder a qué datos y con qué nivel de permisos.

### Sintaxis de ACL en slapd.conf

```bash
access to <qué>
    by <quién> <permisos>
```

### Ejemplo de ACLs

```bash
# Permitir al usuario leer su propia contraseña y al admin gestionarla
access to attrs=userPassword
    by self write
    by anonymous auth
    by dn="cn=admin,dc=ejemplo,dc=com" write
    by * none

# Acceso de lectura general
access to *
    by dn="cn=admin,dc=ejemplo,dc=com" write
    by users read
    by anonymous auth
    by * none
```

### Niveles de acceso

| Nivel | Descripción | Incluye |
|-------|-------------|---------|
| `none` | Sin acceso | - |
| `disclose` | Revelar existencia | - |
| `auth` | Autenticación | disclose |
| `compare` | Comparar valores | auth |
| `search` | Buscar | compare |
| `read` | Leer | search |
| `write` | Escribir | read |
| `manage` | Gestión completa | write |

### Sujetos de ACL (quién)

| Sujeto | Descripción |
|--------|-------------|
| `*` | Todos |
| `anonymous` | Usuarios no autenticados |
| `users` | Usuarios autenticados |
| `self` | El propio usuario de la entrada |
| `dn="..."` | Un DN específico |
| `group="..."` | Miembros de un grupo |

## Overlays

Los overlays son módulos que extienden la funcionalidad de slapd:

| Overlay | Función |
|---------|---------|
| `syncprov` | Proveedor de sincronización para replicación |
| `memberof` | Gestión automática de membresía inversa |
| `ppolicy` | Políticas de contraseña |
| `refint` | Integridad referencial |
| `auditlog` | Registro de modificaciones |
| `unique` | Garantizar unicidad de atributos |

## Replicación (SyncRepl)

SyncRepl permite replicar datos entre servidores LDAP. El proveedor (master) envía cambios al consumidor (slave).

### Configuración del proveedor

```bash
# En slapd.conf del proveedor
moduleload syncprov
overlay syncprov
syncprov-checkpoint 100 10
syncprov-sessionlog 200
```

### Configuración del consumidor

```bash
# En slapd.conf del consumidor
syncrepl rid=001
    provider=ldap://master.ejemplo.com
    type=refreshAndPersist
    searchbase="dc=ejemplo,dc=com"
    bindmethod=simple
    binddn="cn=replica,dc=ejemplo,dc=com"
    credentials=secreto
    retry="60 +"
```

### Modos de replicación

| Modo | Descripción |
|------|-------------|
| `refreshOnly` | El consumidor consulta periódicamente al proveedor |
| `refreshAndPersist` | El proveedor envía cambios al consumidor en tiempo real |

> **Para el examen:** SyncRepl es el método de replicación estándar en OpenLDAP. Conocer la diferencia entre `refreshOnly` y `refreshAndPersist` es importante: el primero es polling y el segundo es push en tiempo real.

## Configuración TLS para slapd

### En slapd.conf

```bash
TLSCACertificateFile    /etc/ssl/certs/ca-cert.pem
TLSCertificateFile      /etc/ssl/certs/slapd-cert.pem
TLSCertificateKeyFile   /etc/ssl/private/slapd-key.pem
TLSVerifyClient         never
```

### En OLC (cn=config)

```ldif
dn: cn=config
changetype: modify
add: olcTLSCACertificateFile
olcTLSCACertificateFile: /etc/ssl/certs/ca-cert.pem
-
add: olcTLSCertificateFile
olcTLSCertificateFile: /etc/ssl/certs/slapd-cert.pem
-
add: olcTLSCertificateKeyFile
olcTLSCertificateKeyFile: /etc/ssl/private/slapd-key.pem
```

## Resumen de archivos y rutas clave

| Archivo/Ruta | Función |
|-------------|---------|
| `/etc/ldap/slapd.conf` | Configuración estática (Debian) |
| `/etc/openldap/slapd.conf` | Configuración estática (RHEL) |
| `/etc/ldap/slapd.d/` | Directorio de configuración OLC (Debian) |
| `/etc/openldap/slapd.d/` | Directorio de configuración OLC (RHEL) |
| `/var/lib/ldap/` | Base de datos del directorio |
| `/etc/ldap/schema/` | Esquemas disponibles |
