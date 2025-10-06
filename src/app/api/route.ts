
export async function GET() {
  const data = { message: 'Hello, world!' }
  return Response.json({ data })
}
