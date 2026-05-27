---
tipo: comandos
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.1"
titulo: "Samba como DC - Comandos Clave"
peso: 5
tags:
  - lpic-3
  - tema-302
  - comandos
---

# Comandos clave - 302.1 Samba como Controlador de Dominio

## Aprovisionamiento del dominio

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool domain provision` | Crear nuevo dominio AD | `samba-tool domain provision --realm=EMPRESA.COM --domain=EMPRESA --server-role=dc --dns-backend=SAMBA_INTERNAL --adminpass='P@ss123'` |
| `samba-tool domain provision --use-rfc2307` | Provisionar con atributos POSIX | Agrega `--use-rfc2307` al comando anterior |
| `samba-tool domain join DOM DC` | Unir DC adicional | `samba-tool domain join empresa.com DC -U administrator --dns-backend=SAMBA_INTERNAL` |
| `samba-tool domain info IP` | Info del dominio desde un DC | `samba-tool domain info 10.0.0.1` |
| `samba-tool domain level show` | Mostrar nivel funcional | `samba-tool domain level show` |
| `samba-tool domain level raise` | Elevar nivel funcional | `samba-tool domain level raise --domain-level=2008_R2` |

## Roles FSMO

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool fsmo show` | Mostrar titulares de roles FSMO | `samba-tool fsmo show` |
| `samba-tool fsmo transfer --role=X` | Transferir rol (ordenado) | `samba-tool fsmo transfer --role=rid` |
| `samba-tool fsmo seize --role=X` | Tomar rol forzosamente | `samba-tool fsmo seize --role=pdc --force` |
| `samba-tool fsmo seize --role=all` | Tomar todos los roles | `samba-tool fsmo seize --role=all --force` |

## Replicación DRS

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool drs showrepl` | Estado de replicación | `samba-tool drs showrepl` |
| `samba-tool drs replicate` | Forzar replicación | `samba-tool drs replicate dc2 dc1 dc=empresa,dc=com` |
| `samba-tool drs kcc` | Ejecutar KCC | `samba-tool drs kcc` |
| `samba-tool drs options` | Ver opciones de replicación | `samba-tool drs options` |

## Gestión de usuarios AD

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool user list` | Listar usuarios | `samba-tool user list` |
| `samba-tool user create` | Crear usuario | `samba-tool user create pedro 'P@ss123'` |
| `samba-tool user delete` | Eliminar usuario | `samba-tool user delete pedro` |
| `samba-tool user disable` | Deshabilitar usuario | `samba-tool user disable pedro` |
| `samba-tool user enable` | Habilitar usuario | `samba-tool user enable pedro` |
| `samba-tool user setpassword` | Cambiar contraseña | `samba-tool user setpassword pedro --newpassword='Nueva123'` |

## Gestión de grupos AD

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool group list` | Listar grupos | `samba-tool group list` |
| `samba-tool group add` | Crear grupo | `samba-tool group add desarrollo` |
| `samba-tool group delete` | Eliminar grupo | `samba-tool group delete desarrollo` |
| `samba-tool group addmembers` | Añadir miembros | `samba-tool group addmembers desarrollo pedro,maria` |
| `samba-tool group removemembers` | Quitar miembros | `samba-tool group removemembers desarrollo pedro` |
| `samba-tool group listmembers` | Listar miembros | `samba-tool group listmembers desarrollo` |

## Gestión de DNS

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool dns zonelist` | Listar zonas DNS | `samba-tool dns zonelist localhost -U administrator` |
| `samba-tool dns query` | Consultar registro DNS | `samba-tool dns query localhost empresa.com @ ALL -U admin` |
| `samba-tool dns add` | Añadir registro DNS | `samba-tool dns add localhost empresa.com host A 10.0.0.50 -U admin` |
| `samba-tool dns delete` | Eliminar registro DNS | `samba-tool dns delete localhost empresa.com host A 10.0.0.50 -U admin` |
| `samba-tool dns update` | Actualizar registro DNS | `samba-tool dns update localhost empresa.com host A 10.0.0.50 10.0.0.51 -U admin` |
| `samba-tool dns zonecreate` | Crear zona DNS | `samba-tool dns zonecreate localhost 1.168.192.in-addr.arpa -U admin` |

## Confianzas de dominio

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool domain trust create` | Crear confianza | `samba-tool domain trust create otro.com --type=external --direction=both -U admin` |
| `samba-tool domain trust list` | Listar confianzas | `samba-tool domain trust list` |
| `samba-tool domain trust validate` | Validar confianza | `samba-tool domain trust validate otro.com` |
| `samba-tool domain trust delete` | Eliminar confianza | `samba-tool domain trust delete otro.com` |

## Kerberos y verificación

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `kinit administrator@REALM` | Obtener ticket Kerberos | `kinit administrator@EMPRESA.COM` |
| `klist` | Listar tickets Kerberos | `klist` |
| `kdestroy` | Destruir tickets | `kdestroy` |
| `samba-tool dbcheck` | Verificar BD de AD | `samba-tool dbcheck` |
| `samba-tool dbcheck --fix` | Reparar BD de AD | `samba-tool dbcheck --fix` |

## Gestión de GPOs

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `samba-tool gpo listall` | Listar todas las GPOs | `samba-tool gpo listall` |
| `samba-tool gpo show` | Mostrar detalles de GPO | `samba-tool gpo show {GUID}` |
| `samba-tool gpo create` | Crear GPO | `samba-tool gpo create "Mi GPO" -U admin` |
| `samba-tool gpo setlink` | Vincular GPO a OU | `samba-tool gpo setlink {GUID} "OU=Ventas,DC=empresa,DC=com"` |
