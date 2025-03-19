'use client'

/**
 * Helper function to load image from URL and convert to base64 for PDF
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
      headers: { 'Access-Control-Allow-Origin': '*' }
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
 */
export const fallbackImageLoad = (url, resolve) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";

  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 300;
      canvas.height = img.height || 300;
      const ctx = canvas.getContext('2d');

      // Fill with white background first (prevents transparency issues)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
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
 * Optimizes image data for PDF embedding
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
    
    // Calculate dimensions based on constraints while maintaining aspect ratio
    let width, height;
    
    if (aspectRatio > 1) { // Wider than tall
      width = Math.min(maxWidth, img.width);
      height = width / aspectRatio;
    } else { // Taller than wide or square
      height = Math.min(maxHeight, img.height);
      width = height * aspectRatio;
    }
    
    // Reduce resolution for PDF using canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to jpeg for better PDF compatibility
    return {
      dataUrl: canvas.toDataURL('image/jpeg', 0.8),
      width,
      height
    };
  } catch (error) {
    console.error('Error optimizing image:', error);
    return null;
  }
};