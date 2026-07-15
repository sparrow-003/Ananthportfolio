import { Helmet } from 'react-helmet-async';
import { memo } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile';
}

const SITE = 'https://ananthdev.vercel.app';
const DEFAULT_IMG = 'https://storage.googleapis.com/gpt-engineer-file-uploads/pVRlcc1ueBZGUVdOd2L5tUw2IOX2/social-images/social-1760279829781-1740320840665.jpg';
const DEFAULT_IMG_ALT = 'Ananth N — Full-Stack Developer & AI Engineer Portfolio Preview';

const Seo = memo(({
  title = 'ANANTH.DEV | Full-Stack Developer & AI Engineer Portfolio',
  description = 'Ananth N — Full-stack developer & AI engineer crafting seamless web and AI solutions. Python, React, TypeScript expert. Hire me for your next project.',
  path = '/',
  image = DEFAULT_IMG,
  imageAlt = DEFAULT_IMG_ALT,
  type = 'website',
}: SeoProps) => {
  const url = `${SITE}${path}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'profile' ? 'Person' : 'WebPage',
    name: title,
    description,
    url,
    image,
    author: {
      '@type': 'Person',
      name: 'Ananth N',
      url: SITE,
      jobTitle: 'Full-Stack Developer & AI Engineer',
      sameAs: [
        'https://www.linkedin.com/in/ananth-n-583036233',
        'https://github.com/sparrow-003',
        'https://www.instagram.com/_alexxz_0',
      ],
    },
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ANANTH.DEV" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
});

Seo.displayName = 'Seo';
export default Seo;
