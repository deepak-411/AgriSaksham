"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  diagnoseCropDisease,
  type DiagnoseCropDiseaseOutput,
} from '@/ai/flows/crop-disease-diagnosis';
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
import Image from 'next/image';

const formSchema = z.object({
  photo:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((files) => files?.length === 1, 'Image is required.')
          .refine(
            (files) => files?.[0]?.type.startsWith('image/'),
            'Must be an image file.'
          )
          .refine(
            (files) => files?.[0]?.size <= 5000000,
            `Max file size is 5MB.`
          ),
});

export function CropDoctor() {
  const [result, setResult] = useState<DiagnoseCropDiseaseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: undefined,
    },
  });

  const fileRef = form.register('photo');

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
      const file = data.photo[0];
      const photoDataUri = await fileToDataUri(file);

      const diagnosisResult = await diagnoseCropDisease({ photoDataUri });
      setResult(diagnosisResult);
    } catch (error) {
      console.error('Diagnosis failed:', error);
      toast({
        title: 'Diagnosis Failed',
        description: 'An error occurred while analyzing the image. Please try again.',
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
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crop Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    {...fileRef}
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      if (e.target.files && e.target.files[0]) {
                        setPreview(URL.createObjectURL(e.target.files[0]));
                      } else {
                        setPreview(null);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Image Preview:</p>
              <Image
                src={preview}
                alt="Crop preview"
                width={200}
                height={200}
                className="rounded-md object-cover"
              />
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Diagnose Crop
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Analyzing image...</p>
        </div>
      )}

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Diagnosis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Identified Issue</h3>
              <p>{result.disease || 'No disease or pest identified.'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Confidence</h3>
              <p>{(result.confidence * 100).toFixed(2)}%</p>
            </div>
            <div>
              <h3 className="font-semibold">Recommendations</h3>
              <p className="whitespace-pre-wrap">{result.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
