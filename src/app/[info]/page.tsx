interface PageProps {
  params: { info: string };
}

export default async function Page({ params }: PageProps) {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: 'white', minHeight: '100vh', width: '100%' }}
    >
      <iframe
        style={{ minHeight: '100vh', width: '100%' }}
        src={`/api/astro?hash=${params.info}`}
      ></iframe>
    </div>
  );
}
