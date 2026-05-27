---
tipo: teoria
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.4"
titulo: "Resolución de Problemas"
peso: 3
tags:
  - lpic-3
  - tema-301
  - teoria
---

# 301.4 Resolución de Problemas

## Objetivos del subtema

Este subtema aborda las técnicas y herramientas para diagnosticar y resolver problemas comunes en entornos Samba, incluyendo niveles de log, análisis de tráfico de red, resolución de nombres y errores de permisos.

## Niveles de log en Samba

Samba proporciona niveles de log granulares del 0 al 10:

| Nivel | Descripción | Uso recomendado |
|-------|-------------|-----------------|
| 0 | Solo errores críticos y mensajes del sistema | Producción normal |
| 1 | Advertencias y mensajes informativos básicos | Producción (predeterminado) |
| 2 | Información de conexiones y desconexiones | Diagnóstico básico |
| 3 | Operaciones de archivos detalladas | Problemas de acceso |
| 4 | Operaciones de bloqueo de archivos | Problemas de bloqueo |
| 5 | Llamadas RPC y operaciones internas | Diagnóstico avanzado |
| 6-7 | Información detallada de protocolo | Desarrollo/debug |
| 8-9 | Volcado de paquetes parcial | Desarrollo |
| 10 | Volcado completo de datos (muy verboso) | Solo depuración extrema |

### Configuración de niveles de log

```ini
[global]
# Nivel global de log
log level = 1

# Niveles por componente (más granular)
log level = 1 auth:3 passdb:5 winbind:2 smb:3

# Componentes disponibles para log selectivo:
# all, tdb, printdrivers, lanman, smb, rpc_parse, rpc_srv,
# rpc_cli, passdb, sam, auth, winbind, vfs, idmap, quota,
# acls, locking, msdfs, dmapi, registry, scavenger, dns,
# ldb, tevent, auth_audit, auth_json_audit, kerberos, drs_repl
```

### Cambiar nivel de log en caliente

```bash
# Aumentar nivel de log temporalmente sin reiniciar
smbcontrol smbd debug 3

# Para todos los procesos
smbcontrol all debug 3

# Volver al nivel normal
smbcontrol all debug 1

# Para un PID específico
smbcontrol 12345 debug 5
```

> **Para el examen:** Es crucial conocer los niveles de log y la capacidad de ajustarlos por componente. El nivel 3 es normalmente suficiente para diagnosticar problemas de acceso. Nunca usar nivel 10 en producción.

## Análisis de tráfico SMB

### Wireshark para SMB

Wireshark es la herramienta principal para analizar tráfico SMB:

```bash
# Capturar tráfico SMB con tshark (versión CLI de Wireshark)
tshark -i eth0 -f "port 445 or port 139"

# Filtrar solo negociación SMB
tshark -i eth0 -Y "smb2.cmd == 0" -f "port 445"

# Guardar captura para análisis posterior
tshark -i eth0 -f "port 445" -w captura_smb.pcap

# Filtros útiles de Wireshark para SMB:
# smb2           - Todo tráfico SMB2/3
# smb            - Tráfico SMB1
# smb2.cmd == 5  - Operaciones de creación/apertura
# smb2.nt_status != 0 - Respuestas con error
```

### tcpdump para SMB

```bash
# Capturar tráfico en puertos SMB
tcpdump -i eth0 port 445 or port 139 -w smb_capture.pcap

# Capturar con detalle
tcpdump -i eth0 -vvv port 445

# Filtrar por host específico
tcpdump -i eth0 host 192.168.1.10 and port 445

# Capturar tráfico NetBIOS
tcpdump -i eth0 port 137 or port 138

# Capturar tráfico Kerberos (útil en AD)
tcpdump -i eth0 port 88
```

> **Para el examen:** Conocer los puertos a filtrar (445, 139, 137, 138) y los filtros básicos de Wireshark para SMB. tcpdump es útil para capturas rápidas en servidores sin interfaz gráfica.

## Diagnóstico con herramientas Samba

### testparm para validación

```bash
# Verificar configuración y errores
testparm

# Mostrar configuración efectiva silenciosamente
testparm -s

# Verificar acceso de un host específico a un recurso
testparm /etc/samba/smb.conf 192.168.1.100

# Mostrar todos los parámetros (incluidos valores por defecto)
testparm -s -v
```

### smbclient para pruebas de conectividad

```bash
# Verificar que el servidor responde y listar recursos
smbclient -L //servidor -U usuario

# Probar acceso anónimo
smbclient -L //servidor -N

# Probar acceso a un recurso específico
smbclient //servidor/recurso -U usuario -c "ls"

# Forzar protocolo específico para probar compatibilidad
smbclient -L //servidor -U usuario -m SMB2
smbclient -L //servidor -U usuario -m SMB3

# Modo debug para más información
smbclient -L //servidor -U usuario -d 3
```

### wbinfo para diagnóstico de winbind

```bash
# Verificar que winbindd responde
wbinfo -p

# Listar usuarios del dominio
wbinfo -u

# Listar grupos del dominio
wbinfo -g

# Verificar autenticación de un usuario
wbinfo -a usuario%contraseña

# Obtener SID del dominio
wbinfo -s nombre_dominio

# Mapear usuario a UID
wbinfo --name-to-sid usuario
wbinfo --sid-to-uid S-1-5-...

# Verificar mapeo de IDs
wbinfo --uid-info UID
wbinfo --gid-info GID

# Verificar la confianza del dominio
wbinfo -t

# Listar dominios de confianza
wbinfo --trusted-domains

# Obtener información del DC
wbinfo --dsgetdcname=DOMINIO
```

### getent para verificar integración NSS

```bash
# Listar usuarios del sistema (incluidos los de dominio)
getent passwd

# Buscar un usuario específico
getent passwd usuario_dominio

# Listar grupos (incluidos los de dominio)
getent group

# Buscar un grupo específico
getent group grupo_dominio

# Si los usuarios de dominio no aparecen:
# 1. Verificar nsswitch.conf
# 2. Verificar que winbindd está funcionando
# 3. Verificar con wbinfo -u primero
```

## Resolución de nombres

### Orden de resolución de nombres

El parámetro `name resolve order` en smb.conf define la secuencia:

```ini
[global]
# Orden predeterminado
name resolve order = lmhosts wins host bcast
```

| Método | Descripción |
|--------|-------------|
| `lmhosts` | Archivo estático `/etc/samba/lmhosts` |
| `wins` | Consulta al servidor WINS |
| `host` | Resolución DNS del sistema (`/etc/hosts`, DNS) |
| `bcast` | Broadcast NetBIOS en la subred local |

### Diagnóstico de problemas de resolución

```bash
# Probar resolución NetBIOS
nmblookup SERVIDOR

# Probar resolución DNS
host servidor.dominio.com
dig servidor.dominio.com
nslookup servidor.dominio.com

# Verificar archivo lmhosts
cat /etc/samba/lmhosts

# Probar WINS
nmblookup -R -U ip_wins SERVIDOR

# Verificar registros SRV de AD
dig _ldap._tcp.dominio.com SRV
dig _kerberos._tcp.dominio.com SRV
```

> **Para el examen:** El orden predeterminado es `lmhosts wins host bcast`. Conocer cada método y cuándo se utiliza es fundamental para diagnosticar problemas de resolución de nombres.

## Problemas comunes de permisos

### Capas de permisos en Samba

Los permisos se evalúan en este orden:

1. **Permisos de smb.conf**: `valid users`, `read only`, `write list`, etc.
2. **ACLs de Samba/NT**: Si se usan ACLs NT (con módulo VFS acl_xattr)
3. **Permisos POSIX**: Permisos del sistema de archivos Linux (rwx)

El acceso efectivo es el **más restrictivo** de todas las capas.

### Diagnóstico de permisos

```bash
# Verificar permisos POSIX del directorio compartido
ls -la /srv/samba/datos/

# Verificar ACLs extendidas
getfacl /srv/samba/datos/

# Verificar que el usuario existe y tiene el grupo correcto
id usuario

# Verificar mapeo de usuario de dominio
wbinfo --name-to-sid "DOMINIO\\usuario"
wbinfo --sid-to-uid SID

# Verificar con qué identidad accede el usuario
smbstatus -u usuario
```

### Errores comunes y soluciones

| Error | Causa probable | Solución |
|-------|---------------|----------|
| `NT_STATUS_ACCESS_DENIED` | Permisos insuficientes | Verificar smb.conf y permisos POSIX |
| `NT_STATUS_LOGON_FAILURE` | Credenciales incorrectas | Verificar passdb, Kerberos o AD |
| `NT_STATUS_BAD_NETWORK_NAME` | Recurso no existe | Verificar nombre y que el recurso está definido |
| `NT_STATUS_CONNECTION_REFUSED` | smbd no escucha | Verificar que smbd está activo y puertos abiertos |
| `NT_STATUS_HOST_UNREACHABLE` | Problema de red | Verificar conectividad, firewall, routing |
| `NT_STATUS_OBJECT_NAME_NOT_FOUND` | Archivo/directorio no existe | Verificar la ruta en el servidor |
| `NT_STATUS_SHARING_VIOLATION` | Archivo bloqueado | Verificar con smbstatus -L |
| `NT_STATUS_NO_TRUST_SAM_ACCOUNT` | Cuenta de máquina inválida | Reunirse al dominio con net ads join |

## Problemas de DNS en entornos AD

```bash
# Verificar que los registros SRV existen
dig _ldap._tcp.dc._msdcs.dominio.com SRV
dig _kerberos._tcp.dc._msdcs.dominio.com SRV

# Verificar resolución del DC
dig dc.dominio.com

# Verificar resolución inversa
dig -x IP_DEL_DC

# Verificar configuración DNS del cliente
cat /etc/resolv.conf

# Comprobar que el DC de Samba responde consultas DNS
samba-tool dns query localhost dominio.com @ ALL
```

## Escenarios de diagnóstico completo

### Paso 1: Verificar servicios

```bash
systemctl status smbd nmbd winbindd
ss -tlnp | grep -E "445|139"
ss -ulnp | grep -E "137|138"
```

### Paso 2: Verificar configuración

```bash
testparm -s
```

### Paso 3: Verificar conectividad

```bash
smbclient -L //localhost -U usuario
nmblookup -A 127.0.0.1
```

### Paso 4: Verificar integración con dominio

```bash
net ads testjoin
wbinfo -t
wbinfo -u
getent passwd usuario_dominio
```

### Paso 5: Aumentar logs y analizar

```bash
smbcontrol all debug 3
tail -f /var/log/samba/log.smbd
# Reproducir el problema
smbcontrol all debug 1
```

### Paso 6: Captura de red (si necesario)

```bash
tcpdump -i eth0 port 445 -w debug.pcap
# Reproducir el problema
# Analizar con Wireshark
```

## Resumen de conceptos clave

- Niveles de log del 0 al 10, ajustables por componente y en caliente con `smbcontrol`
- Wireshark y tcpdump para análisis de tráfico SMB (puertos 445, 139, 137, 138)
- `testparm` valida configuración; `smbclient -L` prueba conectividad
- `wbinfo` diagnostica problemas de winbind y dominio
- `getent` verifica integración NSS con usuarios/grupos de dominio
- Orden de resolución: lmhosts, wins, host, bcast
- Los permisos se evalúan en capas: smb.conf > ACLs NT > permisos POSIX
- Los códigos `NT_STATUS_*` identifican el tipo de error específico
