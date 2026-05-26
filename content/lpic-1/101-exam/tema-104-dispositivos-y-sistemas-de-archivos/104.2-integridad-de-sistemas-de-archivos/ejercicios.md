---
title: "104.2 Mantener la integridad de los sistemas de archivos - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.2"
---

# 104.2 Mantener la integridad de los sistemas de archivos - Ejercicios

## Ejercicio 1
**Un usuario reporta que no puede crear archivos nuevos en `/home`, pero `df -h` muestra que aun hay 20 GB libres. ¿Cual podria ser el problema y como lo diagnosticarias?**

<details>
<summary>Ver respuesta</summary>

El problema probablemente es que se han **agotado los inodos**. Cada archivo necesita un inodo, y si se agotan, no se pueden crear archivos nuevos aunque haya espacio en bloques.

Para diagnosticar:
```bash
df -i /home
```

Si la columna `IUse%` muestra 100%, los inodos estan agotados. La solucion seria eliminar archivos innecesarios (especialmente muchos archivos pequenos) o redimensionar el sistema de archivos.

</details>

---

## Ejercicio 2
**¿Cual es la diferencia entre `df -h` y `du -sh /`? ¿Pueden dar resultados diferentes?**

<details>
<summary>Ver respuesta</summary>

- **`df -h`**: Consulta al sistema de archivos directamente sobre el espacio de bloques usado/libre. Es instantaneo y muestra el espacio real del FS.
- **`du -sh /`**: Recorre todos los archivos y suma sus tamanos. Es mas lento.

**Si, pueden dar resultados diferentes** por varias razones:
1. **Archivos eliminados pero abiertos:** Si un proceso tiene abierto un archivo que fue eliminado, `df` sigue contando ese espacio como usado, pero `du` no lo ve porque el archivo ya no esta en el directorio.
2. **Bloques reservados para root:** `df` conoce los bloques reservados, `du` no.
3. **Otros montajes:** `du` podria cruzar puntos de montaje si no se usa `-x`.

</details>

---

## Ejercicio 3
**¿Por que NUNCA se debe ejecutar `fsck` en un sistema de archivos montado en modo lectura-escritura?**

<details>
<summary>Ver respuesta</summary>

Porque `fsck` lee y modifica directamente las estructuras del sistema de archivos (superbloque, tabla de inodos, bloques de datos). Si el FS esta montado en modo lectura-escritura, el kernel tambien esta modificando esas mismas estructuras simultaneamente.

Esto puede causar:
- **Corrupcion severa de datos** al haber escrituras simultaneas incompatibles
- **Perdida de archivos** si fsck "repara" algo que el kernel estaba modificando
- **Dano irreversible** al sistema de archivos

La solucion correcta es desmontar el FS primero o montarlo como solo lectura:
```bash
umount /dev/sda1
fsck /dev/sda1

# O para la particion raiz:
mount -o remount,ro /
fsck /dev/sda1
```

</details>

---

## Ejercicio 4
**Tienes un sistema ext2 en `/dev/sdb1`. ¿Como lo convertirias a ext3 sin formatear? ¿Que comando usarias?**

<details>
<summary>Ver respuesta</summary>

Se usa `tune2fs -j` para anadir un journal al sistema ext2, convirtiendolo efectivamente en ext3:

```bash
# Desmontar primero
umount /dev/sdb1

# Anadir journal
tune2fs -j /dev/sdb1

# Montar como ext3
mount -t ext3 /dev/sdb1 /mnt/datos
```

La opcion `-j` (journal) anade la estructura de journaling sin destruir los datos existentes. La conversion es no destructiva.

</details>

---

## Ejercicio 5
**Escribe los comandos para:**
- a) Ver cuanto espacio ocupa `/var/log` de forma legible
- b) Ver los 5 subdirectorios mas grandes dentro de `/home`
- c) Desactivar la verificacion automatica por conteo de montajes en `/dev/sda1`

<details>
<summary>Ver respuesta</summary>

```bash
# a) Espacio de /var/log legible
du -sh /var/log

# b) 5 subdirectorios mas grandes en /home
du -sh /home/* | sort -rh | head -5
# O con profundidad limitada:
du --max-depth=1 -h /home | sort -rh | head -5

# c) Desactivar verificacion por conteo de montajes
tune2fs -c 0 /dev/sda1
# O equivalente:
tune2fs -c -1 /dev/sda1
```

</details>

---

## Ejercicio 6
**¿Que herramienta se usa para reparar un sistema XFS? ¿Es lo mismo que `fsck.xfs`?**

<details>
<summary>Ver respuesta</summary>

La herramienta para reparar XFS es **`xfs_repair`**.

**No, `fsck.xfs` NO es lo mismo.** `fsck.xfs` existe en el sistema pero es un **placeholder** que no realiza ninguna reparacion real. Solo existe para que scripts genericos que llaman a `fsck` no fallen cuando encuentran XFS.

```bash
# Correcto: reparar XFS
xfs_repair /dev/sda1

# Solo verificar sin reparar
xfs_repair -n /dev/sda1

# Incorrecto: esto no hace nada util
fsck.xfs /dev/sda1
```

Ademas, `xfs_repair` requiere que el FS este **desmontado**, y `xfs_info` requiere que este **montado**.

</details>

---

## Ejercicio 7
**Explica que informacion proporcionan los siguientes comandos y cuando usarias cada uno:**
- `tune2fs -l /dev/sda1`
- `dumpe2fs /dev/sda1`
- `dumpe2fs -h /dev/sda1`

<details>
<summary>Ver respuesta</summary>

| Comando | Informacion | Cuando usarlo |
|---------|------------|---------------|
| `tune2fs -l /dev/sda1` | Informacion del superbloque: etiqueta, UUID, conteo de montajes, maximo de montajes, ultimo montaje, estado, features | Consulta rapida de parametros del FS |
| `dumpe2fs /dev/sda1` | Todo lo de `tune2fs -l` MAS informacion detallada de todos los grupos de bloques, ubicaciones de superbloques de respaldo | Cuando necesitas info completa, incluyendo superbloques de respaldo |
| `dumpe2fs -h /dev/sda1` | Solo la informacion del superbloque (header), sin los grupos de bloques | Cuando quieres info como dumpe2fs pero sin el volcado extenso de grupos |

En la practica:
- `tune2fs -l` es para consulta rapida
- `dumpe2fs -h` es similar pero con formato ligeramente diferente
- `dumpe2fs` (sin -h) es para cuando necesitas buscar superbloques de respaldo

</details>

---

## Ejercicio 8
**Un sistema de archivos ext4 en `/dev/sda3` se ha corrompido y `e2fsck` falla al intentar leer el superbloque principal. ¿Como intentarias recuperarlo?**

<details>
<summary>Ver respuesta</summary>

Se puede intentar usar un **superbloque de respaldo**. Los sistemas ext guardan copias en ubicaciones predecibles:

```bash
# Paso 1: Encontrar ubicaciones de superbloques de respaldo
# (si dumpe2fs funciona)
dumpe2fs /dev/sda3 | grep -i "superblock"

# Si dumpe2fs no funciona, las ubicaciones comunes son:
# 32768, 98304, 163840, 229376, 294912...

# Paso 2: Usar un superbloque de respaldo
e2fsck -b 32768 /dev/sda3

# Si 32768 no funciona, probar con el siguiente:
e2fsck -b 98304 /dev/sda3
```

Tambien se puede usar `mke2fs -n` para que muestre donde ESTARIAN los superbloques sin escribir nada:
```bash
mke2fs -n /dev/sda3
```

</details>
