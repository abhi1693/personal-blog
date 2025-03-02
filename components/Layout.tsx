import { ReactNode } from 'react'

import Navbar from './Navbar'

interface LayoutProps {
  title: string
  description: any[]
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ title, description, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title={title} description={description} />
      <main className="flex-1 pt-16">
        {/* Added padding here */}
        {children}
      </main>
    </div>
  )
}

export default Layout
