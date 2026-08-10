import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@team-henrique';

export async function loadList<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(`${PREFIX}/${key}`);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export async function saveList<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(`${PREFIX}/${key}`, JSON.stringify(items));
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
