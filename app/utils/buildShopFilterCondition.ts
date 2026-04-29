type ShopFilterParams = {
  pref_code?: string
  area_id?: string
  genre_ids?: string[]
  is_recommended?: boolean
}

export const buildShopFilterCondition = (params: ShopFilterParams): string => {
  const filterCondition: string[] = []

  if (params.area_id) {
    filterCondition.push(`area[equals]${params.area_id}`)
  } else if (params.pref_code) {
    filterCondition.push(`area_code[begins_with]${params.pref_code}`)
  }

  if (params.genre_ids) {
    for (const genre of params.genre_ids) {
      filterCondition.push(`genre[contains]${genre}`)
    }
  }
  if (params.is_recommended) {
    filterCondition.push(`is_recommended[equals]true`)
  }

  return filterCondition.length > 0 ? filterCondition.join('[and]') : ''
}
