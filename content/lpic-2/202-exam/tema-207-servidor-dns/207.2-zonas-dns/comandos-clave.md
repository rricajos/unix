---
title: "207.2 - Zonas DNS"
tags: [lpic-2, examen-202, tema-207, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "207"
subtema: "207.2"
---

# 207.2 - Comandos clave: Zonas DNS

## Tipos de registros DNS

| Registro | Descripcion | Ejemplo |
|----------|-------------|---------|
| `SOA` | Start of Authority - parametros de la zona | `@ IN SOA ns1.ejemplo.com. admin.ejemplo.com. (...)` |
| `A` | Direccion IPv4 | `www IN A 93.184.216.34` |
| `AAAA` | Direccion IPv6 | `www IN AAAA 2001:db8::1` |
| `CNAME` | Alias (nombre canonico) | `ftp IN CNAME www.ejemplo.com.` |
| `MX` | Servidor de correo (con prioridad) | `@ IN MX 10 mail.ejemplo.com.` |
| `NS` | Servidor de nombres autoritativo | `@ IN NS ns1.ejemplo.com.` |
| `PTR` | Resolucion inversa (IP a nombre) | `100 IN PTR servidor.ejemplo.com.` |
| `TXT` | Texto libre (SPF, DKIM, verificaciones) | `@ IN TXT "v=spf1 mx -all"` |
| `SRV` | Ubicacion de servicio | `_sip._tcp IN SRV 10 0 5060 sip.ejemplo.com.` |

## Campos del registro SOA

| Campo | Descripcion | Formato recomendado |
|-------|-------------|---------------------|
| MNAME | Servidor DNS primario | `ns1.ejemplo.com.` |
| RNAME | Email del administrador (. en vez de @) | `admin.ejemplo.com.` |
| Serial | Numero de serie de la zona | `YYYYMMDDNN` (ej: `2024011501`) |
| Refresh | Intervalo de verificacion del esclavo | Segundos (ej: `3600` = 1h) |
| Retry | Reintento si refresh falla | Segundos (ej: `900` = 15min) |
| Expire | Caducidad de datos en esclavo sin contacto | Segundos (ej: `604800` = 7d) |
| Minimum | TTL para respuestas negativas | Segundos (ej: `86400` = 1d) |

## Directivas de archivo de zona

| Directiva | Descripcion | Ejemplo |
|-----------|-------------|---------|
| `$TTL` | TTL por defecto de los registros | `$TTL 86400` |
| `$ORIGIN` | Dominio base para nombres relativos | `$ORIGIN ejemplo.com.` |
| `@` | Sustituye el valor de $ORIGIN | `@ IN A 93.184.216.34` |

## Zonas inversas

| Red | Zona inversa | Dominio |
|-----|-------------|---------|
| `192.168.1.0/24` | `1.168.192.in-addr.arpa` | IPv4 |
| `10.0.0.0/8` | `10.in-addr.arpa` | IPv4 |
| `2001:db8:1::/48` | `1.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa` | IPv6 |

## Transferencias de zona

| Tipo | Descripcion | Comando de prueba |
|------|-------------|-------------------|
| AXFR | Transferencia completa de zona | `dig @ns1.ejemplo.com ejemplo.com AXFR` |
| IXFR | Transferencia incremental (solo cambios) | `dig @ns1.ejemplo.com ejemplo.com IXFR=SERIAL` |

## Directivas de named.conf para transferencias

| Directiva | Contexto | Descripcion |
|-----------|----------|-------------|
| `allow-transfer` | master | Servidores autorizados para transferencia |
| `also-notify` | master | Servidores adicionales a notificar |
| `notify yes` | master | Enviar notificaciones NOTIFY |
| `masters` | slave | Direcciones IP de los servidores maestros |

## Verificacion de zonas

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `named-checkzone ZONA ARCHIVO` | Verificar sintaxis de zona | `named-checkzone ejemplo.com db.ejemplo.com` |
| `named-checkzone ZONA_INV ARCHIVO` | Verificar zona inversa | `named-checkzone 1.168.192.in-addr.arpa db.192.168.1` |
| `named-checkconf` | Verificar configuracion named.conf | `named-checkconf` |
| `rndc reload ZONA` | Recargar una zona especifica | `rndc reload ejemplo.com` |

## Reglas importantes de formato

- Los FQDN deben terminar en punto (`.`): `www.ejemplo.com.`
- Los nombres sin punto se completan con `$ORIGIN`: `www` se convierte en `www.ejemplo.com.`
- Un CNAME no puede coexistir con otro registro del mismo nombre
- La raiz de la zona (`@`) no puede tener un registro CNAME
- Los registros MX y NS no deben apuntar a un CNAME
- El serial del SOA debe incrementarse en cada modificacion de la zona
