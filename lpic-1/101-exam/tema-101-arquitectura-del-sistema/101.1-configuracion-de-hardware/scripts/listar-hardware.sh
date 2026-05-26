#!/bin/bash
# ============================================================================
# Tema: 101.1 - Configuracion de hardware
# Descripcion: Recopila informacion de hardware del sistema
# Certificacion: LPIC-1
# Autor: rricajos
# ============================================================================

# ADVERTENCIA: Este script es solo para fines educativos.
# Ejecutar en un entorno de pruebas.

set -euo pipefail

# --- Colores ---
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

separador() {
    echo -e "${BLUE}========================================${NC}"
}

titulo() {
    separador
    echo -e "${GREEN}  $1${NC}"
    separador
}

# --- Informacion del sistema ---

titulo "INFORMACION DE LA CPU"
if command -v lscpu &>/dev/null; then
    lscpu | head -20
else
    echo "lscpu no disponible, usando /proc/cpuinfo"
    grep -E "model name|cpu cores|cpu MHz" /proc/cpuinfo | sort -u
fi

echo ""
titulo "MEMORIA DEL SISTEMA"
if [ -f /proc/meminfo ]; then
    grep -E "MemTotal|MemFree|MemAvailable|SwapTotal|SwapFree" /proc/meminfo
fi

echo ""
titulo "DISPOSITIVOS DE BLOQUE"
if command -v lsblk &>/dev/null; then
    lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT
fi

echo ""
titulo "DISPOSITIVOS PCI"
if command -v lspci &>/dev/null; then
    lspci
else
    echo "lspci no disponible (instalar pciutils)"
fi

echo ""
titulo "DISPOSITIVOS USB"
if command -v lsusb &>/dev/null; then
    lsusb
else
    echo "lsusb no disponible (instalar usbutils)"
fi

echo ""
titulo "MODULOS DEL KERNEL CARGADOS (primeros 20)"
lsmod | head -21

echo ""
titulo "IRQs DEL SISTEMA"
if [ -f /proc/interrupts ]; then
    head -20 /proc/interrupts
fi

echo ""
titulo "PUERTOS DE E/S"
if [ -f /proc/ioports ]; then
    head -20 /proc/ioports
fi

echo ""
echo -e "${GREEN}Script ejecutado correctamente.${NC}"
