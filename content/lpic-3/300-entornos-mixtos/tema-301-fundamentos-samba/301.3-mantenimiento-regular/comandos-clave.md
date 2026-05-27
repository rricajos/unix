---
tipo: comandos
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.3"
titulo: "Mantenimiento Regular - Comandos Clave"
peso: 2
tags:
  - lpic-3
  - tema-301
  - comandos
---

# Comandos clave - 301.3 Mantenimiento Regular

## Monitorización de conexiones

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `smbstatus` | Mostrar todas las conexiones y bloqueos | `smbstatus` |
| `smbstatus -b` | Resumen breve de conexiones | `smbstatus -b` |
| `smbstatus -S` | Mostrar recursos compartidos en uso | `smbstatus -S` |
| `smbstatus -L` | Mostrar archivos bloqueados | `smbstatus -L` |
| `smbstatus -u usuario` | Filtrar por usuario | `smbstatus -u pedro` |
| `smbstatus -p` | Formato parseable para scripts | `smbstatus -p` |

## Consultas NetBIOS

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `nmblookup nombre` | Resolver nombre NetBIOS | `nmblookup SERVIDOR` |
| `nmblookup -A ip` | Tabla de nombres de un host | `nmblookup -A 192.168.1.10` |
| `nmblookup -M grupo` | Buscar Master Browser | `nmblookup -M MIGRUPO` |
| `nmblookup -S nombre` | Consultar servicios | `nmblookup -S SERVIDOR` |
| `nmblookup -R -U wins nombre` | Consultar vía WINS | `nmblookup -R -U 10.0.0.1 HOST` |

## Cliente SMB

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `smbclient -L //srv -U user` | Listar recursos compartidos | `smbclient -L //srvfiles -U admin` |
| `smbclient //srv/share -U user` | Conectarse a un recurso | `smbclient //srvfiles/datos -U admin` |
| `smbclient -L //srv -N` | Listar sin autenticación | `smbclient -L //srvfiles -N` |
| `smbclient -c "comando"` | Ejecutar comando directo | `smbclient //srv/share -U user -c "ls"` |
| `smbclient -k //srv/share` | Conectar con Kerberos | `smbclient -k //srvfiles/datos` |

## Administración RPC

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `rpcclient -U user srv` | Conectarse vía RPC | `rpcclient -U admin servidor` |
| `rpcclient: srvinfo` | Información del servidor | (interactivo) |
| `rpcclient: enumdomusers` | Listar usuarios del dominio | (interactivo) |
| `rpcclient: enumdomgroups` | Listar grupos del dominio | (interactivo) |
| `rpcclient: netshareenum` | Listar recursos compartidos | (interactivo) |
| `rpcclient: queryuser RID` | Info de usuario por RID | `queryuser 500` |
| `rpcclient: lookupnames nombre` | Obtener SID de un nombre | `lookupnames admin` |

## Comando net

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `net rpc user list -S srv` | Listar usuarios remotos | `net rpc user list -U admin -S srv` |
| `net rpc share list` | Listar recursos compartidos | `net rpc share list -U admin -S srv` |
| `net rpc info` | Información del dominio | `net rpc info -U admin -S srv` |
| `net ads join` | Unirse a dominio AD | `net ads join -U admin` |
| `net ads testjoin` | Verificar unión AD | `net ads testjoin` |
| `net ads info` | Info del dominio AD | `net ads info` |
| `net ads search` | Buscar en LDAP de AD | `net ads search "(cn=usuario)"` |
| `net registry enumerate` | Listar claves del registro | `net registry enumerate HKLM\\Software` |
| `net time -S srv` | Hora del servidor | `net time -S servidor` |
| `net cache flush` | Limpiar caché de nombres | `net cache flush` |

## Herramientas TDB

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `tdbbackup archivo.tdb` | Crear backup de TDB | `tdbbackup /var/lib/samba/secrets.tdb` |
| `tdbbackup -v archivo.tdb` | Verificar integridad | `tdbbackup -v /var/lib/samba/passdb.tdb` |
| `tdbbackup -s .bak` | Backup con sufijo custom | `tdbbackup -s .bak secrets.tdb` |
| `tdbtool archivo.tdb` | Abrir TDB interactivamente | `tdbtool /var/lib/samba/registry.tdb` |
| `tdbdump archivo.tdb` | Volcar contenido completo | `tdbdump /var/lib/samba/wins.tdb` |

## Mantenimiento y backup

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `testparm` | Verificar smb.conf tras cambios | `testparm -s` |
| `samba-tool dbcheck` | Verificar BD de AD DC | `samba-tool dbcheck` |
| `samba-tool dbcheck --fix` | Reparar problemas en BD de AD | `samba-tool dbcheck --fix` |
| `systemctl restart smbd` | Reiniciar servicio smbd | `systemctl restart smbd nmbd` |
| `smbcontrol all reload-config` | Recargar configuración sin reiniciar | `smbcontrol all reload-config` |
