import { Parser } from '@/parsers/Parser';
import { ListParser } from '@/parsers/ListParser';
import { Options } from '../../lib/Options';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/ListParser', () => {
  TestParser.Case({
    case: '1.0',
    description: 'with a string schema with default descriptor',
    given: {
      parser: new ListParser({
        schema: {
          type: 'string',
          enum: ['jon', 'arya']
        },
        model: 'arya'
      })
    },
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('list'),
        items: ({ value }: Scope) => expect(value).toEqual([
          {
            value: 'jon',
            selected: false
          },
          {
            value: 'arya',
            selected: true
          }
        ]),
        field: {
          value: ({ value }: Scope) => expect(value).toBe('arya'),
          items: ({ value, parser }: Scope<ListParser>) => expect(value).toEqual(parser.items)
        }
      },
      descriptor: {
        kind: ({ value }: Scope) => expect(value).toBe('list'),
        options: ({ value }: Scope) => expect(value).toEqual([
          {
            value: '',
            selected: false,
            label: undefined
          },
          {
            value: 'jon',
            selected: false,
            label: 'jon'
          },
          {
            value: 'arya',
            selected: true,
            label: 'arya'
          }
        ])
      }
    }
  });

  TestParser.Case({
    case: '1.1',
    description: 'with a string schema with custom descriptor kind',
    given: Options.get({
      schema: {
        type: 'string',
        enum: ['jon', 'arya']
      },
      model: 'arya',
      descriptor: {
        kind: 'enum'
      }
    }),
    expected: {
      descriptor: {
        kind: ({ value }: Scope) => expect(value).toBe('enum')
      }
    }
  });

  TestParser.Case({
    case: '1.2',
    description: 'with a boolean schema',
    given: {
      parser: new ListParser({
        schema: {
          type: 'boolean',
          enum: [true, false]
        },
        model: true
      })
    },
    expected: {
      parser: {
        items: ({ value }: Scope) => expect(value).toEqual([
          {
            value: 'true',
            selected: true
          },
          {
            value: 'false',
            selected: false
          }
        ]),
        field: {
          value: ({ value }: Scope) => expect(value).toBe(true)
        }
      },
      descriptor: {
        options: ({ value }: Scope) => expect(value).toEqual([
          {
            value: '',
            selected: false,
            label: undefined
          },
          {
            value: 'true',
            selected: true,
            label: 'true'
          },
          {
            value: 'false',
            selected: false,
            label: 'false'
          }
        ])
      }
    }
  });

  TestParser.Case({
    case: '1.3',
    description: 'with a null schema',
    given: {
      parser: new ListParser({
        schema: {
          type: 'null',
          enum: [null, null]
        },
        model: null
      })
    },
    expected: {
      parser: {
        items: ({ value }: Scope) => expect(value).toEqual([
          {
            value: 'null',
            selected: true
          },
          {
            value: 'null',
            selected: true
          }
        ]),
        field: {
          value: ({ value }: Scope) => expect(value).toBe(null)
        }
      },
      descriptor: {
        options: ({ value }: Scope) => expect(value).toEqual([
          {
            value: '',
            selected: false,
            label: undefined
          },
          {
            value: 'null',
            selected: true,
            label: 'null'
          },
          {
            value: 'null',
            selected: true,
            label: 'null'
          }
        ])
      }
    }
  });

  TestParser.Case({
    case: '1.4',
    description: 'with defined descriptor',
    given: {
      parser: new ListParser({
        schema: {
          type: 'string',
          enum: ['jon', 'arya']
        },
        model: undefined
      }),
      descriptor: {
        kind: 'list',
        items: {
          jon: { label: 'Jon Snow' },
          arya: { label: 'Arya Stark' }
        }
      }
    },
    expected: {
      parser: {
        items: ({ value }: Scope) => expect(value).toEqual([
          {
            value: 'jon',
            selected: false
          },
          {
            value: 'arya',
            selected: false
          }
        ]),
        field: {
          value: ({ value }: Scope) => expect(value).toBe(undefined)
        }
      },
      descriptor: {
        options: ({ value }: Scope) => expect(value).toEqual([
          {
            value: '',
            selected: false,
            label: undefined
          },
          {
            value: 'jon',
            selected: false,
            label: 'Jon Snow'
          },
          {
            value: 'arya',
            selected: false,
            label: 'Arya Stark'
          }
        ])
      }
    }
  });

  TestParser.Case({
    case: '1.5',
    description: 'field.items should be empty with missing schema.enum',
    given: {
      parser: new ListParser({
        schema: { type: 'string' },
        model: undefined
      })
    },
    expected: {
      parser: {
        items: ({ value }: Scope) => expect(value).toEqual([])
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parseValue(data) with truthy boolean',
    given: {
      parser: new ListParser({
        schema: { type: 'boolean' },
        model: 'true'
      })
    },
    expected: {
      parser: {
        model: ({ value }: Scope) => expect(value).toBe(true)
      }
    }
  });

  TestParser.Case({
    case: '2.1',
    description: 'parseValue(data) with falsy boolean',
    given: {
      parser: new ListParser({
        schema: { type: 'boolean' },
        model: 'false'
      })
    },
    expected: {
      parser: {
        model: ({ value }: Scope) => expect(value).toBe(false)
      }
    }
  });

  TestParser.Case({
    case: '2.2',
    description: 'parseValue(data) with invalid boolean',
    given: {
      parser: new ListParser({
        schema: { type: 'boolean' },
        model: 'invalid boolean value'
      })
    },
    expected: {
      parser: {
        model: ({ value }: Scope) => expect(value).toBe(false)
      }
    }
  });

  TestParser.Case({
    case: '2.3',
    description: 'parseValue(data) with integer',
    given: {
      parser: new ListParser({
        schema: { type: 'integer' },
        model: '12'
      })
    },
    expected: {
      parser: {
        model: ({ value }: Scope) => expect(value).toBe(12)
      }
    }
  });

  TestParser.Case({
    case: '2.4',
    description: 'parseValue(data) with number',
    given: {
      parser: new ListParser({
        schema: { type: 'number' },
        model: '12.2'
      })
    },
    expected: {
      parser: {
        model: ({ value }: Scope) => expect(value).toBe(12.2)
      }
    }
  });

  TestParser.Case({
    case: '2.5',
    description: 'parseValue(data) with unknown schema type',
    given: {
      parser: new ListParser({
        schema: { type: 'unknown' } as any,
        model: '12.5'
      })
    },
    expected: {
      parser: {
        model: ({ value }: Scope) => expect(value).toBe('12.5')
      }
    }
  });

  TestParser.Case({
    case: '3.0',
    description: 'should successfully parse default value',
    given: {
      parser: new ListParser({
        schema: {
          type: 'string',
          enum: ['jon', 'arya'],
          default: 'jon'
        },
        model: undefined
      })
    },
    expected: {
      parser: {
        model: ({ value }: Scope) => expect(value).toBe('jon')
      }
    }
  });

  TestParser.Case({
    case: '3.1',
    description: 'field.value should parse default undefined as an undefined model',
    given: {
      parser: new ListParser({
        schema: { type: 'string', enum: ['jon', 'arya'] },
        model: undefined
      })
    },
    expected: {
      parser: {
        field: {
          value: ({ value }: Scope) => expect(value).toBeUndefined()
        }
      }
    }
  });
});
