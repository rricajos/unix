# 102.1 - Diseno de disco duro

## Peso: 2

## Objetivo del examen

Disenar un esquema de particionado de disco para un sistema Linux. Esto incluye asignar sistemas de archivos y espacio de intercambio (swap) a particiones o discos separados, y adaptar el diseno a la finalidad prevista del sistema. Tambien incluye conocer las caracteristicas basicas de LVM.

## Conocimientos clave

- Alinear sistemas de archivos y espacio swap a particiones y discos separados
- Adaptar el diseno a la finalidad del sistema
- Asegurar que la particion /boot cumple los requisitos de la arquitectura de hardware para el arranque
- Conocimiento de las caracteristicas basicas de LVM (volumenes fisicos, grupos de volumenes, volumenes logicos)
- Diferencias entre MBR y GPT
- EFI System Partition (ESP)

## Archivos, terminos y utilidades

- `/` (raiz)
- `/var`
- `/home`
- `/boot`
- `/tmp`
- `/usr`
- EFI System Partition (ESP)
- swap (espacio de intercambio)
- Puntos de montaje
- Particiones (primarias, extendidas, logicas)
- LVM (PV, VG, LV)
- `fdisk`
- `gdisk`
- `parted`
- `/etc/fstab`
- `mkswap`
- `swapon`

## Contenido

| Recurso | Estado |
|---------|--------|
| [Teoria](notas/teoria.md) | Completo |
| [Comandos clave](notas/comandos-clave.md) | Completo |
| [Ejercicios](ejercicios/ejercicios.md) | Completo |
