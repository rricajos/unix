---
title: "Hardening de Sistemas Linux"
tags:
  - hacking
  - defensivo
  - hardening
  - hacking-defensivo
tipo: hacking-defensivo
certificacion: hacking-vault
---

## Introduccion al Hardening

El hardening (endurecimiento) de sistemas consiste en reducir la superficie de ataque eliminando software innecesario, configurando permisos restrictivos y aplicando las mejores practicas de seguridad. El objetivo es transformar una instalacion por defecto en un sistema resistente a ataques.

> **Nota:** El hardening no es un evento unico sino un proceso continuo. Cada actualizacion del sistema o nuevo servicio desplegado requiere una revision de la postura de seguridad.

## Metodologia CIS Benchmarks

Los CIS (Center for Internet Security) Benchmarks son guias de configuracion reconocidas por la industria que proporcionan recomendaciones paso a paso para asegurar sistemas operativos, servicios y aplicaciones.

### Niveles de perfil CIS

| Nivel | Descripcion | Impacto |
|-------|-------------|---------|
| Level 1 | Configuraciones basicas, minimo impacto operacional | Bajo |
| Level 2 | Configuraciones avanzadas, mayor seguridad | Medio-Alto |
| STIG | Requisitos del DoD, maxima restriccion | Alto |

### Aplicar CIS Benchmarks en la practica

```bash
# Descargar la herramienta CIS-CAT Lite para evaluacion automatizada
# https://www.cisecurity.org/cis-cat

# Ejecutar evaluacion contra un perfil CIS
./cis-cat-full/CIS-CAT.sh -b benchmarks/CIS_Ubuntu_Linux_22.04_Benchmark_v1.0.0-xccdf.xml

# Revisar el informe HTML generado
firefox reports/CIS-CAT_Results_*.html
```

> **Nota:** Los benchmarks CIS se actualizan regularmente. Siempre utiliza la version mas reciente correspondiente a tu distribucion y version del sistema operativo.

## Hardening del Sistema Operativo

### Instalacion minima

La primera decision de seguridad comienza durante la instalacion. Se debe seleccionar una instalacion minima sin entorno grafico ni paquetes innecesarios.

```bash
# Listar paquetes instalados y revisar cuales son necesarios
dpkg --list | wc -l          # Debian/Ubuntu
rpm -qa | wc -l              # RHEL/CentOS

# Eliminar paquetes innecesarios
apt purge telnet rsh-client rsh-redone-client
apt purge avahi-daemon cups bluetooth

# Deshabilitar servicios innecesarios
systemctl disable --now avahi-daemon.service
systemctl disable --now cups.service
systemctl disable --now bluetooth.service
systemctl disable --now ModemManager.service

# Listar servicios activos para revision
systemctl list-units --type=service --state=running
```

### Eliminar compiladores en produccion

```bash
# En servidores de produccion, eliminar herramientas de compilacion
apt purge gcc g++ make
apt purge build-essential
```

> **Nota:** Eliminar compiladores dificulta que un atacante compile exploits directamente en el sistema comprometido.

## Hardening de SSH

SSH es uno de los servicios mas criticos y frecuentemente atacados. Su configuracion debe ser restrictiva.

```bash
# /etc/ssh/sshd_config - Configuracion recomendada

# Deshabilitar acceso root por SSH
PermitRootLogin no

# Solo autenticacion por clave publica
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no

# Cambiar puerto por defecto (seguridad por obscuridad, complementaria)
Port 2222

# Restringir usuarios permitidos
AllowUsers deploy admin
AllowGroups sshusers

# Limitar intentos y sesiones
MaxAuthTries 3
MaxSessions 2
LoginGraceTime 30

# Deshabilitar funcionalidades innecesarias
X11Forwarding no
AllowTcpForwarding no
AllowAgentForwarding no
PermitTunnel no

# Algoritmos criptograficos fuertes
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
HostKeyAlgorithms ssh-ed25519,rsa-sha2-512

# Tiempo de inactividad
ClientAliveInterval 300
ClientAliveCountMax 2

# Banner de advertencia legal
Banner /etc/ssh/banner
```

### Configurar Fail2ban para SSH

```bash
# Instalar fail2ban
apt install fail2ban

# /etc/fail2ban/jail.local
[sshd]
enabled  = true
port     = 2222
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 3600
findtime = 600
action   = iptables-multiport[name=sshd, port="2222", protocol=tcp]

# Verificar estado
fail2ban-client status sshd
```

## Hardening del Kernel

Los parametros del kernel controlados via `sysctl` permiten mitigar multiples vectores de ataque.

```bash
# /etc/sysctl.d/99-hardening.conf

# ASLR - Address Space Layout Randomization (2 = completo)
kernel.randomize_va_space = 2

# Restringir acceso a punteros del kernel
kernel.kptr_restrict = 2

# Restringir acceso a dmesg para usuarios no privilegiados
kernel.dmesg_restrict = 1

# Restringir perf_event para usuarios no privilegiados
kernel.perf_event_paranoid = 3

# Deshabilitar SysRq (teclas magicas del kernel)
kernel.sysrq = 0

# Proteger contra enlaces simbolicos y hardlinks maliciosos
fs.protected_symlinks = 1
fs.protected_hardlinks = 1
fs.protected_fifos = 2
fs.protected_regular = 2

# Restringir uso de BPF
kernel.unprivileged_bpf_disabled = 1
net.core.bpf_jit_harden = 2

# Restringir ptrace
kernel.yama.ptrace_scope = 2

# Aplicar los cambios
sysctl --system
```

> **Nota:** El valor `kernel.randomize_va_space = 2` activa ASLR completo, aleatorizando la posicion de stack, heap, mmap y la base del ejecutable en memoria, dificultando significativamente los exploits de corrupcion de memoria.

## Hardening del Sistema de Archivos

### Opciones de montaje restrictivas

```bash
# /etc/fstab - Opciones de seguridad para particiones

# /tmp con restricciones completas
tmpfs  /tmp  tmpfs  defaults,noexec,nosuid,nodev,size=2G  0  0

# /var/tmp restrictivo
/tmp   /var/tmp  none  bind  0  0

# /home sin ejecucion de SUID
UUID=xxx  /home  ext4  defaults,nosuid,nodev  0  2

# /var/log protegido
UUID=xxx  /var/log  ext4  defaults,noexec,nosuid,nodev  0  2

# /boot solo lectura (montar rw solo para actualizaciones)
UUID=xxx  /boot  ext4  defaults,noexec,nosuid,nodev,ro  0  2
```

| Opcion  | Funcion                                         |
|---------|------------------------------------------------|
| noexec  | Impide ejecucion de binarios en la particion   |
| nosuid  | Ignora bits SUID y SGID                        |
| nodev   | No permite dispositivos de bloque/caracter     |
| ro      | Monta en solo lectura                          |

### Cifrado de disco con LUKS

```bash
# Crear particion cifrada
cryptsetup luksFormat --type luks2 --cipher aes-xts-plain64 \
  --key-size 512 --hash sha512 /dev/sdb1

# Abrir particion cifrada
cryptsetup luksOpen /dev/sdb1 datos_cifrados

# Crear sistema de archivos
mkfs.ext4 /dev/mapper/datos_cifrados

# Montar
mount /dev/mapper/datos_cifrados /mnt/datos

# Respaldar cabecera LUKS (critico para recuperacion)
cryptsetup luksHeaderBackup /dev/sdb1 \
  --header-backup-file /root/luks-header-sdb1.bak
```

## Hardening de Red

```bash
# /etc/sysctl.d/99-network-hardening.conf

# Deshabilitar IPv6 si no se utiliza
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1

# Deshabilitar IP forwarding (salvo que sea router/gateway)
net.ipv4.ip_forward = 0

# Proteccion contra ataques de red
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0

# Proteccion contra SYN flood
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2

# Ignorar broadcast ICMP (proteccion Smurf)
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Registrar paquetes marcianos
net.ipv4.conf.all.log_martians = 1
```

### Politica de firewall por defecto DROP

```bash
# Politica restrictiva: denegar todo, permitir solo lo necesario
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP

# Permitir loopback
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Permitir conexiones establecidas
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Permitir SSH desde red administrativa
iptables -A INPUT -s 10.0.1.0/24 -p tcp --dport 2222 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 2222 -j ACCEPT

# Permitir DNS saliente
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 53 -j ACCEPT

# Permitir actualizaciones (HTTP/HTTPS saliente)
iptables -A OUTPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT
```

## Hardening de Servicios con systemd

systemd ofrece directivas de sandboxing que limitan lo que un servicio puede hacer en el sistema.

```ini
# /etc/systemd/system/mi-servicio.service.d/hardening.conf
[Service]
# Proteger el sistema de archivos
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/lib/mi-servicio /var/log/mi-servicio

# Restricciones de privilegios
NoNewPrivileges=yes
PrivateTmp=yes
PrivateDevices=yes
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes

# Restringir capacidades
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE

# Restringir llamadas al sistema
SystemCallFilter=@system-service
SystemCallArchitectures=native

# Red restringida
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
```

```bash
# Verificar nivel de seguridad de un servicio
systemd-analyze security mi-servicio.service

# Resultado muestra puntuacion de 0.0 (inseguro) a 10.0 (seguro)
# Objetivo: mantener servicios por encima de 6.0
```

> **Nota:** Usa `systemd-analyze security` regularmente para verificar que todos los servicios criticos tienen un nivel de exposicion bajo. Valores superiores a 6.0 son aceptables para la mayoria de servicios en produccion.

## Seguridad de Cuentas de Usuario

### Politicas de contrasenas

```bash
# /etc/login.defs
PASS_MAX_DAYS   90
PASS_MIN_DAYS   7
PASS_MIN_LEN    14
PASS_WARN_AGE   14

# Configurar politica PAM para complejidad
# /etc/pam.d/common-password
password requisite pam_pwquality.so retry=3 minlen=14 \
  dcredit=-1 ucredit=-1 ocredit=-1 lcredit=-1 maxrepeat=3

# Establecer expiracion para usuarios existentes
chage -M 90 -m 7 -W 14 usuario

# Verificar politica de un usuario
chage -l usuario

# Bloqueo automatico tras intentos fallidos
# /etc/pam.d/common-auth
auth required pam_faillock.so preauth deny=5 unlock_time=900
auth required pam_faillock.so authfail deny=5 unlock_time=900
```

### Asegurar cuentas del sistema

```bash
# Asignar shell nologin a cuentas de servicio
usermod -s /usr/sbin/nologin www-data
usermod -s /usr/sbin/nologin mysql
usermod -s /usr/sbin/nologin nobody

# Bloquear cuentas sin uso
passwd -l cuenta_innecesaria

# Revisar cuentas con UID 0 (solo root deberia tenerlo)
awk -F: '$3 == 0 {print $1}' /etc/passwd

# Restringir acceso a su
# /etc/pam.d/su
auth required pam_wheel.so use_uid
# Solo miembros del grupo wheel pueden usar su
```

### Configuracion segura de sudo

```bash
# /etc/sudoers.d/hardening (editar con visudo)
Defaults    env_reset
Defaults    mail_badpass
Defaults    secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Defaults    logfile="/var/log/sudo.log"
Defaults    log_input, log_output
Defaults    passwd_timeout=1
Defaults    timestamp_timeout=5
Defaults    use_pty

# Asignar permisos granulares en lugar de ALL
usuario  ALL=(ALL) /usr/bin/systemctl restart nginx, /usr/bin/journalctl
```

## Sistema de Auditoria con auditd

```bash
# Instalar auditd
apt install auditd audispd-plugins

# /etc/audit/rules.d/hardening.rules

# Monitorear cambios en archivos criticos de autenticacion
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/gshadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /etc/sudoers.d/ -p wa -k sudoers

# Monitorear configuracion SSH
-w /etc/ssh/sshd_config -p wa -k sshd_config

# Monitorear ejecucion de comandos privilegiados
-a always,exit -F arch=b64 -S execve -F euid=0 -k root_commands

# Monitorear montajes de sistemas de archivos
-a always,exit -F arch=b64 -S mount -S umount2 -k mounts

# Monitorear eliminacion de archivos
-a always,exit -F arch=b64 -S unlink -S unlinkat -S rename -S renameat -k delete

# Monitorear modificaciones de hora
-a always,exit -F arch=b64 -S adjtimex -S settimeofday -k time_change
-w /etc/localtime -p wa -k time_change

# Hacer reglas inmutables (requiere reinicio para cambiar)
-e 2
```

```bash
# Buscar eventos especificos
ausearch -k identity --start today
ausearch -k sudoers -i

# Generar informes
aureport --auth
aureport --login --summary
aureport --failed
```

## Auditoria Automatizada con Lynis

```bash
# Instalar Lynis
apt install lynis

# Ejecutar auditoria completa del sistema
lynis audit system

# Ejecutar auditoria y guardar informe
lynis audit system --no-colors > /var/log/lynis-audit-$(date +%F).log

# Revisar resultados
cat /var/log/lynis-report.dat | grep suggestion
cat /var/log/lynis-report.dat | grep warning

# Ejecutar solo pruebas especificas
lynis audit system --tests-from-group "firewalls"
lynis audit system --tests-from-group "authentication"
```

> **Nota:** Lynis asigna un Hardening Index (indice de endurecimiento) de 0 a 100. Un sistema recien instalado suele puntuar entre 55-65. Despues de aplicar las recomendaciones de esta guia, el objetivo es superar 80.

## Estrategia de Gestion de Parches

```bash
# Configurar actualizaciones automaticas de seguridad (Debian/Ubuntu)
apt install unattended-upgrades
dpkg-reconfigure unattended-upgrades

# /etc/apt/apt.conf.d/50unattended-upgrades
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Mail "admin@ejemplo.com";

# Verificar paquetes pendientes de actualizacion
apt list --upgradable

# En RHEL/CentOS
yum check-update --security
dnf updateinfo list security
```

### Checklist de verificacion de hardening

| Categoria          | Verificacion                             | Comando                                    |
|--------------------|------------------------------------------|--------------------------------------------|
| SSH                | Root login deshabilitado                 | `grep PermitRootLogin /etc/ssh/sshd_config`|
| SSH                | Solo autenticacion por clave             | `grep PasswordAuth /etc/ssh/sshd_config`   |
| Kernel             | ASLR activo                              | `cat /proc/sys/kernel/randomize_va_space`  |
| Filesystem         | /tmp con noexec                          | `mount \| grep /tmp`                       |
| Cuentas            | Sin cuentas con UID 0 extra             | `awk -F: '$3==0' /etc/passwd`              |
| Firewall           | Politica DROP por defecto                | `iptables -L -n`                           |
| Auditoria          | auditd activo                            | `systemctl is-active auditd`               |
| Actualizaciones    | Parches de seguridad al dia              | `apt list --upgradable`                    |

## Resumen

El hardening efectivo requiere un enfoque en capas que abarque desde el kernel hasta las aplicaciones. Siguiendo los CIS Benchmarks como referencia, aplicando configuraciones restrictivas en SSH, kernel, sistema de archivos y red, y manteniendo un sistema de auditoria activo con auditd y Lynis, se consigue una postura de seguridad solida. El proceso debe ser continuo, con revisiones periodicas y una estrategia de parches bien definida.
