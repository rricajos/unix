---
title: "Blue Team - Deteccion y Respuesta"
tags:
  - hacking
  - defensivo
  - blue-team
  - hacking-defensivo
tipo: hacking-defensivo
certificacion: hacking-vault
---

## Introduccion al Blue Team

El Blue Team es el equipo encargado de defender la infraestructura, detectar amenazas, responder a incidentes y recuperar los sistemas tras un compromiso. A diferencia del Red Team que simula ataques, el Blue Team opera de forma continua monitoreando, analizando y reforzando las defensas.

> **Nota:** Un Blue Team efectivo no solo reacciona ante incidentes, sino que proactivamente busca amenazas (threat hunting) antes de que se materialicen en brechas de seguridad.

## Proceso de Respuesta a Incidentes (NIST SP 800-61)

El framework NIST define seis fases para gestionar incidentes de seguridad de forma estructurada.

### Fases del framework NIST

| Fase | Descripcion | Actividades clave |
|------|-------------|-------------------|
| 1. Preparacion | Capacidad de respuesta antes del incidente | Herramientas, procedimientos, formacion del equipo |
| 2. Deteccion e Identificacion | Reconocer que un incidente ha ocurrido | Alertas SIEM, analisis de logs, correlacion de eventos |
| 3. Contencion | Limitar el alcance del incidente | Aislamiento de red, bloqueo de cuentas, snapshots |
| 4. Erradicacion | Eliminar la causa raiz | Eliminar malware, parchear vulnerabilidades, cerrar accesos |
| 5. Recuperacion | Restaurar operaciones normales | Restaurar backups, validar integridad, monitoreo intensivo |
| 6. Lecciones Aprendidas | Mejorar para el futuro | Post-mortem, actualizar procedimientos, metricas |

### Contencion a corto y largo plazo

```bash
# Contencion inmediata: aislar host comprometido
# Desconectar interfaz de red sin apagar (preservar memoria)
ip link set eth0 down

# Bloquear IP del atacante en el firewall
iptables -I INPUT -s 203.0.113.45 -j DROP
iptables -I OUTPUT -d 203.0.113.45 -j DROP

# Deshabilitar cuenta comprometida sin eliminarla
passwd -l usuario_comprometido
usermod -s /usr/sbin/nologin usuario_comprometido

# Revocar sesiones activas del usuario comprometido
pkill -KILL -u usuario_comprometido

# Contencion a largo plazo: crear snapshot para analisis forense
# LVM snapshot
lvcreate --size 10G --snapshot --name snap_forense /dev/vg0/root
```

> **Nota:** Durante la contencion, es crucial no destruir evidencia. Nunca apagues un servidor comprometido directamente; primero captura la memoria volatil y los procesos en ejecucion.

## Analisis de Logs

Los logs son la fuente principal de evidencia para detectar y reconstruir incidentes.

### Ubicaciones criticas de logs

| Archivo | Contenido |
|---------|-----------|
| `/var/log/auth.log` | Autenticacion, sudo, SSH (Debian/Ubuntu) |
| `/var/log/secure` | Autenticacion (RHEL/CentOS) |
| `/var/log/syslog` | Mensajes generales del sistema |
| `/var/log/kern.log` | Mensajes del kernel |
| `/var/log/faillog` | Intentos de login fallidos |
| `/var/log/wtmp` | Historial de sesiones (binario, leer con `last`) |
| `/var/log/btmp` | Intentos de login fallidos (binario, leer con `lastb`) |
| `/var/log/lastlog` | Ultimo login por usuario (leer con `lastlog`) |
| `/var/log/apache2/` | Logs del servidor web Apache |
| `/var/log/audit/audit.log` | Eventos de auditd |

### Comandos esenciales para analisis de logs

```bash
# Buscar intentos de login SSH fallidos
grep "Failed password" /var/log/auth.log | tail -20

# Contar intentos por IP atacante
grep "Failed password" /var/log/auth.log | \
  awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head -10

# Buscar escalacion de privilegios exitosa
grep "sudo:" /var/log/auth.log | grep "COMMAND" | tail -20

# Sesiones activas e historicas
who          # Sesiones activas ahora
w            # Sesiones activas con actividad
last -20     # Ultimas 20 sesiones
lastb -20    # Ultimos 20 intentos fallidos
lastlog      # Ultimo login de cada usuario

# journalctl para sistemas con systemd
journalctl -u sshd --since "2 hours ago"
journalctl -p err --since today
journalctl _UID=0 --since "2025-01-15"
journalctl -k --grep="segfault"

# Buscar actividad sospechosa en crontabs
grep -r "curl\|wget\|nc\|bash -i\|/dev/tcp" /var/spool/cron/
grep -r "curl\|wget\|nc" /etc/cron.*
```

> **Nota:** Los archivos `wtmp` y `btmp` son binarios. Nunca intentes leerlos con `cat`. Usa los comandos `last`, `lastb` y `utmpdump` respectivamente.

## Conceptos SIEM

Un SIEM (Security Information and Event Management) centraliza logs, correlaciona eventos y genera alertas de seguridad.

### ELK Stack (Elasticsearch + Logstash + Kibana)

```bash
# Arquitectura basica del stack ELK
# Agentes (Filebeat) -> Logstash -> Elasticsearch -> Kibana

# Configuracion de Filebeat para enviar auth.log
# /etc/filebeat/filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/auth.log
      - /var/log/syslog
    fields:
      source_type: linux_system

output.logstash:
  hosts: ["siem-server:5044"]

# Pipeline de Logstash para parsear auth.log
# /etc/logstash/conf.d/auth.conf
input {
  beats { port => 5044 }
}
filter {
  if [fields][source_type] == "linux_system" {
    grok {
      match => { "message" => "%{SYSLOGTIMESTAMP:timestamp} %{HOSTNAME:host} %{PROG:program}(?:\[%{POSINT:pid}\])?: %{GREEDYDATA:log_message}" }
    }
  }
}
output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "security-logs-%{+YYYY.MM.dd}"
  }
}
```

### Wazuh como SIEM open-source

```bash
# Wazuh combina HIDS + SIEM + Compliance
# Instalar agente Wazuh en endpoints
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | apt-key add -
apt install wazuh-agent

# Configurar agente para reportar al manager
# /var/ossec/etc/ossec.conf
<client>
  <server>
    <address>wazuh-manager.ejemplo.com</address>
    <port>1514</port>
    <protocol>tcp</protocol>
  </server>
</client>

# Verificar estado del agente
systemctl status wazuh-agent
/var/ossec/bin/agent_control -l
```

## Threat Hunting

El threat hunting es la busqueda proactiva de amenazas que han evadido los controles de seguridad automatizados.

### Metodologia de caza de amenazas

```
1. Hipotesis  ->  Formular teoria basada en inteligencia de amenazas
2. Busqueda   ->  Recopilar y analizar datos relevantes
3. Hallazgo   ->  Identificar actividad maliciosa o anomala
4. Respuesta  ->  Contener, erradicar y documentar
5. Mejora     ->  Crear nuevas detecciones automatizadas
```

### Busquedas tipicas de threat hunting

```bash
# Buscar procesos con conexiones de red inusuales
ss -tulnp | grep -v "127.0.0.1\|::1"

# Procesos ejecutandose desde ubicaciones sospechosas
find /tmp /var/tmp /dev/shm -type f -executable 2>/dev/null

# Crontabs sospechosos de todos los usuarios
for user in $(cut -f1 -d: /etc/passwd); do
    crontab -l -u "$user" 2>/dev/null && echo "--- $user ---"
done

# Binarios con SUID inesperados
find / -perm -4000 -type f 2>/dev/null | sort > /tmp/suid_actual.txt
diff /tmp/suid_baseline.txt /tmp/suid_actual.txt

# Modulos del kernel cargados (buscar rootkits)
lsmod | sort > /tmp/modulos_actual.txt
diff /tmp/modulos_baseline.txt /tmp/modulos_actual.txt

# Buscar shells reversas conocidas
ss -tlnp | grep -E ":(4444|5555|6666|8888|9999)"
grep -r "/dev/tcp/" /home/ /tmp/ /var/tmp/ 2>/dev/null
```

## Forense Digital Basico

### Adquisicion de evidencia

```bash
# Captura de memoria volatil con LiME
insmod /path/to/lime.ko "path=/evidence/memory.lime format=lime"

# Crear imagen forense del disco con dd
dd if=/dev/sda of=/evidence/disco.img bs=4M status=progress conv=sync,noerror

# Calcular hash para integridad
sha256sum /evidence/disco.img > /evidence/disco.img.sha256

# Crear imagen con dcfldd (verificacion integrada)
dcfldd if=/dev/sda of=/evidence/disco.img hash=sha256 \
  hashlog=/evidence/disco.hash bs=4M
```

### Analisis de memoria con Volatility

```bash
# Identificar perfil del sistema
volatility -f memory.lime imageinfo

# Listar procesos
volatility -f memory.lime --profile=LinuxUbuntu2204x64 linux_pslist

# Conexiones de red activas
volatility -f memory.lime --profile=LinuxUbuntu2204x64 linux_netstat

# Buscar inyeccion de procesos
volatility -f memory.lime --profile=LinuxUbuntu2204x64 linux_malfind

# Extraer archivos de memoria
volatility -f memory.lime --profile=LinuxUbuntu2204x64 linux_find_file -F "/tmp/malware"

# Historial de bash en memoria
volatility -f memory.lime --profile=LinuxUbuntu2204x64 linux_bash
```

### Analisis de disco con Autopsy

```bash
# Autopsy es una interfaz grafica para The Sleuth Kit
# Lanzar Autopsy
autopsy

# O usar herramientas de linea de comandos de TSK
# Listar particiones
mmls disco.img

# Listar archivos (incluidos eliminados)
fls -r -o 2048 disco.img

# Recuperar archivo eliminado por inode
icat -o 2048 disco.img 12345 > archivo_recuperado

# Timeline de actividad del sistema de archivos
fls -r -m "/" -o 2048 disco.img > body.txt
mactime -b body.txt -d > timeline.csv
```

## Respuesta en Vivo (Live Response)

Cuando se sospecha de un compromiso activo, estos comandos permiten evaluar rapidamente el estado del sistema.

```bash
# Procesos en ejecucion detallados
ps auxwf

# Buscar procesos sospechosos
ps aux | grep -E "nc |ncat |socat |/bin/bash -i|python.*pty"

# Conexiones de red activas
ss -tulnp
ss -anp | grep ESTABLISHED

# Archivos abiertos por procesos sospechosos
lsof -p <PID_sospechoso>
lsof -i :4444

# Analisis del filesystem /proc
ls -la /proc/<PID>/exe       # Enlace al binario real
cat /proc/<PID>/cmdline      # Linea de comandos
ls -la /proc/<PID>/fd/       # Descriptores de archivo abiertos
cat /proc/<PID>/maps         # Mapa de memoria
cat /proc/<PID>/environ      # Variables de entorno

# Verificar integridad de binarios criticos
sha256sum /usr/bin/ps /usr/bin/ss /usr/bin/netstat /usr/bin/ls
# Comparar con hashes conocidos del paquete
dpkg -V coreutils procps iproute2

# Buscar archivos modificados recientemente
find / -mtime -1 -type f 2>/dev/null | grep -v "/proc\|/sys\|/run"

# Verificar modulos del kernel
lsmod
cat /proc/modules
```

> **Nota:** Durante una respuesta en vivo, asume que las herramientas del sistema pueden estar comprometidas. Si es posible, utiliza binarios estaticos de un medio confiable externo (USB con toolkit forense).

## IOCs y Reglas YARA

Los Indicadores de Compromiso (IOCs) son artefactos observables que indican actividad maliciosa.

### Tipos de IOCs

| Tipo | Ejemplos |
|------|----------|
| Red | IPs maliciosas, dominios C2, URLs de phishing |
| Sistema | Hashes de malware, rutas de archivos, claves de registro |
| Email | Direcciones de remitente, asuntos, adjuntos |
| Comportamiento | Patrones de trafico, horarios inusuales, volumenes de datos |

### Crear reglas YARA para deteccion de malware

```yara
rule Linux_Reverse_Shell {
    meta:
        description = "Detecta scripts de shell reversa comunes en Linux"
        author = "Blue Team"
        severity = "high"
        date = "2025-01-15"

    strings:
        $s1 = "/dev/tcp/" ascii
        $s2 = "bash -i >& " ascii
        $s3 = "nc -e /bin/" ascii
        $s4 = "python -c 'import socket,subprocess,os" ascii
        $s5 = "mkfifo /tmp/" ascii
        $s6 = "socat exec:" ascii
        $s7 = "perl -e 'use Socket" ascii

    condition:
        any of them
}

rule Crypto_Miner_Linux {
    meta:
        description = "Detecta mineros de criptomonedas en Linux"
        author = "Blue Team"
        severity = "medium"

    strings:
        $pool1 = "stratum+tcp://" ascii
        $pool2 = "pool.minergate" ascii
        $pool3 = "xmrpool" ascii
        $wallet = /[0-9a-zA-Z]{95}/ ascii
        $config1 = "\"algo\"" ascii
        $config2 = "\"url\"" ascii
        $config3 = "\"user\"" ascii

    condition:
        ($pool1 or $pool2 or $pool3) or
        (2 of ($config*) and $wallet)
}
```

```bash
# Escanear con YARA
yara -r reglas_malware.yar /tmp/ /var/tmp/ /dev/shm/

# Escanear procesos en memoria
yara -p 4 reglas_malware.yar /proc/*/exe 2>/dev/null
```

## Analisis Basico de Malware

### Analisis estatico

```bash
# Identificar tipo de archivo
file muestra_sospechosa

# Extraer cadenas legibles
strings -a muestra_sospechosa | head -50
strings -el muestra_sospechosa   # Cadenas Unicode (little-endian)

# Informacion de binarios ELF
readelf -h muestra_sospechosa    # Header ELF
readelf -S muestra_sospechosa    # Secciones
readelf -d muestra_sospechosa    # Dependencias dinamicas

# Calcular hashes para buscar en VirusTotal
md5sum muestra_sospechosa
sha256sum muestra_sospechosa

# Buscar el hash en VirusTotal via API
curl -s "https://www.virustotal.com/api/v3/files/<SHA256>" \
  -H "x-apikey: TU_API_KEY" | jq '.data.attributes.last_analysis_stats'
```

### Analisis dinamico (en sandbox aislado)

```bash
# Rastrear llamadas al sistema
strace -f -o strace_output.txt ./muestra_sospechosa

# Rastrear llamadas a librerias
ltrace -f -o ltrace_output.txt ./muestra_sospechosa

# Monitorear actividad de red del proceso
tcpdump -i any -w captura_malware.pcap &
./muestra_sospechosa
kill %1

# Monitorear actividad del sistema de archivos
inotifywait -m -r /tmp /var/tmp /home --format '%w%f %e' &
./muestra_sospechosa
```

> **Nota:** NUNCA ejecutes malware fuera de un entorno aislado. Utiliza maquinas virtuales con snapshots, sin acceso a la red de produccion, y restaura el estado limpio tras cada analisis.

## Forense de Red

```bash
# Captura de trafico de red
tcpdump -i eth0 -w captura.pcap -c 10000
tcpdump -i eth0 'host 203.0.113.45 and port 443' -w sospechoso.pcap

# Analisis con tshark (Wireshark en CLI)
tshark -r captura.pcap -Y "http.request" -T fields \
  -e ip.src -e http.host -e http.request.uri

# Buscar exfiltracion DNS
tshark -r captura.pcap -Y "dns" -T fields \
  -e dns.qry.name | sort | uniq -c | sort -rn | head -20

# Extraer archivos transferidos
tshark -r captura.pcap --export-objects http,/tmp/extracted_files/

# Analisis con Zeek (anteriormente Bro)
zeek -r captura.pcap
cat conn.log | zeek-cut id.orig_h id.resp_h id.resp_p proto duration
cat dns.log | zeek-cut query answers
cat http.log | zeek-cut host uri method status_code
cat files.log | zeek-cut filename mime_type md5

# Buscar beaconing (comunicacion C2 periodica)
cat conn.log | zeek-cut id.orig_h id.resp_h id.resp_p duration | \
  sort | uniq -c | sort -rn | head -20
```

## Cadena de Custodia y Documentacion

La documentacion rigurosa es esencial para que la evidencia sea admisible en procedimientos legales y para la mejora continua del equipo.

### Registro de cadena de custodia

```
=== REGISTRO DE CADENA DE CUSTODIA ===

Caso:          INC-2025-0042
Fecha inicio:  2025-01-15 14:30 UTC
Analista:      [nombre]

--- EVIDENCIA #1 ---
Descripcion:   Imagen de disco /dev/sda del servidor web01
Hash SHA256:   a1b2c3d4e5f6...
Fecha captura: 2025-01-15 15:00 UTC
Herramienta:   dcfldd v1.9
Capturado por: [nombre del analista]
Almacenado en: /evidence/INC-2025-0042/disco_web01.img
Accesos:
  - 2025-01-15 15:30 - [analista1] - Analisis inicial
  - 2025-01-16 09:00 - [analista2] - Revision de timeline
```

### Estructura de documentacion de incidentes

```
1. Resumen ejecutivo
2. Timeline del incidente (UTC)
3. Sistemas afectados
4. Vector de ataque inicial
5. Movimiento lateral observado
6. Datos comprometidos
7. Acciones de contencion tomadas
8. Acciones de erradicacion
9. Plan de recuperacion
10. Indicadores de compromiso (IOCs)
11. Lecciones aprendidas
12. Recomendaciones de mejora
```

> **Nota:** Siempre documenta las acciones en tiempo UTC para evitar ambiguedades con zonas horarias. Cada entrada del timeline debe incluir la hora exacta, la accion realizada y quien la ejecuto.

## Resumen

El Blue Team combina capacidades de deteccion, respuesta, forense y caza de amenazas para proteger la infraestructura. La clave esta en seguir procesos estructurados como el framework NIST, mantener una visibilidad completa mediante SIEM y analisis de logs, y mejorar continuamente a traves de las lecciones aprendidas de cada incidente. La documentacion rigurosa y la cadena de custodia son tan importantes como las habilidades tecnicas de analisis.
