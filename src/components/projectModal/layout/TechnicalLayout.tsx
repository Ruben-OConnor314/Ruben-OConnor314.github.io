import MarkdownRenderer from "../MarkdownRenderer";
import { Calendar, MapPin } from "lucide-react";
import { useRef } from "react";
import { useToc } from "../hooks/useToc";

interface TechnicalLayoutProps {
    frontmatter: Record<string, any>;
    extraMetadataEntries: [string, unknown][];
    mdDescription: string;
}

export default function TechnicalLayout({
                                            frontmatter,
                                            extraMetadataEntries,
                                            mdDescription,
                                        }: TechnicalLayoutProps) {

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const { toc, activeId } = useToc(scrollRef, mdDescription);

    return (
        <div className="w-full h-full bg-neutral-900 text-white ring-2 ring-white/20">

            {/* ===== GRID LAYOUT ===== */}
            <div className="grid w-full h-full min-h-0 grid-cols-1 lg:grid-cols-[280px_1fr]">

                {/* ================= TOC ================= */}
                <aside className="hidden lg:block border-r border-white/10 p-6 overflow-y-auto">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                        Contents
                    </p>

                    <ul className="space-y-2 text-sm">
                        {toc.map((item) => (
                            <li
                                key={item.id}
                                className={`
                  cursor-pointer transition
                  ${item.level === 2 ? "pl-3" : ""}
                  ${item.level === 3 ? "pl-6" : ""}
                  ${
                                    activeId === item.id
                                        ? "text-white font-semibold"
                                        : "text-gray-400 hover:text-gray-200"
                                }
                `}
                                onClick={() =>
                                    document
                                        .getElementById(item.id)
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                            >
                                {item.text}
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* ================= DOCUMENT VIEWER ================= */}
                <div className="relative min-h-0 bg-neutral-950">

                    {/* FIXED GRID */}
                    <div
                        className="absolute inset-0 pointer-events-none z-0 opacity-[0.15]"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
                            backgroundSize: "30px 30px",
                        }}
                    />
                    
                    {/* ✅ ACTUAL SCROLL CONTAINER */}
                    <div
                        ref={scrollRef}
                        className="details-scroll z-10 h-full min-h-0 overflow-y-auto"
                    >
                        <div className="flex justify-center w-full">

                            <article style={{
                                backgroundColor: "#0b0b0b",
                                transform: "translateZ(0)"
                            }}
                                className="
                  w-full
                  max-w-[820px]
                  ring-1 ring-white/10
                  relative z-10
                  shadow-[0_0_70px_rgba(50,120,248,0.4)]
                  px-10 py-12
                  my-16
                "
                            >

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
                                                            {value.map((item, idx) => (
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

                            </article>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}