export const PREFECTURES: Record<string, string> = {
  '09': '栃木県',
  '11': '埼玉県',
  '13': '東京都',
  '14': '神奈川県',
  '27': '大阪府',
  '40': '福岡県',
}

export const getPrefectureCode = (areaCode: string) => areaCode.slice(0, 2)
