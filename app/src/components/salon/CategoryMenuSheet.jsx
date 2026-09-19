import React from 'react';
import { X } from 'lucide-react';

export function CategoryMenuSheet({ open, tiles, onClose, onSelect }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 bg-black/45" aria-label="Close menu" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-t-[28px] bg-white px-5 pb-8 pt-5 shadow-2xl sm:rounded-[28px] sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <p className="font-studioSerif text-[22px]">Menu</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1917] text-white"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-x-3 gap-y-5">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => onSelect(tile.id)}
              className="flex flex-col text-left"
            >
              <span className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
                {tile.imageUrl ? (
                  <img src={tile.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </span>
              <span className="mt-2 line-clamp-2 text-[12px] leading-tight text-stone-700">
                {tile.shortName || tile.name || tile.categoryName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
