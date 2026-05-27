---
title: "351.2 - Comandos Clave: Xen"
tipo: comandos
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "351 - Virtualización Completa"
subtema: "351.2"
peso: 3
tags:
  - lpic-3
  - tema-351
  - comandos
  - xen
  - xl
---

# Comandos Clave - 351.2 Xen

## Gestión de Dominios con xl

| Comando | Descripción |
|---|---|
| `xl create /etc/xen/vm.cfg` | Crear e iniciar un dominio |
| `xl list` | Listar todos los dominios activos |
| `xl info` | Información del hipervisor Xen y Dom0 |
| `xl shutdown <dominio>` | Apagado ordenado (señal ACPI) |
| `xl destroy <dominio>` | Apagado forzado inmediato |
| `xl reboot <dominio>` | Reiniciar dominio |
| `xl pause <dominio>` | Pausar dominio |
| `xl unpause <dominio>` | Reanudar dominio pausado |
| `xl console <dominio>` | Conectar a la consola del dominio |
| `xl migrate <dominio> <host>` | Migración en vivo a otro host |
| `xl save <dominio> <archivo>` | Guardar estado del dominio a disco |
| `xl restore <archivo>` | Restaurar dominio desde archivo |
| `xl vcpu-list` | Listar vCPUs de todos los dominios |
| `xl mem-list` | Listar uso de memoria por dominio |
| `xl mem-set <dominio> <MB>` | Ajustar memoria de un dominio |
| `xl vcpu-set <dominio> <N>` | Ajustar número de vCPUs |

## Monitorización

| Comando | Descripción |
|---|---|
| `xentop` | Monitor interactivo de dominios |
| `xentop -d 5` | xentop con refresco cada 5 segundos |
| `xentop -b -i 1` | xentop en modo batch (una iteración) |
| `xl dmesg` | Ver mensajes del hipervisor Xen |
| `xl uptime` | Tiempo de actividad de los dominios |

## Xenstore

| Comando | Descripción |
|---|---|
| `xenstore-ls` | Listar todo el contenido de xenstore |
| `xenstore-read <ruta>` | Leer un valor específico |
| `xenstore-write <ruta> <valor>` | Escribir un valor |
| `xenstore-watch <ruta>` | Observar cambios en una ruta |
| `xenstore-rm <ruta>` | Eliminar una entrada |

## Archivos de Configuración

| Ruta | Descripción |
|---|---|
| `/etc/xen/` | Directorio de configuraciones de dominios |
| `/etc/xen/xl.conf` | Configuración global de xl |
| `/etc/xen/<vm>.cfg` | Archivo de configuración de un dominio |
| `/var/log/xen/` | Logs de Xen |
| `/var/lib/xen/` | Datos de estado de Xen |

## Parámetros Comunes de xl.cfg

| Parámetro | Descripción |
|---|---|
| `name` | Nombre del dominio |
| `builder` | Tipo: `"generic"` (PV), `"hvm"` |
| `memory` | Memoria en MB |
| `vcpus` | Número de vCPUs |
| `disk` | Lista de discos |
| `vif` | Lista de interfaces de red |
| `boot` | Orden de arranque (HVM): c=disco, d=cd |
| `kernel` | Ruta al kernel (solo PV) |
| `ramdisk` | Ruta al initrd (solo PV) |
| `extra` | Parámetros extra del kernel (solo PV) |
| `vnc` | Habilitar acceso VNC (HVM) |
| `on_crash` | Acción al crash: restart, destroy, preserve |
