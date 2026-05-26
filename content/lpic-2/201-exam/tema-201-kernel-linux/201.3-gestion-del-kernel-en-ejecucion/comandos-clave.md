---
title: "201.3 - Gestion del kernel en ejecucion"
tags: [lpic-2, examen-201, tema-201, comandos]
tipo: comandos
certificacion: lpic-2
examen: "201"
tema: "201"
subtema: "201.3"
---

# 201.3 - Comandos clave: Gestion del kernel en ejecucion

## Comandos de gestion de modulos

| Comando | Funcion | Ejemplo |
|---------|---------|---------|
| `lsmod` | Listar modulos cargados | `lsmod` |
| `modprobe` | Cargar modulo con dependencias | `modprobe vfat` |
| `modprobe -r` | Descargar modulo con dependencias | `modprobe -r vfat` |
| `insmod` | Cargar modulo (sin dependencias, ruta completa) | `insmod /lib/modules/.../vfat.ko` |
| `rmmod` | Descargar modulo (sin dependencias) | `rmmod vfat` |
| `modinfo` | Informacion detallada de un modulo | `modinfo ext4` |
| `depmod` | Generar archivo de dependencias de modulos | `depmod` |

## Comandos de parametros del kernel

| Comando | Funcion | Ejemplo |
|---------|---------|---------|
| `sysctl -a` | Listar todos los parametros | `sysctl -a` |
| `sysctl <param>` | Ver un parametro especifico | `sysctl net.ipv4.ip_forward` |
| `sysctl -w` | Modificar parametro en tiempo real | `sysctl -w vm.swappiness=10` |
| `sysctl -p` | Cargar configuracion desde archivo | `sysctl -p /etc/sysctl.conf` |
| `sysctl --system` | Cargar desde todos los archivos de config | `sysctl --system` |

## Comandos de diagnostico

| Comando | Funcion | Ejemplo |
|---------|---------|---------|
| `dmesg` | Ver buffer de anillo del kernel | `dmesg` |
| `dmesg -T` | Mensajes con marcas de tiempo legibles | `dmesg -T` |
| `dmesg -w` | Seguir mensajes en tiempo real | `dmesg -w` |
| `dmesg --level=err` | Filtrar por nivel de severidad | `dmesg --level=err,crit` |
| `dmesg -H` | Salida paginada con colores | `dmesg -H` |
| `dmesg -c` | Mostrar y limpiar el buffer | `dmesg -c` |
| `uname -r` | Version del kernel en ejecucion | `uname -r` |
| `uname -a` | Toda la informacion del kernel | `uname -a` |
| `journalctl -k` | Mensajes del kernel (systemd) | `journalctl -k -b 0` |

## Comparativa: modprobe vs insmod/rmmod

| Caracteristica | modprobe | insmod/rmmod |
|----------------|----------|-------------|
| Resolucion de dependencias | Automatica | No |
| Ruta del modulo | Solo nombre | Ruta completa al .ko |
| Parametros | Soportados | Soportados |
| Configuracion en modprobe.d | Si | No |
| Blacklisting | Respeta blacklist | No |
| Uso recomendado | Siempre | Solo casos especiales |

## Parametros de sysctl mas importantes

| Parametro | Funcion | Valor por defecto |
|-----------|---------|-------------------|
| `net.ipv4.ip_forward` | Habilitar enrutamiento IPv4 | 0 |
| `net.ipv6.conf.all.forwarding` | Habilitar enrutamiento IPv6 | 0 |
| `vm.swappiness` | Tendencia a usar swap (0-100) | 60 |
| `kernel.panic` | Reinicio automatico tras panic (segundos) | 0 |
| `net.ipv4.tcp_syncookies` | Proteccion SYN flood | 1 |
| `net.ipv4.icmp_echo_ignore_all` | Ignorar ping | 0 |
| `fs.file-max` | Maximo de descriptores de archivos | Variable |
| `kernel.sysrq` | Habilitar teclas SysRq | 1 |
| `net.core.somaxconn` | Cola maxima de conexiones | 4096 |
| `vm.dirty_ratio` | % RAM para dirty pages antes de flush | 20 |

## Archivos y directorios importantes

| Ruta | Funcion |
|------|---------|
| `/proc/sys/` | Parametros del kernel en tiempo real |
| `/proc/modules` | Modulos cargados (fuente de lsmod) |
| `/etc/sysctl.conf` | Configuracion permanente de parametros |
| `/etc/sysctl.d/*.conf` | Archivos adicionales de configuracion |
| `/etc/modprobe.d/` | Configuracion de modprobe (alias, opciones, blacklist) |
| `/lib/modules/$(uname -r)/` | Modulos del kernel actual |
| `/lib/modules/$(uname -r)/modules.dep` | Dependencias de modulos |
| `/lib/modules/$(uname -r)/kernel/` | Archivos .ko organizados por tipo |

## Directivas de /etc/modprobe.d/

| Directiva | Funcion | Ejemplo |
|-----------|---------|---------|
| `alias` | Crear alias para un modulo | `alias eth0 e1000e` |
| `options` | Parametros por defecto | `options snd_hda_intel power_save=1` |
| `blacklist` | Impedir carga automatica | `blacklist nouveau` |
| `install` | Comando personalizado al cargar | `install pcspkr /bin/true` |
| `remove` | Comando personalizado al descargar | `remove pcspkr /bin/true` |
| `softdep` | Dependencia blanda | `softdep modA pre: modB` |

## Niveles de mensajes del kernel (dmesg)

| Nivel | Nombre | Descripcion |
|-------|--------|-------------|
| 0 | emerg | Sistema inutilizable |
| 1 | alert | Requiere accion inmediata |
| 2 | crit | Condicion critica |
| 3 | err | Error |
| 4 | warning | Advertencia |
| 5 | notice | Normal pero significativo |
| 6 | info | Informacion general |
| 7 | debug | Depuracion |
