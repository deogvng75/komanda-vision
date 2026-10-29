const KEYS = [
  "komanda:settings",
  "komanda:products",
  "komanda:clients",
  "komanda:orders",
  "komanda:notifications",
] as const;

/** Télécharge un fichier de sauvegarde contenant toutes les données de la boutique. */
export function exportBackup() {
  const data: Record<string, unknown> = {};
  for (const key of KEYS) {
    const raw = window.localStorage.getItem(key);
    if (raw) data[key] = JSON.parse(raw);
  }
  const content = JSON.stringify({ app: "komanda", version: 1, exportedAt: new Date().toISOString(), data }, null, 2);
  const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `komanda-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/** Remplace les données actuelles par celles d'un fichier de sauvegarde. Lance une erreur si le fichier est invalide. */
export async function importBackup(file: File) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("Ce fichier n'est pas une sauvegarde valide.");
  }
  const backup = parsed as { app?: string; data?: Record<string, unknown> };
  if (backup?.app !== "komanda" || typeof backup.data !== "object" || backup.data === null) {
    throw new Error("Ce fichier n'est pas une sauvegarde KOMANDA.");
  }
  for (const key of KEYS) {
    const value = backup.data[key];
    if (value === undefined) continue;
    const valid = key === "komanda:settings" ? typeof value === "object" && !Array.isArray(value) : Array.isArray(value);
    if (!valid) throw new Error("La sauvegarde est incomplète ou abîmée.");
  }
  for (const key of KEYS) {
    const value = backup.data[key];
    if (value !== undefined) window.localStorage.setItem(key, JSON.stringify(value));
  }
}

/** Supprime toutes les données de la boutique (pour recommencer un test à zéro). */
export function clearAllData() {
  for (const key of KEYS) window.localStorage.removeItem(key);
}
