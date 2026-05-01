import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'People Talking — AI キャラクター会話',
  description: '性格と状況を設定して、AIキャラクター同士を会話させるツール（情動経験の動力学理論に基づく）',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
