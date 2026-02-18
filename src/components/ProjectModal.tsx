import { Project } from "./PortfolioGrid";
import MarkdownRenderer from "./MarkdownRenderer";
import matter from "gray-matter";
import fm from "front-matter";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  MousePointer2,
  ZoomIn,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";



import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { X, Calendar, MapPin, Share2 } from "lucide-react";

type MediaItem = {
  type: "image" | "video";
  src: string;
  title?: string;
};



interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

type TocItem = {
  id: string;
  text: string;
  level: number;
};

const slugify = (s: string) =>
    s
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

const extractToc = (markdown: string): TocItem[] => {
  return markdown
      .split("\n")
      .map((line) => {
        const match = line.match(/^(#{1,3})\s+(.*)$/);
        if (!match) return null;

        const level = match[1].length;
        const text = match[2].trim();

        return { id: slugify(text), text, level };
      })
      .filter(Boolean) as TocItem[];
};


export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const zoom = useMotionValue(1);
  const smoothZoom = useSpring(zoom, { stiffness: 200, damping: 25 });
  const smoothX = useSpring(x, { stiffness: 200, damping: 25 });
  const smoothY = useSpring(y, { stiffness: 200, damping: 25 });
  const [mdDescription, setMdDescription] = useState<string>("");
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [frontmatter, setFrontmatter] = useState<Record<string, any>>({});
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const inertiaRef = useRef<number | null>(null);
  const currentMedia = media[currentIndex];
  const isTechnical = frontmatter.layout === "technical";
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);






  const RESERVED_KEYS = new Set([
    "title",
    "category",
    "date",
    "location",
    "description",
    "layout",
  ]);

  /* ---------------- HELPERS ---------------- */

  const resetView = () => {
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);

    zoom.stop();
    x.stop();
    y.stop();

    zoom.set(1);
    x.set(0);
    y.set(0);
  };

  const getFolderFromImagePath = (imagePath: string) => {
    const parts = imagePath.split("/");
    return parts[2];
  };

  const gallery =
    project && media.length
      ? media.map((m) => ({
          ...m,
          src: m.src.startsWith("/")
            ? m.src
            : `/portfolio-images/${getFolderFromImagePath(project.image)}/${m.src}`,
        }))
      : [];

  const nextImage = () => {
    if (!gallery.length) return;
    setCurrentIndex((i) => (i + 1) % gallery.length);
    resetView();
  };

  const prevImage = () => {
    if (!gallery.length) return;
    setCurrentIndex((i) => (i - 1 + gallery.length) % gallery.length);
    resetView();
  };
  const extraMetadataEntries = Object.entries(frontmatter || {}).filter(
    ([key]) => !RESERVED_KEYS.has(key),
  );
  
  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    if (isOpen && project) {
      document.body.style.overflow = "hidden";
      setCurrentIndex(0);
      setDetailsExpanded(false);
      resetView();
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, gallery.length]);

  /* ---------------- MD Loading useEffect ---------------- */

  useEffect(() => {
    if (!isOpen || !project) return;

    const loadMarkdown = async () => {
      try {
        const folder = getFolderFromImagePath(project.image);

        const res = await fetch(`/portfolio-images/${folder}/description.md`);
        if (!res.ok) throw new Error("No description.md found");

        const raw = await res.text();

        const parsed = fm<Record<string, any>>(raw);

        setMdDescription(parsed.body);
        setFrontmatter(parsed.attributes);
      } catch (err) {
        console.error(err);
        setMdDescription("No description available.");
        setFrontmatter({});
      }
    };

    loadMarkdown();
  }, [isOpen, project]);

  /* ---------------- Build TOC useEffect ---------------- */

  useEffect(() => {
    if (!mdDescription) return;

    setTimeout(() => {
      const container = document.getElementById("md-content");
      if (!container) return;

      const headings = Array.from(container.querySelectorAll("h1, h2, h3"));

      const items = headings.map((h) => ({
        id: h.id,
        text: h.textContent || "",
        level: parseInt(h.tagName.replace("H", "")),
      }));

      setToc(items);
    }, 0);
  }, [mdDescription]);


  useEffect(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    const headings = Array.from(
        container.querySelectorAll("h1, h2, h3")
    ) as HTMLElement[];

    if (!headings.length) return;

    const onScroll = () => {
      let current = "";

      for (const h of headings) {
        const rect = h.getBoundingClientRect();
        if (rect.top < 150) current = h.id;
      }

      if (current) setActiveId(current);
    };

    container.addEventListener("scroll", onScroll);
    onScroll();

    return () => container.removeEventListener("scroll", onScroll);
  }, [mdDescription]);


  /* ---------------- Gallery Loading useEffect ---------------- */
  useEffect(() => {
    if (!isOpen || !project) return;

    const loadGallery = async () => {
      try {
        const folder = getFolderFromImagePath(project.image);

        const res = await fetch(`/portfolio-images/${folder}/gallery.json`);
        if (!res.ok) throw new Error("No gallery.json found");

        const data = await res.json();
        setMedia(data.media || []);
      } catch (err) {
        console.error(err);

        setMedia([{ type: "image", src: project.image }]);
      }
    };

    loadGallery();
  }, [isOpen, project]);

  /* ---------------- RENDER ---------------- */

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — closes modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/100"
          />

          {/* Modal — blocks bubbling */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-60 p-[clamp(12px,2vw,28px)]"
          >
            <div
                className={`relative w-full h-full ${
                    isTechnical ? "max-w-[1300px] mx-auto" : ""
                }`}
            >
              
              {/* Close */}
              <button
                onClick={onClose}
                className="
    absolute top-4 right-4 z-50
    h-8 w-8
    bg-black/50 backdrop-blur-md
    ring-1 ring-white/10 shadow-lg
    text-white/70 hover:text-white
    flex items-center justify-center
    transition
    overflow-hidden
  "
              >
                <X size={16} className="relative z-10" />
              </button>

              {/* Layout */}
              {isTechnical ? (
                  <div className="w-full h-full bg-neutral-900 text-white ring-2 ring-white/20 grid grid-cols-1 lg:grid-cols-[280px_1fr]">

                    {/* ===== TOC SIDEBAR ===== */}
                    <div className="hidden lg:block border-r border-white/10 p-6 overflow-y-auto">
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                        Contents
                      </p>

                      <ul className="space-y-2 text-sm">
                        {toc.map((item) => (
                            <li
                                key={item.id}
                                className={`cursor-pointer transition ${
                                    item.level === 2 ? "pl-3" : item.level === 3 ? "pl-6" : "pl-0"
                                } ${
                                    activeId === item.id
                                        ? "text-white font-semibold"
                                        : "text-gray-400 hover:text-gray-200"
                                }`}
                                onClick={() => {
                                  const el = document.getElementById(item.id);
                                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                }}
                            >
                              {item.text}
                            </li>
                        ))}
                      </ul>
                    </div>

                    {/* ===== MAIN SCROLL CONTENT ===== */}
                    <div className="details-scroll h-full overflow-y-auto bg-neutral-900 text-white ring-2 ring-white/20">
                      <div className="mx-auto max-w-[900px] px-10 py-10">

                      <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">
                        {frontmatter.category}
                      </p>

                      <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter mb-6">
                        {frontmatter.title}
                      </h2>

                      <div className="flex flex-col gap-4 text-gray-300 mb-6">
                        {frontmatter.date && (
                            <div className="flex items-center gap-3">
                              <Calendar size={18} />
                              {frontmatter.date}
                            </div>
                        )}

                        {frontmatter.location && (
                            <div className="flex items-center gap-3">
                              <MapPin size={18} />
                              {frontmatter.location}
                            </div>
                        )}
                      </div>

                      {extraMetadataEntries.length > 0 && (
                          <div className="mt-8 border-t border-white/10 pt-6 mb-8">
                            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
                              Project Info
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 text-gray-300 text-sm">
                              {extraMetadataEntries.map(([key, value]) => (
                                  <div key={key}>
                                    <p className="text-gray-500 uppercase tracking-widest text-xs mb-1">
                                      {key}
                                    </p>

                                    {Array.isArray(value) ? (
                                        <ul className="list-disc pl-5 space-y-1">
                                          {value.map((item: any, idx: number) => (
                                              <li key={idx}>{String(item)}</li>
                                          ))}
                                        </ul>
                                    ) : (
                                        <p>{String(value)}</p>
                                    )}
                                  </div>
                              ))}
                            </div>
                          </div>
                      )}

                      <div id="md-content">
                        <MarkdownRenderer content={mdDescription} />
                      </div>
                        
                        
                      
                    </div>
                  </div>    
                  </div>
                    
              ) : (
              <div
                className={`grid w-full h-full min-h-0 grid-cols-1 md:grid-rows-1 transition-all duration-300 ${
                  detailsExpanded ? "md:grid-cols-6" : "md:grid-cols-4"
                }`}
              >
                {/* ================= IMAGE PANEL ================= */}
                <div
                  className="
                    relative h-full min-h-0 md:col-span-3 isolate
                    overflow-hidden flex items-center justify-center
                    transform-gpu
                    will-change-transform
                    "
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* GLASS LAYER (never animated) */}
                  <div
                    className="
                    absolute inset-0 z-0
                    bg-white/1
                    backdrop-blur-2xl
                    shadow-[0_0_0_1px_rgba(255,255,255,0.15)]
                    pointer-events-none
                    will-change-[backdrop-filter]
                    "
                  />

                  {/* Glass noise */}
                  <div
                    className="absolute inset-0 z-[2] pointer-events-none opacity-[0.03]"
                    style={{
                      backgroundImage:
                        'url(\'data:image/svg+xml;utf8,\
                                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">\
                                      <filter id="n">\
                                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4"/>\
                                      </filter>\
                                      <rect width="100%" height="100%" filter="url(%23n)"/>\
                                    </svg>\')',
                    }}
                  />

                  {/* Glass grid overlay */}
                  <div
                    className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)
                      `,
                      backgroundSize: "48px 48px",
                    }}
                  />

                  {/* OPTIONAL: glass edge thickness */}
                  <div
                    className="
                      absolute inset-0 pointer-events-none
                      shadow-[inset_0_0_48px_rgba(255,255,255,0.08)]
                    "
                  />
                  <div className="absolute bottom-6 left-6 right-6 z-30 flex items-end justify-between pointer-events-none">
                    {/* LEFT ISLAND */}
                    <div className="pointer-events-auto ui-mono h-7 px-4 flex items-center gap-3 bg-black/50 backdrop-blur-md ring-1 ring-white/10 shadow-lg">
                      <span className="text-xs text-white/70 tracking-wide">
                        {currentIndex + 1} / {gallery.length}
                      </span>

                      <span className="text-[10px] uppercase tracking-widest text-white/40">
                        {gallery[currentIndex]?.type === "video"
                          ? "VIDEO"
                          : "IMAGE"}
                      </span>
                    </div>

                    {/* RIGHT ISLAND */}
                    <div className="pointer-events-auto ui-mono h-7 flex items-center bg-black/50 backdrop-blur-md ring-1 ring-white/10 shadow-lg overflow-hidden">
                      <div className="hidden sm:flex items-center gap-3 px-4 text-xs text-white/60 tracking-wide">
                        <span className="flex items-center gap-1">
                          <ArrowLeftRight size={14} className="text-white/70" />
                          nav
                        </span>

                        <span className="flex items-center gap-1">
                          <ZoomIn size={14} className="text-white/70" />
                          zoom
                        </span>

                        <span className="flex items-center gap-1">
                          <MousePointer2 size={14} className="text-white/70" />
                          drag
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetView();
                        }}
                        className="
      h-full px-4
      flex items-center gap-2
      text-xs text-white/70
      hover:bg-white/10 hover:text-white
      transition
      cursor-pointer
      active:scale-[0.98]
    "
                      >
                        <RotateCcw size={14} className="text-white/80" />
                        Fit to view
                      </button>
                    </div>
                  </div>
                  {/* TOP RIGHT ISLAND (expand/collapse details) */}
                  <div className="absolute top-6 right-6 z-30 pointer-events-none">
                    <button
                      onClick={() => setDetailsExpanded((v) => !v)}
                      className="
      pointer-events-auto ui-mono h-7 px-4
      flex items-center gap-2
      bg-black/50 backdrop-blur-md
      ring-1 ring-white/10 shadow-lg
      text-xs text-white/70 tracking-wide
      hover:text-white hover:bg-black/60
      transition
    "
                    >
                      {detailsExpanded ? "Collapse" : "Expand"}
                      {detailsExpanded ? (
                        <ChevronRight size={14} className="opacity-80" />
                      ) : (
                        <ChevronLeft size={14} className="opacity-80" />
                      )}
                    </button>
                  </div>

                  {/* Image Title Widget */}
                  {currentMedia?.title && currentMedia.title.trim() !== "" && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10">
                        <p className="text-xs uppercase tracking-widest text-white/60">
                          {project.title}
                        </p>
                        <p className="text-sm font-semibold text-white leading-tight">
                          {currentMedia.title}
                        </p>
                      </div>
                    </div>
                  )}

                  <motion.div
                    style={{ scale: smoothZoom, x: smoothX, y: smoothY }}
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      (e.currentTarget as any).dataset.dragging = "true";
                      (e.currentTarget as any).dataset.lastX = e.clientX;
                      (e.currentTarget as any).dataset.lastY = e.clientY;
                    }}
                    onPointerMove={(e) => {
                      const el = e.currentTarget as any;
                      if (el.dataset.dragging !== "true") return;

                      const lastX = parseFloat(el.dataset.lastX);
                      const lastY = parseFloat(el.dataset.lastY);

                      const dx = e.clientX - lastX;
                      const dy = e.clientY - lastY;

                      x.set(x.get() + dx);
                      y.set(y.get() + dy);

                      // store velocity (last movement)
                      velocityRef.current.vx = dx;
                      velocityRef.current.vy = dy;

                      el.dataset.lastX = e.clientX;
                      el.dataset.lastY = e.clientY;
                    }}
                    onPointerUp={(e) => {
                      const el = e.currentTarget as any;
                      el.dataset.dragging = "false";

                      if (inertiaRef.current)
                        cancelAnimationFrame(inertiaRef.current);

                      let { vx, vy } = velocityRef.current;

                      const decay = 0.92; // lower = less glide
                      const stopThreshold = 0.1;

                      const step = () => {
                        vx *= decay;
                        vy *= decay;

                        x.set(x.get() + vx);
                        y.set(y.get() + vy);

                        if (
                          Math.abs(vx) > stopThreshold ||
                          Math.abs(vy) > stopThreshold
                        ) {
                          inertiaRef.current = requestAnimationFrame(step);
                        }
                      };

                      inertiaRef.current = requestAnimationFrame(step);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      resetView();
                    }}
                    onWheel={(e) => {
                      e.preventDefault();

                      const rect = e.currentTarget.getBoundingClientRect();
                      const offsetX = e.clientX - (rect.left + rect.width / 2);
                      const offsetY = e.clientY - (rect.top + rect.height / 2);

                      const currentZoom = zoom.get();
                      const zoomSpeed = 0.0015;

                      const nextZoom = Math.min(
                        Math.max(currentZoom - e.deltaY * zoomSpeed, 0.5),
                        3,
                      );

                      const scaleFactor = nextZoom / currentZoom;

                      x.set(x.get() - offsetX * (scaleFactor - 1));
                      y.set(y.get() - offsetY * (scaleFactor - 1));
                      zoom.set(nextZoom);
                    }}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    {gallery[currentIndex]?.type === "image" ? (
                      <img
                        src={gallery[currentIndex].src}
                        draggable={false}
                        className="max-h-[90vh] max-w-full object-contain
                        select-none pointer-events-none relative z-10"
                      />
                    ) : (
                      <video
                        src={gallery[currentIndex]?.src}
                        controls
                        className="max-h-[90vh] max-w-full object-contain relative z-10"
                      />
                    )}
                  </motion.div>
                </div>

                {/* ================= DETAILS PANEL ================= */}
                <div
                  className={`details-scroll h-full overflow-y-auto z-0 min-h-0 p-8 pr-5 bg-neutral-900 text-white flex flex-col ring-2 ring-white/20 ${
                    detailsExpanded ? "md:col-span-3" : "md:col-span-1"
                  }`}
                >
                  <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">
                    {frontmatter.category}
                  </p>

                  <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter mb-6">
                    {frontmatter.title}
                  </h2>

                  <div className="flex flex-col gap-4 text-gray-300 mb-1">
                    {frontmatter.date && (
                      <div className="flex items-center gap-3">
                        <Calendar size={18} />
                        {frontmatter.date}
                      </div>
                    )}
                    {frontmatter.location && (
                      <div className="flex items-center gap-3">
                        <MapPin size={18} />
                        {frontmatter.location}
                      </div>
                    )}
                  </div>
                  {extraMetadataEntries.length > 0 && (
                    <div className="mt-8 border-t border-white/10 pt-6">
                      <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
                        Project Info
                      </h3>

                      <div className="flex flex-col gap-4 text-gray-300 text-sm">
                        {extraMetadataEntries.map(([key, value]) => (
                          <div key={key}>
                            <p className="text-gray-500 uppercase tracking-widest text-xs mb-1">
                              {key}
                            </p>

                            {Array.isArray(value) ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {value.map((item: any, idx: number) => (
                                  <li key={idx}>{String(item)}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>{String(value)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-auto -mr-3 pr-3">
                    <MarkdownRenderer content={mdDescription} />
                      
                  </div>

                  <div className="pt-8 border-t border-white/10 mt-8">
                    <button className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-gray-300">
                      <Share2 size={16} /> Share Project
                    </button>
                  </div>
                </div>
              </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
