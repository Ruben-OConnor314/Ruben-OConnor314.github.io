import React, { useMemo, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion } from "motion/react";
import { Maximize2 } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string; // cover image
  images?: string[]; // optional gallery
  description: string;
  date: string;
  location: string;
}

interface PortfolioGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onModalChange?: (open: boolean) => void;
}

type FilterType = "all" | "archviz" | "technical";

export function PortfolioGrid({
  projects,
  onProjectClick,
  onModalChange,
}: PortfolioGridProps) {
  const [filter, setFilter] = useState<FilterType>("archviz");

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects;

    if (filter === "archviz") {
      return projects.filter((p) => p.category.toLowerCase().includes("arch"));
    }

    if (filter === "technical") {
      return projects.filter(
        (p) =>
          p.category.toLowerCase().includes("tech") ||
          p.category.toLowerCase().includes("procedural") ||
          p.category.toLowerCase().includes("geometry"),
      );
    }

    return projects;
  }, [projects, filter]);

  return (
    <section id="work" className="py-24 bg-neutral-950 text-white min-h-screen">
      <div className="container mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            SELECTED WORKS
          </h2>
          <div className="w-20 h-1 bg-white/20 mb-8"></div>

          {/* Filter UI */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2 text-sm font-medium border transition-all duration-200
              ${
                filter === "all"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-white/20 hover:border-white/40"
              }`}
            >
              All Projects
            </button>

            <button
              onClick={() => setFilter("archviz")}
              className={`px-5 py-2 text-sm font-medium border transition-all duration-200
              ${
                filter === "archviz"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-white/20 hover:border-white/40"
              }`}
            >
              Architectural Visualisation
            </button>

            <button
              onClick={() => setFilter("technical")}
              className={`px-5 py-2 text-sm font-medium border transition-all duration-200
              ${
                filter === "technical"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-white/20 hover:border-white/40"
              }`}
            >
              Technical / Procedural
            </button>
          </div>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="24px">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative cursor-pointer overflow-hidden border border-white/5 bg-neutral-900/30 hover:border-white/10 transition-colors"
                onClick={() => {
                  onProjectClick(project);
                  onModalChange?.(true);
                }}
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-gray-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs uppercase tracking-widest text-gray-300 mb-2">
                      {project.category}
                    </p>
                    <h3 className="text-xl font-bold tracking-tight mb-4">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-medium border-b border-white/30 pb-1 w-fit">
                      VIEW PROJECT <Maximize2 size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </section>
  );
}
