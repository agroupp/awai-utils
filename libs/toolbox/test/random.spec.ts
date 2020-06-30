import { RandomBytesProvider as prov, Rnd } from '../src';
import { Arr } from '@awai/toolbox';

const crypto = {
  getRandomValues: jest.fn((arr: Uint32Array) => {
    arr.set(Arr.range(arr.length));
    return arr;
  })
};

describe('Generating random bytes by provider directly', () => {
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
    const bytes = prov.nextBytes(10);
    expect(window.crypto.getRandomValues).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).crypto;
    expect(bytes).toHaveLength(10);
    expect(Array.from(bytes)).toEqual(Arr.range(10));
  });

  it('should synchronously generate array of random bytes (Nodejs version)', () => {
    const bytes = prov.nextBytes(1000);
    expect(bytes).toHaveLength(1000);
    let zeroes = 0;
    for(let i = 0; i < 1000; i++) {
      if (bytes[i] === 0) {
        zeroes++;
      }
      expect(bytes[i]).toBeGreaterThanOrEqual(0);
      expect(bytes[i]).toBeLessThanOrEqual(256);
    }
    // Allowing of 1% of zeroes
    expect(zeroes).toBeLessThan(10);
  });
});

describe('Generating random floats', () => {
  it('should generate random float between 0.0 and 1.0', () => {
    for(let i = 0; i < 100; i++) {
      const value = Rnd.nextFloat();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it('should async generate random float between 0.0 and 1.0', async () => {
    for(let i = 0; i < 100; i++) {
      const value = await Rnd.nextFloatAsync();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it('should generate multiple random floats between 0.0 and 1.0', () => {
    const values = Rnd.nextFloat(1000);
    for(let i = 0; i < 100; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(0);
      expect(values[i]).toBeLessThanOrEqual(1);
    }
  });

  it('should async generate multiple random floats between 0.0 and 1.0', async () => {
    const values = await Rnd.nextFloatAsync(1000);
    for(let i = 0; i < 100; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(0);
      expect(values[i]).toBeLessThanOrEqual(1);
    }
  });
});

describe('Generating random integers', () => {
  it('should generate random int between 0 and 10', () => {
    for(let i = 0; i < 100; i++) {
      const value = Rnd.nextInt();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(10);
    }
  });

  it('should generate random int between 50 and 100', () => {
    for(let i = 0; i < 100; i++) {
      const value = Rnd.nextInt(50, 100);
      expect(value).toBeGreaterThanOrEqual(50);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it('should generate random int between -50 and 50', () => {
    let negatives = 0;
    for(let i = 0; i < 100; i++) {
      const value = Rnd.nextInt(-50, 50);
      if (value < 0) {
        negatives++;
      }
      expect(value).toBeGreaterThanOrEqual(-50);
      expect(value).toBeLessThanOrEqual(50);
    }
    expect(negatives).toBeGreaterThan(0);
  });

  it('should async generate random int between 50 and 100', async () => {
    for(let i = 0; i < 100; i++) {
      const value = await Rnd.nextIntAsync(50, 100);
      expect(value).toBeGreaterThanOrEqual(50);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it('should generate multiple random int between 50 and 100', () => {
    const values = Rnd.nextInt(50, 100, 100);
    for(let i = 0; i < 100; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(50);
      expect(values[i]).toBeLessThanOrEqual(100);
    }
  });

  it('should async generate multiple random int between 50 and 100', async () => {
    const values = await Rnd.nextIntAsync(50, 100, 100);
    for(let i = 0; i < 100; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(50);
      expect(values[i]).toBeLessThanOrEqual(100);
    }
  });
});
