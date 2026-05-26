# 102.3 - Gestion de bibliotecas compartidas: Teoria

## Introduccion

Las bibliotecas compartidas (shared libraries) son archivos que contienen codigo compilado reutilizable por multiples programas. En lugar de incluir todo el codigo necesario dentro de cada ejecutable (enlace estatico), los programas pueden cargar las funciones que necesitan desde bibliotecas compartidas en tiempo de ejecucion (enlace dinamico). Esto ahorra espacio en disco y memoria RAM, y facilita las actualizaciones.

---

## 1. Tipos de bibliotecas

### Bibliotecas estaticas (.a)

- Se enlazan en tiempo de compilacion
- El codigo se copia dentro del ejecutable
- El ejecutable resultante es mas grande pero independiente
- Extension: `.a` (archive)
- Ejemplo: `libm.a`

### Bibliotecas compartidas (.so)

- Se enlazan en tiempo de ejecucion (carga dinamica)
- Multiples programas comparten una sola copia en memoria
- El ejecutable es mas pequeno
- Extension: `.so` (shared object)
- Ejemplo: `libm.so`

### Ventajas de las bibliotecas compartidas

| Ventaja | Descripcion |
|---------|-------------|
| Ahorro de espacio | Una sola copia en disco para todos los programas |
| Ahorro de memoria | Se comparte en RAM entre procesos |
| Actualizacion facil | Actualizar la biblioteca actualiza todos los programas que la usan |
| Ejecutables pequenos | El codigo no se duplica dentro de cada ejecutable |

---

## 2. Convencion de nombres

Las bibliotecas compartidas siguen una convencion de nombres estricta:

```
libNOMBRE.so.MAYOR.MENOR.REVISION
```

Ejemplo:
```
libreadline.so.8.1.2
```

| Componente | Significado | Ejemplo |
|-----------|-------------|---------|
| `lib` | Prefijo estandar | `lib` |
| `NOMBRE` | Nombre de la biblioteca | `readline` |
| `.so` | Shared Object | `.so` |
| `MAYOR` | Version mayor (cambios incompatibles) | `8` |
| `MENOR` | Version menor (nuevas funcionalidades compatibles) | `1` |
| `REVISION` | Correccion de errores | `2` |

### Cadena de enlaces simbolicos (soname)

Para facilitar la gestion de versiones, se usan enlaces simbolicos que forman una cadena. El **soname** (shared object name) es el nombre canonico que los programas enlazados dinamicamente buscan al cargarse:

```
libreadline.so -> libreadline.so.8        (enlace de desarrollo)
libreadline.so.8 -> libreadline.so.8.1.2  (enlace soname)
libreadline.so.8.1.2                       (archivo real)
```

**Otro ejemplo con libfuse:**
```
libfuse.so -> libfuse.so.2                (enlace de desarrollo)
libfuse.so.2 -> libfuse.so.2.9.7         (enlace soname)
libfuse.so.2.9.7                           (archivo real)
```

| Tipo de enlace | Ejemplo | Proposito | Quien lo usa |
|----------------|---------|-----------|-------------|
| **Enlace de desarrollo** | `libfuse.so` | Apunta al soname. Usado durante la **compilacion** | El compilador (`gcc -lfuse`) |
| **Enlace soname** | `libfuse.so.2` | Apunta al archivo real. Es el nombre que **buscan los programas** al ejecutarse | El cargador dinamico (`ld-linux.so`) |
| **Archivo real** | `libfuse.so.2.9.7` | Contiene el codigo compilado de la biblioteca | N/A (referenciado por los enlaces) |

El comando `ldconfig` se encarga de **crear y mantener** los enlaces soname automaticamente.

> **Para el examen:** El soname solo incluye la version mayor (ej: `libfuse.so.2`). Esto permite actualizar la version menor y revision sin romper la compatibilidad con los programas que dependen de la biblioteca.

---

## 3. Ubicacion de las bibliotecas

### Directorios estandar

| Directorio | Descripcion |
|-----------|-------------|
| `/lib` | Bibliotecas esenciales del sistema (enlace a /usr/lib en sistemas modernos) |
| `/lib64` | Bibliotecas de 64 bits en sistemas multilib |
| `/usr/lib` | Bibliotecas de programas instalados por el sistema |
| `/usr/lib64` | Bibliotecas de 64 bits de /usr |
| `/usr/local/lib` | Bibliotecas compiladas localmente |

En distribuciones modernas (con UsrMerge), `/lib` es un enlace simbolico a `/usr/lib`.

---

## 4. ldd - Listar dependencias de bibliotecas

El comando `ldd` muestra las bibliotecas compartidas que necesita un programa ejecutable.

### Uso basico

```bash
ldd /bin/ls
```

Salida tipica:
```
linux-vdso.so.1 (0x00007ffd3e5f7000)
libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1 (0x00007f3e2a4c0000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f3e2a2d0000)
/lib64/ld-linux-x86-64.so.2 (0x00007f3e2a520000)
```

### Interpretar la salida

| Elemento | Significado |
|----------|-------------|
| `libselinux.so.1` | Nombre de la biblioteca requerida (soname) |
| `=> /lib/.../libselinux.so.1` | Ruta donde se encontro la biblioteca |
| `(0x00007f...)` | Direccion de memoria donde se cargara |
| `linux-vdso.so.1` | Biblioteca virtual del kernel (no existe como archivo) |
| `/lib64/ld-linux-x86-64.so.2` | El cargador dinamico (dynamic linker) |
| `not found` | La biblioteca no se encontro (error) |

### Opciones de ldd

```bash
ldd -v /bin/ls    # Modo verbose (muestra informacion de version)
ldd -u /bin/ls    # Muestra dependencias no usadas (unused)
```

**Nota de seguridad**: No ejecutar `ldd` sobre ejecutables desconocidos o no confiables, ya que ldd puede ejecutar codigo del ejecutable. En su lugar, usar:

```bash
objdump -p /ruta/ejecutable | grep NEEDED
readelf -d /ruta/ejecutable | grep NEEDED
```

---

## 5. ldconfig - Gestionar la cache de bibliotecas

### Que hace ldconfig

`ldconfig` cumple dos funciones principales:

1. **Actualiza la cache** de bibliotecas (`/etc/ld.so.cache`)
2. **Crea los enlaces simbolicos** (soname) necesarios para las bibliotecas

### Cache de bibliotecas: /etc/ld.so.cache

- Archivo binario que contiene una lista indexada de todas las bibliotecas compartidas disponibles y sus rutas
- El cargador dinamico (`ld-linux.so`) consulta esta cache para encontrar rapidamente las bibliotecas
- Se regenera con `ldconfig`

### Uso de ldconfig

```bash
# Actualizar la cache (requiere root)
sudo ldconfig

# Mostrar las bibliotecas en la cache (print cache)
ldconfig -p
# Salida: muestra cada biblioteca con su soname, tipo (libc6, x86-64) y ruta completa
# Ejemplo:
#   libz.so.1 (libc6,x86-64) => /lib/x86_64-linux-gnu/libz.so.1
#   libfuse.so.2 (libc6,x86-64) => /lib/x86_64-linux-gnu/libfuse.so.2

# Filtrar una biblioteca especifica en la cache
ldconfig -p | grep libssl

# Modo verbose: muestra los directorios procesados y los enlaces creados
sudo ldconfig -v
# Salida: lista cada directorio escaneado y las bibliotecas encontradas
# Ejemplo:
#   /lib/x86_64-linux-gnu:
#       libz.so.1 -> libz.so.1.2.11
#       libfuse.so.2 -> libfuse.so.2.9.7

# Solo mostrar sin actualizar (dry-run)
ldconfig -N

# Procesar solo un directorio especifico
sudo ldconfig /opt/miapp/lib
```

> **Para el examen:** `ldconfig -p` muestra el contenido de la cache (util para verificar si una biblioteca esta registrada). `ldconfig -v` muestra el proceso de escaneo con detalle (util para depurar problemas de bibliotecas).

### Cuando ejecutar ldconfig

- Despues de instalar nuevas bibliotecas manualmente
- Despues de modificar `/etc/ld.so.conf` o archivos en `/etc/ld.so.conf.d/`
- Normalmente los gestores de paquetes (apt, yum) lo ejecutan automaticamente

---

## 6. Configuracion de rutas de bibliotecas

### /etc/ld.so.conf

Archivo de configuracion que lista directorios adicionales donde buscar bibliotecas compartidas.

```bash
cat /etc/ld.so.conf
```

Contenido tipico:
```
include /etc/ld.so.conf.d/*.conf
```

### /etc/ld.so.conf.d/

Directorio que contiene archivos `.conf` individuales con rutas de bibliotecas. Cada archivo contiene una o mas rutas.

```bash
ls /etc/ld.so.conf.d/
```

Ejemplo de contenido de un archivo:
```
# /etc/ld.so.conf.d/cuda.conf
/usr/local/cuda/lib64
```

### Anadir un nuevo directorio de bibliotecas

```bash
# 1. Crear archivo de configuracion
echo "/opt/miapp/lib" | sudo tee /etc/ld.so.conf.d/miapp.conf

# 2. Actualizar la cache
sudo ldconfig

# 3. Verificar
ldconfig -p | grep miapp
```

---

## 7. LD_LIBRARY_PATH

Variable de entorno que permite especificar directorios adicionales donde buscar bibliotecas **sin necesidad de ser root** ni modificar archivos del sistema.

### Uso detallado

```bash
# Establecer temporalmente (solo en la sesion actual)
export LD_LIBRARY_PATH=/opt/miapp/lib:/opt/otra/lib

# Ejecutar un programa con una ruta de biblioteca especifica (solo para ese comando)
LD_LIBRARY_PATH=/opt/miapp/lib ./mi_programa

# Anadir a la ruta existente (sin perder las rutas previas)
export LD_LIBRARY_PATH=/opt/miapp/lib:$LD_LIBRARY_PATH

# Eliminar la variable (deshacer la configuracion)
unset LD_LIBRARY_PATH

# Verificar el valor actual de la variable
echo $LD_LIBRARY_PATH

# Ejemplo completo: compilar y ejecutar con una biblioteca personalizada
export LD_LIBRARY_PATH=/opt/miapp/lib
./mi_programa
unset LD_LIBRARY_PATH    # Limpiar despues de usar
```

### Orden de busqueda de bibliotecas

El cargador dinamico busca las bibliotecas en este orden:

1. **Rutas incrustadas en el ejecutable** (RPATH / RUNPATH)
2. **LD_LIBRARY_PATH** (variable de entorno)
3. **Cache** (`/etc/ld.so.cache`, generada por ldconfig)
4. **Directorios por defecto** (`/lib`, `/usr/lib`)

### Precauciones con LD_LIBRARY_PATH

- **No se recomienda** para configuraciones permanentes a nivel de sistema
- Puede causar conflictos de versiones
- Por razones de seguridad, es ignorada por programas con bit SUID/SGID
- Para uso permanente, es mejor usar `/etc/ld.so.conf.d/`

---

## 8. El cargador dinamico (Dynamic Linker)

El programa `/lib64/ld-linux-x86-64.so.2` (en 64 bits) o `/lib/ld-linux.so.2` (en 32 bits) es el responsable de:

1. Leer las dependencias del ejecutable (seccion NEEDED del ELF)
2. Localizar las bibliotecas compartidas necesarias
3. Cargarlas en memoria
4. Resolver los simbolos (funciones y variables)

Se puede invocar directamente:

```bash
/lib64/ld-linux-x86-64.so.2 --list /bin/ls    # Equivalente a ldd
```

---

## Resumen para el examen

1. **ldd** muestra las dependencias de bibliotecas de un ejecutable.
2. **ldconfig** actualiza la cache `/etc/ld.so.cache` y crea enlaces simbolicos.
3. **`/etc/ld.so.conf`** y **`/etc/ld.so.conf.d/`** definen rutas de busqueda de bibliotecas.
4. **LD_LIBRARY_PATH** permite anadir rutas temporalmente (sin ser root).
5. Orden de busqueda: RPATH -> LD_LIBRARY_PATH -> cache (ld.so.cache) -> directorios por defecto.
6. Convencion de nombres: `libNOMBRE.so.MAYOR.MENOR.REVISION`.
7. Siempre ejecutar `ldconfig` despues de instalar bibliotecas manualmente o modificar ld.so.conf.
