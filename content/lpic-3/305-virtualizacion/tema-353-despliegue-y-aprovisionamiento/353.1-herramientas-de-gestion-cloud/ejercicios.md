---
title: "353.1 - Ejercicios: Herramientas de Gestión Cloud"
tipo: ejercicios
certificacion: lpic-3
especialidad: "305 - Virtualización y Contenedores"
tema: "353 - Despliegue y Aprovisionamiento"
subtema: "353.1"
peso: 2
tags:
  - lpic-3
  - tema-353
  - ejercicios
  - terraform
  - ansible
  - iac
---

# Ejercicios - 353.1 Herramientas de Gestión Cloud

### Pregunta 1
¿Qué comando de Terraform muestra una vista previa de los cambios que se aplicarán sin ejecutarlos?

a) `terraform preview`
b) `terraform check`
c) `terraform plan`
d) `terraform dry-run`

<details><summary>Respuesta</summary>

**c) `terraform plan`**

`terraform plan` muestra los cambios que Terraform realizará en la infraestructura sin aplicarlos realmente. Muestra recursos que se crearán (+), modificarán (~) o destruirán (-). Es una buena práctica revisarlo siempre antes de `terraform apply`.
</details>

### Pregunta 2
¿Qué es el archivo `terraform.tfstate`?

a) La configuración de providers de Terraform
b) El mapa entre la configuración de Terraform y los recursos reales de infraestructura
c) Un log de las operaciones ejecutadas
d) Un archivo de variables de entorno

<details><summary>Respuesta</summary>

**b) El mapa entre la configuración de Terraform y los recursos reales de infraestructura**

El archivo de estado (`terraform.tfstate`) contiene el mapeo entre los recursos definidos en la configuración HCL y los recursos reales creados en la infraestructura. Es crítico para que Terraform sepa qué existe y qué debe cambiar. Puede contener datos sensibles y debe almacenarse de forma segura.
</details>

### Pregunta 3
¿Cuál es la característica principal que distingue a Ansible de otras herramientas de gestión de configuración como Puppet o Chef?

a) Ansible usa un lenguaje de programación propio
b) Ansible es agentless (sin agente), se conecta por SSH
c) Ansible solo funciona con servidores cloud
d) Ansible requiere una base de datos central

<details><summary>Respuesta</summary>

**b) Ansible es agentless (sin agente), se conecta por SSH**

Ansible no requiere instalar agentes en los hosts gestionados. Se conecta por SSH (o WinRM para Windows) y solo necesita Python instalado en los hosts remotos. Puppet y Chef requieren agentes instalados en cada nodo.
</details>

### Pregunta 4
¿Qué concepto de Terraform representa un plugin que interactúa con la API de un servicio cloud?

a) Module
b) Resource
c) Provider
d) Data Source

<details><summary>Respuesta</summary>

**c) Provider**

Un provider es un plugin que permite a Terraform interactuar con la API de un servicio específico (AWS, Azure, GCP, libvirt, etc.). Se configura con credenciales y región, y proporciona los tipos de recursos disponibles para ese servicio.
</details>

### Pregunta 5
¿Qué comando de Ansible ejecuta un playbook en modo de verificación sin aplicar cambios?

a) `ansible-playbook site.yml --dry-run`
b) `ansible-playbook site.yml --check`
c) `ansible-playbook site.yml --verify`
d) `ansible-playbook site.yml --test`

<details><summary>Respuesta</summary>

**b) `ansible-playbook site.yml --check`**

La opción `--check` (o `-C`) ejecuta el playbook en modo "dry-run", verificando qué cambios se realizarían sin aplicarlos realmente. Se puede combinar con `--diff` para ver las diferencias exactas que se producirían.
</details>

### Pregunta 6
¿Qué es IaC (Infraestructura como Código)?

a) Un lenguaje de programación para crear software de infraestructura
b) La práctica de gestionar infraestructura mediante archivos de configuración versionables y reproducibles
c) Un estándar de la OCI para definir contenedores
d) Un protocolo de comunicación entre herramientas cloud

<details><summary>Respuesta</summary>

**b) La práctica de gestionar infraestructura mediante archivos de configuración versionables y reproducibles**

IaC permite definir la infraestructura en archivos de texto que pueden versionarse con Git, revisarse, reutilizarse y automatizarse. Esto elimina la configuración manual, mejora la reproducibilidad y proporciona documentación viva de la infraestructura.
</details>

### Pregunta 7
¿Qué comando de Terraform inicializa un directorio de trabajo descargando los providers necesarios?

a) `terraform setup`
b) `terraform init`
c) `terraform start`
d) `terraform configure`

<details><summary>Respuesta</summary>

**b) `terraform init`**

`terraform init` es el primer comando a ejecutar en un directorio de Terraform. Descarga los providers definidos, inicializa el backend de estado y descarga los módulos referenciados. Debe ejecutarse siempre que se cambie la configuración de providers o módulos.
</details>

### Pregunta 8
¿Cuál es el patrón general de los comandos de OpenStack CLI?

a) `os-<recurso>-<acción>`
b) `openstack <recurso> <acción>`
c) `osc <acción> <recurso>`
d) `openstack-cli <recurso> <acción>`

<details><summary>Respuesta</summary>

**b) `openstack <recurso> <acción>`**

Los comandos de OpenStack CLI siguen el patrón `openstack <recurso> <acción>`, como `openstack server list`, `openstack network create`, `openstack image show`, etc. Es un cliente unificado que reemplazó los clientes individuales (nova, neutron, etc.).
</details>

### Pregunta 9
¿Qué componente de Ansible define la lista de hosts a gestionar?

a) Playbook
b) Role
c) Inventory
d) Handler

<details><summary>Respuesta</summary>

**c) Inventory**

El inventario (inventory) define los hosts y grupos de hosts que Ansible puede gestionar. Puede ser un archivo INI/YAML estático o generarse dinámicamente (inventario dinámico). El inventario por defecto está en `/etc/ansible/hosts`.
</details>

### Pregunta 10
¿Qué diferencia fundamental hay entre Terraform y Ansible en su uso típico?

a) Terraform configura servidores; Ansible crea infraestructura
b) Terraform provisiona infraestructura (crear VMs, redes, etc.); Ansible configura los sistemas ya creados
c) Terraform es para cloud público; Ansible solo para servidores locales
d) No hay diferencia, son herramientas intercambiables

<details><summary>Respuesta</summary>

**b) Terraform provisiona infraestructura (crear VMs, redes, etc.); Ansible configura los sistemas ya creados**

Terraform es principalmente para provisionar infraestructura (crear y gestionar recursos cloud como VMs, redes, balanceadores). Ansible es principalmente para configurar sistemas (instalar paquetes, copiar archivos, gestionar servicios). Son complementarias: Terraform crea la infraestructura y Ansible la configura.
</details>
