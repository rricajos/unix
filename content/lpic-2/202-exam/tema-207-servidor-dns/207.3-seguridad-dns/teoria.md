---
title: "207.3 - Seguridad DNS"
tags: [lpic-2, examen-202, tema-207, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "207"
subtema: "207.3"
---

# 207.3 - Seguridad DNS

## Introduccion

El sistema DNS fue disenado originalmente sin mecanismos de seguridad, lo que lo hace vulnerable a diversos ataques como envenenamiento de cache, suplantacion de respuestas y espionaje. Este subtema cubre las principales tecnologias y tecnicas para asegurar un servidor DNS.

Este subtema tiene un **peso de 2** en el examen LPIC-2 202.

## DNSSEC (DNS Security Extensions)

DNSSEC anade autenticacion e integridad a las respuestas DNS mediante firmas criptograficas. No proporciona cifrado (confidencialidad), sino que permite verificar que la respuesta DNS no ha sido modificada y proviene de una fuente legitima.

### Conceptos fundamentales de DNSSEC

| Concepto | Descripcion |
|----------|-------------|
| **Cadena de confianza** | Cada zona firma sus datos y la zona padre valida la clave de la zona hija |
| **Firma digital** | Los registros se firman con una clave privada; se verifican con la clave publica |
| **Anclaje de confianza** | Clave publica de la zona raiz, preconfigurada en los resolvers |

### Tipos de claves DNSSEC

#### KSK (Key Signing Key)

- Clave de firma de claves
- Firma el conjunto de registros DNSKEY de la zona
- Se usa para establecer la cadena de confianza con la zona padre
- Generalmente mas larga (2048-4096 bits RSA) y se rota con menos frecuencia
- Su hash se publica como registro DS en la zona padre

#### ZSK (Zone Signing Key)

- Clave de firma de zona
- Firma todos los demas registros de la zona
- Se rota con mayor frecuencia (mensual o trimestralmente)
- Generalmente mas corta (1024-2048 bits RSA) para mayor eficiencia

```bash
# Generar KSK
dnssec-keygen -a RSASHA256 -b 2048 -n ZONE -f KSK ejemplo.com

# Generar ZSK
dnssec-keygen -a RSASHA256 -b 1024 -n ZONE ejemplo.com

# Firmar la zona
dnssec-signzone -A -3 $(head -c 1000 /dev/urandom | sha1sum | cut -b 1-16) \
    -N INCREMENT -o ejemplo.com -t db.ejemplo.com
```

> **Para el examen:** Conoce la diferencia entre KSK y ZSK. La KSK firma las claves (DNSKEY), la ZSK firma los registros de datos. La KSK se vincula con la zona padre mediante el registro DS.

### Tipos de registros DNSSEC

#### DNSKEY

Contiene la clave publica usada para verificar firmas:

```
ejemplo.com.  IN  DNSKEY  256 3 8 AwEAAb...  ; ZSK (flag 256)
ejemplo.com.  IN  DNSKEY  257 3 8 AwEAAc...  ; KSK (flag 257)
```

| Flag | Tipo de clave |
|------|---------------|
| 256 | ZSK (Zone Signing Key) |
| 257 | KSK (Key Signing Key) |

#### RRSIG (Resource Record Signature)

Contiene la firma digital de un conjunto de registros:

```
www.ejemplo.com. IN RRSIG A 8 3 86400 (
    20240215000000 20240115000000 12345
    ejemplo.com.
    base64encodedSignature... )
```

Campos principales:
- Tipo de registro firmado (A)
- Algoritmo de firma (8 = RSASHA256)
- Numero de etiquetas en el nombre del propietario
- TTL original
- Fecha de expiracion y fecha de firma
- Key tag del DNSKEY usado
- Nombre del firmante
- Firma codificada en base64

#### DS (Delegation Signer)

Publicado en la zona padre, vincula la KSK de la zona hija:

```
; En la zona padre (.com)
ejemplo.com.  IN  DS  12345 8 2 aabbccdd...
```

Campos: key tag, algoritmo, tipo de digest, hash del DNSKEY (KSK).

#### NSEC y NSEC3 (Next Secure)

Proporcionan negacion de existencia autenticada (prueban que un registro NO existe):

**NSEC**: Enumera el siguiente nombre existente en la zona, lo que permite "caminar" la zona completa (zone walking).

```
alfa.ejemplo.com.  IN  NSEC  beta.ejemplo.com.  A RRSIG NSEC
```

**NSEC3**: Version mejorada que usa hashes en lugar de nombres reales, impidiendo la enumeracion de la zona:

```
; Usa hashes salteados de los nombres
ABC123.ejemplo.com.  IN  NSEC3  1 0 10 AABB (
    DEF456 A RRSIG )
```

> **Para el examen:** NSEC permite zone walking (enumeracion). NSEC3 soluciona este problema usando hashes. Ambos prueban la no existencia de un registro de forma autenticada.

### Cadena de confianza DNSSEC

```
Zona raiz (.)
  |-- Contiene DS de .com
  |
Zona .com
  |-- Contiene DS de ejemplo.com
  |
Zona ejemplo.com
  |-- KSK firma DNSKEY
  |-- ZSK firma registros (A, MX, NS, etc.)
```

### Configuracion de DNSSEC en BIND (validacion)

```bash
# En named.conf (opciones del resolver)
options {
    dnssec-validation auto;
    # 'auto' usa las claves de la zona raiz incluidas con BIND
    # 'yes' requiere configurar manualmente las trusted-keys
};
```

### Verificacion con dig

```bash
# Consulta con DNSSEC habilitado
dig +dnssec ejemplo.com A

# Verificar la cadena de confianza
dig +sigchase +trusted-key=/etc/bind/trusted-keys ejemplo.com A

# Consultar registros DNSKEY
dig ejemplo.com DNSKEY

# Consultar registros DS
dig ejemplo.com DS

# Verificar flag AD (Authenticated Data) en la respuesta
dig +dnssec ejemplo.com A | grep "flags:"
# flags: qr rd ra ad;   <-- "ad" indica que DNSSEC fue validado
```

> **Para el examen:** El flag `ad` (Authenticated Data) en la respuesta de dig indica que la respuesta fue verificada con DNSSEC. `dnssec-validation auto` es la configuracion recomendada.

## TSIG (Transaction Signatures)

TSIG proporciona autenticacion para transacciones DNS usando claves simetricas compartidas (HMAC). Se usa principalmente para:

- Autenticar transferencias de zona entre maestro y esclavo
- Autenticar actualizaciones dinamicas DNS
- Autenticar comunicaciones rndc

### Configuracion de TSIG

```bash
# 1. Generar una clave TSIG
tsig-keygen -a hmac-sha256 transferencia-clave > /etc/bind/tsig.key

# El archivo generado contiene:
# key "transferencia-clave" {
#     algorithm hmac-sha256;
#     secret "base64EncodedSecret==";
# };
```

```bash
# 2. Configurar en el servidor maestro (named.conf)
include "/etc/bind/tsig.key";

server 192.168.1.11 {
    keys { transferencia-clave; };
};

zone "ejemplo.com" IN {
    type master;
    file "db.ejemplo.com";
    allow-transfer { key transferencia-clave; };
};
```

```bash
# 3. Configurar en el servidor esclavo (named.conf)
include "/etc/bind/tsig.key";

server 192.168.1.10 {
    keys { transferencia-clave; };
};

zone "ejemplo.com" IN {
    type slave;
    file "slave/db.ejemplo.com";
    masters { 192.168.1.10; };
};
```

```bash
# 4. Probar transferencia autenticada con dig
dig @192.168.1.10 ejemplo.com AXFR -k /etc/bind/tsig.key
```

> **Para el examen:** TSIG usa criptografia simetrica (clave compartida) para autenticar transacciones DNS. Es el metodo recomendado para asegurar transferencias de zona y comunicaciones rndc. La misma clave debe estar en ambos servidores.

## BIND en chroot

Ejecutar BIND en un entorno chroot limita el acceso del proceso `named` a un directorio restringido, reduciendo el impacto de una posible vulnerabilidad.

### Configuracion de chroot

```bash
# En RHEL/CentOS, instalar el paquete chroot
sudo dnf install bind-chroot

# El directorio chroot tipico es /var/named/chroot
# La estructura interna replica los directorios necesarios:
# /var/named/chroot/
#   |-- etc/
#   |   |-- named.conf
#   |   |-- named/
#   |-- var/
#   |   |-- named/
#   |   |   |-- (archivos de zona)
#   |   |-- run/
#   |       |-- named/
#   |-- dev/
#       |-- null
#       |-- random
#       |-- urandom
```

```bash
# Verificar que BIND se ejecuta en chroot
ps aux | grep named
# named ... -t /var/named/chroot

# Iniciar el servicio chroot
sudo systemctl enable named-chroot
sudo systemctl start named-chroot
```

En Debian/Ubuntu, el chroot se configura manualmente editando las opciones de inicio del servicio:

```bash
# En /etc/default/named (o /etc/default/bind9)
OPTIONS="-u bind -t /var/lib/named"
```

> **Para el examen:** El chroot confina BIND en un directorio aislado. Si el servicio es comprometido, el atacante solo tiene acceso a los archivos dentro del chroot. La opcion `-t` de `named` especifica el directorio chroot.

## Restriccion de consultas y transferencias

### Restringir quien puede consultar

```bash
options {
    # Solo la red interna puede hacer consultas
    allow-query { 192.168.0.0/16; localhost; };

    # Solo la red interna puede usar recursion
    allow-recursion { 192.168.0.0/16; localhost; };

    # Deshabilitar recursion para el publico
    # (servidor solo autoritativo)
    recursion no;
};
```

### Restringir transferencias de zona

```bash
# Global: deshabilitar transferencias por defecto
options {
    allow-transfer { none; };
};

# Por zona: permitir solo a esclavos especificos
zone "ejemplo.com" IN {
    type master;
    file "db.ejemplo.com";
    allow-transfer { 192.168.1.11; key transferencia-clave; };
};
```

### Limitar actualizaciones dinamicas

```bash
zone "ejemplo.com" IN {
    type master;
    file "db.ejemplo.com";
    # Solo permitir actualizaciones desde un servidor DHCP especifico
    allow-update { 192.168.1.5; };
    # O usar TSIG para autenticacion
    allow-update { key dhcp-dns-key; };
};
```

## Rate Limiting (Limitacion de tasa)

La limitacion de tasa protege contra ataques de amplificacion DNS y denegacion de servicio:

```bash
options {
    # Limitar la tasa de respuestas
    rate-limit {
        responses-per-second 10;
        window 5;
        slip 2;
        # Limitar respuestas NXDOMAIN
        nxdomains-per-second 5;
        # Limitar errores
        errors-per-second 5;
    };
};
```

| Parametro | Descripcion |
|-----------|-------------|
| `responses-per-second` | Maximo de respuestas identicas por segundo |
| `window` | Ventana de tiempo en segundos |
| `slip` | Cada N respuestas limitadas, enviar una truncada (TC) |
| `nxdomains-per-second` | Limite de respuestas NXDOMAIN por segundo |
| `errors-per-second` | Limite de respuestas de error por segundo |

> **Para el examen:** Rate limiting mitiga ataques de amplificacion DNS. El parametro `slip` permite que algunos clientes legitimos reciban una respuesta truncada (TC), forzandolos a reintentar por TCP.

## DNS sobre TLS y HTTPS (conceptos)

### DNS over TLS (DoT)

- Cifra las consultas DNS usando TLS (puerto 853)
- Protege la privacidad del usuario al cifrar la comunicacion con el resolver
- Definido en RFC 7858
- Soportado por resolvers como Unbound y Knot Resolver

### DNS over HTTPS (DoH)

- Encapsula consultas DNS dentro de HTTPS (puerto 443)
- Mas dificil de bloquear ya que usa el mismo puerto que el trafico web
- Definido en RFC 8484
- Soportado por navegadores como Firefox y Chrome

> **Para el examen:** DoT y DoH proporcionan confidencialidad (cifrado) para las consultas DNS. DNSSEC proporciona autenticacion e integridad. Son complementarios, no sustitutos.

## Split DNS (DNS dividido)

Split DNS presenta diferentes respuestas segun el origen de la consulta (red interna vs. externa):

```bash
# Definir vistas (views) en named.conf
acl "interna" { 192.168.0.0/16; 10.0.0.0/8; localhost; };

view "interna" {
    match-clients { "interna"; };
    recursion yes;

    zone "ejemplo.com" IN {
        type master;
        file "db.ejemplo.com.interna";
    };
};

view "externa" {
    match-clients { any; };
    recursion no;

    zone "ejemplo.com" IN {
        type master;
        file "db.ejemplo.com.externa";
    };
};
```

### Uso de split DNS

- **Vista interna**: Contiene IPs privadas, servidores internos, permite recursion
- **Vista externa**: Contiene solo IPs publicas, servicios publicos, sin recursion

**Reglas importantes para views:**
- Las vistas se evaluan en orden; la primera que coincide es la que se usa
- TODAS las zonas deben estar dentro de una view si se usan views
- La zona hint (raiz) debe incluirse en cada view que necesite recursion

> **Para el examen:** Split DNS usa `view` en BIND para servir diferentes respuestas segun el cliente. Las vistas se evaluan en orden. Es una practica comun para separar la resolucion interna de la externa.

## Resumen de tecnologias de seguridad DNS

| Tecnologia | Proteccion | Mecanismo |
|------------|-----------|-----------|
| **DNSSEC** | Integridad y autenticacion | Firmas criptograficas de registros |
| **TSIG** | Autenticacion de transacciones | Clave simetrica compartida (HMAC) |
| **Chroot** | Aislamiento del proceso | Confinamiento en directorio restringido |
| **ACLs** | Control de acceso | Listas de direcciones permitidas |
| **Rate limiting** | Anti-DDoS/amplificacion | Limitacion de respuestas por segundo |
| **DoT/DoH** | Confidencialidad | Cifrado TLS/HTTPS de consultas |
| **Split DNS** | Separacion interna/externa | Vistas (views) segun origen |

## Buenas practicas de seguridad DNS

- **Ocultar la version** de BIND: `version "none";`
- **Deshabilitar recursion** en servidores autoritativos publicos
- **Restringir transferencias** de zona solo a esclavos autorizados
- **Usar TSIG** para todas las transferencias de zona
- **Habilitar DNSSEC** validation en todos los resolvers
- **Ejecutar BIND en chroot** para limitar el impacto de vulnerabilidades
- **Implementar rate limiting** para mitigar ataques de amplificacion
- **Usar split DNS** para separar vistas internas y externas
- **Mantener BIND actualizado** con los ultimos parches de seguridad
