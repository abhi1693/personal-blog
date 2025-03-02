import { ReactNode } from 'react'

import MetaHead from './MetaHead'
import Navbar from './Navbar'

interface LayoutProps {
  title: string
  description: string
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ title, description, children }) => {
  return (
    <>
      <MetaHead title={title} description={description} />
      <div className="min-h-screen flex flex-col">
        <Navbar title={title} description={description} />
        <main className="flex-1 pt-16">{children}</main>
      </div>
    </>
  )
}

export default Layout
