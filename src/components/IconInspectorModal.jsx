import React, { useState } from 'react';
import {
  X,
  Check,
  Copy,
  Download,
  Bookmark,
  Tag,
  Plus,
  ImageIcon,
  Code
} from 'lucide-react';
import { SIZES, buildIconUrl } from '../utils/flaticon';

export default function IconInspectorModal({
  selectedIcon,
  onClose,
  collections,
  toggleIconInCollection,
  isIconInCollection,
  addTagToIcon,
  removeTagFromIcon,
  getIconTags
}) {
  const [modalSize, setModalSize] = useState(512);
  const [modalBg, setModalBg] = useState('light'); // 'light' | 'dark' | 'checkerboard'
  const [copiedType, setCopiedType] = useState(null);
  const [customTagInput, setCustomTagInput] = useState('');

  if (!selectedIcon) return null;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadIcon = (iconUrl, iconId) => {
    const link = document.createElement('a');
    link.href = iconUrl;
    link.download = `flaticon-${iconId}-${modalSize}x${modalSize}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTagSubmit = (e) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    addTagToIcon(selectedIcon, customTagInput.trim());
    setCustomTagInput('');
  };

  const currentIconUrl = buildIconUrl(selectedIcon.folder, selectedIcon.index, modalSize);
  const iconTags = getIconTags(selectedIcon.id);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#04100b]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto "
      onClick={onClose}
    >
      <div
        className="bg-emerald-950/95 border border-emerald-500/40 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl shadow-emerald-950/80 flex flex-col md:flex-row my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Image Stage & Size Switcher */}
        <div className="w-full md:w-5/12 bg-[#04100b] p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-emerald-900/50">
          
          {/* Stage Background Switcher */}
          <div className="w-full flex items-center justify-end mb-4">
            <div className="flex items-center bg-emerald-950 border border-emerald-900 rounded-lg p-1">
              <button
                onClick={() => setModalBg('light')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${modalBg === 'light' ? 'bg-emerald-800 text-white' : 'text-emerald-400/60'}`}
              >
                White
              </button>
              <button
                onClick={() => setModalBg('dark')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${modalBg === 'dark' ? 'bg-emerald-800 text-white' : 'text-emerald-400/60'}`}
              >
                Dark
              </button>
              <button
                onClick={() => setModalBg('checkerboard')}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${modalBg === 'checkerboard' ? 'bg-emerald-800 text-white' : 'text-emerald-400/60'}`}
              >
                Grid
              </button>
            </div>
          </div>

          {/* Large Image Canvas */}
          <div
            className={`w-full aspect-square rounded-2xl flex items-center justify-center p-8 transition-colors ${
              modalBg === 'light'
                ? 'bg-white'
                : modalBg === 'checkerboard'
                ? 'bg-checkerboard-light'
                : 'bg-emerald-950/80 border border-emerald-900'
            }`}
          >
            <img
              src={currentIconUrl}
              alt="Icon Preview"
              className="max-h-full max-w-full object-contain drop-shadow-2xl transition-all transform hover:scale-105"
            />
          </div>

          {/* Dynamic Size Switcher */}
          <div className="w-full mt-5">
            <label className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-wider block mb-2 text-center">
              Select Size to Copy / Download
            </label>
            <div className="flex items-center justify-center bg-emerald-950 border border-emerald-900 rounded-xl p-1">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setModalSize(s)}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                    modalSize === s
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow'
                      : 'text-emerald-400/60 hover:text-emerald-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Custom Collections, Custom Tags, Code Snippets & Download */}
        <div className="w-full md:w-7/12 p-6 pt-2 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-emerald-100">Icon Inspector & Tag Manager</h3>
              <button
                onClick={onClose}
                className="text-emerald-500 hover:text-emerald-300 p-1.5 rounded-xl hover:bg-emerald-900/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

                          {/* 3. Code Exporters */}
            <div className="space-y-3">
              
              {/* Direct CDN URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-teal-400" /> Direct Image URL
                  </span>
                  {copiedType === 'url' && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono font-semibold">
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </span>
                  )}
                </div>
                <div className="bg-[#04100b] border border-emerald-900/60 rounded-xl p-2.5 flex items-start justify-between gap-3">
                  <div className="font-mono text-xs text-emerald-100 break-all select-all leading-relaxed w-full">
                    {currentIconUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(currentIconUrl, 'url')}
                    className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white p-1.5 rounded-lg transition-colors flex-shrink-0"
                    title="Copy CDN Link"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* HTML Tag */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-amber-400" /> HTML &lt;img&gt; Tag
                  </span>
                  {copiedType === 'html' && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono font-semibold">
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </span>
                  )}
                </div>
                <div className="bg-[#04100b] border border-emerald-900/60 rounded-xl p-2.5 flex items-start justify-between gap-3">
                  <div className="font-mono text-xs text-emerald-100 break-all select-all leading-relaxed w-full">
                    {`<img src="${currentIconUrl}" alt="Icon" width="${modalSize}" height="${modalSize}" />`}
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `<img src="${currentIconUrl}" alt="Icon" width="${modalSize}" height="${modalSize}" />`,
                        'html'
                      )
                    }
                    className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white p-1.5 rounded-lg transition-colors flex-shrink-0"
                    title="Copy HTML Tag"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* React JSX Snippet */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" /> React JSX Component
                  </span>
                  {copiedType === 'jsx' && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono font-semibold">
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </span>
                  )}
                </div>
                <div className="bg-[#04100b] border border-emerald-900/60 rounded-xl p-2.5 flex items-start justify-between gap-3 mb-4">
                  <div className="font-mono text-xs text-emerald-100 break-all select-all leading-relaxed w-full">
                    {`<img src="${currentIconUrl}" alt="Icon" className="w-12 h-12" />`}
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `<img src="${currentIconUrl}" alt="Icon" className="w-12 h-12" />`,
                        'jsx'
                      )
                    }
                    className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white p-1.5 rounded-lg transition-colors flex-shrink-0"
                    title="Copy React JSX"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
            {/* 1. Custom Collections Assigner */}
            <div className="bg-[#04100b] border border-emerald-900/60 rounded-2xl p-4 mb-4">
              <label className="text-xs font-semibold text-emerald-300 block mb-2.5 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-teal-400" /> Save to Custom Collections
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {collections.map(col => {
                  const inCol = isIconInCollection(col.id, selectedIcon.id);
                  return (
                    <button
                      key={col.id}
                      onClick={() => toggleIconInCollection(col.id, selectedIcon)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                        inCol
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/80 shadow-md shadow-emerald-500/25'
                          : 'bg-emerald-950 border-emerald-900 text-emerald-400/70 hover:text-emerald-200'
                      }`}
                    >
                      {inCol ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Custom Tags Manager */}
            <div className="bg-[#04100b] border border-emerald-900/60 rounded-2xl p-4">
              <label className="text-xs font-semibold text-teal-300 block mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Add Custom Search Tags
              </label>
              
              {/* Current Tags Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                {iconTags.length === 0 ? (
                  <span className="text-[11px] text-emerald-600/70 italic">No tags added yet. Add tags below to search this icon easily!</span>
                ) : (
                  iconTags.map((tag, idx) => (
                    <span key={idx} className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      #{tag}
                      <button
                        onClick={() => removeTagFromIcon(selectedIcon.id, tag)}
                        className="hover:text-rose-400 transition-colors"
                        title="Remove tag"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add New Tag Input Form */}
              <form onSubmit={handleTagSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type tag (e.g. user, avatar, profile, cart, arrow) & press Enter..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  className="w-full bg-emerald-950 border border-emerald-900 rounded-xl px-3 py-1.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Tag
                </button>
              </form>
            </div>



          {/* Bottom Download Footer */}
          <div className="pt-4 mt-2 border-t border-emerald-900/60 flex items-center justify-between gap-3">
            <button
              onClick={() => downloadIcon(currentIconUrl, selectedIcon.id)}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PNG ({modalSize}x{modalSize})
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
