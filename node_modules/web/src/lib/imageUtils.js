
import pb from '@/lib/pocketbaseClient';

/**
 * Helper function to safely get a product image URL, handling both arrays and single strings,
 * as well as CDN URLs vs local PocketBase files.
 * 
 * @param {Object} product - The product record from PocketBase
 * @param {number} index - The index of the image to retrieve if product.image is an array
 * @returns {string} The resolved image URL or a fallback placeholder
 */
export const getProductImageUrl = (product, index = 0) => {
  const fallback = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400';
  
  if (!product || !product.image) return fallback;

  // Handle array of images (PocketBase maxSelect > 1) or single string
  const image = Array.isArray(product.image) ? product.image[index] : product.image;
  
  if (!image) return fallback;

  // If it's already a full URL (e.g., CDN), return it directly
  if (typeof image === 'string' && image.startsWith('http')) {
    return image;
  }

  // Otherwise, resolve the PocketBase file URL
  try {
    return pb.files.getUrl(product, image);
  } catch (error) {
    console.error('Error resolving image URL:', error);
    return fallback;
  }
};
