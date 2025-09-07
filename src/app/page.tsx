import {
  Banknote,
  Droplets,
  Leaf,
  Lightbulb,
  LineChart,
  Stethoscope,
  Smartphone,
} from 'lucide-react';
import { FeatureCard } from '@/components/feature-card';
import { CropDoctor } from '@/components/crop-doctor';
import { ConservationPlanner } from '@/components/conservation-planner';
import { FinancialAdvisory } from '@/components/financial-advisory';
import { EntrepreneurshipSupport } from '@/components/entrepreneurship-support';
import { MarketPrices } from '@/components/market-prices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: 'AI Crop Doctor',
    description:
      'Upload an image of your crop to get an AI-powered diagnosis for pests and diseases, along with treatment recommendations.',
    component: <CropDoctor />,
  },
  {
    icon: <LineChart className="w-8 h-8" />,
    title: 'Mandi Price Forecasts',
    description:
      'Get the latest market prices for your crops. Our AI provides forecasts, accessible even in regional dialects.',
    component: <MarketPrices />,
  },
  {
    icon: <Droplets className="w-8 h-8" />,
    title: 'Sustainable Farming Planner',
    description:
      'Receive AI-driven suggestions for water and soil conservation based on your local environmental data.',
    component: <ConservationPlanner />,
  },
  {
    icon: <Banknote className="w-8 h-8" />,
    title: 'Financial Scheme Advisory',
    description:
      'Discover government financial schemes you are eligible for, with personalized advice from our AI agent.',
    component: <FinancialAdvisory />,
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'Rural Entrepreneurship',
    description:
      'Explore market linkages, microfinance options, and new business opportunities tailored for rural entrepreneurs.',
    component: <EntrepreneurshipSupport />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            AgriSaksham
          </h1>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-16 text-center bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary">
              Empowering Rural India with AI
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Your AI-powered companion for smarter farming, financial guidance,
              and sustainable growth.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                >
                  {feature.component}
                </FeatureCard>
              ))}
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="bg-primary/10 text-primary p-3 rounded-full">
                      <Smartphone className="w-8 h-8" />
                    </span>
                    <CardTitle>Mobile First & Offline Ready</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <p className="text-muted-foreground">
                    Designed for accessibility in rural areas, our platform is
                    optimized for mobile and includes offline capabilities to
                    ensure you have critical information anytime, anywhere.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-4 border-t bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AgriSaksham. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
