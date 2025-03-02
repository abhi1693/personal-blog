import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from 'next-sanity'
import { FaGithub, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6'

interface NavbarProps {
  title: string
  description: string
}

const Navbar: React.FC<NavbarProps> = ({ title, description }) => {
  return (
    <nav className="w-full bg-gray-900 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/favicon/logo.png" alt="Logo" width={40} height={40} />
          <div>
            <span className="text-xl font-bold">{title}</span>
            <p className="text-sm text-gray-400">
              <span>{description}</span>
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-gray-300 transition">
            Home
          </Link>
          <Link href="/series" className="hover:text-gray-300 transition">
            Series
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <Link href="https://github.com/abhi1693" target="_blank">
            <FaGithub className="w-6 h-6 hover:text-gray-300 transition" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/abhimanyu-saharan/"
            target="_blank"
          >
            <FaLinkedin className="w-6 h-6 hover:text-gray-300 transition" />
          </Link>
          <Link href="https://x.com/abhi16_93" target="_blank">
            <FaXTwitter className="w-6 h-6 hover:text-gray-300 transition" />
          </Link>
          <Link
            href="https://www.youtube.com/@AbhimanyuSaharanOfficial"
            target="_blank"
          >
            <FaYoutube className="w-6 h-6 hover:text-gray-300 transition text-red-500" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
