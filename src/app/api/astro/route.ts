import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
import { pipeline } from 'stream';
import { promisify } from 'util';
// funcion que revisa astro y retorna segun el link generado
const pipe = promisify(pipeline);
export async function GET(request:Request) {
  const { searchParams } = new URL(request.url);
  const info = searchParams.get('hash');
  // puedo acortar el tamaño del hash?
  fs.readFile(`public/astro/output_${info}/index.html`, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading HTML file:', err);

    } else {
      console.log('HTML file content:', data);
      return Response.json({ html: data });
    }
  });
}


export async function POST(request: Request) {
  const formData = await request.formData();

  const html = formData.get('html') as string;
  const hash = formData.get('hash') as string;

  const files: File[] = [];
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) files.push(value);
  }

  const outputDir = path.join('public', 'astro', 'output_' + hash);
  const imagesDir = path.join(outputDir, 'images');

  // Crear directorios
  await fsPromises.mkdir(imagesDir, { recursive: true });

  // Guardar HTML
  const pathHTML = path.join(outputDir, 'index.html');
  await fsPromises.writeFile(pathHTML, html);
  console.log('HTML guardado en:', pathHTML);

  // Guardar imágenes
  for (const file of files) {
    const filePath = path.join(imagesDir, file.name);
    const readable = file.stream();
    await pipe(readable, fs.createWriteStream(filePath));
    console.log('Imagen guardada correctamente:', filePath);
  }

  return Response.json({ ok: true, hash, files: files.map(f => f.name) });
}