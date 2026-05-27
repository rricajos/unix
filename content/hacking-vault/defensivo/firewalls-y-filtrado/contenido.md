---
title: "Firewalls y Filtrado de Paquetes"
tags:
  - hacking
  - defensivo
  - firewalls-y-filtrado
  - hacking-defensivo
tipo: hacking-defensivo
certificacion: hacking-vault
---

## Introduccion a Firewalls en Linux

Un firewall es la primera linea de defensa en la seguridad de red. En Linux, el filtrado de paquetes opera a nivel del kernel a traves del framework Netfilter, y se configura mediante herramientas de espacio de usuario como iptables, nftables o firewalld. Una configuracion adecuada del firewall es esencial para controlar el trafico entrante, saliente y en transito.

> **Nota:** La regla de oro del filtrado de paquetes es "denegar todo por defecto y permitir solo lo estrictamente necesario". Esto se conoce como politica de denegacion implicita (default deny).

## iptables en Profundidad

iptables es la herramienta clasica de filtrado de paquetes en Linux. Aunque nftables es su sucesor, iptables sigue siendo ampliamente utilizado y su comprension es fundamental.

### Tablas, cadenas y objetivos

| Tabla | Funcion | Cadenas |
|-------|---------|---------|
| filter | Filtrado de paquetes (por defecto) | INPUT, OUTPUT, FORWARD |
| nat | Traduccion de direcciones de red | PREROUTING, POSTROUTING, OUTPUT |
| mangle | Modificacion de cabeceras de paquetes | PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING |
| raw | Excepciones al seguimiento de conexiones | PREROUTING, OUTPUT |

### Filtrado con estado (stateful) usando conntrack

```bash
# Politica por defecto: denegar todo
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP

# Permitir trafico loopback
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Permitir conexiones establecidas y relacionadas (stateful)
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Descartar paquetes invalidos
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# Permitir SSH entrante desde red especifica
iptables -A INPUT -s 10.0.1.0/24 -p tcp --dport 22 -m conntrack \
  --ctstate NEW -j ACCEPT

# Permitir HTTP/HTTPS entrante
iptables -A INPUT -p tcp -m multiport --dports 80,443 -m conntrack \
  --ctstate NEW -j ACCEPT

# Permitir DNS saliente
iptables -A OUTPUT -p udp --dport 53 -m conntrack --ctstate NEW -j ACCEPT
iptables -A OUTPUT -p tcp --dport 53 -m conntrack --ctstate NEW -j ACCEPT

# Permitir HTTP/HTTPS saliente (actualizaciones)
iptables -A OUTPUT -p tcp -m multiport --dports 80,443 -m conntrack \
  --ctstate NEW -j ACCEPT

# Permitir NTP saliente
iptables -A OUTPUT -p udp --dport 123 -m conntrack --ctstate NEW -j ACCEPT
```

### Cadenas personalizadas y logging

```bash
# Crear cadena personalizada para logging y drop
iptables -N LOG_AND_DROP
iptables -A LOG_AND_DROP -j LOG --log-prefix "[FW-DROP] " --log-level 4
iptables -A LOG_AND_DROP -j DROP

# Usar la cadena personalizada
iptables -A INPUT -j LOG_AND_DROP

# Limitar rate de logging para evitar inundacion
iptables -N LOG_LIMIT
iptables -A LOG_LIMIT -m limit --limit 5/min --limit-burst 10 \
  -j LOG --log-prefix "[FW-DROP] "
iptables -A LOG_LIMIT -j DROP

# Proteccion contra escaneo de puertos
iptables -N PORTSCAN
iptables -A PORTSCAN -m recent --name portscan --set
iptables -A PORTSCAN -m recent --name portscan --rcheck --seconds 86400 \
  -j DROP
iptables -A INPUT -m conntrack --ctstate NEW -m tcp -p tcp --tcp-flags ALL NONE \
  -j PORTSCAN
iptables -A INPUT -m conntrack --ctstate NEW -m tcp -p tcp --tcp-flags ALL ALL \
  -j PORTSCAN

# Proteccion contra SYN flood
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# Guardar reglas de forma persistente
iptables-save > /etc/iptables/rules.v4
# Restaurar al inicio
iptables-restore < /etc/iptables/rules.v4
```

### NAT con iptables

```bash
# SNAT: Enmascarar trafico saliente (gateway)
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# DNAT: Redirigir puerto externo a servidor interno
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 \
  -j DNAT --to-destination 192.168.1.100:80
iptables -A FORWARD -p tcp -d 192.168.1.100 --dport 80 -j ACCEPT

# Port forwarding de SSH
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 2222 \
  -j DNAT --to-destination 192.168.1.50:22
```

> **Nota:** Al usar NAT, recuerda habilitar el IP forwarding en el kernel con `sysctl net.ipv4.ip_forward=1` y hacerlo persistente en `/etc/sysctl.conf`.

## nftables - El Sucesor de iptables

nftables reemplaza a iptables con una sintaxis mas limpia, mejor rendimiento y funcionalidades avanzadas como sets y maps.

```bash
# Crear tabla y cadenas base
nft add table inet firewall
nft add chain inet firewall input { type filter hook input priority 0 \; policy drop \; }
nft add chain inet firewall forward { type filter hook forward priority 0 \; policy drop \; }
nft add chain inet firewall output { type filter hook output priority 0 \; policy drop \; }

# Permitir loopback
nft add rule inet firewall input iif lo accept
nft add rule inet firewall output oif lo accept

# Permitir conexiones establecidas
nft add rule inet firewall input ct state established,related accept
nft add rule inet firewall output ct state established,related accept

# Descartar paquetes invalidos
nft add rule inet firewall input ct state invalid drop
```

### Sets, maps y rate limiting

```bash
# Definir un set de puertos permitidos
nft add set inet firewall puertos_web { type inet_service \; }
nft add element inet firewall puertos_web { 80, 443, 8080 }

# Usar el set en una regla
nft add rule inet firewall input tcp dport @puertos_web accept

# Set de IPs de administracion
nft add set inet firewall admin_ips { type ipv4_addr \; }
nft add element inet firewall admin_ips { 10.0.1.10, 10.0.1.20, 10.0.1.30 }
nft add rule inet firewall input ip saddr @admin_ips tcp dport 22 accept

# Rate limiting
nft add rule inet firewall input tcp dport 22 ct state new \
  limit rate 3/minute accept

# Contadores por regla
nft add rule inet firewall input tcp dport 80 counter accept

# NAT con nftables
nft add table ip nat
nft add chain ip nat prerouting { type nat hook prerouting priority 0 \; }
nft add chain ip nat postrouting { type nat hook postrouting priority 100 \; }
nft add rule ip nat postrouting oif eth0 masquerade

# Configuracion completa en archivo
# /etc/nftables.conf
```

```bash
# Ejemplo de configuracion nftables completa en archivo
# /etc/nftables.conf
#!/usr/sbin/nft -f

flush ruleset

table inet firewall {
    set admin_ips {
        type ipv4_addr
        elements = { 10.0.1.10, 10.0.1.20 }
    }

    set puertos_web {
        type inet_service
        elements = { 80, 443 }
    }

    chain input {
        type filter hook input priority 0; policy drop;

        iif lo accept
        ct state established,related accept
        ct state invalid drop

        ip saddr @admin_ips tcp dport 22 accept
        tcp dport @puertos_web accept
        icmp type echo-request limit rate 1/second accept

        counter drop
    }

    chain forward {
        type filter hook forward priority 0; policy drop;
    }

    chain output {
        type filter hook output priority 0; policy accept;
    }
}
```

## firewalld

firewalld proporciona una gestion dinamica del firewall basada en zonas, sin necesidad de reiniciar el servicio al aplicar cambios.

### Zonas y servicios

| Zona | Descripcion |
|------|-------------|
| drop | Descarta todo el trafico entrante sin respuesta |
| block | Rechaza trafico entrante con mensaje ICMP |
| public | Para redes publicas no confiables |
| external | Para NAT/enmascaramiento en redes externas |
| dmz | Para servidores en zona desmilitarizada |
| work | Para redes de trabajo semi-confiables |
| home | Para redes domesticas |
| internal | Para redes internas confiables |
| trusted | Acepta todo el trafico |

```bash
# Ver zona activa
firewall-cmd --get-active-zones

# Listar servicios en la zona publica
firewall-cmd --zone=public --list-all

# Agregar servicio (runtime)
firewall-cmd --zone=public --add-service=http
firewall-cmd --zone=public --add-service=https

# Hacerlo permanente
firewall-cmd --zone=public --add-service=http --permanent
firewall-cmd --zone=public --add-service=https --permanent

# Agregar puerto personalizado
firewall-cmd --zone=public --add-port=8080/tcp --permanent

# Rich rules para control granular
firewall-cmd --zone=public --add-rich-rule='
  rule family="ipv4"
  source address="10.0.1.0/24"
  service name="ssh"
  accept' --permanent

# Bloquear IP especifica
firewall-cmd --zone=public --add-rich-rule='
  rule family="ipv4"
  source address="203.0.113.45"
  drop' --permanent

# Rate limiting con rich rules
firewall-cmd --zone=public --add-rich-rule='
  rule service name="http"
  limit value="25/m"
  accept' --permanent

# Aplicar cambios permanentes
firewall-cmd --reload

# Diferencia runtime vs permanent
firewall-cmd --zone=public --list-all              # Runtime
firewall-cmd --zone=public --list-all --permanent   # Permanente
```

> **Nota:** Los cambios sin `--permanent` se pierden al reiniciar firewalld. Siempre aplica cambios con `--permanent` y luego ejecuta `--reload`, o aplica primero en runtime para probar y luego hazlo permanente.

## UFW (Uncomplicated Firewall)

UFW es una interfaz simplificada para iptables ideal para configuraciones rapidas.

```bash
# Habilitar UFW con politica por defecto
ufw default deny incoming
ufw default allow outgoing
ufw enable

# Permitir servicios comunes
ufw allow ssh
ufw allow http
ufw allow https

# Permitir desde IP/red especifica
ufw allow from 10.0.1.0/24 to any port 22

# Permitir rango de puertos
ufw allow 6000:6100/tcp

# Denegar acceso especifico
ufw deny from 203.0.113.0/24

# Rate limiting para SSH
ufw limit ssh

# Ver estado con numeracion
ufw status numbered

# Eliminar regla por numero
ufw delete 3

# Ver reglas detalladas
ufw status verbose
```

## WAF (Web Application Firewall)

### ModSecurity con OWASP CRS

```bash
# Instalar ModSecurity con Apache
apt install libapache2-mod-security2
a2enmod security2

# Instalar OWASP Core Rule Set
git clone https://github.com/coreruleset/coreruleset.git /etc/modsecurity/crs
cp /etc/modsecurity/crs/crs-setup.conf.example /etc/modsecurity/crs/crs-setup.conf

# Configuracion de ModSecurity
# /etc/modsecurity/modsecurity.conf
SecRuleEngine On
SecRequestBodyAccess On
SecRequestBodyLimit 13107200
SecResponseBodyAccess Off
SecAuditEngine RelevantOnly
SecAuditLog /var/log/apache2/modsec_audit.log

# Incluir reglas OWASP CRS
# /etc/apache2/mods-enabled/security2.conf
IncludeOptional /etc/modsecurity/crs/crs-setup.conf
IncludeOptional /etc/modsecurity/crs/rules/*.conf

# Probar en modo DetectionOnly antes de bloquear
SecRuleEngine DetectionOnly

# Revisar logs de deteccion
tail -f /var/log/apache2/modsec_audit.log
```

> **Nota:** Siempre despliega ModSecurity primero en modo `DetectionOnly` durante al menos una semana para identificar falsos positivos antes de cambiar a modo `On` (bloqueo activo).

## Defensa en Profundidad

La defensa en profundidad aplica multiples capas de seguridad para que la falla de una capa no comprometa todo el sistema.

```
Internet
    |
[Firewall perimetral / nftables]
    |
[WAF / ModSecurity]
    |
[Servidor web en DMZ]
    |
[Firewall interno]
    |
[Servidor de aplicacion]
    |
[Firewall de base de datos]
    |
[Servidor de base de datos]
```

## Port Knocking con knockd

Port knocking oculta servicios hasta que se recibe una secuencia especifica de conexiones.

```bash
# Instalar knockd
apt install knockd

# /etc/knockd.conf
[options]
    UseSyslog
    Interface = eth0

[openSSH]
    sequence    = 7000,8000,9000
    seq_timeout = 10
    command     = /sbin/iptables -I INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn

[closeSSH]
    sequence    = 9000,8000,7000
    seq_timeout = 10
    command     = /sbin/iptables -D INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn

# Habilitar knockd
# /etc/default/knockd
START_KNOCKD=1

# Desde el cliente: abrir el puerto
knock servidor.ejemplo.com 7000 8000 9000
ssh usuario@servidor.ejemplo.com

# Cerrar el puerto al terminar
knock servidor.ejemplo.com 9000 8000 7000
```

## Fail2ban - Configuracion Avanzada

```bash
# /etc/fail2ban/jail.local
[DEFAULT]
bantime    = 3600
findtime   = 600
maxretry   = 3
banaction  = nftables-multiport
backend    = systemd
destemail  = admin@ejemplo.com
sender     = fail2ban@ejemplo.com
action     = %(action_mwl)s

[sshd]
enabled  = true
port     = ssh
filter   = sshd
maxretry = 3
bantime  = 86400

[apache-auth]
enabled  = true
port     = http,https
filter   = apache-auth
logpath  = /var/log/apache2/error.log
maxretry = 5

[nginx-limit-req]
enabled  = true
port     = http,https
filter   = nginx-limit-req
logpath  = /var/log/nginx/error.log
maxretry = 10
```

### Filtros personalizados de Fail2ban

```bash
# /etc/fail2ban/filter.d/wordpress-login.conf
[Definition]
failregex = ^<HOST> .* "POST /wp-login.php
            ^<HOST> .* "POST /xmlrpc.php
ignoreregex =

# Jail personalizado
# En /etc/fail2ban/jail.local
[wordpress-login]
enabled  = true
port     = http,https
filter   = wordpress-login
logpath  = /var/log/nginx/access.log
maxretry = 5
bantime  = 3600

# Comandos de gestion de Fail2ban
fail2ban-client status
fail2ban-client status sshd
fail2ban-client set sshd unbanip 203.0.113.45
fail2ban-client get sshd banned
```

## TCP Wrappers

```bash
# /etc/hosts.allow - Accesos permitidos (se evalua primero)
sshd: 10.0.1.0/24
sshd: 192.168.1.0/24
ALL: 127.0.0.1

# /etc/hosts.deny - Accesos denegados
sshd: ALL
ALL: ALL

# Verificar si un servicio soporta TCP wrappers
ldd /usr/sbin/sshd | grep libwrap
```

> **Nota:** TCP Wrappers se evalua en orden: primero `/etc/hosts.allow`, luego `/etc/hosts.deny`. Si una conexion coincide con una regla en `hosts.allow`, se permite inmediatamente sin consultar `hosts.deny`.

## Segmentacion de Red y DMZ

### Concepto de DMZ

```
                    Internet
                       |
              [Firewall externo]
                  /         \
           [DMZ]            |
        Web / Mail     [Firewall interno]
        DNS publico         |
                      [Red interna]
                     App / DB / Users
```

### Implementar segmentacion con nftables

```bash
# Interfaces: eth0 (internet), eth1 (DMZ), eth2 (interna)

table inet segmentacion {
    chain forward {
        type filter hook forward priority 0; policy drop;

        # Internet -> DMZ: solo HTTP/HTTPS
        iif eth0 oif eth1 tcp dport { 80, 443 } ct state new accept

        # DMZ -> Interna: solo conexion a base de datos
        iif eth1 oif eth2 ip daddr 192.168.2.10 tcp dport 5432 \
          ct state new accept

        # Interna -> DMZ: permitir gestion
        iif eth2 oif eth1 tcp dport { 22, 80, 443 } ct state new accept

        # Interna -> Internet: permitir navegacion
        iif eth2 oif eth0 tcp dport { 80, 443, 53 } ct state new accept
        iif eth2 oif eth0 udp dport { 53, 123 } ct state new accept

        # Establecidas y relacionadas en todas las direcciones
        ct state established,related accept
    }
}
```

## Ejemplos Practicos de Reglas de Firewall

### Servidor web

```bash
nft add rule inet firewall input tcp dport { 80, 443 } accept
nft add rule inet firewall input ip saddr 10.0.1.0/24 tcp dport 22 accept
nft add rule inet firewall input icmp type echo-request limit rate 1/second accept
```

### Servidor de correo

```bash
nft add rule inet firewall input tcp dport { 25, 465, 587, 993, 995 } accept
nft add rule inet firewall input ip saddr 10.0.1.0/24 tcp dport 22 accept
```

### Servidor de base de datos (solo acceso interno)

```bash
nft add rule inet firewall input ip saddr 192.168.1.0/24 tcp dport 5432 accept
nft add rule inet firewall input ip saddr 192.168.1.0/24 tcp dport 3306 accept
nft add rule inet firewall input ip saddr 10.0.1.0/24 tcp dport 22 accept
# NO permitir acceso desde Internet a la base de datos
```

### Tabla resumen de herramientas de filtrado

| Herramienta | Uso recomendado | Complejidad |
|-------------|----------------|-------------|
| UFW | Configuracion rapida, servidores simples | Baja |
| firewalld | Servidores con multiples zonas de red | Media |
| iptables | Control granular, compatibilidad legacy | Media-Alta |
| nftables | Configuraciones avanzadas, alto rendimiento | Alta |
| ModSecurity | Proteccion de aplicaciones web (capa 7) | Alta |

## Resumen

La proteccion de red en Linux requiere un enfoque de multiples capas. Desde el filtrado basico de paquetes con iptables/nftables hasta los WAF a nivel de aplicacion, pasando por herramientas complementarias como Fail2ban y port knocking, cada capa agrega profundidad a la defensa. La segmentacion de red mediante DMZ y reglas de firewall entre segmentos es fundamental para limitar el movimiento lateral en caso de compromiso. La clave es mantener una politica de denegacion por defecto y permitir solo el trafico estrictamente necesario.
