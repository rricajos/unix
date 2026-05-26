# 102.3 - Gestion de bibliotecas compartidas: Ejercicios

## Ejercicio 1
**Que comando usarias para ver las bibliotecas compartidas que necesita el programa `/usr/bin/ssh`? Que significa si en la salida aparece "not found" junto a una biblioteca?**

<details>
<summary>Ver respuesta</summary>

Se usa el comando `ldd`:

```bash
ldd /usr/bin/ssh
```

Si aparece **"not found"** junto a una biblioteca, significa que el sistema no puede encontrar esa biblioteca compartida en ninguno de los directorios de busqueda. El programa no podra ejecutarse hasta que se instale la biblioteca faltante o se configure correctamente la ruta donde se encuentra.

Para resolver el problema, se puede:
1. Instalar el paquete que proporciona la biblioteca.
2. Si la biblioteca existe en un directorio no estandar, agregar ese directorio a `/etc/ld.so.conf.d/` y ejecutar `ldconfig`.
3. Temporalmente, usar `LD_LIBRARY_PATH` para indicar la ruta.
</details>

---

## Ejercicio 2
**Explica la diferencia entre `/etc/ld.so.conf` y `/etc/ld.so.cache`. Que comando conecta ambos archivos?**

<details>
<summary>Ver respuesta</summary>

- **`/etc/ld.so.conf`**: Archivo de texto que lista los directorios adicionales donde el sistema debe buscar bibliotecas compartidas. Normalmente contiene la linea `include /etc/ld.so.conf.d/*.conf` para incluir archivos de configuracion individuales.

- **`/etc/ld.so.cache`**: Archivo **binario** que contiene una lista indexada (cache) de todas las bibliotecas compartidas disponibles y sus rutas completas. El cargador dinamico consulta este archivo para localizar rapidamente las bibliotecas.

El comando que conecta ambos es **`ldconfig`**. Al ejecutar `ldconfig`, este lee los directorios listados en `/etc/ld.so.conf` (y `/etc/ld.so.conf.d/`), escanea las bibliotecas en esos directorios, y genera (actualiza) el archivo binario `/etc/ld.so.cache`.
</details>

---

## Ejercicio 3
**Has compilado una aplicacion que instala sus bibliotecas en `/opt/miapp/lib`. Como harias para que el sistema las encuentre de forma permanente?**

<details>
<summary>Ver respuesta</summary>

Para que el sistema encuentre las bibliotecas de forma permanente:

```bash
# 1. Crear un archivo de configuracion en /etc/ld.so.conf.d/
echo "/opt/miapp/lib" | sudo tee /etc/ld.so.conf.d/miapp.conf

# 2. Actualizar la cache de bibliotecas
sudo ldconfig

# 3. Verificar que las bibliotecas se encuentran
ldconfig -p | grep miapp
```

**No se debe** usar `LD_LIBRARY_PATH` para esto porque:
- Es una solucion temporal (solo dura mientras la variable este definida)
- No es segura para programas con SUID/SGID
- Puede causar conflictos de versiones
</details>

---

## Ejercicio 4
**Que es la variable LD_LIBRARY_PATH? En que situaciones es util y cuales son sus limitaciones?**

<details>
<summary>Ver respuesta</summary>

**LD_LIBRARY_PATH** es una variable de entorno que especifica directorios adicionales donde el cargador dinamico buscara bibliotecas compartidas, antes de consultar la cache y los directorios por defecto.

**Situaciones utiles:**
- Desarrollo y pruebas: probar una version nueva de una biblioteca sin instalarla en el sistema
- Ejecucion de programas sin permisos de root
- Uso temporal para aplicaciones que instalan bibliotecas en ubicaciones no estandar

**Limitaciones:**
1. Es **temporal**: solo afecta a la sesion actual o al comando en el que se define
2. Es **ignorada por programas SUID/SGID** (por seguridad)
3. Puede causar **conflictos** si hay versiones diferentes de la misma biblioteca
4. **No se recomienda** para configuraciones permanentes de produccion
5. Afecta a todos los programas ejecutados en esa sesion, no solo al que nos interesa

**Ejemplo de uso:**
```bash
export LD_LIBRARY_PATH=/opt/miapp/lib:$LD_LIBRARY_PATH
./mi_programa
```
</details>

---

## Ejercicio 5
**Describe el orden completo en que el cargador dinamico busca las bibliotecas compartidas.**

<details>
<summary>Ver respuesta</summary>

El cargador dinamico (`ld-linux.so`) busca las bibliotecas en este orden:

1. **RPATH/RUNPATH**: Rutas incrustadas dentro del propio ejecutable durante la compilacion (definidas con `-rpath`). Se almacenan en la cabecera ELF del binario.

2. **LD_LIBRARY_PATH**: Directorios especificados en esta variable de entorno. Tiene prioridad sobre la cache pero no sobre RPATH.

3. **`/etc/ld.so.cache`**: Cache binaria generada por `ldconfig`. Contiene una lista indexada de bibliotecas encontradas en los directorios configurados en `/etc/ld.so.conf` y `/etc/ld.so.conf.d/`.

4. **Directorios por defecto**: `/lib` (o `/lib64`) y `/usr/lib` (o `/usr/lib64`). Son los directorios de ultimo recurso.

Si la biblioteca no se encuentra en ninguno de estos pasos, el programa fallara al ejecutarse con un error como: "error while loading shared libraries: libXXX.so: cannot open shared object file".
</details>

---

## Ejercicio 6
**Dado el archivo de biblioteca `libcrypto.so.1.1.0`, explica cada parte del nombre segun la convencion de nombrado de bibliotecas compartidas en Linux. Que enlaces simbolicos esperarias encontrar?**

<details>
<summary>Ver respuesta</summary>

Desglose del nombre `libcrypto.so.1.1.0`:

| Parte | Valor | Significado |
|-------|-------|-------------|
| `lib` | `lib` | Prefijo estandar de todas las bibliotecas |
| `crypto` | `crypto` | Nombre de la biblioteca |
| `.so` | `.so` | Indica que es un Shared Object (biblioteca compartida) |
| `.1` | `1` | Version **mayor** - cambios incompatibles con versiones anteriores |
| `.1` | `1` | Version **menor** - nuevas funcionalidades compatibles |
| `.0` | `0` | **Revision** - correcciones de errores |

**Enlaces simbolicos esperados:**

```
libcrypto.so -> libcrypto.so.1.1.0      (enlace de desarrollo, usado por el compilador)
libcrypto.so.1 -> libcrypto.so.1.1.0    (soname, usado por los programas en ejecucion)
libcrypto.so.1.1.0                       (archivo real con el codigo)
```

El enlace `libcrypto.so.1` (soname) es el que buscan los programas compilados contra esta biblioteca. `ldconfig` se encarga de crear y mantener estos enlaces automaticamente.
</details>

---

## Ejercicio 7
**Despues de instalar manualmente una biblioteca en `/usr/local/lib`, un programa sigue dando error "cannot open shared object file". Que pasos debes seguir para solucionarlo? Escribe los comandos.**

<details>
<summary>Ver respuesta</summary>

El problema es que la cache de bibliotecas no esta actualizada. Pasos:

```bash
# 1. Verificar que la biblioteca existe en el directorio
ls -la /usr/local/lib/libNOMBRE.so*

# 2. Verificar si /usr/local/lib esta en la configuracion
cat /etc/ld.so.conf
ls /etc/ld.so.conf.d/

# 3. Si /usr/local/lib no esta configurado, aniadirlo
echo "/usr/local/lib" | sudo tee /etc/ld.so.conf.d/local.conf

# 4. Actualizar la cache de bibliotecas
sudo ldconfig

# 5. Verificar que la biblioteca ahora aparece en la cache
ldconfig -p | grep libNOMBRE

# 6. Verificar las dependencias del programa
ldd /ruta/del/programa
```

Si el paso 3 no fuera necesario (porque `/usr/local/lib` ya estaba configurado), basta con ejecutar `sudo ldconfig` para regenerar la cache.
</details>

---

## Ejercicio 8
**Cual es la diferencia entre una biblioteca estatica (.a) y una biblioteca compartida (.so)? Da una ventaja y una desventaja de cada una.**

<details>
<summary>Ver respuesta</summary>

| Aspecto | Estatica (.a) | Compartida (.so) |
|---------|--------------|-------------------|
| **Enlace** | En tiempo de compilacion | En tiempo de ejecucion |
| **Codigo** | Se copia dentro del ejecutable | Se carga desde el archivo .so |
| **Tamano del ejecutable** | Mayor | Menor |
| **Dependencia externa** | Ninguna (independiente) | Requiere que la .so exista en el sistema |
| **Uso de memoria** | Cada proceso tiene su copia | Compartida entre procesos |

**Ventaja de la estatica**: El ejecutable es **autonomo** y no depende de bibliotecas externas. Se puede copiar a otro sistema sin preocuparse por las dependencias.

**Desventaja de la estatica**: Ejecutables **mas grandes** y si se corrige un bug en la biblioteca, hay que **recompilar** todos los programas que la usan.

**Ventaja de la compartida**: **Ahorro de espacio** en disco y memoria. Actualizar la biblioteca actualiza automaticamente todos los programas que la usan.

**Desventaja de la compartida**: Si la biblioteca se elimina, se corrompe o cambia de version incompatiblemente, los programas que dependen de ella **dejaran de funcionar**.
</details>
