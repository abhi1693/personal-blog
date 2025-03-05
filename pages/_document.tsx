import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link
        rel="preload"
        href="/Inter-Bold.woff"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <style>{`
          @font-face {
            font-family: 'Inter-Bold';
            src: url('/Inter-Bold.woff') format('woff2');
            font-display: swap;
          }
        `}</style>
      <body className="bg-white text-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
