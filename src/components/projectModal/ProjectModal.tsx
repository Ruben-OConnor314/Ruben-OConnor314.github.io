import { Project } from "./PortfolioGrid";
import { useProjectContent } from "./hooks/useProjectContent";
import MarkdownRenderer from "./MarkdownRenderer";
import { useProjectGallery } from "./hooks/useProjectGallery";
import { useImageViewer } from "./hooks/useImageViewer";
import { useEffect, useState, useRef } from "react";
import {
  MediaItem,
  TocItem,
  getFolderFromImagePath,
  RESERVED_KEYS,
} from "./utils";
import ImageViewer from "./viewer/ImageViewer";
import { slugify} from "./utils";
import StandardLayout from "./layout/StandardLayout";
import TechnicalLayout from "./layout/TechnicalLayout";


import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { X, Calendar, MapPin, Share2 } from "lucide-react";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

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
  const media = useProjectGallery(project, isOpen);
  const viewer = useImageViewer();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mdDescription, frontmatter } =
      useProjectContent(project, isOpen);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const currentMedia = media[currentIndex];
  const isTechnical = frontmatter.layout === "technical";
  const [activeId, setActiveId] = useState("");
  
  /* ---------------- HELPERS ---------------- */
  
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
    viewer.resetView();
  };

  const prevImage = () => {
    if (!gallery.length) return;
    setCurrentIndex((i) => (i - 1 + gallery.length) % gallery.length);
    viewer.resetView();
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
      viewer.resetView();
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
                  <TechnicalLayout
                      frontmatter={frontmatter}
                      extraMetadataEntries={extraMetadataEntries}
                      mdDescription={mdDescription}
                  />
                    
              ) : (
                  <StandardLayout
                      gallery={gallery}
                      currentIndex={currentIndex}
                      project={project}
                      viewer={viewer}
                      detailsExpanded={detailsExpanded}
                      setDetailsExpanded={setDetailsExpanded}
                      frontmatter={frontmatter}
                      extraMetadataEntries={extraMetadataEntries}
                      mdDescription={mdDescription}
                  />)}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
