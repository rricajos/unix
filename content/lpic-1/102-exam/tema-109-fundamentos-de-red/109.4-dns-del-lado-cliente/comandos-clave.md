---
title: "109.4 Configurar DNS en el lado cliente - Comandos clave"
tags:
  - lpic-1
  - examen-102
  - tema-109
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "109"
subtema: "109.4"
---

# 109.4 Configurar DNS en el lado cliente - Comandos clave

## dig

| Comando | Descripcion |
|---------|-------------|
| `dig ejemplo.com` | Consulta registro A |
| `dig ejemplo.com AAAA` | Registro IPv6 |
| `dig ejemplo.com MX` | Servidores de correo |
| `dig ejemplo.com NS` | Servidores de nombres |
| `dig ejemplo.com CNAME` | Aliases |
| `dig ejemplo.com SOA` | Inicio de autoridad |
| `dig ejemplo.com ANY` | Todos los registros |
| `dig -x 93.184.216.34` | Resolucion inversa (PTR) |
| `dig ejemplo.com +short` | Solo la respuesta |
| `dig @8.8.8.8 ejemplo.com` | Usar servidor DNS especifico |
| `dig +trace ejemplo.com` | Trazar resolucion completa |

## host

| Comando | Descripcion |
|---------|-------------|
| `host ejemplo.com` | Consulta basica |
| `host -t MX ejemplo.com` | Registro MX |
| `host -t NS ejemplo.com` | Registro NS |
| `host 93.184.216.34` | Resolucion inversa |
| `host ejemplo.com 8.8.8.8` | Con servidor DNS especifico |

## nslookup

| Comando | Descripcion |
|---------|-------------|
| `nslookup ejemplo.com` | Consulta basica |
| `nslookup ejemplo.com 8.8.8.8` | Con servidor especifico |
| `nslookup -type=MX ejemplo.com` | Tipo de registro |

## getent

| Comando | Descripcion |
|---------|-------------|
| `getent hosts ejemplo.com` | Resolver usando nsswitch |
| `getent hosts 192.168.1.10` | Resolver IP |
| `getent ahosts ejemplo.com` | Todas las direcciones |

## resolvectl (systemd-resolved)

| Comando | Descripcion |
|---------|-------------|
| `resolvectl status` | Estado completo |
| `resolvectl query ejemplo.com` | Resolver nombre |
| `resolvectl flush-caches` | Limpiar cache DNS |
| `resolvectl dns` | Ver DNS configurados |
| `resolvectl statistics` | Estadisticas de cache |

## Tipos de registros DNS

| Tipo | Descripcion | Ejemplo |
|------|-------------|---------|
| A | IPv4 | 93.184.216.34 |
| AAAA | IPv6 | 2606:2800:220:1:... |
| MX | Correo | mail.ejemplo.com (pri 10) |
| NS | Servidor DNS | ns1.ejemplo.com |
| CNAME | Alias | www -> ejemplo.com |
| PTR | Inverso (IP->nombre) | 34.216... -> www.ejemplo.com |
| SOA | Autoridad de zona | Info de la zona |
| TXT | Texto | SPF, DKIM |

## Archivos de configuracion

| Archivo | Descripcion |
|---------|-------------|
| `/etc/resolv.conf` | Servidores DNS (nameserver, domain, search) |
| `/etc/hosts` | Resolucion estatica local |
| `/etc/nsswitch.conf` | Orden de busqueda (hosts: files dns) |
| `/etc/hostname` | Nombre del host |
| `/etc/systemd/resolved.conf` | Config de systemd-resolved |

## Diferencia entre herramientas

| Herramienta | Usa nsswitch | Consulta DNS directo |
|-------------|-------------|---------------------|
| `getent` | Si | No |
| `dig` | No | Si |
| `host` | No | Si |
| `nslookup` | No | Si |
