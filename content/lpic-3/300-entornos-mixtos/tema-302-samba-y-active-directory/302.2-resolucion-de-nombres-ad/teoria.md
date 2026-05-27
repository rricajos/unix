---
tipo: teoria
certificacion: lpic-3
especialidad: 300 - Entornos Mixtos
tema: "302"
subtema: "302.2"
titulo: "Resolución de Nombres en Active Directory"
peso: 2
tags:
  - lpic-3
  - tema-302
  - teoria
---

# 302.2 Resolución de Nombres en Active Directory

## Objetivos del subtema

Este subtema abarca la configuración y gestión del DNS en un entorno Active Directory con Samba, incluyendo registros SRV, backends DNS, actualizaciones dinámicas, zonas inversas y reenviadores.

## DNS en Active Directory

Active Directory depende de DNS para su funcionamiento. A diferencia de los dominios NT4 que usaban NetBIOS/WINS, AD utiliza DNS para:

- Localización de controladores de dominio (registros SRV)
- Localización de servicios Kerberos y LDAP
- Resolución de nombres de equipos miembros del dominio
- Replicación entre DCs
- Unión de equipos al dominio

> **Para el examen:** DNS no es opcional en AD; es un requisito fundamental. Sin DNS funcional, ningún servicio de Active Directory opera correctamente.

## Registros SRV en Active Directory

Los registros SRV (Service) son el mecanismo por el cual los clientes localizan servicios en AD:

### Formato de registro SRV

```
_servicio._protocolo.dominio TTL IN SRV prioridad peso puerto host
```

### Registros SRV críticos

| Registro | Función |
|----------|---------|
| `_ldap._tcp.dominio.com` | Localizar servidores LDAP del dominio |
| `_kerberos._tcp.dominio.com` | Localizar KDC Kerberos |
| `_kerberos._udp.dominio.com` | KDC Kerberos (UDP) |
| `_kpasswd._tcp.dominio.com` | Servicio de cambio de contraseña Kerberos |
| `_ldap._tcp.dc._msdcs.dominio.com` | Localizar DCs específicamente |
| `_kerberos._tcp.dc._msdcs.dominio.com` | KDC en DCs |
| `_ldap._tcp.gc._msdcs.dominio.com` | Catálogo Global |
| `_ldap._tcp.pdc._msdcs.dominio.com` | PDC Emulator |
| `_ldap._tcp.Default-First-Site-Name._sites.dominio.com` | DCs por sitio |

### Registros en la zona _msdcs

La zona `_msdcs.dominio.com` contiene registros específicos de Microsoft:

- **dc**: Controladores de dominio
- **gc**: Catálogo Global
- **pdc**: PDC Emulator
- **domains**: GUIDs de dominios

```bash
# Verificar registros SRV principales
dig _ldap._tcp.empresa.com SRV
dig _kerberos._tcp.empresa.com SRV
dig _ldap._tcp.dc._msdcs.empresa.com SRV
dig _ldap._tcp.gc._msdcs.empresa.com SRV

# Verificar registro del PDC Emulator
dig _ldap._tcp.pdc._msdcs.empresa.com SRV
```

> **Para el examen:** Los registros `_ldap._tcp` y `_kerberos._tcp` son los más importantes. Si faltan, los clientes no pueden localizar los DCs y la autenticación falla.

## DNS interno de Samba (SAMBA_INTERNAL)

### Características

- Servidor DNS integrado en el demonio `samba`
- Se configura automáticamente durante el aprovisionamiento
- Almacena las zonas en la base de datos LDB de AD
- Soporta actualizaciones dinámicas de DNS
- No requiere configuración adicional de BIND

### Configuración en smb.conf

```ini
[global]
    server role = active directory domain controller
    dns forwarder = 8.8.8.8
    # El DNS interno se activa automáticamente al usar server role = ad dc
```

### Gestión con samba-tool dns

```bash
# Listar zonas DNS
samba-tool dns zonelist localhost -U administrator

# Consultar todos los registros de una zona
samba-tool dns query localhost empresa.com @ ALL -U administrator

# Consultar un registro específico
samba-tool dns query localhost empresa.com servidor A -U administrator

# Añadir registro A
samba-tool dns add localhost empresa.com servidor A 192.168.1.50 -U administrator

# Añadir registro CNAME
samba-tool dns add localhost empresa.com alias CNAME servidor.empresa.com -U administrator

# Añadir registro MX
samba-tool dns add localhost empresa.com @ MX "correo.empresa.com 10" -U administrator

# Añadir registro PTR (en zona inversa)
samba-tool dns add localhost 1.168.192.in-addr.arpa 50 PTR servidor.empresa.com -U administrator

# Eliminar un registro
samba-tool dns delete localhost empresa.com servidor A 192.168.1.50 -U administrator

# Actualizar un registro (cambiar IP)
samba-tool dns update localhost empresa.com servidor A 192.168.1.50 192.168.1.51 -U administrator
```

## BIND9 con DLZ (Dynamically Loaded Zone)

### Ventajas sobre DNS interno

- Mayor madurez y estabilidad del código
- Funcionalidades avanzadas de BIND (vistas, ACLs, TSIG)
- Soporte para zonas no relacionadas con AD
- Mejor rendimiento para entornos grandes
- Logging más detallado y configurable

### Configuración de BIND9 con DLZ

```bash
# 1. Instalar BIND9 y el módulo DLZ
apt install bind9 samba

# 2. Configurar named.conf para cargar el módulo DLZ
# En /etc/bind/named.conf o named.conf.local:
```

```
// /etc/bind/named.conf.local
dlz "AD DNS Zone" {
    database "dlopen /usr/lib/x86_64-linux-gnu/samba/bind9/dlz_bind9_12.so";
};
```

```bash
# 3. Configurar las opciones de BIND9
# /etc/bind/named.conf.options
options {
    directory "/var/cache/bind";
    forwarders { 8.8.8.8; 8.8.4.4; };
    allow-query { any; };
    dnssec-validation no;
    auth-nxdomain no;
    listen-on { any; };
    tkey-gssapi-keytab "/var/lib/samba/bind-dns/dns.keytab";
};
```

```bash
# 4. Configurar permisos
chown bind:bind /var/lib/samba/bind-dns/dns.keytab
chmod 640 /var/lib/samba/bind-dns/dns.keytab

# 5. Aprovisionar con BIND9_DLZ
samba-tool domain provision --dns-backend=BIND9_DLZ ...

# 6. Reiniciar servicios
systemctl restart bind9
systemctl restart samba-ad-dc
```

> **Para el examen:** Conocer la configuración del módulo DLZ en named.conf y el keytab necesario para la autenticación entre BIND y Samba.

## Actualizaciones dinámicas de DNS

### Actualizaciones automáticas

Los clientes Windows actualizan sus registros DNS automáticamente al unirse al dominio o al renovar DHCP. Samba soporta estas actualizaciones:

```ini
# En smb.conf (normalmente ya configurado)
[global]
    # Las actualizaciones dinámicas están habilitadas por defecto en AD DC
    # No se requiere configuración adicional para el DNS interno
```

### Actualizaciones manuales con nsupdate

`nsupdate` permite actualizar registros DNS dinámicamente usando TSIG o Kerberos:

```bash
# Actualización con Kerberos (requiere ticket válido)
kinit administrator@EMPRESA.COM

nsupdate -g <<EOF
server localhost
realm EMPRESA.COM
update add nuevohost.empresa.com 3600 A 192.168.1.100
send
EOF

# Actualización con clave TSIG
nsupdate -k /etc/bind/rndc.key <<EOF
server localhost
zone empresa.com
update add host.empresa.com 3600 A 10.0.0.50
send
EOF

# Eliminar un registro con nsupdate
nsupdate -g <<EOF
server localhost
update delete host.empresa.com A
send
EOF
```

### samba_dnsupdate

Samba incluye el script `samba_dnsupdate` que actualiza automáticamente los registros SRV y otros registros necesarios para AD:

```bash
# Ejecutar actualización de registros AD
samba_dnsupdate --verbose

# Verificar qué registros se actualizarían
samba_dnsupdate --verbose --use-file=/dev/null
```

## Zonas inversas

Las zonas inversas (PTR) son importantes para la resolución inversa de IP a nombre:

```bash
# Crear zona inversa para la red 192.168.1.0/24
samba-tool dns zonecreate localhost 1.168.192.in-addr.arpa -U administrator

# Añadir registro PTR
samba-tool dns add localhost 1.168.192.in-addr.arpa 10 PTR dc.empresa.com -U administrator

# Verificar resolución inversa
dig -x 192.168.1.10
host 192.168.1.10
```

### Importancia de las zonas inversas

- Necesarias para la resolución inversa (IP a nombre)
- Requeridas por algunos servicios para verificación de seguridad
- Kerberos puede requerir resolución inversa para funcionar correctamente
- Los logs son más legibles con resolución inversa funcional

## Reenviadores DNS (Forwarders)

Los reenviadores permiten resolver nombres que no están en las zonas locales:

```ini
# En smb.conf para DNS interno
[global]
    dns forwarder = 8.8.8.8
```

```bash
# En BIND9 named.conf.options
options {
    forwarders {
        8.8.8.8;
        8.8.4.4;
    };
    forward only;  # o "forward first;"
};
```

- `forward first`: Intenta el reenviador primero, luego resuelve recursivamente
- `forward only`: Solo usa reenviadores, no intenta resolución recursiva

## Diagnóstico de DNS en AD

```bash
# Verificar que el DC responde consultas DNS
dig @dc.empresa.com empresa.com ANY

# Verificar todos los registros SRV necesarios
dig @localhost _ldap._tcp.empresa.com SRV
dig @localhost _kerberos._tcp.empresa.com SRV
dig @localhost _gc._tcp.empresa.com SRV

# Verificar resolución directa
dig @localhost dc.empresa.com A

# Verificar resolución inversa
dig @localhost -x 192.168.1.10

# Listar zonas con samba-tool
samba-tool dns zonelist localhost -U administrator

# Verificar registros con samba-tool
samba-tool dns query localhost empresa.com @ ALL -U administrator

# Verificar que los clientes pueden resolver
nslookup dc.empresa.com
nslookup -type=SRV _ldap._tcp.empresa.com
```

## Resumen de conceptos clave

- DNS es obligatorio para Active Directory; sin él nada funciona
- Los registros SRV (`_ldap._tcp`, `_kerberos._tcp`) localizan servicios AD
- Dos backends DNS: SAMBA_INTERNAL (simple) y BIND9_DLZ (avanzado)
- `samba-tool dns` gestiona registros en el DNS interno de Samba
- `nsupdate -g` realiza actualizaciones dinámicas con Kerberos
- Las zonas inversas (PTR) son necesarias para resolución inversa
- Los reenviadores (`dns forwarder`) resuelven nombres externos
- `samba_dnsupdate` mantiene automáticamente los registros SRV de AD
