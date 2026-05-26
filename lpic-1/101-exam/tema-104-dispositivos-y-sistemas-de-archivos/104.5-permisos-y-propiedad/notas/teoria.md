# 104.5 Gestionar permisos y propiedad de archivos - Teoria

## 1. Modelo de permisos en Linux

Cada archivo y directorio en Linux tiene tres niveles de acceso y tres tipos de permisos.

### 1.1 Niveles de acceso (quien)

| Nivel | Letra | Descripcion |
|-------|-------|-------------|
| **Usuario** (propietario) | `u` | El dueno del archivo |
| **Grupo** | `g` | El grupo asignado al archivo |
| **Otros** | `o` | Todos los demas usuarios |
| **Todos** | `a` | u + g + o (all) |

### 1.2 Tipos de permisos (que)

| Permiso | Letra | Valor octal | En archivos | En directorios |
|---------|-------|-------------|-------------|----------------|
| **Lectura** | `r` | `4` | Leer contenido | Listar contenido (`ls`) |
| **Escritura** | `w` | `2` | Modificar contenido | Crear/eliminar archivos dentro |
| **Ejecucion** | `x` | `1` | Ejecutar como programa | Acceder/entrar al directorio (`cd`) |

### 1.3 Leer permisos con ls -l

```bash
ls -l archivo.txt
-rwxr-xr-- 1 sandra developers 4096 Jan 15 10:30 archivo.txt
```

Desglose:
```
-  rwx  r-x  r--
|  |    |    |
|  |    |    +-- Otros: lectura
|  |    +------- Grupo: lectura + ejecucion
|  +------------ Usuario: lectura + escritura + ejecucion
+--------------- Tipo: - (archivo regular)
```

**Tipos de archivo (primer caracter):**

| Caracter | Tipo |
|----------|------|
| `-` | Archivo regular |
| `d` | Directorio |
| `l` | Enlace simbolico |
| `b` | Dispositivo de bloque |
| `c` | Dispositivo de caracter |
| `p` | Pipe (FIFO) |
| `s` | Socket |

---

## 2. Notacion octal de permisos

Cada permiso tiene un valor numerico y se suman para formar el valor total de cada nivel:

| Permiso | Valor |
|---------|-------|
| `r` (lectura) | 4 |
| `w` (escritura) | 2 |
| `x` (ejecucion) | 1 |
| `-` (sin permiso) | 0 |

**Combinaciones comunes:**

| Octal | Permisos | Descripcion |
|-------|----------|-------------|
| `7` | `rwx` | Todos los permisos |
| `6` | `rw-` | Lectura y escritura |
| `5` | `r-x` | Lectura y ejecucion |
| `4` | `r--` | Solo lectura |
| `3` | `-wx` | Escritura y ejecucion |
| `2` | `-w-` | Solo escritura |
| `1` | `--x` | Solo ejecucion |
| `0` | `---` | Sin permisos |

**Valores comunes de 3 digitos:**

| Octal | Simbolico | Uso tipico |
|-------|-----------|------------|
| `777` | `rwxrwxrwx` | Todos los permisos para todos (inseguro) |
| `755` | `rwxr-xr-x` | Directorios, scripts ejecutables |
| `750` | `rwxr-x---` | Directorios privados de grupo |
| `700` | `rwx------` | Solo el propietario |
| `644` | `rw-r--r--` | Archivos regulares (default tipico) |
| `640` | `rw-r-----` | Archivos legibles por grupo |
| `600` | `rw-------` | Archivos privados (ej: claves SSH) |
| `555` | `r-xr-xr-x` | Solo lectura y ejecucion para todos |
| `444` | `r--r--r--` | Solo lectura para todos |

---

## 3. chmod - Cambiar permisos

### 3.1 Modo simbolico

```bash
chmod [quien][operador][permisos] archivo
```

**Operadores:**
- `+` : Anadir permiso
- `-` : Quitar permiso
- `=` : Establecer exactamente (sobreescribe)

```bash
# Anadir ejecucion al propietario
chmod u+x script.sh

# Quitar escritura al grupo y otros
chmod go-w archivo.txt

# Establecer permisos exactos para el propietario
chmod u=rwx archivo.txt

# Anadir lectura y ejecucion a todos
chmod a+rx script.sh

# Quitar todos los permisos a otros
chmod o= archivo.txt

# Multiples cambios separados por coma
chmod u+x,g=rx,o-w archivo.txt

# Recursivo (aplicar a directorio y todo su contenido)
chmod -R 755 /var/www
```

### 3.2 Modo numerico (octal)

```bash
# rwxr-xr-x
chmod 755 script.sh

# rw-r--r--
chmod 644 documento.txt

# rw-------
chmod 600 clave_privada

# rwx------
chmod 700 directorio_privado/

# Recursivo
chmod -R 644 /var/www/html/
```

### 3.3 Diferencia de permisos en archivos vs directorios

| Permiso | En archivo | En directorio |
|---------|-----------|---------------|
| `r` | Leer el contenido del archivo | Listar archivos dentro (`ls`) |
| `w` | Modificar el contenido | Crear/eliminar/renombrar archivos dentro |
| `x` | Ejecutar el archivo | Entrar al directorio (`cd`), acceder a archivos dentro |

> **Clave:** Para acceder a un archivo dentro de un directorio, necesitas permiso `x` en TODOS los directorios de la ruta. Sin `x` en un directorio, no puedes acceder a nada dentro de el, aunque tengas `r`.

---

## 4. chown y chgrp - Cambiar propietario y grupo

### 4.1 chown

```bash
# Cambiar propietario
chown sandra archivo.txt

# Cambiar propietario y grupo
chown sandra:developers archivo.txt
chown sandra.developers archivo.txt  # Tambien funciona con punto

# Cambiar solo el grupo (con :)
chown :developers archivo.txt

# Recursivo
chown -R sandra:developers /var/www/

# Cambiar propietario referenciando otro archivo
chown --reference=otro_archivo archivo.txt
```

### 4.2 chgrp

```bash
# Cambiar grupo
chgrp developers archivo.txt

# Recursivo
chgrp -R developers /proyecto/
```

> **Nota:** Un usuario normal solo puede cambiar el grupo a grupos a los que pertenece. Solo root puede cambiar el propietario o asignar cualquier grupo.

---

## 5. umask - Mascara de creacion de archivos

### 5.1 Concepto

`umask` define que permisos se **quitan** al crear archivos y directorios nuevos.

**Permisos base:**
- Archivos: `666` (rw-rw-rw-)
- Directorios: `777` (rwxrwxrwx)

**Calculo:** `Permisos resultantes = Permisos base - umask`

> **Atencion:** No es una resta aritmetica simple. Es una operacion de bits (AND NOT). Pero para valores comunes, funciona como resta.

### 5.2 Ejemplos de calculo

| umask | Archivos (666 - umask) | Directorios (777 - umask) |
|-------|----------------------|--------------------------|
| `0022` | `644` (rw-r--r--) | `755` (rwxr-xr-x) |
| `0002` | `664` (rw-rw-r--) | `775` (rwxrwxr-x) |
| `0077` | `600` (rw-------) | `700` (rwx------) |
| `0027` | `640` (rw-r-----) | `750` (rwxr-x---) |
| `0000` | `666` (rw-rw-rw-) | `777` (rwxrwxrwx) |
| `0066` | `600` (rw-------) | `711` (rwx--x--x) |
| `0037` | `640` (rw-r-----) | `740` (rwxr-----) |

### 5.3 Comandos

```bash
# Ver umask actual (numerico)
umask

# Ver umask actual (simbolico)
umask -S

# Establecer umask
umask 0022
umask 022    # El 0 inicial es opcional

# Establecer umask en formato simbolico
umask u=rwx,g=rx,o=rx
```

### 5.4 Donde configurar umask de forma persistente

- Para un usuario: `~/.bashrc` o `~/.profile`
- Para todos los usuarios: `/etc/profile` o `/etc/login.defs` (variable `UMASK`)
- Para PAM: `/etc/pam.d/common-session`

> **Truco para el examen:** Si la umask es `022`, los archivos nuevos tendran `644` y los directorios `755`. Esta es la umask mas comun por defecto.

---

## 6. Permisos especiales: SUID, SGID y Sticky Bit

### 6.1 SUID (Set User ID) - 4000

Cuando se establece en un **archivo ejecutable**, el proceso se ejecuta con los permisos del **propietario del archivo**, no del usuario que lo ejecuta.

```bash
# Establecer SUID
chmod u+s archivo
chmod 4755 archivo

# Ver SUID (s en la posicion del usuario)
ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root ... /usr/bin/passwd
```

**Ejemplo clasico:** `/usr/bin/passwd` tiene SUID de root. Esto permite a usuarios normales cambiar su contrasena (que requiere escribir en `/etc/shadow`, propiedad de root).

> **Si el propietario NO tiene permiso de ejecucion**, la `s` aparece como `S` mayuscula (SUID sin efecto real).

**SUID en directorios:** No tiene efecto en la mayoria de sistemas Linux.

### 6.2 SGID (Set Group ID) - 2000

#### SGID en archivos ejecutables
El proceso se ejecuta con los permisos del **grupo del archivo**.

```bash
chmod g+s archivo
chmod 2755 archivo

# Ver SGID (s en la posicion del grupo)
ls -l archivo
-rwxr-sr-x 1 root staff ... archivo
```

#### SGID en directorios (MUY IMPORTANTE)
Cuando SGID se establece en un **directorio**, los archivos y subdirectorios creados dentro **heredan el grupo del directorio**, no el grupo primario del usuario que los crea.

```bash
# Crear directorio compartido
mkdir /proyecto
chown root:developers /proyecto
chmod 2775 /proyecto

# Ahora, cualquier archivo creado dentro tendra grupo "developers"
# independientemente del grupo primario del usuario
touch /proyecto/nuevo.txt
ls -l /proyecto/nuevo.txt
# -rw-rw-r-- 1 sandra developers ... nuevo.txt
```

> **Clave para el examen:** SGID en directorios es fundamental para trabajo en grupo. Asegura que todos los archivos creados dentro pertenezcan al grupo del directorio.

### 6.3 Sticky Bit - 1000

Cuando se establece en un **directorio**, solo el **propietario del archivo**, el **propietario del directorio** o **root** pueden eliminar o renombrar archivos dentro, aunque otros tengan permiso de escritura en el directorio.

```bash
# Establecer sticky bit
chmod +t directorio/
chmod 1777 directorio/

# Ver sticky bit (t en la posicion de ejecucion de otros)
ls -ld /tmp
drwxrwxrwt 15 root root ... /tmp
```

**Ejemplo clasico:** `/tmp` tiene sticky bit. Todos pueden escribir, pero nadie puede borrar archivos de otro usuario.

> **Si otros NO tienen permiso de ejecucion**, la `t` aparece como `T` mayuscula.

### 6.4 Notacion octal de permisos especiales

Se antepone un cuarto digito:

| Digito | Permiso especial |
|--------|-----------------|
| `4` | SUID |
| `2` | SGID |
| `1` | Sticky bit |
| `0` | Ninguno |

```bash
# SUID + rwxr-xr-x
chmod 4755 archivo

# SGID + rwxrwxr-x
chmod 2775 directorio/

# Sticky + rwxrwxrwx
chmod 1777 /tmp

# SUID + SGID + rwxr-xr-x
chmod 6755 archivo
```

### 6.5 Tabla resumen de permisos especiales

| Permiso | Valor | Simbolico | En archivos | En directorios |
|---------|-------|-----------|-------------|----------------|
| **SUID** | `4000` | `u+s` | Ejecutar como propietario | Sin efecto |
| **SGID** | `2000` | `g+s` | Ejecutar como grupo | Archivos nuevos heredan grupo del dir |
| **Sticky** | `1000` | `+t` | Sin efecto | Solo propietario/root puede borrar |

### 6.6 Indicadores visuales en ls -l

| Indicador | Posicion | Significado |
|-----------|----------|-------------|
| `s` (minuscula) | Usuario (x) | SUID activo + ejecucion activa |
| `S` (mayuscula) | Usuario (x) | SUID activo + ejecucion NO activa |
| `s` (minuscula) | Grupo (x) | SGID activo + ejecucion activa |
| `S` (mayuscula) | Grupo (x) | SGID activo + ejecucion NO activa |
| `t` (minuscula) | Otros (x) | Sticky bit + ejecucion activa |
| `T` (mayuscula) | Otros (x) | Sticky bit + ejecucion NO activa |

---

## 7. Puntos clave para el examen

1. **Permisos en directorios:** `r` = listar, `w` = crear/eliminar, `x` = acceder/entrar.

2. **chmod** soporta modo simbolico (`u+x`) y numerico (`755`).

3. **chown user:group** cambia propietario y grupo. Solo root puede cambiar propietario.

4. **umask 022** produce archivos `644` y directorios `755`.

5. **SUID (4000, u+s):** El ejecutable corre como su propietario. Ejemplo: `/usr/bin/passwd`.

6. **SGID en directorios (2000, g+s):** Los archivos nuevos heredan el grupo del directorio. Esencial para directorios compartidos.

7. **Sticky bit (1000, +t):** Solo el propietario puede borrar sus archivos. Ejemplo: `/tmp`.

8. **`s` minuscula** = permiso especial + ejecucion. **`S` mayuscula** = permiso especial pero SIN ejecucion.

9. Los permisos base para umask son `666` (archivos) y `777` (directorios).

10. **SGID en archivo vs directorio:** En archivo, ejecuta con permisos del grupo. En directorio, hereda el grupo.
