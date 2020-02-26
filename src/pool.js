const pools = new Map();

const getPool = symbol => {
    if (!pools.has(symbol)) {
        throw "POOL_NOT_DEFINED";
    }

    return pools.get(symbol);
};

export const initializePool = (symbol, constructor, maxCacheCount) => {
    if (pools.has(symbol)) {
        throw "POOL_SYMBOL_COLLISION";
    }

    pools.set(symbol, {constructor, maxCacheCount, instances: []});
};

export const getFromPool = (symbol, constructorArguments) => {
    const pool = getPool(symbol);

    if (pool.instances.length) {
        return pool.instances.shift();
    }
    else {
        return pool.constructor(constructorArguments);
    }
};

export const returnToPool = (symbol, instance) => {
    const pool = getPool(symbol);

    if (pool.instances.length < pool.maxCacheCount) {
        pool.instances.push(instance);
    }
};
