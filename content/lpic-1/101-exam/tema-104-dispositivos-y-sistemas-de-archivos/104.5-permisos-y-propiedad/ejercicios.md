---
title: "104.5 Gestionar permisos y propiedad de archivos - Ejercicios"
tags:
  - lpic-1
  - examen-101
  - tema-104
  - ejercicios
tipo: ejercicios
certificacion: lpic-1
examen: "101"
tema: "104"
subtema: "104.5"
---

# 104.5 Gestionar permisos y propiedad de archivos - Ejercicios

### Pregunta 1

Cual es el valor octal de los permisos `rwxr-x---`?

a) `740`
b) `750`
c) `751`
d) `760`

<details>
<summary>Respuesta</summary>

**b) `750`**

Para convertir permisos simbolicos a octales se suma el valor de cada permiso: `r=4`, `w=2`, `x=1`. Para el propietario: `rwx` = 4+2+1 = **7**. Para el grupo: `r-x` = 4+0+1 = **5**. Para otros: `---` = 0+0+0 = **0**. El resultado es `750`. La opcion `a` (740) corresponderia a `rwxr-----`. La opcion `c` (751) corresponderia a `rwxr-x--x`. La opcion `d` (760) corresponderia a `rwxrw----`.

</details>

---

### Pregunta 2

Si la umask es `027`, que permisos tendran los archivos recien creados?

a) `750` (rwxr-x---)
b) `640` (rw-r-----)
c) `644` (rw-r--r--)
d) `600` (rw-------)

<details>
<summary>Respuesta</summary>

**b) `640` (rw-r-----)**

La umask define que permisos se quitan al crear archivos y directorios. Los archivos tienen permisos base `666` (rw-rw-rw-) y los directorios `777` (rwxrwxrwx). Para archivos: `666 - 027 = 640` (rw-r-----). Para directorios seria: `777 - 027 = 750` (rwxr-x---). Con umask `027`, el propietario puede leer y escribir, el grupo solo leer, y otros no tienen ningun acceso. La opcion `a` (750) seria el resultado para directorios, no para archivos.

</details>

---

### Pregunta 3

El archivo `/usr/bin/passwd` tiene permisos `-rwsr-xr-x` y es propiedad de root. Que significa la `s` en la posicion de ejecucion del propietario?

a) El archivo solo puede ser ejecutado por root
b) El archivo tiene permisos de escritura especiales para el grupo
c) El archivo se ejecuta con los permisos del propietario (root) independientemente de quien lo ejecute
d) El archivo tiene el sticky bit activado

<details>
<summary>Respuesta</summary>

**c) El archivo se ejecuta con los permisos del propietario (root) independientemente de quien lo ejecute**

La `s` en la posicion de ejecucion del propietario indica el bit **SUID (Set User ID)**. Cuando un usuario normal ejecuta `/usr/bin/passwd`, el proceso se ejecuta con los permisos de root (propietario del archivo), permitiendole modificar `/etc/shadow` que solo root puede escribir. Sin SUID, los usuarios normales no podrian cambiar sus contrasenas. El valor octal completo de estos permisos es `4755` (4=SUID, 7=rwx, 5=r-x, 5=r-x). El sticky bit se muestra como `t` en la posicion de otros, no como `s` en la del propietario.

</details>

---

### Pregunta 4

Un administrador necesita configurar el directorio `/proyecto` para trabajo en equipo. Los archivos nuevos deben heredar el grupo `developers` y los usuarios no deben poder borrar archivos de otros. Cual es el valor octal correcto?

a) `2770`
b) `1770`
c) `3770`
d) `4770`

<details>
<summary>Respuesta</summary>

**c) `3770`**

El valor `3770` combina SGID (2) + Sticky bit (1) = 3, mas los permisos `rwxrwx---` (770). El SGID en un directorio hace que los archivos creados dentro hereden automaticamente el grupo del directorio (`developers`), en lugar del grupo primario del usuario. El Sticky bit impide que un usuario pueda borrar archivos de otros miembros, aunque tenga permiso de escritura en el directorio. Solo el propietario del archivo, el propietario del directorio o root pueden eliminar archivos. `2770` solo tiene SGID sin sticky bit. `1770` solo tiene sticky bit sin SGID. `4770` tiene SUID que no tiene efecto en directorios en Linux.

</details>

---

### Pregunta 5

Cual es la diferencia entre SGID aplicado a un archivo ejecutable y SGID aplicado a un directorio?

a) En archivos ejecuta como grupo del archivo; en directorios no tiene efecto
b) En archivos permite borrado restringido; en directorios hereda el grupo
c) En archivos ejecuta como grupo del archivo; en directorios los archivos nuevos heredan el grupo del directorio
d) No hay diferencia, el comportamiento es identico en ambos casos

<details>
<summary>Respuesta</summary>

**c) En archivos ejecuta como grupo del archivo; en directorios los archivos nuevos heredan el grupo del directorio**

SGID (Set Group ID) tiene comportamientos distintos segun donde se aplique. En un archivo ejecutable, hace que el proceso se ejecute con los permisos del grupo del archivo, no del grupo del usuario que lo ejecuta. En un directorio, hace que los archivos y subdirectorios creados dentro hereden el grupo del directorio padre, en lugar del grupo primario del usuario que los crea. SGID en directorios es fundamental para el trabajo colaborativo en equipo y es mucho mas frecuente en el examen LPIC-1. Sin SGID, los archivos creados tendrian el grupo primario del usuario, complicando el trabajo colaborativo.

</details>

---

### Pregunta 6

Un usuario ejecuta los siguientes comandos con umask `022`:
```bash
touch archivo.txt
chmod 644 archivo.txt
chmod u+x archivo.txt
chmod g+w archivo.txt
chmod o= archivo.txt
```
Cuales son los permisos finales en formato octal?

a) `644`
b) `764`
c) `760`
d) `740`

<details>
<summary>Respuesta</summary>

**c) `760`**

Paso a paso: (1) `touch` con umask 022 crea el archivo con permisos `644` (rw-r--r--). (2) `chmod 644` no cambia nada, sigue en `644` (rw-r--r--). (3) `chmod u+x` anade ejecucion al propietario: `744` (rwxr--r--). (4) `chmod g+w` anade escritura al grupo: `764` (rwxrw-r--). (5) `chmod o=` quita todos los permisos a otros: `760` (rwxrw----). El operador `=` sin permisos despues establece exactamente cero permisos. Los permisos finales son `760`.

</details>

---

### Pregunta 7

En la salida de `ls -l`, que indica una `T` mayuscula en la posicion de ejecucion de otros?

a) El archivo tiene permisos de ejecucion para todos los usuarios
b) El sticky bit esta activo y el permiso de ejecucion para otros esta activo
c) El SUID esta activo pero sin permiso de ejecucion
d) El sticky bit esta activo pero el permiso de ejecucion para otros NO esta activo

<details>
<summary>Respuesta</summary>

**d) El sticky bit esta activo pero el permiso de ejecucion para otros NO esta activo**

En `ls -l`, la mayuscula/minuscula de los indicadores de permisos especiales indica si el permiso de ejecucion subyacente esta presente. `t` minuscula = sticky bit activo + ejecucion activa para otros. `T` mayuscula = sticky bit activo pero SIN ejecucion para otros. El mismo principio aplica a SUID (`s`/`S` en posicion del propietario) y SGID (`s`/`S` en posicion del grupo). La mayuscula indica que el permiso especial esta configurado pero no tiene sentido practico completo porque falta el permiso de ejecucion subyacente.

</details>

---

### Pregunta 8

Un administrador ejecuta `umask 077` en su sesion de shell. Afecta esto a los archivos creados por otros usuarios del sistema?

a) Si, la umask se aplica globalmente a todos los usuarios del sistema
b) Si, pero solo a los usuarios del mismo grupo que el administrador
c) No, la umask es un valor por proceso/sesion y solo afecta a esa sesion
d) No, porque solo root puede establecer la umask

<details>
<summary>Respuesta</summary>

**c) No, la umask es un valor por proceso/sesion y solo afecta a esa sesion**

La umask es un atributo que pertenece a cada proceso y sesion de shell de forma independiente. Cambiar la umask en una sesion solo afecta a los archivos creados en ESA sesion especifica. Para que un cambio de umask afecte a un usuario especifico de forma persistente, se configura en `~/.bashrc` o `~/.profile`. Para afectar a todos los usuarios, se configura en `/etc/profile`, `/etc/bash.bashrc` o en `/etc/login.defs` (variable `UMASK`). Cualquier usuario puede establecer su propia umask, no solo root.

</details>

---

### Pregunta 9

Cual de los siguientes comandos cambia el propietario a `sandra` y el grupo a `developers` del directorio `/var/www` y todo su contenido de forma recursiva?

a) `chgrp -R sandra:developers /var/www`
b) `chown sandra:developers /var/www`
c) `chown -R sandra:developers /var/www`
d) `chmod -R sandra:developers /var/www`

<details>
<summary>Respuesta</summary>

**c) `chown -R sandra:developers /var/www`**

El comando `chown` cambia el propietario y el grupo de un archivo o directorio. La sintaxis `chown usuario:grupo` establece ambos en un solo comando. La opcion `-R` (recursivo) aplica el cambio a todo el contenido del directorio, incluyendo subdirectorios y archivos. La opcion `b` es correcta en sintaxis pero no es recursiva (falta `-R`). `chgrp` solo cambia el grupo, no acepta la sintaxis `usuario:grupo`. `chmod` cambia permisos, no propietarios ni grupos.

</details>

---

### Pregunta 10

Que permiso necesita un usuario en un directorio para poder acceder a los archivos que contiene y entrar con `cd`?

a) `r` (lectura)
b) `w` (escritura)
c) `x` (ejecucion)
d) `rw` (lectura y escritura)

<details>
<summary>Respuesta</summary>

**c) `x` (ejecucion)**

En directorios, el permiso `x` (ejecucion) permite acceder al directorio con `cd` y acceder a los archivos contenidos dentro. Sin `x`, no se puede entrar al directorio ni acceder a nada en su interior, aunque se tenga `r`. El permiso `r` en un directorio permite listar su contenido (con `ls`), pero sin `x` no se puede acceder a los archivos listados. El permiso `w` permite crear, eliminar y renombrar archivos dentro del directorio. Para acceder a un archivo, se necesita permiso `x` en TODOS los directorios de la ruta completa. Esta distincion de permisos en directorios es un tema frecuente en el examen LPIC-1.

</details>
