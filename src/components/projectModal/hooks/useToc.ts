import { useEffect, useState, RefObject } from "react";
import { TocItem } from "../utils";

export function useToc(
    containerRef: RefObject<HTMLDivElement | null>,
    markdown: string
) {
    const [toc, setToc] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState("");

    /* ---------- build toc ---------- */
    useEffect(() => {
        if (!markdown) return;

        const container = containerRef.current;
        if (!container) return;

        const headings = Array.from(
            container.querySelectorAll("h1, h2, h3")
        ) as HTMLElement[];

        const items = headings.map((h) => ({
            id: h.id,
            text: h.textContent || "",
            level: Number(h.tagName.replace("H", "")),
        }));

        setToc(items);
    }, [markdown]);

    /* ---------- active section tracking ---------- */
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const headings = Array.from(
            container.querySelectorAll("h1, h2, h3")
        ) as HTMLElement[];

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

        return () =>
            container.removeEventListener("scroll", onScroll);
    }, [markdown]);

    return { toc, activeId };
}