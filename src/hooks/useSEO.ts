import { useEffect } from 'react';

export interface SEOConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
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
}

/**
 * Hook para gerenciar meta tags SEO dinâmicas por página
 * Atualiza title, description, OG tags, Twitter tags, canonical URLs e schema markup
 */
export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    const previousTitle = document.title;
    
    // Atualizar title tag
    document.title = config.title;

    // Atualizar meta tags genéricas
    updateMetaTag('name', 'description', config.description);
    updateMetaTag('name', 'keywords', config.keywords || '');
    updateMetaTag('name', 'robots', config.robots || 'index, follow');

    // Atualizar Open Graph tags
    updateMetaTag('property', 'og:title', config.ogTitle || config.title);
    updateMetaTag('property', 'og:description', config.ogDescription || config.description);
    updateMetaTag('property', 'og:image', config.ogImage || 'https://mindvectors.com/og-image.jpg');
    updateMetaTag('property', 'og:url', config.canonicalUrl || window.location.href);
    updateMetaTag('property', 'og:type', config.ogType || 'website');

    // Atualizar Twitter tags
    updateMetaTag('name', 'twitter:title', config.twitterTitle || config.ogTitle || config.title);
    updateMetaTag('name', 'twitter:description', config.twitterDescription || config.ogDescription || config.description);
    updateMetaTag('name', 'twitter:image', config.twitterImage || config.ogImage || 'https://mindvectors.com/og-image.jpg');
    updateMetaTag('name', 'twitter:card', config.twitterCard || 'summary_large_image');

    // Atualizar canonical URL
    if (config.canonicalUrl) {
      updateLinkTag('canonical', config.canonicalUrl);
    }

    // Adicionar schema markups
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

/**
 * Função auxiliar para atualizar ou criar meta tags
 */
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

/**
 * Função auxiliar para atualizar ou criar link tags
 */
function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Função auxiliar para adicionar schema markup JSON-LD
 */
function addSchemaMarkup(schema: Record<string, any>): HTMLScriptElement {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-schema', 'true');
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
  return script;
}

/**
 * Gera schema de breadcrumb
 */
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

/**
 * Gera schema para Learning Resource
 */
export const generateLearningResourceSchema = (
  title: string,
  description: string,
  educationalLevel: string[] = ['High School', 'Undergraduate']
) => ({
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: title,
  description: description,
  inLanguage: 'pt-BR',
  educationalLevel: educationalLevel,
  author: {
    '@type': 'Organization',
    name: 'Vector Learn',
    url: 'https://mindvectors.com',
  },
});

/**
 * Gera schema para Educational Web Application
 */
export const generateEducationalAppSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalWebApplication',
  name: 'Vector Learn',
  alternateName: 'Mind Vectors',
  description:
    'Plataforma educacional para aprender vetores com visualizações 3D interativas',
  url: 'https://mindvectors.com',
  applicationCategory: 'Educational',
  about: {
    '@type': 'Thing',
    name: 'Vetores',
    description: 'Aprendizado de vetores, matemática e física',
  },
  creator: {
    '@type': 'Organization',
    name: 'Unijorge',
    url: 'https://unijorge.edu.br',
  },
  inLanguage: 'pt-BR',
});

/**
 * Gera schema para FAQ
 */
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

