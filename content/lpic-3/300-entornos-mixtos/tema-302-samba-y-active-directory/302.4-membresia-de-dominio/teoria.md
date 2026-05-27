---
tipo: teoria
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.4"
titulo: "Membresía de Dominio"
peso: 4
tags:
  - lpic-3
  - tema-302
  - teoria
---

# 302.4 Membresía de Dominio

## Objetivos del subtema

Este subtema cubre la configuración de un servidor Linux como miembro de un dominio Active Directory, incluyendo los métodos de unión (net ads, realm), integración con SSSD y winbind, configuración de Kerberos, PAM, NSS y los backends idmap.

## Unión al dominio con net ads join

### Requisitos previos

- DNS configurado apuntando al controlador de dominio AD
- Kerberos configurado correctamente (`/etc/krb5.conf`)
- Paquetes Samba instalados (samba, winbind, libpam-winbind, libnss-winbind)
- Sincronización de tiempo con el DC (NTP)

### Configuración de /etc/krb5.conf

```ini
[libdefaults]
    default_realm = EMPRESA.COM
    dns_lookup_realm = false
    dns_lookup_kdc = true
    rdns = false

[realms]
    EMPRESA.COM = {
        kdc = dc.empresa.com
        admin_server = dc.empresa.com
    }

[domain_realm]
    .empresa.com = EMPRESA.COM
    empresa.com = EMPRESA.COM
```

### Configuración de smb.conf para servidor miembro

```ini
[global]
    workgroup = EMPRESA
    realm = EMPRESA.COM
    security = ads
    server role = member server

    # Kerberos
    kerberos method = secrets and keytab
    dedicated keytab file = /etc/krb5.keytab

    # Winbind
    winbind use default domain = yes
    winbind enum users = yes
    winbind enum groups = yes
    winbind refresh tickets = yes
    winbind offline logon = yes

    # Mapeo de IDs
    idmap config * : backend = tdb
    idmap config * : range = 10000-19999
    idmap config EMPRESA : backend = rid
    idmap config EMPRESA : range = 20000-99999

    # Opciones de mapeo de nombres
    template shell = /bin/bash
    template homedir = /home/%U
```

### Proceso de unión al dominio

```bash
# 1. Obtener ticket Kerberos del administrador
kinit administrator@EMPRESA.COM

# 2. Unirse al dominio
net ads join -U administrator

# 3. Verificar la unión
net ads testjoin

# 4. Iniciar servicios
systemctl restart smbd nmbd winbindd

# 5. Verificar que funciona
wbinfo -t
wbinfo -u
wbinfo -g
getent passwd
getent group
```

> **Para el examen:** `net ads join` es el comando principal para unir un servidor Linux a un dominio AD. Requiere credenciales de administrador del dominio y Kerberos funcional.

## Unión al dominio con realm join

`realm` (de SSSD/realmd) es una alternativa moderna a `net ads join`:

```bash
# Descubrir el dominio
realm discover empresa.com

# Unirse al dominio
realm join empresa.com -U administrator

# Verificar estado
realm list

# Permitir acceso a ciertos usuarios
realm permit usuario1@empresa.com usuario2@empresa.com

# Permitir acceso a todos
realm permit --all

# Denegar acceso a todos
realm deny --all

# Abandonar el dominio
realm leave empresa.com
```

### Ventajas de realm

- Configura automáticamente SSSD, Kerberos, PAM y NSS
- Interfaz más simple e integrada
- Descubrimiento automático del dominio vía DNS
- Gestión de permisos de acceso por usuario/grupo

## SSSD para integración con AD

SSSD (System Security Services Daemon) es una alternativa a winbind para integración con AD:

### Configuración de /etc/sssd/sssd.conf

```ini
[sssd]
domains = empresa.com
config_file_version = 2
services = nss, pam

[domain/empresa.com]
ad_domain = empresa.com
krb5_realm = EMPRESA.COM
realmd_tags = manages-system joined-with-samba
cache_credentials = True
id_provider = ad
access_provider = ad
auth_provider = ad
chpass_provider = ad
ldap_id_mapping = True

# Mapeo de atributos POSIX
# ldap_id_mapping = False  # Si se usan atributos RFC2307

# Directorio home
fallback_homedir = /home/%u@%d
override_homedir = /home/%u

# Shell predeterminado
default_shell = /bin/bash

# Filtro de acceso (opcional)
ad_access_filter = memberOf=CN=LinuxUsers,OU=Groups,DC=empresa,DC=com

# Opciones de caché
entry_cache_timeout = 5400
```

### SSSD vs Winbind

| Característica | SSSD | Winbind |
|---------------|------|---------|
| Integración AD | Nativa (id_provider=ad) | Vía Samba |
| Caché offline | Sí (robusto) | Sí (winbind offline logon) |
| Compartir archivos SMB | No (requiere Samba separado) | Integrado con Samba |
| Mapeo de IDs | ldap_id_mapping o RFC2307 | Múltiples backends idmap |
| GPO para acceso | Sí (ad_gpo_access_control) | No |
| Configuración | sssd.conf | smb.conf |
| Dependencias | sssd, realmd | samba-winbind |

> **Para el examen:** SSSD es preferido para autenticación de usuarios en estaciones de trabajo Linux. Winbind es necesario cuando el servidor también comparte archivos vía Samba (SMB).

## Winbind para integración con AD

### Configuración de NSS

```bash
# /etc/nsswitch.conf
passwd:     files winbind
group:      files winbind
shadow:     files winbind
```

### Configuración de PAM

```bash
# Configurar PAM para winbind (en Debian/Ubuntu)
pam-auth-update --enable winbind

# O manualmente en /etc/pam.d/common-auth:
auth    sufficient    pam_winbind.so
auth    required      pam_unix.so try_first_pass

# /etc/pam.d/common-account:
account sufficient    pam_winbind.so
account required      pam_unix.so

# /etc/pam.d/common-session:
session required      pam_mkhomedir.so skel=/etc/skel/ umask=0022
session sufficient    pam_winbind.so
session required      pam_unix.so
```

### Opciones importantes de PAM winbind

```ini
# /etc/security/pam_winbind.conf
[global]
krb5_auth = yes
krb5_ccache_type = FILE
cached_login = yes
require_membership_of = S-1-5-21-xxx-xxx-xxx-1001
```

### Verificación de winbind

```bash
# Verificar que winbindd responde
wbinfo -p

# Verificar confianza del dominio
wbinfo -t

# Listar usuarios del dominio
wbinfo -u

# Listar grupos del dominio
wbinfo -g

# Probar autenticación
wbinfo -a "EMPRESA\\pedro%contraseña"

# Verificar mapeo de usuario
wbinfo --name-to-sid "EMPRESA\\pedro"
wbinfo --sid-to-uid S-1-5-21-...

# Verificar integración NSS
getent passwd pedro
getent group "Domain Users"
id pedro
```

## Gestión de tickets Kerberos

### Operaciones con tickets

```bash
# Obtener un TGT (Ticket Granting Ticket)
kinit pedro@EMPRESA.COM

# Obtener TGT con contraseña interactiva
kinit pedro

# Listar tickets activos
klist

# Listar tickets con detalles
klist -e

# Destruir todos los tickets
kdestroy

# Renovar un ticket
kinit -R

# Obtener ticket para un servicio específico
kvno cifs/servidor.empresa.com
```

### Ejemplo de salida de klist

```
Ticket cache: FILE:/tmp/krb5cc_1000
Default principal: pedro@EMPRESA.COM

Valid starting     Expires            Service principal
05/26/26 10:00:00  05/26/26 20:00:00  krbtgt/EMPRESA.COM@EMPRESA.COM
        renew until 06/02/26 10:00:00
05/26/26 10:01:00  05/26/26 20:00:00  cifs/dc.empresa.com@EMPRESA.COM
```

> **Para el examen:** Conocer `kinit` (obtener ticket), `klist` (listar tickets) y `kdestroy` (destruir tickets). El ticket TGT tiene una validez predeterminada de 10 horas.

## Backends idmap en detalle

### idmap_rid

```ini
[global]
idmap config EMPRESA : backend = rid
idmap config EMPRESA : range = 20000-99999
```

- Calcula UID/GID = base_range + RID
- Determinista: mismo resultado en todos los servidores con misma configuración
- No requiere datos adicionales en AD
- Problema: diferentes dominios pueden tener RIDs que colisionen

### idmap_ad

```ini
[global]
idmap config EMPRESA : backend = ad
idmap config EMPRESA : range = 20000-99999
idmap config EMPRESA : schema_mode = rfc2307
```

- Lee uidNumber/gidNumber de los atributos RFC2307 en AD
- Permite control preciso de los IDs asignados
- Requiere que los atributos estén configurados en cada objeto
- Consistente entre servidores porque los datos están centralizados en AD

### idmap_autorid

```ini
[global]
idmap config * : backend = autorid
idmap config * : range = 10000-999999
idmap config * : rangesize = 100000
```

- Asigna automáticamente rangos de IDs a cada dominio
- Simplifica la configuración en entornos multidominio
- No requiere configuración por dominio
- Los IDs pueden variar entre servidores si el orden de descubrimiento cambia

### idmap_tdb

```ini
[global]
idmap config * : backend = tdb
idmap config * : range = 10000-19999
```

- Backend general para dominios no configurados específicamente
- Almacena mapeos en base de datos TDB local
- Los IDs pueden ser diferentes entre servidores
- Útil como backend comodín (`*`)

## Configuración de /etc/nsswitch.conf

```bash
# Para winbind
passwd:     files winbind
group:      files winbind
shadow:     files

# Para SSSD
passwd:     files sss
group:      files sss
shadow:     files sss
sudoers:    files sss

# Verificar que funciona
getent passwd usuario_dominio
getent group "Domain Users"
```

## Creación automática de directorios home

```bash
# Con PAM mkhomedir
# En /etc/pam.d/common-session:
session required pam_mkhomedir.so skel=/etc/skel umask=0077

# Con SSSD (en sssd.conf):
[domain/empresa.com]
override_homedir = /home/%u

# Con Samba (en smb.conf):
template homedir = /home/%U

# Crear el directorio manualmente si es necesario
mkhomedir_helper usuario
```

## Flujo completo de unión al dominio

```bash
# Paso 1: Instalar paquetes
apt install samba winbind libpam-winbind libnss-winbind krb5-user

# Paso 2: Configurar /etc/krb5.conf
# Paso 3: Configurar /etc/samba/smb.conf
# Paso 4: Configurar /etc/nsswitch.conf

# Paso 5: Probar Kerberos
kinit administrator@EMPRESA.COM
klist

# Paso 6: Unirse al dominio
net ads join -U administrator

# Paso 7: Iniciar servicios
systemctl restart smbd nmbd winbindd
systemctl enable smbd nmbd winbindd

# Paso 8: Verificar
net ads testjoin
wbinfo -t
wbinfo -u
getent passwd usuario_dominio
id usuario_dominio
```

## Resumen de conceptos clave

- `net ads join` y `realm join` son los dos métodos principales de unión a AD
- `/etc/krb5.conf` debe configurarse con el realm correcto (MAYÚSCULAS)
- SSSD es preferido para autenticación de estaciones; winbind cuando se comparte archivos SMB
- `/etc/nsswitch.conf` debe incluir `winbind` o `sss` para resolver usuarios/grupos de AD
- PAM se configura con `pam_winbind.so` o `pam_sss.so` para autenticación AD
- `kinit`/`klist`/`kdestroy` gestionan tickets Kerberos
- Backends idmap: `rid` (algorítmico), `ad` (RFC2307), `autorid` (automático), `tdb` (local)
- El backend `*` es el comodín para dominios no configurados explícitamente
