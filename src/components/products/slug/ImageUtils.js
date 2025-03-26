'use client'

/**
 * Helper function to load image from URL and convert to base64 for PDF
 * with improved quality handling
 */
export const loadImageAsDataUrl = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(null);
      return;
    }

    // Use fetch with cors mode to try to get the image first
    fetch(url, {
      mode: 'cors',
      cache: 'no-store', // Prevent caching issues
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => {
          console.error("Error reading image blob");
          fallbackImageLoad(url, resolve);
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error("Error fetching image:", error);
        fallbackImageLoad(url, resolve);
      });
  });
};

/**
 * Load the company logo for the PDF footer
 */
export const loadLogoImage = async () => {
  try {
    const logoUrl = '/logocolorog2.png';
    return await loadImageAsDataUrl(logoUrl);
  } catch (error) {
    console.error('Error loading logo image:', error);
    return null;
  }
};

/**
 * Fallback image loading method using Image object 
 * when fetch fails due to CORS or other issues
 * Enhanced to preserve image quality
 */
export const fallbackImageLoad = (url, resolve) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";

  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      // Maintain higher resolution for better quality
      canvas.width = img.width || 600;  // Increased from 300
      canvas.height = img.height || 600; // Increased from 300
      const ctx = canvas.getContext('2d');

      // Fill with white background first (prevents transparency issues)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Use PNG format for better quality on diagrams with details
      const dataUrl = canvas.toDataURL('image/png', 1.0);  // Changed from JPEG to PNG with full quality
      resolve(dataUrl);
    } catch (e) {
      console.error("Error converting image to data URL:", e);
      resolve(null);
    }
  };

  img.onerror = (e) => {
    console.error("Error loading image:", url, e);
    resolve(null);
  };

  // Add a timestamp to prevent caching issues
  img.src = url + (url.includes('?') ? '&' : '?') + 'nocache=' + new Date().getTime();
};

/**
 * Optimizes image data for PDF embedding with improved quality
 * Especially for high-DPI technical diagrams
 */
export const optimizeImageForPDF = async (imageUrl, maxWidth, maxHeight) => {
  try {
    const dataUrl = await loadImageAsDataUrl(imageUrl);
    if (!dataUrl) return null;

    // Create image element to get dimensions
    const img = new Image();
    img.src = dataUrl;
    
    // Wait for image to load
    await new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });

    // Calculate aspect ratio
    const aspectRatio = img.width / img.height;
    
    // Calculate dimensions for high quality rendering
    // For technical diagrams, we want to preserve as much detail as possible
    let width, height;
    
    // For detailed diagrams, we keep larger dimensions
    width = Math.min(img.width, maxWidth * 2); // Higher resolution than strictly needed
    height = width / aspectRatio;
    
    // Ensure height is also within bounds
    if (height > maxHeight * 2) {
      height = maxHeight * 2;
      width = height * aspectRatio;
    }
    
    // Create canvas for the image at higher quality
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    // Use better image rendering
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    
    // For technical diagrams, PNG often offers better quality for line art
    return {
      dataUrl: canvas.toDataURL('image/png', 1.0),  // Changed to PNG with full quality
      width,
      height,
      aspectRatio
    };
  } catch (error) {
    console.error('Error optimizing image:', error);
    return null;
  }
};

/**
 * Special function for processing diagram images
 * with appropriate quality settings based on content type
 */
export const processDiagramForPDF = async (imageUrl) => {
  try {
    // Get the base image data first
    const dataUrl = await loadImageAsDataUrl(imageUrl);
    if (!dataUrl) return null;
    
    // Load image to analyze content type
    const img = new Image();
    img.src = dataUrl;
    
    // Wait for image to load
    await new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
    
    // Calculate aspect ratio
    const aspectRatio = img.width / img.height;
    
    // Prepare canvas at original size to maintain quality
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // For diagrams, PNG format usually works better than JPEG
    return {
      dataUrl: canvas.toDataURL('image/png', 1.0),
      width: img.width,
      height: img.height,
      aspectRatio: aspectRatio
    };
  } catch (error) {
    console.error('Error processing diagram:', error);
    return null;
  }
};