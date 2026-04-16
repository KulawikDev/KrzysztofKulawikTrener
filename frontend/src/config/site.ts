import { FacebookIcon, InstagramIcon, LinkedinIcon, LucideIcon } from 'lucide-react'

export const siteConfig = {
  name: 'Krzysztof Kulawik',
  email: 'krzys.kulawik@gmail.com',
  phone: '+48 668 485 081',
  legalName: '',
  nip: '',
  address: {
    country: 'PL',
    city: 'Chrzanów',
    street: 'ul. Partyzantów 25A',
    postalCode: '32-500',
    region: 'małopolskie',
  },
  domain: 'https://krzysztofkulawik.pl',
  metadata: {
    default: {
      title: 'Trener personalny Chrzanów | Krzysztof Kulawik',
      description: 'Profesjonalny trener personalny z Chrzanowa. Oferuję spersonalizowane treningi, które pomogą Ci osiągnąć swoje cele fitness. Skontaktuj się ze mną już dziś i zacznij swoją transformację!',
    },
  },
  socials: {
    facebook: {
      label: 'Facebook',
      name: '@facebook',
      value: 'https://www.facebook.com/profile.php?id=61561766288128',
      icon: FacebookIcon,
    },
    instagram: {
      label: 'Instagram',
      name: '@instagram',
      value: 'https://www.instagram.com/kulawik_krzysztof/',
      icon: InstagramIcon,
    },
    linkedin: {
      label: 'LinkedIn',
      name: '@linkedin',
      value: 'https://www.linkedin.com/in/krzysztof-kulawik-53165020b/',
      icon: LinkedinIcon,
    }
  },
} satisfies SiteConfig

type SiteConfig = Record<string, any> & {
  socials: Record<string, { label: string; value: string; icon: LucideIcon; name: string }>
}

export const composeAddress = (address: { street: string; postalCode: string; city: string }) => {
  return `${address.street}, ${address.postalCode} ${address.city}`
}

export const composedAddress = composeAddress(siteConfig.address)