'use client'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { loadImageAsDataUrl, loadLogoImage, processDiagramForPDF } from './ImageUtils';

// Configure Roboto font

// Function to convert font to base64
const fontToBase64 = async (fontPath) => {
  try {
    const response = await fetch(fontPath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting font to base64:', error);
    return null;
  }
};

const loadCustomFont = async (fontPath) => {
  try {
    const response = await fetch(fontPath);
    const fontArrayBuffer = await response.arrayBuffer();

    // Convert ArrayBuffer to base64
    const base64Font = btoa(
      new Uint8Array(fontArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    return `data:application/font-ttf;base64,${base64Font}`;
  } catch (error) {
    console.error(`Error loading font from ${fontPath}:`, error);
    return null;
  }
};
// Font style setter with error handling
const setFontStyle = (doc, style) => {
  try {
    switch (style) {
      case 'light':
        doc.setFont('Roboto', 'light');
        break;
      case 'bold':
        doc.setFont('Roboto', 'bold');
        break;
      case 'italic':
        doc.setFont('Roboto', 'italic');
        break;
      default:
        doc.setFont('Roboto', 'normal');
    }
  } catch (error) {
    // Fallback to system font if Roboto fails
    console.warn('Failed to set Roboto font, falling back to default', error);
    doc.setFont('helvetica', 'normal');
  }
  return doc;
};

// Function to add certificate images if available
const addCertificateImages = async (doc, pageWidth, margin, certificatesData) => {
  if (!certificatesData || !certificatesData.length) return;

  const certY = 25;
  const maxCertHeight = 5;
  const certGap = 5; // Gap between certificates
  const certMaxWidth = 25; // Maximum width for certificates

  // Add certificate section label
  doc.setFontSize(8);
  doc.text('', pageWidth - margin - 75, certY + 5);

  // Get the certificate data from the certificates array
  const certificateItems = certificatesData[0]; // Using the first item which contains the certificate data

  if (certificateItems?.selected_values?.length > 0) {
    // Start from right side for certificates
    let certX = pageWidth - margin; // Start from the right margin

    // First pass to calculate total width needed
    const certImages = [];

    // Load all certificate images first
    for (const cert of certificateItems.selected_values) {
      if (cert.image_url) {
        try {
          const certImage = await loadImageAsDataUrl(cert.image_url);
          if (certImage) {
            // Create a temporary image to get dimensions
            const img = new Image();
            img.src = certImage;

            // Wait for image to load
            await new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve; // Also resolve on error to prevent hanging
            });

            // Calculate aspect ratio and adjust width/height
            const aspectRatio = img.width / img.height;
            const certHeight = maxCertHeight;
            const certWidth = Math.min(certHeight * aspectRatio, certMaxWidth);

            certImages.push({
              image: certImage,
              width: certWidth,
              height: certHeight,
              aspectRatio: aspectRatio,
              name: cert.value
            });
          }
        } catch (e) {
          console.error("Error loading certificate image:", e);
        }
      }
    }

    // Position and draw certificates from right to left
    for (const cert of certImages) {
      certX -= cert.width; // Move left by the width of this certificate

      // Draw white background first
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(0, 0, 0);
      doc.rect(certX, certY - 7, cert.width, cert.height, 'F');

      // Add the image
      doc.addImage(cert.image, 'JPEG', certX, certY - 7, cert.width, cert.height);

      // Add certificate name below the image if needed
      doc.setFontSize(6);
      doc.setTextColor(0, 0, 0);

      // Move to next position
      certX -= certGap;
    }
  }
};

// Add product details section
const addProductDetails = async (doc, product, margin, yPosition, contentWidth) => {
  // Calculate column widths
  const leftColumnWidth = contentWidth * 0.5;
  const rightColumnWidth = contentWidth * 0.5;

  // Left column content (heading + description)
  const leftColumnX = margin;

  // Right column content (image)
  const rightColumnX = margin + leftColumnWidth;

  // Left column - Product details heading
  doc.setFontSize(12);
  setFontStyle(doc, 'normal').text("PRODUCT DETAILS", leftColumnX, yPosition);

  yPosition += 10;

  // Left column - Description
  doc.setFontSize(8);
  const description = product.description || 'No description available';

  // Split description text to fit in the left column width
  const splitDescription = doc.splitTextToSize(description, leftColumnWidth - 10);
  setFontStyle(doc, 'normal').text(splitDescription, leftColumnX, yPosition - 1);

  // Right column - Product image
  const imageWidth = rightColumnWidth;
  const imageHeight = 50;

  // Add actual product image if available
  if (product.imageUrl) {
    try {
      const productImage = await loadImageAsDataUrl(product.imageUrl);
      if (productImage) {
        // Draw white background first
        doc.setFillColor(255, 255, 255);
        doc.rect(rightColumnX, yPosition - 4, imageWidth, imageHeight, 'F');
        // Add the image
        doc.addImage(productImage, 'JPEG', rightColumnX, yPosition - 4, imageWidth, imageHeight);
      } else {
        // Fallback if image fails to load
        doc.setDrawColor(0, 0, 0);
        doc.setFillColor(240, 240, 240);
        doc.rect(rightColumnX, yPosition - 7, imageWidth, imageHeight, 'FD');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("Product Image", rightColumnX + imageWidth / 2 - 15, yPosition - 7 + imageHeight / 2);
        doc.setTextColor(0, 0, 0);
      }
    } catch (e) {
      console.error("Error adding product image:", e);
      // Fallback for error
      doc.setDrawColor(0, 0, 0);
      doc.setFillColor(240, 240, 240);
      doc.rect(rightColumnX, yPosition - 7, imageWidth, imageHeight, 'FD');
      doc.setFontSize(8);
      doc.text("Product Image", rightColumnX + imageWidth / 2 - 15, yPosition - 7 + imageHeight / 2);
    }
  } else {
    // No image available
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(240, 240, 240);
    doc.rect(rightColumnX, yPosition - 7, imageWidth, imageHeight, 'FD');
    doc.setFontSize(8);
    doc.text("No Image", rightColumnX + imageWidth / 2 - 15, yPosition - 7 + imageHeight / 2);
  }

  // Return new position below the taller of description or image
  return yPosition + Math.max(splitDescription.length * 5 + 5, imageHeight);
};

// Add product diagrams with improved image quality and grid-based layout
const addProductDiagrams = async (doc, diagrams, margin, yPosition, pageHeight, contentWidth) => {
  if (!diagrams || diagrams.length === 0) return yPosition;

  doc.setFontSize(12);
  setFontStyle(doc, 'normal').text("DRAWINGS", margin, yPosition);

  // Add line right under the heading
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

  yPosition += 7; // Consistent spacing after heading

  // Grid configuration
  const totalCols = 4; // Exactly 4 columns per row
  const diagramGap = 5; // Gap between diagrams
  const standardHeight = 40; // Fixed standard height for all rows

  // Calculate standard column width
  const singleColWidth = (contentWidth - ((totalCols - 1) * diagramGap)) / totalCols;

  let currentX = margin;
  let currentY = yPosition;
  let colsUsedInRow = 0;

  // Process each diagram with higher quality handling
  for (let i = 0; i < diagrams.length; i++) {
    const diagram = diagrams[i];

    try {
      // Use the enhanced processDiagramForPDF function from the ImageUtils
      const processedDiagram = await processDiagramForPDF(diagram);

      if (processedDiagram && processedDiagram.dataUrl) {
        // Get aspect ratio from processed data
        const aspectRatio = processedDiagram.aspectRatio;

        // Determine column span based on aspect ratio
        let colsToUse;

        if (aspectRatio >= 4 * (singleColWidth / standardHeight)) {
          colsToUse = 4; // Full row width (4x wider than tall)
        } else if (aspectRatio >= 3 * (singleColWidth / standardHeight)) {
          colsToUse = 3; // Three columns (3x wider than tall)
        } else if (aspectRatio >= 2 * (singleColWidth / standardHeight)) {
          colsToUse = 2; // Two columns (2x wider than tall)
        } else {
          colsToUse = 1; // One column (square or portrait)
        }

        // Check if this diagram will fit in the current row
        if (colsUsedInRow + colsToUse > totalCols) {
          // Move to next row
          currentX = margin;
          currentY += standardHeight + diagramGap;
          colsUsedInRow = 0;

          // Check if we need a new page
          if (currentY + standardHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
            // Re-add section header on new page
            doc.setFontSize(12);
            setFontStyle(doc, 'normal').text("DRAWINGS (continued)", margin, currentY);
            doc.setDrawColor(0, 0, 0);
            doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
            currentY += 7;
          }
        }

        // Calculate the actual width this diagram will use
        const diagramWidth = (colsToUse * singleColWidth) + ((colsToUse - 1) * diagramGap);

        // Draw white background
        doc.setFillColor(255, 255, 255);
        doc.rect(currentX, currentY, diagramWidth, standardHeight, 'F');

        // Add the image with improved quality settings
        doc.addImage(
          processedDiagram.dataUrl,   // Use processed high-quality data URL
          'PNG',                       // Use PNG format for diagrams
          currentX,                   // X position
          currentY,                   // Y position
          diagramWidth,               // Width based on columns
          standardHeight,             // Standard height
          `drawing-${i}-${Date.now()}`, // Unique alias with timestamp
          'FAST',                     // 'FAST' compression for better quality/performance
          0                           // No rotation
        );

        // Update position for next diagram
        currentX += diagramWidth + diagramGap;
        colsUsedInRow += colsToUse;
      } else {
        // Fallback for failed image processing
        if (colsUsedInRow + 1 > totalCols) {
          // Move to next row
          currentX = margin;
          currentY += standardHeight + diagramGap;
          colsUsedInRow = 0;

          // Check if we need a new page
          if (currentY + standardHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
            // Re-add section header on new page
            doc.setFontSize(12);
            setFontStyle(doc, 'normal').text("DRAWINGS (continued)", margin, currentY);
            doc.setDrawColor(0, 0, 0);
            doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
            currentY += 7;
          }
        }

        // Draw placeholder
        doc.setDrawColor(180, 180, 180);
        doc.setFillColor(230, 230, 230);
        doc.rect(currentX, currentY, singleColWidth, standardHeight, 'FD');
        doc.setFontSize(8);
        doc.text(`Drawing ${i + 1}`, currentX + singleColWidth / 2 - 15, currentY + standardHeight / 2);

        // Move to next position
        currentX += singleColWidth + diagramGap;
        colsUsedInRow += 1;
      }
    } catch (e) {
      console.error("Error processing diagram:", e);

      // Error fallback - use single column
      if (colsUsedInRow + 1 > totalCols) {
        // Move to next row
        currentX = margin;
        currentY += standardHeight + diagramGap;
        colsUsedInRow = 0;

        // Check if we need a new page
        if (currentY + standardHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
          // Re-add section header on new page
          doc.setFontSize(12);
          setFontStyle(doc, 'normal').text("", margin, currentY);
          doc.setDrawColor(0, 0, 0);
          doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
          currentY += 7;
        }
      }

      // Draw placeholder
      doc.setDrawColor(180, 180, 180);
      doc.setFillColor(230, 230, 230);
      doc.rect(currentX, currentY, singleColWidth, standardHeight, 'FD');
      doc.setFontSize(8);
      doc.text(`Drawing ${i + 1}`, currentX + singleColWidth / 2 - 15, currentY + standardHeight / 2);

      // Move to next position
      currentX += singleColWidth + diagramGap;
      colsUsedInRow += 1;
    }
  }

  // Update final position for next section
  yPosition = currentY + standardHeight + 7; // Add spacing after diagrams

  return yPosition;
};

// Add specifications section in two columns
const addSpecifications = (doc, specs, margin, yPosition, contentWidth) => {
  doc.setFontSize(12);
  setFontStyle(doc, 'normal').text("SPECIFICATIONS", margin, yPosition);

  // Add line right under the heading
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

  yPosition += 7;

  // Create data for specifications in two-column format
  const specEntries = Object.entries(specs)
    .filter(([_, value]) => value !== '' && value !== null && value !== undefined);

  if (specEntries.length > 0) {
    // Define more compact column layout
    const labelWidth = 40; // Shorter label column width
    const valueGap = 5;   // Gap between label and value
    const colGap = 20;    // Gap between columns

    // Calculate midpoint more intelligently based on total entries
    const midpoint = Math.ceil(specEntries.length / 2);

    // Split specifications into left and right column data
    const leftColSpecs = specEntries.slice(0, midpoint);
    const rightColSpecs = specEntries.slice(midpoint);

    // Calculate column positions
    const leftColX = margin;
    const leftValueX = leftColX + labelWidth;
    const rightColX = margin + contentWidth / 2 + 5; // Start second column at middle + 5pt
    const rightValueX = rightColX + labelWidth;

    // Set starting Y positions
    let leftColY = yPosition;
    let rightColY = yPosition;

    // Set spacing
    const lineHeight = 4;
    const rowPadding = 1;

    // Draw left column - all on the same page
    for (let i = 0; i < leftColSpecs.length; i++) {
      const [key, value] = leftColSpecs[i];

      // Key (label) styling
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(8);
      setFontStyle(doc, 'normal').text(key, leftColX, leftColY);

      // Split long values to prevent overlapping
      const splitValue = doc.splitTextToSize(String(value), contentWidth / 2 - labelWidth - 15);
      setFontStyle(doc, 'normal').text(splitValue, leftValueX, leftColY);

      // Adjust the row height based on the number of lines in the value
      if (splitValue.length > 1) {
        leftColY += (splitValue.length - 1) * lineHeight;
      }

      // Move to next row
      leftColY += lineHeight + rowPadding;
    }

    // Draw right column - all on the same page
    for (let i = 0; i < rightColSpecs.length; i++) {
      const [key, value] = rightColSpecs[i];

      // Key (label) styling
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(8);
      setFontStyle(doc, 'normal').text(key, rightColX, rightColY);

      // Split long values to prevent overlapping
      const splitValue = doc.splitTextToSize(String(value), contentWidth / 2 - labelWidth - 15);
      setFontStyle(doc, 'normal').text(splitValue, rightValueX, rightColY);

      // Adjust the row height based on the number of lines in the value
      if (splitValue.length > 1) {
        rightColY += (splitValue.length - 1) * lineHeight;
      }

      // Move to next row
      rightColY += lineHeight + rowPadding;
    }

    // Update Y position to the tallest column
    yPosition = Math.max(leftColY, rightColY) + 5; // Added extra space for better separation
  } else {
    doc.setFontSize(8);
    doc.text("No specifications selected", margin, yPosition);
    yPosition += 7;

    // Add a note about how to use the spec sheet
    yPosition += 10;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Note: For specifications with multiple values, all selected options are displayed separated by commas.", margin, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 7;
  }

  return yPosition;
};

// Add product feature categories
const addFeatureCategories = (doc, specSheet, margin, yPosition, pageHeight, contentWidth) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  if (!specSheet || specSheet.length === 0) return yPosition;

  // Loop through each category in specSheet
  for (const category of specSheet) {
    // Skip empty categories
    if (!category.items || category.items.length === 0) continue;

    // Check if we're approaching the page end - add new page if needed
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    // Add category header
    doc.setFontSize(12);
    setFontStyle(doc, 'normal').text(category.categoryName.toUpperCase(), margin, yPosition);

    // Add line right under the heading
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

    yPosition += 7;

    // Prepare data for this category
    const categoryItems = [];

    // Get data from all valid items in this category
    for (const item of category.items) {
      if (item.selected_values && item.selected_values.length > 0) {
        // Handle multiple values by joining them with commas
        const values = item.selected_values.map(val => val.value).filter(Boolean);
        categoryItems.push({
          name: item.name,
          value: values.join(', ')
        });
      }
    }

    if (categoryItems.length > 0) {
      // Use single column layout
      const labelWidth = 40;
      const valueX = margin + labelWidth;
      let currentY = yPosition;
      const lineHeight = 4;
      const rowPadding = 1;

      // Draw single column of features
      for (let i = 0; i < categoryItems.length; i++) {
        const item = categoryItems[i];

        doc.setFontSize(8);
        setFontStyle(doc, 'normal').text(item.name, margin, currentY);

        // Split long values to prevent overlapping
        const splitValue = doc.splitTextToSize(String(item.value), contentWidth - labelWidth);
        setFontStyle(doc, 'normal').text(splitValue, valueX, currentY);

        // Adjust the row height based on the number of lines in the value
        if (splitValue.length > 1) {
          currentY += (splitValue.length - 1) * lineHeight;
        }

        currentY += lineHeight + rowPadding;
      }

      // Update Y position
      yPosition = currentY + 1;

      // Add horizontal line after each category
      yPosition += 10;
    }
  }

  return yPosition;
};

// Add accessories section - Modified for 2-column layout
const addAccessories = async (doc, accessories, margin, yPosition, pageHeight, pageWidth, contentWidth) => {
  if (!accessories || accessories.length === 0) return yPosition;

  yPosition += 5;
  doc.setFontSize(12);
  doc.text("ACCESSORIES", margin, yPosition);

  // Add line right under the heading
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

  yPosition += 10;

  // Process accessories in 2-column layout
  if (accessories.some(acc => acc.selected_values && acc.selected_values.length > 0)) {
    // Calculate column widths and positions
    const colWidth = (contentWidth - 10) / 2; // 10px gap between columns
    const col1X = margin;
    const col2X = margin + colWidth + 10;
    let col1Y = yPosition;
    let col2Y = yPosition;

    // Process all accessories
    const allAccessoryValues = [];
    for (const accessory of accessories) {
      if (accessory.selected_values && accessory.selected_values.length > 0) {
        allAccessoryValues.push(...accessory.selected_values);
      }
    }

    // Split into two columns
    const midpoint = Math.ceil(allAccessoryValues.length / 2);
    const leftColAccessories = allAccessoryValues.slice(0, midpoint);
    const rightColAccessories = allAccessoryValues.slice(midpoint);

    // Define row dimensions
    const imageBoxWidth = 35; // Smaller image box
    const rowHeight = 20;
    const textPadding = 5;

    // Process left column
    for (let i = 0; i < leftColAccessories.length; i++) {
      const value = leftColAccessories[i];

      // Check if we need a new page
      if (col1Y + rowHeight > pageHeight - margin) {
        doc.addPage();
        col1Y = margin + 10;
        col2Y = margin + 10;

        // Re-add header on new page
        doc.setFontSize(12);

        doc.setDrawColor(0, 0, 0);
        doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
      }

      // Draw image area
      if (value.image_url) {
        try {
          const accessoryImage = await loadImageAsDataUrl(value.image_url);
          if (accessoryImage) {
            // Add white background
            doc.setFillColor(255, 255, 255);
            doc.rect(col1X, col1Y, imageBoxWidth, rowHeight, 'F');
            // Add image
            doc.addImage(accessoryImage, 'JPEG', col1X, col1Y, imageBoxWidth, rowHeight);
          } else {
            // Fallback
            doc.setDrawColor(180, 180, 180);
            doc.setFillColor(230, 230, 230);
            doc.rect(col1X, col1Y, imageBoxWidth, rowHeight, 'FD');
          }
        } catch (e) {
          console.error("Error adding accessory image:", e);
          // Fallback
          doc.setDrawColor(180, 180, 180);
          doc.setFillColor(230, 230, 230);
          doc.rect(col1X, col1Y, imageBoxWidth, rowHeight, 'FD');
        }
      } else {
        // No image
        doc.setDrawColor(180, 180, 180);
        doc.setFillColor(230, 230, 230);
        doc.rect(col1X, col1Y, imageBoxWidth, rowHeight, 'FD');
      }

      // Add text content
      const textX = col1X + imageBoxWidth + textPadding;
      const textWidth = colWidth - imageBoxWidth - textPadding;

      // Title
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      const valueTitle = value.value || 'Accessory';
      doc.text(valueTitle, textX, col1Y + 8);

      // Description
      if (value.value_shortform) {
        doc.setFontSize(8);
        const descriptionLines = doc.splitTextToSize(value.value_shortform, textWidth);
        doc.text(descriptionLines, textX, col1Y + 14);
      }

      // Move to next position
      col1Y += rowHeight + 5;
    }

    // Process right column
    for (let i = 0; i < rightColAccessories.length; i++) {
      const value = rightColAccessories[i];

      // Check if we need a new page - if left column already moved to new page
      if (col2Y + rowHeight > pageHeight - margin) {
        // Only add new page if we haven't already in the left column loop
        if (col2Y === col1Y - (rowHeight + 5)) {
          doc.addPage();
          col1Y = margin + 10; // Reset both columns
          col2Y = margin + 10;

          // Re-add header on new page
          doc.setFontSize(12);
          doc.text("ACCESSORIES (continued)", margin, margin);
          doc.setDrawColor(0, 0, 0);
          doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
        }
      }

      // Draw image area
      if (value.image_url) {
        try {
          const accessoryImage = await loadImageAsDataUrl(value.image_url);
          if (accessoryImage) {
            // Add white background
            doc.setFillColor(255, 255, 255);
            doc.rect(col2X, col2Y, imageBoxWidth, rowHeight, 'F');
            // Add image
            doc.addImage(accessoryImage, 'JPEG', col2X, col2Y, imageBoxWidth, rowHeight);
          } else {
            // Fallback
            doc.setDrawColor(180, 180, 180);
            doc.setFillColor(230, 230, 230);
            doc.rect(col2X, col2Y, imageBoxWidth, rowHeight, 'FD');
          }
        } catch (e) {
          console.error("Error adding accessory image:", e);
          // Fallback
          doc.setDrawColor(180, 180, 180);
          doc.setFillColor(230, 230, 230);
          doc.rect(col2X, col2Y, imageBoxWidth, rowHeight, 'FD');
        }
      } else {
        // No image
        doc.setDrawColor(180, 180, 180);
        doc.setFillColor(230, 230, 230);
        doc.rect(col2X, col2Y, imageBoxWidth, rowHeight, 'FD');
      }

      // Add text content
      const textX = col2X + imageBoxWidth + textPadding;
      const textWidth = colWidth - imageBoxWidth - textPadding;

      // Title
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      const valueTitle = value.value || 'Accessory';
      doc.text(valueTitle, textX, col2Y + 8);

      // Description
      if (value.value_shortform) {
        doc.setFontSize(8);
        const descriptionLines = doc.splitTextToSize(value.value_shortform, textWidth);
        doc.text(descriptionLines, textX, col2Y + 14);
      }

      // Move to next position
      col2Y += rowHeight + 5;
    }

    // Return the position of the tallest column
    yPosition = Math.max(col1Y, col2Y);

  } else {
    // No accessories message
    doc.setFontSize(8);
    doc.text("No accessories selected", margin, yPosition);
    yPosition += 10;
  }

  return yPosition;
};
// Main PDF generation function with page refresh
export const generatePDF = async (product, selectedSpecs, fullProductCode, additionalinfo) => {
  // Create new PDF document (A4 size)
  const doc = new jsPDF();

  // Paths to font files (ensure these paths are correct in your project)
  const fontPaths = {
    normal: '/fonts/Roboto-Regular.ttf',
    bold: '/fonts/Roboto-Bold.ttf',
    italic: '/fonts/Roboto-Italic.ttf',
    light: '/fonts/Roboto-Light.ttf'
  };


  // Convert fonts to base64
  const fonts = {};
  try {
    for (const [variant, path] of Object.entries(fontPaths)) {
      fonts[variant] = await fontToBase64(path);
    }

    // Add fonts to the document
    if (fonts.normal) {
      doc.addFont(fonts.normal, 'Roboto', 'normal');
    }
    if (fonts.bold) {
      doc.addFont(fonts.bold, 'Roboto', 'bold');
    }
    if (fonts.italic) {
      doc.addFont(fonts.italic, 'Roboto', 'italic');
    }
    if (fonts.light) {
      doc.addFont(fonts.light, 'Roboto', 'light');
    }
  } catch (error) {
    console.warn('Error loading custom fonts, falling back to system fonts', error);
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = 20;

  // Setup document
  const logoImage = await loadLogoImage();
  const logoHeight = 7;
  let logoWidth = 42; // Default, will be adjusted based on aspect ratio

  // If logo is loaded, calculate width based on aspect ratio
  if (logoImage) {
    // Create temporary image to get dimensions
    const img = new Image();
    img.src = logoImage;

    // Wait for image to load
    await new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });

    // Calculate width based on aspect ratio and fixed height
    if (img.height > 0) {
      logoWidth = (img.width / img.height) * logoHeight;
    }
  }

  // Setup footer with logo
  const logoX = margin; // Left aligned
  const logoY = pageHeight - margin; // Bottom with margin
  const addFooter = () => {
    if (logoImage) {
      // Add logo to footer
      doc.addImage(logoImage, 'PNG', logoX, logoY - logoHeight, logoWidth, logoHeight);
    }

    // Add footer text on the right side
    doc.setFontSize(8);
    doc.setFont('Roboto', 'normal');
    doc.setTextColor(100, 100, 100); // Light gray color

    const footerText = additionalinfo || 'test.valoled.com'
    const textWidth = doc.getStringUnitWidth(footerText) * 8 / doc.internal.scaleFactor;
    doc.text(footerText, pageWidth - margin - textWidth, logoY - 3);
    doc.setTextColor(0, 0, 0); // Reset text color
  };

  // Add footer to first page
  addFooter();

  // Override addPage to add footer to each page
  const originalAddPage = doc.addPage.bind(doc);
  doc.addPage = function () {
    originalAddPage.apply(this, arguments);
    addFooter();
    return this;
  };

  // Set default font
  doc.setFont('Roboto', 'normal');

  // Row 1: Product Name and Code
  doc.setFontSize(19);
  doc.setFont('Roboto', 'normal');
  doc.text(product.name || 'Product Name', margin, yPosition);

  yPosition += 8;
  doc.setFontSize(8);
  doc.setFont('Roboto', 'normal');
  // Calculate the width of the "Product Code: " text
  const codeLabel = "Product Code: ";
  const codeLabelWidth = doc.getStringUnitWidth(codeLabel) * 9 / doc.internal.scaleFactor;
  // Draw the label
  setFontStyle(doc, 'normal').text(codeLabel, margin, yPosition);
  // Switch to light font for the code itself and position it after the label
  doc.setFont('Roboto', 'light');
  setFontStyle(doc, 'normal').text(`${fullProductCode || product.code || 'N/A'}`, margin + codeLabelWidth, yPosition);
  // Reset font to normal
  doc.setFont('Roboto', 'normal');

  // Add certificate images on the right side
  await addCertificateImages(doc, pageWidth, margin, product.certificates);

  // Add horizontal line
  yPosition += 3;
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
  yPosition += 10;

  // Row 2: Product Details - Description and Image
  yPosition = await addProductDetails(doc, product, margin, yPosition, contentWidth);

  // Add horizontal line
  yPosition += 7; // Consistent spacing before Drawings section

  // Row 2.5: Product Diagrams (if available)
  if (product.product_diagrams) {
    yPosition = await addProductDiagrams(doc, product.product_diagrams, margin, yPosition, pageHeight, contentWidth);
  }

  // Check if we're approaching the page end - add new page if needed
  if (yPosition > pageHeight - 60) { // Increased safety margin
    doc.addPage();
    yPosition = margin + 10;
  }

  // Row 3: Selected Specifications - Now in 2 columns
  yPosition = addSpecifications(doc, selectedSpecs, margin, yPosition, contentWidth);

  // Check if we're approaching the page end - add new page if needed
  if (yPosition > pageHeight - 60) { // Increased safety margin
    doc.addPage();
    yPosition = margin + 10;
  }

  // Add horizontal line
  yPosition += 7; // Consistent spacing before Features section

  // Row 4: Features and other categories - Also in 2 columns
  if (product.specSheet) {
    yPosition = addFeatureCategories(doc, product.specSheet, margin, yPosition, pageHeight, contentWidth);
  }

  // Check if we're approaching the page end - add new page if needed
  if (yPosition > pageHeight - 60) { // Increased safety margin
    doc.addPage();
    yPosition = margin + 10;
  }

  // Row 5: Accessories (if available) - With 2-column layout
  if (product.accessories) {
    yPosition = await addAccessories(doc, product.accessories, margin, yPosition, pageHeight, pageWidth, contentWidth);
  }

  // Save the PDF
  const fileName = `${product.code || 'product'}-specifications.pdf`;
  doc.save(fileName);

  // Refresh the page after PDF generation and download
  setTimeout(() => {
    window.location.reload();
  }, 1000); // Add a 1-second delay to ensure the download starts before the page refreshes

  return fileName;
};