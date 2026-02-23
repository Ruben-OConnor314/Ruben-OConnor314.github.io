import { useEffect, useState } from "react";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PortfolioGrid, Project } from "./components/projectModal/PortfolioGrid";
import { ProjectModal } from "./components/projectModal/ProjectModal";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const isProjectModalOpen = selectedProject !== null;

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/projects.json");
        if (!res.ok) throw new Error("projects.json not found");

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects.json", err);
      }
    };

    loadProjects();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
      {!isProjectModalOpen && <Navbar scrollToSection={scrollToSection} />}

      <main>
        <Hero scrollToSection={scrollToSection} />

        <PortfolioGrid projects={projects} onProjectClick={openProjectModal} />

        <About />
        <Contact />
      </main>

      <Footer />

      <ProjectModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
      />
    </div>
  );
}
