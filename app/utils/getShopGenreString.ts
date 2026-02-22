import type { Genre } from '../types/microcms'

export const getShopGenreString = (genre: Genre[]) => {
  return genre.map((g) => g.name).join(',')
}
