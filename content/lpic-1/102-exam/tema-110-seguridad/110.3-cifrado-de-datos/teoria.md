---
title: "110.3 Proteger datos con cifrado - Teoria"
tags:
  - lpic-1
  - examen-102
  - tema-110
  - teoria
tipo: teoria
certificacion: lpic-1
examen: "102"
tema: "110"
subtema: "110.3"
---

# 110.3 Proteger datos con cifrado - Teoria

## Conceptos fundamentales de criptografia

### Cifrado simetrico vs asimetrico

| Caracteristica | Simetrico | Asimetrico |
|---------------|-----------|------------|
| Claves | Una sola clave compartida | Par de claves (publica + privada) |
| Velocidad | Rapido | Lento |
| Uso tipico | Cifrado de datos masivos | Intercambio de claves, firma digital |
| Ejemplos | AES, 3DES, Blowfish | RSA, DSA, ECDSA, Ed25519 |

### Firma digital
- Se firma con la **clave privada** del remitente
- Se verifica con la **clave publica** del remitente
- Garantiza **autenticidad** (quien lo envio) e **integridad** (no fue modificado)

### PKI (Public Key Infrastructure)
- Infraestructura para gestionar certificados digitales
- Las Autoridades de Certificacion (CA) firman certificados
- Se basa en la confianza transitiva (confias en la CA, confias en los certificados que firma)

---

## SSH (Secure Shell)

### Descripcion
- Protocolo para acceso remoto seguro y transferencia de archivos
- Reemplaza a telnet, rsh, rlogin (inseguros)
- Puerto por defecto: **22 (TCP)**
- Version actual: SSH-2

### Componentes
- **`ssh`**: Cliente SSH
- **`sshd`**: Servidor (demonio) SSH
- **`scp`**: Copia segura de archivos
- **`sftp`**: Transferencia de archivos via SSH (interactivo)

---

## Comando `ssh`

```bash
ssh usuario@host                    # Conectar a un host
ssh -p 2222 usuario@host            # Puerto no estandar
ssh usuario@host comando            # Ejecutar comando remoto
ssh -X usuario@host                 # X11 forwarding (aplicaciones graficas)
ssh -v usuario@host                 # Modo verbose (depuracion)
ssh -i ~/.ssh/mi_clave usuario@host # Usar clave especifica
```

---

## Generacion de claves: `ssh-keygen`

```bash
ssh-keygen                          # Genera par de claves (RSA por defecto)
ssh-keygen -t rsa -b 4096          # RSA de 4096 bits
ssh-keygen -t ecdsa -b 521         # ECDSA de 521 bits
ssh-keygen -t ed25519              # Ed25519 (moderno, recomendado)
ssh-keygen -t dsa                  # DSA (deprecado, evitar)
ssh-keygen -f ~/.ssh/mi_clave      # Nombre de archivo personalizado
ssh-keygen -C "comentario"          # Agregar comentario
ssh-keygen -p                       # Cambiar passphrase de una clave existente
```

### Tipos de claves
| Tipo | Tamano recomendado | Notas |
|------|-------------------|-------|
| **RSA** | 4096 bits | Clasico, compatible |
| **ECDSA** | 256/384/521 bits | Basado en curvas elipticas |
| **Ed25519** | Fijo (256 bits) | Moderno, rapido, recomendado |
| **DSA** | 1024 bits | Deprecado, no usar |

### Archivos generados
- `~/.ssh/id_rsa` - Clave **privada** (NUNCA compartir)
- `~/.ssh/id_rsa.pub` - Clave **publica** (se copia al servidor)

Permisos requeridos:
```
~/.ssh/         -> 700 (drwx------)
~/.ssh/id_rsa   -> 600 (-rw-------)
~/.ssh/id_rsa.pub -> 644 (-rw-r--r--)
```

---

## Autenticacion por clave publica

### Proceso
1. Generar par de claves en el cliente: `ssh-keygen -t ed25519`
2. Copiar clave publica al servidor: `ssh-copy-id usuario@servidor`
3. Conectar sin contrasena: `ssh usuario@servidor`

### `ssh-copy-id`
```bash
ssh-copy-id usuario@host            # Copiar clave publica al servidor
ssh-copy-id -i ~/.ssh/mi_clave.pub usuario@host  # Clave especifica
```

Esto agrega la clave publica al archivo `~/.ssh/authorized_keys` del usuario en el servidor.

### `~/.ssh/authorized_keys`
Archivo en el **servidor** que contiene las claves publicas autorizadas para acceder a esa cuenta.

```
ssh-ed25519 AAAAC3NzaC1... usuario@cliente
ssh-rsa AAAAB3NzaC1... otro@equipo
```

Permisos: `600` o `644`

---

## `ssh-agent` y `ssh-add`

El agente SSH almacena las claves privadas descifradas en memoria, evitando tener que introducir la passphrase repetidamente.

```bash
# Iniciar el agente
eval $(ssh-agent)

# Agregar clave al agente
ssh-add                             # Agrega ~/.ssh/id_rsa por defecto
ssh-add ~/.ssh/mi_clave             # Clave especifica
ssh-add -l                          # Listar claves en el agente
ssh-add -D                          # Eliminar todas las claves del agente

# Cerrar el agente
ssh-agent -k
```

---

## `~/.ssh/known_hosts`

Almacena las **claves de host** de los servidores a los que te has conectado. Protege contra ataques man-in-the-middle.

- Al conectar por primera vez, se pregunta si aceptar la clave del servidor
- En conexiones posteriores, se verifica que la clave coincida
- Si la clave cambia (alerta de seguridad), SSH rechaza la conexion

```bash
# Eliminar una entrada (si la clave del servidor cambio legitimamente)
ssh-keygen -R host
```

---

## Archivos de clave de host del servidor: `/etc/ssh/`

El servidor SSH tiene sus propias claves (host keys) que identifican al servidor de forma unica. Se almacenan en `/etc/ssh/`:

| Archivo | Descripcion |
|---------|-------------|
| `ssh_host_rsa_key` / `ssh_host_rsa_key.pub` | Clave de host RSA (privada/publica) |
| `ssh_host_ecdsa_key` / `ssh_host_ecdsa_key.pub` | Clave de host ECDSA |
| `ssh_host_ed25519_key` / `ssh_host_ed25519_key.pub` | Clave de host Ed25519 |
| `ssh_host_dsa_key` / `ssh_host_dsa_key.pub` | Clave de host DSA (deprecada) |

```bash
# Listar los archivos de claves de host
ls -la /etc/ssh/ssh_host_*

# Ver la huella digital (fingerprint) de una clave de host
ssh-keygen -l -f /etc/ssh/ssh_host_ed25519_key.pub
# 256 SHA256:abcdef... root@servidor (ED25519)

# Ver la huella en formato MD5 (antiguo)
ssh-keygen -l -f /etc/ssh/ssh_host_rsa_key.pub -E md5

# Regenerar claves de host (si se comprometen)
ssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key -N ""
ssh-keygen -t rsa -b 4096 -f /etc/ssh/ssh_host_rsa_key -N ""
```

**`ssh-keygen -l -f archivo`**: Muestra la **huella digital** (fingerprint) de una clave. Util para:
- Verificar la identidad de un servidor comparando la huella con un valor conocido
- Comprobar que tipo y tamano de clave tiene un servidor o usuario
- Funciona tanto con claves publicas como privadas (solo muestra la huella, no la clave privada)

```bash
# Ver fingerprint de una clave de usuario
ssh-keygen -l -f ~/.ssh/id_ed25519.pub

# Ver fingerprint de una clave de host
ssh-keygen -l -f /etc/ssh/ssh_host_ecdsa_key.pub
```

Cuando un cliente se conecta por primera vez a un servidor SSH, la huella digital mostrada corresponde a la clave de host del servidor. Esta huella se almacena en `~/.ssh/known_hosts` del cliente.

---

## `~/.ssh/config`

Archivo de configuracion del cliente SSH para simplificar conexiones.

```
# Configuracion global
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3

# Atajo para un servidor
Host produccion
    HostName 192.168.1.50
    User admin
    Port 2222
    IdentityFile ~/.ssh/clave_prod

Host desarrollo
    HostName dev.ejemplo.com
    User developer
    ForwardAgent yes
```

Con esta configuracion, `ssh produccion` equivale a `ssh -p 2222 -i ~/.ssh/clave_prod admin@192.168.1.50`.

---

## `/etc/ssh/sshd_config`

Configuracion del **servidor** SSH (demonio sshd).

```
# Puerto
Port 22

# Permitir login de root
PermitRootLogin no                  # no | yes | prohibit-password | forced-commands-only

# Autenticacion por contrasena
PasswordAuthentication no           # Deshabilitar (solo claves)

# Autenticacion por clave publica
PubkeyAuthentication yes

# Usuarios permitidos
AllowUsers admin juan maria
# o por grupo:
AllowGroups ssh-users

# X11 Forwarding
X11Forwarding yes

# Protocolo
Protocol 2                          # Solo SSH-2 (ya es lo predeterminado)

# Autenticacion por host
HostbasedAuthentication no
```

Despues de modificar, reiniciar sshd:
```bash
systemctl restart sshd
```

---

## Transferencia de archivos: `scp` y `sftp`

### `scp` (Secure Copy)
```bash
scp archivo usuario@host:/ruta/destino      # Copiar al servidor
scp usuario@host:/ruta/archivo ./local      # Copiar desde el servidor
scp -r directorio usuario@host:/ruta/       # Copiar directorio recursivo
scp -P 2222 archivo usuario@host:/ruta/     # Puerto no estandar
scp -i clave archivo usuario@host:/ruta/    # Con clave especifica
```

### `sftp` (SSH File Transfer Protocol)
```bash
sftp usuario@host                           # Sesion interactiva
sftp -P 2222 usuario@host                   # Puerto no estandar
```

Comandos dentro de sftp:
```
ls                  # Listar remoto
lls                 # Listar local
cd /ruta            # Cambiar directorio remoto
lcd /ruta           # Cambiar directorio local
get archivo         # Descargar archivo
put archivo         # Subir archivo
mget *.txt          # Descargar multiples archivos
mput *.txt          # Subir multiples archivos
mkdir dir           # Crear directorio remoto
rm archivo          # Eliminar archivo remoto
exit / quit / bye   # Salir
```

---

## Tuneles SSH (Port Forwarding)

### Tunel local (`-L`)
Reenviar un puerto local a un puerto remoto a traves del tunel SSH.

```bash
ssh -L puerto_local:host_destino:puerto_destino usuario@servidor_ssh
```

Ejemplo: Acceder a un servicio web (puerto 80) en un servidor remoto a traves del puerto local 8080:
```bash
ssh -L 8080:localhost:80 usuario@servidor
# Ahora http://localhost:8080 accede al puerto 80 del servidor
```

Ejemplo: Acceder a una base de datos detras de un bastion:
```bash
ssh -L 3306:servidor-db:3306 usuario@bastion
# Ahora localhost:3306 conecta a servidor-db:3306 a traves del bastion
```

### Tunel remoto (`-R`)
Reenviar un puerto en el servidor remoto a un puerto local.

```bash
ssh -R puerto_remoto:host_local:puerto_local usuario@servidor_ssh
```

Ejemplo: Hacer accesible un servicio web local (puerto 3000) en el servidor remoto como puerto 8080:
```bash
ssh -R 8080:localhost:3000 usuario@servidor
# Ahora servidor:8080 accede a localhost:3000
```

### Tunel SOCKS (`-D`)
Crear un proxy SOCKS dinamico.

```bash
ssh -D 1080 usuario@servidor
# Configurar navegador para usar proxy SOCKS en localhost:1080
# Todo el trafico del navegador se envia a traves del tunel SSH
```

### Opciones utiles para tuneles
```bash
ssh -N -f -L 8080:localhost:80 usuario@servidor
```
- `-N`: No ejecutar comandos remotos (solo tunel)
- `-f`: Pasar a segundo plano despues de autenticar

---

## GPG (GNU Privacy Guard)

### Descripcion
- Implementacion libre del estandar OpenPGP
- Permite cifrar, descifrar, firmar y verificar datos
- Usa cifrado asimetrico (par de claves publica/privada)
- Directorio de claves: `~/.gnupg/`

### Generar claves
```bash
gpg --gen-key                       # Generar par de claves (interactivo)
gpg --full-generate-key             # Generar con todas las opciones
```

### Gestionar claves
```bash
gpg --list-keys                     # Listar claves publicas
gpg --list-secret-keys              # Listar claves privadas
gpg --fingerprint                   # Mostrar huellas digitales
gpg --delete-key ID                 # Eliminar clave publica
gpg --delete-secret-key ID          # Eliminar clave privada
```

### Exportar e importar claves
```bash
# Exportar clave publica
gpg --export -a "Nombre" > clave_publica.asc
gpg --export --armor ID > clave_publica.asc

# Importar clave publica de alguien
gpg --import clave_publica.asc

# Exportar clave privada (backup)
gpg --export-secret-keys -a "Nombre" > clave_privada.asc
```

### Cifrar y descifrar
```bash
# Cifrar para un destinatario (cifrado asimetrico)
gpg --encrypt --recipient destinatario@email.com archivo.txt
# Genera: archivo.txt.gpg

# Cifrar con armadura ASCII (texto)
gpg --encrypt --armor --recipient destinatario@email.com archivo.txt
# Genera: archivo.txt.asc

# Cifrado simetrico (con contrasena)
gpg --symmetric archivo.txt
gpg -c archivo.txt

# Descifrar
gpg --decrypt archivo.txt.gpg
gpg --decrypt archivo.txt.gpg > archivo_descifrado.txt
gpg -d archivo.txt.gpg
```

### Firmar y verificar
```bash
# Firmar un archivo (firma separada)
gpg --sign archivo.txt              # Genera archivo.txt.gpg (firma incluida)
gpg --detach-sign archivo.txt       # Genera archivo.txt.sig (firma separada)
gpg --clearsign archivo.txt         # Firma en texto claro (archivo.txt.asc)
gpg --armor --detach-sign archivo.txt  # Firma separada en ASCII

# Verificar firma
gpg --verify archivo.txt.sig archivo.txt    # Verificar firma separada
gpg --verify archivo.txt.asc               # Verificar firma incluida
```

### Revocacion de claves GPG

Si una clave privada se compromete o ya no se necesita, es necesario **revocarla** para informar a otros usuarios que ya no deben confiar en ella.

```bash
# Generar un certificado de revocacion (hacer esto JUSTO DESPUES de crear la clave)
gpg --gen-revoke ID_CLAVE > revocacion.asc
gpg --output revocacion.asc --gen-revoke ID_CLAVE

# Se recomienda guardar el certificado de revocacion en un lugar seguro (USB, papel impreso)
```

**Cuando se necesite revocar la clave:**
```bash
# Importar el certificado de revocacion al anillo de claves
gpg --import revocacion.asc

# Verificar que la clave esta marcada como revocada
gpg --list-keys ID_CLAVE
# Mostrara: [revoked] junto a la clave

# Enviar la clave revocada a un servidor de claves para notificar a todos
gpg --keyserver hkps://keys.openpgp.org --send-keys ID_CLAVE
```

**IMPORTANTE:** GPG genera automaticamente un certificado de revocacion al crear una clave (almacenado en `~/.gnupg/openpgp-revocs.d/`). Es buena practica hacer una copia de seguridad de este certificado inmediatamente.

### Modelo de confianza GPG (Web of Trust)

GPG utiliza un modelo descentralizado de confianza llamado **Web of Trust** (Red de Confianza), diferente al modelo centralizado de PKI/CA.

#### Niveles de confianza de propietario (owner trust)

| Nivel | Significado |
|-------|-------------|
| **Unknown** | No se sabe si se puede confiar en el propietario |
| **None** | No se confia en que el propietario verifique identidades |
| **Marginal** | Se confia parcialmente (se necesitan varias firmas marginales para validar) |
| **Full** | Se confia completamente en que el propietario verifica identidades correctamente |
| **Ultimate** | Confianza absoluta (normalmente solo para tus propias claves) |

#### Como funciona la Web of Trust
1. **Firmas de claves**: Al verificar la identidad de alguien, firmas su clave publica con tu clave privada
2. **Cadenas de confianza**: Si confias en Alice y Alice firmo la clave de Bob, puedes confiar en Bob (confianza transitiva)
3. **Validez**: Una clave se considera valida si:
   - Esta firmada por una clave con confianza **full**, o
   - Esta firmada por al menos 3 claves con confianza **marginal**

```bash
# Editar la confianza de una clave
gpg --edit-key ID_CLAVE
gpg> trust
# Seleccionar nivel: 1=undefined, 2=none, 3=marginal, 4=full, 5=ultimate

# Firmar la clave publica de otra persona (tras verificar su identidad)
gpg --sign-key ID_CLAVE

# Ver las firmas de una clave
gpg --list-sigs ID_CLAVE
```

### Servidores de claves
```bash
# Buscar clave en un servidor
gpg --keyserver hkps://keys.openpgp.org --search-keys email@ejemplo.com

# Enviar clave publica a un servidor
gpg --keyserver hkps://keys.openpgp.org --send-keys ID_CLAVE

# Recibir clave de un servidor
gpg --keyserver hkps://keys.openpgp.org --recv-keys ID_CLAVE
```

### Estructura de `~/.gnupg/`
| Archivo | Contenido |
|---------|-----------|
| `pubring.gpg` / `pubring.kbx` | Anillo de claves publicas |
| `secring.gpg` / `private-keys-v1.d/` | Anillo de claves privadas |
| `trustdb.gpg` | Base de datos de confianza |
| `gpg.conf` | Configuracion personal de GPG |

---

## Puntos clave para el examen

1. **ssh-keygen**: `-t` tipo (rsa, ecdsa, ed25519), `-b` bits. Ed25519 es el recomendado
2. **`ssh-keygen -l -f archivo`** muestra la huella digital (fingerprint) de una clave
3. **ssh-copy-id** copia la clave publica al `authorized_keys` del servidor
4. **~/.ssh/known_hosts** almacena claves de host para prevenir MITM
5. **Claves de host del servidor** en `/etc/ssh/`: ssh_host_rsa_key, ssh_host_ecdsa_key, ssh_host_ed25519_key
6. **Permisos**: ~/.ssh = 700, clave privada = 600, authorized_keys = 600
7. **/etc/ssh/sshd_config**: `PermitRootLogin no`, `PasswordAuthentication no` para mayor seguridad
8. **Tunel local `-L`**: Puerto local -> destino remoto; **Tunel remoto `-R`**: Puerto remoto -> destino local
9. **scp** copia archivos; **sftp** es interactivo
10. **gpg --encrypt --recipient** cifra; **gpg --decrypt** descifra
11. **gpg --gen-revoke** genera certificado de revocacion; importar con `gpg --import` para revocar
12. **Web of Trust**: Modelo descentralizado de confianza. Niveles: unknown, none, marginal, full, ultimate
13. **gpg --sign** firma; **gpg --verify** verifica
14. **Cifrado asimetrico**: Clave publica cifra, clave privada descifra. Clave privada firma, clave publica verifica
