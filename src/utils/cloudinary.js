const CLOUDINARY_DOMAIN = 'res.cloudinary.com'

function optimizeUrl(url, type) {
  if (!url || !url.includes(CLOUDINARY_DOMAIN)) return url
  return url.replace(`/${type}/upload/`, `/${type}/upload/q_auto,f_auto/`)
}

export function optimizeImageUrl(url) {
  return optimizeUrl(url, 'image')
}

export function optimizeVideoUrl(url) {
  return optimizeUrl(url, 'video')
}
