---
tipo: teoria
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.1"
titulo: "Samba como Controlador de Dominio"
peso: 5
tags:
  - lpic-3
  - tema-302
  - teoria
---

# 302.1 Samba como Controlador de Dominio

## Objetivos del subtema

Este es el subtema con mayor peso de toda la especialidad 300. Cubre la configuración de Samba 4 como controlador de dominio Active Directory, incluyendo aprovisionamiento, roles FSMO, replicación, confianzas de dominio y gestión con samba-tool.

## Aprovisionamiento del dominio AD

### Requisitos previos

- Samba 4 compilado con soporte AD DC
- Nombre de host configurado correctamente (FQDN)
- DNS funcional o disposición para usar el DNS interno de Samba
- NTP sincronizado (Kerberos requiere diferencia menor a 5 minutos)
- No deben ejecutarse smbd/nmbd/winbindd independientes

### Comando de aprovisionamiento

```bash
# Aprovisionamiento interactivo
samba-tool domain provision

# Aprovisionamiento no interactivo completo
samba-tool domain provision \
  --realm=EMPRESA.COM \
  --domain=EMPRESA \
  --server-role=dc \
  --dns-backend=SAMBA_INTERNAL \
  --adminpass='P@ssw0rd123'

# Con BIND9 como backend DNS
samba-tool domain provision \
  --realm=EMPRESA.COM \
  --domain=EMPRESA \
  --server-role=dc \
  --dns-backend=BIND9_DLZ \
  --adminpass='P@ssw0rd123'
```

### Parámetros del aprovisionamiento

| Parámetro | Descripción |
|-----------|-------------|
| `--realm` | Nombre Kerberos del dominio (MAYÚSCULAS, ej: EMPRESA.COM) |
| `--domain` | Nombre NetBIOS del dominio (máx 15 caracteres) |
| `--server-role=dc` | Rol de controlador de dominio |
| `--dns-backend` | Backend DNS: SAMBA_INTERNAL, BIND9_DLZ o NONE |
| `--adminpass` | Contraseña del administrador del dominio |
| `--use-rfc2307` | Habilitar extensiones RFC2307 para atributos POSIX en AD |
| `--site` | Nombre del sitio AD (predeterminado: Default-First-Site-Name) |
| `--function-level` | Nivel funcional del dominio (2008_R2, etc.) |

> **Para el examen:** El aprovisionamiento crea el archivo smb.conf, la base de datos LDAP, el KDC Kerberos y opcionalmente configura DNS. La opción `--use-rfc2307` es importante para mapeo de UIDs/GIDs.

### Resultado del aprovisionamiento

El proceso genera:

- `/etc/samba/smb.conf` configurado para AD DC
- Base de datos LDAP de Active Directory en `/var/lib/samba/private/sam.ldb`
- Archivo Kerberos `/var/lib/samba/private/krb5.conf`
- Zonas DNS si se usa DNS interno
- Certificado TLS autofirmado
- Cuenta Administrator con la contraseña especificada

```bash
# Verificar el archivo krb5.conf generado
cat /var/lib/samba/private/krb5.conf

# Copiar o enlazar para uso del sistema
cp /var/lib/samba/private/krb5.conf /etc/krb5.conf

# Iniciar el servicio AD DC
systemctl start samba-ad-dc
systemctl enable samba-ad-dc
```

## Backends DNS

### DNS interno de Samba (SAMBA_INTERNAL)

- Servidor DNS integrado en el proceso samba
- Más simple de configurar
- Soporta actualizaciones dinámicas de DNS
- Limitado en funcionalidad comparado con BIND9
- Adecuado para entornos pequeños/medianos

### BIND9 con DLZ (BIND9_DLZ)

- BIND9 carga las zonas AD desde la base de datos de Samba vía DLZ
- Más funcional y maduro que el DNS interno
- Permite zonas DNS adicionales no relacionadas con AD
- Requiere configurar BIND9 con el módulo DLZ de Samba

```bash
# Configuración de BIND9 para DLZ
# En /etc/bind/named.conf agregar:
dlz "AD DNS Zone" {
    database "dlopen /usr/lib/x86_64-linux-gnu/samba/bind9/dlz_bind9_12.so";
};
```

### Verificación de DNS

```bash
# Verificar resolución del DC
host -t A dc.empresa.com localhost

# Verificar registros SRV críticos
host -t SRV _ldap._tcp.empresa.com localhost
host -t SRV _kerberos._tcp.empresa.com localhost
host -t SRV _ldap._tcp.dc._msdcs.empresa.com localhost

# Verificar con samba-tool
samba-tool dns query localhost empresa.com @ ALL -U administrator
```

## Roles FSMO (Flexible Single Master Operations)

En Active Directory, ciertos roles solo pueden ser realizados por un DC a la vez:

| Rol FSMO | Alcance | Función |
|----------|---------|---------|
| Schema Master | Bosque | Modifica el esquema AD |
| Domain Naming Master | Bosque | Agrega/elimina dominios del bosque |
| PDC Emulator | Dominio | Sincronización de hora, cambios de contraseña urgentes |
| RID Master | Dominio | Asigna bloques de RIDs a los DCs |
| Infrastructure Master | Dominio | Actualiza referencias entre dominios |

### Gestión de roles FSMO

```bash
# Mostrar quién tiene cada rol FSMO
samba-tool fsmo show

# Transferir un rol FSMO a otro DC (ordenado)
samba-tool fsmo transfer --role=rid
samba-tool fsmo transfer --role=pdc
samba-tool fsmo transfer --role=naming
samba-tool fsmo transfer --role=schema
samba-tool fsmo transfer --role=infrastructure

# Tomar un rol forzosamente (seize) - solo si el DC original no está disponible
samba-tool fsmo seize --role=rid --force
samba-tool fsmo seize --role=all --force
```

> **Para el examen:** Conocer los 5 roles FSMO, su alcance (bosque vs dominio) y la diferencia entre `transfer` (ordenado) y `seize` (forzado). Schema Master y Domain Naming Master son a nivel de bosque.

## Unir controladores de dominio adicionales

```bash
# Unir un segundo DC al dominio existente
samba-tool domain join empresa.com DC \
  -U administrator \
  --dns-backend=SAMBA_INTERNAL

# Verificar la unión
samba-tool domain info 10.0.0.1

# Verificar replicación
samba-tool drs showrepl
```

### Requisitos para un DC adicional

- Resolución DNS apuntando al primer DC
- Kerberos configurado con el realm correcto
- Conectividad a los puertos necesarios (LDAP, Kerberos, DNS, SMB)
- Cuenta con privilegios de administrador del dominio

## Replicación DRS (Directory Replication Service)

### Monitorización de replicación

```bash
# Mostrar estado de replicación
samba-tool drs showrepl

# Forzar replicación
samba-tool drs replicate dc2.empresa.com dc1.empresa.com dc=empresa,dc=com

# Verificar KCC (Knowledge Consistency Checker)
samba-tool drs kcc

# Verificar particiones de replicación
samba-tool drs options
```

### Replicación de SYSVOL

SYSVOL contiene scripts de inicio de sesión y GPOs. Samba soporta varias opciones:

- **rsync + cron**: Solución más común y estable
- **osync**: Sincronización bidireccional
- **DFS-R**: No soportado nativamente por Samba (protocolo propietario de Microsoft)

```bash
# Replicación de SYSVOL con rsync (en el DC secundario)
rsync -XAavz --delete \
  dc1.empresa.com:/var/lib/samba/sysvol/ \
  /var/lib/samba/sysvol/

# Configurar en crontab para sincronización periódica
*/5 * * * * rsync -XAavz --delete dc1:/var/lib/samba/sysvol/ /var/lib/samba/sysvol/
```

> **Para el examen:** La replicación de SYSVOL en Samba requiere herramientas externas como rsync. DFS-R de Microsoft no está implementado en Samba.

## Confianzas de dominio (Domain Trusts)

### Tipos de confianza

| Tipo | Dirección | Descripción |
|------|-----------|-------------|
| Dentro del bosque | Bidireccional transitiva | Automática entre dominios del mismo bosque |
| External (externa) | Unidireccional o bidireccional | Entre dominios de bosques diferentes |
| Forest (bosque) | Bidireccional transitiva | Entre dos bosques completos |

### Gestión de confianzas

```bash
# Crear confianza con otro dominio
samba-tool domain trust create otro.com \
  --type=external \
  --direction=both \
  -U administrator

# Listar confianzas
samba-tool domain trust list

# Verificar una confianza
samba-tool domain trust validate otro.com

# Eliminar una confianza
samba-tool domain trust delete otro.com
```

## Integración con Kerberos

### Configuración de Kerberos

```ini
# /etc/krb5.conf (generado por el aprovisionamiento)
[libdefaults]
    default_realm = EMPRESA.COM
    dns_lookup_realm = false
    dns_lookup_kdc = true

[realms]
    EMPRESA.COM = {
        kdc = dc.empresa.com
        admin_server = dc.empresa.com
        default_domain = empresa.com
    }

[domain_realm]
    .empresa.com = EMPRESA.COM
    empresa.com = EMPRESA.COM
```

### Verificación de Kerberos

```bash
# Obtener ticket Kerberos
kinit administrator@EMPRESA.COM

# Verificar tickets
klist

# Destruir tickets
kdestroy

# Verificar que el KDC responde
samba-tool domain exportkeytab /tmp/test.keytab --principal=administrator
```

## Gestión con samba-tool

### Comandos principales de samba-tool

```bash
# Gestión de usuarios
samba-tool user list
samba-tool user create usuario contraseña
samba-tool user delete usuario
samba-tool user disable usuario
samba-tool user enable usuario
samba-tool user setpassword usuario --newpassword='nueva'

# Gestión de grupos
samba-tool group list
samba-tool group add grupo
samba-tool group delete grupo
samba-tool group addmembers grupo usuario1,usuario2
samba-tool group removemembers grupo usuario1

# Gestión de DNS
samba-tool dns add localhost empresa.com host A 10.0.0.50 -U administrator
samba-tool dns delete localhost empresa.com host A 10.0.0.50 -U administrator
samba-tool dns query localhost empresa.com @ ALL -U administrator
samba-tool dns zonelist localhost -U administrator

# Gestión de GPOs
samba-tool gpo listall
samba-tool gpo show {GPO-GUID}
samba-tool gpo create "Nombre GPO" -U administrator

# Verificación de la base de datos
samba-tool dbcheck
samba-tool dbcheck --fix

# Nivel funcional del dominio
samba-tool domain level show
samba-tool domain level raise --domain-level=2008_R2 --forest-level=2008_R2
```

> **Para el examen:** `samba-tool` es la herramienta central para administrar Samba AD DC. Conocer los subcomandos de domain, user, group, dns, fsmo y drs es fundamental.

## smb.conf para AD DC

```ini
# Configuración típica generada por el aprovisionamiento
[global]
    workgroup = EMPRESA
    realm = EMPRESA.COM
    netbios name = DC1
    server role = active directory domain controller
    dns forwarder = 8.8.8.8
    idmap_ldb:use rfc2307 = yes

[netlogon]
    path = /var/lib/samba/sysvol/empresa.com/scripts
    read only = No

[sysvol]
    path = /var/lib/samba/sysvol
    read only = No
```

## Resumen de conceptos clave

- `samba-tool domain provision` crea el dominio AD con LDAP, Kerberos y DNS integrados
- Dos opciones de DNS: SAMBA_INTERNAL (simple) o BIND9_DLZ (más funcional)
- 5 roles FSMO: Schema Master, Domain Naming (bosque), PDC Emulator, RID Master, Infrastructure (dominio)
- `samba-tool fsmo transfer` transfiere roles ordenadamente; `seize` los toma forzosamente
- La replicación DRS sincroniza la base de datos AD entre DCs
- SYSVOL requiere replicación externa (rsync) ya que DFS-R no está implementado
- `samba-tool` es la herramienta principal: domain, user, group, dns, fsmo, drs
- El realm Kerberos debe estar en MAYÚSCULAS y coincidir con el dominio DNS
