// src/pages/portfolio/[slug].tsx
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, Cpu, CheckCircle, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { getProjectBySlug, getAllProjectSlugs, type Project } from '../../lib/markdown';
import { imgSrc } from '../../lib/utils';

interface Props {
  project: Project;
}

const STATUS_CONFIG = {
  completed: { label: 'Completed', color: 'text-green-400 border-green-400/30 bg-green-400/10', icon: CheckCircle },
  ongoing: { label: 'Ongoing', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10', icon: Clock },
  archived: { label: 'Archived', color: 'text-dark-400 border-dark-600 bg-dark-700/50', icon: Cpu },
};

export default function ProjectCaseStudy({ project }: Props) {
  const statusCfg = STATUS_CONFIG[project.status];
  const StatusIcon = statusCfg.icon;

  return (
    <Layout>
      <Head>
        <title>{project.title} — Case Study | RaiJen</title>
        <meta name="description" content={project.excerpt} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.excerpt} />
        {project.coverImage && <meta property="og:image" content={project.coverImage} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TechArticle',
              headline: project.title,
              description: project.excerpt,
              datePublished: project.date,
              author: { '@type': 'Person', name: 'RaiJen' },
            }),
          }}
        />
      </Head>

      {/* Hero */}
      <div className="relative w-full">
        {project.coverImage ? (
          <div className="w-full h-64 md:h-96 overflow-hidden relative">
            <img
              src={imgSrc(project.coverImage)}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-dark-800 to-dark-900 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute inset-0 bg-radial-glow opacity-40" />
          </div>
        )}
      </div>

      <article className="section">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back */}
          <Link href="/portfolio" className="btn-ghost pl-0 mb-8 inline-flex -mt-4">
            <ArrowLeft size={14} />
            Kembali ke Portfolio
          </Link>

          {/* Header card */}
          <div className="card-glow mb-10">
            {/* Category & Status */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-mono text-primary-500 border border-primary-500/30 px-2 py-1">
                {project.category}
              </span>
              <span className={`text-xs font-mono border px-2 py-1 flex items-center gap-1 ${statusCfg.color}`}>
                <StatusIcon size={10} />
                {statusCfg.label}
              </span>
              {project.date && (
                <span className="text-xs font-mono text-dark-400 flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(project.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark-50 mb-4">
              {project.title}
            </h1>

            {/* Excerpt */}
            <p className="text-dark-200 leading-relaxed mb-6">
              {project.excerpt}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map(t => (
                <span key={t} className="skill-badge">{t}</span>
              ))}
            </div>

            {/* Tags & Links */}
            <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-dark-700">
              <div className="flex flex-wrap gap-2 flex-1">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono text-dark-500 flex items-center gap-1">
                    <Tag size={9} />
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Github size={13} />
                    Source Code
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <ExternalLink size={13} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Markdown Content */}
          <div
            className="prose-dark"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />

          {/* Footer author card */}
          <div className="mt-14 pt-8 border-t border-dark-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-primary-500 font-bold text-lg">RJ</span>
              </div>
              <div className="flex-1">
                <p className="font-heading font-semibold text-dark-50">Rangga Prasetya Adiwijaya</p>
                <p className="text-dark-400 text-sm">Robotics Engineer & AI Developer · Institut Teknologi PLN</p>
              </div>
              <div className="flex gap-3">
                <Link href="/portfolio" className="btn-outline text-xs">
                  Semua Project
                </Link>
                <a
                  href="https://wa.me/6288971759690?text=Halo%20Rangga!%20Saya%20tertarik%20dengan%20project%20kamu."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs"
                >
                  Diskusi Project
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllProjectSlugs();
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = await getProjectBySlug(params?.slug as string);
  if (!project) return { notFound: true };
  return { props: { project } };
};
