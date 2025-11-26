import DynamicHomePage from '@/components/DynamicHomePage';

// Force dynamic rendering to avoid server-side cookie issues
export const dynamic = 'force-dynamic';

export default function Home() {
  // Move data fetching to client side to avoid server-side cookie issues
  return <DynamicHomePage projects={[]} />;
}


