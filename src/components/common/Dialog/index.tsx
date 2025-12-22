import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
// import { Trash2, Edit } from 'lucide-react';

// Reusable Dialog Component
interface ReusableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showFooter?: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  children?: React.ReactNode;
  titleClass?: string;
  cancelTextVariant?:
    | "default"
    | "destructive"
    | "link"
    | "outline"
    | "secondary"
    | "ghost"
    | "ctrl"
    | "transparent"
    | "tabs"
    | null
    | undefined;
  confirmTextVariant?:
    | "default"
    | "destructive"
    | "link"
    | "outline"
    | "secondary"
    | "ghost"
    | "ctrl"
    | "transparent"
    | "tabs"
    | null
    | undefined;
  confirmTextClass?: string;
  cancelTextClass?: string;
  containerWidth?: string;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ReusableDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  cancelTextClass = "",
  cancelTextVariant = "default",
  confirmTextClass = "",
  confirmTextVariant = "default",
  children,
  showFooter = true,
  containerWidth = "",
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("p-6 bg-white", containerWidth)}>
        <DialogHeader className="flex-col ">
          <DialogTitle className="text-xl font-semibold ">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground text-sm font-normal">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        {showFooter && (
          <DialogFooter>
            <Button
              variant={cancelTextVariant}
              onClick={() => onOpenChange(false)}
              className={cn("", cancelTextClass)}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant={confirmTextVariant}
              className={cn("", confirmTextClass)}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : confirmText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
