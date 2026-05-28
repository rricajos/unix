---
title: "110.3 Proteger datos con cifrado - Ejercicios"
tags:
  - lpic-1
  - examen-102
  - tema-110
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "102"
tema: "110"
subtema: "110.3"
---

# 110.3 Proteger datos con cifrado - Ejercicios

### Pregunta 1

Cual es el proceso correcto para configurar autenticacion SSH por clave publica?

a) Generar claves en el servidor, copiar la clave privada al cliente, conectar
b) Generar claves en el cliente, copiar la clave publica al servidor con `ssh-copy-id`, conectar
c) Generar claves en el servidor, copiar la clave publica al cliente, conectar
d) Generar las mismas claves en el cliente y el servidor, luego conectar

<details><summary>Respuesta</summary>

**b) Generar claves en el cliente, copiar la clave publica al servidor con `ssh-copy-id`, conectar**

El proceso correcto es: 1) Generar el par de claves en el cliente con `ssh-keygen` (por ejemplo, `ssh-keygen -t ed25519`). 2) Copiar la clave publica al servidor con `ssh-copy-id usuario@servidor`, que agrega la clave al archivo `~/.ssh/authorized_keys` del servidor. 3) Conectar con `ssh usuario@servidor`. La clave privada nunca sale del cliente. Permisos requeridos: `~/.ssh/` = 700, clave privada = 600, authorized_keys = 600.

</details>

---

### Pregunta 2

Que archivo almacena las claves de host de los servidores a los que un cliente SSH se ha conectado previamente?

a) `~/.ssh/authorized_keys`
b) `~/.ssh/config`
c) `~/.ssh/known_hosts`
d) `/etc/ssh/ssh_host_keys`

<details><summary>Respuesta</summary>

**c) `~/.ssh/known_hosts`**

El archivo `~/.ssh/known_hosts` almacena las huellas digitales (fingerprints) de las claves de host de los servidores a los que el usuario se ha conectado previamente. Sirve para verificar la identidad del servidor y proteger contra ataques man-in-the-middle. Si la clave de host de un servidor cambia, SSH muestra un error y rechaza la conexion. Para eliminar una entrada antigua: `ssh-keygen -R host`. `~/.ssh/authorized_keys` almacena las claves publicas autorizadas en el servidor.

</details>

---

### Pregunta 3

Que tipo de tunel SSH se crea con el comando `ssh -L 8080:localhost:80 usuario@servidor`?

a) Tunel remoto que expone el puerto 8080 del servidor
b) Tunel local que reenviar el puerto local 8080 al puerto 80 del servidor
c) Proxy SOCKS en el puerto 8080
d) Tunel inverso que redirige el trafico del puerto 80 al 8080

<details><summary>Respuesta</summary>

**b) Tunel local que reenviar el puerto local 8080 al puerto 80 del servidor**

La opcion `-L` crea un tunel local: el puerto 8080 en la maquina local se reenviar a traves del tunel SSH al puerto 80 del servidor. Despues de ejecutar el comando, acceder a `http://localhost:8080` equivale a acceder al puerto 80 del servidor remoto. `-R` crea un tunel remoto (puerto en el servidor reenviar al cliente). `-D` crea un proxy SOCKS dinamico. Las opciones `-N` (sin ejecutar comandos) y `-f` (segundo plano) son utiles con tuneles.

</details>

---

### Pregunta 4

Que comando cifra un archivo con GPG para que solo el destinatario `maria@empresa.com` pueda descifrarlo?

a) `gpg --symmetric --recipient maria@empresa.com archivo.txt`
b) `gpg --encrypt --recipient maria@empresa.com archivo.txt`
c) `gpg --sign --recipient maria@empresa.com archivo.txt`
d) `gpg --cipher maria@empresa.com archivo.txt`

<details><summary>Respuesta</summary>

**b) `gpg --encrypt --recipient maria@empresa.com archivo.txt`**

`gpg --encrypt --recipient` cifra el archivo usando la clave publica del destinatario (que debe estar importada previamente). Solo Maria podra descifrarlo con su clave privada. Se genera `archivo.txt.gpg`. Para formato ASCII: `gpg --encrypt --armor --recipient maria@empresa.com archivo.txt` (genera `archivo.txt.asc`). La opcion `--symmetric` cifra con contrasena (no con clave publica). `--sign` firma pero no cifra.

</details>

---

### Pregunta 5

Que opciones de `/etc/ssh/sshd_config` deberian configurarse para endurecer un servidor SSH?

a) `PermitRootLogin yes` y `PasswordAuthentication yes`
b) `PermitRootLogin no` y `PasswordAuthentication no`
c) `AllowAllUsers yes` y `DisableEncryption no`
d) `RootAccess deny` y `PasswordPolicy strong`

<details><summary>Respuesta</summary>

**b) `PermitRootLogin no` y `PasswordAuthentication no`**

Para endurecer un servidor SSH se recomienda: `PermitRootLogin no` (deshabilitar login directo como root), `PasswordAuthentication no` (deshabilitar autenticacion por contrasena, solo claves), `PubkeyAuthentication yes` (habilitar autenticacion por clave publica), `MaxAuthTries 3` (limitar intentos), `PermitEmptyPasswords no` y opcionalmente `AllowUsers` para limitar usuarios. Despues de cambios: `systemctl restart sshd`.

</details>

---

### Pregunta 6

Cual es la diferencia entre `scp` y `sftp`?

a) `scp` cifra la transferencia y `sftp` no
b) `scp` es no interactivo (un solo comando) y `sftp` es interactivo (sesion con comandos)
c) `sftp` es mas rapido que `scp`
d) `scp` usa el puerto 22 y `sftp` usa el puerto 21

<details><summary>Respuesta</summary>

**b) `scp` es no interactivo (un solo comando) y `sftp` es interactivo (sesion con comandos)**

`scp` (Secure Copy) es no interactivo, ideal para copias simples y scripts, con sintaxis similar a `cp`. `sftp` (SSH File Transfer Protocol) es interactivo, permite navegar el sistema remoto con comandos como `ls`, `cd`, `get`, `put`. Ambos usan SSH (puerto 22) y cifran la transferencia. Para copiar un directorio con scp: `scp -r directorio usuario@servidor:/ruta/`. Para puerto no estandar: `scp -P 2222`.

</details>

---

### Pregunta 7

Que tipo de clave SSH se recomienda generar actualmente por ser la mas moderna y segura?

a) DSA
b) RSA de 1024 bits
c) Ed25519
d) ECDSA de 256 bits

<details><summary>Respuesta</summary>

**c) Ed25519**

Ed25519 es el tipo de clave SSH mas moderno y recomendado. Ofrece alta seguridad con claves mas cortas (256 bits fijos), es rapido y no depende de parametros de curva que podrian ser debiles. DSA esta deprecado (solo 1024 bits). RSA es clasico y compatible pero requiere al menos 4096 bits para buena seguridad. ECDSA es bueno pero Ed25519 es preferido. Se genera con: `ssh-keygen -t ed25519`.

</details>

---

### Pregunta 8

Que comando genera un certificado de revocacion para una clave GPG?

a) `gpg --delete-key ID_CLAVE`
b) `gpg --gen-revoke ID_CLAVE`
c) `gpg --revoke ID_CLAVE`
d) `gpg --invalidate ID_CLAVE`

<details><summary>Respuesta</summary>

**b) `gpg --gen-revoke ID_CLAVE`**

El comando `gpg --gen-revoke ID_CLAVE` genera un certificado de revocacion que se debe crear inmediatamente despues de generar la clave y almacenarse en un lugar seguro. Si la clave privada se compromete, se importa el certificado con `gpg --import revocacion.asc` y se envia al servidor de claves con `gpg --keyserver hkps://keys.openpgp.org --send-keys ID_CLAVE`. GPG tambien genera automaticamente un certificado en `~/.gnupg/openpgp-revocs.d/`.

</details>

---

### Pregunta 9

Que comando muestra la huella digital (fingerprint) de una clave SSH?

a) `ssh-keygen -f ~/.ssh/id_ed25519.pub`
b) `ssh-keygen -l -f ~/.ssh/id_ed25519.pub`
c) `ssh-agent -l ~/.ssh/id_ed25519.pub`
d) `ssh-fingerprint ~/.ssh/id_ed25519.pub`

<details><summary>Respuesta</summary>

**b) `ssh-keygen -l -f ~/.ssh/id_ed25519.pub`**

La opcion `-l` de `ssh-keygen` muestra la huella digital (fingerprint) de una clave, y `-f` especifica el archivo. Esto es util para verificar la identidad de un servidor comparando la huella con un valor conocido, o para comprobar el tipo y tamano de una clave. Funciona tanto con claves publicas como privadas. Para ver la huella de una clave de host del servidor: `ssh-keygen -l -f /etc/ssh/ssh_host_ed25519_key.pub`.

</details>

---

### Pregunta 10

En GPG, que hace el comando `gpg --detach-sign archivo.txt`?

a) Cifra el archivo y genera una firma incluida
b) Genera una firma digital separada del archivo original
c) Firma y cifra el archivo simultaneamente
d) Verifica la firma del archivo

<details><summary>Respuesta</summary>

**b) Genera una firma digital separada del archivo original**

`gpg --detach-sign` genera una firma digital en un archivo separado (`archivo.txt.sig`) sin incluirla en el archivo original. Esto es util cuando no se quiere modificar el archivo original. Otras opciones de firma: `gpg --sign` incluye la firma dentro del archivo (genera `archivo.txt.gpg`), `gpg --clearsign` envuelve el texto con la firma en texto claro (genera `archivo.txt.asc`). Para verificar: `gpg --verify archivo.txt.sig archivo.txt`.

</details>
