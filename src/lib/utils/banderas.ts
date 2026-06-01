const FIFA_A_ISO: Record<string, string> = {
  ARG: 'ar', BRA: 'br', URU: 'uy', COL: 'co', ECU: 'ec', PAR: 'py',
  ESP: 'es', FRA: 'fr', GER: 'de', POR: 'pt', ENG: 'gb-eng', NED: 'nl',
  BEL: 'be', CRO: 'hr', AUT: 'at', SUI: 'ch', SCO: 'gb-sct', TUR: 'tr',
  NOR: 'no', SWE: 'se', BIH: 'ba', CZE: 'cz',
  USA: 'us', MEX: 'mx', CAN: 'ca', PAN: 'pa', HAI: 'ht', CUW: 'cw',
  MAR: 'ma', SEN: 'sn', EGY: 'eg', ALG: 'dz', GHA: 'gh', CPV: 'cv',
  CIV: 'ci', RSA: 'za', TUN: 'tn', COD: 'cd',
  JPN: 'jp', KOR: 'kr', KSA: 'sa', AUS: 'au', IRN: 'ir', JOR: 'jo',
  UZB: 'uz', QAT: 'qa', IRQ: 'iq',
  NZL: 'nz',
}

export function getBanderaUrl(codigoFifa: string | null | undefined): string {
  if (!codigoFifa) return ''
  const iso = FIFA_A_ISO[codigoFifa.toUpperCase()]
  if (!iso) return ''
  return `https://flagcdn.com/${iso}.svg`
}
