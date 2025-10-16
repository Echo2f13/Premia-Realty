import { useState } from "react";
import { X, GripVertical, Star } from "lucide-react";

const DraggableGallery = ({ images, onReorder, onRemove, onSetCover, coverIndex = 0 }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];

    // Remove from old position
    newImages.splice(draggedIndex, 1);
    // Insert at new position
    newImages.splice(index, 0, draggedImage);

    onReorder(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSetAsCover = (index) => {
    if (onSetCover) {
      onSetCover(index);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center text-platinum-pearl/50 py-8">
        No images uploaded yet
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {images.map((image, index) => (
        <div
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`relative group cursor-move ${
            draggedIndex === index ? "opacity-50" : ""
          }`}
        >
          {/* Image */}
          <div className="relative">
            <img
              src={typeof image === "string" ? image : image.preview || URL.createObjectURL(image)}
              alt={`Image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />

            {/* Cover Badge */}
            {index === coverIndex && (
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-gold-primary px-3 py-1 text-xs font-semibold text-luxury-black">
                <Star className="h-3 w-3 fill-current" />
                Cover
              </div>
            )}

            {/* Drag Handle */}
            <div className="absolute top-2 right-2 rounded-full bg-luxury-black/80 p-2 opacity-0 group-hover:opacity-100 transition cursor-move">
              <GripVertical className="h-4 w-4 text-platinum-pearl" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
            {index !== coverIndex && onSetCover && (
              <button
                type="button"
                onClick={() => handleSetAsCover(index)}
                className="rounded-full bg-gold-primary/90 p-2 text-luxury-black hover:bg-gold-primary transition"
                title="Set as cover"
              >
                <Star className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="rounded-full bg-red-500/90 p-2 text-white hover:bg-red-500 transition"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Image Number */}
          <div className="absolute bottom-2 left-2 rounded-full bg-luxury-black/80 px-2 py-1 text-xs text-platinum-pearl">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DraggableGallery;
