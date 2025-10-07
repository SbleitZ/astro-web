import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const info = searchParams.get('hash')

    if (!info) {
      return new Response('Falta hash', { status: 400 })
    }

    const { data, error } = await supabase.storage
      .from('astro-pages')
      .download(`output_${info}/index.html`)

    if (error || !data) {
      return new Response('Archivo no encontrado', { status: 404 })
    }

    const htmlText = await data.text()

    return new Response(htmlText, {
      headers: { 'Content-Type': 'text/html' }
    })
  } catch (err) {
    console.error('Error GET HTML:', err)
    return new Response('Error interno', { status: 500 })
  }
}
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const html = formData.get('html') as string
    const hash = formData.get('hash') as string

    if (!html || !hash) {
      return Response.json({ ok: false, error: 'Falta html o hash' }, { status: 400 })
    }

    const htmlFile = new File([html], 'index.html', { type: 'text/html' })
const { error: htmlError } = await supabase.storage
  .from('astro-pages')       // nombre del bucket
  .upload(`output_${hash}/index.html`, htmlFile, { 
    upsert: true, 
    contentType: 'text/html'
  })
    if (htmlError) throw htmlError

    const files: File[] = []
    for (const [, value] of formData.entries()) {
      if (value instanceof File) files.push(value)
    }

    for (const file of files) {
      const { error } = await supabase.storage
        .from('astro-pages')
        .upload(`output_${hash}/images/${file.name}`, file, { upsert: true })

      if (error) throw error
    }

    return Response.json({ ok: true, hash, files: files.map(f => f.name) })
  } catch (err) {
    console.error('Error al subir a Supabase:', err)
    return Response.json({ ok: false, error: 'Error al subir archivos' }, { status: 500 })
  }
}