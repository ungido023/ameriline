#!/usr/bin/env python3
"""
Script para remover el fondo blanco de la imagen del logo
"""

from PIL import Image
import numpy as np

# Abrir la imagen
img_path = 'assets/img/logo.png'
img = Image.open(img_path)

# Convertir a RGBA si no lo está
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Convertir a array numpy para procesamiento
data = np.array(img)

# Crear máscara para el fondo blanco
# White es (255, 255, 255), permitimos un pequeño margen de tolerancia
white_threshold = 250
white_mask = (data[:, :, 0] > white_threshold) & (data[:, :, 1] > white_threshold) & (data[:, :, 2] > white_threshold)

# Hacer transparente el fondo blanco
data[white_mask, 3] = 0

# Convertir de vuelta a imagen
result = Image.fromarray(data, 'RGBA')

# Guardar la imagen procesada
output_path = 'assets/img/logo.png'
result.save(output_path, 'PNG')

print(f"✓ Imagen procesada correctamente")
print(f"✓ Fondo blanco removido")
print(f"✓ Imagen guardada en: {output_path}")
