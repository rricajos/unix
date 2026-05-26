---
title: "207.1 - Configuracion basica DNS"
tags: [lpic-2, examen-202, tema-207, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "207"
subtema: "207.1"
---

# 207.1 - Configuracion basica DNS

## Introduccion

El DNS (Domain Name System) es uno de los servicios mas criticos de Internet, encargado de traducir nombres de dominio a direcciones IP y viceversa. BIND (Berkeley Internet Name Domain) es la implementacion de servidor DNS mas utilizada en sistemas Linux.

Este subtema tiene un **peso de 3** en el examen LPIC-2 202 y cubre la instalacion, configuracion y administracion basica de un servidor BIND9.

## Conceptos fundamentales de DNS

### Jerarquia DNS

```
                    . (raiz)
                   / \
                com   org   net   es ...
               / \
          google  example
           /
         www
```

- **Servidor raiz**: Conoce las direcciones de los TLD (Top Level Domains)
- **Servidor TLD**: Conoce los servidores autoritativos de cada dominio
- **Servidor autoritativo**: Tiene la informacion real de un dominio
- **Servidor recursivo/cache**: Resuelve consultas en nombre de los clientes

### Tipos de consultas DNS

| Tipo | Descripcion |
|------|-------------|
| **Recursiva** | El servidor debe resolver completamente la consulta o devolver un error |
| **Iterativa** | El servidor devuelve la mejor respuesta que tiene o una referencia |
| **Inversa** | Traduce una IP a un nombre de dominio (PTR) |

## Instalacion de BIND9

```bash
# En Debian/Ubuntu
sudo apt install bind9 bind9utils bind9-doc

# En RHEL/CentOS/Fedora
sudo dnf install bind bind-utils

# Verificar la version
named -v
```

### Archivos y directorios principales

| Ruta (Debian/Ubuntu) | Ruta (RHEL/CentOS) | Descripcion |
|----------------------|---------------------|-------------|
| `/etc/bind/named.conf` | `/etc/named.conf` | Archivo de configuracion principal |
| `/etc/bind/named.conf.options` | (incluido en named.conf) | Opciones globales |
| `/etc/bind/named.conf.local` | (incluido en named.conf) | Zonas locales |
| `/var/cache/bind/` | `/var/named/` | Archivos de zona |
| `/var/run/named/` | `/var/run/named/` | Archivos de ejecucion (PID) |

## Estructura de named.conf

El archivo `named.conf` tiene una estructura basada en bloques con la siguiente sintaxis:

```
bloque {
    sentencia;
    sentencia;
};
```

### Bloque options

Define las opciones globales del servidor:

```bash
options {
    # Directorio de trabajo para archivos de zona
    directory "/var/cache/bind";

    # Interfaces y puertos de escucha
    listen-on port 53 { 127.0.0.1; 192.168.1.10; };
    listen-on-v6 port 53 { ::1; };

    # Servidores DNS a los que reenviar consultas
    forwarders {
        8.8.8.8;
        8.8.4.4;
    };

    # Permitir consultas recursivas
    recursion yes;

    # Quien puede hacer consultas
    allow-query { localhost; 192.168.1.0/24; };

    # Quien puede hacer consultas recursivas
    allow-recursion { localhost; 192.168.1.0/24; };

    # Quien puede realizar transferencias de zona
    allow-transfer { none; };

    # Ocultar la version de BIND
    version "none";

    # DNSSEC
    dnssec-validation auto;

    # Directorio para cache de sesion
    pid-file "/run/named/named.pid";
};
```

> **Para el examen:** Conoce las directivas principales del bloque `options`, especialmente `forwarders`, `recursion`, `allow-query`, `allow-transfer` y `listen-on`.

### Bloque zone

Define las zonas DNS que gestiona el servidor:

```bash
# Zona directa maestra (autoritativa)
zone "ejemplo.com" IN {
    type master;
    file "db.ejemplo.com";
    allow-transfer { 192.168.1.11; };   # Servidores esclavos
    allow-update { none; };              # Actualizaciones dinamicas
    notify yes;                          # Notificar a esclavos
};

# Zona inversa maestra
zone "1.168.192.in-addr.arpa" IN {
    type master;
    file "db.192.168.1";
    allow-transfer { 192.168.1.11; };
};

# Zona esclava
zone "otrodominio.com" IN {
    type slave;
    file "slave/db.otrodominio.com";
    masters { 10.0.0.1; };
};

# Zona de reenvio
zone "externo.com" IN {
    type forward;
    forwarders { 10.0.0.53; };
    forward only;
};

# Zona hint (raiz)
zone "." IN {
    type hint;
    file "db.root";       # o named.ca / root.hints
};
```

### Tipos de zona

| Tipo | Descripcion |
|------|-------------|
| `master` | Servidor principal, contiene la copia original de los datos de zona |
| `slave` | Servidor secundario, obtiene datos del master via transferencia de zona |
| `hint` | Contiene la lista de servidores raiz DNS |
| `forward` | Reenvia todas las consultas de esta zona a otros servidores |
| `stub` | Similar a slave, pero solo copia los registros NS |

> **Para el examen:** Entiende la diferencia entre los tipos de zona. La zona `hint` es obligatoria para que el servidor pueda resolver consultas de forma recursiva comenzando desde la raiz.

### Bloque logging

Configura el registro de eventos:

```bash
logging {
    channel default_log {
        file "/var/log/named/default.log" versions 3 size 5m;
        severity info;
        print-time yes;
        print-severity yes;
        print-category yes;
    };

    channel query_log {
        file "/var/log/named/query.log" versions 5 size 10m;
        severity debug;
        print-time yes;
    };

    category default { default_log; };
    category queries { query_log; };
    category security { default_log; };
};
```

### Listas de control de acceso (ACL)

Las ACL permiten definir grupos de direcciones IP reutilizables:

```bash
# Definir ACLs
acl "red-interna" {
    192.168.1.0/24;
    192.168.2.0/24;
    10.0.0.0/8;
};

acl "servidores-dns" {
    192.168.1.10;
    192.168.1.11;
};

# Usar ACLs en la configuracion
options {
    allow-query { "red-interna"; localhost; };
    allow-recursion { "red-interna"; localhost; };
    allow-transfer { "servidores-dns"; };
};
```

#### ACLs predefinidas

| ACL | Descripcion |
|-----|-------------|
| `any` | Cualquier host |
| `none` | Ningun host |
| `localhost` | Las interfaces del servidor |
| `localnets` | Las redes directamente conectadas |

> **Para el examen:** Las ACLs deben definirse ANTES de ser referenciadas en la configuracion. Conoce las ACLs predefinidas, especialmente `any`, `none`, `localhost` y `localnets`.

## Forwarders y recursion

### Modos de reenvio

```bash
options {
    # Reenviar a estos servidores
    forwarders { 8.8.8.8; 1.1.1.1; };

    # forward only: solo usa forwarders, falla si no responden
    # forward first: intenta forwarders primero, luego resuelve por si mismo
    forward first;
};
```

| Modo | Comportamiento |
|------|---------------|
| `forward only` | Solo consulta a los forwarders, no resuelve por si mismo |
| `forward first` | Intenta los forwarders primero; si fallan, resuelve de forma recursiva |

### Servidor solo-cache (caching-only)

Un servidor que solo cachea consultas sin ser autoritativo para ninguna zona:

```bash
options {
    directory "/var/cache/bind";
    recursion yes;
    allow-query { 192.168.1.0/24; localhost; };
    forwarders { 8.8.8.8; 8.8.4.4; };
};

# Solo la zona hint es necesaria
zone "." {
    type hint;
    file "db.root";
};
```

## Herramientas de administracion

### rndc - Controlador remoto de BIND

```bash
# Recargar la configuracion completa
rndc reload

# Recargar una zona especifica
rndc reload ejemplo.com

# Vaciar la cache
rndc flush

# Ver el estado del servidor
rndc status

# Detener el servidor
rndc stop

# Activar/desactivar el registro de consultas
rndc querylog on
rndc querylog off

# Volcar la cache a un archivo
rndc dumpdb -cache

# Congelar una zona (para edicion manual)
rndc freeze ejemplo.com

# Descongelar una zona
rndc thaw ejemplo.com
```

La configuracion de rndc se encuentra en `/etc/bind/rndc.conf` o `/etc/rndc.conf`, y usa una clave compartida definida en `/etc/bind/rndc.key`.

### named-checkconf - Verificar configuracion

```bash
# Verificar la sintaxis de named.conf
named-checkconf

# Verificar un archivo de configuracion especifico
named-checkconf /etc/bind/named.conf

# Verificar con salida de las zonas
named-checkconf -z
```

### named-checkzone - Verificar archivos de zona

```bash
# Verificar una zona
named-checkzone ejemplo.com /var/cache/bind/db.ejemplo.com

# Verificar zona inversa
named-checkzone 1.168.192.in-addr.arpa /var/cache/bind/db.192.168.1
```

> **Para el examen:** Siempre ejecuta `named-checkconf` y `named-checkzone` antes de recargar BIND. Un error de sintaxis puede impedir que el servidor arranque.

## dig - Herramienta de diagnostico DNS

```bash
# Consulta basica
dig ejemplo.com

# Consultar un tipo de registro especifico
dig ejemplo.com MX
dig ejemplo.com NS
dig ejemplo.com AAAA

# Consultar un servidor DNS especifico
dig @192.168.1.10 ejemplo.com

# Consulta corta (solo la respuesta)
dig +short ejemplo.com

# Consulta inversa
dig -x 192.168.1.100

# Trazar la resolucion completa
dig +trace ejemplo.com

# Consultar la zona raiz
dig . NS

# Transferencia de zona (AXFR)
dig @ns1.ejemplo.com ejemplo.com AXFR

# Sin recursion (como haria un servidor autoritativo)
dig +norecurse ejemplo.com @192.168.1.10
```

### Interpretacion de la salida de dig

```
;; QUESTION SECTION:
;ejemplo.com.                   IN      A

;; ANSWER SECTION:
ejemplo.com.            3600    IN      A       93.184.216.34

;; AUTHORITY SECTION:
ejemplo.com.            86400   IN      NS      ns1.ejemplo.com.

;; Query time: 23 msec
;; SERVER: 192.168.1.10#53(192.168.1.10)
;; MSG SIZE  rcvd: 56
```

> **Para el examen:** `dig` es la herramienta principal de diagnostico DNS. Conoce las opciones `+short`, `+trace`, `-x` (inversa) y como especificar el servidor con `@servidor`.

## Gestion del servicio BIND

```bash
# Iniciar/detener/reiniciar con systemd
sudo systemctl start named       # RHEL/CentOS
sudo systemctl start bind9       # Debian/Ubuntu

sudo systemctl enable named
sudo systemctl status named

# Verificar que el puerto 53 esta en uso
ss -tlnp | grep :53
```
