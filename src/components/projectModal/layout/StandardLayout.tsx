import MarkdownRenderer from "../MarkdownRenderer";
import ImageViewer from "../viewer/ImageViewer";
import { Calendar, MapPin, Share2 } from "lucide-react";


type MetadataEntry = [string, unknown];


interface StandardLayoutProps {
    gallery: any[];
    currentIndex: number;
    project: any;
    viewer: any;
    detailsExpanded: boolean;
    setDetailsExpanded: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    frontmatter: Record<string, any>;
    extraMetadataEntries: MetadataEntry[];
    mdDescription: string;
}

export default function StandardLayout({
                                           gallery,
                                           currentIndex,
                                           project,
                                           viewer,
                                           detailsExpanded,
                                           setDetailsExpanded,
                                           frontmatter,
                                           extraMetadataEntries,
                                           mdDescription,
                                       }: StandardLayoutProps) {
    return (
        <div
        className={`grid w-full h-full min-h-0 grid-cols-1 md:grid-rows-1 transition-all duration-300 ${
            detailsExpanded ? "md:grid-cols-6" : "md:grid-cols-4"
        }`}
    >

            <div
                className={
                    detailsExpanded
                        ? "md:col-span-3"
                        : "md:col-span-3"
                }
            >
                <ImageViewer
                    gallery={gallery}
                    currentIndex={currentIndex}
                    projectTitle={project.title}
                    viewer={viewer}
                    detailsExpanded={detailsExpanded}
                    setDetailsExpanded={setDetailsExpanded}
                />
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
                        <Calendar size={18}/>
                        {frontmatter.date}
                    </div>
                )}
                {frontmatter.location && (
                    <div className="flex items-center gap-3">
                        <MapPin size={18}/>
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
                        {extraMetadataEntries.map((entry, index) => {
                            const key = String(entry[0]);
                            const value = entry[1];

                            return (
                                <div key={index}>
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
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mb-auto -mr-3 pr-3">
                <MarkdownRenderer content={mdDescription}/>

            </div>

            <div className="pt-8 border-t border-white/10 mt-8">
                <button className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-gray-300">
                    <Share2 size={16}/> Share Project
                </button>
            </div>
        </div>
     </div>
   );
}