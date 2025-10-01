"use client";

import { useEffect, useRef } from "react";

interface WebRTCPlayerProps {
  src: string; // ví dụ: http://localhost:8889/mystream/whep
}

export default function WebRTCPlayer({ src }: WebRTCPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startWebRTC = async () => {
      if (!videoRef.current) return;

      const pc = new RTCPeerConnection();

      // nhận media
      pc.ontrack = (event) => {
        videoRef.current!.srcObject = event.streams[0];
      };

      // Mediamtx yêu cầu có audio/video track dummy
      pc.addTransceiver("video", { direction: "recvonly" });
      pc.addTransceiver("audio", { direction: "recvonly" });

      // tạo offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // gửi SDP offer đến Mediamtx (raw text)
      const res = await fetch(src, {
        method: "POST",
        body: offer.sdp,
        headers: {
          "Content-Type": "application/sdp",
        },
      });

      // lấy SDP answer (raw text)
      const answerSdp = await res.text();
      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: answerSdp,
      };

      // set remote
      await pc.setRemoteDescription(answer);
    };

    startWebRTC();
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      controls
      style={{ width: "100%", maxHeight: "auto", background: "black" }}
    />
  );
}
