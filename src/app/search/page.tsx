import { redirect } from 'next/navigation';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Redirect to new explore page with query parameter
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';
  
  if (query) {
    redirect(`/explore?query=${encodeURIComponent(query)}`);
  }
  
  redirect('/explore');
}
