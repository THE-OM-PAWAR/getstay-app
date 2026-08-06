import { redirect } from 'next/navigation';

export default function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Redirect to new explore page with query parameter
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  
  if (query) {
    redirect(`/explore?query=${encodeURIComponent(query)}`);
  }
  
  redirect('/explore');
}
