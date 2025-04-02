import NodeCache from 'node-cache';
import config from '../config';

const CACHE_CHECKPERIOD_IN_SECONDS = 120; 

const cache = new NodeCache({ 
  stdTTL: config.cache.defaultTTLInSeconds,
  checkperiod: CACHE_CHECKPERIOD_IN_SECONDS
});

export async function setCache(key: string, value: Buffer, ttl?: number): Promise<boolean> {
  return cache.set(key, value, ttl || config.cache.defaultTTLInSeconds);
}

export async function getCache(key: string): Promise<Buffer | undefined> {
  return cache.get<Buffer>(key);
}

export async function delCache(key: string): Promise<number> {
  return cache.del(key);
}
