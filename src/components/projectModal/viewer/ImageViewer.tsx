import { motion } from "framer-motion";
import { MediaItem } from "../utils";
import {ArrowLeftRight, ChevronLeft, ChevronRight, MousePointer2, RotateCcw, ZoomIn} from "lucide-react";

interface ImageViewerProps {
    gallery: MediaItem[];
    currentIndex: number;
    projectTitle: string;
    viewer: any;
    detailsExpanded: boolean;
    setDetailsExpanded: React.Dispatch<
        React.SetStateAction<boolean>
    >;
}

export default function ImageViewer({
                                        gallery,
                                        currentIndex,
                                        projectTitle,
                                        viewer,
                                        detailsExpanded,
                                        setDetailsExpanded,
                                    }: ImageViewerProps) {
    const currentMedia = gallery[currentIndex];
    return (
        <div className="h-full min-h-0">
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
                                viewer.resetView();
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
                                {projectTitle}
                            </p>
                            <p className="text-sm font-semibold text-white leading-tight">
                                {currentMedia.title}
                            </p>
                        </div>
                    </div>
                )}

                <motion.div
                    style={{ scale: viewer.smoothZoom, x: viewer.smoothX, y: viewer.smoothY }}
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

                        viewer.x.set(viewer.x.get() + dx);
                        viewer.y.set(viewer.y.get() + dy);

                        // store velocity (last movement)
                        viewer.velocityRef.current.vx = dx;
                        viewer.velocityRef.current.vy = dy;

                        el.dataset.lastX = e.clientX;
                        el.dataset.lastY = e.clientY;
                    }}
                    onPointerUp={(e) => {
                        const el = e.currentTarget as any;
                        el.dataset.dragging = "false";

                        if (viewer.inertiaRef.current)
                            cancelAnimationFrame(viewer.inertiaRef.current);

                        let { vx, vy } = viewer.velocityRef.current;

                        const decay = 0.92; // lower = less glide
                        const stopThreshold = 0.1;

                        const step = () => {
                            vx *= decay;
                            vy *= decay;

                            viewer.x.set(viewer.x.get() + vx);
                            viewer.y.set(viewer.y.get() + vy);

                            if (
                                Math.abs(vx) > stopThreshold ||
                                Math.abs(vy) > stopThreshold
                            ) {
                                viewer.inertiaRef.current = requestAnimationFrame(step);
                            }
                        };

                        viewer.inertiaRef.current = requestAnimationFrame(step);
                    }}
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        viewer.resetView();
                    }}
                    onWheel={(e) => {
                        e.preventDefault();

                        const rect = e.currentTarget.getBoundingClientRect();
                        const offsetX = e.clientX - (rect.left + rect.width / 2);
                        const offsetY = e.clientY - (rect.top + rect.height / 2);

                        const currentZoom = viewer.zoom.get();
                        const zoomSpeed = 0.0015;

                        const nextZoom = Math.min(
                            Math.max(currentZoom - e.deltaY * zoomSpeed, 0.5),
                            3,
                        );

                        const scaleFactor = nextZoom / currentZoom;

                        viewer.x.set(viewer.x.get() - offsetX * (scaleFactor - 1));
                        viewer.y.set(viewer.y.get() - offsetY * (scaleFactor - 1));
                        viewer.zoom.set(nextZoom);
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
        </div>
    );
}