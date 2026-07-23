/**
 * Flaticon CDN Helper Utilities
 * URL Pattern: https://cdn-icons-png.flaticon.com/{size}/{folder}/{folder}{padded3digits}.png
 */

export const SIZES = [16, 32, 64, 128, 256, 512];

export function buildIconUrl(folderId, indexNum, sizeNum = 512) {
  const paddedIndex = indexNum.toString().padStart(3, '0');
  return `https://cdn-icons-png.flaticon.com/${sizeNum}/${folderId}/${folderId}${paddedIndex}.png`;
}

export function getFullIconId(folderId, indexNum) {
  const paddedIndex = indexNum.toString().padStart(3, '0');
  return `${folderId}${paddedIndex}`;
}

export function generateFolderItems(folderId) {
  const items = [];
  for (let i = 0; i <= 999; i++) {
    const id = getFullIconId(folderId, i);
    items.push({
      folder: folderId,
      index: i,
      paddedIndex: i.toString().padStart(3, '0'),
      id
    });
  }
  return items;
}
