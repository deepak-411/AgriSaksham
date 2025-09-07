"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getFinancialSchemeAdvisory,
  type GetFinancialSchemeAdvisoryOutput,
} from '@/ai/flows/financial-scheme-advisory';
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
import { Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const formSchema = z.object({
  farmerDetails: z.string().min(10, 'Please describe your business idea and resources.'),
  schemeDetails: z.string().optional(),
});

export function EntrepreneurshipSupport() {
  const [result, setResult] = useState<GetFinancialSchemeAdvisoryOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmerDetails: '',
      schemeDetails: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const advisoryResult = await getFinancialSchemeAdvisory(data);
      setResult(advisoryResult);
    } catch (error) {
      console.error('Failed to get entrepreneurship advice:', error);
      toast({
        title: 'Request Failed',
        description:
          'An error occurred while fetching opportunities. Please try again.',
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
          <FormField
            control={form.control}
            name="farmerDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Business Idea & Resources</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your business idea, available resources (land, skills), target market, and any financial needs."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="schemeDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Support of Interest (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Microfinance, MUDRA loan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Find Opportunities
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">
            Finding opportunities for you...
          </p>
        </div>
      )}

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Entrepreneurship Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our AI has analyzed potential support mechanisms. Explore these government schemes that may align with your entrepreneurial goals.
            </p>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Potentially Eligible Schemes</AccordionTrigger>
                <AccordionContent>
                  <p className="whitespace-pre-wrap">{result.eligibleSchemes}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>AI Suggested Schemes & Pathways</AccordionTrigger>
                <AccordionContent>
                  <p className="whitespace-pre-wrap">{result.suggestedSchemes}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
