
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image, Upload, X, ArrowLeft, ArrowRight } from "lucide-react";
import { SlideData } from "@/services/courseService";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useImageGenerator } from "@/hooks/useImageGenerator";
import { toast } from "@/hooks/use-toast";

interface SlidePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: SlideData | null;
  slides: SlideData[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const SlidePreviewModal: React.FC<SlidePreviewModalProps> = ({
  open,
  onOpenChange,
  slide,
  slides,
  currentIndex,
  onNavigate,
}) => {
  const [imageUploading, setImageUploading] = useState(false);
  const [imageGenerating, setImageGenerating] = useState(false);
  const { generateImage, results } = useImageGenerator();
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !slide?.slideId) return;
    
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setImageUploading(true);

    // In a real implementation, you would upload the image to your server
    // For now, we'll just create a local URL and simulate an upload
    const reader = new FileReader();
    reader.onload = () => {
      // Here you would typically upload to your backend/storage
      // For now we'll just simulate a delay
      setTimeout(() => {
        setImageUploading(false);
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully",
        });
        // In a real implementation, you would update the slide with the image URL
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async () => {
    if (!slide?.slideId) return;
    
    setImageGenerating(true);
    
    try {
      // Use the slide's visual prompt for image generation
      // If not available, use the title as a fallback
      const prompt = slide.visualPrompt || `Educational image about: ${slide.slideTitle}`;
      
      await generateImage(prompt, slide.slideId);
      
      toast({
        title: "Image generated",
        description: "Your image has been generated successfully",
      });
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImageGenerating(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  // Get image loading state and URL from the imageGenerator hook
  const isLoading = slide?.slideId ? (results[slide.slideId]?.loading || imageUploading || imageGenerating) : false;
  const imageUrl = slide?.slideId && results[slide.slideId]?.imageUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {slide?.slideTitle || "Slide Preview"}
          </DialogTitle>
        </DialogHeader>
        
        {slide && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Image Section */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
              {isLoading ? (
                <div className="w-full h-48 flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="rounded-md bg-slate-200 dark:bg-slate-700 h-32 w-full mb-4"></div>
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              ) : imageUrl ? (
                <div className="relative w-full">
                  <AspectRatio ratio={4/3} className="bg-muted">
                    <img
                      src={imageUrl}
                      alt={slide.slideTitle}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                  <Image className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">
                    No image available for this slide.<br />Upload or generate an image.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => document.getElementById("image-upload")?.click()}>
                      <Upload className="h-4 w-4" />
                      Upload Image
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    <Button onClick={handleGenerateImage} className="flex items-center gap-2">
                      Generate Image
                    </Button>
                  </div>
                </div>
              )}

              {/* Image Actions - Show when an image exists */}
              {imageUrl && (
                <div className="flex justify-center mt-4 space-x-2 w-full">
                  <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => document.getElementById("image-upload")?.click()}>
                    <Upload className="h-4 w-4" />
                    Replace
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleGenerateImage}>
                    Regenerate
                  </Button>
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Content</h3>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-900 dark:text-slate-100">{slide.content}</p>
                </div>
              </div>
              
              {slide.example && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Example</h3>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-900 dark:text-slate-100">{slide.example}</p>
                  </div>
                </div>
              )}

              {slide.voiceoverScript && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Voiceover Script</h3>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-600 dark:text-slate-400 text-sm italic">{slide.voiceoverScript}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex <= 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-500">
              {currentIndex + 1} of {slides.length}
            </span>
            <Button 
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex >= slides.length - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlidePreviewModal;
