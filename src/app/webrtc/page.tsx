import WebRTCPlayer from "@/components/webrtc-player";

export default function Page() {
  return (
    <div>
      <h1>WebRTC Stream</h1>
      <WebRTCPlayer src="http://localhost:8889/mystream/whep" />
    </div>
  );
}
