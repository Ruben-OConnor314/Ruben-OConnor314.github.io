export type MediaItem = {
    type: "image" | "video";
    src: string;
    title?: string;
};

export type TocItem = {
    id: string;
    text: string;
    level: number;
};

export const slugify = (s: string) =>
    s.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

export const getFolderFromImagePath = (imagePath: string) => {
    const parts = imagePath.split("/");
    return parts[2];
};

export const RESERVED_KEYS = new Set([
    "title",
    "category",
    "date",
    "location",
    "description",
    "layout",
]);