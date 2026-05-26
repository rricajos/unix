---
title: "104.3 Controlar el montaje y desmontaje - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.3"
---

# 104.3 Controlar el montaje y desmontaje - Ejercicios

## Ejercicio 1
**Escribe la linea de `/etc/fstab` para montar una particion ext4 con UUID `a1b2c3d4-e5f6-7890-abcd-ef1234567890` en `/home`, con opciones por defecto, sin backup con dump, y que se verifique con fsck despues de la raiz.**

<details>
<summary>Ver respuesta</summary>

```
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890  /home  ext4  defaults  0  2
```

Explicacion de cada campo:
1. `UUID=a1b2c3d4...` - Dispositivo identificado por UUID
2. `/home` - Punto de montaje
3. `ext4` - Tipo de sistema de archivos
4. `defaults` - Opciones (equivale a rw,suid,dev,exec,auto,nouser,async)
5. `0` - No hacer backup con dump
6. `2` - Verificar con fsck despues de la raiz (que tiene pass=1)

</details>

---

## Ejercicio 2
**¿Que opciones estan implicitas cuando se usa `defaults` en /etc/fstab? ¿Y cuando se usa `user`?**

<details>
<summary>Ver respuesta</summary>

**`defaults`** equivale a:
- `rw` - Lectura-escritura
- `suid` - Respetar bits SUID/SGID
- `dev` - Interpretar dispositivos especiales
- `exec` - Permitir ejecucion de binarios
- `auto` - Montar con `mount -a`
- `nouser` - Solo root puede montar
- `async` - Escrituras asincronas

**`user`** implica automaticamente:
- `noexec` - No permitir ejecucion
- `nosuid` - Ignorar SUID/SGID
- `nodev` - No interpretar dispositivos

Esto es por seguridad: si un usuario normal puede montar un FS, se restringen estas opciones para evitar escalada de privilegios.

</details>

---

## Ejercicio 3
**¿Como montarias una imagen ISO llamada `/home/user/ubuntu.iso` en `/mnt/iso` como solo lectura?**

<details>
<summary>Ver respuesta</summary>

```bash
# Crear el punto de montaje si no existe
mkdir -p /mnt/iso

# Montar la imagen ISO
mount -o loop,ro /home/user/ubuntu.iso /mnt/iso

# O especificando el tipo:
mount -t iso9660 -o loop,ro /home/user/ubuntu.iso /mnt/iso
```

La opcion `loop` crea un dispositivo de bucle (`/dev/loopN`) que permite tratar el archivo ISO como si fuera un dispositivo de bloque. La opcion `ro` asegura que se monte como solo lectura.

</details>

---

## Ejercicio 4
**Tienes un sistema de archivos montado en `/datos` y necesitas cambiarlo a solo lectura sin desmontarlo. ¿Como lo harias?**

<details>
<summary>Ver respuesta</summary>

```bash
mount -o remount,ro /datos
```

La opcion `remount` permite cambiar las opciones de un sistema de archivos ya montado sin necesidad de desmontarlo primero. Esto es especialmente util para la particion raiz (`/`), que no se puede desmontar facilmente.

Para verificar que el cambio se aplico:
```bash
mount | grep /datos
# O mejor:
findmnt /datos
```

</details>

---

## Ejercicio 5
**Explica la diferencia entre los valores 0, 1 y 2 en el sexto campo (pass) de `/etc/fstab`. ¿Que pasaria si pones `1` en todas las particiones?**

<details>
<summary>Ver respuesta</summary>

| Valor pass | Comportamiento |
|-----------|---------------|
| `0` | No se verifica con fsck al arrancar |
| `1` | Se verifica primero. **Solo debe usarse para `/` (particion raiz)** |
| `2` | Se verifica despues de las particiones con pass=1 |

Si pones `1` en todas las particiones, todas se intentarian verificar "en primer lugar" y de forma secuencial. En la practica:
- Seria mas lento que usar `2` (las particiones con pass=2 pueden verificarse en paralelo)
- Solo la particion raiz deberia tener `1`
- No es tecnicamente un error, pero es ineficiente y no sigue las buenas practicas

El valor recomendado:
- `/` (raiz): `1`
- Otras particiones que quieras verificar: `2`
- Swap y FS virtuales: `0`

</details>

---

## Ejercicio 6
**¿Como averiguarias el UUID de `/dev/sdb1`? Da al menos dos formas diferentes.**

<details>
<summary>Ver respuesta</summary>

```bash
# Forma 1: blkid
blkid /dev/sdb1
# Salida: /dev/sdb1: UUID="xxxx" TYPE="ext4" ...

# Forma 2: lsblk
lsblk -f /dev/sdb
# Muestra arbol con UUID y tipo de FS

# Forma 3: directamente del enlace simbolico
ls -la /dev/disk/by-uuid/ | grep sdb1

# Forma 4: tune2fs (solo para ext)
tune2fs -l /dev/sdb1 | grep UUID

# Forma 5: findmnt (si esta montado)
findmnt -o UUID /dev/sdb1
```

Las formas mas comunes y recomendadas para el examen son `blkid` y `lsblk -f`.

</details>

---

## Ejercicio 7
**Intentas desmontar `/mnt/datos` pero recibes el error "target is busy". ¿Que pasos seguirias para resolver el problema?**

<details>
<summary>Ver respuesta</summary>

El error "target is busy" significa que algun proceso esta usando archivos en ese punto de montaje.

```bash
# Paso 1: Ver que procesos usan el punto de montaje
lsof /mnt/datos
# O:
fuser -mv /mnt/datos

# Paso 2: Cerrar esos procesos de forma normal
# (por ejemplo, salir de un shell que esta en ese directorio,
# cerrar aplicaciones que tienen archivos abiertos ahi)

# Paso 3: Si no se pueden cerrar normalmente, matar los procesos
fuser -km /mnt/datos

# Paso 4: Intentar desmontar de nuevo
umount /mnt/datos

# Alternativa: Lazy unmount (desconecta y limpia cuando ya no se use)
umount -l /mnt/datos

# Ultima opcion: Forzar
umount -f /mnt/datos
```

La causa mas comun es tener una terminal con `cd` dentro del punto de montaje.

</details>

---

## Ejercicio 8
**Si una unidad systemd .mount se llama `mnt-backup-diario.mount`, ¿cual es el punto de montaje correspondiente? ¿Como se nombraria la unidad para el punto de montaje `/srv/web/static`?**

<details>
<summary>Ver respuesta</summary>

**Regla:** El nombre de la unidad `.mount` se construye reemplazando las barras `/` de la ruta por guiones `-` (omitiendo la barra inicial).

- `mnt-backup-diario.mount` corresponde al punto de montaje: **`/mnt/backup/diario`**

- Para el punto de montaje `/srv/web/static`, la unidad seria: **`srv-web-static.mount`**

Para gestionar la unidad:
```bash
# Montar
systemctl start srv-web-static.mount

# Desmontar
systemctl stop srv-web-static.mount

# Activar al arranque
systemctl enable srv-web-static.mount

# Ver estado
systemctl status srv-web-static.mount
```

</details>
