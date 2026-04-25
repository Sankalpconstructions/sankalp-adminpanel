import { upload } from "@imagekit/javascript";

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";

export const uploadToImageKit = async (file: File): Promise<string> => {
  try {
    // 1. Get authentication parameters from our backend
    const authRes = await fetch("/api/imagekit-auth");
    if (!authRes.ok) throw new Error("Failed to get ImageKit authentication");
    
    const authData = await authRes.json();

    // 2. Perform the upload using the functional upload API (v5+)
    const result = await upload({
      file,
      fileName: file.name,
      publicKey,
      signature: authData.signature,
      expire: authData.expire,
      token: authData.token,
      useUniqueFileName: true,
    });

    return result.url;
  } catch (error) {
    console.error("ImageKit upload error:", error);
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
