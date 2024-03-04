import Head from 'next/head';

export default function Metatags({
  title = 'BlogsKraft',
  description = 'A Social Blogging website',
}) {
  return (
    <div>
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="blogskraft" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image"/>
      
    </Head>
    </div>
  );
}
