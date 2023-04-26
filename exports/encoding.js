const encode = (string) => {
    if (typeof string === 'string')
        return new TextEncoder().encode(string);
    throw Error(`expected typeof String instead got ${string}`);
};
const decode = (uint8Array) => {
    if (uint8Array instanceof Uint8Array)
        return new TextDecoder().decode(uint8Array);
    throw Error(`expected typeof uint8Array instead got ${uint8Array}`);
};

export { decode, encode };
