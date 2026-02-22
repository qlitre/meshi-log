import type { Genre, Shop } from '../types/microcms'

export const getGenreString = (genre: Genre[]) => {
  return genre.map((g) => g.name).join(',')
}
