"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  suggestSustainablePractices,
  type SustainablePracticeOutput,
} from '@/ai/flows/sustainable-practice-suggestion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  region: z.string().min(2, 'Region is required.'),
  crops: z.string().min(2, 'Crops are required.'),
  soilType: z.string().min(2, 'Soil type is required.'),
  waterAvailability: z.string().min(2, 'Water availability is required.'),
  climate: z.string().min(2, 'Climate is required.'),
  environmentalData:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((files) => files?.length === 1, 'Data file is required.'),
});

export function ConservationPlanner() {
  const [result, setResult] = useState<SustainablePracticeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const file = data.environmentalData[0];
      const environmentalDataUri = await fileToDataUri(file);

      const planResult = await suggestSustainablePractices({
        ...data,
        environmentalDataUri,
      });
      setResult(planResult);
    } catch (error) {
      console.error('Planning failed:', error);
      toast({
        title: 'Planning Failed',
        description: 'An error occurred while generating suggestions. Please try again.',
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region/Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Malwa, Punjab" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crops"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crops Cultivated</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cotton, Sugarcane" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Alluvial, Black" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="climate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Climate</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tropical, Arid" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="waterAvailability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water Availability</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe water availability (e.g., abundant, scarce, seasonal monsoon)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="environmentalData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Environmental Data File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Suggestions
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Generating conservation plan...</p>
        </div>
      )}

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sustainable Practice Suggestions</CardTitle>
            <CardDescription>
              Based on your provided data, here are some AI-powered recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground">
                <p className="whitespace-pre-wrap">{result.suggestions}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
