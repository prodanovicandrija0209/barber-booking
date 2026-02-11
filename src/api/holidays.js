const holidaysCache = new Map()

export async function getHolidays(year) {
  if (holidaysCache.has(year)) {
    return holidaysCache.get(year)
  }

  const response = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/RS`,
  )

  if (!response.ok) {
    throw new Error(`Holidays request failed: ${response.status}`)
  }

  const data = await response.json()
  holidaysCache.set(year, data)
  return data
}
