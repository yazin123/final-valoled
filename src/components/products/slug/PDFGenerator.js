'use client'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { loadImageAsDataUrl, loadLogoImage } from './ImageUtils';

// Function to add certificate images if available
const addCertificateImages = async (doc, pageWidth, margin, certificatesData) => {
  if (!certificatesData || !certificatesData.length) return;
  
  const certY = 25;
  const maxCertHeight = 5;
  const certGap = 5; // Gap between certificates
  const certMaxWidth = 25; // Maximum width for certificates

  // Add certificate section label
  doc.setFontSize(10);
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
      doc.setDrawColor(200, 200, 200);
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
  doc.setFontSize(11);
  doc.text("PRODUCT DETAILS", margin, yPosition);
  
  // Add line right under the heading
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
  
  yPosition += 7;

  // Description (left column)
  const descriptionWidth = contentWidth * 0.5;
  doc.setFontSize(10);
  const description = product.description || 'No description available';

  // Split description text to fit in the available width
  const splitDescription = doc.splitTextToSize(description, descriptionWidth);
  doc.text(splitDescription, margin, yPosition);

  // Product image (right column)
  const imageX = margin + descriptionWidth + 10;
  const imageWidth = contentWidth * 0.5 - 10;
  const imageHeight = 40;

  // Add actual product image if available
  if (product.imageUrl) {
    try {
      const productImage = await loadImageAsDataUrl(product.imageUrl);
      if (productImage) {
        // Draw white background first
        doc.setFillColor(255, 255, 255);
        doc.rect(imageX, yPosition, imageWidth, imageHeight, 'F');
        // Add the image with a slight margin-top (from -5 to 0)
        doc.addImage(productImage, 'JPEG', imageX, yPosition, imageWidth, imageHeight);
      } else {
        // Fallback if image fails to load
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(240, 240, 240);
        doc.rect(imageX, yPosition, imageWidth, imageHeight, 'FD');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Product Image", imageX + imageWidth / 2 - 15, yPosition + imageHeight / 2);
        doc.setTextColor(0, 0, 0);
      }
    } catch (e) {
      console.error("Error adding product image:", e);
      // Fallback for error
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(240, 240, 240);
      doc.rect(imageX, yPosition, imageWidth, imageHeight, 'FD');
      doc.setFontSize(10);
      doc.text("Product Image", imageX + imageWidth / 2 - 15, yPosition + imageHeight / 2);
    }
  } else {
    // No image available
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(240, 240, 240);
    doc.rect(imageX, yPosition, imageWidth, imageHeight, 'FD');
    doc.setFontSize(10);
    doc.text("No Image", imageX + imageWidth / 2 - 15, yPosition + imageHeight / 2);
  }

  // Return new position below the description/image
  return yPosition + Math.max(splitDescription.length * 5 + 5, imageHeight + 5);
};
// Add product diagrams
const addProductDiagrams = async (doc, diagrams, margin, yPosition, pageHeight, contentWidth) => {
  if (!diagrams || diagrams.length === 0) return yPosition;

  doc.setFontSize(11);
  doc.text("DRAWINGS", margin, yPosition);
  
  // Add line right under the heading
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
  
  yPosition += 5;

  // Create a flexible grid layout for diagrams
  const maxDiagramsPerRow = 4; // Maximum 4 diagrams per row
  const diagramGap = 5; // Gap between diagrams
  const baseHeight = 30; // Base height for diagrams
  
  let currentX = margin;
  let startY = yPosition;
  let rowHeight = baseHeight;
  let diagramsInCurrentRow = 0;

  // Add each diagram with actual image
  for (let i = 0; i < diagrams.length; i++) {
    // Check if we're approaching the page end - add new page if needed
    if (yPosition + rowHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      startY = yPosition;
      currentX = margin;
      diagramsInCurrentRow = 0;
    }

    const diagram = diagrams[i];

    try {
      // Load diagram image to determine aspect ratio
      const diagramImage = await loadImageAsDataUrl(diagram);
      if (diagramImage) {
        // Create a temporary image to get dimensions
        const img = new Image();
        img.src = diagramImage;

        // Wait for image to load
        await new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve; // Also resolve on error to prevent hanging
        });

        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        
        // Determine width based on aspect ratio
        let diagramWidth;
        let columnsToSpan = 1;
        
        // For wide/rectangular images, span multiple columns
        if (aspectRatio > 1.5) {
          // Wide image (landscape orientation)
          columnsToSpan = Math.min(3, maxDiagramsPerRow - diagramsInCurrentRow);
          diagramWidth = ((contentWidth - ((maxDiagramsPerRow - 1) * diagramGap)) / maxDiagramsPerRow) * columnsToSpan + ((columnsToSpan - 1) * diagramGap);
        } else {
          // Normal/square image
          diagramWidth = (contentWidth - ((maxDiagramsPerRow - 1) * diagramGap)) / maxDiagramsPerRow;
        }

        // If this diagram would overflow the row, start a new row
        if (diagramsInCurrentRow + columnsToSpan > maxDiagramsPerRow) {
          currentX = margin;
          yPosition += rowHeight + diagramGap;
          startY = yPosition;
          diagramsInCurrentRow = 0;
          rowHeight = baseHeight;
        }

        // Calculate height while maintaining aspect ratio
        const diagramHeight = diagramWidth / aspectRatio;
        
        // Update row height if this diagram is taller
        rowHeight = Math.max(rowHeight, diagramHeight);

        // Draw white background first
        doc.setFillColor(255, 255, 255);
        doc.rect(currentX, yPosition, diagramWidth, diagramHeight, 'F');
        
        // Add the image
        doc.addImage(diagramImage, 'JPEG', currentX, yPosition, diagramWidth, diagramHeight);
        
        // Move to next position and update diagrams count
        currentX += diagramWidth + diagramGap;
        diagramsInCurrentRow += columnsToSpan;
        
        // If row is full, move to next row
        if (diagramsInCurrentRow >= maxDiagramsPerRow) {
          currentX = margin;
          yPosition += rowHeight + diagramGap;
          startY = yPosition;
          diagramsInCurrentRow = 0;
          rowHeight = baseHeight;
        }
      } else {
        // Fallback if image fails to load (use standard size)
        const standardWidth = (contentWidth - ((maxDiagramsPerRow - 1) * diagramGap)) / maxDiagramsPerRow;
        
        // If this diagram would overflow the row, start a new row
        if (diagramsInCurrentRow >= maxDiagramsPerRow) {
          currentX = margin;
          yPosition += rowHeight + diagramGap;
          startY = yPosition;
          diagramsInCurrentRow = 0;
          rowHeight = baseHeight;
        }
        
        doc.setDrawColor(180, 180, 180);
        doc.setFillColor(230, 230, 230);
        doc.rect(currentX, yPosition, standardWidth, baseHeight, 'FD');
        doc.setFontSize(7);
        doc.text(`Drawing ${i + 1}`, currentX + 5, yPosition + baseHeight - 5);
        
        // Move to next position
        currentX += standardWidth + diagramGap;
        diagramsInCurrentRow++;
      }
    } catch (e) {
      console.error("Error adding diagram image:", e);
      // Fallback for error (use standard size)
      const standardWidth = (contentWidth - ((maxDiagramsPerRow - 1) * diagramGap)) / maxDiagramsPerRow;
      
      // If this diagram would overflow the row, start a new row
      if (diagramsInCurrentRow >= maxDiagramsPerRow) {
        currentX = margin;
        yPosition += rowHeight + diagramGap;
        startY = yPosition;
        diagramsInCurrentRow = 0;
        rowHeight = baseHeight;
      }
      
      doc.setDrawColor(180, 180, 180);
      doc.setFillColor(230, 230, 230);
      doc.rect(currentX, yPosition, standardWidth, baseHeight, 'FD');
      doc.setFontSize(7);
      doc.text(`Drawing ${i + 1}`, currentX + 5, yPosition + baseHeight - 5);
      
      // Move to next position
      currentX += standardWidth + diagramGap;
      diagramsInCurrentRow++;
    }
  }

  // Update position to below all diagrams
  if (diagramsInCurrentRow > 0) {
    yPosition += rowHeight;
  }

  return yPosition + 5;
};

// Add specifications section in two columns
const addSpecifications = (doc, specs, margin, yPosition, contentWidth) => {
  doc.setFontSize(11);
  doc.text("SPECIFICATIONS", margin, yPosition);
  
  // Add line right under the heading
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setDrawColor(200, 200, 200);
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
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(key, leftColX, leftColY);

      // Split long values to prevent overlapping
      const splitValue = doc.splitTextToSize(String(value), contentWidth / 2 - labelWidth - 15);
      doc.text(splitValue, leftValueX, leftColY);
      
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
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(key, rightColX, rightColY);

      // Split long values to prevent overlapping
      const splitValue = doc.splitTextToSize(String(value), contentWidth / 2 - labelWidth - 15);
      doc.text(splitValue, rightValueX, rightColY);
      
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
    doc.setFontSize(10);
    doc.text("No specifications selected", margin, yPosition);
    yPosition += 7;
    
    // Add a note about how to use the spec sheet
    yPosition += 10;
    doc.setFontSize(7);
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
    doc.setFontSize(11);
    doc.text(category.categoryName.toUpperCase(), margin, yPosition);
    
    // Add line right under the heading
    doc.setDrawColor(200, 200, 200);
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
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(item.name, margin, currentY);

        // Split long values to prevent overlapping
        const splitValue = doc.splitTextToSize(String(item.value), contentWidth - labelWidth);
        doc.text(splitValue, valueX, currentY);
        
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
  doc.setFontSize(11);
  doc.text("ACCESSORIES", margin, yPosition);
  
  // Add line right under the heading
  doc.setDrawColor(200, 200, 200);
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
    const imageBoxWidth = 25; // Smaller image box
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
        doc.setFontSize(11);
        doc.text("ACCESSORIES (continued)", margin, margin);
        doc.setDrawColor(200, 200, 200);
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
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const valueTitle = value.value || 'Accessory';
      doc.text(valueTitle, textX, col1Y + 8);
      
      // Description
      if (value.value_shortform) {
        doc.setFontSize(7);
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
          doc.setFontSize(11);
          doc.text("ACCESSORIES (continued)", margin, margin);
          doc.setDrawColor(200, 200, 200);
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
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const valueTitle = value.value || 'Accessory';
      doc.text(valueTitle, textX, col2Y + 8);
      
      // Description
      if (value.value_shortform) {
        doc.setFontSize(7);
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
    doc.setFontSize(10);
    doc.text("No accessories selected", margin, yPosition);
    yPosition += 10;
  }

  return yPosition;
};

// Main PDF generation function
export const generatePDF = async (product, selectedSpecs, fullProductCode) => {
  // Create new PDF document (A4 size)
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = 20;

  // Setup document
  const logoImage = await loadLogoImage();
  const logoHeight = 5;
  let logoWidth = 30; // Default, will be adjusted based on aspect ratio
  
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
  doc.setFont('helvetica');

  // Row 1: Product Name and Code
  doc.setFontSize(18);
  doc.text(product.name || 'Product Name', margin, yPosition);

  yPosition += 8;
  doc.setFontSize(10);
  doc.text(`Product Code: ${fullProductCode || product.code || 'N/A'}`, margin, yPosition);

  // Add certificate images on the right side
  await addCertificateImages(doc, pageWidth, margin, product.certificates);

  // Add horizontal line
  yPosition += 7;
  
  yPosition += 10;

  // Row 2: Product Details - Description and Image
  yPosition = await addProductDetails(doc, product, margin, yPosition, contentWidth);

  // Add horizontal line
  
  yPosition += 10;

  // Row 2.5: Product Diagrams (if available)
  if (product.product_diagrams) {
    yPosition = await addProductDiagrams(doc, product.product_diagrams, margin, yPosition, pageHeight, contentWidth);
    
    // Add horizontal line
    
    yPosition += 10;
  }

  // Check if we're approaching the page end - add new page if needed
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin + 10;
  }

  // Row 3: Selected Specifications - Now in 2 columns
  yPosition = addSpecifications(doc, selectedSpecs, margin, yPosition, contentWidth);

  // Check if we're approaching the page end - add new page if needed
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin + 10;
  }

  // Add horizontal line
  
  yPosition += 10;

  // Row 4: Features and other categories - Also in 2 columns
  if (product.specSheet) {
    yPosition = addFeatureCategories(doc, product.specSheet, margin, yPosition, pageHeight, contentWidth);
  }

  // Check if we're approaching the page end - add new page if needed
  if (yPosition > pageHeight - 50) {
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
  
  return fileName;
};