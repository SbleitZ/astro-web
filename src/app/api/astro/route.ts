import path from 'path';
import fs from 'fs/promises';
import { pipeline } from 'stream';
import { promisify } from 'util';
// funcion que revisa astro y retorna segun el link generado



export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const html = formData.get('html') as string;
    const hash = formData.get('hash') as string;

    if (!html || !hash) {
      return new Response(JSON.stringify({ ok: false, error: 'Falta html o hash' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Filtrar archivos
    const files: File[] = [];
    for (const [_, value] of formData.entries()) {
      if (value instanceof File) files.push(value);
    }

    const outputDir = path.join('public', 'astro', 'output_' + hash);
    const imagesDir = path.join(outputDir, 'images');

    // Crear directorios
    await fs.mkdir(imagesDir);

    // Guardar HTML
    const pathHTML = path.join(outputDir, 'index.html');
    await fs.writeFile(pathHTML, html, 'utf-8');
    console.log('HTML guardado en:', pathHTML);

    // Guardar imágenes
    for (const file of files) {
      const filePath = path.join(imagesDir, file.name);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      console.log('Imagen guardada correctamente:', filePath);
    }

    return new Response(JSON.stringify({ ok: true, hash, files: files.map(f => f.name) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error en POST:', err);
    return new Response(JSON.stringify({ ok: false, error: 'Error al guardar archivos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}