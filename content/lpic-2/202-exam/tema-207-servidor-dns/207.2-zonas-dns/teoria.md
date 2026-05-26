---
title: "207.2 - Zonas DNS"
tags: [lpic-2, examen-202, tema-207, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "207"
subtema: "207.2"
---

# 207.2 - Zonas DNS

## Introduccion

Las zonas DNS contienen la informacion real sobre los dominios: que direcciones IP corresponden a que nombres, donde se entregan los correos, cuales son los servidores de nombres autoritativos, etc. Comprender el formato de los archivos de zona y los diferentes tipos de registros es fundamental para administrar un servidor DNS.

Este subtema tiene un **peso de 3** en el examen LPIC-2 202.

## Formato de un archivo de zona

Un archivo de zona tipico tiene la siguiente estructura:

```
$TTL 86400
$ORIGIN ejemplo.com.
@   IN  SOA   ns1.ejemplo.com. admin.ejemplo.com. (
                2024011501  ; Serial
                3600        ; Refresh (1 hora)
                900         ; Retry (15 minutos)
                604800      ; Expire (1 semana)
                86400       ; Minimum TTL (1 dia)
            )

; Servidores de nombres
@       IN  NS      ns1.ejemplo.com.
@       IN  NS      ns2.ejemplo.com.

; Registros de direccion
@       IN  A       93.184.216.34
ns1     IN  A       192.168.1.10
ns2     IN  A       192.168.1.11
www     IN  A       93.184.216.34
mail    IN  A       192.168.1.20
ftp     IN  CNAME   www.ejemplo.com.

; Registros de correo
@       IN  MX  10  mail.ejemplo.com.
@       IN  MX  20  mail2.ejemplo.com.

; Registros de texto
@       IN  TXT     "v=spf1 mx -all"
```

### Directivas especiales

| Directiva | Descripcion |
|-----------|-------------|
| `$TTL` | TTL por defecto para los registros de la zona |
| `$ORIGIN` | Dominio base (se anade a nombres no terminados en punto) |
| `@` | Sustitucion del valor de `$ORIGIN` (o el nombre de la zona) |

> **Para el examen:** Los nombres que terminan en un punto (`.`) son FQDN (nombres completos). Los que no terminan en punto se completan con el valor de `$ORIGIN`. Ejemplo: `www` se convierte en `www.ejemplo.com.` si `$ORIGIN` es `ejemplo.com.`.

## Registro SOA (Start of Authority)

El registro SOA es obligatorio en cada archivo de zona y define parametros fundamentales:

```
@   IN  SOA   ns1.ejemplo.com. admin.ejemplo.com. (
                2024011501  ; Serial
                3600        ; Refresh
                900         ; Retry
                604800      ; Expire
                86400       ; Negative TTL / Minimum
            )
```

### Campos del registro SOA

| Campo | Descripcion | Valor tipico |
|-------|-------------|--------------|
| **MNAME** | Servidor DNS primario de la zona | `ns1.ejemplo.com.` |
| **RNAME** | Email del administrador (@ se reemplaza por .) | `admin.ejemplo.com.` = admin@ejemplo.com |
| **Serial** | Numero de serie, debe incrementarse en cada cambio | `2024011501` (formato YYYYMMDDNN) |
| **Refresh** | Intervalo en que el esclavo verifica cambios en el maestro | `3600` (1 hora) |
| **Retry** | Tiempo antes de reintentar si el refresh falla | `900` (15 minutos) |
| **Expire** | Tiempo maximo que un esclavo sirve datos sin contactar al maestro | `604800` (1 semana) |
| **Minimum** | TTL para respuestas negativas (NXDOMAIN) | `86400` (1 dia) |

> **Para el examen:** El formato recomendado para el serial es `YYYYMMDDNN` (ano, mes, dia, numero de revision). El serial DEBE incrementarse en cada cambio para que los servidores esclavos detecten la actualizacion. El campo RNAME usa `.` en lugar de `@` para el email.

## Tipos de registros DNS

### Registro A (Address)

Asocia un nombre de host con una direccion IPv4:

```
www         IN  A   93.184.216.34
servidor1   IN  A   192.168.1.100
```

### Registro AAAA (IPv6 Address)

Asocia un nombre de host con una direccion IPv6:

```
www     IN  AAAA    2001:db8::1
mail    IN  AAAA    2001:db8::25
```

### Registro CNAME (Canonical Name)

Crea un alias que apunta a otro nombre (nombre canonico):

```
ftp     IN  CNAME   www.ejemplo.com.
webmail IN  CNAME   mail.ejemplo.com.
```

**Restricciones importantes del CNAME:**
- Un CNAME no puede coexistir con otros registros del mismo nombre
- La raiz de la zona (`@`) no puede tener un registro CNAME
- Un registro MX o NS no debe apuntar a un CNAME

> **Para el examen:** Recuerda que un CNAME no puede coexistir con ningun otro tipo de registro para el mismo nombre. No se puede poner un CNAME en el apex (raiz) de la zona.

### Registro MX (Mail Exchanger)

Define los servidores de correo para el dominio, con prioridad:

```
@   IN  MX  10  mail.ejemplo.com.
@   IN  MX  20  mail-backup.ejemplo.com.
@   IN  MX  30  mail-externo.ejemplo.com.
```

El numero (10, 20, 30) es la prioridad: **valores mas bajos tienen mayor prioridad**. El correo se intenta entregar primero al servidor con prioridad 10.

### Registro NS (Name Server)

Define los servidores de nombres autoritativos para la zona:

```
@   IN  NS  ns1.ejemplo.com.
@   IN  NS  ns2.ejemplo.com.
```

Los registros NS tambien se usan para delegar subdominios:

```
; Delegar subdominio a otros servidores DNS
subdominio  IN  NS  ns1.subdominio.ejemplo.com.
subdominio  IN  NS  ns2.subdominio.ejemplo.com.

; Glue records (necesarios si el NS esta dentro del subdominio delegado)
ns1.subdominio  IN  A   10.0.1.1
ns2.subdominio  IN  A   10.0.1.2
```

### Registro PTR (Pointer)

Utilizado en zonas inversas para asociar una IP con un nombre:

```
; En la zona 1.168.192.in-addr.arpa
100     IN  PTR     servidor1.ejemplo.com.
10      IN  PTR     ns1.ejemplo.com.
20      IN  PTR     mail.ejemplo.com.
```

### Registro TXT (Text)

Almacena texto arbitrario, frecuentemente usado para SPF, DKIM y verificaciones:

```
@       IN  TXT     "v=spf1 mx ip4:93.184.216.0/24 -all"
_dmarc  IN  TXT     "v=DMARC1; p=reject; rua=mailto:dmarc@ejemplo.com"
```

### Registro SRV (Service)

Define la ubicacion de servicios especificos:

```
; Formato: _servicio._protocolo.nombre TTL IN SRV prioridad peso puerto destino
_sip._tcp.ejemplo.com.  IN  SRV  10 60 5060 sipserver.ejemplo.com.
_ldap._tcp.ejemplo.com. IN  SRV  10 0  389  ldap.ejemplo.com.
_xmpp._tcp.ejemplo.com. IN  SRV  5  0  5222 xmpp.ejemplo.com.
```

| Campo | Descripcion |
|-------|-------------|
| Prioridad | Menor valor = mayor prioridad (como MX) |
| Peso | Distribucion de carga entre servidores con misma prioridad |
| Puerto | Puerto TCP/UDP del servicio |
| Destino | Nombre del servidor que ofrece el servicio |

> **Para el examen:** Conoce el formato del registro SRV: `_servicio._protocolo` con prioridad, peso, puerto y destino. Es comun en servicios como SIP, LDAP, XMPP.

## Zonas inversas

Las zonas inversas permiten resolver direcciones IP a nombres de host (registros PTR).

### Zona inversa IPv4 (in-addr.arpa)

Para la red `192.168.1.0/24`, la zona inversa es `1.168.192.in-addr.arpa`:

```
; Definicion de la zona en named.conf
zone "1.168.192.in-addr.arpa" IN {
    type master;
    file "db.192.168.1";
};
```

Archivo de zona inversa:

```
$TTL 86400
@   IN  SOA     ns1.ejemplo.com. admin.ejemplo.com. (
                    2024011501
                    3600
                    900
                    604800
                    86400
                )

@       IN  NS      ns1.ejemplo.com.
@       IN  NS      ns2.ejemplo.com.

10      IN  PTR     ns1.ejemplo.com.
11      IN  PTR     ns2.ejemplo.com.
20      IN  PTR     mail.ejemplo.com.
100     IN  PTR     servidor1.ejemplo.com.
200     IN  PTR     www.ejemplo.com.
```

> **Para el examen:** La zona inversa se escribe con los octetos de la red en orden INVERSO seguidos de `.in-addr.arpa`. Para `192.168.1.0/24` la zona es `1.168.192.in-addr.arpa`.

### Zona inversa IPv6 (ip6.arpa)

Para IPv6, se usa el dominio `ip6.arpa` con cada nibble (digito hexadecimal) separado:

```
; Para la red 2001:db8:1::/48
; La zona inversa seria: 1.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa

zone "1.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa" IN {
    type master;
    file "db.2001.db8.1";
};
```

```
; Archivo de zona inversa IPv6
$TTL 86400
@   IN  SOA     ns1.ejemplo.com. admin.ejemplo.com. (
                    2024011501 3600 900 604800 86400
                )

@   IN  NS  ns1.ejemplo.com.

; Para la IP 2001:db8:1::100
0.0.1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0   IN  PTR  servidor.ejemplo.com.
```

## Transferencias de zona

### AXFR (Transferencia completa)

Transfiere la zona completa del maestro al esclavo:

```bash
# Solicitar transferencia AXFR
dig @ns1.ejemplo.com ejemplo.com AXFR
```

### IXFR (Transferencia incremental)

Transfiere solo los cambios desde un determinado serial:

```bash
# Solicitar transferencia incremental
dig @ns1.ejemplo.com ejemplo.com IXFR=2024011500
```

### Configuracion de zona esclava

```bash
# En el servidor maestro (named.conf)
zone "ejemplo.com" IN {
    type master;
    file "db.ejemplo.com";
    allow-transfer { 192.168.1.11; };
    also-notify { 192.168.1.11; };
    notify yes;
};

# En el servidor esclavo (named.conf)
zone "ejemplo.com" IN {
    type slave;
    file "slave/db.ejemplo.com";
    masters { 192.168.1.10; };
    allow-transfer { none; };
};
```

### Proceso de transferencia

1. El maestro envia una notificacion NOTIFY al esclavo
2. El esclavo consulta el SOA del maestro y compara el serial
3. Si el serial del maestro es mayor, el esclavo solicita una transferencia
4. Se intenta IXFR primero; si falla, se usa AXFR
5. El esclavo almacena los datos localmente

> **Para el examen:** `notify yes` en el maestro envia notificaciones automaticas a los esclavos cuando la zona cambia. `allow-transfer` debe restringirse solo a los servidores esclavos por seguridad.

## Ejemplo completo de zona

### Zona directa: ejemplo.com

```
$TTL 86400
$ORIGIN ejemplo.com.

@   IN  SOA     ns1.ejemplo.com. admin.ejemplo.com. (
                    2024011501  ; Serial
                    3600        ; Refresh (1h)
                    900         ; Retry (15min)
                    604800      ; Expire (7d)
                    86400       ; Minimum TTL (1d)
                )

; Servidores de nombres
            IN  NS      ns1.ejemplo.com.
            IN  NS      ns2.ejemplo.com.

; Servidores de correo
            IN  MX  10  mail.ejemplo.com.
            IN  MX  20  mail2.ejemplo.com.

; Registros A
            IN  A       93.184.216.34
ns1         IN  A       192.168.1.10
ns2         IN  A       192.168.1.11
mail        IN  A       192.168.1.20
mail2       IN  A       192.168.1.21
www         IN  A       93.184.216.34
intranet    IN  A       192.168.1.50

; Registros AAAA
www         IN  AAAA    2001:db8::1

; Alias
ftp         IN  CNAME   www.ejemplo.com.
webmail     IN  CNAME   mail.ejemplo.com.

; Registros TXT
            IN  TXT     "v=spf1 mx ip4:192.168.1.0/24 -all"

; Registros SRV
_sip._tcp   IN  SRV     10 0 5060 sip.ejemplo.com.

; Delegacion de subdominio
dev         IN  NS      ns1.dev.ejemplo.com.
ns1.dev     IN  A       10.0.2.10
```

## Verificacion de archivos de zona

```bash
# Verificar sintaxis del archivo de zona
named-checkzone ejemplo.com /var/cache/bind/db.ejemplo.com

# Verificar zona inversa
named-checkzone 1.168.192.in-addr.arpa /var/cache/bind/db.192.168.1

# Salida esperada para zona valida:
# zone ejemplo.com/IN: loaded serial 2024011501
# OK
```

## Resolucion de problemas comunes

| Problema | Causa probable | Solucion |
|----------|---------------|----------|
| El esclavo no actualiza | Serial no incrementado | Incrementar el serial en el SOA del maestro |
| Registro no resuelve | Falta punto final en FQDN | Agregar `.` al final del nombre completo |
| CNAME da error | CNAME coexiste con otro registro | Eliminar registros conflictivos |
| PTR no funciona | Zona inversa mal configurada | Verificar el orden inverso de los octetos |
| Delegacion falla | Faltan glue records | Agregar registros A para los NS delegados |
