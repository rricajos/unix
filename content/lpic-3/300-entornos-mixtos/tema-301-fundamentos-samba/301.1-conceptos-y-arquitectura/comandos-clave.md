---
tipo: comandos
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "301"
subtema: "301.1"
titulo: "Conceptos y Arquitectura - Comandos Clave"
peso: 2
tags:
  - lpic-3
  - tema-301
  - comandos
---

# Comandos clave - 301.1 Conceptos y Arquitectura

## Demonios y servicios

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `smbd` | Demonio de archivos/impresoras SMB | `smbd -D` (modo demonio) |
| `nmbd` | Demonio de resolución de nombres NetBIOS | `nmbd -D` |
| `winbindd` | Demonio de integración con dominios Windows | `winbindd -D` |
| `samba` | Demonio unificado AD DC (Samba 4) | `samba -D` |
| `systemctl start smbd` | Iniciar servicio smbd con systemd | `systemctl enable --now smbd` |
| `systemctl start nmbd` | Iniciar servicio nmbd con systemd | `systemctl enable --now nmbd` |
| `systemctl start samba-ad-dc` | Iniciar Samba como AD DC | `systemctl enable --now samba-ad-dc` |

## Verificación y diagnóstico básico

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `smbd -V` | Mostrar versión de Samba | `smbd -V` → "Version 4.x.x" |
| `smbd -b` | Mostrar opciones de compilación | `smbd -b \| grep CONFIGFILE` |
| `testparm` | Validar sintaxis de smb.conf | `testparm /etc/samba/smb.conf` |
| `testparm -s` | Validar y mostrar configuración sin pausa | `testparm -s` |
| `smbstatus` | Mostrar conexiones activas y bloqueos | `smbstatus -b` (resumen breve) |

## Puertos y verificación de red

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `ss -tlnp \| grep smbd` | Verificar puertos de smbd | Muestra puertos 139 y 445 |
| `ss -ulnp \| grep nmbd` | Verificar puertos de nmbd | Muestra puertos 137 y 138 |
| `nmblookup` | Consultar nombres NetBIOS | `nmblookup -A 192.168.1.10` |
| `smbclient -L` | Listar recursos compartidos | `smbclient -L //servidor -U usuario` |
| `net lookup` | Resolución de nombres vía Samba | `net lookup dc DOMINIO` |

## Gestión de nombres NetBIOS y WINS

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `nmblookup nombre` | Resolver nombre NetBIOS | `nmblookup SERVIDOR` |
| `nmblookup -M DOMINIO` | Buscar Master Browser | `nmblookup -M MIGRUPO` |
| `nmblookup -S nombre` | Consultar servicios de un host | `nmblookup -S SERVIDOR` |
| `nmblookup -R -U wins nombre` | Consultar nombre vía WINS | `nmblookup -R -U 10.0.0.1 HOST` |

## Archivos de configuración relevantes

| Archivo | Función | Ubicación típica |
|---------|---------|-----------------|
| `smb.conf` | Configuración principal de Samba | `/etc/samba/smb.conf` |
| `lmhosts` | Resolución estática NetBIOS | `/etc/samba/lmhosts` |
| `secrets.tdb` | Secretos de máquina y dominio | `/var/lib/samba/private/secrets.tdb` |
| `passdb.tdb` | Base de datos de contraseñas locales | `/var/lib/samba/private/passdb.tdb` |
| `wins.dat` | Base de datos WINS | `/var/lib/samba/wins.dat` |

## Opciones clave de smb.conf para arquitectura

| Parámetro | Función | Ejemplo |
|-----------|---------|---------|
| `server role` | Define el rol del servidor | `server role = standalone server` |
| `workgroup` | Nombre del grupo de trabajo o dominio | `workgroup = MIDOMINIO` |
| `netbios name` | Nombre NetBIOS del servidor | `netbios name = SRVLINUX` |
| `wins support` | Activar servidor WINS | `wins support = yes` |
| `wins server` | IP del servidor WINS | `wins server = 10.0.0.1` |
| `name resolve order` | Orden de resolución de nombres | `name resolve order = wins lmhosts host bcast` |
| `server min protocol` | Protocolo SMB mínimo | `server min protocol = SMB2` |
| `server max protocol` | Protocolo SMB máximo | `server max protocol = SMB3` |
