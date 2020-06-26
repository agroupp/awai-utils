import {
  MongoAdapter,
  MongoBaseRepository,
  MongoConnectionSettingsBuilder,
  MongoConnectionSettings,
  MongoStorageObject
} from '../src';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { MongoClient } from 'mongodb';

let mongoServer: MongoMemoryServer;
let connectionString: string;
let connSettings: MongoConnectionSettings;

const mockData = [{ a: 1 }, { a: 3 }, { a: 5 }];

const generateInitialData = async () => {
  const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db('testDb');
  await db.collection('testColl1').insertMany(mockData);
  client.close();
};

interface TestStorageObject extends MongoStorageObject {
  a: number;
}

class TestRepository extends MongoBaseRepository<TestStorageObject> {
  constructor(settings: MongoConnectionSettings) {
    super(settings);
  }

  async getByA(value: number): Promise<TestStorageObject> {
    const collection = await this.usingAdapter();
    return await collection.findOne({a : value});
  }
}

beforeAll(async () => {
  mongoServer = new MongoMemoryServer({
    autoStart: true,
    instance: {
      dbName: 'testDb',
      storageEngine: 'wiredTiger',
    },
  });
  connectionString = await mongoServer.getConnectionString();
  const connSettingsBuilder = new MongoConnectionSettingsBuilder(connectionString);
  connSettingsBuilder.collectionName = 'testColl1';
  connSettings = connSettingsBuilder.toSettings();
  await generateInitialData();
});

afterAll(async () => await mongoServer.stop());

describe('Mongo Adapter', () => {
  it('should connect to MongoDb server', async () => {
    const adapter = new MongoAdapter(connSettings);
    await adapter.connect();
    expect(adapter.isReady).toBeTruthy();
    expect(adapter.dbName).toEqual('testDb');
    expect(adapter.db).toBeDefined();
    const collections = await adapter.getCollections();
    await adapter.disconnect();
    expect(collections.length).toEqual(1);
    await adapter.disconnect();
  });

  it('should count number of documents in collection name testColl1', async () => {
    const adapter = new MongoAdapter(connSettings);
    await adapter.connect();
    const collection = adapter.getCollection('testColl1');
    expect(await collection.find().count()).toEqual(3);
    await adapter.disconnect();
  });
});

describe('Mongo Base Repository', () => {
  let repository: TestRepository;

  beforeEach(() => repository = new TestRepository(connSettings));

  afterEach(async () => await repository.endUsingAdapter());

  it('should create new document', async () => {
    const obj = { a: 11 } as TestStorageObject;
    const res = await repository.create(obj);
    expect(res._id).toBeDefined();
  });

  it('should create and read new document', async () => {
    const obj = { a: 11 } as TestStorageObject;
    const res = await repository.create(obj);
    const newObj = await repository.read(res._id.toHexString());
    expect(newObj.a).toEqual(obj.a);
  });

  it('should update document', async () => {
    const obj = { a: 11 } as TestStorageObject;
    const createRes = await repository.create(obj);
    createRes.a = 42;
    await repository.update(createRes);
    const updatedObj = await repository.read(createRes._id.toHexString());
    expect(updatedObj.a).toEqual(42);
  });

  it('should find the document with a = 3 and fail with a = -1', async () => {
    const res1 = await repository.getByA(3);
    expect(res1).not.toBeNull();
    const res2 = await repository.getByA(-1);
    expect(res2).toBeNull();
  });

  it('should delete document {a: 42}', async () => {
    const obj = await repository.getByA(42);
    await repository.delete(obj._id.toHexString());
    expect(await repository.getByA(42)).toBeNull();
  });
});
