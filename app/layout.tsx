import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GeneInsight Platform',
  description: 'Advanced genomic analysis and protein structure visualization platform',
  generator: 'GeneInsight',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://3Dmol.org/build/3Dmol-min.js"
          async
        ></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
