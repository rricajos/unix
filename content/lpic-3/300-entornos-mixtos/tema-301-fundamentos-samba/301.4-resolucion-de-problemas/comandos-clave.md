---
tipo: comandos
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.4"
titulo: "Resolución de Problemas - Comandos Clave"
peso: 3
tags:
  - lpic-3
  - tema-301
  - comandos
---

# Comandos clave - 301.4 Resolución de Problemas

## Control de niveles de log

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `smbcontrol smbd debug N` | Cambiar nivel de log de smbd | `smbcontrol smbd debug 3` |
| `smbcontrol all debug N` | Cambiar nivel de log de todos los demonios | `smbcontrol all debug 5` |
| `smbcontrol PID debug N` | Cambiar log de un proceso específico | `smbcontrol 12345 debug 3` |
| `log level = N` | Configurar nivel en smb.conf | `log level = 1 auth:3 winbind:5` |

## Análisis de tráfico de red

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `tcpdump -i eth0 port 445` | Capturar tráfico SMB directo | `tcpdump -i eth0 port 445 -w smb.pcap` |
| `tcpdump port 139` | Capturar SMB sobre NetBIOS | `tcpdump -i eth0 port 139 -vvv` |
| `tcpdump port 137 or port 138` | Capturar tráfico NetBIOS | `tcpdump -i eth0 udp port 137` |
| `tcpdump port 88` | Capturar tráfico Kerberos | `tcpdump -i eth0 port 88 -w krb.pcap` |
| `tshark -f "port 445"` | Captura con tshark (Wireshark CLI) | `tshark -i eth0 -f "port 445"` |
| `tshark -Y "smb2"` | Filtrar tráfico SMB2 en tshark | `tshark -r captura.pcap -Y "smb2"` |

## Diagnóstico de conectividad

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `testparm` | Verificar configuración smb.conf | `testparm -s` |
| `smbclient -L //srv -U user` | Listar recursos (prueba conectividad) | `smbclient -L //srvfiles -U admin` |
| `smbclient -L //srv -N` | Listar sin autenticación | `smbclient -L //srvfiles -N` |
| `smbclient -d N` | Cliente SMB con nivel de debug | `smbclient -L //srv -U user -d 3` |
| `smbclient -m SMB2` | Forzar protocolo específico | `smbclient -L //srv -U user -m SMB3` |
| `nmblookup nombre` | Resolver nombre NetBIOS | `nmblookup SERVIDOR` |
| `nmblookup -A ip` | Tabla de nombres de un host | `nmblookup -A 192.168.1.10` |

## Diagnóstico de winbind e integración

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `wbinfo -p` | Ping a winbindd | `wbinfo -p` |
| `wbinfo -t` | Verificar confianza del dominio | `wbinfo -t` |
| `wbinfo -u` | Listar usuarios del dominio | `wbinfo -u` |
| `wbinfo -g` | Listar grupos del dominio | `wbinfo -g` |
| `wbinfo -a user%pass` | Probar autenticación | `wbinfo -a pedro%secreto` |
| `wbinfo --name-to-sid user` | Obtener SID de un usuario | `wbinfo --name-to-sid admin` |
| `wbinfo --sid-to-uid SID` | Mapear SID a UID | `wbinfo --sid-to-uid S-1-5-...` |
| `wbinfo --dsgetdcname=DOM` | Obtener info del DC | `wbinfo --dsgetdcname=EMPRESA` |
| `getent passwd` | Listar usuarios (incluidos dominio) | `getent passwd usuario_ad` |
| `getent group` | Listar grupos (incluidos dominio) | `getent group grupo_ad` |

## Resolución de nombres

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `nmblookup nombre` | Resolver nombre NetBIOS | `nmblookup SRVFILES` |
| `nmblookup -R -U wins nombre` | Consultar servidor WINS | `nmblookup -R -U 10.0.0.1 SRV` |
| `host nombre` | Resolver DNS | `host srv.dominio.com` |
| `dig _ldap._tcp.dom SRV` | Verificar registros SRV de AD | `dig _ldap._tcp.empresa.com SRV` |
| `dig _kerberos._tcp.dom SRV` | Verificar registros Kerberos | `dig _kerberos._tcp.empresa.com SRV` |
| `nslookup nombre` | Resolución DNS interactiva | `nslookup dc.empresa.com` |

## Códigos de error NT_STATUS comunes

| Código | Significado | Verificación |
|--------|------------|--------------|
| `NT_STATUS_ACCESS_DENIED` | Sin permisos | Verificar smb.conf, ACLs, permisos POSIX |
| `NT_STATUS_LOGON_FAILURE` | Fallo de login | Verificar credenciales, passdb, Kerberos |
| `NT_STATUS_BAD_NETWORK_NAME` | Recurso no encontrado | Verificar nombre del recurso en smb.conf |
| `NT_STATUS_CONNECTION_REFUSED` | Conexión rechazada | Verificar smbd, firewall, puertos |
| `NT_STATUS_HOST_UNREACHABLE` | Host inaccesible | Verificar red, routing, firewall |
| `NT_STATUS_SHARING_VIOLATION` | Conflicto de bloqueo | Verificar smbstatus -L |
| `NT_STATUS_NO_TRUST_SAM_ACCOUNT` | Cuenta de máquina inválida | Ejecutar net ads join |
| `NT_STATUS_ACCOUNT_DISABLED` | Cuenta deshabilitada | Verificar estado con pdbedit o AD |
