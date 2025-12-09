import { File, Paths } from 'expo-file-system';
import { List } from '@/types';

const getListsFile = () => new File(Paths.document, 'lists.json');

async function getLists(): Promise<List[]> {
  try {
    const file = getListsFile();
    // Check if file exists before trying to read
    if (!file.exists) {
      return [];
    }
    try {
      const content = await file.text();
      return JSON.parse(content);
    } catch (readError) {
      // If file doesn't exist or can't be read, return empty array
      console.error('Failed to read offline lists file', readError);
      return [];
    }
  } catch (error) {
    console.error('Failed to get offline lists', error);
    return [];
  }
}

async function saveLists(lists: List[]): Promise<void> {
  try {
    const file = getListsFile();
    const content = JSON.stringify(lists, null, 2);

    // Create file if it doesn't exist
    if (!file.exists) {
      await file.create();
    }

    await file.write(content);
  } catch (error) {
    console.error('Failed to save offline lists', error);
  }
}

async function getAll(): Promise<List[]> {
  return await getLists();
}

async function create(data: { name: string; budget: number }): Promise<List> {
  const lists = await getLists();
  const newList: List = {
    id: `offline-${Date.now()}`,
    name: data.name,
    budget: data.budget,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isOffline: true,
  };
  lists.push(newList);
  await saveLists(lists);
  return newList;
}

async function getById(id: string): Promise<List | null> {
  const lists = await getLists();
  const list = lists.find((l) => l.id === id);
  return list || null;
}

async function update(id: string, data: Partial<List>): Promise<List | null> {
  const lists = await getLists();
  const index = lists.findIndex((l) => l.id === id);
  if (index === -1) {
    return null;
  }
  const updatedList = { ...lists[index], ...data, updatedAt: new Date().toISOString() };
  lists[index] = updatedList;
  await saveLists(lists);
  return updatedList;
}

async function deleteList(id: string): Promise<void> {
  const lists = await getLists();
  const filteredLists = lists.filter((l) => l.id !== id);
  await saveLists(filteredLists);
}

export const offlineListService = {
  getAll,
  create,
  getById,
  update,
  deleteList,
};
