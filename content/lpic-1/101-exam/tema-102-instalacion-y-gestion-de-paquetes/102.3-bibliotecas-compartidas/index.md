---
title: "102.3 - Gestion de bibliotecas compartidas"
tags:
  - lpic-1
  - examen-101
  - tema-102
  - indice-subtema
tipo: indice-subtema
certificacion: lpic-1
examen: "101"
tema: "102"
subtema: "102.3"
---

# 102.3 - Gestion de bibliotecas compartidas

## Peso: 1

## Objetivo del examen

Determinar las bibliotecas compartidas de las que dependen los programas ejecutables e instalarlas cuando sea necesario. Comprender como el sistema localiza y carga las bibliotecas compartidas.

## Conocimientos clave

- Identificar bibliotecas compartidas
- Comprender los enlaces simbolicos tipicos de las bibliotecas del sistema
- Usar ldconfig y el cache de bibliotecas
- Configurar la ruta de busqueda de bibliotecas con LD_LIBRARY_PATH y ld.so.conf

## Archivos, terminos y utilidades

- `ldd`
- `ldconfig`
- `/etc/ld.so.conf`
- `/etc/ld.so.conf.d/`
- `/etc/ld.so.cache`
- `LD_LIBRARY_PATH`
- Bibliotecas compartidas (`.so`)
- Convencion de nombres: `libname.so.version`

## Contenido

| Recurso | Estado |
|---------|--------|
| [Teoria](notas/teoria.md) | Completo |
| [Comandos clave](notas/comandos-clave.md) | Completo |
| [Ejercicios](ejercicios/ejercicios.md) | Completo |
