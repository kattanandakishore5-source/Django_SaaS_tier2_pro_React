import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={cn(
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm open:animate-in open:fade-in-90",
        "w-full max-w-lg rounded-lg border bg-background text-foreground shadow-lg",
        "p-0 m-auto", // Center the dialog
        className
      )}
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div className="flex flex-col space-y-1.5 p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h2>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md" onClick={onClose} aria-label="Close modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {description && (
          <p id="modal-description" className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </dialog>
  );
}
