import type { Metadata } from 'next'



export const metadata: Metadata = {
  title: 'UAITO - AI-Powered Engineering Automation | Boost Productivity',
  description: 'Revolutionize your engineering tasks with UAITO, the advanced AI-powered automation tool. Enhance productivity, streamline workflows, and accelerate development.',
  keywords: 'AI-powered engineering, automation tool, productivity, software development, AI-assisted coding',
  openGraph: {
    title: 'UAITO - AI-Powered Engineering Automation',
    description: 'Boost productivity with AI-assisted coding and automated tasks for engineers and developers.',
    type: 'website',
    url: 'https://www.uaito.com',
    images: 'https://www.uaito.com/UAITO.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UAITO - AI-Powered Engineering Automation',
    description: 'Boost productivity with AI-assisted coding and automated tasks for engineers and developers.',
    images: 'https://www.uaito.com/UAITO.png',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-gray-100 dark:bg-gray-900 dark:text-white`}>  
        {children} 
        
      </body>
    </html>
  )
}
