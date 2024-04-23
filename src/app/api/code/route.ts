import { getTutorial1 } from '@/projects';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const snapshot = await getTutorial1();

  return new Response(snapshot, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });
}
