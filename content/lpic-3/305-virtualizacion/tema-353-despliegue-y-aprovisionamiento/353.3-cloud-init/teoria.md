---
title: "353.3 - cloud-init"
tipo: teoria
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.3"
peso: 3
tags:
  - lpic-3
  - tema-353
  - cloud-init
  - user-data
  - meta-data
  - nocloud
---

# 353.3 cloud-init

## Introducción

cloud-init es el estándar de la industria para la inicialización de instancias cloud en el primer arranque. Configura automáticamente hostname, usuarios, SSH keys, paquetes, scripts y más. Es soportado por todas las nubes públicas principales y puede usarse en entornos locales con QEMU/KVM.

## Etapas de cloud-init

cloud-init se ejecuta en cuatro etapas durante el arranque:

```
Arranque del sistema
        │
        ▼
┌─────────────────┐
│ 1. init-local   │  ← Busca datasources locales (NoCloud, CDROM)
├─────────────────┤
│ 2. init         │  ← Configura red, monta filesystem, obtiene metadata
├─────────────────┤
│ 3. config       │  ← Ejecuta módulos de configuración
├─────────────────┤
│ 4. final        │  ← Ejecuta scripts de usuario, runcmd, instala paquetes
└─────────────────┘
```

| Etapa | Descripción | Systemd Unit |
|---|---|---|
| **init-local** | Detecta datasource local, aplica configuración de red | `cloud-init-local.service` |
| **init** | Obtiene metadata y user-data, configura red, monta discos | `cloud-init.service` |
| **config** | Ejecuta módulos de configuración (SSH, usuarios, etc.) | `cloud-config.service` |
| **final** | Ejecuta scripts de usuario, runcmd, paquetes, última fase | `cloud-final.service` |

> **Para el examen:** Las etapas se ejecutan siempre en orden. `init-local` se ejecuta antes de que la red esté disponible. Los scripts de `runcmd` y la instalación de paquetes se ejecutan en la etapa `final`.

## Formatos de user-data

### cloud-config YAML

El formato más común. Debe comenzar con `#cloud-config`:

```yaml
#cloud-config
hostname: mi-servidor
fqdn: mi-servidor.ejemplo.com

# Crear usuarios
users:
  - name: admin
    groups: sudo, docker
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAAB3... admin@laptop

# Instalar paquetes
package_update: true
package_upgrade: true
packages:
  - nginx
  - curl
  - git
  - htop

# Escribir archivos
write_files:
  - path: /etc/nginx/conf.d/default.conf
    content: |
      server {
        listen 80;
        server_name _;
        root /var/www/html;
      }
    owner: root:root
    permissions: '0644'

# Ejecutar comandos
runcmd:
  - systemctl enable nginx
  - systemctl start nginx
  - echo "Servidor configurado" > /var/www/html/index.html

# Configurar SSH
ssh_pwauth: false
disable_root: true

# Reiniciar si es necesario
power_state:
  mode: reboot
  condition: true
  timeout: 30
```

### Shell Script

Si el user-data comienza con `#!/bin/bash` (o cualquier shebang), se ejecuta como script:

```bash
#!/bin/bash
apt-get update
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx
echo "Hello World" > /var/www/html/index.html
```

### Formato MIME Multipart

Combina múltiples formatos de user-data:

```
Content-Type: multipart/mixed; boundary="===============BOUNDARY=="
MIME-Version: 1.0

--===============BOUNDARY==
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0

#cloud-config
packages:
  - nginx

--===============BOUNDARY==
Content-Type: text/x-shellscript; charset="us-ascii"
MIME-Version: 1.0

#!/bin/bash
echo "Script ejecutado" > /tmp/cloud-init-done

--===============BOUNDARY==--
```

> **Para el examen:** El formato cloud-config YAML SIEMPRE debe comenzar con `#cloud-config` en la primera línea (incluyendo el #). Los scripts deben comenzar con un shebang (`#!/bin/bash`).

## meta-data

Información sobre la instancia proporcionada por la plataforma cloud:

```yaml
# Ejemplo de meta-data
instance-id: i-abcdef123456
local-hostname: mi-servidor
network-interfaces: |
  auto eth0
  iface eth0 inet static
  address 192.168.1.100
  netmask 255.255.255.0
  gateway 192.168.1.1
```

### Acceso a meta-data en AWS

```bash
# Meta-data API de AWS (IMDSv1)
curl http://169.254.169.254/latest/meta-data/
curl http://169.254.169.254/latest/meta-data/instance-id
curl http://169.254.169.254/latest/meta-data/local-ipv4
curl http://169.254.169.254/latest/user-data
```

## vendor-data

Datos proporcionados por el proveedor cloud (no por el usuario). Se procesan después de user-data pero con la misma sintaxis:

```yaml
#cloud-config
# vendor-data típico de un proveedor cloud
ntp:
  enabled: true
  servers:
    - ntp.proveedor.com
apt:
  primary:
    - arches: [default]
      uri: http://mirror.proveedor.com/ubuntu
```

## Datasources

Los datasources son los métodos que cloud-init usa para obtener meta-data y user-data:

| Datasource | Plataforma | Descripción |
|---|---|---|
| **NoCloud** | Local | Datos desde ISO/filesystem local |
| **EC2** | AWS | API de metadatos EC2 |
| **GCE** | Google Cloud | API de metadatos GCE |
| **Azure** | Microsoft Azure | Azure Instance Metadata |
| **OpenStack** | OpenStack | Servidor de metadatos OpenStack |
| **ConfigDrive** | OpenStack/libvirt | Disco adjunto con datos |
| **None** | Ninguno | Desactiva cloud-init |

## NoCloud para Pruebas Locales

NoCloud permite usar cloud-init en entornos locales (QEMU/KVM, VirtualBox) sin plataforma cloud:

### Método 1: Disco ISO

```bash
# Crear archivos
mkdir seed
cat > seed/user-data <<EOF
#cloud-config
hostname: test-vm
users:
  - name: admin
    sudo: ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    ssh_authorized_keys:
      - ssh-rsa AAAAB3...
packages:
  - nginx
EOF

cat > seed/meta-data <<EOF
instance-id: test-001
local-hostname: test-vm
EOF

# Crear ISO
genisoimage -output seed.iso -volid cidata -joliet -rock \
  seed/user-data seed/meta-data

# Usar con QEMU
qemu-system-x86_64 -enable-kvm -m 2048 \
  -drive file=ubuntu.qcow2,format=qcow2 \
  -drive file=seed.iso,format=raw \
  -nographic
```

### Método 2: Directorio en filesystem

```bash
# Estructura en el disco de la VM
/var/lib/cloud/seed/nocloud/
├── user-data
└── meta-data
```

### Método 3: Kernel parameter

```bash
# En los parámetros del kernel
ds=nocloud;s=http://10.0.0.1:8080/
# o
ds=nocloud-net;s=http://10.0.0.1:8080/
```

> **Para el examen:** NoCloud es el datasource para usar cloud-init localmente. Requiere al menos `meta-data` (puede estar vacío) y `user-data`. El volid del ISO debe ser `cidata`.

## Módulos de cloud-init

### Módulo users (gestión de usuarios)

```yaml
#cloud-config
users:
  - default
  - name: devops
    gecos: DevOps User
    groups: sudo, docker, adm
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    lock_passwd: true
    ssh_authorized_keys:
      - ssh-rsa AAAAB3...
      - ssh-ed25519 AAAAC3...
```

### Módulo packages

```yaml
#cloud-config
package_update: true
package_upgrade: true
packages:
  - nginx
  - python3-pip
  - [docker-ce, 24.0.0-1~ubuntu.22.04~jammy]  # versión específica
```

### Módulo runcmd

```yaml
#cloud-config
runcmd:
  - systemctl enable docker
  - systemctl start docker
  - [sh, -c, "echo 'Hola' > /tmp/saludo.txt"]
  - curl -fsSL https://example.com/setup.sh | bash
```

### Módulo write_files

```yaml
#cloud-config
write_files:
  - path: /etc/myapp/config.yaml
    content: |
      database:
        host: localhost
        port: 5432
    owner: root:root
    permissions: '0644'
  - path: /opt/scripts/init.sh
    content: |
      #!/bin/bash
      echo "Inicializando..."
    permissions: '0755'
```

### Módulo ssh

```yaml
#cloud-config
ssh_pwauth: false
ssh_deletekeys: true
ssh_genkeytypes: [rsa, ecdsa, ed25519]
disable_root: true
```

## Comandos de cloud-init

```bash
# Ver estado de cloud-init
cloud-init status
cloud-init status --long

# Esperar a que cloud-init termine
cloud-init status --wait

# Consultar datos de cloud-init
cloud-init query instance_id
cloud-init query userdata
cloud-init query ds.meta_data

# Limpiar cloud-init (permitir que se ejecute de nuevo)
cloud-init clean
cloud-init clean --logs

# Re-ejecutar módulos específicos
cloud-init single --name write_files --frequency always

# Analizar tiempos de ejecución
cloud-init analyze show
cloud-init analyze blame

# Ver esquema de cloud-config
cloud-init schema --docs

# Validar un archivo cloud-config
cloud-init schema --config-file user-data.yaml
```

## Archivos y Directorios Importantes

| Ruta | Descripción |
|---|---|
| `/etc/cloud/cloud.cfg` | Configuración principal de cloud-init |
| `/etc/cloud/cloud.cfg.d/` | Configuraciones adicionales (*.cfg) |
| `/var/lib/cloud/` | Datos de runtime de cloud-init |
| `/var/lib/cloud/instance/` | Datos de la instancia actual |
| `/var/lib/cloud/seed/nocloud/` | Seed para datasource NoCloud |
| `/var/log/cloud-init.log` | Log principal |
| `/var/log/cloud-init-output.log` | Salida de scripts y comandos |
| `/run/cloud-init/` | Estado de runtime |

## Resumen

| Concepto | Detalle clave |
|---|---|
| `#cloud-config` | Primera línea obligatoria del formato cloud-config |
| Etapas | init-local, init, config, final (en orden) |
| user-data | Configuración del usuario (YAML, shell script, MIME) |
| meta-data | Información de la instancia (instance-id, hostname) |
| NoCloud | Datasource para uso local (ISO con volid `cidata`) |
| `cloud-init status` | Verificar estado de ejecución |
| `cloud-init clean` | Resetear para re-ejecución |
| `cloud-init query` | Consultar datos de la instancia |
| runcmd | Comandos ejecutados en etapa final |
| write_files | Crear/escribir archivos en el guest |
