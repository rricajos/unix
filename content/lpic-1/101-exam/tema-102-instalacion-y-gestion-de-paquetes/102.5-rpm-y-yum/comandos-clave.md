---
title: "102.5 - Gestion de paquetes RPM y YUM: Comandos clave"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.5"
---

# 102.5 - Gestion de paquetes RPM y YUM: Comandos clave

## rpm - Gestion de paquetes de bajo nivel

### Instalacion y desinstalacion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `rpm -i <paq.rpm>` | Instalar paquete | `rpm -i nginx.rpm` |
| `rpm -ivh <paq.rpm>` | Instalar (verbose + progreso) | `rpm -ivh nginx.rpm` |
| `rpm -U <paq.rpm>` | Actualizar o instalar | `rpm -Uvh nginx.rpm` |
| `rpm -F <paq.rpm>` | Solo actualizar si existe | `rpm -Fvh nginx.rpm` |
| `rpm -e <paq>` | Desinstalar paquete | `rpm -e nginx` |
| `rpm -e --nodeps <paq>` | Desinstalar sin verificar deps | `rpm -e --nodeps nginx` |
| `rpm --test -Uvh <paq.rpm>` | Simular instalacion | `rpm --test -Uvh nginx.rpm` |

### Diferencia entre -i, -U y -F

| Opcion | Paquete no instalado | Paquete ya instalado |
|--------|---------------------|---------------------|
| `-i` | Instala | Error (ya existe) |
| `-U` | Instala | Actualiza |
| `-F` | No hace nada | Actualiza |

### Consultas de paquetes instalados (-q)

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `rpm -q <paq>` | Verificar si esta instalado | `rpm -q nginx` |
| `rpm -qa` | Listar todos los instalados | `rpm -qa` |
| `rpm -qa \| grep <texto>` | Buscar paquetes por nombre | `rpm -qa \| grep nginx` |
| `rpm -qi <paq>` | Informacion detallada | `rpm -qi nginx` |
| `rpm -ql <paq>` | Listar archivos del paquete | `rpm -ql nginx` |
| `rpm -qc <paq>` | Listar archivos de configuracion | `rpm -qc nginx` |
| `rpm -qd <paq>` | Listar archivos de documentacion | `rpm -qd nginx` |
| `rpm -qf <archivo>` | Buscar paquete dueno del archivo | `rpm -qf /usr/sbin/nginx` |
| `rpm -qR <paq>` | Mostrar dependencias (requires) | `rpm -qR nginx` |
| `rpm -q --provides <paq>` | Que capacidades proporciona | `rpm -q --provides nginx` |
| `rpm -q --scripts <paq>` | Mostrar scripts de instalacion | `rpm -q --scripts nginx` |
| `rpm -q --changelog <paq>` | Mostrar registro de cambios | `rpm -q --changelog nginx` |

### Consultas de archivos .rpm sin instalar (-qp)

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `rpm -qpi <paq.rpm>` | Info del .rpm | `rpm -qpi nginx.rpm` |
| `rpm -qpl <paq.rpm>` | Listar archivos del .rpm | `rpm -qpl nginx.rpm` |
| `rpm -qpc <paq.rpm>` | Config del .rpm | `rpm -qpc nginx.rpm` |
| `rpm -qpR <paq.rpm>` | Dependencias del .rpm | `rpm -qpR nginx.rpm` |

### Verificacion

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `rpm -V <paq>` | Verificar integridad de paquete | `rpm -V nginx` |
| `rpm -Va` | Verificar todos los paquetes | `rpm -Va` |
| `rpm -K <paq.rpm>` | Verificar firma GPG del .rpm | `rpm -K nginx.rpm` |
| `rpm --import <clave>` | Importar clave GPG | `rpm --import RPM-GPG-KEY` |

### Codigos de verificacion (rpm -V)

| Codigo | Significado |
|--------|-------------|
| `S` | Tamano cambio |
| `M` | Modo/permisos cambio |
| `5` | MD5 checksum cambio |
| `D` | Dispositivo cambio |
| `L` | Enlace simbolico cambio |
| `U` | Usuario cambio |
| `G` | Grupo cambio |
| `T` | Fecha de modificacion cambio |
| `.` | Sin cambios |
| `c` | Archivo de configuracion |

## rpm2cpio - Extraer contenido

| Comando | Descripcion |
|---------|-------------|
| `rpm2cpio pkg.rpm \| cpio -t` | Listar contenido |
| `rpm2cpio pkg.rpm \| cpio -idmv` | Extraer todo |
| `rpm2cpio pkg.rpm \| cpio -idmv ./usr/bin/prog` | Extraer archivo especifico |

## yum - Gestor de alto nivel (RHEL/CentOS 7)

### Gestion de paquetes

| Comando | Descripcion |
|---------|-------------|
| `yum install <paq>` | Instalar paquete |
| `yum install -y <paq>` | Instalar sin confirmar |
| `yum remove <paq>` | Desinstalar paquete |
| `yum update` | Actualizar todos los paquetes |
| `yum update <paq>` | Actualizar un paquete |
| `yum reinstall <paq>` | Reinstalar paquete |
| `yum downgrade <paq>` | Revertir a version anterior |
| `yum localinstall <rpm>` | Instalar .rpm local con deps |

### Busqueda e informacion

| Comando | Descripcion |
|---------|-------------|
| `yum search <texto>` | Buscar paquetes |
| `yum info <paq>` | Informacion del paquete |
| `yum provides <archivo>` | Buscar paquete por archivo |
| `yum provides "*/nombre"` | Buscar por patron |
| `yum list installed` | Listar instalados |
| `yum list available` | Listar disponibles |
| `yum list updates` | Listar actualizables |

### Repositorios

| Comando | Descripcion |
|---------|-------------|
| `yum repolist` | Listar repos activos |
| `yum repolist all` | Listar todos los repos |
| `yum-config-manager --add-repo URL` | Anadir repositorio |
| `yum-config-manager --enable <repo>` | Activar repositorio |
| `yum-config-manager --disable <repo>` | Desactivar repositorio |

### Grupos de paquetes

| Comando | Descripcion |
|---------|-------------|
| `yum grouplist` | Listar grupos |
| `yum groupinstall "<grupo>"` | Instalar grupo |
| `yum groupremove "<grupo>"` | Desinstalar grupo |
| `yum groupinfo "<grupo>"` | Info del grupo |

### Historial y cache

| Comando | Descripcion |
|---------|-------------|
| `yum history` | Ver historial |
| `yum history info <id>` | Detalle de transaccion |
| `yum history undo <id>` | Deshacer transaccion |
| `yum clean all` | Limpiar toda la cache |
| `yum makecache` | Regenerar cache |

## dnf - Sucesor de yum (Fedora, RHEL 8+)

Los comandos de dnf son practicamente identicos a yum:

| yum | dnf |
|-----|-----|
| `yum install pkg` | `dnf install pkg` |
| `yum remove pkg` | `dnf remove pkg` |
| `yum update` | `dnf update` / `dnf upgrade` |
| `yum search texto` | `dnf search texto` |
| `yum info pkg` | `dnf info pkg` |
| `yum provides /ruta` | `dnf provides /ruta` |
| `yum repolist` | `dnf repolist` |
| `yum clean all` | `dnf clean all` |
| `yum history` | `dnf history` |
| `/etc/yum.conf` | `/etc/dnf/dnf.conf` |

## zypper - Gestor de SUSE/openSUSE

| Comando | Forma corta | Descripcion |
|---------|-------------|-------------|
| `zypper refresh` | `zypper ref` | Actualizar repos |
| `zypper install <paq>` | `zypper in <paq>` | Instalar |
| `zypper remove <paq>` | `zypper rm <paq>` | Desinstalar |
| `zypper update` | `zypper up` | Actualizar paquetes |
| `zypper search <texto>` | `zypper se <texto>` | Buscar |
| `zypper info <paq>` | - | Informacion |
| `zypper repos` | `zypper lr` | Listar repos |
| `zypper addrepo <URL> <alias>` | `zypper ar` | Anadir repo |
| `zypper removerepo <alias>` | `zypper rr` | Eliminar repo |

## Archivos de configuracion de repositorios

| Archivo | Distribucion | Funcion |
|---------|-------------|---------|
| `/etc/yum.conf` | RHEL/CentOS 7 | Config principal de yum |
| `/etc/dnf/dnf.conf` | Fedora/RHEL 8+ | Config principal de dnf |
| `/etc/yum.repos.d/*.repo` | Todas RPM (Red Hat) | Definicion de repositorios |
| `/etc/zypp/repos.d/*.repo` | SUSE | Definicion de repositorios |

### Formato de archivo .repo

```ini
[nombre-repo]
name=Descripcion del repositorio
baseurl=http://url/del/repositorio/
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY
```

## Comparativa rapida: RPM vs Debian

| Accion | RPM | Debian |
|--------|-----|--------|
| Instalar | `rpm -ivh` / `yum install` | `dpkg -i` / `apt install` |
| Desinstalar | `rpm -e` / `yum remove` | `dpkg -r` / `apt remove` |
| Listar todos | `rpm -qa` | `dpkg -l` |
| Archivos de paquete | `rpm -ql` | `dpkg -L` |
| Buscar por archivo | `rpm -qf` / `yum provides` | `dpkg -S` / `apt-file search` |
| Info | `rpm -qi` / `yum info` | `dpkg -s` / `apt show` |
| Verificar | `rpm -V` | `dpkg -V` |
| Actualizar repos | (automatico) | `apt update` |
| Actualizar todo | `yum update` | `apt upgrade` |
