import React, { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';

export default function CreateCollectionModal({ isOpen, onClose, onCreate }) {
  const [collectionName, setCollectionName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!collectionName.trim()) return;
    onCreate(collectionName.trim());
    setCollectionName('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#04100b]/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-emerald-950/95 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-emerald-950/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-emerald-100 flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-emerald-400" /> Create Custom Collection
          </h3>
          <button onClick={onClose} className="text-emerald-500 hover:text-emerald-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-emerald-400/80 block mb-1.5">
              Collection Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Navigation Arrows, Social Media, User Avatars..."
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="w-full bg-[#04100b] border border-emerald-900 rounded-xl px-3 py-2 text-xs text-emerald-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-emerald-900/60 hover:bg-emerald-900 text-emerald-300 text-xs px-4 py-2 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
            >
              Create Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
