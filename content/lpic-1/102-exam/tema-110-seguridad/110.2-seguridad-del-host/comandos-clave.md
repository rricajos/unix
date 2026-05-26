---
title: "110.2 Configurar la seguridad del host - Comandos clave"
tags:
  - lpic-1
  - examen-102
  - tema-110
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "102"
tema: "110"
subtema: "110.2"
---

# 110.2 Configurar la seguridad del host - Comandos clave

## Servicios (systemctl)

| Comando | Descripcion |
|---------|-------------|
| `systemctl list-units --type=service --state=running` | Listar servicios activos |
| `systemctl stop servicio` | Detener servicio |
| `systemctl disable servicio` | No iniciar al arrancar |
| `systemctl mask servicio` | Bloquear completamente |
| `systemctl unmask servicio` | Desbloquear |
| `systemctl is-enabled servicio` | Verificar si esta habilitado |

## Shadow passwords

| Archivo | Permisos | Contenido |
|---------|----------|-----------|
| `/etc/passwd` | 644 (todos leen) | Info de usuario (x en campo password) |
| `/etc/shadow` | 640 o 000 (solo root) | Hash de contrasenas |

### Formato de /etc/shadow
```
usuario:$tipo$sal$hash:lastchg:min:max:warn:inactive:expire:
```

### Tipos de hash
| Prefijo | Algoritmo |
|---------|-----------|
| `$6$` | SHA-512 |
| `$5$` | SHA-256 |
| `$1$` | MD5 |
| `!` / `!!` | Cuenta bloqueada |
| `*` | Sin login |

## TCP Wrappers

### Orden de evaluacion
1. `/etc/hosts.allow` (si match -> PERMITIR)
2. `/etc/hosts.deny` (si match -> DENEGAR)
3. Si no hay match -> PERMITIR

### Formato
```
servicio: host [: accion]
```

### Politica restrictiva (recomendada)
`/etc/hosts.deny`:
```
ALL: ALL
```
`/etc/hosts.allow`:
```
sshd: 192.168.1.0/24
ALL: localhost
```

### Comodines
| Comodin | Significado |
|---------|-------------|
| `ALL` | Todos |
| `LOCAL` | Hosts locales |
| `EXCEPT` | Exclusion |

## inetd vs xinetd

| inetd | xinetd |
|-------|--------|
| `/etc/inetd.conf` | `/etc/xinetd.conf` + `/etc/xinetd.d/` |
| Comentar con `#` | `disable = yes` |
| Una linea por servicio | Un archivo por servicio |

## /etc/nologin

| Accion | Comando |
|--------|---------|
| Impedir logins | `echo "Mantenimiento" > /etc/nologin` |
| Permitir logins | `rm /etc/nologin` |

## Archivos clave

| Archivo | Descripcion |
|---------|-------------|
| `/etc/passwd` | Info de usuarios (legible por todos) |
| `/etc/shadow` | Contrasenas encriptadas (solo root) |
| `/etc/hosts.allow` | Reglas de permiso (TCP Wrappers) |
| `/etc/hosts.deny` | Reglas de denegacion (TCP Wrappers) |
| `/etc/xinetd.conf` | Config global de xinetd |
| `/etc/xinetd.d/` | Config por servicio de xinetd |
| `/etc/inetd.conf` | Config de inetd |
| `/etc/nologin` | Si existe, impide login de usuarios normales |
| `/etc/securetty` | Terminales donde root puede hacer login |
