'use client'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" className="dark:bg-gray-900">
        <body className={`bg-gray-100 dark:bg-gray-900 dark:text-white`}>{children}</body>
      </html>
  )
}