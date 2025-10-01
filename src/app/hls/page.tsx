import HlsPlayer from "@/components/hls-player";

export default function Page() {
  return (
    <div>
      <h1>RTSP → HLS Stream</h1>
      <HlsPlayer src="http://localhost:8888/mystream/index.m3u8" />
    </div>
  );
}
