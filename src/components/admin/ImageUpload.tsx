"use client";
import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit-client";
import toast from "react-hot-toast";

interface ImageUploadProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export default function ImageUpload({
  label,
  value = [],
  onChange,
  multiple = false,
  maxFiles = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>(value);

  // Sync preview when value changes from parent
  useEffect(() => {
    setPreviewUrls(value);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(file => uploadToImageKit(file));
      const newUrls = await Promise.all(uploadPromises);

      const updatedUrls = multiple ? [...value, ...newUrls] : newUrls;
      
      onChange(updatedUrls);
      setPreviewUrls(updatedUrls);

      toast.success(`${newUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeImage = async (index: number) => {
    const urlToDelete = value[index];
    if (urlToDelete) {
      await deleteFromImageKit(urlToDelete);
    }

    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
    setPreviewUrls(updated);
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block">
        {label}
      </label>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-[#29B1D2] transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          disabled={isUploading}
        />
        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Upload size={24} className="text-gray-500" />
          </div>
          <p className="font-medium text-gray-700">Click to upload images</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max {maxFiles})</p>
        </label>
      </div>

      {/* Image Previews */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}