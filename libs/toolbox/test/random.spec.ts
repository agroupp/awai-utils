import { RandomBytesProvider as prov } from '../src';
import { Arr } from '@awai/toolbox';

const crypto = {
  getRandomValues: jest.fn((arr: Uint32Array) => {
    arr.set(Arr.range(arr.length));
    return arr;
  })
};

describe('Generating random bytes', () => {
  it('should asynchronously generate array of mock random bytes (Browser version)', async () => {
    Object.defineProperty(window, 'crypto', {
      configurable: true,
      enumerable: true,
      value: crypto,
      writable: true
    });
    const bytes = await prov.nextBytesAsync(10);
    expect(window.crypto.getRandomValues).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).crypto;
    expect(bytes).toHaveLength(10);
    expect(Array.from(bytes)).toEqual(Arr.range(10));
  });

  it('should asynchronously generate array of random bytes (Nodejs version)', async () => {
    const bytes = await prov.nextBytesAsync(10);
    expect(bytes).toHaveLength(10);
  });

  it('should synchronously generate array of mock random bytes (Browser version)', () => {
    Object.defineProperty(window, 'crypto', {
      configurable: true,
      enumerable: true,
      value: crypto,
      writable: true
    });
    const bytes = prov.nextBytesSync(10);
    expect(window.crypto.getRandomValues).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).crypto;
    expect(bytes).toHaveLength(10);
    expect(Array.from(bytes)).toEqual(Arr.range(10));
  });

  it('should synchronously generate array of random bytes (Nodejs version)', () => {
    const bytes = prov.nextBytesSync(10);
    expect(bytes).toHaveLength(10);
  });
});
