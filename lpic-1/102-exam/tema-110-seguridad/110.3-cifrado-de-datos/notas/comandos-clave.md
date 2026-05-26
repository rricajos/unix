# 110.3 Proteger datos con cifrado - Comandos clave

## ssh

| Comando | Descripcion |
|---------|-------------|
| `ssh usuario@host` | Conectar a un host |
| `ssh -p 2222 usuario@host` | Puerto no estandar |
| `ssh usuario@host comando` | Ejecutar comando remoto |
| `ssh -X usuario@host` | Con X11 forwarding |
| `ssh -i ~/.ssh/clave usuario@host` | Con clave especifica |
| `ssh -v usuario@host` | Modo verbose |

## ssh-keygen

| Comando | Descripcion |
|---------|-------------|
| `ssh-keygen` | Generar par de claves (RSA defecto) |
| `ssh-keygen -t ed25519` | Generar clave Ed25519 (recomendado) |
| `ssh-keygen -t rsa -b 4096` | RSA de 4096 bits |
| `ssh-keygen -t ecdsa -b 521` | ECDSA |
| `ssh-keygen -f ~/.ssh/mi_clave` | Archivo personalizado |
| `ssh-keygen -p` | Cambiar passphrase |
| `ssh-keygen -R host` | Eliminar host de known_hosts |

## ssh-copy-id / ssh-agent

| Comando | Descripcion |
|---------|-------------|
| `ssh-copy-id usuario@host` | Copiar clave publica al servidor |
| `eval $(ssh-agent)` | Iniciar agente SSH |
| `ssh-add` | Agregar clave al agente |
| `ssh-add -l` | Listar claves en el agente |
| `ssh-add -D` | Eliminar todas las claves |

## Tuneles SSH

| Comando | Descripcion |
|---------|-------------|
| `ssh -L 8080:localhost:80 user@host` | Tunel local (local -> remoto) |
| `ssh -R 8080:localhost:3000 user@host` | Tunel remoto (remoto -> local) |
| `ssh -D 1080 user@host` | Proxy SOCKS dinamico |
| `ssh -N -f -L ...` | Tunel en background sin shell |

## scp / sftp

| Comando | Descripcion |
|---------|-------------|
| `scp archivo user@host:/ruta/` | Copiar al servidor |
| `scp user@host:/ruta/archivo ./` | Copiar desde el servidor |
| `scp -r dir user@host:/ruta/` | Copiar directorio recursivo |
| `scp -P 2222 archivo user@host:/ruta/` | Puerto no estandar |
| `sftp user@host` | Sesion SFTP interactiva |

## GPG - Claves

| Comando | Descripcion |
|---------|-------------|
| `gpg --gen-key` | Generar par de claves |
| `gpg --list-keys` | Listar claves publicas |
| `gpg --list-secret-keys` | Listar claves privadas |
| `gpg --export -a "Nombre" > pub.asc` | Exportar clave publica |
| `gpg --import pub.asc` | Importar clave publica |
| `gpg --export-secret-keys -a > priv.asc` | Exportar clave privada |
| `gpg --fingerprint` | Mostrar huellas digitales |

## GPG - Cifrado

| Comando | Descripcion |
|---------|-------------|
| `gpg --encrypt --recipient email archivo` | Cifrar (asimetrico) |
| `gpg --encrypt --armor --recipient email archivo` | Cifrar en ASCII |
| `gpg --symmetric archivo` / `gpg -c archivo` | Cifrar (simetrico) |
| `gpg --decrypt archivo.gpg` / `gpg -d archivo.gpg` | Descifrar |

## GPG - Firma

| Comando | Descripcion |
|---------|-------------|
| `gpg --sign archivo` | Firmar (incluida) |
| `gpg --detach-sign archivo` | Firma separada (.sig) |
| `gpg --clearsign archivo` | Firma en texto claro (.asc) |
| `gpg --verify archivo.sig archivo` | Verificar firma |

## GPG - Servidores de claves

| Comando | Descripcion |
|---------|-------------|
| `gpg --keyserver URL --search-keys email` | Buscar clave |
| `gpg --keyserver URL --send-keys ID` | Publicar clave |
| `gpg --keyserver URL --recv-keys ID` | Recibir clave |

## Archivos SSH clave

| Archivo | Ubicacion | Descripcion |
|---------|-----------|-------------|
| `id_rsa` / `id_ed25519` | `~/.ssh/` (cliente) | Clave privada (600) |
| `id_rsa.pub` / `id_ed25519.pub` | `~/.ssh/` (cliente) | Clave publica (644) |
| `authorized_keys` | `~/.ssh/` (servidor) | Claves publicas autorizadas (600) |
| `known_hosts` | `~/.ssh/` (cliente) | Claves de host de servidores |
| `config` | `~/.ssh/` (cliente) | Configuracion del cliente SSH |
| `sshd_config` | `/etc/ssh/` (servidor) | Configuracion del servidor SSH |

## Opciones importantes de sshd_config

| Opcion | Valores | Descripcion |
|--------|---------|-------------|
| `Port` | 22 | Puerto de escucha |
| `PermitRootLogin` | no/yes/prohibit-password | Login de root |
| `PasswordAuthentication` | yes/no | Autenticacion por contrasena |
| `PubkeyAuthentication` | yes/no | Autenticacion por clave |
| `AllowUsers` | usuario1 usuario2 | Usuarios permitidos |
| `X11Forwarding` | yes/no | Reenvio X11 |
