/**
 * Upload Image to ImageKit (Safe Version)
 */
export const uploadToImageKit = async (
  file: File
): Promise<string> => {
  try {
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file provided");
    }

    let fileToUpload: File = file;

    console.log(
      `📤 Original: ${file.name} - ${(file.size / 1024 / 1024).toFixed(2)} MB`
    );

    // Compress if it's an image and bigger than 2.5MB
    if (file.type.startsWith("image/") && file.size > 2.5 * 1024 * 1024) {
      console.log("🔄 Compressing...");

      const imageCompression = (
        await import("browser-image-compression")
      ).default;

      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      // Convert Blob → File
      fileToUpload = new File(
        [compressedBlob],
        file.name,
        {
          type: compressedBlob.type || file.type,
          lastModified: Date.now(),
        }
      );

      console.log(
        `✅ Compressed: ${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB`
      );
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
      const text = await res.text();
      throw new Error(text || "Upload failed");
    }

    const data = await res.json();

    return data.url;

  } catch (error: any) {
    console.error("💥 Upload Error:", error);
    throw new Error(error.message || "Upload failed");
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