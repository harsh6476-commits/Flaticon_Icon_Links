import { useState, useEffect } from 'react';

const COLLECTIONS_KEY = 'flaticon_custom_collections';
const TAGS_KEY = 'flaticon_custom_tags';

const DEFAULT_COLLECTIONS = [
  { id: 'default_fav', name: '❤️ Favorites', color: 'pink', items: [] },
  { id: 'col_avatars', name: '👤 Avatars & Users', color: 'indigo', items: [] },
  { id: 'col_ui', name: '✨ UI Essentials', color: 'cyan', items: [] }
];

export function useCollections() {
  const [collections, setCollections] = useState(() => {
    try {
      const saved = localStorage.getItem(COLLECTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load collections', e);
    }
    return DEFAULT_COLLECTIONS;
  });

  const [iconTagsMap, setIconTagsMap] = useState(() => {
    try {
      const saved = localStorage.getItem(TAGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load icon tags', e);
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    } catch (e) {
      console.error('Failed to save collections', e);
    }
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem(TAGS_KEY, JSON.stringify(iconTagsMap));
    } catch (e) {
      console.error('Failed to save icon tags', e);
    }
  }, [iconTagsMap]);

  const createCollection = (name, color = 'indigo') => {
    if (!name.trim()) return;
    const newCol = {
      id: `col_${Date.now()}`,
      name: name.trim(),
      color,
      items: []
    };
    setCollections(prev => [...prev, newCol]);
    return newCol.id;
  };

  const deleteCollection = (colId) => {
    setCollections(prev => prev.filter(c => c.id !== colId));
  };

  const toggleIconInCollection = (colId, icon) => {
    setCollections(prev =>
      prev.map(col => {
        if (col.id === colId) {
          const exists = col.items.some(item => item.id === icon.id);
          if (exists) {
            return { ...col, items: col.items.filter(item => item.id !== icon.id) };
          } else {
            return {
              ...col,
              items: [
                ...col.items,
                {
                  id: icon.id,
                  folder: icon.folder,
                  index: icon.index,
                  paddedIndex: icon.paddedIndex
                }
              ]
            };
          }
        }
        return col;
      })
    );
  };

  const isIconInCollection = (colId, iconId) => {
    const col = collections.find(c => c.id === colId);
    return col ? col.items.some(item => item.id === iconId) : false;
  };

  // Add custom tag to any icon directly WITHOUT auto-adding to favorites
  const addTagToIcon = (iconObj, tagText) => {
    if (!tagText.trim()) return;
    const cleanTag = tagText.trim().toLowerCase();

    setIconTagsMap(prev => {
      const currentTags = prev[iconObj.id] || [];
      if (!currentTags.includes(cleanTag)) {
        return {
          ...prev,
          [iconObj.id]: [...currentTags, cleanTag]
        };
      }
      return prev;
    });
  };

  // Remove custom tag from icon
  const removeTagFromIcon = (iconId, tagToRemove) => {
    setIconTagsMap(prev => {
      const currentTags = prev[iconId] || [];
      return {
        ...prev,
        [iconId]: currentTags.filter(t => t !== tagToRemove)
      };
    });
  };

  // Get tags for an icon
  const getIconTags = (iconId) => {
    return iconTagsMap[iconId] || [];
  };

  return {
    collections,
    iconTagsMap,
    createCollection,
    deleteCollection,
    toggleIconInCollection,
    isIconInCollection,
    addTagToIcon,
    removeTagFromIcon,
    getIconTags
  };
}
