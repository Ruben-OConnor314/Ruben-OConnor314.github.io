import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "public", "portfolio-images");

const imageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const videoExts = [".mp4", ".webm", ".mov"];

function getType(file) {
  const ext = path.extname(file).toLowerCase();
  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  return null;
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function safeReadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function generateGallery(folderPath) {
  const files = fs.readdirSync(folderPath);

  const galleryPath = path.join(folderPath, "gallery.json");

  // Load existing gallery.json if it exists
  const existingGallery = safeReadJson(galleryPath);
  const existingMedia = existingGallery?.media ?? [];

  const media = files
    .filter((f) => !f.startsWith("."))
    .filter((f) => f !== "gallery.json")
    .filter((f) => f !== "description.md")
    .sort(naturalSort)
    .map((file) => {
      const type = getType(file);
      if (!type) return null;

      // Try to find an existing entry so we preserve title/caption/etc.
      const existing = existingMedia.find((m) => m.src === file);

      return {
        type,
        src: file,
        title: existing?.title ?? "", // preserve title if already written
      };
    })
    .filter(Boolean);

  const missingTitles = media.filter(
    (m) => m.type === "image" && (!m.title || m.title.trim() === ""),
  );

  if (missingTitles.length > 0) {
    console.warn(`⚠️  Missing image titles in: ${path.basename(folderPath)}`);
    missingTitles.forEach((m) => console.warn(`   - ${m.src}`));
  }

  const output = { media };

  fs.writeFileSync(galleryPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`✅ Generated gallery.json for ${path.basename(folderPath)}`);
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error(`❌ Folder not found: ${ROOT}`);
    process.exit(1);
  }

  const folders = fs
    .readdirSync(ROOT)
    .map((name) => path.join(ROOT, name))
    .filter((p) => fs.statSync(p).isDirectory());

  folders.forEach(generateGallery);

  console.log("🎉 Done generating all galleries.");
}

main();
