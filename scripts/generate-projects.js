import fs from "fs";
import path from "path";

// ---------- CONFIG ----------
const ROOT = process.cwd();
const PORTFOLIO_DIR = path.join(ROOT, "public", "portfolio-images");
const OUTPUT_FILE = path.join(ROOT, "public", "projects.json");

// ---------- HELPERS ----------
function parseFrontmatter(mdText) {
  // Fix BOM + normalize Windows line endings
  mdText = mdText.replace(/^\uFEFF/, "");
  mdText = mdText.replace(/\r\n/g, "\n");

  // basic YAML frontmatter parser
  if (!mdText.startsWith("---")) return { data: {}, content: mdText };

  const end = mdText.indexOf("\n---", 3);
  if (end === -1) return { data: {}, content: mdText };

  const fmRaw = mdText.slice(3, end).trim();
  const content = mdText.slice(end + 4).trim();

  const lines = fmRaw.split("\n");

  const data = {};
  let currentKey = null;

  for (let line of lines) {
    line = line.trimEnd();

    // list item
    if (line.trim().startsWith("- ") && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(line.trim().slice(2).trim());
      continue;
    }

    // key: value
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      currentKey = key;

      // remove wrapping quotes if present
      value = value.replace(/^"(.*)"$/, "$1");
      value = value.replace(/^'(.*)'$/, "$1");

      if (value === "") {
        data[key] = [];
      } else {
        data[key] = value;
      }
    }
  }

  return { data, content };
}

function safeReadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ---------- MAIN ----------
function generateProjects() {
  if (!fs.existsSync(PORTFOLIO_DIR)) {
    console.error("❌ portfolio-images folder not found:", PORTFOLIO_DIR);
    process.exit(1);
  }

  const folders = fs
    .readdirSync(PORTFOLIO_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const projects = [];

  for (const folder of folders) {
    const folderPath = path.join(PORTFOLIO_DIR, folder);

    const mdPath = path.join(folderPath, "description.md");
    const galleryPath = path.join(folderPath, "gallery.json");

    if (!fs.existsSync(mdPath)) {
      console.warn(`⚠️ Skipping "${folder}" (missing description.md)`);
      continue;
    }

    const mdRaw = fs.readFileSync(mdPath, "utf8");
    const { data } = parseFrontmatter(mdRaw);

    const galleryJson = safeReadJson(galleryPath);
    const media = galleryJson?.media ?? [];

    // choose preview image (first image in gallery.json)
    const firstImage = media.find((m) => m.type === "image")?.src;

    const previewImage = firstImage
      ? `/portfolio-images/${folder}/${firstImage}`
      : `/portfolio-images/${folder}/MainRoom.JPG.jpg`; // fallback if needed

    projects.push({
      id: folder,
      title: data.title ?? folder,
      category: data.category ?? "Uncategorised",
      date: data.date ?? "",
      location: data.location ?? "",
      image: previewImage,
    });
  }

  // Sort newest first (rough sort)
  projects.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2), "utf8");

  console.log(
    `✅ Generated ${projects.length} projects -> public/projects.json`,
  );
}

generateProjects();
