---
title: "200.2 - Prediccion de necesidades"
tags: [lpic-2, examen-201, tema-200, ejercicios]
tipo: ejercicios
certificacion: lpic-2
examen: "201"
tema: "200"
subtema: "200.2"
---

# 200.2 - Ejercicios de practica

## Preguntas tipo examen

### Pregunta 1

Un servidor tiene una particion `/data` de 500 GB. En los ultimos 4 meses, el uso ha crecido de 200 GB a 320 GB. Suponiendo un crecimiento lineal, ¿en cuantos meses aproximadamente se llenara la particion al 80%?

a) 2 meses
b) 3 meses
c) 6 meses
d) 10 meses

<details>
<summary>Respuesta</summary>

**b) 3 meses**

Crecimiento mensual: (320 - 200) / 4 = 30 GB/mes. El umbral del 80% es 400 GB. Espacio hasta el umbral: 400 - 320 = 80 GB. Meses restantes: 80 / 30 = 2.67, es decir aproximadamente 3 meses.
</details>

---

### Pregunta 2

¿Que comando permite exportar datos historicos de `sar` en formato CSV para su posterior analisis en una hoja de calculo?

a) `sar -u --csv`
b) `sar -u --export=csv`
c) `sadf -d /var/log/sysstat/sa15 -- -u`
d) `sarexport -f csv /var/log/sysstat/sa15`

<details>
<summary>Respuesta</summary>

**c) `sadf -d /var/log/sysstat/sa15 -- -u`**

`sadf` (System Activity Data Formatter) es la herramienta complementaria de `sar` que permite exportar los datos a diferentes formatos. La opcion `-d` genera salida en formato CSV separado por punto y coma. El doble guion `--` separa las opciones de `sadf` de las opciones que se pasan a `sar` (en este caso `-u` para CPU).
</details>

---

### Pregunta 3

¿Cual de los siguientes NO es un factor que debe considerarse al predecir las necesidades futuras de recursos de un servidor?

a) El crecimiento esperado del numero de usuarios
b) El color del chasis del servidor
c) Los planes de despliegue de nuevas aplicaciones
d) Las politicas de retencion de datos y logs

<details>
<summary>Respuesta</summary>

**b) El color del chasis del servidor**

La planificacion de capacidad debe considerar factores como el crecimiento de usuarios, nuevas aplicaciones, politicas de retencion, estacionalidad del negocio, regulaciones y cambios tecnologicos. Las caracteristicas fisicas esteticas del hardware no tienen ninguna relevancia en la planificacion de capacidad.
</details>

---

### Pregunta 4

Un administrador observa que el load average de un servidor de 4 nucleos ha pasado de un promedio de 1.5 hace tres meses a 2.8 actualmente. Si la tendencia continua, ¿cual es la mejor accion proactiva?

a) No hacer nada, ya que el load average esta por debajo del numero de nucleos
b) Planificar una ampliacion de CPU o redistribucion de carga para los proximos meses
c) Reiniciar el servidor inmediatamente
d) Eliminar todos los procesos de usuario

<details>
<summary>Respuesta</summary>

**b) Planificar una ampliacion de CPU o redistribucion de carga para los proximos meses**

Aunque el load average actual (2.8) esta por debajo de los 4 nucleos, la tendencia creciente indica que en pocos meses podria superar la capacidad. La planificacion de capacidad consiste precisamente en actuar antes de que los problemas se manifiesten. Esperar a que el sistema se sature implicaria downtime no planificado.
</details>

---

### Pregunta 5

¿Que herramienta almacena datos en formato RRD (Round Robin Database) y se usa comumente para generar graficos de tendencias a largo plazo?

a) sar
b) vmstat
c) collectd
d) top

<details>
<summary>Respuesta</summary>

**c) collectd**

`collectd` es un demonio que recopila metricas del sistema periodicamente y las puede almacenar en bases de datos RRD. Los archivos RRD tienen la ventaja de mantener un tamano fijo independientemente del tiempo de recopilacion, ya que rotan los datos mas antiguos con menor granularidad. `sar` usa su propio formato binario, y `vmstat`/`top` no almacenan datos.
</details>

---

### Pregunta 6

¿Cual es la diferencia principal entre escalado vertical y escalado horizontal?

a) Escalado vertical agrega mas maquinas, escalado horizontal mejora la maquina existente
b) Escalado vertical mejora recursos de la maquina existente, escalado horizontal agrega mas maquinas
c) Escalado vertical es para disco, escalado horizontal es para CPU
d) No hay diferencia, son sinonimos

<details>
<summary>Respuesta</summary>

**b) Escalado vertical mejora recursos de la maquina existente, escalado horizontal agrega mas maquinas**

Escalado vertical (scale up) implica agregar mas recursos al servidor actual: mas RAM, mejor CPU, discos mas grandes. Escalado horizontal (scale out) implica agregar mas servidores y distribuir la carga entre ellos. Cada estrategia tiene ventajas: vertical es mas simple de implementar, horizontal ofrece mayor escalabilidad a largo plazo.
</details>

---

### Pregunta 7

¿Con que frecuencia tipica recopila datos el demonio `sadc` del paquete sysstat cuando esta configurado por defecto?

a) Cada segundo
b) Cada minuto
c) Cada 10 minutos
d) Cada hora

<details>
<summary>Respuesta</summary>

**c) Cada 10 minutos**

El demonio `sadc` (system activity data collector) se ejecuta tipicamente cada 10 minutos a traves de una entrada en cron (`/etc/cron.d/sysstat`). Esta frecuencia ofrece un buen equilibrio entre granularidad de datos y uso de recursos del propio sistema de monitorizacion. Este intervalo se puede ajustar modificando la configuracion del cron.
</details>

---

### Pregunta 8

Un servidor de base de datos tiene 16 GB de RAM. Actualmente usa 12 GB con 200 conexiones concurrentes. Se espera que el numero de conexiones se duplique en 6 meses. ¿Que accion es mas apropiada?

a) No hacer nada, hay 4 GB libres
b) Ampliar a 32 GB de RAM anticipandose al crecimiento
c) Reducir el numero maximo de conexiones permitidas
d) Migrar la base de datos a otro servidor con menos carga

<details>
<summary>Respuesta</summary>

**b) Ampliar a 32 GB de RAM anticipandose al crecimiento**

Con 200 conexiones usando 12 GB, cada conexion consume aproximadamente 60 MB. Al duplicar a 400 conexiones, se necesitarian ~24 GB. Ampliar a 32 GB proporciona margen suficiente. Reducir conexiones limita el servicio, y migrar sin ampliar solo traslada el problema. La planificacion proactiva de capacidad indica ampliar recursos antes de alcanzar el limite.
</details>

---

### Pregunta 9

¿Que tipo de patron de crecimiento describe mejor la situacion de una tienda en linea que experimenta picos de trafico en noviembre-diciembre cada ano?

a) Crecimiento lineal
b) Crecimiento exponencial
c) Crecimiento estacional o ciclico
d) Crecimiento escalonado

<details>
<summary>Respuesta</summary>

**c) Crecimiento estacional o ciclico**

El patron estacional o ciclico se caracteriza por picos de uso que se repiten periodicamente. En el caso de una tienda en linea, los picos de noviembre-diciembre (Black Friday, Navidad) se repiten cada ano. Este tipo de patron requiere una planificacion que considere la capacidad para los picos, no solo para el uso promedio.
</details>

---

### Pregunta 10

¿Cual de las siguientes afirmaciones sobre la planificacion de capacidad es CORRECTA?

a) Solo debe realizarse cuando el sistema ya presenta problemas de rendimiento
b) Se basa exclusivamente en el uso actual de recursos sin considerar tendencias
c) Es un proceso continuo que combina monitorizacion, analisis, prediccion y planificacion
d) Solo involucra la compra de hardware nuevo

<details>
<summary>Respuesta</summary>

**c) Es un proceso continuo que combina monitorizacion, analisis, prediccion y planificacion**

La planificacion de capacidad es un ciclo continuo: se monitoriza el uso actual, se analizan tendencias, se predicen necesidades futuras, se planifican acciones y se implementan. Despues se vuelve a monitorizar para verificar. No se limita a hardware, incluye optimizacion de software, redistribucion de carga y ajustes de configuracion. Es proactiva, no reactiva.
</details>
