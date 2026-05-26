---
title: "212.2 - Servidores FTP: Comandos clave"
tags: [lpic-2, examen-202, tema-212, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.2"
---

# 212.2 - Servidores FTP: Comandos clave

## Gestión del servicio vsftpd

| Comando | Descripción |
|---------|-------------|
| `systemctl start vsftpd` | Iniciar el servicio vsftpd |
| `systemctl enable vsftpd` | Habilitar inicio automático |
| `systemctl status vsftpd` | Verificar estado del servicio |
| `systemctl restart vsftpd` | Reiniciar tras cambios de configuración |

## Directivas principales de vsftpd.conf

| Directiva | Valor | Descripción |
|-----------|-------|-------------|
| `anonymous_enable` | YES/NO | Acceso anónimo |
| `local_enable` | YES/NO | Acceso de usuarios locales |
| `write_enable` | YES/NO | Permitir escritura |
| `chroot_local_user` | YES/NO | Confinar usuarios a su home |
| `chroot_list_enable` | YES/NO | Habilitar lista de excepciones chroot |
| `chroot_list_file` | ruta | Archivo con excepciones chroot |
| `ssl_enable` | YES/NO | Habilitar cifrado TLS |
| `pasv_enable` | YES/NO | Habilitar modo pasivo |
| `pasv_min_port` | puerto | Inicio del rango de puertos pasivos |
| `pasv_max_port` | puerto | Fin del rango de puertos pasivos |
| `pasv_address` | IP | IP pública para NAT |
| `userlist_enable` | YES/NO | Habilitar lista de control de usuarios |
| `userlist_deny` | YES/NO | YES=lista negra, NO=lista blanca |
| `local_umask` | 022 | Máscara de permisos para archivos subidos |
| `max_clients` | número | Conexiones simultáneas totales |
| `max_per_ip` | número | Conexiones simultáneas por IP |
| `allow_writeable_chroot` | YES/NO | Permitir escritura en directorio chroot |
| `force_local_logins_ssl` | YES/NO | Forzar TLS en autenticación |
| `force_local_data_ssl` | YES/NO | Forzar TLS en transferencia de datos |

## Pure-FTPd

| Comando | Descripción |
|---------|-------------|
| `pure-pw useradd usuario -u ftpuser -d /home/ftp/usuario` | Crear usuario virtual |
| `pure-pw userdel usuario` | Eliminar usuario virtual |
| `pure-pw passwd usuario` | Cambiar contraseña |
| `pure-pw mkdb` | Regenerar base de datos de usuarios |
| `pure-pw list` | Listar usuarios virtuales |
| `pure-pw show usuario` | Ver detalles de un usuario |

## ProFTPD

| Comando / Directiva | Descripción |
|---------------------|-------------|
| `proftpd -t` | Verificar sintaxis de configuración |
| `ftpwho` | Ver usuarios conectados actualmente |
| `ftpcount` | Ver número de conexiones activas |
| `DefaultRoot ~` | Confinar usuarios a su directorio home |
| `TLSEngine on` | Habilitar TLS en ProFTPD |

## Archivos de configuración relevantes

| Archivo | Descripción |
|---------|-------------|
| `/etc/vsftpd.conf` | Configuración principal de vsftpd |
| `/etc/vsftpd.userlist` | Lista de usuarios permitidos/denegados |
| `/etc/vsftpd.chroot_list` | Lista de excepciones al chroot |
| `/etc/ftpusers` | Usuarios denegados por PAM (lista negra del sistema) |
| `/etc/proftpd/proftpd.conf` | Configuración principal de ProFTPD |
| `/etc/pure-ftpd/conf/` | Directorio de configuración de Pure-FTPd |
| `/etc/pure-ftpd/pureftpd.pdb` | Base de datos de usuarios virtuales |

## Clientes y diagnóstico

| Comando | Descripción |
|---------|-------------|
| `ftp servidor` | Cliente FTP básico de línea de comandos |
| `lftp servidor` | Cliente FTP avanzado con soporte TLS |
| `curl -u user:pass ftp://servidor/archivo` | Transferencia con curl |
| `netstat -tlnp \| grep :21` | Verificar que el servidor escucha en puerto 21 |
| `ss -tlnp \| grep :21` | Verificar con ss (alternativa moderna) |
