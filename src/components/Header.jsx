import React from 'react';
import { Search, Sparkles, X, Folder, Layers, Command } from 'lucide-react';
import { SIZES } from '../utils/flaticon';

export default function Header({
  searchQuery,
  setSearchQuery,
  selectedSize,
  setSelectedSize,
  activeTab,
  setActiveTab,
  totalSavedCount
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#04100b]/90 backdrop-blur-2xl border-b border-emerald-900/40 px-4 lg:px-8 py-3.5 shadow-2xl shadow-emerald-950/40 min-h-[64px]">
      <div className="max-w-[1920px] mx-auto flex flex-col justify-between gap-3">
        
        {/* Top Bar Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Emerald Animated Logo & Status */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 opacity-70 blur-md animate-pulse"></div>
                <div className="relative w-10 h-10 rounded-xl bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center shadow-lg">
                  <img src="/Untitled design.png" alt="" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-400 bg-clip-text text-transparent animate-shimmer">
                    Icon Studio 
                  </h1>
                </div>
                <p className="text-[11px] text-emerald-400/60 font-mono h-4">
                  Size • {selectedSize}x{selectedSize}px PNG
                </p>
              </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden items-center bg-emerald-950/80 border border-emerald-900/50 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('stream')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'stream' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow' : 'text-emerald-400/60'
                }`}
              >
                Stream
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                  activeTab === 'collections' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : 'text-emerald-400/60'
                }`}
              >
                <Folder className="w-3 h-3 text-emerald-400" />
                {totalSavedCount}
              </button>
            </div>
          </div>

          {/* Search Input Bar with Emerald Glow on Focus */}
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 group-focus-within:text-teal-300 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collection or custom tags..."
              className="w-full bg-emerald-950/60 border border-emerald-900/60 rounded-xl pl-10 pr-10 py-1.5 text-xs text-emerald-100 placeholder-emerald-600/70 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/30 shadow-inner transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-500/60 bg-emerald-950 border border-emerald-900 px-1.5 py-0.5 rounded">
                <Command className="w-2.5 h-2.5" /> K
              </span>
            )}
          </div>

          {/* Dynamic Size Switcher Pills & Desktop Tabs */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-400/80 uppercase tracking-widest hidden lg:inline">
                Size:
              </span>
              <div className="flex items-center bg-emerald-950/80 border border-emerald-900/60 rounded-xl p-1 shadow-inner">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                      selectedSize === s
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 scale-105'
                        : 'text-emerald-400/60 hover:text-emerald-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden md:flex items-center bg-emerald-950/80 border border-emerald-900/60 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setActiveTab('stream')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'stream'
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-emerald-400/60 hover:text-emerald-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Continuous Stream
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'collections'
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-emerald-400/60 hover:text-emerald-200'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-emerald-400" />
                My Collections ({totalSavedCount})
              </button>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
