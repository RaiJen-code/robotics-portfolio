// src/pages/blog/index.tsx
import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, Tag, Clock, ArrowRight, BookOpen } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { getAllPosts, getAllTags, getAllCategories, type PostMeta } from '../../lib/markdown';
import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Props {
  posts: PostMeta[];
  tags: string[];
  categories: string[];
}

const POSTS_PER_PAGE = 6;

export default function BlogIndex({ posts, tags, categories }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTag, setActiveTag] = useState('');
  const [page, setPage] = useState(1);

  // Client-side filtering
  const filtered = useMemo(() => {
    return posts.filter(post => {
      const matchSearch = !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchTag = !activeTag || post.tags.includes(activeTag);

      return matchSearch && matchCategory && matchTag;
    });
  }, [posts, search, activeCategory, activeTag]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  function resetFilters() {
    setSearch('');
    setActiveCategory('All');
    setActiveTag('');
    setPage(1);
  }

  return (
    <Layout>
      <Head>
        <title>Blog — aRJey | Robotics, AI, Embedded Systems</title>
        <meta name="description" content="Artikel teknikal tentang robotics, embedded systems, AI, dan engineering dari aRJey — Rangga Prasetya." />
      </Head>

      <div className="section">
        <div className="section-inner">
          {/* Header */}
          <div className="mb-12">
            <p className="section-label">Blog</p>
            <h1 className="section-title">
              Engineering <span className="text-gradient">Insights</span>
            </h1>
            <p className="section-subtitle">
              Tutorial, case study, dan catatan teknikal tentang robotics, AI, dan embedded systems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-mono text-xs text-dark-400 mb-3 tracking-widest uppercase">Search</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Cari artikel..."
                    className="w-full bg-dark-800 border border-dark-600 pl-9 pr-4 py-2.5 text-sm font-body text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary-500/60 transition-colors"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-mono text-xs text-dark-400 mb-3 tracking-widest uppercase">Kategori</h3>
                <div className="space-y-1">
                  {['All', ...categories].map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setPage(1); }}
                      className={`w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                        activeCategory === cat
                          ? 'text-primary-500 bg-primary-500/10 border-l-2 border-primary-500'
                          : 'text-dark-300 hover:text-dark-100 border-l-2 border-transparent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-mono text-xs text-dark-400 mb-3 tracking-widest uppercase">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setActiveTag(activeTag === tag ? '' : tag);
                        setPage(1);
                      }}
                      className={`px-2 py-1 text-xs font-mono border transition-all ${
                        activeTag === tag
                          ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                          : 'border-dark-600 text-dark-400 hover:border-dark-400'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {(search || activeCategory !== 'All' || activeTag) && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-mono text-dark-400 hover:text-primary-500 transition-colors underline"
                >
                  Reset filter
                </button>
              )}
            </aside>

            {/* Post list */}
            <div className="lg:col-span-3">
              {paginated.length === 0 ? (
                <div className="card text-center py-16">
                  <BookOpen size={32} className="text-dark-600 mx-auto mb-3" />
                  <p className="text-dark-300 font-body">Tidak ada artikel yang cocok.</p>
                  <button onClick={resetFilters} className="btn-ghost mt-4 text-sm">
                    Reset filter
                  </button>
                </div>
              ) : (
                <>
                  <p className="font-mono text-xs text-dark-500 mb-6">
                    Menampilkan {filtered.length} artikel
                    {(search || activeCategory !== 'All' || activeTag) && (
                      <span className="text-primary-500 ml-1">(difilter)</span>
                    )}
                  </p>

                  <div className="space-y-4">
                    {paginated.map(post => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="card-glow block group"
                      >
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs font-mono text-primary-500 border border-primary-500/30 px-2 py-0.5">
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
                        <h2 className="font-heading text-lg font-semibold text-dark-50 group-hover:text-primary-500 transition-colors mb-2">
                          {post.title}
                        </h2>
                        <p className="text-dark-300 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map(t => (
                              <span key={t} className="text-xs font-mono text-dark-500">#{t}</span>
                            ))}
                          </div>
                          <span className="text-xs text-dark-500 group-hover:text-primary-500 transition-colors flex items-center gap-1 font-mono">
                            Baca <ArrowRight size={10} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex gap-2 mt-8 justify-center">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 font-mono text-sm border transition-all ${
                            page === p
                              ? 'bg-primary-500 border-primary-500 text-dark-900'
                              : 'border-dark-600 text-dark-400 hover:border-primary-500/50 hover:text-primary-500'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();
  const tags = getAllTags();
  const categories = getAllCategories();

  return {
    props: { posts, tags, categories },
  };
};
