export const purgeAllCache = async ({
  zoneId,
  token,
}: {
  zoneId: string
  token: string
}): Promise<{ ok: boolean; status: number; body: string }> => {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ purge_everything: true }),
  })
  const body = await res.text()
  return { ok: res.ok, status: res.status, body }
}
