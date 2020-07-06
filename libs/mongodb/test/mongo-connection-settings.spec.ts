import { MongoConnectionSettingsBuilder } from '../src/lib/mongo-connection-settings';

const testConnectionString = `mongodb+srv://abc:pWd1!@internal-ohjxv.gcp.mongodb.net/accounts?retryWrites=true&w=majority`;

describe('MongoConnectionSettings', () => {
  it('Parse proto with +srv', () => {
    const connString1 = `mongodb+srv://test.mongodb.net`;
    const builder1 = new MongoConnectionSettingsBuilder(connString1);
    expect(builder1.isDnsSeedlist).toBeTruthy();
    const connString2 = `mongodb://test.mongodb.net`;
    const builder2 = new MongoConnectionSettingsBuilder(connString2);
    expect(builder2.isDnsSeedlist).toBeFalsy();
  });

  it('Parse domain', () => {
    const connString1 = `mongodb+srv://abc:pWd01!@test.mongodb.net`;
    const connString2 = `mongodb+srv://test.mongodb.net`;
    const connString3 = `mongodb://127.0.0.1:61839/testDb?`;
    const builder1 = new MongoConnectionSettingsBuilder(connString1);
    expect(builder1.domain).toEqual('test.mongodb.net');
    const builder2 = new MongoConnectionSettingsBuilder(connString2);
    expect(builder2.domain).toEqual('test.mongodb.net');
    const builder3 = new MongoConnectionSettingsBuilder(connString3);
    expect(builder3.domain).toEqual('127.0.0.1:61839');
  });

  it('Parse username and password', () => {
    const connString = `mongodb+srv://abc:pWd01!@test.mongodb.net`;
    const builder = new MongoConnectionSettingsBuilder(connString);
    expect(builder.userName).toEqual('abc');
    expect(builder.isPasswordSet).toBeTruthy();
  });

  it('Parse database name', () => {
    const connString = `mongodb+srv://abc:pWd01!@test.mongodb.net/mySuperDB`;
    const builder = new MongoConnectionSettingsBuilder(connString);
    expect(builder.dbName).toEqual('mySuperDB');
  });

  it('Parse options', () => {
    const connString = `mongodb+srv://abc:pWd01!@test.mongodb.net/mySuperDB?retryWrites=true&w=majority`;
    const builder = new MongoConnectionSettingsBuilder(connString);
    expect(builder.isRetryWrites).toBeTruthy();
    expect(builder.writeConcern).toEqual('majority');
  });

  it('Returns MongoDb connection string', () => {
    const builder = new MongoConnectionSettingsBuilder(testConnectionString);
    const settings = builder.toSettings();
    expect(settings.connectionString).toEqual(testConnectionString);
  });
});
