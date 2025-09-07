"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getMarketPrice,
  type GetMarketPriceOutput,
} from '@/ai/flows/voice-based-market-price';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Volume2 } from 'lucide-react';

const formSchema = z.object({
  crop: z.string().min(2, 'Crop name is required.'),
  dialect: z.string().min(2, 'Dialect or region is required.'),
});

export function MarketPrices() {
  const [result, setResult] = useState<GetMarketPriceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: '',
      dialect: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const priceResult = await getMarketPrice(data);
      setResult(priceResult);
    } catch (error) {
      console.error('Failed to get market price:', error);
      toast({
        title: 'Request Failed',
        description:
          'An error occurred while fetching market prices. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="crop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Wheat, Rice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dialect"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Region / Dialect</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Punjab, Marathi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Market Price
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Fetching latest prices...</p>
        </div>
      )}

      {result && (
        <Card className="mt-6 bg-primary/5">
          <CardHeader>
            <CardTitle>Market Price Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Latest Price</h3>
              <p className="text-2xl font-bold text-primary">
                {result.marketPrice}
              </p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                <span>AI Voice Response</span>
              </h3>
              <p className="text-muted-foreground italic">"{result.speech}"</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
