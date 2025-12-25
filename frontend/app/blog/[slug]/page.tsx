"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { navLinks } from "@/lib/constants";
import { useGetBlogQuery } from "@/lib/store/api/blogsApi";
import { Navbar } from "@/components/Navbar";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const blogId = !isNaN(Number(slug)) ? parseInt(slug) : undefined;

  const { data: blog, isLoading, error } = useGetBlogQuery(
    blogId ? { blog_id: blogId } : { slug }
  );

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

  const calculateReadingTime = (htmlContent: string | null) => {
    if (!htmlContent) return 0;
    
    // Remove HTML tags
    const textContent = htmlContent.replace(/<[^>]*>/g, '');
    
    // Remove extra whitespace and split into words
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    
    // Average reading speed is 200-250 words per minute, using 200 for a conservative estimate
    const wordsPerMinute = 200;
    const readingTime = Math.ceil(words.length / wordsPerMinute);
    
    return Math.max(1, readingTime); // At least 1 minute
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Extract headings from content for jump-to-section
  const extractHeadings = (html: string) => {
    if (!html) return [];
    const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi;
    const headings: { id: string; title: string }[] = [];
    let match;
    let index = 0;
    
    while ((match = headingRegex.exec(html)) !== null && index < 10) {
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      if (text) {
        const id = `section-${index}`;
        headings.push({ id, title: text });
        index++;
      }
    }
    return headings;
  };

  const blogSections = blog ? extractHeadings(blog.content) : [];
  const [activeSection, setActiveSection] = useState<string | null>(blogSections.length > 0 ? blogSections[0].id : null);
  
  // Process content to add IDs to headings
  const processedContent = blog ? blog.content.replace(/<h([2-3])([^>]*)>(.*?)<\/h[2-3]>/gi, (match, level, attrs, content, offset) => {
    const index = (blog.content.substring(0, offset).match(/<h[2-3]/gi) || []).length;
    return `<h${level}${attrs} id="section-${index}">${content}</h${level}>`;
  }) : '';

  // Track which section is currently in view
  useEffect(() => {
    if (blogSections.length === 0 || !blog) return;

    let observer: IntersectionObserver | null = null;
    let scrollHandler: (() => void) | null = null;
    const timeoutId = setTimeout(() => {
      // Handle scroll events to detect active section
      scrollHandler = () => {
        const scrollPosition = window.scrollY + 200; // Offset for header and spacing

        // Find the section that's currently in view
        for (let i = blogSections.length - 1; i >= 0; i--) {
          const element = document.getElementById(blogSections[i].id);
          if (element) {
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            if (scrollPosition >= elementTop - 150) {
              setActiveSection(blogSections[i].id);
              break;
            }
          }
        }
      };

      window.addEventListener('scroll', scrollHandler, { passive: true });
      
      // Also use Intersection Observer for more accurate detection
      const observerOptions = {
        root: null,
        rootMargin: '-150px 0px -60% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      };

      let activeEntries: IntersectionObserverEntry[] = [];

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            activeEntries.push(entry);
          } else {
            activeEntries = activeEntries.filter(e => e.target.id !== entry.target.id);
          }
        });

        // Find the entry with the highest intersection ratio
        if (activeEntries.length > 0) {
          const mostVisible = activeEntries.reduce((prev, current) => 
            current.intersectionRatio > prev.intersectionRatio ? current : prev
          );
          setActiveSection(mostVisible.target.id);
        }
      };

      observer = new IntersectionObserver(observerCallback, observerOptions);

      // Observe all section headings
      blogSections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer?.observe(element);
        }
      });

      // Set first section as active by default
      if (blogSections.length > 0) {
        setActiveSection(blogSections[0].id);
      }

      // Initial check
      scrollHandler();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
      }
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
      }
    };
  }, [blogSections, blog]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blog" className="text-[#1d70ff] hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="w-full px-4 pt-8 lg:px-0">
        <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <Navbar ctaText="Book a Dyno" />

          <main className="space-y-12 relative">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[500px]">
              {blog.featured_image ? (
                <Image
                  src={blog.featured_image}
                  alt={blog.title}
                  width={1600}
                  height={500}
                  className="absolute inset-0 h-full w-full object-cover"
                  priority
                />
              ) : (
                <Image
                  src="/images/blog/blogHero.png"
                  alt="Blog Detail"
                  width={1600}
                  height={500}
                  className="absolute inset-0 h-full w-full object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative h-full flex items-end px-4 pb-8 sm:px-6 sm:pb-10 md:px-8 md:pb-12 lg:px-12">
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl animate-heading">{blog.title}</h1>
                  <div className="flex items-center gap-3 sm:gap-4">
                    {blog.author_name && (
                      <>
                        <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-600 sm:h-12 sm:w-12">
                          <Image
                            src="/images/hero/slider1.jpg"
                            alt={blog.author_name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs sm:text-sm">
                          <p className="font-semibold text-white">By {blog.author_name}</p>
                          {blog.published_at && (
                            <p className="text-white/70">{formatDate(blog.published_at)} • {calculateReadingTime(blog.content)} mins read</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              </section>

            {/* Blog Content */}
            <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 xl:px-16 2xl:px-24">
              <div className="grid gap-6 lg:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr] lg:gap-8 xl:gap-12 items-start w-full">
                {/* Left Sidebar */}
                {blogSections.length > 0 && (
                  <aside className="sticky top-8 h-fit z-10 max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <div className="bg-white rounded-xl p-4 space-y-6 sm:rounded-2xl sm:p-5 sm:space-y-7 md:rounded-[16px] md:p-6 md:space-y-8 shadow-sm">
                      {/* Jump To Section */}
                      <div>
                        <h3 className="text-lg font-bold text-[#0c1b33] mb-4">Jump To Section</h3>
                        <ul className="space-y-2">
                          {blogSections.map((section) => (
                            <li key={section.id}>
                              <button
                                onClick={() => scrollToSection(section.id)}
                                className={`text-sm text-[#0c1b33] hover:text-[#1d70ff] transition text-left w-full flex items-center ${
                                  activeSection === section.id ? 'pl-3 border-l-2 border-[#1d70ff]' : ''
                                }`}
                              >
                                {section.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                </div>

                      {/* Share Section */}
                  <div>
                        <h3 className="text-lg font-bold text-[#0c1b33] mb-4">Share</h3>
                        <div className="flex flex-row gap-3">
                          {/* Facebook */}
                          <button
                            className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#1877F2] text-white hover:bg-[#166FE5] transition"
                            title="Facebook"
                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </button>
                          {/* YouTube */}
                          <button
                            className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#FF0000] text-white hover:bg-[#CC0000] transition"
                            title="YouTube"
                            onClick={() => window.open(`https://www.youtube.com/`, '_blank')}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                          </button>
                          {/* Twitter/X */}
                          <button
                            className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#000000] text-white hover:bg-[#333333] transition"
                            title="Twitter"
                            onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, '_blank')}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </button>
                          {/* Instagram */}
                          <button
                            className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white hover:opacity-90 transition"
                            title="Instagram"
                            onClick={() => window.open(`https://www.instagram.com/`, '_blank')}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </aside>
                )}

                {/* Main Content */}
                <article className="space-y-6 sm:space-y-7 md:space-y-8">
                  {/* Introductory Paragraph */}
                  {blog.excerpt && (
                    <div className="bg-[#C9EEFF] rounded-lg p-4 text-black sm:rounded-xl sm:p-5 md:rounded-[12px] md:p-6">
                      <p className="text-sm leading-relaxed sm:text-base">{blog.excerpt}</p>
                    </div>
                  )}

                  {/* Blog Content with enhanced styling */}
                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                  />
                  <style jsx global>{`
                    .blog-content {
                      color: #5c6c86;
                      line-height: 1.75;
                    }
                    .blog-content p {
                      margin: 1.5em 0;
                      color: #5c6c86;
                      line-height: 1.75;
                      font-size: 0.875rem;
                    }
                    .blog-content h1 {
                      font-size: 2.5em;
                      font-weight: 900;
                      margin: 1.5em 0 0.75em 0;
                      color: #0c1b33;
                      line-height: 1.2;
                    }
                    .blog-content h2 {
                      font-size: 2em;
                      font-weight: 800;
                      margin: 1.5em 0 0.75em 0;
                      color: #0c1b33;
                      line-height: 1.3;
                      scroll-margin-top: 2rem;
                    }
                    .blog-content h3 {
                      font-size: 1.5em;
                      font-weight: 700;
                      margin: 1.5em 0 0.75em 0;
                      color: #0c1b33;
                      line-height: 1.4;
                      scroll-margin-top: 2rem;
                    }
                    .blog-content ul,
                    .blog-content ol {
                      margin: 1.5em 0;
                      padding-left: 2em;
                    }
                    .blog-content li {
                      margin: 0.75em 0;
                      color: #5c6c86;
                      line-height: 1.75;
                    }
                    .blog-content blockquote {
                      border-left: 4px solid #1d70ff;
                      padding-left: 1.5em;
                      margin: 2em 0;
                      font-style: italic;
                      color: #5c6c86;
                      background-color: #f8f9fa;
                      padding: 1em 1.5em;
                      border-radius: 0 8px 8px 0;
                    }
                    .blog-content img {
                      width: 100% !important;
                      max-width: 100% !important;
                      min-width: 100% !important;
                      height: auto !important;
                      border-radius: 12px;
                      margin: 2.5em 0;
                      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                      display: block;
                      object-fit: contain;
                    }
                    .blog-content p img,
                    .blog-content p > img {
                      width: 100% !important;
                      max-width: 100% !important;
                      min-width: 100% !important;
                      height: auto !important;
                      display: block;
                    }
                    .blog-content figure {
                      margin: 2.5em 0;
                      width: 100%;
                    }
                    .blog-content figure img {
                      width: 100% !important;
                      max-width: 100% !important;
                      min-width: 100% !important;
                      height: auto !important;
                    }
                    .blog-content img[style*="width"] {
                      width: 100% !important;
                      max-width: 100% !important;
                    }
                    .blog-content img[width] {
                      width: 100% !important;
                      max-width: 100% !important;
                    }
                    .blog-content a {
                      color: #1d70ff;
                      text-decoration: underline;
                      transition: color 0.2s;
                    }
                    .blog-content a:hover {
                      color: #1a5fdd;
                    }
                    .blog-content strong {
                      font-weight: 700;
                      color: #0c1b33;
                    }
                    .blog-content em {
                      font-style: italic;
                    }
                    .blog-content code {
                      background-color: #f3f4f6;
                      padding: 0.2em 0.5em;
                      border-radius: 4px;
                      font-family: 'Courier New', monospace;
                      font-size: 0.9em;
                      color: #0c1b33;
                    }
                    .blog-content pre {
                      background-color: #1f2937;
                      color: #f9fafb;
                      padding: 1.5em;
                      border-radius: 8px;
                      overflow-x: auto;
                      margin: 2em 0;
                    }
                    .blog-content pre code {
                      background-color: transparent;
                      padding: 0;
                      color: inherit;
                    }
                    .blog-content hr {
                      border: none;
                      border-top: 2px solid #dfe6f2;
                      margin: 3em 0;
                    }
                    .blog-content table {
                      width: 100%;
                      border-collapse: collapse;
                      margin: 2em 0;
                    }
                    .blog-content table th,
                    .blog-content table td {
                      padding: 0.75em;
                      border: 1px solid #dfe6f2;
                    }
                    .blog-content table th {
                      background-color: #f8f9fa;
                      font-weight: 700;
                      color: #0c1b33;
                    }
                  `}</style>
                </article>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="border-t border-[#1d70ff]/100 px-8 py-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
              <div className="space-y-4">
                <Link href="/">
                  <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} />
                </Link>
                <p className="text-sm leading-relaxed text-[#5c6c86]">
                  At MSPerformance, we specialize in car performance boosting services, ranging from ECU
                  remapping to custom exhausts. With our wealth of experience, we also offer comprehensive
                  basic servicing to ensure the overall maintenance and reliability of your vehicle.
                </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="text-xs font-semibold text-[#9aa6bd]">Payment Methods:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[#5c6c86]">Visa</span>
                      <span className="text-xs text-[#5c6c86]">Mastercard</span>
                      <span className="text-xs text-[#5c6c86]">Maestro</span>
                      <span className="text-xs text-[#5c6c86]">American Express</span>
                      <span className="text-xs text-[#5c6c86]">PayPal</span>
                    </div>
                  </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#0c1b33]">Our headquarters address is:</h3>
                  <p className="text-sm text-[#5c6c86]">810 Headquarters, Churchill Road, B17</p>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-[#0c1b33]">
                  <span className="h-4 w-px bg-[#1d70ff]" />
                    Mailing Subscription
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full rounded-[8px] border border-[#dfe6f2] px-4 py-3 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full rounded-[8px] border border-[#dfe6f2] px-4 py-3 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                    />
                    <button className="w-full rounded-[8px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white">
                      Subscribe
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-[#5c6c86]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                        <path
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>0770 7900021 | 0207 946089</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5c6c86]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                        <path
                          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.51l8 5.33 8-5.33V6H4zm0 12h16V9.49l-8 5.33-8-5.33V18z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>info@msperformance.co.uk</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#0c1b33]">FOR GENERAL ENQUIRIES</p>
                    <p className="text-xs text-[#5c6c86]">+44 (0)207 855 209</p>
                  </div>
                  <div className="pt-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0c1b33]">
                      <span className="h-4 w-px bg-[#1d70ff]" />
                      Follow us
                </h3>
                    <div className="space-y-2">
                      {["Facebook", "Twitter", "Instagram"].map((social) => (
                        <a
                          key={social}
                          href="#"
                          className="flex items-center gap-2 text-sm text-[#5c6c86] transition hover:text-[#1d70ff]"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          <span>{social}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#dfe6f2] pt-6">
                <p className="text-sm text-[#5c6c86]">© Copyright 2020 MSPerformance</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#5c6c86]">
                  <a href="#" className="hover:text-[#1d70ff]">
                    Privacy Policy
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Cookie Policy
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Legal Information
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Terms & Conditions
                  </a>
            </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

