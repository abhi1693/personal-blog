import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from 'react-icons/fa6'

interface ShareOptionsProps {
  url: string
  title: string
}

export default function ShareOptions({ url, title }: ShareOptionsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareUrls = {
    x: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  }

  const platforms = [
    {
      name: 'X',
      url: shareUrls.x,
      icon: <FaXTwitter size={24} />,
      className: 'text-blue-500 hover:text-blue-600',
      title: 'Share on X',
    },
    {
      name: 'Facebook',
      url: shareUrls.facebook,
      icon: <FaFacebookF size={24} />,
      className: 'text-blue-700 hover:text-blue-800',
      title: 'Share on Facebook',
    },
    {
      name: 'LinkedIn',
      url: shareUrls.linkedin,
      icon: <FaLinkedinIn size={24} />,
      className: 'text-blue-600 hover:text-blue-700',
      title: 'Share on LinkedIn',
    },
    {
      name: 'WhatsApp',
      url: shareUrls.whatsapp,
      icon: <FaWhatsapp size={24} />,
      className: 'text-green-500 hover:text-green-600',
      title: 'Share on WhatsApp',
    },
  ]

  return (
    <div className="flex space-x-4 items-center">
      {platforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={platform.title}
          title={platform.title}
          className={platform.className}
        >
          {platform.icon}
        </a>
      ))}
    </div>
  )
}
