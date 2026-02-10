"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      onScanComplete(data);
      toast.success("Receipt scanned");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files && handleScan(e.target.files[0])}
      />

      <Button
        onClick={() => fileInputRef.current.click()}
        disabled={loading}
        className="w-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            Scan Receipt with AI
          </>
        )}
      </Button>
    </div>
  );
}
