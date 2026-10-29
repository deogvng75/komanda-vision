import { useCallback, useEffect, useState } from "react";

const CHANGE_EVENT = "komanda:store-changed";

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
    // Prévient tous les composants qui utilisent la même clé (autres pages, sidebar...).
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
  } catch {
    // Stockage indisponible ou plein : on ignore pour ne pas casser l'interface.
  }
}

/**
 * Liste persistée dans localStorage.
 * - `items` : le contenu actuel (vide tant que `ready` est faux, pour éviter un décalage à l'hydratation)
 * - `update(fn)` : applique une modification à la dernière version enregistrée
 *
 * Pour passer à un vrai backend plus tard, il suffira de remplacer le contenu de ce hook :
 * les pages n'ont pas besoin de changer.
 */
export function useStoredList<T>(key: string) {
  const [items, setItems] = useState<T[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setItems(readList<T>(key));
      setReady(true);
    };
    const onChange = (event: Event) => {
      if ((event as CustomEvent<string>).detail === key) refresh();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === key) refresh();
    };
    refresh();
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  const update = useCallback(
    (updater: (current: T[]) => T[]) => {
      writeList(key, updater(readList<T>(key)));
    },
    [key],
  );

  return { items, update, ready } as const;
}
