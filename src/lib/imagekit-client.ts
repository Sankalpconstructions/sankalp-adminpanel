const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result as string;
    const comma = dataUrl.indexOf(',');
    resolve(dataUrl.slice(comma + 1));
  };
  reader.onerror = (e) => reject(e);
  reader.readAsDataURL(file);
});

export const uploadToImageKit = async (file: File): Promise<string> => {
  try {
    // Convert file to base64 and send to our server to avoid CORS
    const base64 = await toBase64(file);
    const res = await fetch('/api/imagekit-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, base64 }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error('Server upload failed: ' + txt);
    }
    const data = await res.json();
    return data.url || data.filePath || '';
  } catch (error) {
    console.error('ImageKit upload (server fallback) error:', error);
    throw error;
  }
};

/**
 * Deletes an image from ImageKit via our backend API
 */
export const deleteFromImageKit = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl || !imageUrl.includes("imagekit.io")) {
      return false; // Don't try to delete external/placeholder images
    }
    
    const res = await fetch("/api/imagekit-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });
    
    return res.ok;
  } catch (error) {
    console.error("Error calling delete API:", error);
    return false;
  }
};
