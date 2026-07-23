import React, { useState, memo } from 'react';
import { Tag, SearchX } from 'lucide-react';
import { buildIconUrl } from '../utils/flaticon';

// Zero-CLS Memoized Card: Strict 1:1 Aspect Ratio prevents vertical stretching
const IconCard = memo(function IconCard({ icon, selectedSize, onSelectIcon, handleImageError, getIconTags }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const iconUrl = buildIconUrl(icon.folder, icon.index, selectedSize);
  const iconTags = getIconTags(icon.id);

  return (
    <div
      onClick={() => onSelectIcon(icon)}
      className="group relative bg-white border border-slate-200/90 hover:border-emerald-400 rounded-xl aspect-square w-full p-1.5 flex items-center justify-center cursor-pointer shadow-xs hover:shadow-2xl hover:shadow-emerald-500/25 transition-transform duration-200 ease-out hover:-translate-y-1.5 hover:scale-110 hover:z-20 transform-gpu overflow-hidden gpu-contain gpu-layer"
      title="Click to inspect, tag, or add to custom collection"
    >
      {/* Classic Instagram Light Gray Skeleton Loader (Absolute overlay) */}
      {!isLoaded && (
        <div className="absolute inset-0 p-1 bg-white rounded-xl flex items-center justify-center z-10">
          <div className="w-full h-full skeleton-insta-classic rounded-lg"></div>
        </div>
      )}

      {/* Crisp PNG Icon with Explicit Dimensions & Async Decoding */}
      <img
        src={iconUrl}
        alt="Icon"
        width="64"
        height="64"
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => handleImageError(icon.id)}
        className={`w-full h-full object-contain drop-shadow-xs transition-opacity duration-200 ${
          isLoaded ? 'opacity-100 scale-100 group-hover:scale-105' : 'opacity-0 scale-95'
        }`}
      />

      {/* Custom Tag Badge */}
      {isLoaded && iconTags.length > 0 && (
        <div className="absolute top-0.5 right-0.5 z-20 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full p-0.5 shadow-md">
          <Tag className="w-2.5 h-2.5" />
        </div>
      )}
    </div>
  );
});

// Standalone Skeleton Card for Stream Appends
export const SkeletonIconCard = memo(function SkeletonIconCard() {
  return (
    <div className="relative bg-white border border-slate-200/90 rounded-xl aspect-square w-full p-1 flex items-center justify-center overflow-hidden shadow-sm gpu-contain">
      <div className="w-full h-full skeleton-insta-classic rounded-lg"></div>
    </div>
  );
});

const IconGrid = memo(function IconGrid({
  icons,
  selectedSize,
  onSelectIcon,
  handleImageError,
  getIconTags,
  searchQuery,
  activeTab,
  onClearSearch,
  onSwitchToStream,
  isLoadingMore
}) {
  if (icons.length === 0 && !isLoadingMore) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-900/60 backdrop-blur-md rounded-3xl p-12 text-center my-12 max-w-md mx-auto shadow-2xl">
        <SearchX className="w-12 h-12 text-emerald-400/80 mx-auto mb-3 animate-bounce" />
        <h3 className="text-base font-bold text-emerald-100">
          {activeTab === 'collections' ? 'No Icons in this Collection' : 'No Icons Found'}
        </h3>
        <p className="text-xs text-emerald-400/70 mt-1 mb-5 leading-relaxed">
          {activeTab === 'collections'
            ? 'Click on any icon in the stream and click "Save to Custom Collections" to populate this view!'
            : `No matching icons found for "${searchQuery}".`}
        </p>
        {activeTab === 'collections' ? (
          <button
            onClick={onSwitchToStream}
            className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
          >
            Browse Continuous Stream
          </button>
        ) : (
          <button
            onClick={onClearSearch}
            className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Strict 1:1 Aspect Ratio Responsive Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-20 xl:grid-cols-24 2xl:grid-cols-28 gap-1.5 sm:gap-2 items-start">
        {icons.map((icon) => (
          <IconCard
            key={icon.id}
            icon={icon}
            selectedSize={selectedSize}
            onSelectIcon={onSelectIcon}
            handleImageError={handleImageError}
            getIconTags={getIconTags}
          />
        ))}

        {/* Render batch of 28 Skeleton Cards at bottom when loading more stream items */}
        {isLoadingMore &&
          Array.from({ length: 28 }).map((_, idx) => (
            <SkeletonIconCard key={`skeleton_${idx}`} />
          ))}
      </div>
    </div>
  );
});

export default IconGrid;
