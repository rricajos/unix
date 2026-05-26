---
title: "207.1 - Configuracion basica DNS"
tags: [lpic-2, examen-202, tema-207, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "207"
subtema: "207.1"
---

# 207.1 - Comandos clave: Configuracion basica DNS

## Archivos de configuracion principales

| Ruta | Descripcion |
|------|-------------|
| `/etc/named.conf` | Configuracion principal de BIND (RHEL/CentOS) |
| `/etc/bind/named.conf` | Configuracion principal de BIND (Debian/Ubuntu) |
| `/etc/bind/named.conf.options` | Opciones globales (Debian/Ubuntu) |
| `/etc/bind/named.conf.local` | Definicion de zonas locales (Debian/Ubuntu) |
| `/var/named/` | Directorio de archivos de zona (RHEL/CentOS) |
| `/var/cache/bind/` | Directorio de archivos de zona (Debian/Ubuntu) |
| `/etc/bind/rndc.key` | Clave de autenticacion para rndc |
| `/etc/bind/rndc.conf` | Configuracion de rndc |

## Bloques de named.conf

| Bloque | Descripcion | Ejemplo clave |
|--------|-------------|---------------|
| `options { }` | Opciones globales del servidor | `directory`, `forwarders`, `recursion` |
| `zone "name" { }` | Definicion de una zona DNS | `type master; file "db.ejemplo.com";` |
| `logging { }` | Configuracion de registros | `channel`, `category` |
| `acl "name" { }` | Lista de control de acceso | `acl "interna" { 192.168.0.0/16; };` |

## Directivas clave del bloque options

| Directiva | Descripcion | Ejemplo |
|-----------|-------------|---------|
| `directory` | Directorio de trabajo | `directory "/var/cache/bind";` |
| `listen-on` | Interfaces de escucha | `listen-on { 127.0.0.1; 192.168.1.10; };` |
| `forwarders` | Servidores DNS para reenvio | `forwarders { 8.8.8.8; 1.1.1.1; };` |
| `forward` | Modo de reenvio | `forward first;` o `forward only;` |
| `recursion` | Habilitar recursion | `recursion yes;` |
| `allow-query` | Quien puede consultar | `allow-query { 192.168.1.0/24; };` |
| `allow-recursion` | Quien puede usar recursion | `allow-recursion { localnets; };` |
| `allow-transfer` | Quien puede transferir zonas | `allow-transfer { 192.168.1.11; };` |
| `version` | Version mostrada en consultas | `version "none";` |
| `dnssec-validation` | Validacion DNSSEC | `dnssec-validation auto;` |

## Tipos de zona

| Tipo | Descripcion |
|------|-------------|
| `master` | Zona autoritativa primaria |
| `slave` | Zona secundaria (replica del master) |
| `hint` | Servidores raiz DNS |
| `forward` | Reenvia consultas a otros servidores |
| `stub` | Solo copia registros NS del master |

## Herramientas de administracion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `rndc reload` | Recargar configuracion y zonas | `rndc reload` |
| `rndc reload ZONA` | Recargar una zona especifica | `rndc reload ejemplo.com` |
| `rndc flush` | Vaciar la cache DNS | `rndc flush` |
| `rndc status` | Ver estado del servidor | `rndc status` |
| `rndc querylog on/off` | Activar/desactivar log de consultas | `rndc querylog on` |
| `rndc dumpdb -cache` | Volcar cache a archivo | `rndc dumpdb -cache` |
| `rndc freeze ZONA` | Congelar zona para edicion | `rndc freeze ejemplo.com` |
| `rndc thaw ZONA` | Descongelar zona | `rndc thaw ejemplo.com` |
| `named-checkconf` | Verificar sintaxis de named.conf | `named-checkconf` |
| `named-checkconf -z` | Verificar con lista de zonas | `named-checkconf -z` |
| `named-checkzone` | Verificar archivo de zona | `named-checkzone ejemplo.com db.ejemplo.com` |

## dig - Diagnostico DNS

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `dig DOMINIO` | Consulta DNS basica (registro A) | `dig ejemplo.com` |
| `dig DOMINIO TIPO` | Consultar tipo de registro especifico | `dig ejemplo.com MX` |
| `dig @SERVIDOR DOMINIO` | Consultar un servidor especifico | `dig @8.8.8.8 ejemplo.com` |
| `dig +short DOMINIO` | Salida resumida | `dig +short ejemplo.com` |
| `dig -x IP` | Consulta inversa (PTR) | `dig -x 192.168.1.100` |
| `dig +trace DOMINIO` | Trazar la resolucion completa | `dig +trace ejemplo.com` |
| `dig DOMINIO AXFR` | Solicitar transferencia de zona | `dig @ns1.ejemplo.com ejemplo.com AXFR` |
| `dig +norecurse DOMINIO` | Consulta sin recursion | `dig +norecurse ejemplo.com` |

## ACLs predefinidas

| ACL | Descripcion |
|-----|-------------|
| `any` | Cualquier host |
| `none` | Ningun host |
| `localhost` | Interfaces del propio servidor |
| `localnets` | Redes directamente conectadas |
