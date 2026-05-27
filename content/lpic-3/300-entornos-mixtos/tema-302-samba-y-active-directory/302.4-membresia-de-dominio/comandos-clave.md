---
tipo: comandos
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.4"
titulo: "Membresía de Dominio - Comandos Clave"
peso: 4
tags:
  - lpic-3
  - tema-302
  - comandos
---

# Comandos clave - 302.4 Membresía de Dominio

## Unión al dominio

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `net ads join -U admin` | Unirse a dominio AD | `net ads join -U administrator` |
| `net ads testjoin` | Verificar unión al dominio | `net ads testjoin` |
| `net ads leave -U admin` | Abandonar dominio AD | `net ads leave -U administrator` |
| `net ads info` | Información del dominio AD | `net ads info` |
| `net ads status` | Estado de la cuenta de máquina | `net ads status -U administrator` |
| `realm discover dominio` | Descubrir dominio | `realm discover empresa.com` |
| `realm join dominio` | Unirse con realm/SSSD | `realm join empresa.com -U administrator` |
| `realm leave dominio` | Abandonar con realm | `realm leave empresa.com` |
| `realm list` | Listar dominios unidos | `realm list` |
| `realm permit usuario` | Permitir acceso | `realm permit pedro@empresa.com` |
| `realm permit --all` | Permitir todos | `realm permit --all` |
| `realm deny --all` | Denegar todos | `realm deny --all` |

## Kerberos

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `kinit usuario@REALM` | Obtener ticket TGT | `kinit administrator@EMPRESA.COM` |
| `kinit -R` | Renovar ticket | `kinit -R` |
| `klist` | Listar tickets activos | `klist` |
| `klist -e` | Listar con tipo de cifrado | `klist -e` |
| `kdestroy` | Destruir todos los tickets | `kdestroy` |
| `kvno servicio` | Obtener ticket para servicio | `kvno cifs/dc.empresa.com` |

## Verificación de winbind

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `wbinfo -p` | Ping a winbindd | `wbinfo -p` |
| `wbinfo -t` | Verificar confianza del dominio | `wbinfo -t` |
| `wbinfo -u` | Listar usuarios del dominio | `wbinfo -u` |
| `wbinfo -g` | Listar grupos del dominio | `wbinfo -g` |
| `wbinfo -a user%pass` | Probar autenticación | `wbinfo -a "EMPRESA\\pedro%secreto"` |
| `wbinfo --name-to-sid user` | Obtener SID de usuario | `wbinfo --name-to-sid pedro` |
| `wbinfo --sid-to-uid SID` | Mapear SID a UID | `wbinfo --sid-to-uid S-1-5-21-...` |
| `wbinfo --uid-info UID` | Info de UID | `wbinfo --uid-info 20500` |
| `wbinfo --gid-info GID` | Info de GID | `wbinfo --gid-info 20513` |
| `wbinfo -i usuario` | Info completa de usuario | `wbinfo -i pedro` |
| `wbinfo --trusted-domains` | Listar dominios de confianza | `wbinfo --trusted-domains` |

## Verificación NSS

| Comando | Función | Ejemplo |
|---------|---------|---------|
| `getent passwd` | Listar todos los usuarios | `getent passwd` |
| `getent passwd usuario` | Buscar usuario específico | `getent passwd pedro` |
| `getent group` | Listar todos los grupos | `getent group` |
| `getent group grupo` | Buscar grupo específico | `getent group "Domain Users"` |
| `id usuario` | UID, GID y grupos de usuario | `id pedro` |

## Archivos de configuración

| Archivo | Función | Ubicación |
|---------|---------|-----------|
| `krb5.conf` | Configuración de Kerberos | `/etc/krb5.conf` |
| `smb.conf` | Config Samba (servidor miembro) | `/etc/samba/smb.conf` |
| `nsswitch.conf` | Orden de resolución de nombres | `/etc/nsswitch.conf` |
| `sssd.conf` | Configuración de SSSD | `/etc/sssd/sssd.conf` |
| `pam_winbind.conf` | Opciones PAM de winbind | `/etc/security/pam_winbind.conf` |
| `common-auth` | Autenticación PAM | `/etc/pam.d/common-auth` |
| `common-session` | Sesiones PAM | `/etc/pam.d/common-session` |

## Configuración idmap en smb.conf

| Parámetro | Función | Ejemplo |
|-----------|---------|---------|
| `idmap config * : backend = tdb` | Backend comodín | Para dominios desconocidos |
| `idmap config * : range = 10000-19999` | Rango comodín | Rango para backend tdb |
| `idmap config EMPRESA : backend = rid` | Backend RID | UID = base + RID |
| `idmap config EMPRESA : backend = ad` | Backend AD/RFC2307 | Lee atributos de AD |
| `idmap config EMPRESA : backend = autorid` | Backend automático | Asigna rangos automáticamente |
| `idmap config EMPRESA : range = 20000-99999` | Rango del dominio | Rango para el dominio |
| `template shell = /bin/bash` | Shell por defecto | Para usuarios de dominio |
| `template homedir = /home/%U` | Home por defecto | Para usuarios de dominio |
| `winbind use default domain = yes` | Omitir prefijo DOMINIO\ | Permite login sin prefijo |
| `winbind enum users = yes` | Enumerar usuarios | Necesario para getent passwd |
| `winbind enum groups = yes` | Enumerar grupos | Necesario para getent group |
| `winbind offline logon = yes` | Login offline con caché | Permite login sin red |

## PAM y creación de homes

| Comando/Config | Función | Ejemplo |
|----------------|---------|---------|
| `pam-auth-update --enable winbind` | Habilitar PAM winbind | (Debian/Ubuntu) |
| `pam_mkhomedir.so` | Crear homes automáticamente | En `/etc/pam.d/common-session` |
| `mkhomedir_helper usuario` | Crear home manualmente | `mkhomedir_helper pedro` |
