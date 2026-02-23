import MarkdownRenderer from "../MarkdownRenderer";
import { Calendar, MapPin } from "lucide-react";
import { TocItem } from "../utils";
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

    const { toc, activeId } =
        useToc(scrollRef, mdDescription);
    
    return <div className="w-full h-full bg-neutral-900 text-white ring-2 ring-white/20 grid grid-cols-1 lg:grid-cols-[280px_1fr]">

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
        <div ref={scrollRef} className="details-scroll h-full overflow-y-auto bg-neutral-900 text-white ring-2 ring-white/20">
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
    </div>;
}