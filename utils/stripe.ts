import { PRICE_IDS } from '@/config'

export const getStripeSubTier = (subId: string) => {
  const subTier = Object.keys(PRICE_IDS).find(
    (key) => PRICE_IDS[key as keyof typeof PRICE_IDS] === subId,
  )
  console.log(subTier)
  return `${subTier?.split('_')[1]}_${subTier?.split('_')[2]}`
}
