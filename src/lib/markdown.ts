/**
 * markdown.ts — Utility untuk membaca konten Markdown dari /content folder
 * 
 * Sistem blog berbasis file: setiap post = satu file .md di /content/posts/
 * Format frontmatter (YAML di atas file markdown):
 * 
 * ---
 * title: "Judul Post"
 * date: "2024-01-15"
 * excerpt: "Ringkasan singkat"
 * tags: ["ROS2", "ESP32", "Tutorial"]
 * category: "Robotics"
 * coverImage: "/images/posts/robot-arm.jpg"
 * published: true
 * ---
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

// ── Types ─────────────────────────────────────────────────────────────

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  coverImage?: string;
  readTime?: number;
  published: boolean;
}

export interface Post extends PostMeta {
  content: string;         // Rendered HTML
  rawContent: string;      // Raw markdown (untuk preview)
}

export interface ProjectMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: 'Robotics' | 'AI' | 'IoT' | 'Mechanical Design' | 'Embedded';
  coverImage?: string;
  githubUrl?: string;
  demoUrl?: string;
  status: 'completed' | 'ongoing' | 'archived';
  featured: boolean;
  tech: string[];
}

export interface Project extends ProjectMeta {
  content: string;
}

// ── Paths ─────────────────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

// ── Markdown Renderer ─────────────────────────────────────────────────

function fixImagePaths() {
  return (tree: any) => {
    visit(tree, 'image', (node: any) => {
      if (node.url && node.url.startsWith('/') && BASE_PATH && !node.url.startsWith(BASE_PATH)) {
        node.url = BASE_PATH + node.url;
      }
    });
  };
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(fixImagePaths)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// ── Blog Posts ─────────────────────────────────────────────────────────

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx?$/, ''));
}

export function getAllPosts(options?: {
  category?: string;
  tag?: string;
  limit?: number;
  page?: number;
}): PostMeta[] {
  const slugs = getAllPostSlugs();
  
  const posts = slugs
    .map(slug => {
      const filePath = path.join(POSTS_DIR, `${slug}.md`);
      if (!fs.existsSync(filePath)) return null;
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        excerpt: data.excerpt || content.slice(0, 160) + '...',
        tags: data.tags || [],
        category: data.category || 'General',
        coverImage: data.coverImage ?? null,
        readTime: calculateReadTime(content),
        published: data.published !== false,
      } as PostMeta;
    })
    .filter((p): p is PostMeta => p !== null && p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let filtered = posts;
  
  if (options?.category) {
    filtered = filtered.filter(p => p.category === options.category);
  }
  
  if (options?.tag) {
    filtered = filtered.filter(p => p.tags.includes(options.tag!));
  }

  if (options?.page && options?.limit) {
    const start = (options.page - 1) * options.limit;
    filtered = filtered.slice(start, start + options.limit);
  } else if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  const htmlContent = await markdownToHtml(content);
  
  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    excerpt: data.excerpt || content.slice(0, 160) + '...',
    tags: data.tags || [],
    category: data.category || 'General',
    coverImage: data.coverImage ?? null,
    readTime: calculateReadTime(content),
    published: data.published !== false,
    content: htmlContent,
    rawContent: content,
  };
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  return Array.from(new Set(posts.map(p => p.category))).sort();
}

// ── Projects ───────────────────────────────────────────────────────────

export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
}

export function getAllProjects(category?: string): ProjectMeta[] {
  const slugs = getAllProjectSlugs();
  
  const projects = slugs
    .map(slug => {
      const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
      if (!fs.existsSync(filePath)) return null;
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        category: data.category || 'Robotics',
        coverImage: data.coverImage ?? null,
        githubUrl: data.githubUrl ?? null,
        demoUrl: data.demoUrl ?? null,
        status: data.status || 'completed',
        featured: data.featured || false,
        tech: data.tech || [],
      } as ProjectMeta;
    })
    .filter((p): p is ProjectMeta => p !== null)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  if (category && category !== 'All') {
    return projects.filter(p => p.category === category);
  }
  
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  const htmlContent = await markdownToHtml(content);
  
  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    excerpt: data.excerpt || '',
    tags: data.tags || [],
    category: data.category || 'Robotics',
    coverImage: data.coverImage ?? null,
    githubUrl: data.githubUrl ?? null,
    demoUrl: data.demoUrl ?? null,
    status: data.status || 'completed',
    featured: data.featured || false,
    tech: data.tech || [],
    content: htmlContent,
  };
}
