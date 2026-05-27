---
tipo: teoria
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.1"
titulo: "Conceptos y Arquitectura"
peso: 2
tags:
  - lpic-3
  - tema-301
  - teoria
---

# 301.1 Conceptos y Arquitectura

## Objetivos del subtema

Este subtema cubre los fundamentos del protocolo SMB/CIFS, la arquitectura de Samba, los servicios que lo componen y los conceptos de red necesarios para integrar sistemas Linux en entornos Windows.

## Protocolo SMB/CIFS

### Historia y evolución

- **SMB (Server Message Block)**: Protocolo desarrollado originalmente por IBM en 1983 y adoptado por Microsoft para compartir archivos, impresoras y comunicación entre procesos (IPC)
- **CIFS (Common Internet File System)**: Renombramiento y extensión del protocolo SMB por Microsoft en los años 90
- **SMB1/CIFS**: Versión original, considerada insegura y obsoleta (deshabilitada por defecto en Windows 10+)
- **SMB2**: Introducido en Windows Vista, reduce la complejidad del protocolo y mejora el rendimiento
- **SMB3**: Introducido en Windows 8/Server 2012, añade cifrado, multicanal y mejoras de rendimiento
- **SMB3.1.1**: Versión más reciente, con integridad de preautenticación y cifrado AES-128-GCM

### Características principales del protocolo

- Protocolo cliente-servidor para compartir recursos en red
- Funciona sobre TCP/IP (puerto 445 directo) o sobre NetBIOS (puertos 137-139)
- Soporta autenticación, bloqueo de archivos oportunista (oplocks) y notificaciones de cambio
- Modelo de seguridad basado en usuario o en recurso compartido

> **Para el examen:** Es fundamental conocer las diferencias entre SMB1, SMB2 y SMB3. SMB1 es inseguro y no debe usarse en producción. Samba 4 soporta SMB2 y SMB3.

## Arquitectura de Samba

### Demonios principales

Samba se compone de tres demonios fundamentales:

| Demonio | Función | Puerto(s) |
|---------|---------|-----------|
| `smbd` | Servicio de archivos e impresoras, autenticación | TCP 139, 445 |
| `nmbd` | Resolución de nombres NetBIOS, WINS | UDP 137, 138 |
| `winbindd` | Integración con dominios Windows, mapeo de usuarios | N/A (socket local) |

### smbd - Demonio de archivos e impresoras

- Proceso principal de Samba para compartir recursos
- Maneja la autenticación de usuarios (NTLM, Kerberos)
- Gestiona el acceso a archivos e impresoras compartidos
- Crea un proceso hijo por cada conexión de cliente
- Escucha en los puertos TCP 139 y 445

### nmbd - Demonio de nombres NetBIOS

- Proporciona resolución de nombres NetBIOS sobre TCP/IP
- Puede actuar como servidor WINS (Windows Internet Name Service)
- Participa en la elección de navegador maestro (master browser)
- Responde a peticiones de broadcast para descubrimiento de red
- Utiliza los puertos UDP 137 (servicio de nombres) y 138 (datagramas)

### winbindd - Demonio de integración Windows

- Mapea usuarios y grupos de Windows a UIDs/GIDs de Linux
- Permite que usuarios de dominio Windows accedan a recursos Samba
- Se comunica con controladores de dominio AD mediante LDAP y RPC
- Utiliza NSS (Name Service Switch) y PAM para integración del sistema
- Se comunica a través de un socket UNIX local (`/var/run/winbindd/pipe`)

> **Para el examen:** Recuerda que `smbd` y `nmbd` son necesarios para un servidor de archivos básico, mientras que `winbindd` solo se necesita cuando se integra con un dominio Windows/AD.

## Samba 4 como controlador de dominio

Cuando Samba 4 actúa como controlador de dominio Active Directory, ejecuta un demonio unificado `samba` que incluye:

- Servidor LDAP interno
- Servidor DNS interno (o integración con BIND9)
- Servidor Kerberos (Heimdal KDC)
- Servidor de archivos (smbd integrado)
- Servidor RPC para administración de dominio

```
# En modo AD DC, se usa el demonio unificado:
systemctl start samba-ad-dc

# En modo servidor de archivos, se usan los demonios individuales:
systemctl start smbd nmbd winbindd
```

## NetBIOS y resolución de nombres

### Nombres NetBIOS

- Limitados a 15 caracteres más 1 byte de tipo de servicio (16º carácter)
- No son jerárquicos (espacio de nombres plano)
- Se registran y resuelven mediante broadcast o WINS
- Cada tipo de servicio tiene un sufijo hexadecimal diferente

| Sufijo | Tipo | Descripción |
|--------|------|-------------|
| `<00>` | Único | Estación de trabajo |
| `<03>` | Único | Servicio de mensajería |
| `<20>` | Único | Servidor de archivos |
| `<1B>` | Único | Domain Master Browser |
| `<1C>` | Grupo | Controlador de dominio |
| `<1D>` | Único | Master Browser |
| `<1E>` | Grupo | Elecciones de navegación |

### WINS (Windows Internet Name Service)

- Servicio centralizado de resolución de nombres NetBIOS
- Elimina la necesidad de broadcast para resolución de nombres
- Samba puede actuar como servidor WINS (`wins support = yes` en smb.conf)
- Los clientes registran sus nombres al iniciar y los liberan al apagar
- Permite resolución de nombres entre subredes

> **Para el examen:** WINS resuelve nombres NetBIOS, NO nombres DNS. En entornos modernos con AD, DNS ha reemplazado en gran medida a WINS.

## Workgroups vs. Dominios

### Workgroups (Grupos de trabajo)

- Modelo peer-to-peer sin administración centralizada
- Cada equipo mantiene su propia base de datos de usuarios
- No hay autenticación centralizada
- Útil para redes pequeñas (menos de 10 equipos)
- Configurado con `workgroup = NOMBRE` en smb.conf

### Dominios NT4

- Modelo cliente-servidor con un PDC (Primary Domain Controller)
- Uno o más BDCs (Backup Domain Controllers) para redundancia
- Base de datos SAM centralizada
- Samba 3 podía actuar como PDC/BDC de dominio NT4
- Relaciones de confianza limitadas (unidireccionales)

### Dominios Active Directory

- Modelo jerárquico basado en LDAP, DNS y Kerberos
- Múltiples controladores de dominio con replicación multimaestro
- Bosques (forests) y árboles (trees) de dominios
- Políticas de grupo (GPO) para gestión centralizada
- Samba 4 puede actuar como controlador de dominio AD completo

## Puertos de red utilizados

| Puerto | Protocolo | Servicio |
|--------|-----------|----------|
| 137 | UDP | NetBIOS Name Service (nmbd) |
| 138 | UDP | NetBIOS Datagram Service (nmbd) |
| 139 | TCP | NetBIOS Session Service (smbd) |
| 445 | TCP | SMB directo sobre TCP (smbd) |
| 389 | TCP/UDP | LDAP (Samba AD DC) |
| 636 | TCP | LDAPS (Samba AD DC) |
| 88 | TCP/UDP | Kerberos (Samba AD DC) |
| 464 | TCP/UDP | Kerberos kpasswd (Samba AD DC) |
| 53 | TCP/UDP | DNS (Samba AD DC) |
| 3268 | TCP | Global Catalog (Samba AD DC) |
| 3269 | TCP | Global Catalog SSL (Samba AD DC) |

> **Para el examen:** Los puertos 137/UDP, 138/UDP, 139/TCP y 445/TCP son los más preguntados. Recuerda que el puerto 445 permite SMB sin NetBIOS.

## Diferencias clave entre Samba 3 y Samba 4

| Característica | Samba 3 | Samba 4 |
|---------------|---------|---------|
| Dominio AD DC | No | Sí |
| Dominio NT4 PDC | Sí | Sí (compatibilidad) |
| Protocolo SMB | SMB1 | SMB1, SMB2, SMB3 |
| KDC Kerberos | No (externo) | Sí (Heimdal integrado) |
| Servidor LDAP | No (externo) | Sí (integrado) |
| Servidor DNS | No | Sí (interno o BIND9_DLZ) |
| GPO | Limitado | Soporte básico |

## Archivos de configuración principales

- `/etc/samba/smb.conf` - Configuración principal de Samba
- `/etc/samba/lmhosts` - Resolución estática de nombres NetBIOS
- `/var/lib/samba/` - Bases de datos TDB y estado de Samba
- `/var/log/samba/` - Archivos de log de los demonios
- `/var/cache/samba/` - Caché de winbind y otros datos temporales

## Resumen de conceptos clave

- SMB/CIFS es el protocolo; Samba es la implementación libre
- Tres demonios: `smbd` (archivos), `nmbd` (nombres), `winbindd` (dominio)
- Puerto 445 para SMB directo; puertos 137-139 para SMB sobre NetBIOS
- Samba 4 introdujo soporte completo para Active Directory
- WINS resuelve nombres NetBIOS; DNS resuelve nombres de host
- El modo AD DC usa un demonio unificado `samba` en lugar de `smbd`/`nmbd` separados
