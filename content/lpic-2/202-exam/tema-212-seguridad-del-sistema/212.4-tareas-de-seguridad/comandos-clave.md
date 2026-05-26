---
title: "212.4 - Tareas de seguridad: Comandos clave"
tags: [lpic-2, examen-202, tema-212, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.4"
---

# 212.4 - Tareas de seguridad: Comandos clave

## fail2ban

| Comando | Descripción |
|---------|-------------|
| `fail2ban-client status` | Ver estado general y jails activos |
| `fail2ban-client status sshd` | Ver estado del jail sshd (IPs baneadas) |
| `fail2ban-client set sshd unbanip 1.2.3.4` | Desbloquear una IP |
| `fail2ban-client set sshd banip 1.2.3.4` | Bloquear una IP manualmente |
| `fail2ban-client reload` | Recargar configuración |
| `fail2ban-client get sshd maxretry` | Consultar parámetro de un jail |

## AIDE (integridad de archivos)

| Comando | Descripción |
|---------|-------------|
| `aide --init` | Crear base de datos inicial |
| `aide --check` | Comparar sistema con la base de datos |
| `aide --update` | Verificar y actualizar la base de datos |
| `mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db` | Activar nueva base de datos |

## Tripwire

| Comando | Descripción |
|---------|-------------|
| `tripwire --init` | Inicializar base de datos |
| `tripwire --check` | Verificar integridad |
| `tripwire --update` | Actualizar base de datos |
| `tripwire --update-policy` | Actualizar política |

## Detección de rootkits

| Comando | Descripción |
|---------|-------------|
| `chkrootkit` | Escaneo básico de rootkits |
| `chkrootkit -q` | Escaneo silencioso (solo alertas) |
| `rkhunter --check` | Escaneo completo con rkhunter |
| `rkhunter --update` | Actualizar firmas de rootkits |
| `rkhunter --propupd` | Actualizar propiedades del sistema |
| `rkhunter --check --report-warnings-only` | Solo mostrar advertencias |

## Auditoría de puertos y conexiones

| Comando | Descripción |
|---------|-------------|
| `nmap 192.168.1.1` | Escaneo TCP básico |
| `nmap -sS 192.168.1.1` | Escaneo SYN sigiloso |
| `nmap -sV 192.168.1.1` | Detección de versiones de servicio |
| `nmap -p 22,80,443 host` | Escaneo de puertos específicos |
| `nmap -sn 192.168.1.0/24` | Descubrimiento de hosts (sin escaneo de puertos) |
| `ss -tlnp` | Puertos TCP en escucha con proceso |
| `ss -ulnp` | Puertos UDP en escucha con proceso |
| `ss -ta` | Todas las conexiones TCP |
| `ss -s` | Estadísticas de sockets |
| `netstat -tlnp` | Equivalente a ss -tlnp (legacy) |

## Límites de recursos

| Comando | Descripción |
|---------|-------------|
| `ulimit -a` | Ver todos los límites del usuario |
| `ulimit -Sn 4096` | Establecer límite soft de archivos abiertos |
| `ulimit -Hn 65536` | Establecer límite hard de archivos abiertos |
| `ulimit -u 1024` | Límite de procesos por usuario |
| `ulimit -c unlimited` | Permitir archivos core sin límite |

## sudo

| Comando | Descripción |
|---------|-------------|
| `visudo` | Editar /etc/sudoers con validación de sintaxis |
| `visudo -f /etc/sudoers.d/archivo` | Editar archivo de sudoers.d |
| `sudo -l` | Listar permisos sudo del usuario actual |
| `sudo -u usuario comando` | Ejecutar como otro usuario |
| `sudo -i` | Iniciar shell interactivo como root |

## Sistema de auditoría (auditd)

| Comando | Descripción |
|---------|-------------|
| `auditctl -w /etc/passwd -p wa -k passwd` | Vigilar cambios en un archivo |
| `auditctl -l` | Listar reglas activas |
| `auditctl -D` | Eliminar todas las reglas |
| `ausearch -k passwd` | Buscar eventos por clave |
| `ausearch -ua 1000` | Buscar eventos por UID |
| `ausearch -m USER_LOGIN` | Buscar por tipo de evento |
| `aureport` | Informe general de auditoría |
| `aureport -au` | Informe de autenticaciones |
| `aureport -f` | Informe de acceso a archivos |
| `aureport --failed` | Informe de eventos fallidos |

## Lynis

| Comando | Descripción |
|---------|-------------|
| `lynis audit system` | Auditoría completa del sistema |
| `lynis show tests` | Listar pruebas disponibles |
| `lynis update info` | Verificar actualizaciones |

## Archivos de configuración relevantes

| Archivo | Descripción |
|---------|-------------|
| `/etc/fail2ban/jail.local` | Configuración personalizada de fail2ban |
| `/etc/fail2ban/jail.conf` | Configuración por defecto (no modificar) |
| `/etc/fail2ban/filter.d/` | Filtros de detección |
| `/etc/aide/aide.conf` | Configuración de AIDE |
| `/etc/rkhunter.conf` | Configuración de rkhunter |
| `/etc/security/limits.conf` | Límites de recursos por usuario/grupo |
| `/etc/sudoers` | Configuración principal de sudo |
| `/etc/sudoers.d/` | Configuración modular de sudo |
| `/etc/audit/rules.d/audit.rules` | Reglas persistentes de auditd |
| `/etc/audit/auditd.conf` | Configuración del demonio auditd |
| `/var/log/lynis.log` | Log de auditoría de Lynis |
