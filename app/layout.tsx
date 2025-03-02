import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '广东高州中学校友目录',
  description: '搜索并浏览广东高州中学校友信息',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <footer className="bg-white py-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} 广东高州中学校友会</p>
        </footer>
      </body>
    </html>
  );
} 