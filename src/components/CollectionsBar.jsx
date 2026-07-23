import React from 'react';
import { Bookmark, FolderPlus } from 'lucide-react';

export default function CollectionsBar({
  collections,
  activeTab,
  setActiveTab,
  selectedCollectionId,
  setSelectedCollectionId,
  setIsCreatingCollection
}) {
  const totalSavedCount = collections.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div className="border-t border-emerald-900/30 bg-[#04100b]/60 backdrop-blur-md px-4 lg:px-8 py-2 border-b border-emerald-900/30">
      <div className="flex items-center justify-between gap-2 max-w-[1920px] mx-auto w-full">
        
        {/* Custom Collection Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 pr-2 flex-shrink-0">
            <Bookmark className="w-3 h-3 text-teal-400" /> Collections:
          </span>

          <button
            onClick={() => {
              setActiveTab('collections');
              setSelectedCollectionId('all');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex-shrink-0 flex items-center gap-1.5 ${
              activeTab === 'collections' && selectedCollectionId === 'all'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white border-emerald-400/80 shadow-lg shadow-emerald-500/30'
                : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400/70 hover:text-emerald-200 hover:border-emerald-700'
            }`}
          >
            <span>All Saved</span>
            <span className="text-[10px] font-mono bg-emerald-950 px-1.5 py-0.5 rounded-md text-emerald-300">
              {totalSavedCount}
            </span>
          </button>

          {collections.map(col => {
            const isActive = activeTab === 'collections' && selectedCollectionId === col.id;
            return (
              <button
                key={col.id}
                onClick={() => {
                  setActiveTab('collections');
                  setSelectedCollectionId(col.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white border-emerald-400/80 shadow-lg shadow-emerald-500/30 scale-102'
                    : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400/70 hover:text-emerald-200 hover:border-emerald-700'
                }`}
              >
                <span>{col.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-white/20 text-white font-bold' : 'bg-emerald-950 text-emerald-400'
                }`}>
                  {col.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* New Collection Action Button */}
        <button
          onClick={() => setIsCreatingCollection(true)}
          className="bg-emerald-500/15 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0 shadow-md shadow-emerald-500/15 hover:scale-105"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>New Collection</span>
        </button>

      </div>
    </div>
  );
}
