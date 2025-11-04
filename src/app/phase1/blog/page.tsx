"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BlogPost = {
  id: number | string;
  title: string;
  description?: string;
  author: string;
  published_at: string;
  url: string;
  cover_image?: string | null;
};

const PremiumBlogPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickedBlogs, setClickedBlogs] = useState<Record<string, boolean>>({});
  const [expandedId, setExpandedId] = useState<number | string | null>(null);

  // ---------------- Fetch Blogs ----------------
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/blogs", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ---------------- Handle Interest ----------------
  const handleInterest = async (blogTitle: string, interested: boolean) => {
    try {
      setClickedBlogs((prev) => ({ ...prev, [blogTitle]: true }));

      await fetch("http://localhost:5000/api/blogs/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: blogTitle, interested }),
      });

      console.log(
        `Sent ${interested ? "Interested" : "Not Interested"} for ${blogTitle}`
      );
    } catch (err) {
      console.error("Failed to send interaction:", err);
    }
  };

  // ---------------- UI ----------------
  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading blogs...</p>;

  if (!blogs.length)
    return <p className="text-center mt-10 text-gray-400">No blogs found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0c0c0c] to-[#1a1a1a] text-white py-20 px-6">
      <h1 className="text-6xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 font-[Orbitron] drop-shadow-[0_0_10px_rgba(180,100,255,0.5)]">
        Tech Blogs
      </h1>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
          {blogs.map((post) => {
            const isExpanded = expandedId === post.id;
            return (
              <motion.div
                key={post.id}
                layout
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.1, ease: "easeOut" },
                }}
                onClick={() => setExpandedId(isExpanded ? null : post.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  layout: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }, // smoother
                }}
                style={{
                  boxShadow: isExpanded
                    ? "0px 0px 30px rgba(147, 51, 234, 0.3)"
                    : "0px 4px 20px rgba(255, 255, 255, 0.05)",
                }}
                className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#222] hover:bg-gradient-to-br hover:from-[#1a1a1a] hover:to-[#222222] border border-gray-800 rounded-2xl cursor-pointer backdrop-blur-lg transition-all duration-500 
                  ${
                    isExpanded
                      ? "col-span-2 lg:col-span-3"
                      : "hover:shadow-[0_0_15px_rgba(180,100,255,0.25)]"
                  }
                  ${isExpanded ? "overflow-visible" : "overflow-hidden"}`}
              >
                {/* Cover Image */}
                {post.cover_image && (
                  <motion.img
                    layout="position"
                    src={post.cover_image}
                    alt={post.title}
                    className={`w-full object-cover rounded-t-2xl ${
                      isExpanded ? "h-80" : "h-48"
                    } transition-all duration-700 ease-in-out`}
                  />
                )}

                {/* Card Content */}
                <motion.div
                  layout
                  className="p-6 flex flex-col justify-between"
                >
                  <motion.h2
                    layout="position"
                    className="text-2xl font-semibold mb-3 text-gray-100"
                  >
                    {post.title}
                  </motion.h2>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 mb-4 z-10">
                    {/* Interested Button */}
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.25, ease: "easeOut" },
                      }}
                      whileTap={{ scale: 0.97 }}
                      className={`px-5 py-2.5 rounded-full font-medium border transition-all duration-300 ease-in-out
                        ${
                          clickedBlogs[post.title]
                            ? "bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed"
                            : "border-pink-600 text-pink-400 bg-transparent hover:bg-pink-600/20 hover:text-pink-300"
                        }`}
                      disabled={!!clickedBlogs[post.title]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInterest(post.title, true);
                      }}
                    >
                      Interested
                    </motion.button>

                    {/* Not Interested Button */}
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.25, ease: "easeOut" },
                      }}
                      whileTap={{ scale: 0.97 }}
                      className={`px-5 py-2.5 rounded-full font-medium border transition-all duration-300 ease-in-out
                        ${
                          clickedBlogs[post.title]
                            ? "bg-gray-600 text-gray-300 border-gray-500 cursor-not-allowed"
                            : "border-purple-600 text-purple-400 bg-transparent hover:bg-purple-600/20 hover:text-purple-300"
                        }`}
                      disabled={!!clickedBlogs[post.title]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInterest(post.title, false);
                      }}
                    >
                      Not Interested
                    </motion.button>
                  </div>

                  {/* Description */}
                  {!isExpanded ? (
                    <p className="text-gray-400 text-sm line-clamp-3 mb-2">
                      {post.description || "No description available."}
                    </p>
                  ) : (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="text-gray-300"
                    >
                      <p className="mb-4 leading-relaxed text-[15px]">
                        {post.description || "No description available."}
                      </p>

                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>By {post.author || "Unknown"}</span>
                        <span>
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      </div>

                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block text-pink-400 hover:text-pink-200 font-medium underline underline-offset-2"
                      >
                        Read Full Article →
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PremiumBlogPage;
