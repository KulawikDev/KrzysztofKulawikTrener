import {FacebookIcon, InstagramIcon, LucideIcon} from 'lucide-react'

export const siteConfig = {
  name: '',
  email: '',
  phone: '',
  legalName: '',
  nip: '',
  address: {
    country: 'PL',
    city: 'Kraków',
    street: 'ul. Przykładowa 12 / 3',
    postalCode: '32-500',
    region: 'małopolskie',
  },
  domain: '',
  metadata: {
    default: {
      title: '',
      description: '',
    },
  },
  socials: {
    facebook: {
      label: 'Facebook',
      name: '@facebook',
      value: 'https://www.facebook.com/',
      icon: FacebookIcon,
    },
    instagram: {
      label: 'Instagram',
      name: '@instagram',
      value: 'https://www.instagram.com/',
      icon: InstagramIcon,
    },
  },
} satisfies SiteConfig

type SiteConfig = Record<string, any> & {
  socials: Record<string, {label: string; value: string; icon: LucideIcon; name: string}>
}

export const composeAddress = (address: {street: string; postalCode: string; city: string}) => {
  return `${address.street}, ${address.postalCode} ${address.city}`
}

export const composedAddress = composeAddress(siteConfig.address)