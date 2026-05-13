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

// Improved Upload Function
export const uploadToImageKit = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    const res = await fetch("/api/imagekit-upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const data = await res.json();
    return data.url;

  } catch (error: any) {
    console.error("Upload failed:", error);
    throw new Error(error.message || "Failed to upload image");
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
