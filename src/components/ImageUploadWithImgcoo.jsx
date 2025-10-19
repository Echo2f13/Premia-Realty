import { useState, useRef } from "react";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";
import imageCompression from "browser-image-compression";

const ImageUploadWithImgcoo = ({ imageUrls = [], onImagesChange }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageLink, setImageLink] = useState("");
  const [addingLink, setAddingLink] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);
  const fileInputRef = useRef(null);

  // Maximum file size for uploads (2MB)
  const MAX_UPLOAD_SIZE_MB = 2;

  // Convert image to base64 data URL
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Compress and process image
  const processImage = async (file) => {
    console.log("📤 Processing image:", file.name, file.type, "Original size:", (file.size / 1024 / 1024).toFixed(2), "MB");

    // Check file size limit
    if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
      throw new Error(`File too large. Maximum ${MAX_UPLOAD_SIZE_MB}MB allowed. Please compress your image or use the image link option instead.`);
    }

    try {
      // Convert to base64
      console.log("🔄 Converting to base64...");
      const base64String = await convertToBase64(file);
      const base64SizeKB = (base64String.length / 1024).toFixed(2);
      console.log("✅ Conversion complete, base64 size:", base64SizeKB, "KB");

      return base64String;
    } catch (error) {
      console.error("❌ Image processing error:", error);
      throw error;
    }
  };

  // Handle adding image from URL
  const handleAddImageLink = () => {
    const trimmedLink = imageLink.trim();

    if (!trimmedLink) {
      alert("Please enter an image URL");
      return;
    }

    // Basic URL validation
    try {
      const url = new URL(trimmedLink);
      if (!url.protocol.startsWith('http')) {
        throw new Error("Invalid URL protocol");
      }
    } catch (error) {
      alert("Please enter a valid image URL (must start with http:// or https://)");
      return;
    }

    console.log("🔗 Adding image from URL:", trimmedLink);

    // Add URL to images array
    onImagesChange([...imageUrls, trimmedLink]);
    setImageLink("");
    setAddingLink(false);
  };

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const fileArray = Array.from(files);
    const uploadedUrls = [];

    try {
      console.log("Starting upload of", fileArray.length, "files");

      // Upload all files to Cloudinary
      for (const file of fileArray) {
        if (file.type.startsWith("image/")) {
          console.log("Uploading file:", file.name, "Size:", file.size, "bytes");

          try {
            const base64Url = await processImage(file);
            console.log("✅ Processing successful!");
            if (base64Url) {
              uploadedUrls.push(base64Url);
            }
          } catch (fileError) {
            console.error("Failed to upload file:", file.name, fileError);
            throw fileError; // Re-throw to be caught by outer catch
          }
        } else {
          console.warn("Skipping non-image file:", file.name, file.type);
        }
      }

      console.log("All uploads complete. Total URLs:", uploadedUrls.length);

      // Add new URLs to existing ones
      onImagesChange([...imageUrls, ...uploadedUrls]);
    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        stack: error.stack,
        error: error
      });
      alert(`Error uploading images: ${error.message || "Please try again."}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    console.log("🔵 handleFileSelect called, files:", e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      console.log("🔵 Files detected:", Array.from(e.target.files).map(f => f.name));
      handleFiles(e.target.files);
    } else {
      console.warn("🔴 No files selected");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    console.log("🔵 handleDrop called, files:", e.dataTransfer.files);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log("🔵 Dropped files:", Array.from(e.dataTransfer.files).map(f => f.name));
      handleFiles(e.dataTransfer.files);
    } else {
      console.warn("🔴 No files in drop event");
    }
  };

  const handleRemoveImage = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    onImagesChange(newUrls);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image reordering
  const handleImageDragStart = (e, index) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleImageDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedImageIndex === null || draggedImageIndex === index) return;

    // Create new array with reordered items
    const newUrls = [...imageUrls];
    const draggedItem = newUrls[draggedImageIndex];

    // Remove from old position
    newUrls.splice(draggedImageIndex, 1);

    // Insert at new position
    newUrls.splice(index, 0, draggedItem);

    onImagesChange(newUrls);
    setDraggedImageIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedImageIndex(null);
  };

  return (
    <div>
      {/* Upload Area */}
      <div
        className={`mb-4 rounded-lg border-2 border-dashed transition-all ${
          dragActive
            ? "border-gold-primary bg-gold-primary/10"
            : "border-gold-primary/30 bg-luxury-black/50"
        } ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-gold-primary/50"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-gold-primary animate-spin" />
              <span className="text-platinum-pearl font-medium">
                Processing images...
              </span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gold-primary" />
              <div className="text-center">
                <p className="text-platinum-pearl font-medium mb-1">
                  Drag and drop images here, or click to select
                </p>
                <p className="text-platinum-pearl/60 text-sm">
                  Maximum 2MB per image
                </p>
              </div>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* OR Divider */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gold-primary/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-platinum-pearl/60 uppercase tracking-wider">or</span>
        </div>
      </div>

      {/* Add Image Link Section */}
      <div className="mb-6">
        {!addingLink ? (
          <button
            type="button"
            onClick={() => setAddingLink(true)}
            className="w-full rounded-lg border-2 border-gold-primary/30 bg-luxury-black/50 px-6 py-4 text-platinum-pearl transition hover:border-gold-primary/50 hover:bg-luxury-black/70 flex items-center justify-center gap-2"
          >
            <LinkIcon className="h-5 w-5 text-gold-primary" />
            <span className="font-medium">Add Image from URL</span>
          </button>
        ) : (
          <div className="rounded-lg border-2 border-gold-primary/30 bg-luxury-black/50 p-4">
            <div className="flex gap-2">
              <input
                type="url"
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddImageLink()}
                placeholder="Paste image URL (e.g., https://example.com/image.jpg)"
                className="flex-1 rounded-lg bg-luxury-black/50 border border-gold-primary/20 px-4 py-3 text-platinum-pearl focus:border-gold-primary focus:outline-none placeholder:text-platinum-pearl/40"
              />
              <button
                type="button"
                onClick={handleAddImageLink}
                className="rounded-lg bg-gold-primary/20 px-6 py-3 text-sm font-semibold text-gold-primary hover:bg-gold-primary/30 transition whitespace-nowrap"
              >
                Add URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddingLink(false);
                  setImageLink("");
                }}
                className="rounded-lg bg-platinum-pearl/10 px-4 py-3 text-sm font-semibold text-platinum-pearl hover:bg-platinum-pearl/20 transition"
              >
                Cancel
              </button>
            </div>
            <p className="mt-2 text-xs text-platinum-pearl/60">
              For large images (&gt;2MB), upload to an image hosting service and paste the URL here
            </p>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {imageUrls.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm text-platinum-pearl/80 font-medium">
              {imageUrls.length} image{imageUrls.length !== 1 ? "s" : ""} uploaded
            </p>
            <span className="text-xs text-platinum-pearl/60">• Drag to reorder</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragEnd={handleImageDragEnd}
                className={`relative group cursor-move transition-all ${
                  draggedImageIndex === index ? "opacity-50 scale-95" : ""
                }`}
              >
                {/* Order Badge */}
                <div className="absolute top-2 left-2 bg-gold-primary text-luxury-black font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-lg">
                  {index + 1}
                </div>

                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border border-gold-primary/20"
                  draggable={false}
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600 z-10"
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Hover overlay with URL */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition rounded-b-lg">
                  <p className="truncate">{url.length > 50 ? url.substring(0, 50) + "..." : url}</p>
                </div>

                {/* Drag indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Drag to reorder
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      {imageUrls.length > 0 && (
        <p className="mt-4 text-sm text-platinum-pearl/60">
          {imageUrls.length} image{imageUrls.length !== 1 ? "s" : ""} uploaded
        </p>
      )}
    </div>
  );
};

export default ImageUploadWithImgcoo;
