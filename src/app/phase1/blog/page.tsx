"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: string;
};

export default function BlogPage() {
  // Hydration-safe flag
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // Mock posts
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "AI Transforming Education",
      content:
        "AI-powered platforms are reshaping how universities handle learning and student engagement.",
      author: "Tech Desk",
      timestamp: "2025-09-01 10:30 AM",
    },
    {
      id: 2,
      title: "Quantum Computing Breakthrough",
      content:
        "Researchers achieve a new milestone in quantum error correction, paving the way for scalable quantum systems.",
      author: "Science Daily",
      timestamp: "2025-09-02 09:15 AM",
    },
    {
      id: 3,
      title: "Open-Source LLMs Rising",
      content:
        "The open-source community is pushing the boundaries with smaller, efficient language models.",
      author: "AI Weekly",
      timestamp: "2025-09-03 05:45 PM",
    },
  ]);

  const [title, setTitle] = useState("");
  const [showToolkit, setShowToolkit] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your blog post...</p>",
    immediatelyRender: false,
  });

  const handleAddPost = () => {
    if (!title || !editor?.getHTML()) return;

    const newPost: BlogPost = {
      id: posts.length + 1,
      title,
      content: editor.getHTML(),
      author: "Anonymous", // replace with logged-in user later
      timestamp: new Date().toLocaleString(),
    };

    setPosts([newPost, ...posts]);
    setTitle("");
    editor?.commands.setContent("<p>Write your blog post...</p>");
    setShowToolkit(false); // hide after posting
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3e8ff] to-[#fde68a] flex flex-col items-center p-6 relative">
      <motion.h1
        className="text-4xl font-bold mb-10 font-serif"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📰 The Tech Chronicle
      </motion.h1>

      {/* Floating Toolkit Button + Panel */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showToolkit && (
          <motion.button
            onClick={() => setShowToolkit(true)}
            className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✍️ Toolkit
          </motion.button>
        )}

        <AnimatePresence>
          {showToolkit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-96 max-w-full rounded-xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold mb-3 text-gray-800">
                Create New Post
              </h2>
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {isClient && editor && (
                <div className="border rounded-lg p-2 mb-4 bg-[#fafafa] max-h-40 overflow-y-auto">
                  <EditorContent editor={editor} />
                </div>
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => setShowToolkit(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPost}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition"
                >
                  Publish
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Blog Posts Display */}
      <div className="w-full max-w-4xl space-y-8">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            className="relative bg-[#fdf6e3] border border-gray-400 shadow-xl p-8 rounded-md font-serif"
            style={{
              transform: `rotate(${index % 2 === 0 ? "-0.8deg" : "1deg"})`,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
          >
            {/* Newspaper Header */}
            <div className="border-b border-gray-400 mb-4 pb-2 flex justify-between items-center">
              <h2 className="text-3xl font-extrabold">{post.title}</h2>
              <span className="text-sm text-gray-500 italic">
                {post.timestamp}
              </span>
            </div>

            <div
              className="prose prose-sm text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-4 border-t border-gray-300 pt-2 text-sm text-gray-600 italic">
              — {post.author}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
