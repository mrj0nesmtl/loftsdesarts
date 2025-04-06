import { Metadata } from 'next';
import { generateMetadata as baseGenerateMetadata } from '@/lib/seo';
import React from 'react';

export const metadata: Metadata = baseGenerateMetadata(
  'Contactez-Nous',
  'Contactez le conseil d\'administration des condominiums Lofts des Arts. Obtenez des informations sur l\'immeuble, les installations et les services.',
  '/lda_bg.png'
);

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <React.Fragment>{children}</React.Fragment>;
} 