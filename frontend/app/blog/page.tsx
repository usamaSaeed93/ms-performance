"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { navLinks, blogPosts } from "@/lib/constants";
import { useGetPublishedBlogsQuery } from "@/lib/store/api/blogsApi";
import { Navbar } from "@/components/Navbar";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const blogsPerPage = 6;

  const { data: blogsData, isLoading } = useGetPublishedBlogsQuery({
    page: 1,
    per_page: 50,
    order_by: "published_at",
    order: "desc",
  });

  // Transform static blog posts to match dynamic blog structure
  const staticBlogs = blogPosts.map((blog, index) => ({
    id: `static-${index + 1}`,
    slug: `static-blog-${index + 1}`,
    title: blog.title,
    excerpt: blog.summary,
    featured_image: blog.image,
    author_name: "MS Performance",
    published_at: new Date().toISOString(), // Use current date for static blogs
    view_count: 0,
    status: "published",
    isStatic: true, // Flag to identify static blogs
  }));

  // Combine static and dynamic blogs (static blogs first, then dynamic)
  const allBlogs = [...staticBlogs, ...(blogsData?.blogs || [])];

  // Sort by published_at (most recent first)
  const sortedBlogs = allBlogs.sort((a, b) => {
    const dateA = new Date(a.published_at || 0).getTime();
    const dateB = new Date(b.published_at || 0).getTime();
    return dateB - dateA;
  });

  const featuredBlog = sortedBlogs[0];
  const otherBlogs = sortedBlogs.slice(1);

  const filteredBlogs = useMemo(() => {
    if (!searchQuery) return otherBlogs;
    return otherBlogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [otherBlogs, searchQuery]);

  const totalBlogPages = Math.max(1, Math.ceil(filteredBlogs.length / blogsPerPage));

  const nextBlogs = () => {
    setCurrentBlogIndex((prev) => (prev + 1) % totalBlogPages);
  };

  const prevBlogs = () => {
    setCurrentBlogIndex((prev) => (prev - 1 + totalBlogPages) % totalBlogPages);
  };

  const getVisibleBlogs = () => {
    const start = currentBlogIndex * blogsPerPage;
    return filteredBlogs.slice(start, start + blogsPerPage);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar ctaText="Book a Dyno" />
      <div className="bg-white overflow-hidden">
        <main className="space-y-12">
          {/* Hero Section / Featured Article */}
          {isLoading ? (
            <section className="relative overflow-hidden bg-[#030814] text-white h-[700px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading blog posts...</p>
              </div>
            </section>
          ) : featuredBlog ? (
            <section className="relative overflow-hidden bg-[#030814] text-white h-[700px]">
              <Image
                src={featuredBlog.featured_image || "/images/blog/blogHero.png"}
                alt={featuredBlog.title}
                width={1600}
                height={500}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative h-full flex items-end px-8 pb-12 lg:px-12">
                <div className="grid gap-8 lg:grid-cols-[2fr_1fr] w-full items-end">
                  <div className="space-y-4">
                    <span className="inline-block rounded-[8px] bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                      Featured
                    </span>
                    <Link href={featuredBlog.isStatic ? "/blog/detail" : `/blog/${featuredBlog.slug || featuredBlog.id}`}>
                      <h1 className="text-4xl font-black leading-tight lg:text-5xl animate-heading cursor-pointer hover:text-[#1d70ff] transition">
                        {featuredBlog.title}
                      </h1>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-600">
                      <Image
                        src="/images/logos/ms-logo.png"
                        alt={featuredBlog.author_name || "MS Performance"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-white">By {featuredBlog.author_name || "MS Performance"}</p>
                      <p className="text-white/70">
                        {formatDate(featuredBlog.published_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : sortedBlogs.length === 0 && !isLoading ? (
            <section className="relative overflow-hidden bg-[#030814] text-white h-[700px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl">No blog posts available at the moment.</p>
              </div>
            </section>
          ) : null}

          {/* Highlighted Articles Section */}
          <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
            <h2 className="text-center text-xl font-black text-[#0c1b33] mb-4 sm:text-2xl sm:mb-5 md:text-3xl md:mb-6">
              Highlighted Articles Or News At The Top Of The Page
            </h2>

            {/* Search and Filter Bar */}
            <div className="flex flex-col items-stretch gap-3 mb-6 sm:flex-row sm:items-center sm:gap-4 sm:mb-8">
              <div className="relative flex-1 w-full min-w-[200px]">
                <input
                  type="text"
                  placeholder="Find your latest news here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pl-9 pr-3 text-xs text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:outline-none sm:rounded-[8px] sm:px-4 sm:py-3 sm:pl-10 sm:pr-4 sm:text-sm"
                />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <button className="flex h-10 w-full items-center justify-center rounded-lg bg-[#1d70ff] text-white hover:bg-[#1a5fdd] transition sm:h-12 sm:w-12 sm:rounded-[8px] animate-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {/* Top Article Grid - 3 Cards */}
            {sortedBlogs.length > 1 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {sortedBlogs.slice(1, 4).map((blog, index) => (
                  <Link
                    key={blog.id}
                    href={blog.isStatic ? "/blog/detail" : `/blog/${blog.slug || blog.id}`}
                    className={`bg-white rounded-[16px] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer shadow-sm card-hover ${index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : 'animate-card-delay-2'
                      }`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={blog.featured_image || "/images/blog/latest1.png"}
                        alt={blog.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover animate-image-hover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-[#0c1b33] line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-[#5c6c86] line-clamp-2">
                        {blog.excerpt || "Read more about this topic..."}
                      </p>
                      <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1d70ff] text-white hover:bg-[#1a5fdd] transition">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12h14M12 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Recent Blogs Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-[#0c1b33]">Recent Blogs</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={prevBlogs}
                  className="rounded-xl border border-[#dfe6f2] p-2 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-2xl sm:p-3 animate-button"
                  aria-label="Previous blogs"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={nextBlogs}
                  className="rounded-xl border border-[#dfe6f2] p-2 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-2xl sm:p-3 animate-button"
                  aria-label="Next blogs"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden mb-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getVisibleBlogs().map((article, index) => (
                  <Link
                    key={article.id}
                    href={article.isStatic ? "/blog/detail" : `/blog/${article.slug || article.id}`}
                    className={`bg-white rounded-[16px] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer shadow-sm card-hover ${index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : index === 2 ? 'animate-card-delay-2' : index === 3 ? 'animate-card-delay-3' : 'animate-card animate-stagger-4'
                      }`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.featured_image || article.image || "/images/blog/latest1.png"}
                        alt={article.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover animate-image-hover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-[#0c1b33] line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-[#5c6c86] line-clamp-2">
                        {article.excerpt || article.description || "Read more about this topic..."}
                      </p>
                      <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1d70ff] text-white hover:bg-[#1a5fdd] transition animate-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12h14M12 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Blog Carousel Indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {Array.from({ length: totalBlogPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBlogIndex(index)}
                  className={`h-2 rounded-full transition-all ${index === currentBlogIndex
                    ? 'w-8 bg-[#1d70ff]'
                    : 'w-2 bg-[#dfe6f2] hover:bg-[#1d70ff]/50'
                    }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </section>


        </main>
      </div>
    </div>
  );
}

