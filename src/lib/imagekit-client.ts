/**
 * Upload Image to ImageKit with Automatic Compression
 */
export const uploadToImageKit = async (file: File): Promise<string> => {
  try {
    let fileToUpload = file;
    console.log(`📤 Original: ${file.name} - ${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    // Compress if file is larger than 2.5 MB
    if (file.size > 2.5 * 1024 * 1024) {
      console.log("🔄 Compressing image...");

      const compressedFile = await compressImage(file);
      fileToUpload = compressedFile;

      console.log(`✅ Compressed to: ${(compressedFile.size / (1024 * 1024)).toFixed(2)} MB`);
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("fileName", fileToUpload.name);

    console.log("🚀 Sending to backend...");

    const res = await fetch("/api/imagekit-upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = errorText.slice(0, 150);
      try {
        const json = JSON.parse(errorText);
        errorMsg = json.error || errorMsg;
      } catch {}
      
      console.error("❌ Upload Failed:", errorMsg);
      throw new Error(errorMsg);
    }

    const data = await res.json();
    console.log("✅ Upload Successful:", data.url);
    return data.url;

  } catch (error: any) {
    console.error("💥 Upload Error:", error);
    throw new Error(error.message || "Failed to upload image");
  }
};

/** Image Compression Helper */
const compressImage = async (file: File): Promise<File> => {
  // Dynamically import browser-image-compression
  const imageCompression = (await import('browser-image-compression')).default;

  const options = {
    maxSizeMB: 2.0,           // Target max 2MB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    preserveExif: true,
  };
  
  try {
    return await imageCompression(file, options);
  } catch (err) {
    console.warn("Compression failed, using original file", err);
    return file;
  }
};

/**
 * Delete Image from ImageKit
 */
export const deleteFromImageKit = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl || !imageUrl.includes("imagekit.io")) {
      console.log("⏭️ Skipping delete - Not an ImageKit URL");
      return false;
    }

    console.log("🗑️ Attempting to delete image...");

    const res = await fetch("/api/imagekit-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    if (res.ok) {
      console.log("✅ Image deleted successfully from ImageKit");
    } else {
      console.warn(`⚠️ Delete failed with status: ${res.status}`);
    }

    return res.ok;
  } catch (error) {
    console.error("❌ Error in deleteFromImageKit:", error);
    return false;
  }
};