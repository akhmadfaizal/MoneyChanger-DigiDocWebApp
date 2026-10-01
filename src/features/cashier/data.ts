export type Customer = {
  name: string
  document: 'ktp' | 'passport'
  identity: string
  nationality: 'WNI' | 'WNA'
  country: string
  birth: string
  address: string
  newCustomer: boolean
}
export type Offer = {
  id: string
  currency: string
  side: 'buy' | 'sell'
  amount: string
  rate: string
  total: string
  received: string
  change: string
  highValue?: boolean
}
// Fixed presentation fixtures, not a transaction calculator or live exchange rates.
export const offers: Offer[] = [
  {
    id: 'usd-1000',
    currency: 'USD',
    side: 'buy',
    amount: '1.000',
    rate: '16.490',
    total: '16.490.000',
    received: '16.500.000',
    change: '10.000',
  },
  {
    id: 'usd-300',
    currency: 'USD',
    side: 'buy',
    amount: '300',
    rate: '16.490',
    total: '4.947.000',
    received: '5.000.000',
    change: '53.000',
  },
  {
    id: 'usd-7000',
    currency: 'USD',
    side: 'buy',
    amount: '7.000',
    rate: '16.490',
    total: '115.430.000',
    received: '115.500.000',
    change: '70.000',
    highValue: true,
  },
  {
    id: 'aud-500',
    currency: 'AUD',
    side: 'buy',
    amount: '500',
    rate: '10.930',
    total: '5.465.000',
    received: '5.500.000',
    change: '35.000',
  },
  {
    id: 'sgd-1000',
    currency: 'SGD',
    side: 'buy',
    amount: '1.000',
    rate: '12.770',
    total: '12.770.000',
    received: '12.800.000',
    change: '30.000',
  },
  {
    id: 'jpy-100000-buy',
    currency: 'JPY',
    side: 'buy',
    amount: '100.000',
    rate: '11.120 / 100',
    total: '11.120.000',
    received: '11.150.000',
    change: '30.000',
  },
  {
    id: 'eur-500',
    currency: 'EUR',
    side: 'buy',
    amount: '500',
    rate: '17.930',
    total: '8.965.000',
    received: '9.000.000',
    change: '35.000',
  },
  {
    id: 'myr-1000',
    currency: 'MYR',
    side: 'buy',
    amount: '1.000',
    rate: '3.520',
    total: '3.520.000',
    received: '3.550.000',
    change: '30.000',
  },
  {
    id: 'usd-sell',
    currency: 'USD',
    side: 'sell',
    amount: '1.000',
    rate: '16.430',
    total: '16.430.000',
    received: '16.430.000',
    change: '0',
  },
  {
    id: 'sgd-sell',
    currency: 'SGD',
    side: 'sell',
    amount: '2.000',
    rate: '12.720',
    total: '25.440.000',
    received: '25.440.000',
    change: '0',
  },
  {
    id: 'aud-sell',
    currency: 'AUD',
    side: 'sell',
    amount: '500',
    rate: '10.860',
    total: '5.430.000',
    received: '5.430.000',
    change: '0',
  },
  {
    id: 'jpy-sell',
    currency: 'JPY',
    side: 'sell',
    amount: '100.000',
    rate: '11.050 / 100',
    total: '11.050.000',
    received: '11.050.000',
    change: '0',
  },
  {
    id: 'eur-sell',
    currency: 'EUR',
    side: 'sell',
    amount: '500',
    rate: '17.840',
    total: '8.920.000',
    received: '8.920.000',
    change: '0',
  },
  {
    id: 'myr-sell',
    currency: 'MYR',
    side: 'sell',
    amount: '1.000',
    rate: '3.480',
    total: '3.480.000',
    received: '3.480.000',
    change: '0',
  },
]
export function getOffer(id: string): Offer {
  const offer = offers.find((item) => item.id === id)
  if (!offer) throw new Error(`Unknown preview offer: ${id}`)
  return offer
}
export const registeredCustomer: Customer = {
  name: 'Siti Rahma',
  document: 'ktp',
  identity: '3201 •••• •••• 0012',
  nationality: 'WNI',
  country: 'Indonesia',
  birth: '05/07/1990',
  address: 'Jl. Raya Pajajaran No. 8, Bogor',
  newCustomer: false,
}
export const newWni: Customer = {
  name: 'Wahyu Santoso',
  document: 'ktp',
  identity: '3174 •••• •••• 0031',
  nationality: 'WNI',
  country: 'Indonesia',
  birth: '14/02/1985',
  address: 'Jl. Kebon Jeruk No. 21, Jakarta Barat',
  newCustomer: true,
}
export const newWna: Customer = {
  name: 'Nakamura Yuki',
  document: 'passport',
  identity: 'TR99•••76',
  nationality: 'WNA',
  country: 'Jepang',
  birth: '09/02/1995',
  address: 'Hotel Padma, Legian, Bali',
  newCustomer: true,
}
export const rates = [
  {
    code: 'USD',
    name: 'Dolar Amerika Serikat',
    buy: '16.430',
    sell: '16.490',
    symbol: '$',
  },
  {
    code: 'SGD',
    name: 'Dolar Singapura',
    buy: '12.720',
    sell: '12.770',
    symbol: 'S$',
  },
  {
    code: 'JPY',
    name: 'Yen Jepang (100)',
    buy: '11.050',
    sell: '11.120',
    symbol: '¥',
  },
  {
    code: 'AUD',
    name: 'Dolar Australia',
    buy: '10.860',
    sell: '10.930',
    symbol: 'A$',
  },
  { code: 'EUR', name: 'Euro', buy: '17.840', sell: '17.930', symbol: '€' },
  {
    code: 'MYR',
    name: 'Ringgit Malaysia',
    buy: '3.480',
    sell: '3.520',
    symbol: 'RM',
  },
]
