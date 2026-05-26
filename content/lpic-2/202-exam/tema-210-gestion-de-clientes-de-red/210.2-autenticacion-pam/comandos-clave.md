---
title: "210.2 - Autenticación PAM"
tags: [lpic-2, examen-202, tema-210, comandos]
tipo: comandos
certificacion: lpic-2
examen: "202"
tema: "210"
subtema: "210.2"
---

# 210.2 - Comandos clave: Autenticación PAM

## Tipos de módulos PAM

| Tipo | Función |
|------|---------|
| `auth` | Verificar identidad del usuario |
| `account` | Verificar permisos y restricciones de la cuenta |
| `password` | Gestionar cambios de contraseña |
| `session` | Configurar entorno de sesión |

## Flags de control

| Flag | Éxito | Fallo |
|------|-------|-------|
| `required` | Continúa evaluando | Continúa evaluando, pero resultado final = fallo |
| `requisite` | Continúa evaluando | Detiene inmediatamente y devuelve fallo |
| `sufficient` | Detiene y devuelve éxito (si no hay required fallidos) | Se ignora, continúa |
| `optional` | Se ignora (salvo si es el único módulo) | Se ignora (salvo si es el único módulo) |

## Módulos PAM principales

| Módulo | Función |
|--------|---------|
| `pam_unix.so` | Autenticación estándar contra /etc/passwd y /etc/shadow |
| `pam_ldap.so` | Autenticación contra servidor LDAP |
| `pam_sss.so` | Autenticación mediante SSSD |
| `pam_wheel.so` | Restringir `su` al grupo wheel |
| `pam_limits.so` | Aplicar límites de /etc/security/limits.conf |
| `pam_deny.so` | Denegar siempre el acceso |
| `pam_permit.so` | Permitir siempre el acceso |
| `pam_cracklib.so` | Verificar calidad de contraseña (antiguo) |
| `pam_pwquality.so` | Verificar calidad de contraseña (moderno) |
| `pam_tally2.so` | Bloqueo por intentos fallidos (antiguo) |
| `pam_faillock.so` | Bloqueo por intentos fallidos (moderno) |
| `pam_nologin.so` | Bloquear login si existe /etc/nologin |
| `pam_time.so` | Restricciones horarias (/etc/security/time.conf) |
| `pam_access.so` | Control de acceso (/etc/security/access.conf) |

## Archivos de configuración

| Archivo | Función |
|---------|---------|
| `/etc/pam.d/` | Directorio con configuración PAM por servicio |
| `/etc/pam.d/common-auth` | Reglas auth comunes (Debian) |
| `/etc/pam.d/common-account` | Reglas account comunes (Debian) |
| `/etc/pam.d/common-password` | Reglas password comunes (Debian) |
| `/etc/pam.d/common-session` | Reglas session comunes (Debian) |
| `/etc/pam.d/system-auth` | Reglas comunes (RHEL) |
| `/etc/pam.d/password-auth` | Reglas de contraseña (RHEL) |
| `/etc/security/limits.conf` | Límites de recursos por usuario/grupo |
| `/etc/security/time.conf` | Restricciones horarias |
| `/etc/security/access.conf` | Reglas de acceso por origen |
| `/etc/nologin` | Si existe, bloquea login de no-root |

## Formato de limits.conf

| Campo | Valores |
|-------|---------|
| Dominio | `usuario`, `@grupo`, `*` (todos) |
| Tipo | `soft`, `hard`, `-` (ambos) |
| Elemento | `nproc`, `nofile`, `core`, `maxlogins`, `memlock`, `as` |

## Comandos de gestión y depuración

| Comando | Descripción |
|---------|-------------|
| `pam_tally2 --user=usuario` | Ver intentos fallidos de un usuario |
| `pam_tally2 --user=usuario --reset` | Resetear contador de fallos |
| `faillock --user usuario` | Ver intentos fallidos (moderno) |
| `faillock --user usuario --reset` | Resetear contador (moderno) |
| `ulimit -a` | Ver límites actuales del shell |

## Ubicación de los módulos PAM

| Sistema | Ruta |
|---------|------|
| Debian/Ubuntu (64-bit) | `/lib/x86_64-linux-gnu/security/` |
| RHEL/CentOS (64-bit) | `/lib64/security/` |
