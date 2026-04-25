import React, { useState } from "react";
import { Image as ImageIcon, RefreshCw, X } from "lucide-react";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit-client";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  label?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label,
  multiple = false,
  maxFiles = 5,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadToImageKit(file));
      const urls = await Promise.all(uploadPromises);

      if (multiple) {
        const currentUrls = Array.isArray(value) ? value : value ? [value] : [];
        const combined = [...currentUrls, ...urls].slice(0, maxFiles);
        onChange(combined);
      } else {
        // If replacing an existing image, delete the old one from ImageKit
        if (typeof value === "string" && value) {
          deleteFromImageKit(value);
        }
        onChange(urls[0]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image(s). Please check your ImageKit credentials.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (urlToRemove: string) => {
    // Delete from ImageKit storage
    deleteFromImageKit(urlToRemove);
    
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((url) => url !== urlToRemove));
    } else {
      onChange("");
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">
          {label}
        </label>
      )}
      
      <div className={`p-6 border-2 border-dashed rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center gap-3 transition-all group ${isUploading ? 'border-[#F5C33C]' : 'border-gray-200 hover:border-[#29B1D2]'}`}>
        <div className={`p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform ${isUploading ? 'text-[#F5C33C]' : 'text-[#29B1D2]'}`}>
          {isUploading ? <RefreshCw size={20} className="animate-spin" /> : <ImageIcon size={20} />}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-700">
            {isUploading ? "Uploading to ImageKit..." : multiple ? `Upload Images (Max ${maxFiles})` : "Upload Image"}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Supported: JPG, PNG, WEBP</p>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          id={`image-upload-${label?.replace(/\s+/g, '-').toLowerCase() || 'default'}`}
          onChange={onFileUpload}
          disabled={isUploading}
        />
        <label
          htmlFor={`image-upload-${label?.replace(/\s+/g, '-').toLowerCase() || 'default'}`}
          className="mt-1 px-4 py-1.5 bg-white border border-gray-200 font-bold uppercase text-[10px] tracking-widest text-gray-600 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
        >
          {isUploading ? "Processing..." : "Browse Files"}
        </label>
      </div>

      {(multiple && Array.isArray(value) && value.length > 0) ? (
        <div className="flex flex-wrap gap-3 mt-4">
          {value.map((url, idx) => (
            <div key={idx} className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200 group">
              <img src={url} alt={`upload-${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (!multiple && value && typeof value === 'string') ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden mt-2 border border-gray-100 shadow-sm group">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => removeImage(value)}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ImageUpload;
