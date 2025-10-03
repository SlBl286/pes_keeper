import React, { useRef, useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { motion } from "framer-motion";

// shadcn/ui Avatar components (assumed available in your project)
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type AvatarPickerProps = {
  value?: string | null; // url or base64
  onChange?: (file: File | null, url?: string | null) => void;
  size?: "sm" | "md" | "lg" | number; // convenience sizes
  fallback?: string; // initials or text fallback
  accept?: string; // file accept
};

function sizeToClass(size: AvatarPickerProps["size"]) {
  if (size === "sm") return "w-10 h-10 text-sm";
  if (size === "md") return "w-16 h-16 text-base";
  if (size === "lg") return "w-24 h-24 text-lg";
  if (typeof size === "number") return `w-[${size}px] h-[${size}px]`;
  return "w-16 h-16 text-base"; // default
}

export default function AvatarPicker({
  value = null,
  onChange,
  size = "md",
  fallback = "U",
  accept = "image/*",
}: AvatarPickerProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(value);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  useEffect(() => {
    // revoke object URL on unmount / change
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePick = () => {
    fileRef.current?.click();
  };

  const handleFile = (f: File | null) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    // revoke previous blob if any
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(url);
    setFile(f);
    onChange?.(f, url);
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    handleFile(f);
    // reset input so picking same file again triggers change event
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = () => {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    onChange?.(null, null);
  };

  const klass = sizeToClass(size);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative">
        <motion.div
          layout
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className={`rounded-full overflow-hidden bg-muted flex items-center justify-center ${klass}`}
        >
          <Avatar className={`rounded-full ${klass}`}>
            {preview ? (
              <AvatarImage src={preview} alt="avatar" />
            ) : (
              <AvatarFallback>{fallback}</AvatarFallback>
            )}
          </Avatar>
        </motion.div>

        <div className="absolute -bottom-1 -right-1">
          {preview ? (
            <Button
              size="sm"
              onClick={handleRemove}
              className="p-1 rounded-full text-primary-foreground"
              variant={"destructive"}
              type="button"
            >
              <X className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handlePick}
              className="p-1 rounded-full"
              type="button"
            >
              <Camera className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button onClick={handlePick}>Change</Button>
          <Button variant="outline" onClick={handleRemove}>Remove</Button>
        </div>
        <div className="text-sm text-muted-foreground">PNG/JPG up to your server limit</div>
      </div> */}

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}

// Usage example (not exported):
// <AvatarPicker value={user.avatarUrl} onChange={(file, url) => uploadAvatar(file)} size="md" fallback="DU" />
