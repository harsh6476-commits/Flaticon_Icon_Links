import React, { useState, useEffect, useCallback, useMemo, useDeferredValue } from 'react';
import { ArrowUp, Trash2, Folder } from 'lucide-react';
import Header from './components/Header';
import CollectionsBar from './components/CollectionsBar';
import IconGrid from './components/IconGrid';
import IconInspectorModal from './components/IconInspectorModal';
import CreateCollectionModal from './components/CreateCollectionModal';
import { useCollections } from './hooks/useCollections';
import { generateFolderItems, getFullIconId } from './utils/flaticon';

export default function App() {
  // State
  const [selectedSize, setSelectedSize] = useState(512);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery); // Non-blocking UI search
  const [activeTab, setActiveTab] = useState('stream'); // 'stream' | 'collections'
  const [selectedCollectionId, setSelectedCollectionId] = useState('all');

  // Continuous stream state
  const [loadedFolders, setLoadedFolders] = useState([1]);
  const [maxFolderToLoad, setMaxFolderToLoad] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Custom Collections & Tagging Hook
  const {
    collections,
    createCollection,
    deleteCollection,
    toggleIconInCollection,
    isIconInCollection,
    addTagToIcon,
    removeTagFromIcon,
    getIconTags
  } = useCollections();

  // Modals state
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());

  // Throttled Infinite Scroll Batching with requestAnimationFrame for 60FPS scrolling
  const loadNextBatch = useCallback(() => {
    if (isLoadingMore || maxFolderToLoad >= 9999 || deferredSearchQuery.trim() !== '' || activeTab !== 'stream') return;
    setIsLoadingMore(true);

    const nextMax = Math.min(9999, maxFolderToLoad + 3);
    const newFolders = [];
    for (let f = maxFolderToLoad + 1; f <= nextMax; f++) {
      newFolders.push(f);
    }

    setLoadedFolders(prev => [...prev, ...newFolders]);
    setMaxFolderToLoad(nextMax);
    setIsLoadingMore(false);
  }, [maxFolderToLoad, isLoadingMore, deferredSearchQuery, activeTab]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (activeTab !== 'stream' || deferredSearchQuery.trim() !== '' || ticking) return;

      window.requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 800) {
          loadNextBatch();
        }
        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadNextBatch, activeTab, deferredSearchQuery]);

  // Base Stream Icons
  const allStreamIcons = useMemo(() => {
    const list = [];
    for (const f of loadedFolders) {
      const folderItems = generateFolderItems(f);
      for (const item of folderItems) {
        if (!failedImages.has(item.id)) {
          list.push(item);
        }
      }
    }
    return list;
  }, [loadedFolders, failedImages]);

  // Visible Icons calculation using Non-Blocking Deferred Search Query
  const visibleIcons = useMemo(() => {
    const q = deferredSearchQuery.trim().toLowerCase();

    // 1. Collections View Tab
    if (activeTab === 'collections') {
      let itemsToDisplay = [];

      if (selectedCollectionId === 'all') {
        const allItemsMap = new Map();
        collections.forEach(col => {
          col.items.forEach(item => allItemsMap.set(item.id, item));
        });
        itemsToDisplay = Array.from(allItemsMap.values());
      } else {
        const activeCol = collections.find(c => c.id === selectedCollectionId);
        itemsToDisplay = activeCol ? activeCol.items : [];
      }

      if (!q) return itemsToDisplay;
      return itemsToDisplay.filter(item => {
        const matchId = item.id.toLowerCase().includes(q);
        const matchFolder = item.folder.toString().includes(q);
        const tags = getIconTags(item.id);
        const matchTags = tags.some(t => t.toLowerCase().includes(q));
        return matchId || matchFolder || matchTags;
      });
    }

    // 2. Stream Tab Search Query
    if (q) {
      const isNum = /^\d+$/.test(q);

      if (isNum) {
        const numVal = parseInt(q, 10);
        if (numVal >= 1 && numVal <= 9999 && q.length <= 4) {
          return generateFolderItems(numVal).filter(item => !failedImages.has(item.id));
        }
        if (q.length > 4) {
          const folderPart = parseInt(q.slice(0, -3), 10);
          const indexPart = parseInt(q.slice(-3), 10);
          if (folderPart >= 1 && folderPart <= 9999 && indexPart >= 0 && indexPart <= 999) {
            const item = {
              folder: folderPart,
              index: indexPart,
              paddedIndex: indexPart.toString().padStart(3, '0'),
              id: getFullIconId(folderPart, indexPart)
            };
            if (!failedImages.has(item.id)) return [item];
          }
        }
      }

      return allStreamIcons.filter(icon => {
        const matchId = icon.id.toLowerCase().includes(q);
        const matchFolder = icon.folder.toString().includes(q);
        const tags = getIconTags(icon.id);
        const matchTags = tags.some(t => t.toLowerCase().includes(q));
        return matchId || matchFolder || matchTags;
      });
    }

    return allStreamIcons;
  }, [allStreamIcons, deferredSearchQuery, activeTab, selectedCollectionId, collections, failedImages, getIconTags]);

  const handleImageError = useCallback((iconId) => {
    setFailedImages(prev => new Set(prev).add(iconId));
  }, []);

  const handleDeleteCollection = (colId) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(colId);
      if (selectedCollectionId === colId) setSelectedCollectionId('all');
    }
  };

  const totalSavedCount = useMemo(
    () => collections.reduce((acc, c) => acc + c.items.length, 0),
    [collections]
  );

  return (
    <div className="min-h-screen bg-emerald-mesh text-emerald-100 font-sans selection:bg-emerald-500 selection:text-white pb-20">
      
      {/* HEADER COMPONENT */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalSavedCount={totalSavedCount}
      />

      {/* COLLECTIONS TOOLBAR COMPONENT */}
      <CollectionsBar
        collections={collections}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCollectionId={selectedCollectionId}
        setSelectedCollectionId={setSelectedCollectionId}
        setIsCreatingCollection={setIsCreatingCollection}
      />

      {/* MAIN CONTENT AREA */}
      <main className="max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 mt-4">
        
        {/* Active Filter Header Indicator */}
        {(searchQuery.trim() !== '' || activeTab === 'collections') && (
          <div className="flex items-center justify-between mb-4 bg-emerald-950/80 border border-emerald-900/60 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <Folder className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {activeTab === 'collections'
                  ? selectedCollectionId === 'all'
                    ? 'All Custom Collections'
                    : collections.find(c => c.id === selectedCollectionId)?.name
                  : `Search Results`}
              </span>
              {searchQuery && <span className="font-mono font-bold text-emerald-400">"{searchQuery}"</span>}
              <span className="text-emerald-500 font-mono">({visibleIcons.length} icons)</span>
            </div>

            {activeTab === 'collections' && selectedCollectionId !== 'all' && selectedCollectionId !== 'default_fav' && (
              <button
                onClick={() => handleDeleteCollection(selectedCollectionId)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Collection
              </button>
            )}
          </div>
        )}

        {/* ULTRA-DENSE ICON GRID COMPONENT */}
        <IconGrid
          icons={visibleIcons}
          selectedSize={selectedSize}
          onSelectIcon={setSelectedIcon}
          handleImageError={handleImageError}
          getIconTags={getIconTags}
          searchQuery={searchQuery}
          activeTab={activeTab}
          onClearSearch={() => setSearchQuery('')}
          onSwitchToStream={() => setActiveTab('stream')}
          isLoadingMore={isLoadingMore}
        />

        {/* INFINITE STREAM SPINNER */}
        {activeTab === 'stream' && searchQuery.trim() === '' && (
          <div className="text-center py-10 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-emerald-400/70 font-mono">
              Auto-streaming icons continuously... Scroll down for more
            </p>
          </div>
        )}

      </main>

      {/* BACK TO TOP BUTTON */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:scale-110 text-white p-3 rounded-full shadow-2xl shadow-emerald-500/40 transition-all"
        title="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* CREATE COLLECTION MODAL COMPONENT */}
      <CreateCollectionModal
        isOpen={isCreatingCollection}
        onClose={() => setIsCreatingCollection(false)}
        onCreate={createCollection}
      />

      {/* ICON INSPECTOR MODAL COMPONENT */}
      <IconInspectorModal
        selectedIcon={selectedIcon}
        onClose={() => setSelectedIcon(null)}
        collections={collections}
        toggleIconInCollection={toggleIconInCollection}
        isIconInCollection={isIconInCollection}
        addTagToIcon={addTagToIcon}
        removeTagFromIcon={removeTagFromIcon}
        getIconTags={getIconTags}
      />

    </div>
  );
}
