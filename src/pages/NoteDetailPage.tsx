import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import { BLOG_POSTS } from '../data/blogData';
import { KineticCanvas } from '../components/KineticCanvas';
import './NoteDetailPage.css';

export const NoteDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/notes" replace />;
  }

  return (
    <div className="note-detail-page">
      <KineticCanvas />

      <main className="note-detail-stage">
        <article className="note-article center-column">
          <nav className="note-back-nav">
            <Link to="/notes" className="note-back-link mono">
              ← <span>all notes</span>
            </Link>
          </nav>

          <header className="note-detail-header">
            <div className="note-detail-meta mono">
              <time dateTime={post.date}>{post.displayDate}</time>
              <span className="dot">·</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="note-detail-title">{post.title}</h1>
            <p className="note-detail-subtitle">{post.subtitle}</p>
          </header>

          <div className="note-detail-body">
            <Markdown>{post.content}</Markdown>
          </div>

          <footer className="note-detail-footer">
            <div className="note-footer-divider" />
            <div className="note-footer-meta mono">
              <span>author: njay</span>
              <span className="dot">·</span>
              <span>bali / wita</span>
            </div>
            <Link to="/notes" className="note-footer-back mono">
              ← Back to notes archive
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
};
