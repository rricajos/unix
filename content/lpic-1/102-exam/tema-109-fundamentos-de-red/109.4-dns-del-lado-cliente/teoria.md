---
title: "109.4 Configurar DNS en el lado cliente - Teoria"
tags:
  - lpic-1
  - examen-102
  - tema-109
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "102"
tema: "109"
subtema: "109.4"
---

# 109.4 Configurar DNS en el lado cliente - Teoria

## Fundamentos de DNS

### ¿Que es DNS?
DNS (Domain Name System) traduce nombres de dominio legibles (www.ejemplo.com) a direcciones IP (93.184.216.34). Funciona como una "guia telefonica" de Internet.

### Tipos de registros DNS
| Tipo | Descripcion | Ejemplo |
|------|-------------|---------|
| **A** | Direccion IPv4 | www.ejemplo.com -> 93.184.216.34 |
| **AAAA** | Direccion IPv6 | www.ejemplo.com -> 2606:2800:220:1:248:... |
| **MX** | Servidor de correo | ejemplo.com -> mail.ejemplo.com (prioridad 10) |
| **NS** | Servidor de nombres | ejemplo.com -> ns1.ejemplo.com |
| **CNAME** | Alias (nombre canonico) | www.ejemplo.com -> ejemplo.com |
| **PTR** | Resolucion inversa (IP->nombre) | 34.216.184.93 -> www.ejemplo.com |
| **SOA** | Inicio de autoridad | Informacion de la zona |
| **TXT** | Texto libre | SPF, DKIM, verificacion |

---

## Archivos de configuracion del cliente DNS

### `/etc/resolv.conf`
Archivo principal de configuracion DNS del cliente.

```
# Servidores DNS (maximo 3)
nameserver 192.168.1.1
nameserver 8.8.8.8
nameserver 8.8.4.4

# Dominio local
domain ejemplo.com

# Lista de dominios de busqueda
search ejemplo.com red-interna.ejemplo.com

# Opciones
options timeout:2 attempts:3 rotate
```

| Directiva | Descripcion |
|-----------|-------------|
| `nameserver` | IP del servidor DNS (maximo 3) |
| `domain` | Dominio local (se agrega automaticamente a nombres sin punto) |
| `search` | Lista de dominios de busqueda (alternativa a domain) |
| `options` | timeout, attempts, rotate, etc. |

> **`domain` vs `search`**: Son mutuamente excluyentes. `search` es mas flexible ya que permite multiples dominios. Si se ponen ambos, se usa el ultimo definido.

Ejemplo de funcionamiento de `search`:
```
search ejemplo.com test.com
```
Si haces `ping servidor`, el sistema buscara:
1. `servidor.ejemplo.com`
2. `servidor.test.com`
3. `servidor` (sin dominio)

### `/etc/hosts`
Resolucion estatica local. Tiene prioridad sobre DNS (si asi lo define nsswitch.conf).

```
127.0.0.1       localhost
127.0.1.1       mi-equipo.ejemplo.com   mi-equipo
192.168.1.10    servidor-web    web
192.168.1.20    servidor-db     db
::1             localhost ip6-localhost
```

Formato: `IP   FQDN   aliases`

### `/etc/nsswitch.conf`
Define el orden de resolucion de nombres.

```
hosts:    files dns myhostname
```

- **files**: Consulta `/etc/hosts` primero
- **dns**: Luego consulta servidores DNS (`/etc/resolv.conf`)
- **myhostname**: Resuelve el hostname local como ultimo recurso

### `/etc/hostname`
Contiene el nombre del host (una sola linea):
```
mi-servidor
```

---

## Comandos de consulta DNS

### `dig` (Domain Information Groper)

Herramienta mas completa y recomendada para consultas DNS.

```bash
dig ejemplo.com                     # Consulta A por defecto
dig ejemplo.com A                   # Registro A (IPv4)
dig ejemplo.com AAAA                # Registro AAAA (IPv6)
dig ejemplo.com MX                  # Registros MX (correo)
dig ejemplo.com NS                  # Servidores de nombres
dig ejemplo.com CNAME               # Aliases
dig ejemplo.com SOA                 # Inicio de autoridad
dig ejemplo.com ANY                 # Todos los registros
dig -x 93.184.216.34                # Resolucion inversa (PTR)
dig ejemplo.com +short              # Solo la respuesta
dig @8.8.8.8 ejemplo.com           # Consultar un servidor DNS especifico
dig +trace ejemplo.com              # Trazar la resolucion completa
dig +noall +answer ejemplo.com     # Solo la seccion ANSWER
```

### Interpretar la salida de `dig`
```
; <<>> DiG 9.18.1 <<>> ejemplo.com
;; QUESTION SECTION:
;ejemplo.com.                    IN      A

;; ANSWER SECTION:
ejemplo.com.             300     IN      A       93.184.216.34

;; AUTHORITY SECTION:
ejemplo.com.             86400   IN      NS      ns1.ejemplo.com.

;; Query time: 23 msec
;; SERVER: 192.168.1.1#53(192.168.1.1)
;; MSG SIZE  rcvd: 128
```

Secciones:
- **QUESTION**: Lo que se pregunto
- **ANSWER**: La respuesta (el registro solicitado)
- **AUTHORITY**: Servidores autoritativos para el dominio
- **ADDITIONAL**: Informacion adicional
- **Query time**: Tiempo de respuesta
- **SERVER**: Servidor DNS que respondio

### `host`

Herramienta simple para consultas DNS.

```bash
host ejemplo.com                     # Consulta basica
host -t MX ejemplo.com              # Tipo de registro especifico
host -t NS ejemplo.com              # Servidores de nombres
host -t AAAA ejemplo.com            # Registros IPv6
host 93.184.216.34                   # Resolucion inversa
host ejemplo.com 8.8.8.8            # Usar servidor DNS especifico
```

### `nslookup`

Herramienta clasica para consultas DNS (interactiva o no interactiva).

```bash
# Modo no interactivo
nslookup ejemplo.com                 # Consulta basica
nslookup ejemplo.com 8.8.8.8        # Con servidor DNS especifico
nslookup -type=MX ejemplo.com       # Tipo de registro

# Modo interactivo
nslookup
> server 8.8.8.8
> set type=MX
> ejemplo.com
> exit
```

### `getent`

Consulta las bases de datos de NSS (Name Service Switch), es decir, usa el mismo orden definido en `/etc/nsswitch.conf`.

```bash
getent hosts ejemplo.com             # Resolver nombre (usando nsswitch.conf)
getent hosts 192.168.1.10            # Resolver IP
getent hosts                         # Listar todas las entradas de hosts
getent ahosts ejemplo.com           # Todas las direcciones (IPv4 e IPv6)
```

> **Diferencia clave**: `dig`, `host` y `nslookup` consultan **directamente** al servidor DNS. `getent` usa el mecanismo completo de nsswitch (primero `/etc/hosts`, luego DNS, etc.).

---

## systemd-resolved

### Descripcion
- Servicio de resolucion DNS integrado en systemd
- Actua como cache DNS local y stub resolver
- Escucha en `127.0.0.53` (stub resolver)
- Puede gestionar automaticamente `/etc/resolv.conf`

### Configuracion: `/etc/systemd/resolved.conf`
```ini
[Resolve]
DNS=8.8.8.8 8.8.4.4
FallbackDNS=1.1.1.1
Domains=ejemplo.com
DNSSEC=allow-downgrade
DNSOverTLS=opportunistic
Cache=yes
```

### `resolvectl` (antes `systemd-resolve`)
```bash
resolvectl status                    # Estado completo
resolvectl query ejemplo.com        # Resolver nombre
resolvectl statistics                # Estadisticas de cache
resolvectl flush-caches              # Limpiar cache DNS
resolvectl dns                       # Ver servidores DNS configurados
resolvectl dns eth0 8.8.8.8         # Establecer DNS para interfaz
```

### Interaccion con /etc/resolv.conf
Cuando systemd-resolved esta activo, `/etc/resolv.conf` tipicamente contiene:
```
nameserver 127.0.0.53
options edns0 trust-ad
search ejemplo.com
```

Esto redirige todas las consultas DNS al stub resolver local de systemd-resolved.

---

## Puntos clave para el examen

1. **`/etc/resolv.conf`**: Maximo 3 `nameserver`; `domain` y `search` son mutuamente excluyentes
2. **`/etc/nsswitch.conf`**: `hosts: files dns` define el orden (primero /etc/hosts, luego DNS)
3. **`dig`** es la herramienta mas completa; `+short` para respuesta breve; `@servidor` para consultar DNS especifico
4. **`host`** es la herramienta simple; **`nslookup`** es la clasica
5. **`getent hosts`** usa el mecanismo completo de nsswitch (no solo DNS)
6. **dig -x IP** realiza resolucion inversa (PTR)
7. **Tipos de registro**: A (IPv4), AAAA (IPv6), MX (correo), NS (DNS), CNAME (alias), PTR (inverso)
8. **systemd-resolved** usa `127.0.0.53` como stub resolver local
9. **`resolvectl`** es la herramienta CLI de systemd-resolved
10. DNS usa el **puerto 53** (TCP y UDP)
