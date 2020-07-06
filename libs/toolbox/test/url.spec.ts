import { Url } from '../src';

describe('Parsing URL', () => {
  it('should validate url', () => {
    expect(Url.isUrl('https://search.audioburst.com/burst/eazqG7zRgGR2?ref=search.audioburst&pid=177&v=1')).toBeTruthy();
    expect(Url.isUrl('/burst/eazqG7zRgGR2?ref=search.audioburst&pid=177&v=1')).toBeFalsy();
  });

  it('should parse "https://search.audioburst.com/burst/eazqG7zRgGR2?ref=search.audioburst&pid=177&v=1"', () => {
    const url = new Url('https://search.audioburst.com/burst/eazqG7zRgGR2?ref=search.audioburst&pid=177&v=1');
    expect(url.protocol).toEqual('https');
    expect(url.domain).toEqual('search.audioburst.com');
    expect(url.username).toBeUndefined();
    expect(url.password).toBeUndefined();
    expect(url.pathString).toEqual('/burst/eazqG7zRgGR2');
    expect(url.pathParams).toEqual(['burst', 'eazqG7zRgGR2']);
    expect(url.queryParams).toEqual(new Map().set('ref', 'search.audioburst').set('pid', 177).set('v', 1));
    expect(url.isSsl).toBeTruthy();
    expect(url.toString()).toEqual('https://search.audioburst.com/burst/eazqG7zRgGR2?ref=search.audioburst&pid=177&v=1');
    expect(url.toURL()).toEqual(new URL('https://search.audioburst.com/burst/eazqG7zRgGR2?ref=search.audioburst&pid=177&v=1'));
  });

  it('should parse "mongodb+srv://abc:pWd1!@internal-ohjxv.gcp.mongodb.net/accounts?retryWrites=true&w=majority"', () => {
    const url = new Url('mongodb+srv://abc:pWd1!@internal-ohjxv.gcp.mongodb.net/accounts?retryWrites=true&w=majority');
    expect(url.protocol).toEqual('mongodb+srv');
    expect(url.domain).toEqual('internal-ohjxv.gcp.mongodb.net');
    expect(url.username).toEqual('abc');
    expect(url.password).toEqual('pWd1!');
    expect(url.pathString).toEqual('/accounts');
    expect(url.pathParams).toEqual(['accounts']);
    expect(url.queryParams).toEqual(new Map().set('retryWrites', true).set('w', 'majority'));
    expect(url.isSsl).toBeFalsy();
    expect(url.toString()).toEqual('mongodb+srv://abc:pWd1!@internal-ohjxv.gcp.mongodb.net/accounts?retryWrites=true&w=majority');
    expect(url.toURL()).toEqual(new URL('mongodb+srv://abc:pWd1!@internal-ohjxv.gcp.mongodb.net/accounts?retryWrites=true&w=majority'));
  });

  it('should parse "https://tools.ietf.org/html/rfc3986#appendix-B"', () => {
    const url = new Url('https://tools.ietf.org/html/rfc3986#appendix-B');
    expect(url.protocol).toEqual('https');
    expect(url.domain).toEqual('tools.ietf.org');
    expect(url.username).toBeUndefined();
    expect(url.password).toBeUndefined();
    expect(url.pathString).toEqual('/html/rfc3986');
    expect(url.pathParams).toEqual(['html', 'rfc3986']);
    expect(url.hashFragment).toEqual('appendix-B');
    expect(url.isSsl).toBeTruthy();
    expect(url.toString()).toEqual('https://tools.ietf.org/html/rfc3986#appendix-B');
    expect(url.toURL()).toEqual(new URL('https://tools.ietf.org/html/rfc3986#appendix-B'));
  });

  it('should parse "http://localhost:5000"', () => {
    const url = new Url('http://localhost:5000');
    expect(url.protocol).toEqual('http');
    expect(url.domain).toEqual('localhost');
    expect(url.port).toEqual(5000);
    expect(url.username).toBeUndefined();
    expect(url.password).toBeUndefined();
    expect(url.isSsl).toBeFalsy();
    expect(url.toString()).toEqual('http://localhost:5000');
    expect(url.toURL()).toEqual(new URL('http://localhost:5000'));
  });

  it('should parse "http://127.0.0.1:5000"', () => {
    const url = new Url('http://127.0.0.1:5000');
    expect(url.protocol).toEqual('http');
    expect(url.domain).toEqual('127.0.0.1');
    expect(url.port).toEqual(5000);
    expect(url.username).toBeUndefined();
    expect(url.password).toBeUndefined();
    expect(url.isSsl).toBeFalsy();
    expect(url.toString()).toEqual('http://127.0.0.1:5000');
    expect(url.toURL()).toEqual(new URL('http://127.0.0.1:5000'));
  });

  it('should build url "mongodb+srv://abc:pWd1!@internal-ohjxv.gcp.mongodb.net:27500/accounts?retryWrites=true&w=majority"', () => {
    const url = new Url();
    url.protocol = 'mongodb+srv';
    url.domain = 'internal-ohjxv.gcp.mongodb.net';
    url.port = 27500;
    url.username = 'abc';
    url.password = 'pWd1!';
    url.path = '/accounts';
    url.queryParams = new Map().set('retryWrites', true).set('w', 'majority');
    expect(url.toString()).toEqual('mongodb+srv://abc:pWd1!@internal-ohjxv.gcp.mongodb.net:27500/accounts?retryWrites=true&w=majority');
  });
});
