import React from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

export function Hero({ scrollToSection }: HeroProps) {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/portfolio-images/hooded-cabin/MainRoom_JPG.jpg"
          alt="Modern Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-gray-300">
            Architectural Visualiser
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-8 text-white">
            RUBEN{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
              O'CONNOR
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-10">
            Photoreal CGI, procedural modelling, and technical workflows for
            design studios.
          </p>

          <button
            onClick={() => scrollToSection("work")}
            className="px-8 py-3 border border-white/30 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-sm"
          >
            View Portfolio
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => scrollToSection("work")}
      >
        <ChevronDown size={32} strokeWidth={1} />
      </motion.div>
    </section>
  );
}
