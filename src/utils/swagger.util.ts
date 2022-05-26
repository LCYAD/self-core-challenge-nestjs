import _ from 'lodash'

export const parseDescription = (keyPts: string[]): string =>
  `__Key Points__:\n${_(keyPts)
    .map((pt) => `- ${pt}`)
    .join('\n')}`
