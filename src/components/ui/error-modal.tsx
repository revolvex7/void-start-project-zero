import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from './button';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'error' | 'success' | 'info';
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'error'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-400" />;
      case 'info':
        return <Info className="w-12 h-12 text-blue-400" />;
      case 'error':
      default:
        return <AlertCircle className="w-12 h-12 text-red-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-900/20',
          border: 'border-green-500/50',
          text: 'text-green-400'
        };
      case 'info':
        return {
          bg: 'bg-blue-900/20',
          border: 'border-blue-500/50',
          text: 'text-blue-400'
        };
      case 'error':
      default:
        return {
          bg: 'bg-red-900/20',
          border: 'border-red-500/50',
          text: 'text-red-400'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative bg-gray-900 rounded-lg shadow-2xl max-w-md w-full border border-gray-700 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>

          {/* Title */}
          {title && (
            <h3 className="text-xl font-semibold text-center mb-3 text-white">
              {title}
            </h3>
          )}

          {/* Message */}
          <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 mb-6`}>
            <p className={`text-center ${colors.text} text-sm sm:text-base`}>
              {message}
            </p>
          </div>

          {/* Action button */}
          <Button
            onClick={onClose}
            className="w-full bg-white text-black hover:bg-gray-100 font-medium"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
