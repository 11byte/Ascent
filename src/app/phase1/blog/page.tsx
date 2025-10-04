"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  X,
  Plus,
  Save,
  PenLine,
  Share2,
  Clock,
  User2,
} from "lucide-react";

// ---- Types ----
type BlogPost = {
  id: number;
  title: string;
  content: string; // HTML from TipTap
  author: string;
  timestamp: string; // human-readable
  tags?: string[];
  readMinutes?: number;
};

// ---- Theme tokens ----
const COLORS = {
  cream: "#f7f3e9",
  creamDeep: "#efe7d7",
  ink: "#0f1b4c", // dark royal blue for elements/borders/shadows
  inkSoft: "#29356d",
  accent: "#1d2a5c",
};

export default function PremiumBlogPage() {
  // Hydration-safe flag
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // Mock posts
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "AI Transforming Education",
      content:
        "<p><strong>AI-powered platforms</strong> are reshaping how universities handle learning and student engagement.</p>",
      author: "Tech Desk",
      timestamp: "2025-09-01 10:30 AM",
      tags: ["AI", "Education"],
      readMinutes: 3,
    },
    {
      id: 2,
      title: "Quantum Computing Breakthrough",
      content:
        "<p>Researchers achieve a new milestone in <em>quantum error correction</em>, paving the way for scalable quantum systems.</p>",
      author: "Science Daily",
      timestamp: "2025-09-02 09:15 AM",
      tags: ["Quantum", "Research"],
      readMinutes: 4,
    },
    {
      id: 3,
      title: "Open-Source LLMs Rising",
      content:
        "<p>The open-source community is pushing the boundaries with smaller, efficient language models.</p>",
      author: "AI Weekly",
      timestamp: "2025-09-03 05:45 PM",
      tags: ["LLM", "Open Source"],
      readMinutes: 2,
    },
  ]);

  // Compose/edit state
  const [title, setTitle] = useState("");
  const [showToolkit, setShowToolkit] = useState(false);

  // TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your blog post...</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose base text-[15px] leading-relaxed max-w-none focus:outline-none",
      },
    },
  });

  // Toolbar actions
  const canExec = (cmd: () => void) => {
    if (!editor) return;
    cmd();
    editor.chain().focus().run();
  };

  const handleAddPost = () => {
    if (!title || !editor?.getHTML()) return;

    const rawHTML = editor.getHTML();
    const text = rawHTML
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = text ? text.split(" ").length : 0;
    const minutes = Math.max(1, Math.round(words / 220));

    const newPost: BlogPost = {
      id: posts.length + 1,
      title,
      content: rawHTML,
      author: "Anonymous",
      timestamp: new Date().toLocaleString(),
      tags: ["Draft"],
      readMinutes: minutes,
    };

    setPosts([newPost, ...posts]);
    setTitle("");
    editor?.commands.setContent("<p>Write your blog post...</p>");
    setShowToolkit(false);
  };

  const bgTexture = useMemo(
    () => ({
      backgroundImage:
        `radial-gradient(20rem 20rem at -10% -10%, rgba(15,27,76,0.06), transparent 60%),` +
        `radial-gradient(16rem 16rem at 110% 0%, rgba(15,27,76,0.05), transparent 60%),` +
        `radial-gradient(40rem 30rem at 50% 120%, rgba(15,27,76,0.04), transparent 60%)`,
    }),
    []
  );

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center pt-10"
      style={{ backgroundColor: COLORS.cream, ...bgTexture }}
    >
      {/* Masthead */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b"
        style={{ borderColor: COLORS.ink + "33" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h1
                className="font-serif text-4xl sm:text-5xl tracking-tight"
                style={{ color: COLORS.ink }}
              >
                The Tech Chronicle
              </h1>
              <p
                className="mt-2 text-sm sm:text-base"
                style={{ color: COLORS.inkSoft }}
              >
                Premium dispatches on AI, software, and science — in a vintage
                wrap.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowToolkit(true)}
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-medium shadow-md"
              style={{
                backgroundColor: COLORS.ink,
                color: "white",
                boxShadow: `0 10px 24px -8px ${COLORS.ink}AA`,
              }}
            >
              <PenLine className="h-4 w-4" />
              New Post
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Content grid */}
      <main className="w-full mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main column */}
          <section className="lg:col-span-8 space-y-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="relative rounded-3xl p-7 sm:p-9 bg-white"
                style={{
                  boxShadow: `0 8px 0 ${COLORS.ink}1a, 0 24px 60px -24px ${COLORS.ink}2b`,
                  border: `1px solid ${COLORS.ink}26`,
                }}
              >
                {/* Header row */}
                <div
                  className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"
                  style={{ borderColor: COLORS.ink + "26" }}
                >
                  <h2
                    className="font-serif text-2xl sm:text-3xl"
                    style={{ color: COLORS.ink }}
                  >
                    {post.title}
                  </h2>
                  <div
                    className="flex items-center gap-3 text-xs sm:text-sm"
                    style={{ color: COLORS.inkSoft }}
                  >
                    <div className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {post.readMinutes ?? 3} min
                      read
                    </div>
                    <span className="opacity-50">•</span>
                    <time className="italic">{post.timestamp}</time>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: COLORS.creamDeep,
                      color: COLORS.ink,
                    }}
                  >
                    <User2 className="h-3.5 w-3.5" /> {post.author}
                  </span>
                  {post.tags?.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] uppercase tracking-wide px-2 py-0.5 rounded"
                      style={{
                        border: `1px solid ${COLORS.ink}33`,
                        color: COLORS.ink,
                      }}
                    >
                      {t}
                    </span>
                  ))}

                  <button
                    aria-label="Share article"
                    className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm"
                    style={{
                      border: `1px dashed ${COLORS.ink}55`,
                      color: COLORS.ink,
                    }}
                    onClick={() => navigator?.share?.({ title: post.title })}
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>

                {/* Content */}
                <div
                  className="mt-6 prose prose-neutral max-w-none font-serif text-[15.5px] leading-7"
                  style={{
                    // tint links & strong
                    // Tailwind prose colors are overridden below
                    // but keep vintage feel by using ink color accents
                    color: COLORS.ink,
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </motion.article>
            ))}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <WidgetCard title="Editor's Picks">
              <ul className="space-y-3">
                {posts.slice(0, 3).map((p) => (
                  <li key={p.id} className="flex items-start gap-3">
                    <span
                      className="mt-1 h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: COLORS.ink }}
                    />
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: COLORS.ink }}
                      >
                        {p.title}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: COLORS.inkSoft }}
                      >
                        {p.timestamp}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </WidgetCard>

            <WidgetCard title="Tags">
              <div className="flex flex-wrap gap-2">
                {[...new Set(posts.flatMap((p) => p.tags ?? []))].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: COLORS.creamDeep,
                      color: COLORS.ink,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </WidgetCard>

            <NewsletterCard />
          </aside>
        </div>
      </main>

      {/* Floating Composer (Toolkit) */}
      <AnimatePresence>
        {showToolkit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(15,27,76,0.35)" }}
            onClick={() => setShowToolkit(false)}
          >
            <motion.div
              initial={{ y: 40, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              className="w-full max-w-2xl rounded-3xl overflow-hidden"
              style={{
                backgroundColor: COLORS.cream,
                boxShadow: `0 30px 100px -20px ${COLORS.ink}aa`,
                border: `1px solid ${COLORS.ink}40`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{
                  backgroundColor: COLORS.creamDeep,
                  borderBottom: `1px solid ${COLORS.ink}26`,
                }}
              >
                <div className="flex items-center gap-2">
                  <PenLine className="h-4 w-4" style={{ color: COLORS.ink }} />
                  <h3 className="font-semibold" style={{ color: COLORS.ink }}>
                    Create New Post
                  </h3>
                </div>
                <button
                  onClick={() => setShowToolkit(false)}
                  className="rounded-full p-2"
                  aria-label="Close composer"
                  style={{ color: COLORS.ink }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 pt-5 pb-6 space-y-4">
                <input
                  type="text"
                  placeholder="Post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-white/70 focus:outline-none"
                  style={{
                    border: `1px solid ${COLORS.ink}33`,
                    color: COLORS.ink,
                  }}
                />

                {isClient && editor && (
                  <div
                    className="rounded-xl bg-white overflow-hidden border"
                    style={{ borderColor: COLORS.ink + "26" }}
                  >
                    {/* Toolbar */}
                    <div
                      className="flex items-center gap-1 px-2 py-2"
                      style={{
                        backgroundColor: COLORS.creamDeep,
                        borderBottom: `1px solid ${COLORS.ink}26`,
                      }}
                    >
                      <ToolbarButton
                        onClick={() =>
                          canExec(() =>
                            editor.chain().focus().toggleBold().run()
                          )
                        }
                        active={editor.isActive("bold")}
                      >
                        <Bold className="h-4 w-4" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          canExec(() =>
                            editor.chain().focus().toggleItalic().run()
                          )
                        }
                        active={editor.isActive("italic")}
                      >
                        <Italic className="h-4 w-4" />
                      </ToolbarButton>
                      <div
                        className="mx-1 h-6 w-px"
                        style={{ backgroundColor: COLORS.ink + "22" }}
                      />
                      <ToolbarButton
                        onClick={() =>
                          canExec(() =>
                            editor
                              .chain()
                              .focus()
                              .toggleHeading({ level: 1 })
                              .run()
                          )
                        }
                        active={editor.isActive("heading", { level: 1 })}
                      >
                        <Heading1 className="h-4 w-4" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          canExec(() =>
                            editor
                              .chain()
                              .focus()
                              .toggleHeading({ level: 2 })
                              .run()
                          )
                        }
                        active={editor.isActive("heading", { level: 2 })}
                      >
                        <Heading2 className="h-4 w-4" />
                      </ToolbarButton>
                      <div
                        className="mx-1 h-6 w-px"
                        style={{ backgroundColor: COLORS.ink + "22" }}
                      />
                      <ToolbarButton
                        onClick={() =>
                          canExec(() =>
                            editor.chain().focus().toggleBulletList().run()
                          )
                        }
                        active={editor.isActive("bulletList")}
                      >
                        <List className="h-4 w-4" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          canExec(() =>
                            editor.chain().focus().toggleOrderedList().run()
                          )
                        }
                        active={editor.isActive("orderedList")}
                      >
                        <ListOrdered className="h-4 w-4" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          canExec(() =>
                            editor.chain().focus().toggleBlockquote().run()
                          )
                        }
                        active={editor.isActive("blockquote")}
                      >
                        <Quote className="h-4 w-4" />
                      </ToolbarButton>
                    </div>

                    {/* Editor */}
                    <div
                      className="max-h-72 overflow-y-auto px-4 py-3"
                      style={{ color: COLORS.ink }}
                    >
                      <EditorContent editor={editor} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() =>
                      editor?.commands.setContent(
                        "<p>Write your blog post...</p>"
                      )
                    }
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{
                      border: `1px solid ${COLORS.ink}33`,
                      color: COLORS.ink,
                    }}
                  >
                    <Plus className="h-4 w-4" /> Reset
                  </button>
                  <button
                    onClick={handleAddPost}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium"
                    style={{
                      backgroundColor: COLORS.ink,
                      color: "white",
                      boxShadow: `0 10px 24px -8px ${COLORS.ink}AA`,
                    }}
                  >
                    <Save className="h-4 w-4" /> Publish
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        className="mt-auto w-full border-t"
        style={{ borderColor: COLORS.ink + "26" }}
      >
        <div
          className="mx-auto max-w-6xl px-6 py-10 text-sm"
          style={{ color: COLORS.inkSoft }}
        >
          © {new Date().getFullYear()} The Tech Chronicle — Crafted with care.
        </div>
      </footer>
    </div>
  );
}

// ---- UI Subcomponents ----
function WidgetCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-3xl p-6 bg-white"
      style={{
        border: `1px solid ${COLORS.ink}26`,
        boxShadow: `0 14px 48px -24px ${COLORS.ink}3d`,
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-serif text-xl" style={{ color: COLORS.ink }}>
          {title}
        </h4>
      </div>
      <div>{children}</div>
    </div>
  );
}

function NewsletterCard() {
  return (
    <WidgetCard title="Newsletter">
      <p className="text-sm mb-3" style={{ color: COLORS.inkSoft }}>
        Get weekly insights delivered in a vintage envelope.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="email"
          placeholder="you@example.com"
          className="flex-1 rounded-xl px-3 py-2 bg-white/70 focus:outline-none"
          style={{ border: `1px solid ${COLORS.ink}33`, color: COLORS.ink }}
        />
        <button
          className="rounded-xl px-4 py-2 font-medium"
          style={{ backgroundColor: COLORS.ink, color: "white" }}
        >
          Subscribe
        </button>
      </div>
    </WidgetCard>
  );
}

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1.5 rounded-lg inline-flex items-center justify-center"
      style={{
        backgroundColor: active ? COLORS.ink : "transparent",
        color: active ? "white" : COLORS.ink,
        border: `1px solid ${COLORS.ink}33`,
      }}
      type="button"
    >
      {children}
    </button>
  );
}
