
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div
      className="flex flex-col min-h-dvh bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://picsum.photos/1920/1080')`,
      }}
      data-ai-hint="rice paddy"
    >
      <div className="flex flex-col min-h-dvh bg-background/80 backdrop-blur-sm">
        <header className="p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-foreground">
                AgriSaksham
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary">
              SMART INDIA AI AGENT HACKATHON - 2025
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground">
              Team Name: Deep 2.0
            </p>
            <p className="mt-2 text-lg md:text-xl text-muted-foreground">
              Project Lead: Deepak Kumar
            </p>
            <Link href="/dashboard" passHref>
              <Button size="lg" className="mt-8">
                Start Project
              </Button>
            </Link>
          </div>
        </main>

        <footer className="p-4 border-t bg-card">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} AgriSaksham. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
