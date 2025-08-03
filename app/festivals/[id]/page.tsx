import { Festival } from '@/lib/types';
import FestivalDetail from '@/components/FestivalDetail';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// Generate static params for all festival IDs
export async function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'festivals_2025_2026.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return data.festivals.map((festival: Festival) => ({
      id: festival.id,
    }));
  } catch (error) {
    console.error('Error loading festivals for static generation:', error);
    return [];
  }
}

// Get festival data for the specific ID
async function getFestival(id: string): Promise<Festival | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'festivals_2025_2026.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return data.festivals.find((festival: Festival) => festival.id === id) || null;
  } catch (error) {
    console.error('Error loading festival:', error);
    return null;
  }
}

export default async function FestivalPage({ params }: { params: { id: string } }) {
  const festival = await getFestival(params.id);

  if (!festival) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <FestivalDetail festival={festival} />
    </div>
  );
}