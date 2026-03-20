"use client";

import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  ArrowUpRight,
  Code2,
  Smartphone,
  Globe,
  Brain,
  Send,
  X,
  Star,
  GitFork,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  homepage: string | null;
  fork: boolean;
}

const GITHUB_USERNAME = "SudhirYadav5678";
const REPOS_PER_PAGE = 100;
const VISIBLE_PROJECTS = 6;

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Tools", href: "#tools" },
  { label: "Contact", href: "#contact" },
];

const STATS = [
  { id: "repos", value: "120+", labelTop: "GITHUB", labelBottom: "REPOSITORIES" },
  { id: "exp", value: "2+", labelTop: "YEARS OF", labelBottom: "EXPERIENCE" },
  { id: "stars", value: "49", labelTop: "GITHUB", labelBottom: "STARS" },
];

const EXPERIENCES = [
  {
    company: "Open Limits",
    role: "Software Engineer",
    type: "Full-time",
    duration: "Oct 2025 – Present · 6 mos",
    location: "Noida, Uttar Pradesh, India · Hybrid",
    description:
      "Working on back-end web development with Next.js. Building scalable server-side solutions, RESTful APIs, and contributing to full-stack feature development in a hybrid work environment.",
    skills: ["Back-End Web Development", "Next.js", "React", "Node.js", "TypeScript"],
    current: true,
  },
  {
    company: "FullScore",
    role: "Software Developer",
    type: "Full-time",
    duration: "2 Years",
    location: "Remote",
    description:
      "Contributed to the development of web applications using modern JavaScript frameworks. Built scalable backend APIs and integrated third-party services. Participated in code reviews and daily standups with Agile development practices.",
    skills: ["JavaScript", "React", "Node.js", "REST APIs"],
    current: false,
  },
  {
    company: "Zidio",
    role: "Software Developer Intern",
    type: "Internship",
    duration: "3 Months",
    location: "Remote",
    description:
      "Assisted in building and maintaining web applications. Gained hands-on experience with full-stack development, collaborating closely with senior engineers on production-level code.",
    skills: ["Full-Stack Development", "JavaScript", "Git"],
    current: false,
  },
];

const TOOLS = [
  { name: "React", category: "Frontend Framework", icon: "⚛️" },
  { name: "Next.js", category: "React Framework", icon: "▲" },
  { name: "TypeScript", category: "Language", icon: "🔷" },
  { name: "Node.js", category: "Runtime", icon: "🟢" },
  { name: "React Native", category: "Mobile Framework", icon: "📱" },
  { name: "Spring Boot", category: "Java Framework", icon: "🍃" },
  { name: "Python", category: "Language", icon: "🐍" },
  { name: "MongoDB", category: "Database", icon: "🍃" },
  { name: "PostgreSQL", category: "Database", icon: "🐘" },
  { name: "MySQL", category: "Database", icon: "🗄️" },
  { name: "Docker", category: "DevOps", icon: "🐳" },
  { name: "Git", category: "Version Control", icon: "📦" },
  { name: "VS Code", category: "IDE", icon: "💻" },
  { name: "Kotlin", category: "Android Dev", icon: "🤖" },
];

const SKILL_CARDS = [
  {
    icon: Code2,
    title: "FULLSTACK DEVELOPMENT",
    subtitle: "REACT, NEXT.JS, NODE.JS, SPRING BOOT",
    color: "bg-accent",
  },
  {
    icon: Smartphone,
    title: "MOBILE APP DEVELOPMENT",
    subtitle: "REACT NATIVE, ANDROID",
    color: "bg-lime",
    textDark: true,
  },
  {
    icon: Globe,
    title: "SHOPIFY DEVELOPMENT",
    subtitle: "LIQUID, SHOPIFY API, STOREFRONT",
    color: "bg-lime",
    textDark: true,
  },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  "Jupyter Notebook": "#DA5B0B",
  Shell: "#89e051",
};

export default function Home() {
  const [activeNav, setActiveNav] = useState("Home");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalFilter, setModalFilter] = useState("");
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const fetchAllRepos = useCallback(async () => {
    setLoading(true);
    try {
      const allRepos: GitHubRepo[] = [];
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=${REPOS_PER_PAGE}&page=${page}&sort=updated`
        );
        if (!res.ok) break;
        const data: GitHubRepo[] = await res.json();
        allRepos.push(...data);
        hasMore = data.length === REPOS_PER_PAGE;
        page++;
      }
      setRepos(allRepos.filter((r) => !r.fork));
    } catch {
      console.error("Failed to fetch repos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllRepos();
  }, [fetchAllRepos]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  const visibleRepos = repos.slice(0, VISIBLE_PROJECTS);

  const filteredModalRepos = modalFilter
    ? repos.filter(
      (r) =>
        r.name.toLowerCase().includes(modalFilter.toLowerCase()) ||
        r.language?.toLowerCase().includes(modalFilter.toLowerCase()) ||
        r.description?.toLowerCase().includes(modalFilter.toLowerCase())
    )
    : repos;

  const handleImgError = (id: number) => {
    setImgErrors((prev) => new Set(prev).add(id));
  };

  const getRepoImage = (repo: GitHubRepo) =>
    `https://socialify.git.ci/${GITHUB_USERNAME}/${repo.name}/image?language=1&name=1&owner=1&theme=Dark&font=Inter`;

  return (
    <main className="min-h-screen bg-dark" id="home">
      {/* Navigation */}
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-0.5 sm:gap-1 bg-dark-card/80 backdrop-blur-xl border border-dark-border rounded-full px-1.5 sm:px-2 py-1.5 sm:py-2 max-w-[95vw] overflow-x-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setActiveNav(item.label)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeNav === item.label
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:text-white"
              }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-16">
          {/* Profile Card */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 flex flex-col items-center text-center h-fit lg:sticky lg:top-28">
            <div className="relative mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-accent/20 border-2 border-accent">
                <img
                  src="https://avatars.githubusercontent.com/u/116871585?v=4"
                  alt="Sudhir Yadav"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-dark-card" />
            </div>

            <h2 className="text-xl font-bold text-white mb-1">Sudhir Yadav</h2>
            <p className="text-accent text-sm font-medium mb-3 flex items-center gap-1">
              <MapPin size={14} /> Delhi, India
            </p>

            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              A Software Developer who builds innovative full-stack &amp; mobile
              applications.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <SocialIcon href="https://github.com/SudhirYadav5678" Icon={Github} />
              <SocialIcon href="https://x.com/SudhirYadav5678" Icon={Twitter} />
              <SocialIcon
                href="https://www.linkedin.com/in/sudhiryadav5678/"
                Icon={Linkedin}
              />
              <SocialIcon href="mailto:sudhiryadav5678@gmail.com" Icon={Mail} />
            </div>

            <a
              href="#contact"
              className="w-full py-3 bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-xl transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                <Send size={16} /> Get in Touch
              </span>
            </a>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Hero Title */}
            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-10">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-4">
                <span className="text-white">SOFTWARE</span>
                <br />
                <span className="text-gradient">DEVELOPER</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-lg max-w-xl leading-relaxed">
                Passionate about creating intuitive and engaging user
                experiences. Specialize in transforming ideas into beautifully
                crafted full-stack &amp; mobile products.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-dark-card border border-dark-border rounded-2xl p-3 sm:p-5 text-center"
                >
                  <p className="text-2xl sm:text-4xl font-black text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[9px] sm:text-xs font-semibold text-gray-500 tracking-wider">
                    {stat.labelTop}
                  </p>
                  <p className="text-[9px] sm:text-xs font-semibold text-gray-500 tracking-wider">
                    {stat.labelBottom}
                  </p>
                </div>
              ))}
            </div>

            {/* Skill Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SKILL_CARDS.map((card) => (
                <div
                  key={card.title}
                  className={`${card.color} rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02]`}
                >
                  <card.icon
                    size={28}
                    className={`mb-14 ${card.textDark ? "text-dark" : "text-white"}`}
                  />
                  <p
                    className={`text-[10px] font-bold tracking-wider ${card.textDark ? "text-dark/70" : "text-white/70"
                      }`}
                  >
                    {card.subtitle}
                  </p>
                  <p
                    className={`text-xs font-extrabold mt-1 ${card.textDark ? "text-dark" : "text-white"
                      }`}
                  >
                    {card.title}
                  </p>
                  <div
                    className={`absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${card.textDark ? "bg-dark/10" : "bg-white/20"
                      }`}
                  >
                    <ArrowUpRight
                      size={16}
                      className={card.textDark ? "text-dark" : "text-white"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-20 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <SectionHeading top="RECENT" bottom="PROJECTS" noMargin />
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 w-fit"
            >
              View All ({repos.length})
              <ArrowUpRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="text-accent animate-spin" />
              <span className="ml-3 text-gray-400">Loading projects...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleRepos.map((repo) => (
                <ProjectCard
                  key={repo.id}
                  repo={repo}
                  imgError={imgErrors.has(repo.id)}
                  onImgError={() => handleImgError(repo.id)}
                  getRepoImage={getRepoImage}
                />
              ))}
            </div>
          )}
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-20 scroll-mt-24">
          <SectionHeading top="WORK" bottom="EXPERIENCE" />
          <div className="space-y-4">
            {EXPERIENCES.map((exp) => (
              <div
                key={exp.company}
                className="bg-dark-card border border-dark-border rounded-2xl p-5 sm:p-8 card-hover group relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-accent transition-colors">
                      {exp.company}
                    </h3>
                    <p className="text-accent text-sm font-semibold">
                      {exp.role}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {exp.type} · {exp.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-gray-500 text-xs sm:text-sm font-medium bg-dark rounded-full px-3 sm:px-4 py-1 border border-dark-border whitespace-nowrap">
                      {exp.duration}
                    </span>
                    {exp.current && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-3 py-1 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] sm:text-xs font-medium text-gray-300 bg-dark border border-dark-border rounded-full px-2.5 py-0.5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="mb-20 scroll-mt-24">
          <SectionHeading top="PREMIUM" bottom="TOOLS" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="bg-dark-card border border-dark-border rounded-2xl p-4 sm:p-5 card-hover group cursor-default"
              >
                <span className="text-2xl mb-3 block">{tool.icon}</span>
                <h3 className="text-white font-bold text-sm group-hover:text-accent transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-500 text-xs mt-1">{tool.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-24">
          <SectionHeading top="LET'S WORK" bottom="TOGETHER" />
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto">
            <form
              className="space-y-5"
              action="https://formsubmit.co/sudhirkyadav51@gmail.com"
              method="POST"
              onSubmit={async (e) => {
                e.preventDefault();
                setFormStatus("sending");
                const form = e.currentTarget;
                const formData = new FormData(form);
                try {
                  const res = await fetch("https://formsubmit.co/ajax/sudhirkyadav51@gmail.com", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify(Object.fromEntries(formData)),
                  });
                  if (res.ok) {
                    setFormStatus("sent");
                    form.reset();
                    setTimeout(() => setFormStatus("idle"), 4000);
                  } else {
                    setFormStatus("error");
                    setTimeout(() => setFormStatus("idle"), 4000);
                  }
                } catch {
                  setFormStatus("error");
                  setTimeout(() => setFormStatus("idle"), 4000);
                }
              }}
            >
              <input type="hidden" name="_subject" value="New Portfolio Contact" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Name" placeholder="Your Name" type="text" name="name" required />
                <InputField
                  label="Email"
                  placeholder="you@email.com"
                  type="email"
                  name="email"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">
                  Budget
                </label>
                <select name="budget" defaultValue="" className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors appearance-none">
                  <option value="" disabled>
                    Select…
                  </option>
                  <option>&lt; $3k</option>
                  <option>$3k – $5k</option>
                  <option>$5k – $10k</option>
                  <option>&gt; $10k</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell me about your project..."
                  required
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={formStatus === "sending"}
                className={`w-full py-3.5 font-bold rounded-xl transition-all duration-300 text-sm tracking-wide ${formStatus === "sent"
                  ? "bg-green-500 text-white"
                  : formStatus === "error"
                    ? "bg-red-500 text-white"
                    : "bg-accent hover:bg-accent/90 text-white"
                  } disabled:opacity-60`}
              >
                {formStatus === "sending" && "Sending..."}
                {formStatus === "sent" && "Message Sent!"}
                {formStatus === "error" && "Failed – Try Again"}
                {formStatus === "idle" && "Submit"}
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-border py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Sudhir Yadav. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/SudhirYadav5678"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              <Github size={18} />
            </a>
            <a
              href="https://x.com/SudhirYadav5678"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/sudhiryadav5678/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </footer>

      {/* ─── View All Projects Modal ─── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 pt-8 sm:pt-16 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-dark-card border border-dark-border rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col animate-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-dark-border shrink-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  All Projects
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {filteredModalRepos.length} of {repos.length} repositories
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-dark border border-dark-border flex items-center justify-center text-gray-400 hover:text-white hover:border-accent transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 sm:px-6 py-4 border-b border-dark-border shrink-0">
              <input
                type="text"
                placeholder="Search by name, language, or description..."
                value={modalFilter}
                onChange={(e) => setModalFilter(e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Repo Grid */}
            <div className="overflow-y-auto p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModalRepos.map((repo) => (
                  <ProjectCard
                    key={repo.id}
                    repo={repo}
                    compact
                    imgError={imgErrors.has(repo.id)}
                    onImgError={() => handleImgError(repo.id)}
                    getRepoImage={getRepoImage}
                  />
                ))}
              </div>
              {filteredModalRepos.length === 0 && (
                <p className="text-gray-500 text-center py-12">
                  No projects match your search.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ─── Project Card Component ─── */

function ProjectCard({
  repo,
  compact,
  imgError,
  onImgError,
  getRepoImage,
}: {
  repo: GitHubRepo;
  compact?: boolean;
  imgError: boolean;
  onImgError: () => void;
  getRepoImage: (repo: GitHubRepo) => string;
}) {
  const langColor = repo.language ? LANG_COLORS[repo.language] || "#666" : "#666";

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-dark border border-dark-border rounded-2xl overflow-hidden card-hover flex flex-col"
    >
      {/* Image Area */}
      <div className={`${compact ? "h-32" : "h-40 sm:h-44"} relative bg-gradient-to-br from-accent/10 to-lime/5 overflow-hidden`}>
        {!imgError ? (
          <img
            src={getRepoImage(repo)}
            alt={repo.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={onImgError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageIcon size={compact ? 28 : 40} className="text-accent/30" />
            <span className="text-[10px] text-gray-600 font-medium">{repo.language || "Code"}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={`${compact ? "p-3" : "p-4 sm:p-5"} flex flex-col flex-1`}>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className={`${compact ? "text-sm" : "text-base sm:text-lg"} font-bold text-white group-hover:text-accent transition-colors truncate pr-2`}>
            {repo.name}
          </h3>
          <ExternalLink
            size={14}
            className="text-gray-500 group-hover:text-accent transition-colors shrink-0"
          />
        </div>
        {repo.description && (
          <p className={`text-gray-400 ${compact ? "text-xs line-clamp-2" : "text-sm line-clamp-2"} mb-2 flex-1`}>
            {repo.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-auto">
          {repo.language && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: langColor }}
              />
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Star size={12} /> {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <GitFork size={12} /> {repo.forks_count}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

/* ─── Small Components ─── */

function SocialIcon({
  href,
  Icon,
}: {
  href: string;
  Icon: React.ComponentType<any>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-dark border border-dark-border flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent transition-all duration-300"
    >
      <Icon size={18} />
    </a>
  );
}

function SectionHeading({
  top,
  bottom,
  noMargin,
}: {
  top: string;
  bottom: string;
  noMargin?: boolean;
}) {
  return (
    <div className={noMargin ? "" : "mb-10"}>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none">
        <span className="text-white">{top}</span>
        <br />
        <span className="text-gradient">{bottom}</span>
      </h2>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  type,
  name,
  required,
}: {
  label: string;
  placeholder: string;
  type: string;
  name?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-gray-400 text-sm font-medium mb-2 block">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
