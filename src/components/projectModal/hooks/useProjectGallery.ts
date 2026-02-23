import { useEffect, useState } from "react";
import { Project } from "../PortfolioGrid";
import {
    MediaItem,
    getFolderFromImagePath,
} from "../utils";

export function useProjectGallery(
    project: Project | null,
    isOpen: boolean
) {
    const [media, setMedia] =
        useState<MediaItem[]>([]);

    useEffect(() => {
        if (!isOpen || !project) return;

        const loadGallery = async () => {
            try {
                const folder =
                    getFolderFromImagePath(project.image);

                const res = await fetch(
                    `/portfolio-images/${folder}/gallery.json`
                );

                if (!res.ok) throw new Error();

                const data = await res.json();
                setMedia(data.media || []);
            } catch {
                setMedia([
                    { type: "image", src: project.image },
                ]);
            }
        };

        loadGallery();
    }, [project, isOpen]);

    return media;
}