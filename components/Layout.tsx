import { ReactNode } from 'react'

import Navbar from './Navbar'

interface LayoutProps {
  title: string
  description: string
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ title, description, children }) => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar title={title} description={description} />
        <main className="flex-1 pt-16">{children}</main>
        <footer className="bg-gray-100 text-gray-600 text-center text-sm py-4 mt-10">
          © {new Date().getFullYear()} Abhimanyu Saharan. All rights reserved.
        </footer>
      </div>
    </>
  )
}

export default Layout
