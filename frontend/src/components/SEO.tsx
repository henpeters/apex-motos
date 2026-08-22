import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_TITLE = 'Apex Motors — Premium Auto Parts & Master Garage';
const DEFAULT_DESC =
  'Discover high-performance auto parts, OEM replacements, ceramic brakes, coilovers, diagnostic tools, and master garage services at Apex Motors.';
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
}) => {
  useEffect(() => {
    const pageTitle = title ? `${title} | Apex Motors` : DEFAULT_TITLE;
    const pageDesc = description || DEFAULT_DESC;
    const pageImg = image || DEFAULT_IMAGE;
    const pageUrl = url || window.location.href;

    document.title = pageTitle;

    const updateMeta = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith('meta[property=')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1];
          if (prop) element.setAttribute('property', prop);
        } else if (selector.startsWith('meta[name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('meta[name="title"]', pageTitle);
    updateMeta('meta[name="description"]', pageDesc);

    // Open Graph
    updateMeta('meta[property="og:title"]', pageTitle);
    updateMeta('meta[property="og:description"]', pageDesc);
    updateMeta('meta[property="og:image"]', pageImg);
    updateMeta('meta[property="og:image:secure_url"]', pageImg);
    updateMeta('meta[property="og:url"]', pageUrl);
    updateMeta('meta[property="og:type"]', type);

    // Twitter Card
    updateMeta('meta[name="twitter:title"]', pageTitle);
    updateMeta('meta[name="twitter:description"]', pageDesc);
    updateMeta('meta[name="twitter:image"]', pageImg);
  }, [title, description, image, url, type]);

  return null;
};

export default SEO;
