---
tipo: ejercicios
certificacion: lpic-3
especialidad: 303 - Seguridad
bloque: "332 - Seguridad del Host"
tema: "332.3 - Control de recursos"
subtema: "332.3"
peso: 3
tags:
  - lpic-3
  - tema-332
  - ulimit
  - cgroups
  - systemd
---

# Ejercicios - 332.3 Control de Recursos

### Pregunta 1
¿Que comando muestra el limite maximo de archivos abiertos (hard limit) para la sesion actual?

a) `ulimit -n`
b) `ulimit -Hn`
c) `ulimit -a | grep files`
d) `limits -nofile`

<details><summary>Respuesta</summary>

**b)** `ulimit -Hn`

La opcion `-H` muestra el hard limit y `-n` se refiere a los archivos abiertos (nofile). Sin `-H` o `-S`, ulimit muestra el soft limit por defecto.
</details>

### Pregunta 2
¿Que linea en `/etc/security/limits.conf` limita a 500 el numero maximo de procesos para todos los usuarios?

a) `* soft nproc 500`
b) `* hard nproc 500`
c) `all hard processes 500`
d) `everybody hard nproc 500`

<details><summary>Respuesta</summary>

**b)** `* hard nproc 500`

El asterisco (`*`) aplica a todos los usuarios, `hard` establece el limite maximo que no puede ser sobrepasado, y `nproc` es el item que controla el numero de procesos.
</details>

### Pregunta 3
¿Que comando crea un cgroup v1 con controladores de CPU y memoria llamado "webapps"?

a) `cgroup create --cpu --memory webapps`
b) `cgcreate -g cpu,memory:webapps`
c) `mkdir /sys/fs/cgroup/cpu,memory/webapps`
d) `cgset --create cpu,memory webapps`

<details><summary>Respuesta</summary>

**b)** `cgcreate -g cpu,memory:webapps`

`cgcreate` crea un nuevo cgroup. La opcion `-g` especifica los controladores y el nombre del grupo en formato `controlador1,controlador2:nombre`.
</details>

### Pregunta 4
¿Que directiva de systemd limita un servicio a un maximo de 512MB de memoria?

a) `MemoryLimit=512M`
b) `MemoryMax=512M`
c) `MaxMemory=512M`
d) `LimitMEMORY=512M`

<details><summary>Respuesta</summary>

**b)** `MemoryMax=512M`

`MemoryMax` establece el limite duro de memoria para el servicio. Si el servicio intenta usar mas, el OOM killer lo terminara. `MemoryHigh` es el limite suave que aplica presion de reclamacion.
</details>

### Pregunta 5
¿Que mecanismo protege mejor contra una fork bomb?

a) Aumentar `kernel.pid_max`
b) Establecer un limite hard de `nproc` en limits.conf
c) Deshabilitar el swap
d) Aumentar la memoria RAM

<details><summary>Respuesta</summary>

**b)** Establecer un limite hard de `nproc` en limits.conf

Un limite hard de `nproc` restringe el numero maximo de procesos que un usuario puede crear, impidiendo que una fork bomb consuma todos los PIDs del sistema. Aumentar `pid_max` solo retrasaria el problema.
</details>

### Pregunta 6
¿Cual es la diferencia principal entre cgroups v1 y v2?

a) v2 no soporta limites de memoria
b) v1 usa una jerarquia unica, v2 usa multiples
c) v2 usa una jerarquia unica unificada, v1 usa una jerarquia por controlador
d) v2 solo funciona con systemd, v1 funciona de forma independiente

<details><summary>Respuesta</summary>

**c)** v2 usa una jerarquia unica unificada, v1 usa una jerarquia por controlador

En cgroups v1, cada controlador (cpu, memory, etc.) tiene su propia jerarquia independiente. Cgroups v2 unifica todos los controladores en una sola jerarquia, simplificando la gestion.
</details>

### Pregunta 7
¿Que comando ejecuta un proceso dentro de un cgroup v1 especifico?

a) `cgroup-run -g cpu:migrupo /usr/bin/app`
b) `cgexec -g cpu,memory:migrupo /usr/bin/app`
c) `cgrun --group cpu,memory:migrupo /usr/bin/app`
d) `cgstart -g cpu:migrupo /usr/bin/app`

<details><summary>Respuesta</summary>

**b)** `cgexec -g cpu,memory:migrupo /usr/bin/app`

`cgexec` ejecuta un comando dentro de un cgroup existente. La opcion `-g` especifica los controladores y el nombre del grupo.
</details>

### Pregunta 8
¿Que significa `CPUQuota=200%` en una unidad systemd?

a) El servicio tiene prioridad doble sobre otros
b) El servicio puede usar hasta 2 cores de CPU
c) La cuota se aplica al 200% del limite normal
d) Es un valor invalido, el maximo es 100%

<details><summary>Respuesta</summary>

**b)** El servicio puede usar hasta 2 cores de CPU

`CPUQuota` se expresa como porcentaje de un core. 100% = 1 core, 200% = 2 cores. En un sistema con 4 cores, el maximo seria 400%.
</details>

### Pregunta 9
¿Que modulo PAM debe estar habilitado para que los limites de `/etc/security/limits.conf` se apliquen?

a) `pam_ulimit.so`
b) `pam_limits.so`
c) `pam_security.so`
d) `pam_resource.so`

<details><summary>Respuesta</summary>

**b)** `pam_limits.so`

El modulo `pam_limits.so` lee `/etc/security/limits.conf` y aplica los limites durante la autenticacion. Debe estar presente como `session required pam_limits.so` en los archivos PAM correspondientes.
</details>

### Pregunta 10
¿Que comando de systemd muestra en tiempo real el uso de recursos (CPU, memoria) por cgroup, similar a `top`?

a) `systemd-cgtop`
b) `systemd-cgls`
c) `systemctl resource-top`
d) `cgstats`

<details><summary>Respuesta</summary>

**a)** `systemd-cgtop`

`systemd-cgtop` muestra en tiempo real el uso de CPU, memoria y I/O de cada cgroup, similar a `top` pero organizado por cgroups. `systemd-cgls` muestra la jerarquia en forma de arbol sin datos de uso.
</details>
