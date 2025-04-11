const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost', // или 'redis' для Docker Compose
  port: 6379,
  // password: 'your_secure_password', // Раскомментируйте, если настроили пароль
  retryStrategy(times) {
    return Math.min(times * 50, 2000); // Повторные попытки подключения
  }
});

// Получение данных из кэша или выполнение запроса
async function getCached(key, fetchFn, ttl = 300) {
  try {
    const cached = await redis.get(key);
    if (cached !== null) {
      console.log(`Cache hit for ${key}`);
      return JSON.parse(cached);
    }

    console.log(`Cache miss for ${key}`);
    const result = await fetchFn();
    await redis.set(key, JSON.stringify(result), 'EX', ttl);
    return result;
  } catch (err) {
    console.error(`Redis error for ${key}:`, err);
    // Fallback: выполняем запрос, если Redis недоступен
    return await fetchFn();
  }
}

// Сброс кэша по ключу
async function invalidateCache(key) {
  try {
    await redis.del(key);
    console.log(`Cache invalidated for ${key}`);
  } catch (err) {
    console.error(`Error invalidating cache for ${key}:`, err);
  }
}

// Сброс кэша по префиксу (например, все ключи для projects:*)
async function invalidateCacheByPrefix(prefix) {
  try {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`Cache invalidated for prefix ${prefix}`);
    }
  } catch (err) {
    console.error(`Error invalidating cache for prefix ${prefix}:`, err);
  }
}

module.exports = {
  getCached,
  invalidateCache,
  invalidateCacheByPrefix
};