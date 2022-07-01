export interface PaginationInfo {
  limit: number,
  offset: number,
  page: number,
  size: number
}

export function getPaginationInfo(page?: number, size?: number): PaginationInfo {
  const limit = size ? size < 1 ? 1 : size : 10
  const offset = page ? (page - 1) * limit : 0

  return { limit, offset, page: page || 1, size: size || 10 }
}
