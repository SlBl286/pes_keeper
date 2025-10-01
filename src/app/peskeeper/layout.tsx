import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theo dõi giải đấu PES",
  description: "Quản lý và theo dõi các giải đấu đã tạo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
