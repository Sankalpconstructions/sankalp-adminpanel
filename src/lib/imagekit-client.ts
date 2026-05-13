/**
 * Upload Image to ImageKit with Detailed Frontend Logging
 */
export const uploadToImageKit = async (file: File): Promise<string> => {
  try {
    console.log(`📤 [UPLOAD START] File: ${file.name}`);
    console.log(`📊 Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB | Type: ${file.type}`);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    console.log("🚀 Sending request to /api/imagekit-upload...");

    const res = await fetch("/api/imagekit-upload", {
      method: "POST",
      body: formData,
    });

    console.log(`📥 Response Status: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Upload failed";

      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.error || errorMsg;
      } catch {
        errorMsg = errorText.slice(0, 200);
      }

      console.error("❌ Upload Failed:", errorMsg);
      throw new Error(errorMsg);
    }

    const data = await res.json();

    console.log("✅ Upload Successful!");
    console.log("🔗 Image URL:", data.url);

    if (data.fileId) console.log("🆔 File ID:", data.fileId);

    return data.url;

  } catch (error: any) {
    console.error("💥 Upload Exception:", error.message || error);
    throw new Error(error.message || "Failed to upload image");
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