---
title: "212.1 - Configuración de router"
tags: [lpic-2, examen-202, tema-212, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.1"
---

# 212.1 - Configuración de router

## Introducción al enrutamiento en Linux

Linux puede funcionar como un router completo, reenviando paquetes entre interfaces de red. Para ello se requiere habilitar el reenvío de paquetes (IP forwarding) y configurar reglas de filtrado y traducción de direcciones mediante herramientas como **iptables**, **nftables** o **firewalld**.

## Habilitación del reenvío IP (IP Forwarding)

El reenvío de paquetes está deshabilitado por defecto en Linux. Para activarlo:

### Activación temporal

```bash
# IPv4
echo 1 > /proc/sys/net/ipv4/ip_forward
# o bien
sysctl -w net.ipv4.ip_forward=1

# IPv6
echo 1 > /proc/sys/net/ipv6/conf/all/forwarding
sysctl -w net.ipv6.conf.all.forwarding=1
```

### Activación permanente

Editar `/etc/sysctl.conf` o crear un archivo en `/etc/sysctl.d/`:

```bash
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```

Aplicar los cambios sin reiniciar:

```bash
sysctl -p
```

> **Para el examen:** Es fundamental saber que sin `ip_forward=1` el sistema Linux no reenviará paquetes entre interfaces, aunque las reglas de iptables estén correctamente configuradas.

## iptables: el firewall clásico de Linux

### Arquitectura de tablas y cadenas

**iptables** organiza las reglas en **tablas**, y cada tabla contiene **cadenas**:

| Tabla | Propósito | Cadenas principales |
|-------|-----------|-------------------|
| **filter** | Filtrado de paquetes (tabla por defecto) | INPUT, OUTPUT, FORWARD |
| **nat** | Traducción de direcciones de red | PREROUTING, POSTROUTING, OUTPUT |
| **mangle** | Modificación de cabeceras de paquetes | PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING |
| **raw** | Excepciones al seguimiento de conexiones | PREROUTING, OUTPUT |

### Cadenas principales

- **INPUT**: paquetes destinados al propio host
- **OUTPUT**: paquetes generados por el propio host
- **FORWARD**: paquetes que atraviesan el host (enrutamiento)
- **PREROUTING**: paquetes antes de la decisión de enrutamiento (DNAT)
- **POSTROUTING**: paquetes después de la decisión de enrutamiento (SNAT/MASQUERADE)

### Flujo de un paquete

```
Paquete entrante
    │
    ▼
PREROUTING (nat/mangle)
    │
    ├── ¿Para este host? ──► INPUT (filter) ──► Proceso local
    │                                               │
    │                                           OUTPUT (filter/nat)
    │                                               │
    └── ¿Reenviar? ──► FORWARD (filter) ────────────┘
                                                    │
                                                    ▼
                                          POSTROUTING (nat/mangle)
                                                    │
                                                    ▼
                                            Paquete saliente
```

### Sintaxis básica de iptables

```bash
iptables [-t tabla] COMANDO cadena [opciones] -j OBJETIVO
```

### Comandos principales

| Comando | Descripción |
|---------|-------------|
| `-A` | Añadir regla al final de la cadena (append) |
| `-I` | Insertar regla en posición específica (insert) |
| `-D` | Eliminar regla (delete) |
| `-R` | Reemplazar una regla |
| `-L` | Listar reglas |
| `-F` | Vaciar todas las reglas (flush) |
| `-P` | Establecer política por defecto |
| `-N` | Crear cadena personalizada |
| `-X` | Eliminar cadena personalizada |

### Objetivos (targets) principales

| Objetivo | Descripción |
|----------|-------------|
| **ACCEPT** | Permitir el paquete |
| **DROP** | Descartar silenciosamente |
| **REJECT** | Rechazar con mensaje ICMP |
| **LOG** | Registrar en syslog sin detener procesamiento |
| **MASQUERADE** | NAT dinámico (IP de salida variable) |
| **SNAT** | NAT de origen con IP fija |
| **DNAT** | NAT de destino (redirigir a otra IP/puerto) |

### Ejemplos prácticos de reglas

```bash
# Permitir tráfico SSH entrante
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Bloquear todo el tráfico de una IP específica
iptables -A INPUT -s 192.168.1.100 -j DROP

# Permitir tráfico establecido y relacionado
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Rechazar ping con mensaje ICMP
iptables -A INPUT -p icmp --icmp-type echo-request -j REJECT

# Registrar paquetes descartados
iptables -A INPUT -j LOG --log-prefix "IPT-DROP: " --log-level 4
iptables -A INPUT -j DROP

# Establecer política por defecto
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
```

## Configuración de NAT

### SNAT (Source NAT) - IP fija de salida

```bash
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j SNAT --to-source 203.0.113.5
```

### MASQUERADE - IP dinámica de salida

```bash
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j MASQUERADE
```

> **Para el examen:** MASQUERADE se usa cuando la IP pública es dinámica (conexiones PPPoE, DHCP). SNAT es más eficiente cuando la IP es estática.

### DNAT (Destination NAT) - Port forwarding

```bash
# Redirigir puerto 80 externo al servidor interno 192.168.1.10:8080
iptables -t nat -A PREROUTING -p tcp --dport 80 -i eth0 -j DNAT --to-destination 192.168.1.10:8080

# Necesario también permitir el tráfico en FORWARD
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 8080 -j ACCEPT
```

### Persistencia de reglas iptables

```bash
# Guardar reglas actuales
iptables-save > /etc/iptables/rules.v4

# Restaurar reglas
iptables-restore < /etc/iptables/rules.v4
```

## nftables: el sucesor de iptables

**nftables** reemplaza a iptables, ip6tables, arptables y ebtables con una sintaxis unificada.

### Comando nft - Sintaxis básica

```bash
# Listar todas las reglas
nft list ruleset

# Crear una tabla
nft add table inet mi_firewall

# Crear una cadena
nft add chain inet mi_firewall entrada { type filter hook input priority 0 \; policy drop \; }

# Añadir reglas
nft add rule inet mi_firewall entrada tcp dport 22 accept
nft add rule inet mi_firewall entrada ct state established,related accept

# Configurar NAT con nftables
nft add table ip nat
nft add chain ip nat postrouting { type nat hook postrouting priority 100 \; }
nft add rule ip nat postrouting oifname "eth0" masquerade
```

> **Para el examen:** nftables usa la familia `inet` para reglas que aplican tanto a IPv4 como a IPv6 simultáneamente.

### Diferencias clave entre iptables y nftables

| Característica | iptables | nftables |
|---------------|----------|----------|
| Herramienta | iptables, ip6tables | nft (unificado) |
| Familias | Separadas | inet (IPv4+IPv6) |
| Tablas | Predefinidas | Definidas por el usuario |
| Rendimiento | Menor con muchas reglas | Mejor (mapas, conjuntos) |
| Compatibilidad | iptables-nft (capa de traducción) | Nativo |

## firewalld: gestión dinámica de firewall

**firewalld** es un frontend para iptables/nftables que usa el concepto de **zonas**.

### Zonas predefinidas

| Zona | Descripción |
|------|-------------|
| **drop** | Descarta todo, sin respuesta |
| **block** | Rechaza con icmp-host-prohibited |
| **public** | Red pública, no confiable (zona por defecto) |
| **external** | NAT/masquerading habilitado |
| **dmz** | Zona desmilitarizada, acceso limitado |
| **work** | Red de trabajo |
| **home** | Red doméstica |
| **internal** | Red interna |
| **trusted** | Todo permitido |

### Comandos esenciales de firewall-cmd

```bash
# Ver zona activa
firewall-cmd --get-active-zones

# Listar servicios permitidos
firewall-cmd --list-all

# Añadir servicio de forma permanente
firewall-cmd --permanent --add-service=http
firewall-cmd --reload

# Añadir puerto específico
firewall-cmd --permanent --add-port=8080/tcp

# Activar masquerading
firewall-cmd --permanent --zone=external --add-masquerade

# Port forwarding
firewall-cmd --permanent --add-forward-port=port=80:proto=tcp:toport=8080:toaddr=192.168.1.10

# Añadir interfaz a zona
firewall-cmd --permanent --zone=internal --add-interface=eth1
```

> **Para el examen:** Los cambios con `--permanent` requieren `--reload` para aplicarse. Sin `--permanent`, los cambios se aplican inmediatamente pero se pierden al reiniciar.

## Archivo /etc/sysctl.conf

Parámetros relevantes para enrutamiento y seguridad de red:

```bash
# Habilitar reenvío IPv4
net.ipv4.ip_forward = 1

# Protección contra SYN floods
net.ipv4.tcp_syncookies = 1

# Ignorar pings de broadcast (prevención de smurf)
net.ipv4.icmp_echo_ignore_broadcasts = 1

# No aceptar redirecciones ICMP
net.ipv4.conf.all.accept_redirects = 0

# No enviar redirecciones ICMP
net.ipv4.conf.all.send_redirects = 0

# Protección contra IP spoofing
net.ipv4.conf.all.rp_filter = 1

# No aceptar paquetes con source routing
net.ipv4.conf.all.accept_source_route = 0
```
