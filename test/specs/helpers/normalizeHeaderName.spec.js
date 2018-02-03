import normalizeHeaderName from '../../../lib/helpers/normalizeHeaderName'

describe('helpers::normalizeHeaderName', function () {
  it('should normalize matching header name', function () {
    const headers = {
      'conTenT-Type': 'foo/bar'
    }
    normalizeHeaderName(headers, 'Content-Type')
    expect(headers['Content-Type']).toBe('foo/bar')
    expect(headers['conTenT-Type']).toBeUndefined()
  })

  it('should not change non-matching header name', function () {
    const headers = {
      'content-type': 'foo/bar'
    }
    normalizeHeaderName(headers, 'Content-Length')
    expect(headers['content-type']).toBe('foo/bar')
    expect(headers['Content-Length']).toBeUndefined()
  })
})
