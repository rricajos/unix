---
title: "210.1 - Configuración DHCP"
tags: [lpic-2, examen-202, tema-210, teoria]
tipo: teoria
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.1"
---

# 210.1 - Configuración DHCP

## Peso: 2

## Conceptos fundamentales de DHCP

DHCP (Dynamic Host Configuration Protocol) permite la asignación automática de direcciones IP y otros parámetros de red a los clientes. Funciona sobre UDP utilizando los puertos **67** (servidor) y **68** (cliente).

### Proceso DORA

El proceso de obtención de una dirección IP sigue cuatro pasos conocidos como **DORA**:

1. **Discover**: El cliente envía un broadcast buscando servidores DHCP
2. **Offer**: El servidor responde con una oferta de dirección IP
3. **Request**: El cliente solicita formalmente la dirección ofrecida
4. **Acknowledge**: El servidor confirma la asignación

## Servidor ISC DHCP (dhcpd)

El servidor DHCP más utilizado en Linux es el del Internet Systems Consortium (ISC). El demonio se llama `dhcpd` y su archivo de configuración principal es `/etc/dhcp/dhcpd.conf`.

### Instalación y servicio

```bash
# Instalación en Debian/Ubuntu
apt install isc-dhcp-server

# Instalación en RHEL/CentOS
yum install dhcp-server

# Gestión del servicio
systemctl start dhcpd
systemctl enable dhcpd
systemctl status dhcpd
```

### Interfaz de escucha

En sistemas Debian/Ubuntu, se configura la interfaz en:

```bash
# /etc/default/isc-dhcp-server
INTERFACESv4="eth0"
INTERFACESv6="eth0"
```

## Archivo de configuración dhcpd.conf

El archivo `/etc/dhcp/dhcpd.conf` contiene toda la configuración del servidor DHCP.

### Opciones globales

```bash
# /etc/dhcp/dhcpd.conf

# Tiempo de concesión por defecto (en segundos)
default-lease-time 600;       # 10 minutos
max-lease-time 7200;          # 2 horas

# Opciones globales
option domain-name "ejemplo.local";
option domain-name-servers 192.168.1.1, 8.8.8.8;

# Servidor DHCP autoritativo para esta red
authoritative;
```

### Declaración de subred (subnet)

```bash
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.1.255;
    option domain-name-servers 192.168.1.1, 8.8.4.4;
    option domain-name "oficina.local";
    default-lease-time 3600;
    max-lease-time 86400;
}
```

### Parámetros importantes de subnet

| Parámetro | Descripción |
|-----------|-------------|
| `range` | Rango de IPs a asignar |
| `option routers` | Puerta de enlace predeterminada |
| `option domain-name-servers` | Servidores DNS |
| `option domain-name` | Nombre de dominio |
| `option subnet-mask` | Máscara de subred |
| `option broadcast-address` | Dirección de broadcast |
| `default-lease-time` | Tiempo de concesión por defecto (segundos) |
| `max-lease-time` | Tiempo máximo de concesión (segundos) |

## Reservas de dirección fija (fixed-address)

Permiten asignar siempre la misma IP a un cliente identificado por su dirección MAC:

```bash
host servidor-web {
    hardware ethernet 00:1A:2B:3C:4D:5E;
    fixed-address 192.168.1.50;
    option host-name "webserver";
}

host impresora-oficina {
    hardware ethernet AA:BB:CC:DD:EE:FF;
    fixed-address 192.168.1.60;
}
```

> **Para el examen:** Las reservas con `fixed-address` se basan en la dirección MAC declarada con `hardware ethernet`. Es fundamental recordar la sintaxis exacta.

## Archivo de concesiones (dhcpd.leases)

El servidor DHCP registra todas las concesiones activas en el archivo `/var/lib/dhcp/dhcpd.leases`. Este archivo se actualiza automáticamente.

### Formato de una entrada de concesión

```bash
lease 192.168.1.105 {
    starts 4 2026/05/21 10:30:00;
    ends 4 2026/05/21 11:30:00;
    cltt 4 2026/05/21 10:30:00;
    binding state active;
    next binding state free;
    hardware ethernet 00:11:22:33:44:55;
    client-hostname "pc-oficina";
}
```

### Campos relevantes del archivo de concesiones

| Campo | Descripción |
|-------|-------------|
| `starts` | Inicio de la concesión |
| `ends` | Fin de la concesión |
| `binding state` | Estado actual (active, free, expired) |
| `hardware ethernet` | MAC del cliente |
| `client-hostname` | Nombre del equipo cliente |

> **Para el examen:** La ruta `/var/lib/dhcp/dhcpd.leases` es muy preguntada. Memoriza tanto la ubicación como la estructura del archivo.

## Grupos y pools compartidos

### Grupos (group)

Permiten aplicar opciones comunes a múltiples hosts:

```bash
group {
    option domain-name-servers 10.0.0.1;
    default-lease-time 1800;

    host pc1 {
        hardware ethernet 00:AA:BB:CC:DD:01;
        fixed-address 192.168.1.51;
    }
    host pc2 {
        hardware ethernet 00:AA:BB:CC:DD:02;
        fixed-address 192.168.1.52;
    }
}
```

### Pool compartido (shared-network)

Permite agrupar varias subredes en la misma interfaz física:

```bash
shared-network red-oficina {
    subnet 192.168.1.0 netmask 255.255.255.0 {
        range 192.168.1.100 192.168.1.150;
        option routers 192.168.1.1;
    }
    subnet 192.168.2.0 netmask 255.255.255.0 {
        range 192.168.2.100 192.168.2.150;
        option routers 192.168.2.1;
    }
}
```

## DHCPv6

Para IPv6, el servidor DHCP utiliza el demonio `dhcpd6` con su propio archivo de configuración.

### Configuración básica de DHCPv6

```bash
# /etc/dhcp/dhcpd6.conf
default-lease-time 600;
max-lease-time 7200;
allow leasequery;

subnet6 2001:db8:1::/64 {
    range6 2001:db8:1::100 2001:db8:1::200;
    option dhcp6.name-servers 2001:db8:1::1;
    option dhcp6.domain-search "ejemplo.local";
}
```

### Diferencias clave entre DHCPv4 y DHCPv6

- DHCPv6 usa los puertos **546** (cliente) y **547** (servidor)
- Se utiliza `subnet6` en lugar de `subnet`
- Se utiliza `range6` en lugar de `range`
- Las opciones llevan el prefijo `dhcp6.`
- El archivo de concesiones es `/var/lib/dhcp/dhcpd6.leases`

> **Para el examen:** Conocer las diferencias de sintaxis entre DHCPv4 y DHCPv6 es importante. Recuerda los puertos 546/547 y los prefijos `subnet6`, `range6` y `dhcp6.`.

## DHCP Relay (dhcrelay)

Cuando el servidor DHCP se encuentra en una red diferente a la de los clientes, se necesita un agente relay que reenvíe las peticiones DHCP entre subredes.

```bash
# Iniciar dhcrelay indicando el servidor DHCP y la interfaz
dhcrelay -i eth0 192.168.1.10

# Para DHCPv6
dhcrelay -6 -l eth0 -u eth1
```

### Opciones de dhcrelay

| Opción | Descripción |
|--------|-------------|
| `-i` | Interfaz donde escuchar peticiones de clientes |
| `-d` | Ejecutar en primer plano (debug) |
| `-4` | Modo IPv4 (por defecto) |
| `-6` | Modo IPv6 |
| `-l` | Interfaz inferior (lado cliente) en DHCPv6 |
| `-u` | Interfaz superior (lado servidor) en DHCPv6 |

> **Para el examen:** `dhcrelay` es esencial cuando clientes y servidor DHCP están en subredes distintas. Recuerda que requiere indicar la interfaz y la IP del servidor DHCP.

## Verificación y depuración

```bash
# Verificar la sintaxis del archivo de configuración
dhcpd -t -cf /etc/dhcp/dhcpd.conf

# Ver concesiones activas
cat /var/lib/dhcp/dhcpd.leases

# Revisar logs del servidor DHCP
journalctl -u dhcpd
grep dhcpd /var/log/syslog

# Desde el cliente, renovar la concesión
dhclient -r          # Liberar la IP actual
dhclient eth0        # Solicitar nueva IP
```

## Resumen de archivos y rutas clave

| Archivo/Ruta | Función |
|-------------|---------|
| `/etc/dhcp/dhcpd.conf` | Configuración principal del servidor DHCPv4 |
| `/etc/dhcp/dhcpd6.conf` | Configuración principal del servidor DHCPv6 |
| `/var/lib/dhcp/dhcpd.leases` | Base de datos de concesiones DHCPv4 |
| `/var/lib/dhcp/dhcpd6.leases` | Base de datos de concesiones DHCPv6 |
| `/etc/default/isc-dhcp-server` | Configuración de interfaz (Debian/Ubuntu) |
| `/etc/sysconfig/dhcpd` | Configuración de interfaz (RHEL/CentOS) |
