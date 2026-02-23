import { useEffect, useState } from "react";
import fm from "front-matter";
import { getFolderFromImagePath } from "../utils";
import { Project } from "../PortfolioGrid";

export function useProjectContent(project: Project | null, isOpen: boolean) {
    const [mdDescription, setMdDescription] = useState("");
    const [frontmatter, setFrontmatter] = useState<Record<string, any>>({});

    useEffect(() => {
        if (!isOpen || !project) return;

        const load = async () => {
            try {
                const folder = getFolderFromImagePath(project.image);
                const res = await fetch(`/portfolio-images/${folder}/description.md`);
                if (!res.ok) throw new Error();

                const raw = await res.text();
                const parsed = fm<Record<string, any>>(raw);

                setMdDescription(parsed.body);
                setFrontmatter(parsed.attributes);
            } catch {
                setMdDescription("No description available.");
                setFrontmatter({});
            }
        };

        load();
    }, [project, isOpen]);

    return { mdDescription, frontmatter };
}