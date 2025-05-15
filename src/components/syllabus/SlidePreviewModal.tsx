
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SlideData } from '@/services/courseService';

interface SlidePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide: SlideData;
}

const SlidePreviewModal: React.FC<SlidePreviewModalProps> = ({ isOpen, onClose, slide }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{slide.title || slide.slideTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {slide.imageUrl && (
            <div className="mb-4">
              <img 
                src={slide.imageUrl} 
                alt={slide.title || slide.slideTitle || "Slide visualization"} 
                className="w-full rounded-md shadow-md"
              />
            </div>
          )}
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h3 className="text-lg font-medium">Content</h3>
            <p className="whitespace-pre-wrap">{slide.content}</p>
            
            {slide.example && (
              <>
                <h4 className="text-md font-medium mt-4">Example</h4>
                <p className="whitespace-pre-wrap">{slide.example}</p>
              </>
            )}
            
            {slide.voiceoverScript && (
              <>
                <h4 className="text-md font-medium mt-4">Voiceover Script</h4>
                <p className="text-sm italic text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{slide.voiceoverScript}</p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlidePreviewModal;
