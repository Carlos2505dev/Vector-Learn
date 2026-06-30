import { useEffect } from 'react';

export interface SEOConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  ogType?: 'website' | 'article' | 'profile' | 'course';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  keywords?: string;
  robots?: string;
  breadcrumbSchema?: Record<string, any>;
  articleSchema?: Record<string, any>;
  faqSchema?: Record<string, any>;
  learningResourceSchema?: Record<string, any>;
  courseSchema?: Record<string, any>;
  educationalLevel?: string[];
  learningResourceType?: string;
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    const previousTitle = document.title;
    
    document.title = config.title;

    updateMetaTag('name', 'description', config.description);
    updateMetaTag('name', 'keywords', config.keywords || '');
    updateMetaTag('name', 'robots', config.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    updateMetaTag('property', 'og:title', config.ogTitle || config.title);
    updateMetaTag('property', 'og:description', config.ogDescription || config.description);
    updateMetaTag('property', 'og:image', config.ogImage || 'https://vectorslearn.vercel.app/og-image.jpg');
    updateMetaTag('property', 'og:image:width', (config.ogImageWidth || 1200).toString());
    updateMetaTag('property', 'og:image:height', (config.ogImageHeight || 630).toString());
    if (config.ogImageAlt) {
      updateMetaTag('property', 'og:image:alt', config.ogImageAlt);
    }
    updateMetaTag('property', 'og:url', config.canonicalUrl || window.location.href);
    updateMetaTag('property', 'og:type', config.ogType || 'website');
    updateMetaTag('property', 'og:site_name', 'Vector Learn');
    updateMetaTag('property', 'og:locale', 'pt_BR');

    updateMetaTag('name', 'twitter:title', config.twitterTitle || config.ogTitle || config.title);
    updateMetaTag('name', 'twitter:description', config.twitterDescription || config.ogDescription || config.description);
    updateMetaTag('name', 'twitter:image', config.twitterImage || config.ogImage || 'https://vectorslearn.vercel.app/og-image.jpg');
    updateMetaTag('name', 'twitter:card', config.twitterCard || 'summary_large_image');
    updateMetaTag('name', 'twitter:site', '@vectorlearn');
    updateMetaTag('name', 'twitter:creator', '@vectorlearn');

    if (config.canonicalUrl) {
      updateLinkTag('canonical', config.canonicalUrl);
    }

    const schemaScripts: HTMLScriptElement[] = [];
    
    if (config.breadcrumbSchema) schemaScripts.push(addSchemaMarkup(config.breadcrumbSchema));
    if (config.articleSchema) schemaScripts.push(addSchemaMarkup(config.articleSchema));
    if (config.faqSchema) schemaScripts.push(addSchemaMarkup(config.faqSchema));
    if (config.learningResourceSchema) schemaScripts.push(addSchemaMarkup(config.learningResourceSchema));
    if (config.courseSchema) schemaScripts.push(addSchemaMarkup(config.courseSchema));

    return () => {
      document.title = previousTitle;
      schemaScripts.forEach(script => script.remove());
    };
  }, [config]);
};

function updateMetaTag(attr: 'name' | 'property', value: string, content: string) {
  if (!content) return;
  
  let element = document.querySelector(`meta[${attr}="${value}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function addSchemaMarkup(schema: Record<string, any>): HTMLScriptElement {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-schema', 'true');
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
  return script;
}

export const generateBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateLearningResourceSchema = (
  title: string,
  description: string,
  educationalLevel: string[] = ['High School', 'Undergraduate'],
  learningResourceType: string[] = ['Lesson', 'Simulation', 'Exercise']
) => ({
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: title,
  description: description,
  inLanguage: 'pt-BR',
  educationalLevel: educationalLevel,
  learningResourceType: learningResourceType,
  interactivityType: 'mixed',
  isFamilyFriendly: true,
  author: {
    '@type': 'Organization',
    name: 'Vector Learn',
    url: 'https://vectorslearn.vercel.app',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Vector Learn',
    logo: {
      '@type': 'ImageObject',
      url: 'https://vectorslearn.vercel.app/logomarca.webp'
    }
  },
  accessibilitySummary: 'Acessível em dispositivos móveis e desktop, com conteúdo visual e interativo.'
});

export const generateEducationalAppSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalWebApplication',
  name: 'Vector Learn',
  alternateName: 'Vector Learn - Aprenda Vetores',
  description:
    'Plataforma educacional revolucionária para aprender vetores matemática através de visualizações 2D/3D interativas, simuladores e exercícios práticos.',
  url: 'https://vectorslearn.vercel.app',
  applicationCategory: 'Educational',
  educationalLevel: ['High School', 'Undergraduate', 'Vocational'],
  educationalUse: ['Teaching', 'Learning', 'Practice', 'Simulation'],
  about: [
    {
      '@type': 'Thing',
      name: 'Vetores Matemática',
      description: 'Vetores, soma, produto escalar, produto vetorial, geometria analítica'
    },
    {
      '@type': 'Thing',
      name: 'Física',
      description: 'Física vetorial, mecânica, cinemática'
    }
  ],
  creator: {
    '@type': 'Organization',
    name: 'Vector Learn',
    url: 'https://vectorslearn.vercel.app',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock'
  },
  inLanguage: 'pt-BR',
  isFamilyFriendly: true
});

export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const generateCourseSchema = (
  title: string,
  description: string,
  courseUrl: string,
  provider: string = 'Vector Learn',
  providerUrl: string = 'https://vectorslearn.vercel.app',
  educationalLevel: string[] = ['High School', 'Undergraduate']
) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: title,
  description: description,
  url: courseUrl,
  provider: {
    '@type': 'Organization',
    name: provider,
    url: providerUrl
  },
  educationalLevel: educationalLevel,
  inLanguage: 'pt-BR',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    instructor: {
      '@type': 'Organization',
      name: provider,
      url: providerUrl
    }
  }
});

