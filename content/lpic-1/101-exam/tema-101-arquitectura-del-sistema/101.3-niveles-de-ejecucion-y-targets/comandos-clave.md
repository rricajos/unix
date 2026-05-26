---
title: "Comandos Clave: Niveles de Ejecucion y Targets de Systemd (101.3)"
tags:
  - lpic-1
  - examen-101
  - tema-101
  - comandos
tipo: comandos
certificacion: lpic-1
examen: "101"
tema: "101"
subtema: "101.3"
---

# Comandos Clave: Niveles de Ejecucion y Targets de Systemd (101.3)

## Indice
1. [Comandos de SysVinit](#1-comandos-de-sysvinit)
2. [Comandos de systemctl](#2-comandos-de-systemctl)
3. [Comandos de apagado y reinicio](#3-comandos-de-apagado-y-reinicio)
4. [Comunicacion con usuarios](#4-comunicacion-con-usuarios)
5. [Tabla de equivalencia completa](#5-tabla-de-equivalencia-completa)
6. [Archivos clave](#6-archivos-clave)

---

## 1. Comandos de SysVinit

### Gestion de runlevels

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `runlevel` | Muestra el runlevel anterior y actual | `runlevel` -> `N 3` |
| `init N` | Cambia al runlevel N | `init 3` |
| `telinit N` | Cambia al runlevel N (equivalente a init) | `telinit 5` |
| `init 0` | Apaga el sistema | `init 0` |
| `init 1` | Modo monousuario | `init 1` |
| `init 6` | Reinicia el sistema | `init 6` |

### Gestion de servicios (SysVinit)

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `service nombre start` | Inicia un servicio | `service apache2 start` |
| `service nombre stop` | Detiene un servicio | `service ssh stop` |
| `service nombre restart` | Reinicia un servicio | `service networking restart` |
| `service nombre status` | Muestra el estado de un servicio | `service sshd status` |
| `/etc/init.d/nombre start` | Inicia un servicio directamente | `/etc/init.d/apache2 start` |
| `update-rc.d nombre defaults` | Habilita un servicio en runlevels por defecto (Debian) | `update-rc.d ssh defaults` |
| `update-rc.d nombre remove` | Elimina los enlaces de un servicio (Debian) | `update-rc.d apache2 remove` |
| `chkconfig nombre on` | Habilita un servicio (Red Hat) | `chkconfig httpd on` |
| `chkconfig nombre off` | Deshabilita un servicio (Red Hat) | `chkconfig httpd off` |
| `chkconfig --list` | Lista el estado de servicios por runlevel (Red Hat) | `chkconfig --list` |

---

## 2. Comandos de systemctl

### Gestion de targets

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `systemctl get-default` | Muestra el target por defecto | `systemctl get-default` -> `graphical.target` |
| `systemctl set-default target` | Establece el target por defecto | `systemctl set-default multi-user.target` |
| `systemctl isolate target` | Cambia al target indicado inmediatamente | `systemctl isolate rescue.target` |
| `systemctl list-units --type=target` | Lista los targets activos | `systemctl list-units --type=target` |

### Gestion de servicios

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `systemctl start servicio` | Inicia un servicio | `systemctl start sshd.service` |
| `systemctl stop servicio` | Detiene un servicio | `systemctl stop sshd.service` |
| `systemctl restart servicio` | Reinicia un servicio | `systemctl restart nginx.service` |
| `systemctl reload servicio` | Recarga la configuracion sin detener el servicio | `systemctl reload apache2.service` |
| `systemctl status servicio` | Muestra el estado detallado del servicio | `systemctl status sshd.service` |
| `systemctl enable servicio` | Habilita el servicio para arranque automatico | `systemctl enable sshd.service` |
| `systemctl disable servicio` | Deshabilita el servicio del arranque automatico | `systemctl disable sshd.service` |
| `systemctl is-active servicio` | Verifica si el servicio esta en ejecucion | `systemctl is-active sshd.service` |
| `systemctl is-enabled servicio` | Verifica si el servicio esta habilitado en el arranque | `systemctl is-enabled sshd.service` |
| `systemctl mask servicio` | Enmascara un servicio (impide su inicio) | `systemctl mask bluetooth.service` |
| `systemctl unmask servicio` | Desenmascara un servicio | `systemctl unmask bluetooth.service` |

### Listar y consultar unidades

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `systemctl list-units` | Lista todas las unidades activas | `systemctl list-units` |
| `systemctl list-units --all` | Lista todas las unidades (activas e inactivas) | `systemctl list-units --all` |
| `systemctl list-units --type=service` | Lista solo los servicios activos | `systemctl list-units --type=service` |
| `systemctl list-units --type=service --all` | Lista todos los servicios | `systemctl list-units --type=service --all` |
| `systemctl list-unit-files` | Lista archivos de unidad instalados | `systemctl list-unit-files` |
| `systemctl list-unit-files --type=service` | Lista archivos de servicio instalados | `systemctl list-unit-files --type=service` |
| `systemctl list-dependencies target` | Muestra las dependencias de un target | `systemctl list-dependencies multi-user.target` |
| `systemctl cat servicio` | Muestra el contenido del archivo de unidad | `systemctl cat sshd.service` |
| `systemctl show servicio` | Muestra todas las propiedades de un servicio | `systemctl show sshd.service` |
| `systemctl daemon-reload` | Recarga la configuracion de systemd | `systemctl daemon-reload` |

---

## 3. Comandos de apagado y reinicio

### Comando shutdown

| Comando | Descripcion |
|---------|-------------|
| `shutdown -h now` | Apaga el sistema inmediatamente |
| `shutdown -h +10` | Apaga el sistema en 10 minutos |
| `shutdown -h 23:00` | Apaga el sistema a las 23:00 |
| `shutdown -r now` | Reinicia el sistema inmediatamente |
| `shutdown -r +5 "mensaje"` | Reinicia en 5 minutos con un mensaje para los usuarios |
| `shutdown -c` | Cancela un apagado/reinicio programado |
| `shutdown -c "mensaje"` | Cancela con un mensaje explicativo |
| `shutdown -k +10 "mensaje"` | Solo avisa (no apaga realmente) |

### Equivalencias entre comandos de apagado

| Accion | SysVinit | Systemd | Otros |
|--------|----------|---------|-------|
| **Apagar** | `init 0`, `telinit 0` | `systemctl poweroff` | `shutdown -h now`, `poweroff` |
| **Reiniciar** | `init 6`, `telinit 6` | `systemctl reboot` | `shutdown -r now`, `reboot` |
| **Detener (sin apagar HW)** | - | `systemctl halt` | `halt` |
| **Monousuario** | `init 1`, `telinit 1` | `systemctl isolate rescue.target` | `shutdown now` (algunas distros) |
| **Suspender** | - | `systemctl suspend` | - |
| **Hibernar** | - | `systemctl hibernate` | - |

---

## 4. Comunicacion con usuarios

| Comando | Descripcion | Ejemplo |
|---------|-------------|---------|
| `wall "mensaje"` | Envia un mensaje a todos los usuarios conectados | `wall "El sistema se reiniciara en 10 minutos"` |
| `wall < archivo` | Envia el contenido de un archivo como mensaje | `wall < /tmp/aviso.txt` |
| `echo "msg" \| wall` | Envia un mensaje por pipe | `echo "Mantenimiento" \| wall` |

> **Nota:** `shutdown` con un tiempo futuro envia automaticamente mensajes a los usuarios conectados. No es necesario usar `wall` adicionalmente si ya se usa `shutdown` con mensaje.

---

## 5. Tabla de equivalencia completa

### Runlevels <-> Targets <-> Descripcion

| Runlevel | Target de systemd | Enlace de compatibilidad | Descripcion |
|----------|------------------|--------------------------|-------------|
| 0 | `poweroff.target` | `runlevel0.target` | Apagado del sistema |
| 1 | `rescue.target` | `runlevel1.target` | Modo monousuario / rescate |
| 2 | `multi-user.target` | `runlevel2.target` | Multiusuario (sin red en algunas distros) |
| 3 | `multi-user.target` | `runlevel3.target` | Multiusuario con red, modo texto |
| 4 | `multi-user.target` | `runlevel4.target` | Personalizable (no definido) |
| 5 | `graphical.target` | `runlevel5.target` | Multiusuario con entorno grafico |
| 6 | `reboot.target` | `runlevel6.target` | Reinicio del sistema |

### Equivalencias de acciones comunes

| Accion | SysVinit | Systemd |
|--------|----------|---------|
| Ver runlevel/target actual | `runlevel` | `systemctl get-default` |
| Cambiar runlevel/target por defecto | Editar `/etc/inittab` | `systemctl set-default target` |
| Cambiar runlevel/target en vivo | `init N` / `telinit N` | `systemctl isolate target` |
| Iniciar servicio | `service nombre start` | `systemctl start nombre` |
| Detener servicio | `service nombre stop` | `systemctl stop nombre` |
| Reiniciar servicio | `service nombre restart` | `systemctl restart nombre` |
| Estado de servicio | `service nombre status` | `systemctl status nombre` |
| Habilitar en arranque | `chkconfig nombre on` (RH) / `update-rc.d nombre defaults` (Deb) | `systemctl enable nombre` |
| Deshabilitar en arranque | `chkconfig nombre off` (RH) / `update-rc.d nombre remove` (Deb) | `systemctl disable nombre` |
| Listar servicios | `chkconfig --list` (RH) | `systemctl list-units --type=service` |

### Convencion de scripts SysVinit (S y K)

| Prefijo | Significado | Accion | Ejemplo |
|---------|-------------|--------|---------|
| **S** | Start | Se ejecuta con `start` al entrar en el runlevel | `S01networking` -> inicia red primero |
| **K** | Kill | Se ejecuta con `stop` al entrar en el runlevel | `K01apache2` -> detiene Apache primero |
| **Numero** | Orden | Menor numero = se ejecuta antes | `S01` antes que `S99` |

---

## 6. Archivos clave

### Archivos de configuracion

| Archivo / Directorio | Sistema | Descripcion |
|----------------------|---------|-------------|
| `/etc/inittab` | SysVinit | Configuracion principal: runlevel por defecto y acciones |
| `/etc/init.d/` | SysVinit | Directorio de scripts de inicio de servicios |
| `/etc/rc.d/rc[0-6].d/` | SysVinit (Red Hat) | Enlaces simbolicos S/K para cada runlevel |
| `/etc/rc[0-6].d/` | SysVinit (Debian) | Enlaces simbolicos S/K para cada runlevel |
| `/lib/systemd/system/` | systemd | Archivos de unidad del sistema (paquetes) |
| `/etc/systemd/system/` | systemd | Archivos de unidad del administrador (prioridad alta) |
| `/etc/systemd/system/default.target` | systemd | Enlace simbolico al target por defecto |
| `/run/systemd/system/` | systemd | Archivos de unidad generados en tiempo de ejecucion |

### Archivos de acpid

| Archivo / Directorio | Descripcion |
|----------------------|-------------|
| `/etc/acpi/` | Directorio principal de configuracion de acpid |
| `/etc/acpi/events/` | Reglas de eventos ACPI |
| `/etc/acpi/actions/` | Scripts de acciones para eventos ACPI |

---

## Referencia rapida de flujo de trabajo

### Cambiar el target por defecto en systemd
```bash
# Ver el target actual
systemctl get-default

# Cambiar a modo texto
systemctl set-default multi-user.target

# Cambiar a modo grafico
systemctl set-default graphical.target
```

### Cambiar de target en tiempo real
```bash
# Ir a modo rescate (monousuario)
systemctl isolate rescue.target

# Ir a modo multiusuario
systemctl isolate multi-user.target

# Ir a modo grafico
systemctl isolate graphical.target
```

### Apagado seguro con aviso
```bash
# 1. Avisar a los usuarios
wall "ATENCION: El servidor se reiniciara en 15 minutos"

# 2. Programar el reinicio (envia avisos automaticos)
shutdown -r +15 "Reinicio por mantenimiento"

# 3. Cancelar si es necesario
shutdown -c "Reinicio cancelado"
```

### Gestionar un servicio
```bash
# Ver estado
systemctl status nginx.service

# Iniciar y habilitar en el arranque
systemctl start nginx.service
systemctl enable nginx.service

# O ambos a la vez
systemctl enable --now nginx.service
```
