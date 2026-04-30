// src/pages/portfolio/index.tsx
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Github, ExternalLink, Cpu, ArrowRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { getAllProjects, type ProjectMeta } from '../../lib/markdown';

const CATEGORIES = ['All', 'Robotics', 'AI', 'IoT', 'Mechanical Design', 'Embedded'];

const STATUS_COLORS = {
  completed: 'text-green-400 border-green-400/30',
  ongoing: 'text-yellow-400 border-yellow-400/30',
  archived: 'text-dark-400 border-dark-600',
};

interface Props {
  projects: ProjectMeta[];
}

export default function PortfolioPage({ projects }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <Layout>
      <Head>
        <title>Portfolio — RaiJen | Robotics, AI, IoT Projects</title>
        <meta name="description" content="Portfolio project RaiJen: robotics, AI, IoT, dan mechanical design." />
      </Head>

      <div className="section">
        <div className="section-inner">
          <div className="mb-12">
            <p className="section-label">Portfolio</p>
            <h1 className="section-title">
              Project & <span className="text-gradient">Case Study</span>
            </h1>
            <p className="section-subtitle">
              Kumpulan proyek robotics, AI, IoT, dan desain mekanikal yang pernah saya kerjakan.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1 text-[10px] opacity-60">
                    ({projects.filter(p => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="font-mono text-xs text-dark-500 mb-6">
            {filtered.length} project ditemukan
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="card text-center py-16">
              <Cpu size={32} className="text-dark-600 mx-auto mb-3" />
              <p className="text-dark-300">Belum ada project di kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(project => (
                <div key={project.slug} className="card-glow group flex flex-col">
                  {/* Cover */}
                  <div className="w-full h-44 bg-dark-700 border border-dark-600 mb-4 relative overflow-hidden">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Cpu size={36} className="text-dark-600" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {project.featured && (
                        <span className="px-2 py-0.5 bg-primary-500 text-dark-900 text-xs font-mono font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 text-xs font-mono border bg-dark-900/80 ${STATUS_COLORS[project.status]}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <span className="text-xs font-mono text-primary-500 mb-2">{project.category}</span>

                  {/* Title */}
                  <h3 className="font-heading font-semibold text-dark-50 group-hover:text-primary-500 transition-colors mb-2">
                    {project.title}
                  </h3>

                  <p className="text-dark-300 text-sm line-clamp-2 mb-4 flex-1">
                    {project.excerpt}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech.slice(0, 4).map(t => (
                      <span key={t} className="skill-badge text-xs py-0.5">{t}</span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="skill-badge text-xs py-0.5">+{project.tech.length - 4}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-dark-700">
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="flex-1 text-center text-xs font-mono text-dark-300 hover:text-primary-500 transition-colors flex items-center justify-center gap-1"
                    >
                      Case Study <ArrowRight size={10} />
                    </Link>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark-400 hover:text-primary-500 transition-colors"
                      >
                        <Github size={14} />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark-400 hover:text-primary-500 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const projects = getAllProjects();
  return { props: { projects } };
};
