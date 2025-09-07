"use client";

import type { ReactNode } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

export function FeatureCard({
  icon,
  title,
  description,
  children,
}: FeatureCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <span className="bg-primary/10 text-primary p-3 rounded-full">
                {icon}
              </span>
              <CardTitle>{title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
