"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BlogPost = {
  id: number;
  title: string;
  description?: string;
  summary?: string;
  author: string;
  published_at: string;
  url: string;
  cover_image?: string;
  difficulty: string;
  tag_list?: string[];
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [clickedBlogs, setClickedBlogs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const year = "FE";
  const domainImages: Record<string, string> = {
    ai: "/domains/ai.png",
    programming: "/domains/programming.png",
    web: "/domains/web.png",
    blockchain: "/domains/blockchain.png",
    cybersecurity: "/domains/cybersecurity.png",
    data: "/domains/data.png",
    cloud: "/domains/cloud.png",
    default: "/domains/default.png",
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/blogs?year=${year}`,
          { cache: "no-store" },
        );

        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();

        /* Remove duplicates on frontend as extra safety */

        const unique = Array.from(
          new Map(data.blogs.map((b: BlogPost) => [b.url, b])).values(),
        ) as BlogPost[];

        setBlogs(unique);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleInterest = async (title: string, interested: boolean) => {
    const userId = localStorage.getItem("userId") || "guest";

    setClickedBlogs((prev) => ({ ...prev, [title]: true }));

    await fetch("http://localhost:5000/api/blogs/interact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, interested, userId }),
    });
  };

  /* Fallback image */

  if (loading)
    return (
      <div className="flex justify-center mt-32 text-gray-400 text-lg">
        Loading curated tech blogs...
      </div>
    );

  const getDomain = (blog: BlogPost) => {
    if (!blog.tag_list || blog.tag_list.length === 0) return "default";

    const tags = blog.tag_list.map((t) => t.toLowerCase());

    if (tags.includes("ai") || tags.includes("ml") || tags.includes("llm"))
      return "ai";
    if (tags.includes("programming")) return "programming";
    if (
      tags.includes("web") ||
      tags.includes("frontend") ||
      tags.includes("backend")
    )
      return "web";
    if (tags.includes("blockchain") || tags.includes("crypto"))
      return "blockchain";
    if (tags.includes("security")) return "cybersecurity";
    if (tags.includes("data")) return "data";
    if (tags.includes("cloud")) return "cloud";

    return "default";
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-5 md:px-10 py-16">
      {/* HEADER */}

      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1
          className="text-4xl md:text-6xl font-bold mt-5 text-transparent 
  [-webkit-text-stroke:1.5px_#c084fc]"
        >
          Tech Blog Feed
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base">
          Curated technical articles across domains. Tap a blog to see details
          and express your interest. Your interactions help us recommend better
          content for you!
        </p>
      </div>

      {/* BLOG GRID */}

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer bg-[#141414] border border-gray-800 rounded-xl overflow-hidden transition hover:border-purple-500"
            onClick={() => setSelected(blog)}
          >
            {/* IMAGE */}

            <img
              src={
                blog.cover_image ||
                domainImages[getDomain(blog)] ||
                domainImages.default
              }
              onError={(e) =>
                (e.currentTarget.src =
                  domainImages[getDomain(blog)] || domainImages.default)
              }
              alt={blog.title}
              className="w-full h-48 object-cover"
            />

            {/* CONTENT */}

            <div className="p-5">
              <h2 className="text-lg font-semibold line-clamp-2">
                {blog.title}
              </h2>

              <p className="text-gray-400 text-sm line-clamp-2 mt-2">
                {blog.description || blog.summary}
              </p>

              {/* META */}

              <div className="flex justify-between items-center mt-4 text-xs">
                <span className="text-gray-500">{blog.author}</span>

                <span
                  className={`px-2 py-1 rounded ${
                    blog.difficulty === "beginner"
                      ? "bg-green-700"
                      : blog.difficulty === "intermediate"
                        ? "bg-yellow-700"
                        : "bg-red-700"
                  }`}
                >
                  {blog.difficulty}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-[#141414] max-w-3xl w-full rounded-xl overflow-hidden border border-gray-700"
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* IMAGE */}

              <img
                src={
                  selected.cover_image ||
                  domainImages[getDomain(selected)] ||
                  domainImages.default
                }
                onError={(e) =>
                  (e.currentTarget.src =
                    domainImages[getDomain(selected)] || domainImages.default)
                }
                className="w-full h-72 object-cover"
              />
              {/* DETAILS */}

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{selected.title}</h2>

                {/* SUMMARY */}

                <p className="text-gray-300 mb-5 leading-relaxed">
                  {selected.summary || selected.description}
                </p>

                {/* META */}

                <div className="flex justify-between text-sm text-gray-400 mb-6">
                  <span>{selected.author}</span>

                  <span>
                    {new Date(selected.published_at).toLocaleDateString()}
                  </span>
                </div>

                {/* ACTION BUTTONS */}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    disabled={clickedBlogs[selected.title]}
                    onClick={() => handleInterest(selected.title, true)}
                    className="flex-1 py-2 border border-pink-500 rounded hover:bg-pink-600/20"
                  >
                    Interested
                  </button>

                  <button
                    disabled={clickedBlogs[selected.title]}
                    onClick={() => handleInterest(selected.title, false)}
                    className="flex-1 py-2 border border-purple-500 rounded hover:bg-purple-600/20"
                  >
                    Not Interested
                  </button>

                  <a
                    href={selected.url}
                    target="_blank"
                    className="flex-1 py-2 text-center border border-gray-600 rounded hover:bg-gray-700"
                  >
                    Read Article
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
