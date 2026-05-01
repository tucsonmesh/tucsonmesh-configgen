// Config templates are committed under /configs/<DeviceName>/<filename>.tmpl.
// Vite's import.meta.glob walks that tree at build time and inlines the raw
// file contents into the bundle. Adding a new template = dropping a file in
// the right folder.

const rawTemplates = import.meta.glob("/configs/**/*.tmpl", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Group templates by device. Path format: "/configs/<DeviceName>/<filename>".
const byDevice = new Map();
for (const [path, content] of Object.entries(rawTemplates)) {
  const parts = path.split("/");
  const deviceName = parts[2];
  const templateName = parts[3];
  if (!byDevice.has(deviceName)) byDevice.set(deviceName, []);
  byDevice.get(deviceName).push({ name: templateName, content });
}

export const devices = Array.from(byDevice.keys())
  .sort()
  .map((name) => ({
    name,
    templates: byDevice
      .get(name)
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));
