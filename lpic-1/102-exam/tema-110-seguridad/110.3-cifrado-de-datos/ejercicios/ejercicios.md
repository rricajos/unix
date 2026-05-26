# 110.3 Proteger datos con cifrado - Ejercicios

## Ejercicio 1
Describe el proceso completo para configurar autenticacion SSH por clave publica entre un cliente y un servidor.

<details><summary>Respuesta</summary>

1. **Generar el par de claves** en el cliente:
```bash
ssh-keygen -t ed25519 -C "mi@email.com"
```
Esto crea `~/.ssh/id_ed25519` (privada) y `~/.ssh/id_ed25519.pub` (publica).

2. **Copiar la clave publica al servidor**:
```bash
ssh-copy-id usuario@servidor
```
Esto agrega la clave publica al archivo `~/.ssh/authorized_keys` del servidor.

3. **Conectar sin contrasena**:
```bash
ssh usuario@servidor
```

4. **(Opcional) Deshabilitar autenticacion por contrasena** en el servidor editando `/etc/ssh/sshd_config`:
```
PasswordAuthentication no
```
Y reiniciar: `systemctl restart sshd`

Permisos requeridos: `~/.ssh/` = 700, clave privada = 600, authorized_keys = 600.

</details>

## Ejercicio 2
¿Que es `~/.ssh/known_hosts` y que sucede si la clave de host de un servidor cambia?

<details><summary>Respuesta</summary>

**`~/.ssh/known_hosts`** almacena las **claves de host** (fingerprints) de los servidores a los que te has conectado previamente. Sirve para verificar la identidad del servidor y proteger contra ataques **man-in-the-middle**.

Si la clave de host cambia, SSH muestra un **error de advertencia** y **rechaza la conexion**:
```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@ WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED! @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

Esto puede significar:
- El servidor fue reinstalado (cambio legitimo)
- Un ataque man-in-the-middle (riesgo de seguridad)

Si el cambio es legitimo, eliminar la entrada antigua:
```bash
ssh-keygen -R host
```

</details>

## Ejercicio 3
Explica la diferencia entre tuneles SSH locales (`-L`), remotos (`-R`) y SOCKS (`-D`). Da un ejemplo de cada uno.

<details><summary>Respuesta</summary>

**Tunel local (`-L`)**: Reenviar un puerto **local** a un servicio **remoto** a traves del tunel.
```bash
ssh -L 8080:localhost:80 usuario@servidor
# localhost:8080 -> tunel SSH -> servidor:80
```
Uso: Acceder a un servicio remoto como si fuera local.

**Tunel remoto (`-R`)**: Reenviar un puerto en el **servidor remoto** a un servicio **local**.
```bash
ssh -R 9090:localhost:3000 usuario@servidor
# servidor:9090 -> tunel SSH -> localhost:3000
```
Uso: Exponer un servicio local a traves del servidor remoto.

**SOCKS dinamico (`-D`)**: Crear un proxy SOCKS que enruta todo el trafico por el tunel.
```bash
ssh -D 1080 usuario@servidor
# Configurar navegador con proxy SOCKS localhost:1080
```
Uso: Navegar por Internet a traves del servidor (anonimato, eludir restricciones).

</details>

## Ejercicio 4
¿Como cifrarias un archivo llamado `secreto.txt` con GPG para que solo lo pueda leer el usuario `maria@empresa.com`? ¿Como lo descifraria Maria?

<details><summary>Respuesta</summary>

**Cifrar** (necesitas tener la clave publica de Maria importada):
```bash
gpg --encrypt --recipient maria@empresa.com secreto.txt
```
Esto genera `secreto.txt.gpg` que solo Maria puede descifrar con su clave privada.

Para generar en formato texto (ASCII armor):
```bash
gpg --encrypt --armor --recipient maria@empresa.com secreto.txt
```
Esto genera `secreto.txt.asc`.

**Maria descifra** (usando su clave privada):
```bash
gpg --decrypt secreto.txt.gpg > secreto.txt
# o simplemente:
gpg -d secreto.txt.gpg
```

GPG le pedira la passphrase de su clave privada para descifrar.

</details>

## Ejercicio 5
¿Como firmarias digitalmente un archivo y como verificaria el destinatario la firma?

<details><summary>Respuesta</summary>

**Firmar** (3 opciones):
```bash
# Firma incluida en el archivo (binario)
gpg --sign documento.pdf

# Firma separada (genera documento.pdf.sig)
gpg --detach-sign documento.pdf

# Firma en texto claro (para archivos de texto)
gpg --clearsign documento.txt
```

**Verificar** (el destinatario necesita tu clave publica):
```bash
# Verificar firma incluida
gpg --verify documento.pdf.gpg

# Verificar firma separada
gpg --verify documento.pdf.sig documento.pdf

# Verificar firma en texto claro
gpg --verify documento.txt.asc
```

La salida indicara si la firma es valida y quien firmo el documento.

</details>

## Ejercicio 6
¿Que opciones de `/etc/ssh/sshd_config` modificarias para endurecer la seguridad de un servidor SSH?

<details><summary>Respuesta</summary>

```
# Deshabilitar login de root
PermitRootLogin no

# Deshabilitar autenticacion por contrasena (solo claves)
PasswordAuthentication no

# Habilitar autenticacion por clave publica
PubkeyAuthentication yes

# Cambiar puerto por defecto (seguridad por oscuridad)
Port 2222

# Limitar usuarios que pueden conectarse
AllowUsers admin juan

# Deshabilitar autenticacion basada en host
HostbasedAuthentication no

# Deshabilitar login con contrasena vacia
PermitEmptyPasswords no

# Limitar intentos de autenticacion
MaxAuthTries 3

# Timeout de sesion inactiva
ClientAliveInterval 300
ClientAliveCountMax 2
```

Despues de cambios: `systemctl restart sshd`

</details>

## Ejercicio 7
¿Cual es la diferencia entre `scp` y `sftp`? ¿Como copiarias un directorio completo a un servidor remoto con scp?

<details><summary>Respuesta</summary>

**`scp`** (Secure Copy):
- No interactivo (un solo comando)
- Ideal para copias simples y scripts
- Sintaxis similar a `cp`

**`sftp`** (SSH File Transfer Protocol):
- **Interactivo** (sesion con comandos como ls, cd, get, put)
- Permite navegar el sistema remoto
- Mas funcionalidades (renombrar, crear directorios, etc.)

Copiar directorio completo con scp:
```bash
scp -r /ruta/directorio usuario@servidor:/ruta/destino/
```

- `-r`: Recursivo (incluye subdirectorios)
- `-P 2222`: Si el servidor usa un puerto no estandar

</details>

## Ejercicio 8
¿Cual es la diferencia entre cifrado simetrico y asimetrico? ¿Como se combinan en una sesion SSH?

<details><summary>Respuesta</summary>

**Cifrado simetrico**: Una **sola clave** para cifrar y descifrar. Es rapido pero tiene el problema de como compartir la clave de forma segura. Ejemplos: AES, 3DES.

**Cifrado asimetrico**: **Dos claves** (publica y privada). Lo que cifra una, lo descifra la otra. Es lento pero resuelve el problema del intercambio de claves. Ejemplos: RSA, Ed25519.

**En SSH se combinan ambos**:
1. **Negociacion inicial**: Se usa cifrado asimetrico para autenticar al servidor y al cliente, y para intercambiar de forma segura una **clave de sesion** simetrica.
2. **Comunicacion**: Una vez establecida la clave de sesion, toda la comunicacion se cifra con **cifrado simetrico** (mas rapido) usando esa clave.

Esto combina la seguridad del cifrado asimetrico (intercambio de clave seguro) con la velocidad del cifrado simetrico (transmision de datos).

</details>
