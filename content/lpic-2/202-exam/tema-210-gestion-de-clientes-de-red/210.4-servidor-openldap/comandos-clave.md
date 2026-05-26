---
title: "210.4 - Servidor OpenLDAP"
tags: [lpic-2, examen-202, tema-210, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.4"
---

# 210.4 - Comandos clave: Servidor OpenLDAP

## Herramientas del servidor (slap*)

| Comando | Descripción |
|---------|-------------|
| `slapcat` | Exportar la base de datos a LDIF (no requiere detener slapd) |
| `slapadd` | Importar LDIF directamente a la base de datos (slapd detenido) |
| `slapindex` | Regenerar índices de la base de datos (slapd detenido) |
| `slappasswd` | Generar hashes de contraseñas |
| `slaptest` | Verificar sintaxis de la configuración |
| `slapacl` | Probar reglas de control de acceso |

## Opciones principales de las herramientas slap*

| Opción | Descripción |
|--------|-------------|
| `-f /ruta/slapd.conf` | Especificar archivo de configuración |
| `-F /ruta/slapd.d` | Especificar directorio OLC |
| `-l archivo.ldif` | Archivo LDIF de entrada/salida |
| `-n número` | Número de base de datos |
| `-b "baseDN"` | Base DN de la base de datos |

## Ejemplos de uso

```bash
# Exportar toda la base de datos
slapcat -l backup.ldif

# Importar datos (slapd detenido)
slapadd -l datos.ldif

# Regenerar índices (slapd detenido)
slapindex

# Generar hash de contraseña
slappasswd -h {SSHA}

# Verificar configuración
slaptest -f /etc/ldap/slapd.conf

# Convertir slapd.conf a OLC
slaptest -f /etc/ldap/slapd.conf -F /etc/ldap/slapd.d

# Modificar OLC vía LDAP
ldapmodify -Y EXTERNAL -H ldapi:/// -f cambios.ldif
```

## Correspondencia slapd.conf vs OLC

| slapd.conf | OLC (cn=config) |
|------------|-----------------|
| `suffix` | `olcSuffix` |
| `rootdn` | `olcRootDN` |
| `rootpw` | `olcRootPW` |
| `directory` | `olcDbDirectory` |
| `database` | `olcDatabase` |
| `index` | `olcDbIndex` |
| `access` | `olcAccess` |
| `loglevel` | `olcLogLevel` |

## Backends de base de datos

| Backend | Estado | Descripción |
|---------|--------|-------------|
| `mdb` | Recomendado | Memory-Mapped DB, rápido y fiable |
| `hdb` | Obsoleto | Hierarchical DB (BerkeleyDB) |
| `bdb` | Obsoleto | Berkeley DB |
| `ldif` | Especial | Almacenamiento en archivos LDIF planos |

## Niveles de acceso en ACLs

| Nivel | Permisos acumulados |
|-------|-------------------|
| `none` | Sin acceso |
| `auth` | Solo autenticación |
| `compare` | auth + comparar |
| `search` | compare + buscar |
| `read` | search + leer |
| `write` | read + escribir |
| `manage` | Gestión total |

## Archivos y rutas clave

| Archivo/Ruta | Función |
|-------------|---------|
| `/etc/ldap/slapd.conf` | Configuración estática (Debian) |
| `/etc/openldap/slapd.conf` | Configuración estática (RHEL) |
| `/etc/ldap/slapd.d/` | Configuración OLC (Debian) |
| `/etc/openldap/slapd.d/` | Configuración OLC (RHEL) |
| `/var/lib/ldap/` | Base de datos del directorio |
| `/etc/ldap/schema/` | Esquemas disponibles |
| `/var/run/slapd/slapd.pid` | PID del demonio slapd |

## Overlays frecuentes

| Overlay | Función |
|---------|---------|
| `syncprov` | Proveedor de replicación SyncRepl |
| `memberof` | Membresía inversa automática |
| `ppolicy` | Políticas de contraseña |
| `refint` | Integridad referencial |
| `auditlog` | Auditoría de cambios |
