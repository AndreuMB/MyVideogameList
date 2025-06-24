export interface GiantbombResponse<T> {
  error: string
  limit: number
  offset: number
  number_of_page_results: number
  number_of_total_results: number
  status_code: number
  results: T
  version: string
}

export interface Game {
  aliases: string
  api_detail_url: string
  date_added: string
  date_last_updated: string
  deck: string
  description: string
  expected_release_day: number
  expected_release_month: number
  expected_release_quarter: string
  expected_release_year: number
  guid: string
  id: number
  image: Image
  image_tags: ImageTag[]
  name: string
  number_of_user_reviews: number
  original_game_rating: string
  original_release_date: string
  platforms: Platform[]
  site_detail_url: string
  ref?: string
}

export interface Image {
  icon_url: string
  medium_url: string
  screen_url: string
  screen_large_url: string
  small_url: string
  super_url: string
  thumb_url: string
  tiny_url: string
  original_url: string
  image_tags: string
}

export interface ImageTag {
  api_detail_url: string
  name: string
  total: number
}

export interface Platform {
  api_detail_url: string
  id: number
  name: string
  site_detail_url: string
  abbreviation: string
}

export interface Result {
  api_detail_url: string
  date_added: string
  date_last_updated: string
  deck?: string
  description?: string
  guid: string
  id: number
  image: Image
  image_tags: ImageTag[]
  name: string
  site_detail_url: string
}

export interface Image {
  icon_url: string
  medium_url: string
  screen_url: string
  screen_large_url: string
  small_url: string
  super_url: string
  thumb_url: string
  tiny_url: string
  original_url: string
  image_tags: string
}

export interface ImageTag {
  api_detail_url: string
  name: string
  total: number
}
