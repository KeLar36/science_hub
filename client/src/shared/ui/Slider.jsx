import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Slider({ images = [], className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextSlide = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const hasMultipleImages = images.length > 1;

  return (
    <div
      className={`relative group w-full overflow-hidden rounded-xl border border-border-color/60 bg-bg-tertiary aspect-[16/9] ${className}`}
    >
      <div
        className="w-full h-full flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={img.publicId || index} className="w-full h-full shrink-0">
            <img
              src={img.url}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {hasMultipleImages && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-lg bg-bg-primary/80 border border-border-color backdrop-blur-md text-text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-brand cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-lg bg-bg-primary/80 border border-border-color backdrop-blur-md text-text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-brand cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === slideIndex
                  ? "w-5 bg-brand"
                  : "w-1.5 bg-text-muted/40 hover:bg-text-muted/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
