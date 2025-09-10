import { createClient } from 'redis';

class RedisCore {
  private client: ReturnType<typeof createClient>;

  constructor(url: string) {
    this.client = createClient({ url });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    await this.client.subscribe(channel, (message) => {
      callback(message);
    });
  }

  async publish(channel: string, message: string): Promise<number> {
    return await this.client.publish(channel, message);
  }

  async streamPublish(channel: string, message: string): Promise<string> {
    return await this.client.xAdd(channel, '*', { 'message': message });
  }

  async streamSubscribe(channel: string, callback: (message: { [key: string]: string }) => void): Promise<void> {
    let lastId = '0-0';
    while (true) {
      const response = await this.client.xRead(
        { key: channel, id: lastId },
        { COUNT: 1, BLOCK: 0 }
      );
      
      if (response && response.length > 0) {
        const [{ messages }] = response;
        if (messages.length > 0) {
          const {id, message} = messages[0];
          lastId = id;
          callback(message);
        }
      }
    }
  }
}

export default RedisCore;