import React from "react";
import { motion } from "motion/react";
import { Check, GraduationCap, Briefcase, Award, FileText } from "lucide-react";

export function About() {
  const primaryTools = [
    "3ds Max",
    "Blender",
    "Corona Renderer",
    "V-Ray",
    "Photoshop",
  ];

  const supportingTools = [
    "Unreal Engine 5",
    "Datasmith",
    "SketchUp",
    "AutoCAD",
    "RailClone",
  ];

  const experience = [
    {
      role: "Freelance Architectural Visualiser",
      company: "AREA Windsor",
      period: "Jun 2024",
      desc: "Produced optimised architectural 3D models and draft photorealistic renders for internal reviews and client pitch material.",
    },
    {
      role: "Freelance Architectural Visualiser",
      company: "4RealCreative",
      period: "Sep 2023",
      desc: "Created accurate architectural models from CAD drawings and site information. Delivered clean, production-ready geometry.",
    },
    {
      role: "Heritage Visualisation Assistant",
      company: "University-Funded Contract",
      period: "Mar-Jun 2023",
      desc: "Produced historically informed 3D reconstructions for a conservation project. Processed LiDAR data for Historic England.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-neutral-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">
                ABOUT ME
              </h2>

              <h3 className="text-xl md:text-2xl font-light text-gray-300 mb-6 leading-relaxed">
                Architectural Visualiser based in the UK.
              </h3>

              <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                I am an Architectural Visualiser with professional freelance and
                studio experience producing production-ready 3D models and
                photorealistic renders for architectural design teams and
                client-facing presentations.
              </p>

              <p className="text-gray-400 leading-relaxed mb-8 text-lg">
                I have a strong background in architectural modelling from CAD
                and site data, lighting, materials, and composition, as well as
                procedural workflows. I am experienced in working independently
                from brief to delivery while collaborating with designers,
                visualisers, and clients under real project constraints.
              </p>

              <a
                href="cv-download/RubenOConnor_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 border mb-15 border-white/30 text-white font-semibold uppercase tracking-widest text-sm hover:border-white/60 hover:text-white transition"
              >
                <FileText size={18} className="opacity-80" />
                Download CV
              </a>

              {/* Experience Section */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="text-white" size={24} />
                  <h4 className="text-xl font-bold tracking-tight">
                    Experience
                  </h4>
                </div>

                <div className="space-y-8 border-l border-neutral-800 pl-8 relative">
                  {experience.map((job, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-neutral-700 border-2 border-neutral-900"></div>
                      <h5 className="text-lg font-bold text-white">
                        {job.role}
                      </h5>
                      <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
                        {job.company} | {job.period}
                      </p>
                      <p className="text-gray-400 leading-relaxed">
                        {job.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="text-white" size={24} />
                  <h4 className="text-xl font-bold tracking-tight">
                    Education
                  </h4>
                </div>

                <div className="bg-neutral-800/50 p-6 border border-white/5">
                  <h5 className="text-lg font-bold text-white">
                    BA (Hons) CGI & VFX
                  </h5>
                  <p className="text-gray-400 mb-2">
                    Solent University | 2022–2025
                  </p>
                  <div className="flex items-center gap-2 text-yellow-500 mt-4">
                    <Award size={18} />
                    <span className="text-sm font-medium">
                      Awarded "Best Technical Art" (2025)
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar / Skills */}
          <div className="w-full lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-neutral-950 p-8 border border-white/5 sticky top-24"
            >
              <h4 className="text-sm uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">
                Primary Tools
              </h4>

              <div className="grid grid-cols-1 gap-3 mb-8">
                {primaryTools.map((sw) => (
                  <div
                    key={sw}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span className="text-sm font-medium">{sw}</span>
                  </div>
                ))}
              </div>

              <h4 className="text-sm uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">
                Supporting
              </h4>

              <div className="flex flex-wrap gap-2 mb-8">
                {supportingTools.map((sw) => (
                  <span
                    key={sw}
                    className="px-3 py-1 bg-neutral-900 text-gray-400 text-xs uppercase tracking-wide border border-white/5 rounded-sm"
                  >
                    {sw}
                  </span>
                ))}
              </div>

              <h4 className="text-sm uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">
                Core Competencies
              </h4>

              <ul className="space-y-3">
                <li className="text-sm text-gray-400 leading-relaxed flex gap-3">
                  <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                  Architectural modelling from CAD
                </li>
                <li className="text-sm text-gray-400 leading-relaxed flex gap-3">
                  <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                  Photorealistic lighting & materials
                </li>
                <li className="text-sm text-gray-400 leading-relaxed flex gap-3">
                  <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                  Procedural modelling (Geometry Nodes)
                </li>
                <li className="text-sm text-gray-400 leading-relaxed flex gap-3">
                  <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                  Clean topology & PBR workflows
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
