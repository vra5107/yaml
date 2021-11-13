import { parseDocument, stringify } from 'yaml'

describe('composer compatibility warnings', () => {
  test('disabled by default', () => {
    let doc = parseDocument('x: true\ny: off\n')
    expect(doc.errors).toHaveLength(0)
    expect(doc.warnings).toHaveLength(0)
    expect(doc.toJS()).toEqual({ x: true, y: 'off' })

    doc = parseDocument('x: true\ny: off\n', { version: '1.1' })
    expect(doc.errors).toHaveLength(0)
    expect(doc.warnings).toHaveLength(0)
    expect(doc.toJS()).toEqual({ x: true, true: false })
  })

  test("schema: 'core', compat: 'yaml-1.1'", () => {
    const doc = parseDocument('x: true\ny: off\n', { compat: 'yaml-1.1' })
    expect(doc.errors).toHaveLength(0)
    expect(doc.warnings).toMatchObject([
      { code: 'TAG_RESOLVE_FAILED', pos: [8, 9] },
      { code: 'TAG_RESOLVE_FAILED', pos: [11, 14] }
    ])
    expect(doc.toJS()).toEqual({ x: true, y: 'off' })
  })

  test("schema: 'yaml-1.1', compat: 'core'", () => {
    const doc = parseDocument('x: true\ny: off\n', {
      schema: 'yaml-1.1',
      compat: 'core'
    })
    expect(doc.errors).toHaveLength(0)
    expect(doc.warnings).toMatchObject([
      { code: 'TAG_RESOLVE_FAILED', pos: [8, 9] },
      { code: 'TAG_RESOLVE_FAILED', pos: [11, 14] }
    ])
    expect(doc.toJS()).toEqual({ x: true, true: false })
  })
})

describe('stringify compatible values', () => {
  test('disabled by default', () => {
    let res = stringify({ x: true, y: 'off' })
    expect(res).toBe('x: true\ny: off\n')

    res = stringify({ x: true, y: 'off' }, { version: '1.1' })
    expect(res).toBe('x: true\n"y": "off"\n')
  })

  test("schema: 'core', compat: 'yaml-1.1'", () => {
    const res = stringify({ x: true, y: 'off' }, { compat: 'yaml-1.1' })
    expect(res).toBe('x: true\n"y": "off"\n')
  })

  test("schema: 'yaml-1.1', compat: 'json'", () => {
    const res = stringify(
      { x: true, y: 'off' },
      { schema: 'yaml-1.1', compat: 'json' }
    )
    expect(res).toBe('"x": true\n"y": "off"\n')
  })
})
