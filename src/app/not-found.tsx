import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex justify-center items-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-center font-extrabold text-xl">Pagina no encontrada.</h1>
        <div>Es posible que el enlace que has seguido sea incorrecto o que se haya suprimido la página.</div>
        <Link href="/" className="text-sky-700"> Volver al inicio.</Link>
      </div>
    </main>
  );
}