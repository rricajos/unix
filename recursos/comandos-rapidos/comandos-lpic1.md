# Comandos Rapidos - LPIC-1

## Hardware y sistema

| Comando | Descripcion |
|---------|-------------|
| `lspci` | Listar dispositivos PCI |
| `lsusb` | Listar dispositivos USB |
| `lsblk` | Listar dispositivos de bloque |
| `lscpu` | Info de la CPU |
| `lsmod` | Modulos del kernel cargados |
| `modprobe mod` | Cargar modulo |
| `modprobe -r mod` | Descargar modulo |
| `modinfo mod` | Info de modulo |
| `uname -a` | Info del kernel |
| `dmesg` | Mensajes del kernel |

## Arranque y servicios (systemd)

| Comando | Descripcion |
|---------|-------------|
| `systemctl start servicio` | Iniciar servicio |
| `systemctl stop servicio` | Detener servicio |
| `systemctl enable servicio` | Habilitar al arranque |
| `systemctl disable servicio` | Deshabilitar al arranque |
| `systemctl status servicio` | Estado del servicio |
| `systemctl list-units` | Listar unidades activas |
| `systemctl get-default` | Target por defecto |
| `systemctl set-default target` | Cambiar target |
| `journalctl` | Ver logs de systemd |
| `journalctl -u servicio` | Logs de un servicio |

## Gestion de paquetes

| Debian/Ubuntu | Red Hat/CentOS | Descripcion |
|---------------|----------------|-------------|
| `apt update` | `yum check-update` | Actualizar lista de paquetes |
| `apt upgrade` | `yum update` | Actualizar paquetes |
| `apt install pkg` | `yum install pkg` | Instalar paquete |
| `apt remove pkg` | `yum remove pkg` | Desinstalar paquete |
| `apt search pkg` | `yum search pkg` | Buscar paquete |
| `dpkg -i pkg.deb` | `rpm -i pkg.rpm` | Instalar paquete local |
| `dpkg -l` | `rpm -qa` | Listar instalados |
| `dpkg -L pkg` | `rpm -ql pkg` | Archivos de un paquete |

## Archivos y directorios

| Comando | Descripcion |
|---------|-------------|
| `ls -la` | Listar con detalles y ocultos |
| `cp -r orig dest` | Copiar recursivo |
| `mv orig dest` | Mover/renombrar |
| `rm -rf dir` | Eliminar recursivo |
| `mkdir -p a/b/c` | Crear directorios anidados |
| `find / -name "*.conf"` | Buscar archivos por nombre |
| `find / -user root -perm -4000` | Buscar archivos SUID |
| `locate archivo` | Buscar en base de datos |
| `updatedb` | Actualizar base de locate |
| `which comando` | Ruta de un comando |
| `whereis comando` | Ruta, man y fuentes |
| `file archivo` | Tipo de archivo |

## Texto y filtros

| Comando | Descripcion |
|---------|-------------|
| `cat archivo` | Mostrar contenido |
| `less archivo` | Paginador |
| `head -n 20 archivo` | Primeras 20 lineas |
| `tail -n 20 archivo` | Ultimas 20 lineas |
| `tail -f archivo` | Seguir en tiempo real |
| `grep patron archivo` | Buscar patron |
| `grep -r patron dir/` | Buscar recursivo |
| `grep -i patron` | Buscar sin distincion may/min |
| `sort archivo` | Ordenar lineas |
| `uniq` | Eliminar duplicados consecutivos |
| `wc -l archivo` | Contar lineas |
| `cut -d: -f1 archivo` | Extraer campos |
| `awk '{print $1}' archivo` | Procesar columnas |
| `sed 's/viejo/nuevo/g' archivo` | Sustituir texto |
| `tr 'a-z' 'A-Z'` | Traducir caracteres |

## Procesos

| Comando | Descripcion |
|---------|-------------|
| `ps aux` | Todos los procesos |
| `ps -ef` | Todos los procesos (formato completo) |
| `top` | Monitor de procesos interactivo |
| `htop` | Monitor mejorado |
| `kill PID` | Enviar SIGTERM |
| `kill -9 PID` | Enviar SIGKILL |
| `killall nombre` | Matar por nombre |
| `bg` | Enviar a segundo plano |
| `fg` | Traer a primer plano |
| `jobs` | Listar trabajos |
| `nohup comando &` | Ejecutar inmune a hangup |
| `nice -n 10 comando` | Ejecutar con prioridad baja |
| `renice -n 5 -p PID` | Cambiar prioridad |

## Permisos

| Comando | Descripcion |
|---------|-------------|
| `chmod 755 archivo` | Cambiar permisos (numerico) |
| `chmod u+x archivo` | Dar ejecucion al usuario |
| `chown user:group archivo` | Cambiar propietario |
| `chgrp grupo archivo` | Cambiar grupo |
| `umask 022` | Mascara de permisos por defecto |
| `chmod u+s archivo` | Activar SUID |
| `chmod g+s dir` | Activar SGID |
| `chmod +t dir` | Activar sticky bit |

## Red

| Comando | Descripcion |
|---------|-------------|
| `ip addr` | Ver interfaces y direcciones |
| `ip route` | Ver tabla de rutas |
| `ss -tulnp` | Puertos en escucha |
| `ping host` | Verificar conectividad |
| `traceroute host` | Trazar ruta |
| `dig dominio` | Consulta DNS |
| `nslookup dominio` | Consulta DNS (simple) |
| `host dominio` | Consulta DNS (basica) |
| `netstat -tulnp` | Puertos (legacy) |
| `ifconfig` | Interfaces (legacy) |

## Usuarios y grupos

| Comando | Descripcion |
|---------|-------------|
| `useradd usuario` | Crear usuario |
| `usermod -aG grupo usuario` | Anadir a grupo |
| `userdel -r usuario` | Eliminar usuario y home |
| `passwd usuario` | Cambiar contrasena |
| `groupadd grupo` | Crear grupo |
| `id usuario` | Ver UID, GID, grupos |
| `whoami` | Usuario actual |
| `su - usuario` | Cambiar de usuario |
| `sudo comando` | Ejecutar como root |

## Cron y tareas programadas

| Comando | Descripcion |
|---------|-------------|
| `crontab -e` | Editar crontab del usuario |
| `crontab -l` | Listar crontab |
| `at hora` | Programar tarea unica |
| `atq` | Listar tareas at |

Formato cron: `min hora dia mes dia_semana comando`
```
*/5 * * * * /script.sh     # Cada 5 minutos
0 2 * * * /backup.sh       # Cada dia a las 2:00
0 0 * * 0 /semanal.sh      # Cada domingo a medianoche
```
