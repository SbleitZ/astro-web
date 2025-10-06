
interface PageProps {
  params: { info: string };
}

export default function Page({ params}: PageProps) {
  // hace una peticion a la api para obtener datos segun el parametro

  return (
    <div className="min-h-screen w-full" style={{background:'white',minHeight: '100vh', width: '100%'}}>
      <iframe style={{minHeight: '100vh', width: '100%'}} src={`/astro/output_${params.info}/index.html`} frameborder="0"></iframe>
    </div>
  );
}