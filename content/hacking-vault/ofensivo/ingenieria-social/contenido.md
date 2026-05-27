---
title: "Ingenieria Social"
tags:
  - hacking
  - ofensivo
  - ingenieria-social
  - hacking-ofensivo
tipo: hacking-ofensivo
certificacion: hacking-vault
---

# Ingenieria Social

La ingenieria social es el arte de manipular a las personas para que divulguen informacion confidencial o realicen acciones que comprometan la seguridad. Es frecuentemente el vector de ataque mas efectivo porque explota la naturaleza humana en lugar de vulnerabilidades tecnicas.

> **Nota de seguridad:** Las tecnicas de ingenieria social solo deben aplicarse en el contexto de evaluaciones de seguridad autorizadas. El uso de estas tecnicas fuera de un marco legal puede constituir fraude, suplantacion de identidad u otros delitos. Siempre se requiere consentimiento escrito de la organizacion.

## Principios Psicologicos de la Ingenieria Social

Robert Cialdini identifico seis principios de influencia que los ingenieros sociales explotan sistematicamente:

| Principio | Descripcion | Ejemplo en ataque |
|-----------|-------------|-------------------|
| **Reciprocidad** | Las personas sienten la obligacion de devolver favores | "Te ayude con el problema del ordenador, ahora necesito que me des tu password para verificar algo" |
| **Autoridad** | Tendencia a obedecer a figuras de autoridad | "Soy del departamento de TI y necesito tus credenciales para una actualizacion urgente" |
| **Urgencia/Escasez** | La presion temporal reduce el pensamiento critico | "Tu cuenta sera bloqueada en 15 minutos si no verificas tu identidad ahora" |
| **Compromiso/Consistencia** | Las personas buscan ser coherentes con acciones previas | "Ya aceptaste la politica, ahora solo necesitas confirmar tu password" |
| **Prueba social** | Si otros lo hacen, debe estar bien | "Todos tus companeros ya han actualizado sus credenciales" |
| **Simpatia** | Es mas facil decir si a personas que nos agradan | Crear rapport, encontrar intereses comunes, halagar |

### Modelo de Ataque de Ingenieria Social

```
FASE 1 - Investigacion (OSINT):
  [1] Identificar objetivo y organizacion
  [2] Recopilar informacion publica (LinkedIn, web corporativa)
  [3] Mapear estructura organizacional
  [4] Identificar relaciones y jerarquias
  [5] Encontrar informacion personal del objetivo

FASE 2 - Desarrollo del Pretexto:
  [1] Crear una identidad creible
  [2] Preparar materiales de soporte (correo, telefono, web)
  [3] Ensayar el escenario
  [4] Preparar respuestas para preguntas inesperadas

FASE 3 - Ejecucion:
  [1] Establecer contacto inicial
  [2] Construir confianza (rapport)
  [3] Explotar el principio psicologico elegido
  [4] Obtener la informacion o accion deseada

FASE 4 - Salida:
  [1] Finalizar la interaccion de forma natural
  [2] No levantar sospechas
  [3] Documentar resultados
  [4] Reportar hallazgos al cliente
```

## Phishing

El phishing es el tipo mas comun de ataque de ingenieria social. Consiste en enviar comunicaciones fraudulentas que aparentan provenir de una fuente legitima.

### Tipos de Phishing

| Tipo | Descripcion | Alcance | Sofisticacion |
|------|-------------|---------|---------------|
| **Phishing masivo** | Correos genericos a gran escala | Miles de destinatarios | Baja |
| **Spear phishing** | Correos personalizados para un objetivo especifico | Individual o grupo pequeno | Alta |
| **Whaling** | Dirigido a ejecutivos de alto nivel (CEO, CFO) | Directivos | Muy alta |
| **Vishing** | Phishing por llamada telefonica (voz) | Individual | Media-Alta |
| **Smishing** | Phishing por SMS/mensajes de texto | Variable | Media |
| **Clone phishing** | Replica de un correo legitimo previo | Individual | Alta |

### Anatomia de un Correo de Phishing

```
Elementos que hacen efectivo un correo de phishing:

REMITENTE:
- Dominio similar al legitimo (typosquatting)
  Legitimo: soporte@empresa.com
  Falso:    soporte@ernpresa.com (m -> rn)
  Falso:    soporte@empresa-soporte.com
  Falso:    soporte@empressa.com

ASUNTO:
- Genera urgencia o curiosidad
  "Accion requerida: Su cuenta sera suspendida"
  "Factura pendiente #4521 - Vence hoy"
  "Ha recibido un documento compartido"

CUERPO:
- Logo corporativo identico
- Lenguaje formal que imita la comunicacion real
- Enlace visible que no coincide con el destino real
  Texto visible: https://empresa.com/login
  URL real:      https://empresa-login.atacante.com/phish
- Sentido de urgencia o consecuencia negativa

ADJUNTOS MALICIOSOS:
- Documentos Office con macros (.docm, .xlsm)
- PDFs con enlaces maliciosos
- Archivos comprimidos con ejecutables (.zip con .exe)
- Archivos HTML que simulan paginas de login
```

### Indicadores de un Correo de Phishing

```
Lista de verificacion para identificar phishing:

[ ] Remitente con dominio sospechoso o ligeramente diferente
[ ] Errores ortograficos o gramaticales inusuales
[ ] Saludo generico ("Estimado usuario" en vez del nombre)
[ ] Sentido de urgencia extremo ("actue inmediatamente")
[ ] Enlaces que no coinciden al pasar el cursor sobre ellos
[ ] Solicitud de credenciales o informacion sensible
[ ] Adjuntos inesperados o con extensiones sospechosas
[ ] Cabeceras de correo inconsistentes (Return-Path, SPF, DKIM)
[ ] Solicitud de deshabilitar seguridad ("habilitar macros")
[ ] Amenazas de consecuencias negativas por no actuar
```

## Social Engineering Toolkit (SET)

SET es un framework de codigo abierto disenado para simular ataques de ingenieria social.

```bash
# Iniciar SET
sudo setoolkit

# Menu principal de SET:
# 1) Social-Engineering Attacks
# 2) Penetration Testing
# 3) Third Party Modules
# 4) Update SET
# 5) Update Metasploit

# Opciones de ataques de ingenieria social:
# 1) Spear-Phishing Attack Vectors
# 2) Website Attack Vectors
# 3) Infectious Media Generator
# 4) Create a Payload and Listener
# 5) Mass Mailer Attack
# 6) Arduino-Based Attack Vector
# 7) Wireless Access Point Attack
# 8) QRCode Generator Attack
# 9) Powershell Attack Vectors
# 10) Third Party Modules
```

### Clonacion de Sitio Web con SET

```bash
# Flujo para clonar una pagina de login:
# 1) Social-Engineering Attacks
# 2) Website Attack Vectors
# 3) Credential Harvester Attack Method
# 2) Site Cloner

# SET solicitara:
# - IP del servidor (la del atacante)
# - URL del sitio a clonar (ej: https://login.empresa.com)

# SET creara una replica exacta del sitio
# Las credenciales introducidas se capturan y muestran
# El usuario es redirigido al sitio real tras el login

# Ejemplo de salida cuando se capturan credenciales:
# [*] WE GOT A HIT! Printing the output:
# PARAM: username=admin
# PARAM: password=P@ssw0rd123
# [*] WHEN YOU'RE FINISHED, HIT CONTROL-C
```

### Creacion de Payloads con SET

```bash
# Generar documento de Office con macro maliciosa:
# 1) Social-Engineering Attacks
# 1) Spear-Phishing Attack Vectors
# 1) Perform a Mass Email Attack
# Seleccionar payload (ej: Windows Reverse TCP Meterpreter)
# Configurar LHOST y LPORT
# Seleccionar formato (PDF, Word, Excel)
# Enviar por email o guardar localmente
```

## Pretexting

El pretexting consiste en crear un escenario ficticio (pretexto) para convencer al objetivo de realizar una accion o proporcionar informacion.

### Escenarios Comunes de Pretexting

```
ESCENARIO 1 - Soporte tecnico:
  Pretexto: "Soy del equipo de TI. Estamos migrando los servidores
  de correo y necesito verificar tu cuenta. ¿Puedes confirmar tu
  usuario y contrasena para asegurar que la migracion sea exitosa?"

  Principios usados: Autoridad + Urgencia

ESCENARIO 2 - Proveedor externo:
  Pretexto: "Soy de la empresa de mantenimiento del sistema de clima.
  Necesito acceso al cuarto de servidores para verificar las unidades
  de refrigeracion. ¿Me puede abrir la puerta?"

  Principios usados: Autoridad + Consistencia

ESCENARIO 3 - Nuevo empleado:
  Pretexto: "Hola, soy nuevo en el departamento de marketing.
  Mi jefe me pidio urgentemente el reporte de ventas pero no tengo
  acceso aun al sistema. ¿Me lo puedes enviar por correo?"

  Principios usados: Simpatia + Urgencia

ESCENARIO 4 - Encuesta/Investigacion:
  Pretexto: "Estamos realizando una encuesta de satisfaccion del
  servicio de TI. ¿Podria responder algunas preguntas sobre como
  accede al sistema y que herramientas utiliza?"

  Principios usados: Reciprocidad + Prueba social
```

### Elementos de un Buen Pretexto

```
Checklist para construir un pretexto creible:

[x] Identidad verificable (nombre, cargo, departamento)
[x] Razon logica para la solicitud
[x] Conocimiento del lenguaje y jerga de la organizacion
[x] Informacion de contexto real (nombres de jefes, proyectos)
[x] Numero de telefono o correo de respaldo por si verifican
[x] Respuestas preparadas para preguntas de validacion
[x] Actitud natural y confiada (no nerviosa)
[x] Plan de salida si el pretexto falla
```

## Ingenieria Social Fisica

### Tailgating (Piggybacking)

```
Tecnica: Seguir a un empleado autorizado a traves de una puerta
de acceso controlado sin presentar credenciales propias.

Escenarios tipicos:
- Llegar con las manos ocupadas (cajas, bandejas de cafe)
  para que alguien sostenga la puerta
- Simular hablar por telefono mientras se sigue a alguien
- Vestir uniforme de la empresa o de un servicio
  (mensajeria, limpieza, mantenimiento)
- Llegar junto a un grupo de empleados que regresan del almuerzo

Contramedidas:
- Politicas de "una persona, una tarjeta"
- Mantraps (esclusas de seguridad)
- Guardias de seguridad en puntos de acceso
- Concienciacion de empleados
```

### Dumpster Diving

```
Buscar informacion sensible en la basura de la organizacion.

Informacion que se puede encontrar:
- Documentos impresos sin destruir
- Notas adhesivas con passwords
- Organigramas y directorios internos
- Manuales tecnicos y diagramas de red
- Dispositivos de almacenamiento desechados
- Tarjetas de acceso caducadas

Contramedidas:
- Politica de destruccion de documentos (trituradoras)
- Contenedores de basura con llave
- Borrado seguro de dispositivos de almacenamiento
- Concienciacion sobre clasificacion de informacion
```

### Shoulder Surfing

```
Observar a alguien mientras introduce credenciales,
PIN, o informacion sensible.

Ubicaciones comunes:
- Cajeros automaticos
- Puntos de venta (PIN de tarjeta)
- Espacios de trabajo abiertos
- Cafeterias y espacios publicos
- Transporte publico (desbloqueo de movil)

Tecnicas modernas:
- Uso de camaras discretas o telefonos moviles
- Binoculares o telescopios desde distancia
- Grabacion de video para analisis posterior

Contramedidas:
- Filtros de privacidad para pantallas
- Cubrir el teclado al introducir PIN
- Autenticacion biometrica
- Concienciacion sobre el entorno
```

## OSINT para Ingenieria Social

```bash
# Recopilar informacion de LinkedIn
# - Estructura organizacional
# - Nombres y cargos
# - Tecnologias utilizadas (en ofertas de empleo)
# - Contactos y relaciones profesionales

# Herramientas de OSINT para personas
theHarvester -d empresa.com -b linkedin
# Buscar correos corporativos

# Redes sociales
# - Facebook: informacion personal, ubicaciones, habitos
# - Twitter/X: opiniones, rutinas, quejas
# - Instagram: ubicaciones, eventos, contactos
# - GitHub: repositorios con credenciales o informacion interna

# Google Dorks para informacion personal
site:linkedin.com "empresa" "cargo"
site:facebook.com "nombre" "ciudad"

# Busqueda de correos electronicos
# hunter.io - buscar correos por dominio
# phonebook.cz - buscar correos y subdominios
# haveibeenpwned.com - verificar si credenciales fueron filtradas

# Herramientas de OSINT
# Maltego - mapeo visual de relaciones
# SpiderFoot - OSINT automatizado
# Recon-ng - framework de reconocimiento
# sherlock - buscar usuario en multiples redes sociales
sherlock nombre_usuario
```

## Defensa contra Ingenieria Social

### Programa de Concienciacion

```
Componentes de un programa efectivo:

1. FORMACION INICIAL
   - Sesion obligatoria para nuevos empleados
   - Tipos de ataques de ingenieria social
   - Como identificar intentos de phishing
   - Procedimientos de reporte de incidentes

2. FORMACION CONTINUA
   - Recordatorios periodicos (mensuales/trimestrales)
   - Actualizacion sobre nuevas amenazas
   - Casos reales anonimizados de la organizacion
   - Microlearning: modulos cortos y frecuentes

3. SIMULACIONES
   - Campanas de phishing simulado
   - Llamadas de vishing simuladas
   - Intentos de tailgating controlados
   - Medicion y seguimiento de resultados

4. METRICAS
   - Tasa de clic en phishing simulado
   - Tasa de reporte de intentos sospechosos
   - Tiempo medio de reporte
   - Mejora respecto a evaluaciones anteriores
```

### Procedimientos de Verificacion

```
Protocolo de verificacion ante solicitudes sospechosas:

1. VERIFICACION DE IDENTIDAD
   - No confiar solo en el identificador de llamada (spoofeable)
   - Verificar por un canal independiente (llamar al directorio)
   - Solicitar numero de empleado o informacion de validacion
   - Contactar al supervisor directo del solicitante

2. VERIFICACION DE SOLICITUD
   - ¿Es normal esta solicitud para este rol?
   - ¿Existe un proceso formal para esta peticion?
   - ¿Por que hay urgencia? (senal de alarma)
   - ¿Otro colega puede confirmar la necesidad?

3. ESCALAMIENTO
   - Ante la duda, escalar a un supervisor
   - Reportar al equipo de seguridad
   - Documentar la solicitud con detalle
   - No proporcionar nada hasta completar la verificacion
```

### Controles Tecnicos Contra Phishing

```
Filtrado de correo electronico:
- SPF (Sender Policy Framework)
- DKIM (DomainKeys Identified Mail)
- DMARC (Domain-based Message Authentication)
- Filtros anti-spam y anti-phishing
- Sandboxing de adjuntos

Controles en el endpoint:
- Bloqueo de macros por defecto en Office
- Navegacion web con filtrado de URLs
- Autenticacion multifactor (MFA) en todos los sistemas
- Gestores de passwords corporativos

Controles de red:
- DNS filtering
- Proxy web con inspeccion SSL
- Bloqueo de dominios recien registrados
- Monitoreo de trafico saliente anomalo
```

## Consideraciones Legales y Eticas

> **Nota de seguridad:** La ingenieria social en el contexto de pentesting debe regirse por un marco etico y legal estricto. A continuacion se detallan las consideraciones fundamentales.

```
REQUISITOS LEGALES:
- Contrato firmado que especifique tecnicas permitidas
- Alcance claro (que departamentos, que personas, que tecnicas)
- Clausulas de confidencialidad y proteccion de datos
- Definicion de limites (no explotar informacion personal sensible)
- Contacto de emergencia para detener el ejercicio

PRINCIPIOS ETICOS:
- No causar dano psicologico a los empleados
- No utilizar informacion personal fuera del alcance
- No humillar publicamente a quienes caigan en el engano
- Reportar resultados de forma constructiva, no punitiva
- El objetivo es mejorar la seguridad, no demostrar superioridad

BUENAS PRACTICAS:
- Involucrar a RRHH y al departamento legal
- Definir criterios de exito claros
- Tener un plan de comunicacion post-ejercicio
- Proporcionar formacion inmediata tras la simulacion
- Tratar los resultados como datos agregados, no individuales
```

| Aspecto | Permitido | No permitido |
|---------|-----------|--------------|
| Phishing simulado | Con autorizacion y alcance definido | Sin consentimiento organizacional |
| Vishing | Dentro del alcance acordado | Amenazas reales o extorsion |
| Tailgating | En instalaciones del cliente autorizadas | Acceso a areas no incluidas en el alcance |
| OSINT | Fuentes publicas sobre la organizacion | Acceso a cuentas privadas o hackeo |
| Pretexting | Escenarios pre-aprobados | Suplantacion de autoridades reales (policia) |

> **Nota de seguridad:** Antes de ejecutar cualquier ejercicio de ingenieria social, consulta siempre con el departamento legal del cliente y asegurate de que todas las partes involucradas comprenden y aceptan los riesgos y el alcance del ejercicio.
