---
title: "Enumeracion de Servicios y Vulnerabilidades"
tags:
  - hacking
  - ofensivo
  - enumeracion
  - hacking-ofensivo
tipo: hacking-ofensivo
certificacion: hacking-vault
---

# Enumeracion de Servicios y Vulnerabilidades

La enumeracion es el proceso de extraer informacion detallada de los servicios descubiertos durante la fase de reconocimiento. Aqui se identifican usuarios, recursos compartidos, versiones de software y posibles vectores de ataque.

> **Nota de seguridad:** La enumeracion implica interaccion directa con los sistemas objetivo. Realiza estas actividades exclusivamente dentro del alcance autorizado y documenta cada paso para el informe final.

## Enumeracion SMB (Puerto 445/139)

SMB (Server Message Block) es un protocolo de uso compartido de archivos frecuente en entornos Windows. Es uno de los vectores mas explotados en pentesting.

### smbclient

```bash
# Listar recursos compartidos sin autenticacion (null session)
smbclient -L //10.10.10.1 -N

# Conectarse a un recurso compartido
smbclient //10.10.10.1/share -N

# Conectarse con credenciales
smbclient //10.10.10.1/share -U usuario%password

# Comandos dentro de smbclient
smb: \> ls                    # Listar archivos
smb: \> cd directorio         # Cambiar directorio
smb: \> get archivo.txt       # Descargar archivo
smb: \> put local.txt         # Subir archivo
smb: \> mget *.txt            # Descargar multiples archivos
```

### enum4linux

```bash
# Enumeracion completa
enum4linux -a 10.10.10.1

# Enumerar usuarios
enum4linux -U 10.10.10.1

# Enumerar recursos compartidos
enum4linux -S 10.10.10.1

# Enumerar grupos
enum4linux -G 10.10.10.1

# Enumerar politicas de password
enum4linux -P 10.10.10.1

# Version moderna: enum4linux-ng
enum4linux-ng -A 10.10.10.1
```

### CrackMapExec (NetExec)

```bash
# Enumerar hosts con SMB
crackmapexec smb 10.10.10.0/24

# Autenticacion con credenciales
crackmapexec smb 10.10.10.1 -u usuario -p password

# Enumerar recursos compartidos
crackmapexec smb 10.10.10.1 -u usuario -p password --shares

# Enumerar usuarios
crackmapexec smb 10.10.10.1 -u usuario -p password --users

# Spray de passwords
crackmapexec smb 10.10.10.1 -u usuarios.txt -p password123

# Verificar acceso con hashes (pass-the-hash)
crackmapexec smb 10.10.10.1 -u admin -H HASH_NTLM

# Ejecutar comandos
crackmapexec smb 10.10.10.1 -u admin -p pass -x "whoami"
```

### smbmap

```bash
# Listar permisos de recursos compartidos
smbmap -H 10.10.10.1

# Con credenciales
smbmap -H 10.10.10.1 -u usuario -p password

# Listar contenido recursivamente
smbmap -H 10.10.10.1 -R

# Descargar un archivo
smbmap -H 10.10.10.1 --download "share\archivo.txt"

# Subir un archivo
smbmap -H 10.10.10.1 --upload local.txt "share\remoto.txt"
```

## Enumeracion LDAP (Puerto 389/636)

LDAP (Lightweight Directory Access Protocol) es fundamental en entornos Active Directory.

### ldapsearch

```bash
# Consulta anonima para obtener el base DN
ldapsearch -x -H ldap://10.10.10.1 -s base namingContexts

# Enumerar todo el directorio
ldapsearch -x -H ldap://10.10.10.1 -b "DC=dominio,DC=local"

# Con autenticacion
ldapsearch -x -H ldap://10.10.10.1 -D "CN=usuario,DC=dominio,DC=local" -w password -b "DC=dominio,DC=local"

# Buscar usuarios
ldapsearch -x -H ldap://10.10.10.1 -b "DC=dominio,DC=local" "(objectClass=user)" sAMAccountName

# Buscar equipos
ldapsearch -x -H ldap://10.10.10.1 -b "DC=dominio,DC=local" "(objectClass=computer)" name

# Buscar grupos
ldapsearch -x -H ldap://10.10.10.1 -b "DC=dominio,DC=local" "(objectClass=group)" cn member
```

### windapsearch

```bash
# Enumerar usuarios del dominio
python3 windapsearch.py -d dominio.local --dc-ip 10.10.10.1 -U

# Enumerar grupos
python3 windapsearch.py -d dominio.local --dc-ip 10.10.10.1 -G

# Enumerar equipos
python3 windapsearch.py -d dominio.local --dc-ip 10.10.10.1 -C

# Buscar usuarios con privilegios
python3 windapsearch.py -d dominio.local --dc-ip 10.10.10.1 --da

# Buscar cuentas con Kerberoasting
python3 windapsearch.py -d dominio.local --dc-ip 10.10.10.1 -U --attrs servicePrincipalName
```

## Enumeracion SNMP (Puerto 161 UDP)

SNMP (Simple Network Management Protocol) puede exponer gran cantidad de informacion del sistema.

```bash
# snmpwalk - recorrer el arbol MIB
snmpwalk -v2c -c public 10.10.10.1

# Enumerar informacion del sistema
snmpwalk -v2c -c public 10.10.10.1 1.3.6.1.2.1.1

# Enumerar usuarios (Windows)
snmpwalk -v2c -c public 10.10.10.1 1.3.6.1.4.1.77.1.2.25

# Enumerar procesos en ejecucion
snmpwalk -v2c -c public 10.10.10.1 1.3.6.1.2.1.25.4.2.1.2

# Enumerar puertos abiertos
snmpwalk -v2c -c public 10.10.10.1 1.3.6.1.2.1.6.13.1.3

# Enumerar software instalado
snmpwalk -v2c -c public 10.10.10.1 1.3.6.1.2.1.25.6.3.1.2

# onesixtyone - fuerza bruta de community strings
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt 10.10.10.1

# snmp-check - enumeracion automatizada
snmp-check 10.10.10.1 -c public
```

**OIDs utiles de SNMP:**

| OID | Informacion |
|-----|-------------|
| `1.3.6.1.2.1.1.1` | Descripcion del sistema |
| `1.3.6.1.2.1.1.5` | Nombre del host |
| `1.3.6.1.4.1.77.1.2.25` | Cuentas de usuario (Windows) |
| `1.3.6.1.2.1.25.4.2.1.2` | Procesos en ejecucion |
| `1.3.6.1.2.1.6.13.1.3` | Puertos TCP abiertos |
| `1.3.6.1.2.1.25.6.3.1.2` | Software instalado |

## Enumeracion Web

### Gobuster

```bash
# Descubrimiento de directorios
gobuster dir -u http://10.10.10.1 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt

# Con extensiones de archivo
gobuster dir -u http://10.10.10.1 -w /usr/share/wordlists/dirb/common.txt -x php,html,txt,bak

# Descubrimiento de subdominios (vhosts)
gobuster vhost -u http://ejemplo.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

# Enumeracion DNS
gobuster dns -d ejemplo.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

# Opciones comunes
gobuster dir -u http://10.10.10.1 -w wordlist.txt -t 50 -o resultados.txt --no-error -b 404,403
#   -t 50        hilos concurrentes
#   -o           guardar resultados
#   --no-error   ocultar errores de conexion
#   -b           codigos de estado a ignorar
```

### Ffuf

```bash
# Fuzzing de directorios
ffuf -u http://10.10.10.1/FUZZ -w /usr/share/wordlists/dirb/common.txt

# Fuzzing de archivos con extension
ffuf -u http://10.10.10.1/FUZZ -w wordlist.txt -e .php,.html,.txt

# Fuzzing de subdominios (vhosts)
ffuf -u http://10.10.10.1 -H "Host: FUZZ.ejemplo.com" -w subdomains.txt -fc 302

# Fuzzing de parametros GET
ffuf -u "http://10.10.10.1/page?FUZZ=test" -w params.txt

# Fuzzing de parametros POST
ffuf -u http://10.10.10.1/login -X POST -d "user=admin&FUZZ=test" -w params.txt

# Filtrar por tamano de respuesta
ffuf -u http://10.10.10.1/FUZZ -w wordlist.txt -fs 1234

# Filtrar por cantidad de palabras
ffuf -u http://10.10.10.1/FUZZ -w wordlist.txt -fw 42

# Multiples puntos de fuzzing
ffuf -u http://10.10.10.1/FUZZ1/FUZZ2 -w dirs.txt:FUZZ1 -w files.txt:FUZZ2
```

### Wfuzz

```bash
# Fuzzing de directorios
wfuzz -c -w /usr/share/wordlists/dirb/common.txt http://10.10.10.1/FUZZ

# Ocultar respuestas por codigo de estado
wfuzz -c --hc 404 -w wordlist.txt http://10.10.10.1/FUZZ

# Ocultar por tamano de respuesta
wfuzz -c --hl 97 -w wordlist.txt http://10.10.10.1/FUZZ

# Fuzzing con cookies
wfuzz -c -b "session=abc123" -w wordlist.txt http://10.10.10.1/FUZZ

# Fuzzing de cabeceras
wfuzz -c -H "X-Custom: FUZZ" -w wordlist.txt http://10.10.10.1/
```

### Dirb

```bash
# Escaneo basico
dirb http://10.10.10.1

# Con wordlist personalizada
dirb http://10.10.10.1 /usr/share/wordlists/dirb/big.txt

# Buscar extensiones especificas
dirb http://10.10.10.1 -X .php,.html,.txt

# Guardar resultados
dirb http://10.10.10.1 -o resultados.txt
```

## Enumeracion DNS

```bash
# Intentar transferencia de zona (AXFR)
dig axfr @ns1.ejemplo.com ejemplo.com
host -t axfr ejemplo.com ns1.ejemplo.com

# dnsrecon - enumeracion completa
dnsrecon -d ejemplo.com -t std      # Registros estandar
dnsrecon -d ejemplo.com -t axfr     # Transferencia de zona
dnsrecon -d ejemplo.com -t brt      # Fuerza bruta
dnsrecon -d ejemplo.com -t rvl -r 10.10.10.0/24  # DNS reverso

# dnsenum - enumeracion automatizada
dnsenum ejemplo.com
dnsenum --enum ejemplo.com          # Enumeracion completa
dnsenum -f subdomains.txt ejemplo.com  # Con wordlist

# Buscar registros especificos
dig ejemplo.com MX +short
dig ejemplo.com TXT +short
dig ejemplo.com NS +short
dig ejemplo.com SOA +short
```

## Enumeracion NFS (Puerto 2049)

```bash
# Listar exports NFS disponibles
showmount -e 10.10.10.1

# Montar recurso NFS
mkdir /tmp/nfs_mount
sudo mount -t nfs 10.10.10.1:/share /tmp/nfs_mount

# Montar con opciones especificas
sudo mount -t nfs -o nolock 10.10.10.1:/share /tmp/nfs_mount

# Scripts Nmap para NFS
nmap --script nfs-ls,nfs-showmount,nfs-statfs -p 2049 10.10.10.1
```

## Enumeracion FTP y SSH

### FTP (Puerto 21)

```bash
# Verificar login anonimo
ftp 10.10.10.1
# Usuario: anonymous / Password: (vacio o email)

# Nmap scripts para FTP
nmap --script ftp-anon,ftp-bounce,ftp-syst,ftp-vsftpd-backdoor -p 21 10.10.10.1

# Banner grabbing con netcat
nc -nv 10.10.10.1 21

# Comandos utiles dentro de FTP
ftp> binary          # Modo binario (para archivos no texto)
ftp> passive         # Modo pasivo
ftp> ls -la          # Listar incluyendo ocultos
ftp> mget *          # Descargar todo
```

### SSH (Puerto 22)

```bash
# Banner grabbing
nc -nv 10.10.10.1 22
ssh -v 10.10.10.1    # Modo verbose muestra info de negociacion

# Nmap scripts para SSH
nmap --script ssh2-enum-algos,ssh-hostkey,ssh-auth-methods -p 22 10.10.10.1

# Verificar metodos de autenticacion permitidos
ssh -o PreferredAuthentications=none -o ConnectTimeout=5 usuario@10.10.10.1 2>&1
```

## Escaneo de Vulnerabilidades

### OpenVAS / GVM

```bash
# Iniciar el servicio GVM
sudo gvm-start

# Acceder a la interfaz web
# https://127.0.0.1:9392 (credenciales configuradas durante instalacion)

# Flujo tipico:
# 1. Configurar un nuevo target (objetivo)
# 2. Seleccionar un scan config (Full and fast, Deep, etc.)
# 3. Crear y lanzar una tarea de escaneo
# 4. Revisar el reporte de vulnerabilidades
```

### Nikto

```bash
# Escaneo basico de vulnerabilidades web
nikto -h http://10.10.10.1

# Escanear con SSL
nikto -h https://10.10.10.1 -ssl

# Escanear puerto no estandar
nikto -h http://10.10.10.1:8080

# Especificar plugins
nikto -h http://10.10.10.1 -Plugins "apache_expect_xss;outdated"

# Guardar reporte
nikto -h http://10.10.10.1 -o reporte.html -Format htm
```

## Enumeracion Automatizada

### AutoRecon

```bash
# Escaneo completo de un objetivo
autorecon 10.10.10.1

# Multiples objetivos
autorecon 10.10.10.1 10.10.10.2 10.10.10.3

# Desde un archivo de objetivos
autorecon -t targets.txt

# Especificar directorio de salida
autorecon 10.10.10.1 -o /ruta/resultados

# Resultados se organizan automaticamente en:
# results/10.10.10.1/
#   scans/         -> resultados de nmap y herramientas
#   exploit/       -> espacio para notas de explotacion
#   loot/          -> archivos descargados
#   report/        -> notas para el reporte
```

### nmapAutomator

```bash
# Escaneo tipo "All" (completo)
./nmapAutomator.sh 10.10.10.1 All

# Solo escaneo de puertos
./nmapAutomator.sh 10.10.10.1 Port

# Escaneo de scripts
./nmapAutomator.sh 10.10.10.1 Script

# Escaneo completo + vulnerabilidades
./nmapAutomator.sh 10.10.10.1 Full

# Escaneo UDP
./nmapAutomator.sh 10.10.10.1 UDP

# Escaneo de vulns
./nmapAutomator.sh 10.10.10.1 Vulns
```

## Tabla Resumen de Puertos y Herramientas

| Puerto | Servicio | Herramientas de enumeracion |
|--------|----------|-----------------------------|
| 21 | FTP | ftp, nmap scripts, hydra |
| 22 | SSH | ssh, nmap scripts, hydra |
| 25 | SMTP | smtp-user-enum, nmap scripts |
| 53 | DNS | dig, dnsrecon, dnsenum, fierce |
| 80/443 | HTTP/S | gobuster, ffuf, nikto, whatweb |
| 110 | POP3 | nmap scripts, telnet |
| 111 | RPCbind | rpcinfo, nmap scripts |
| 135 | MSRPC | rpcclient, impacket |
| 139/445 | SMB | smbclient, enum4linux, crackmapexec |
| 161 | SNMP | snmpwalk, onesixtyone |
| 389/636 | LDAP | ldapsearch, windapsearch |
| 1433 | MSSQL | impacket-mssqlclient, nmap scripts |
| 2049 | NFS | showmount, nmap scripts |
| 3306 | MySQL | mysql, nmap scripts |
| 3389 | RDP | xfreerdp, rdesktop |
| 5432 | PostgreSQL | psql, nmap scripts |
| 5985 | WinRM | evil-winrm, crackmapexec |
| 6379 | Redis | redis-cli, nmap scripts |
| 8080 | HTTP Proxy | gobuster, ffuf, nikto |
| 27017 | MongoDB | mongo, nmap scripts |

> **Nota de seguridad:** La enumeracion agresiva puede causar denegacion de servicio en sistemas fragiles. En entornos de produccion, ajusta la velocidad y concurrencia de tus herramientas para minimizar el impacto. Siempre coordina con el equipo del cliente antes de ejecutar escaneos intensivos.
