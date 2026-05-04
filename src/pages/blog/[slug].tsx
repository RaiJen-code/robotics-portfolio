// src/pages/blog/[slug].tsx
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowLeft, Clock, Tag, Share2, Play } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { getPostBySlug, getAllPostSlugs, type Post } from '../../lib/markdown';
import { imgSrc } from '../../lib/utils';

interface Props {
  post: Post;
}

function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export default function BlogPost({ post }: Props) {
  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('URL disalin ke clipboard!');
    }
  }

  return (
    <Layout>
      <Head>
        <title>{post.title} — aRJey Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        {/* Structured data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { '@type': 'Person', name: 'Rangga Prasetya' },
          image: post.coverImage,
        })}} />
      </Head>

      <article className="section">
        <div className="max-w-3xl mx-auto px-4">
          {/* Back link */}
          <Link href="/blog" className="btn-ghost pl-0 mb-8 inline-flex">
            <ArrowLeft size={14} />
            Kembali ke Blog
          </Link>

          {/* Cover image */}
          {post.coverImage && (
            <div className="w-full h-64 md:h-80 bg-dark-800 border border-dark-700 mb-8 overflow-hidden">
              <img
                src={imgSrc(post.coverImage || '')}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="text-xs font-mono text-primary-500 border border-primary-500/30 px-2 py-1">
              {post.category}
            </span>
            <span className="text-xs font-mono text-dark-400 flex items-center gap-1">
              <Clock size={10} />
              {post.readTime} min read
            </span>
            <span className="text-xs font-mono text-dark-500">
              {post.date && format(new Date(post.date), 'd MMMM yyyy', { locale: id })}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark-50 mb-4 text-balanced">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-dark-700">
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="text-xs font-mono text-dark-400 hover:text-primary-500 transition-colors flex items-center gap-1"
              >
                <Tag size={10} />
                {tag}
              </Link>
            ))}
            <button
              onClick={handleShare}
              className="ml-auto text-dark-400 hover:text-primary-500 transition-colors flex items-center gap-1 text-xs font-mono"
            >
              <Share2 size={10} />
              Bagikan
            </button>
          </div>

          {/* Video embed */}
          {post.videoUrl && toEmbedUrl(post.videoUrl) && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <Play size={12} className="text-primary-500" />
                <span className="text-xs font-mono text-primary-500 uppercase tracking-widest">Video Demonstrasi</span>
              </div>
              <div className="relative w-full border border-dark-700 overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={toEmbedUrl(post.videoUrl)!}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div
            className="prose-dark"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-dark-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                <span className="font-display text-primary-500 font-bold">RJ</span>
              </div>
              <div>
                <p className="font-heading font-semibold text-dark-50">aRJey</p>
                <p className="text-dark-400 text-sm">Robotics Engineer & AI Developer</p>
              </div>
              <Link href="/about" className="ml-auto btn-outline text-xs">
                Tentang Saya
              </Link>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPostSlugs();
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostBySlug(params?.slug as string);
  if (!post) return { notFound: true };
  return { props: { post } };
};
