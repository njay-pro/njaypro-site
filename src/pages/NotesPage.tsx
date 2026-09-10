import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { KineticCanvas } from '../components/KineticCanvas';
import './NotesPage.css';

export const NotesPage: React.FC = () => {
  return (
    <div className="notes-page">
      <KineticCanvas />

      <main className="notes-stage">
        <div className="notes-container center-column">
          <header className="notes-header">
            <span className="notes-eyebrow mono">PUBLIC NOTEBOOK / DISPATCHES</span>
            <h1 className="notes-title">Notes</h1>
            <p className="notes-desc">
              Thoughts on brand systems, retail friction, physical presence, and what happens when AI meets design.
            </p>
          </header>

          <div className="notes-list">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="note-card">
                <Link to={`/notes/${post.slug}`} className="note-card-link">
                  <div className="note-card-meta mono">
                    <time dateTime={post.date}>{post.displayDate}</time>
                    <span className="dot">·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="note-card-title">{post.title}</h2>
                  <p className="note-card-subtitle">{post.subtitle}</p>
                  <div className="note-card-tags mono">
                    {post.tags.map((tag) => (
                      <span key={tag} className="note-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
