---
title: "209.1 - Configuración del servidor Samba"
tags: [lpic-2, examen-202, tema-209, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "209"
subtema: "209.1"
---

# 209.1 - Comandos clave: Configuración del servidor Samba

## Gestión de usuarios de Samba

| Comando | Descripción |
|---|---|
| `smbpasswd -a usuario` | Añade un usuario a la base de datos de Samba |
| `smbpasswd usuario` | Cambia la contraseña de un usuario de Samba |
| `smbpasswd -e usuario` | Habilita un usuario deshabilitado |
| `smbpasswd -d usuario` | Deshabilita un usuario |
| `smbpasswd -x usuario` | Elimina un usuario de la base de datos |
| `pdbedit -L` | Lista todos los usuarios de Samba |
| `pdbedit -L -v` | Lista usuarios con información detallada |
| `pdbedit -a usuario` | Añade un usuario a la base de datos |
| `pdbedit -x usuario` | Elimina un usuario de la base de datos |
| `pdbedit -v usuario` | Muestra información detallada de un usuario |

## Herramientas de diagnóstico

| Comando | Descripción |
|---|---|
| `testparm` | Verifica la sintaxis de smb.conf |
| `testparm -s` | Verifica y muestra solo la configuración activa |
| `smbstatus` | Muestra las conexiones activas al servidor |
| `smbstatus -S` | Muestra solo los recursos compartidos en uso |
| `smbstatus -p` | Muestra solo los procesos |
| `smbstatus -L` | Muestra los archivos bloqueados |

## Cliente Samba

| Comando | Descripción |
|---|---|
| `smbclient -L //servidor -U usuario` | Lista los recursos compartidos de un servidor |
| `smbclient //servidor/recurso -U usuario` | Conecta a un recurso compartido de forma interactiva |
| `smbclient //servidor/recurso -U dominio\\usuario` | Conecta con usuario de dominio |
| `nmblookup NOMBRE` | Resuelve un nombre NetBIOS a dirección IP |
| `nmblookup -M GRUPO` | Busca el maestro de navegación del grupo de trabajo |
| `nmblookup '*'` | Busca todos los hosts NetBIOS en la red |

## Montaje de recursos CIFS

| Comando | Descripción |
|---|---|
| `mount -t cifs //srv/recurso /mnt -o username=usr` | Monta un recurso compartido SMB/CIFS |
| `mount -t cifs //srv/recurso /mnt -o credentials=/root/.smbcredentials` | Monta usando archivo de credenciales |
| `umount /mnt/samba` | Desmonta un recurso compartido |

## Comando net

| Comando | Descripción |
|---|---|
| `net ads join -U admin` | Une el servidor a un dominio Active Directory |
| `net ads leave -U admin` | Sale del dominio Active Directory |
| `net ads testjoin` | Verifica la unión al dominio |
| `net ads info` | Muestra información del dominio |
| `net rpc share list -U usuario -S servidor` | Lista recursos compartidos remotos vía RPC |
| `net time -S servidor` | Muestra la hora del servidor remoto |

## Directivas principales de smb.conf

| Directiva | Valor ejemplo | Descripción |
|---|---|---|
| `workgroup` | `MIGRUPO` | Grupo de trabajo o dominio |
| `server string` | `Servidor %v` | Descripción del servidor |
| `netbios name` | `SERVIDOR` | Nombre NetBIOS del servidor |
| `security` | `user` / `ads` | Modo de seguridad |
| `realm` | `EMPRESA.COM` | Realm Kerberos (para AD) |
| `path` | `/srv/samba/datos` | Ruta del directorio compartido |
| `browseable` | `yes` / `no` | Visible al explorar la red |
| `writable` | `yes` / `no` | Permite escritura |
| `valid users` | `@grupo, usuario` | Usuarios con acceso |
| `write list` | `@editores` | Usuarios con permiso de escritura |
| `create mask` | `0664` | Permisos para archivos nuevos |
| `directory mask` | `0775` | Permisos para directorios nuevos |
| `guest ok` | `yes` / `no` | Permite acceso de invitado |
| `hosts allow` | `192.168.1.` | Redes con acceso permitido |
| `username map` | `/etc/samba/smbusers` | Archivo de mapeo de usuarios |
| `log file` | `/var/log/samba/log.%m` | Archivo de log (por cliente) |

## Demonios y puertos

| Demonio | Puertos | Descripción |
|---|---|---|
| `smbd` | TCP 139, 445 | Servicio de archivos e impresoras |
| `nmbd` | UDP 137, 138 | Servicio de nombres NetBIOS |
| `winbindd` | - | Integración con Active Directory |

## Archivos y directorios clave

| Ruta | Descripción |
|---|---|
| `/etc/samba/smb.conf` | Archivo de configuración principal |
| `/etc/samba/smbusers` | Archivo de mapeo de usuarios |
| `/var/log/samba/` | Directorio de logs de Samba |
| `/var/lib/samba/` | Base de datos y archivos de estado |
| `/var/lib/samba/private/passdb.tdb` | Base de datos de contraseñas (tdbsam) |
