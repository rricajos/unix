---
title: "200.2 - Prediccion de necesidades"
tags: [lpic-2, examen-201, tema-200, teoria]
tipo: teoria
certificacion: lpic-2
examen: "201"
tema: "200"
subtema: "200.2"
---

# 200.2 - Prediccion de necesidades

## Introduccion

La prediccion de necesidades de recursos es la extension logica de la monitorizacion del uso actual. Mientras que el subtema 200.1 se centra en medir lo que esta ocurriendo ahora, este subtema se enfoca en analizar tendencias para anticipar las necesidades futuras del sistema.

Este subtema tiene un **peso de 2** en el examen, lo que indica que se evaluan conceptos generales mas que detalles tecnicos profundos.

## Fundamentos de la planificacion de capacidad

### ¿Que es la planificacion de capacidad?

La planificacion de capacidad es el proceso de determinar los recursos de infraestructura necesarios para satisfacer las demandas futuras de carga de trabajo. Implica:

- **Medicion**: recopilar datos del uso actual de recursos
- **Analisis**: identificar patrones y tendencias en los datos
- **Prediccion**: estimar necesidades futuras basandose en las tendencias
- **Planificacion**: disenar estrategias para satisfacer la demanda proyectada

### Ciclo de la planificacion de capacidad

```
  Monitorizar --> Analizar --> Predecir --> Planificar --> Implementar
       ^                                                      |
       |______________________________________________________|
```

Este ciclo es continuo. Despues de implementar cambios, se debe seguir monitorizando para verificar que las predicciones fueron acertadas y ajustar el modelo segun sea necesario.

## Analisis de tendencias de recursos

### Tipos de tendencias

Las tendencias de uso de recursos pueden seguir distintos patrones:

- **Crecimiento lineal**: el uso aumenta de forma constante y predecible (por ejemplo, almacenamiento que crece 50 GB al mes)
- **Crecimiento exponencial**: el uso se acelera con el tiempo (por ejemplo, una aplicacion web que duplica usuarios cada trimestre)
- **Crecimiento estacional/ciclico**: patrones que se repiten periodicamente (por ejemplo, mayor uso de CPU durante horarios laborales o picos de trafico en diciembre para tiendas en linea)
- **Crecimiento escalonado**: aumentos bruscos asociados a eventos (por ejemplo, despliegue de una nueva aplicacion)

### Fuentes de datos para el analisis

Las herramientas del subtema 200.1 son la base para recopilar datos historicos:

```bash
# Datos historicos de sar (dias anteriores)
$ sar -u -f /var/log/sysstat/sa15   # CPU del dia 15
$ sar -r -f /var/log/sysstat/sa15   # Memoria del dia 15

# Uso de disco a lo largo del tiempo
$ df -h  # Punto de datos actual para comparar con historicos

# Datos de collectd almacenados en RRD
# Tipicamente en /var/lib/collectd/rrd/
```

> **Para el examen:** La recopilacion de datos historicos con herramientas como `sar` y `collectd` es fundamental para la prediccion de necesidades. Sin datos historicos no es posible identificar tendencias.

## Metodologia de prediccion

### Estimacion de crecimiento de disco

El caso mas comun y mas facil de predecir es el crecimiento del almacenamiento.

**Ejemplo practico:**

```
Datos recopilados durante 4 meses:
- Enero:   Uso de /home: 500 GB de 2 TB
- Febrero: Uso de /home: 560 GB de 2 TB
- Marzo:   Uso de /home: 620 GB de 2 TB
- Abril:   Uso de /home: 680 GB de 2 TB

Crecimiento mensual: ~60 GB/mes
Espacio disponible: 2000 - 680 = 1320 GB
Meses hasta llenar: 1320 / 60 = 22 meses

Conclusion: se necesitara ampliar el disco en aproximadamente 18 meses
(aplicando un margen de seguridad del 80% de ocupacion)
```

> **Para el examen:** Se espera que puedas realizar calculos basicos de prediccion de crecimiento de disco. Siempre ten en cuenta un margen de seguridad (tipicamente, actuar cuando se alcanza el 80% de uso).

### Estimacion de necesidades de memoria

La prediccion de memoria es mas compleja porque depende de las aplicaciones:

- Numero de usuarios concurrentes esperados
- Consumo de memoria por usuario/conexion
- Crecimiento del dataset en aplicaciones de base de datos
- Requerimientos de cache

```
Ejemplo:
- Servidor web actual: 200 conexiones concurrentes, 4 GB RAM usada
- Prevision: duplicar usuarios en 6 meses
- Estimacion: se necesitaran 8 GB RAM (mas margen)
- Recomendacion: ampliar a 16 GB RAM
```

### Estimacion de necesidades de CPU

La prediccion de CPU depende de:

- Crecimiento de la carga de trabajo (transacciones, solicitudes, etc.)
- Cambios en el software (nuevas versiones pueden ser mas o menos eficientes)
- Adicion de nuevos servicios al servidor

Metricas clave para proyectar:
- Load average promedio y su tendencia
- Porcentaje de uso de CPU y su evolucion
- Tiempos de respuesta de aplicaciones

## Herramientas para la prediccion

### Uso de datos RRD para tendencias

Los archivos RRD (Round Robin Database) almacenados por `collectd`, MRTG o Cacti permiten generar graficos de tendencia a largo plazo.

```bash
# Generar grafico de tendencia con rrdtool
$ rrdtool graph tendencia.png \
  --start -30d \
  --end now \
  DEF:cpu=/var/lib/collectd/rrd/localhost/cpu-0/cpu-user.rrd:value:AVERAGE \
  LINE1:cpu#FF0000:"CPU Usage"
```

### Analisis con hojas de calculo y scripts

Para predicciones simples, los datos exportados de `sar` o `collectd` se pueden analizar en hojas de calculo o con scripts:

```bash
# Exportar datos de sar a formato CSV para analisis
$ sadf -d /var/log/sysstat/sa15 -- -u > cpu_data.csv

# Script basico para calcular tendencia de uso de disco
$ df -h /home | awk 'NR==2{print strftime("%Y-%m-%d"), $3}' >> /var/log/disk_trend.log
```

> **Para el examen:** `sadf` es el comando para convertir datos de sar a formatos legibles por otras herramientas (CSV, XML, etc.). Es la herramienta puente entre la monitorizacion y el analisis.

### Nagios para capacidad

Aunque Nagios se centra en alertas, sus datos historicos pueden ser utiles para identificar tendencias:

- Graficos de rendimiento de plugins
- Historial de alertas que indican cuando se superaron umbrales
- Planificacion basada en la frecuencia de alertas

## Factores a considerar en la prediccion

### Factores internos

- **Crecimiento organico**: aumento natural de datos y usuarios
- **Nuevos proyectos**: despliegue de nuevas aplicaciones o servicios
- **Cambios de version**: actualizaciones que pueden cambiar los requisitos de recursos
- **Politicas de retencion**: cuanto tiempo se mantienen logs, backups, etc.

### Factores externos

- **Crecimiento del negocio**: nuevos clientes, expansion de mercado
- **Estacionalidad**: periodos de mayor actividad (fiestas, campanas, etc.)
- **Regulaciones**: requerimientos de almacenamiento de datos por ley
- **Tendencias tecnologicas**: nuevas tecnologias que cambian los patrones de uso

## Estrategias de actuacion

Una vez identificada la tendencia, las acciones posibles incluyen:

| Recurso | Acciones a corto plazo | Acciones a largo plazo |
|---------|----------------------|----------------------|
| CPU | Optimizar procesos, redistribuir carga | Migrar a hardware mas potente, escalado horizontal |
| Memoria | Ajustar swap, optimizar aplicaciones | Ampliar RAM, distribuir servicios |
| Disco | Limpiar archivos, comprimir datos | Ampliar almacenamiento, implementar SAN/NAS |
| Red | QoS, optimizar protocolos | Ampliar ancho de banda, balanceo de carga |

### Escalado vertical vs. horizontal

- **Escalado vertical**: aumentar recursos de la maquina existente (mas RAM, mejor CPU, mas disco)
- **Escalado horizontal**: agregar mas maquinas y distribuir la carga

> **Para el examen:** Debes entender que la prediccion no es solo sobre hardware. Optimizar software, ajustar configuraciones y redistribuir servicios son estrategias validas que deben considerarse antes de comprar hardware nuevo.

## Documentacion y comunicacion

La planificacion de capacidad debe documentarse:

- **Informes periodicos**: datos actuales, tendencias y predicciones
- **Umbrales de alerta**: cuando actuar (tipicamente al 70-80% de uso)
- **Plan de accion**: pasos a seguir cuando se alcanzan los umbrales
- **Presupuesto**: estimacion de costes para las ampliaciones necesarias
- **Cronograma**: fechas previstas para cada actuacion

La comunicacion de las necesidades a la direccion es parte esencial del rol del administrador de sistemas avanzado.
