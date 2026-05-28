---
title: "104.2 - Flashcards"
tags:
  - lpic-1
  - flashcards
  - repaso
tipo: flashcards
certificacion: lpic-1
subtema: "104.2"
---

# Flashcards: 104.2 - Integridad De Sistemas De Archivos

> 18 tarjetas de repaso. Usa el sistema de repeticion espaciada para memorizar.

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-001">
<div class="flashcard-front">

**P:** Un usuario reporta que no puede crear archivos nuevos en `/home`, pero `df -h` muestra que aun hay 20 GB libres. Cual es la causa mas probable y que comando la diagnosticaria?

</div>
<div class="flashcard-back">

**R:** b) Se han agotado los inodos; usar `df -i /home`. Cada archivo necesita un inodo, y es posible quedarse sin inodos aunque quede espacio libre en bloques. Esto ocurre tipicamente cuando hay una enorme cantidad de archivos pequenos. `df -i` muestra el uso de inodos, y si la columna `IUse%` muestra 100%, los inodos estan agotados. Esta es una situacion clasica del examen LPIC-1 donde el disco tiene espacio pero no puede crear archivos nuevos. La solucion seria eliminar archivos innecesarios, especialmente los muy pequenos y numerosos.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-002">
<div class="flashcard-front">

**P:** Cual es la diferencia principal entre `df -h` y `du -sh /`?

</div>
<div class="flashcard-back">

**R:** b) `df -h` consulta al sistema de archivos sobre espacio de bloques, mientras que `du -sh /` recorre archivos sumando sus tamanos. `df` obtiene informacion directamente de las estructuras del sistema de archivos, es instantaneo y muestra el espacio real utilizado en bloques. `du` recorre fisicamente todos los archivos sumando sus tamanos, lo cual es mas lento. Pueden dar resultados diferentes por varias razones: archivos eliminados pero aun abiertos por procesos (que `df` cuenta pero `du` no ve), bloques reservados para root, o puntos de montaje que `du` podria cruzar sin la opcion `-x`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-003">
<div class="flashcard-front">

**P:** Por que NUNCA se debe ejecutar `fsck` en un sistema de archivos montado en modo lectura-escritura?

</div>
<div class="flashcard-back">

**R:** c) Porque las escrituras simultaneas del kernel y fsck pueden causar corrupcion severa de datos. `fsck` lee y modifica directamente las estructuras del sistema de archivos (superbloque, tabla de inodos, bloques de datos). Si el sistema de archivos esta montado en modo lectura-escritura, el kernel tambien esta modificando esas estructuras. Esto genera escrituras simultaneas incompatibles que pueden provocar corrupcion severa, perdida de archivos y dano irreversible. La solucion es desmontar el FS primero con `umount`, o remontarlo como solo lectura con `mount -o remount,ro` si se trata de la particion raiz.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-004">
<div class="flashcard-front">

**P:** Que comando convierte un sistema de archivos ext2 a ext3 sin destruir los datos existentes?

</div>
<div class="flashcard-back">

**R:** c) `tune2fs -j /dev/sdb1`. La opcion `-j` de `tune2fs` anade un journal (diario de transacciones) al sistema de archivos ext2, convirtiendolo efectivamente en ext3. Esta conversion es no destructiva: no se pierden los datos existentes. Solo se necesita desmontar el sistema de archivos primero y luego montarlo como ext3. La opcion `a` (mkfs.ext3) destruiria todos los datos al crear un FS nuevo. `fsck` es para verificar y reparar, no para convertir. La opcion `d` no es una sintaxis valida de `e2fsck`.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-005">
<div class="flashcard-front">

**P:** Cual es la herramienta correcta para reparar un sistema de archivos XFS?

</div>
<div class="flashcard-back">

**R:** c) `xfs_repair /dev/sda1`. `xfs_repair` es la herramienta real para reparar sistemas de archivos XFS. Aunque `fsck.xfs` existe en el sistema, es un placeholder que no realiza ninguna reparacion real; solo existe para que scripts genericos que llaman a `fsck` no fallen al encontrar XFS. `e2fsck` es especifico para sistemas ext2/ext3/ext4 y no funciona con XFS. Para solo verificar sin reparar se usa `xfs_repair -n`. Ademas, `xfs_repair` requiere que el sistema de archivos este desmontado.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-006">
<div class="flashcard-front">

**P:** Cual de las siguientes combinaciones de comandos muestra los 5 subdirectorios mas grandes dentro de `/home`?

</div>
<div class="flashcard-back">

**R:** b) `du -sh /home/* | sort -rh | head -5`. `du -sh /home/*` calcula el tamano total de cada subdirectorio dentro de `/home` en formato legible (`-h`) mostrando solo el resumen (`-s`). El resultado se pasa a `sort -rh` que ordena en orden inverso (`-r`) interpretando los tamanos legibles (`-h`), y `head -5` muestra solo los primeros 5 resultados. `df` muestra informacion de sistemas de archivos montados, no de directorios individuales. `ls -lS` solo muestra el tamano de las entradas del directorio, no el contenido recursivo. `find` busca archivos individuales por tamano, no suma el contenido de directorios.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-007">
<div class="flashcard-front">

**P:** Que opcion de `tune2fs` desactiva la verificacion automatica de un sistema ext4 basada en el conteo de montajes?

</div>
<div class="flashcard-back">

**R:** b) `tune2fs -c 0 /dev/sda1`. La opcion `-c` de `tune2fs` establece el numero maximo de montajes antes de que `fsck` se ejecute automaticamente. Establecer `-c 0` o `-c -1` desactiva esta verificacion. La opcion `-i` controla el intervalo de tiempo entre verificaciones (no el conteo de montajes). La opcion `-l` lista la informacion del superbloque sin modificar nada. La opcion `-m` establece el porcentaje de bloques reservados para root, no tiene relacion con la verificacion automatica.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-008">
<div class="flashcard-front">

**P:** Un sistema ext4 tiene el superbloque principal corrupto. Cual de los siguientes comandos intentaria repararlo usando un superbloque de respaldo?

</div>
<div class="flashcard-back">

**R:** b) `e2fsck -b 32768 /dev/sda3`. La opcion `-b` de `e2fsck` permite especificar la ubicacion de un superbloque de respaldo alternativo. Los sistemas ext mantienen copias del superbloque en ubicaciones predecibles, siendo `32768` una de las mas comunes. Si esa ubicacion no funciona, se pueden probar otras como `98304` o `163840`. Para encontrar las ubicaciones exactas de los superbloques de respaldo se puede usar `dumpe2fs /dev/sda3 | grep superblock` o `mke2fs -n /dev/sda3` (dry-run). Las opciones `c` y `d` son de consulta y no reparan.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-009">
<div class="flashcard-front">

**P:** Que diferencia hay entre `dumpe2fs /dev/sda1` y `dumpe2fs -h /dev/sda1`?

</div>
<div class="flashcard-back">

**R:** b) Sin `-h` muestra informacion del superbloque y todos los grupos de bloques; con `-h` muestra solo la informacion del superbloque. `dumpe2fs` sin opciones muestra informacion completa: datos del superbloque mas informacion detallada de todos los grupos de bloques, incluyendo ubicaciones de superbloques de respaldo. Con la opcion `-h` (header), solo muestra la informacion del superbloque sin el volcado extenso de los grupos de bloques. En este contexto, `-h` significa "header", no "human readable". `dumpe2fs -h` es util cuando solo se necesitan los datos generales del sistema de archivos sin la informacion detallada de cada grupo.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-010">
<div class="flashcard-front">

**P:** Que herramienta permite examinar la estructura interna de un sistema de archivos ext4 a bajo nivel e intentar recuperar archivos borrados?

</div>
<div class="flashcard-back">

**R:** c) `debugfs`. `debugfs` es un depurador interactivo para sistemas de archivos ext2/ext3/ext4 que permite examinar y modificar estructuras internas a bajo nivel. Con el comando `lsdel` se pueden listar inodos de archivos borrados, y con `undel` se puede intentar recuperarlos. Se abre en modo solo lectura por defecto (`debugfs /dev/sda1`) y en modo escritura con `-w`. `tune2fs` es para ajustar parametros del FS, no para depuracion. `xfs_db` es el depurador equivalente pero para XFS, no para ext. `e2fsck` verifica y repara pero no permite la exploracion interactiva de estructuras.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-011">
<div class="flashcard-front">

**P:** Tip de examen: `debugfs` es util para examinar la estructura interna de ext2/ext3/ext4 y para r...

</div>
<div class="flashcard-back">

**R:** `debugfs` es util para examinar la estructura interna de ext2/ext3/ext4 y para recuperar archivos borrados. El FS debe estar preferiblemente desmontado o montado como solo lectura.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-012">
<div class="flashcard-front">

**P:** Tip de examen: `xfs_fsr` funciona en sistemas XFS **montados** (a diferencia de la mayoria de h...

</div>
<div class="flashcard-back">

**R:** `xfs_fsr` funciona en sistemas XFS **montados** (a diferencia de la mayoria de herramientas de reparacion que requieren FS desmontado). `xfs_db` es el equivalente XFS de `debugfs` para ext.

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-013">
<div class="flashcard-front">

**P:** Que hace el comando `-s`?

</div>
<div class="flashcard-back">

**R:** Solo mostrar total (summary)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-014">
<div class="flashcard-front">

**P:** Que hace el comando `-h`?

</div>
<div class="flashcard-back">

**R:** Formato legible (human readable)

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-015">
<div class="flashcard-front">

**P:** Que hace el comando `-c`?

</div>
<div class="flashcard-back">

**R:** Mostrar total general al final

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-016">
<div class="flashcard-front">

**P:** Que hace el comando `--max-depth=N`?

</div>
<div class="flashcard-back">

**R:** Limitar profundidad de directorios

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-017">
<div class="flashcard-front">

**P:** Que hace el comando `-a`?

</div>
<div class="flashcard-back">

**R:** Incluir archivos individuales

</div>
</div>

---

<div class="flashcard-deck" data-subtema="104.2">
</div>

<div class="flashcard" data-id="104.2-fc-018">
<div class="flashcard-front">

**P:** Que es/son 6. Puntos clave para el examen?

</div>
<div class="flashcard-back">

**R:** 1. **`fsck` solo en FS desmontado** o montado como solo lectura. NUNCA en FS montado en lectura-escritura.

</div>
</div>

---

