// Project Blacklist Filter System
const BLACKLIST_KEY = 'project_blacklist';

export function getBlacklistedProjects(): string[] {
  try {
    const stored = localStorage.getItem(BLACKLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function setBlacklistedProjects(projectIds: string[]) {
  localStorage.setItem(BLACKLIST_KEY, JSON.stringify(projectIds));
}

export function addToBlacklist(projectId: string) {
  const blacklist = getBlacklistedProjects();
  if (!blacklist.includes(projectId)) {
    blacklist.push(projectId);
    setBlacklistedProjects(blacklist);
  }
}

export function removeFromBlacklist(projectId: string) {
  const blacklist = getBlacklistedProjects();
  const filtered = blacklist.filter(id => id !== projectId);
  setBlacklistedProjects(filtered);
}

export function isProjectBlacklisted(projectId: string): boolean {
  return getBlacklistedProjects().includes(projectId);
}

export function filterBlacklistedProjects<T extends { project_id?: string; projectId?: string }>(
  items: T[]
): T[] {
  const blacklist = getBlacklistedProjects();
  return items.filter(item => {
    const id = item.project_id || item.projectId;
    return id ? !blacklist.includes(id) : true;
  });
}
