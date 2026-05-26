---
title: "212.1 - Configuración de router: Comandos clave"
tags: [lpic-2, examen-202, tema-212, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "212"
subtema: "212.1"
---

# 212.1 - Configuración de router: Comandos clave

## Reenvío IP (IP Forwarding)

| Comando | Descripción |
|---------|-------------|
| `sysctl -w net.ipv4.ip_forward=1` | Habilitar reenvío IPv4 temporalmente |
| `sysctl -p` | Recargar configuración de `/etc/sysctl.conf` |
| `cat /proc/sys/net/ipv4/ip_forward` | Verificar estado del reenvío |

## iptables - Comandos de gestión

| Comando | Descripción |
|---------|-------------|
| `iptables -L -n -v` | Listar reglas con números, sin resolver DNS |
| `iptables -L -t nat` | Listar reglas de la tabla nat |
| `iptables -A INPUT -p tcp --dport 22 -j ACCEPT` | Permitir SSH entrante |
| `iptables -I INPUT 1 -s 10.0.0.5 -j DROP` | Insertar regla en posición 1 |
| `iptables -D INPUT 3` | Eliminar regla número 3 de INPUT |
| `iptables -P INPUT DROP` | Política por defecto: descartar |
| `iptables -F` | Vaciar todas las reglas (flush) |
| `iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT` | Permitir conexiones establecidas |

## iptables - NAT y enmascaramiento

| Comando | Descripción |
|---------|-------------|
| `iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE` | NAT dinámico en interfaz de salida |
| `iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -j SNAT --to-source 1.2.3.4` | SNAT con IP fija |
| `iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:8080` | DNAT / port forwarding |

## iptables - Persistencia

| Comando | Descripción |
|---------|-------------|
| `iptables-save > /etc/iptables/rules.v4` | Guardar reglas actuales |
| `iptables-restore < /etc/iptables/rules.v4` | Restaurar reglas desde archivo |
| `ip6tables-save > /etc/iptables/rules.v6` | Guardar reglas IPv6 |

## nftables

| Comando | Descripción |
|---------|-------------|
| `nft list ruleset` | Listar todas las reglas activas |
| `nft add table inet mi_fw` | Crear tabla para IPv4 e IPv6 |
| `nft add chain inet mi_fw input { type filter hook input priority 0 \; policy drop \; }` | Crear cadena de entrada |
| `nft add rule inet mi_fw input tcp dport 22 accept` | Permitir SSH |
| `nft add rule inet mi_fw input ct state established,related accept` | Permitir conexiones establecidas |
| `nft add rule ip nat postrouting oifname "eth0" masquerade` | NAT con nftables |
| `nft flush ruleset` | Vaciar todas las reglas |
| `nft -f /etc/nftables.conf` | Cargar reglas desde archivo |

## firewalld (firewall-cmd)

| Comando | Descripción |
|---------|-------------|
| `firewall-cmd --state` | Ver estado de firewalld |
| `firewall-cmd --get-active-zones` | Mostrar zonas activas |
| `firewall-cmd --get-default-zone` | Ver zona por defecto |
| `firewall-cmd --list-all` | Listar toda la configuración de la zona activa |
| `firewall-cmd --permanent --add-service=http` | Permitir HTTP permanentemente |
| `firewall-cmd --permanent --add-port=8080/tcp` | Abrir puerto específico |
| `firewall-cmd --permanent --zone=external --add-masquerade` | Habilitar masquerading |
| `firewall-cmd --permanent --add-forward-port=port=80:proto=tcp:toport=8080:toaddr=192.168.1.10` | Port forwarding |
| `firewall-cmd --reload` | Recargar configuración permanente |
| `firewall-cmd --permanent --add-interface=eth1 --zone=internal` | Asignar interfaz a zona |
| `firewall-cmd --permanent --remove-service=ssh` | Eliminar servicio permitido |

## Archivos de configuración relevantes

| Archivo | Descripción |
|---------|-------------|
| `/etc/sysctl.conf` | Parámetros del kernel (ip_forward) |
| `/etc/sysctl.d/*.conf` | Directorio de configuración modular |
| `/etc/iptables/rules.v4` | Reglas persistentes de iptables (Debian) |
| `/etc/sysconfig/iptables` | Reglas persistentes de iptables (RHEL) |
| `/etc/nftables.conf` | Configuración de nftables |
| `/etc/firewalld/firewalld.conf` | Configuración principal de firewalld |
| `/etc/firewalld/zones/` | Definiciones de zonas personalizadas |
