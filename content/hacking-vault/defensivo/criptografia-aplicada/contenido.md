---
title: "Criptografia Aplicada en Linux"
tags:
  - hacking
  - defensivo
  - criptografia-aplicada
  - hacking-defensivo
tipo: hacking-defensivo
certificacion: hacking-vault
---

## Introduccion a la Criptografia

La criptografia es la base de la seguridad digital moderna. Protege la confidencialidad, integridad y autenticidad de los datos tanto en reposo como en transito. En Linux, existe un ecosistema completo de herramientas criptograficas integradas en el sistema operativo.

> **Nota:** La criptografia no es una solucion magica. Su efectividad depende de la correcta implementacion, la gestion adecuada de claves y la eleccion de algoritmos actualizados. Un algoritmo fuerte con una clave mal gestionada equivale a no tener cifrado.

## Cifrado Simetrico vs Asimetrico

### Comparativa

| Caracteristica | Simetrico | Asimetrico |
|---------------|-----------|------------|
| Claves | Una clave compartida | Par de claves (publica/privada) |
| Velocidad | Rapido | Lento (100-1000x mas lento) |
| Uso tipico | Cifrado de datos en volumen | Intercambio de claves, firmas digitales |
| Ejemplos | AES-256, ChaCha20 | RSA, Ed25519, ECDSA |
| Longitud de clave | 128-256 bits | 2048-4096 bits (RSA), 256 bits (ECC) |

### Cifrado hibrido

En la practica, los sistemas modernos combinan ambos enfoques:

```
1. El remitente genera una clave simetrica aleatoria (clave de sesion)
2. Cifra los datos con la clave simetrica (AES-256)
3. Cifra la clave simetrica con la clave publica del destinatario (RSA/ECC)
4. Envia los datos cifrados + clave de sesion cifrada
5. El destinatario descifra la clave de sesion con su clave privada
6. Descifra los datos con la clave de sesion
```

> **Nota:** Este esquema hibrido es utilizado por TLS, GPG, SSH y la mayoria de protocolos criptograficos modernos. Combina la velocidad del cifrado simetrico con la conveniencia del cifrado asimetrico para el intercambio de claves.

## GPG/GnuPG

GnuPG es la implementacion libre del estandar OpenPGP para cifrado y firma digital.

### Generacion y gestion de claves

```bash
# Generar par de claves (interactivo, seleccionar Ed25519)
gpg --full-generate-key

# Generar clave Ed25519 directamente
gpg --quick-generate-key "Nombre <correo@ejemplo.com>" ed25519 default 2y

# Listar claves publicas
gpg --list-keys
gpg --list-keys --keyid-format long

# Listar claves privadas
gpg --list-secret-keys

# Exportar clave publica
gpg --armor --export correo@ejemplo.com > mi_clave_publica.asc

# Importar clave publica de otro usuario
gpg --import clave_alice.asc

# Verificar huella digital (fingerprint)
gpg --fingerprint correo@ejemplo.com

# Firmar clave de confianza (Web of Trust)
gpg --sign-key alice@ejemplo.com

# Enviar clave a keyserver
gpg --keyserver hkps://keys.openpgp.org --send-keys ID_CLAVE

# Buscar clave en keyserver
gpg --keyserver hkps://keys.openpgp.org --search-keys alice@ejemplo.com

# Revocar una clave comprometida
gpg --gen-revoke ID_CLAVE > certificado_revocacion.asc
gpg --import certificado_revocacion.asc
```

### Cifrado y descifrado

```bash
# Cifrar archivo para un destinatario
gpg --encrypt --recipient alice@ejemplo.com documento.pdf

# Cifrar para multiples destinatarios
gpg --encrypt --recipient alice@ejemplo.com \
  --recipient bob@ejemplo.com documento.pdf

# Cifrar con cifrado simetrico (contrasena)
gpg --symmetric --cipher-algo AES256 documento.pdf

# Descifrar
gpg --decrypt documento.pdf.gpg > documento.pdf
gpg --output documento.pdf --decrypt documento.pdf.gpg
```

### Firma digital

```bash
# Firmar archivo (firma separada)
gpg --detach-sign --armor documento.pdf

# Firmar archivo (firma integrada)
gpg --sign documento.pdf

# Firmar en texto claro (para mensajes de texto)
gpg --clearsign mensaje.txt

# Verificar firma
gpg --verify documento.pdf.asc documento.pdf
gpg --verify mensaje.txt.asc
```

### Web of Trust

```
Nivel de confianza en GPG:
- unknown  : No se ha establecido confianza
- none     : No confias en esta persona para verificar otras claves
- marginal : Confias parcialmente
- full     : Confias completamente
- ultimate : Confianza absoluta (solo para tus propias claves)

Para validar una clave:
- 1 firma de confianza "full" es suficiente
- 3 firmas de confianza "marginal" son suficientes
```

## SSL/TLS

### Versiones del protocolo

| Version | Estado | Observaciones |
|---------|--------|---------------|
| SSL 2.0 | Obsoleto | Vulnerabilidades criticas, nunca usar |
| SSL 3.0 | Obsoleto | POODLE attack, nunca usar |
| TLS 1.0 | Deprecado | Debil, evitar |
| TLS 1.1 | Deprecado | Debil, evitar |
| TLS 1.2 | Aceptable | Seguro con suites correctas |
| TLS 1.3 | Recomendado | Mas rapido, mas seguro, menos opciones inseguras |

### Certificados con Let's Encrypt y certbot

```bash
# Instalar certbot
apt install certbot python3-certbot-nginx

# Obtener certificado para Nginx
certbot --nginx -d ejemplo.com -d www.ejemplo.com

# Obtener certificado standalone
certbot certonly --standalone -d ejemplo.com

# Renovacion automatica (ya configurada en cron/systemd)
certbot renew --dry-run

# Verificar certificado existente
certbot certificates

# Revocar certificado
certbot revoke --cert-path /etc/letsencrypt/live/ejemplo.com/cert.pem
```

### Comandos openssl para SSL/TLS

```bash
# Verificar certificado de un servidor remoto
openssl s_client -connect ejemplo.com:443 -servername ejemplo.com

# Ver detalles del certificado
openssl s_client -connect ejemplo.com:443 </dev/null 2>/dev/null | \
  openssl x509 -noout -text

# Verificar fechas de expiracion
openssl s_client -connect ejemplo.com:443 </dev/null 2>/dev/null | \
  openssl x509 -noout -dates

# Generar clave privada RSA
openssl genrsa -aes256 -out server.key 4096

# Generar clave privada EC
openssl ecparam -genkey -name prime256v1 | openssl ec -aes256 -out server.key

# Generar CSR (Certificate Signing Request)
openssl req -new -key server.key -out server.csr

# Generar certificado autofirmado (solo para pruebas)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \
  -days 365 -nodes -subj "/CN=localhost"

# Verificar que clave y certificado coinciden
openssl x509 -noout -modulus -in cert.pem | md5sum
openssl rsa -noout -modulus -in key.pem | md5sum
# Ambos hashes deben coincidir

# Probar protocolo y cipher suites
openssl s_client -connect ejemplo.com:443 -tls1_3
openssl s_client -connect ejemplo.com:443 -cipher 'ECDHE-RSA-AES256-GCM-SHA384'
```

> **Nota:** Nunca uses certificados autofirmados en produccion. Let's Encrypt proporciona certificados gratuitos y automatizados. Los certificados autofirmados solo son aceptables en entornos de desarrollo y pruebas internas.

## Claves SSH

### Tipos de claves y recomendaciones

| Tipo | Bits recomendados | Seguridad | Rendimiento |
|------|-------------------|-----------|-------------|
| RSA | 4096 | Buena | Lento |
| ECDSA | 256/384/521 | Buena | Rapido |
| Ed25519 | 256 (fijo) | Excelente | Muy rapido |

### Generacion y uso de claves SSH

```bash
# Generar clave Ed25519 (recomendada)
ssh-keygen -t ed25519 -C "usuario@equipo" -f ~/.ssh/id_ed25519

# Generar clave RSA-4096 (compatibilidad)
ssh-keygen -t rsa -b 4096 -C "usuario@equipo" -f ~/.ssh/id_rsa

# Copiar clave publica al servidor
ssh-copy-id -i ~/.ssh/id_ed25519.pub usuario@servidor

# Verificar fingerprint de la clave
ssh-keygen -l -f ~/.ssh/id_ed25519.pub

# Cambiar passphrase de una clave existente
ssh-keygen -p -f ~/.ssh/id_ed25519
```

### SSH Agent y forwarding

```bash
# Iniciar agente SSH
eval "$(ssh-agent -s)"

# Agregar clave al agente
ssh-add ~/.ssh/id_ed25519

# Listar claves en el agente
ssh-add -l

# Agent forwarding (conectar a servidor B desde servidor A)
ssh -A usuario@servidor_a
# Desde servidor_a: ssh usuario@servidor_b (usa la clave del agente)

# Configurar en ~/.ssh/config
Host servidor_a
    HostName 10.0.1.50
    User deploy
    ForwardAgent yes
    IdentityFile ~/.ssh/id_ed25519
```

> **Nota:** El agent forwarding es conveniente pero presenta riesgos. Si el servidor intermedio esta comprometido, un atacante con acceso root puede usar tu agente SSH. Considera usar ProxyJump (`-J`) como alternativa mas segura.

### Claves de hardware con FIDO2

```bash
# Generar clave SSH respaldada por hardware (YubiKey, SoloKey)
ssh-keygen -t ed25519-sk -C "usuario@equipo"

# Tipo residente (clave almacenada en el dispositivo)
ssh-keygen -t ed25519-sk -O resident -C "usuario@equipo"

# Importar clave residente desde el dispositivo
ssh-keygen -K

# Requerir presencia fisica (toque) para cada uso
ssh-keygen -t ed25519-sk -O verify-required -C "usuario@equipo"
```

## Cifrado de Disco con LUKS

LUKS (Linux Unified Key Setup) es el estandar de cifrado de disco en Linux.

```bash
# Crear particion cifrada LUKS2
cryptsetup luksFormat --type luks2 \
  --cipher aes-xts-plain64 \
  --key-size 512 \
  --hash sha512 \
  --iter-time 5000 \
  /dev/sdb1

# Abrir (desbloquear) particion
cryptsetup luksOpen /dev/sdb1 datos_seguros

# Crear sistema de archivos
mkfs.ext4 /dev/mapper/datos_seguros

# Montar
mount /dev/mapper/datos_seguros /mnt/cifrado

# Cerrar (bloquear) particion
umount /mnt/cifrado
cryptsetup luksClose datos_seguros
```

### Gestion de key slots

```bash
# LUKS soporta hasta 8 key slots (contraseñas/claves diferentes)

# Ver informacion de la particion LUKS
cryptsetup luksDump /dev/sdb1

# Agregar clave adicional (backup passphrase)
cryptsetup luksAddKey /dev/sdb1

# Agregar key file
dd if=/dev/urandom of=/root/luks-keyfile bs=4096 count=1
chmod 600 /root/luks-keyfile
cryptsetup luksAddKey /dev/sdb1 /root/luks-keyfile

# Eliminar un key slot
cryptsetup luksKillSlot /dev/sdb1 1

# Respaldar cabecera LUKS (critico)
cryptsetup luksHeaderBackup /dev/sdb1 \
  --header-backup-file /root/backup-header-sdb1.img

# Restaurar cabecera
cryptsetup luksHeaderRestore /dev/sdb1 \
  --header-backup-file /root/backup-header-sdb1.img
```

### Montaje automatico con crypttab

```bash
# /etc/crypttab
# nombre     dispositivo            key_file               opciones
datos_seguros /dev/sdb1             /root/luks-keyfile      luks

# /etc/fstab
/dev/mapper/datos_seguros  /mnt/cifrado  ext4  defaults  0  2
```

> **Nota:** Siempre respalda la cabecera LUKS en un medio externo seguro. Si la cabecera se corrompe y no tienes respaldo, los datos cifrados se pierden de forma irrecuperable, incluso conociendo la contrasena.

## Cifrado de Archivos

### Con GPG

```bash
# Cifrado simetrico (contrasena)
gpg --symmetric --cipher-algo AES256 archivo_secreto.tar.gz

# Cifrado asimetrico (clave publica)
gpg --encrypt --recipient alice@ejemplo.com archivo_secreto.tar.gz

# Descifrar
gpg --decrypt archivo_secreto.tar.gz.gpg > archivo_secreto.tar.gz
```

### Con openssl

```bash
# Cifrar con AES-256-CBC
openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 \
  -in archivo.txt -out archivo.txt.enc

# Descifrar
openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 \
  -in archivo.txt.enc -out archivo.txt
```

### Con age (herramienta moderna)

```bash
# Instalar age
apt install age

# Generar par de claves
age-keygen -o clave.txt

# Cifrar con clave publica
age -r age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p \
  -o archivo.enc archivo.txt

# Cifrar con passphrase
age -p -o archivo.enc archivo.txt

# Descifrar
age -d -i clave.txt -o archivo.txt archivo.enc

# Cifrar con clave publica SSH
age -R ~/.ssh/id_ed25519.pub -o archivo.enc archivo.txt
age -d -i ~/.ssh/id_ed25519 -o archivo.txt archivo.enc
```

## Funciones Hash

### Verificacion de integridad

```bash
# Calcular hashes
md5sum archivo.iso                  # 128 bits - NO usar para seguridad
sha256sum archivo.iso               # 256 bits - Recomendado
sha512sum archivo.iso               # 512 bits - Maxima seguridad
b2sum archivo.iso                   # BLAKE2 - Rapido y seguro

# Verificar contra hash conocido
echo "a1b2c3d4...  archivo.iso" | sha256sum -c

# Verificar archivo de checksums
sha256sum -c SHA256SUMS

# Generar checksums de multiples archivos
sha256sum /usr/bin/* > checksums_bin.txt

# Verificar integridad posteriormente
sha256sum -c checksums_bin.txt
```

### Hashing de contrasenas

| Algoritmo | Uso | Seguridad |
|-----------|-----|-----------|
| MD5 | Legacy, nunca usar para contrasenas | Inseguro |
| SHA-256/512 | Integridad de archivos | No apto para contrasenas (rapido) |
| bcrypt | Contrasenas, factor de costo ajustable | Bueno |
| argon2id | Contrasenas, resistente a GPU/ASIC | Excelente (recomendado) |

```bash
# Generar hash bcrypt (con python)
python3 -c "import bcrypt; print(bcrypt.hashpw(b'contrasena', bcrypt.gensalt(12)))"

# Generar hash argon2
python3 -c "
from argon2 import PasswordHasher
ph = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=4)
print(ph.hash('contrasena'))
"

# Verificar hash en /etc/shadow
# $6$salt$hash   -> SHA-512 (por defecto en la mayoria de distros)
# $y$params$hash -> yescrypt (Debian 12+, Ubuntu 22.04+)
```

> **Nota:** Para almacenar contrasenas, nunca uses funciones hash rapidas como SHA-256. Los algoritmos como bcrypt y argon2id estan disenados especificamente para ser lentos, lo que dificulta los ataques de fuerza bruta.

## Gestores de Contrasenas

### pass (el gestor de contrasenas estandar de Unix)

```bash
# Inicializar el almacen con tu clave GPG
pass init "ID_CLAVE_GPG"

# Inicializar repositorio git (opcional, para sincronizacion)
pass git init

# Guardar contrasena
pass insert email/gmail

# Generar contrasena aleatoria
pass generate servicios/github 32

# Ver contrasena
pass email/gmail

# Copiar al portapapeles (se borra en 45 segundos)
pass -c email/gmail

# Listar todas las entradas
pass

# Estructura del almacen
# ~/.password-store/
# ├── email/
# │   └── gmail.gpg
# ├── servicios/
# │   ├── github.gpg
# │   └── gitlab.gpg
# └── servidores/
#     └── produccion.gpg
```

### KeePassXC con CLI

```bash
# Crear base de datos
keepassxc-cli create ~/passwords.kdbx

# Agregar entrada
keepassxc-cli add ~/passwords.kdbx -u usuario "Servidor/web01"

# Ver entrada
keepassxc-cli show ~/passwords.kdbx "Servidor/web01"

# Generar contrasena
keepassxc-cli generate -L 32 -lUns

# Listar entradas
keepassxc-cli ls ~/passwords.kdbx

# Extraer contrasena para scripts
keepassxc-cli show -s ~/passwords.kdbx "Servidor/web01" -a password
```

## Cifrado VPN

### WireGuard

```bash
# Instalar WireGuard
apt install wireguard

# Generar claves en el servidor
wg genkey | tee /etc/wireguard/server_private.key | wg pubkey > \
  /etc/wireguard/server_public.key
chmod 600 /etc/wireguard/server_private.key

# Configuracion del servidor - /etc/wireguard/wg0.conf
[Interface]
PrivateKey = <clave_privada_servidor>
Address = 10.200.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; \
  iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; \
  iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = <clave_publica_cliente>
AllowedIPs = 10.200.0.2/32

# Configuracion del cliente - /etc/wireguard/wg0.conf
[Interface]
PrivateKey = <clave_privada_cliente>
Address = 10.200.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = <clave_publica_servidor>
Endpoint = servidor.ejemplo.com:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25

# Iniciar conexion
wg-quick up wg0
systemctl enable wg-quick@wg0

# Ver estado
wg show
```

### OpenVPN

```bash
# Instalar OpenVPN y easy-rsa
apt install openvpn easy-rsa

# Inicializar PKI
make-cadir ~/openvpn-ca && cd ~/openvpn-ca
./easyrsa init-pki
./easyrsa build-ca
./easyrsa gen-req servidor nopass
./easyrsa sign-req server servidor
./easyrsa gen-dh

# Generar clave TLS-auth
openvpn --genkey secret ta.key
```

### IPsec con strongSwan

```bash
# Instalar strongSwan
apt install strongswan strongswan-pki

# Generar CA
pki --gen --type rsa --size 4096 --outform pem > ca-key.pem
pki --self --ca --lifetime 3650 --in ca-key.pem \
  --type rsa --dn "CN=VPN CA" --outform pem > ca-cert.pem

# Generar certificado del servidor
pki --gen --type rsa --size 4096 --outform pem > server-key.pem
pki --req --type rsa --in server-key.pem \
  --dn "CN=vpn.ejemplo.com" --outform pem > server-req.pem
pki --issue --lifetime 1825 --cacert ca-cert.pem --cakey ca-key.pem \
  --in server-req.pem --type pkcs10 \
  --san vpn.ejemplo.com --outform pem > server-cert.pem
```

## Gestion de Certificados

### Crear una CA interna con easy-rsa

```bash
# Inicializar estructura PKI
make-cadir /etc/openvpn/easy-rsa && cd /etc/openvpn/easy-rsa
./easyrsa init-pki

# Crear CA raiz
./easyrsa build-ca

# Generar certificado para servidor
./easyrsa gen-req servidor nopass
./easyrsa sign-req server servidor

# Generar certificado para cliente
./easyrsa gen-req cliente1
./easyrsa sign-req client cliente1

# Revocar certificado
./easyrsa revoke cliente1
./easyrsa gen-crl
```

### Con cfssl (herramienta de Cloudflare)

```bash
# Generar CA
cfssl gencert -initca ca-csr.json | cfssljson -bare ca

# Ejemplo de ca-csr.json
{
  "CN": "Organizacion CA",
  "key": {
    "algo": "ecdsa",
    "size": 256
  },
  "names": [
    {
      "O": "Mi Organizacion",
      "OU": "Seguridad"
    }
  ]
}

# Generar certificado firmado por la CA
cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
  -config=ca-config.json -profile=server \
  server-csr.json | cfssljson -bare server

# Verificar certificado
openssl x509 -in server.pem -noout -text
openssl verify -CAfile ca.pem server.pem
```

### Tabla resumen de herramientas criptograficas

| Herramienta | Funcion principal | Caso de uso |
|-------------|-------------------|-------------|
| GPG | Cifrado/firma de archivos y correo | Comunicacion segura, verificacion de paquetes |
| openssl | Operaciones SSL/TLS y PKI | Certificados, pruebas de conexion |
| ssh-keygen | Generacion de claves SSH | Autenticacion remota |
| cryptsetup | Cifrado de disco (LUKS) | Proteccion de datos en reposo |
| age | Cifrado de archivos moderno | Alternativa simple a GPG para cifrado |
| certbot | Certificados Let's Encrypt | TLS automatizado para servidores web |
| pass | Gestor de contrasenas CLI | Almacenamiento seguro de credenciales |
| wg | Configuracion de WireGuard | VPN moderna y eficiente |

## Resumen

La criptografia aplicada en Linux abarca desde el cifrado de archivos individuales con GPG hasta el cifrado completo de disco con LUKS, pasando por la gestion de certificados TLS, claves SSH y conexiones VPN. La eleccion de algoritmos modernos (Ed25519, AES-256, Argon2id), la gestion adecuada de claves y el uso de herramientas actualizadas son fundamentales para mantener una postura de seguridad criptografica solida. La tendencia actual favorece herramientas como age sobre GPG para cifrado simple, WireGuard sobre OpenVPN para VPNs, y Ed25519 sobre RSA para claves SSH.
