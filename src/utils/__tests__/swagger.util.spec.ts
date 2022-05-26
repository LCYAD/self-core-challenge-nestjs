import { parseDescription } from '../swagger.util'

describe('parseDescription', () => {
  it('should return correct string', () => {
    const result = parseDescription(['first line', 'second line'])
    expect(result).toEqual('__Key Points__:\n- first line\n- second line')
  })
})
