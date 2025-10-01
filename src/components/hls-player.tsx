"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsPlayerProps {
  src: string; // đường dẫn file .m3u8
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
}

export default function HlsPlayer({
  src,
  autoPlay = true,
  controls = true,
  muted = false,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari hỗ trợ HLS native
      video.src = src;
    }
  }, [src]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        style={{ width: "100%", maxHeight: "auto", background: "black" }}
      />{" "}
    </>
  );
}
