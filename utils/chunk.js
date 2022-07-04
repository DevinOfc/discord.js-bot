module.exports = {
    array: (array, size = 10) => {
        const chunks = new Array();
        for (let i = 0; i < arr.length; i += size) {
            const newChunk = arr.slice(i, i + size);
            chunks.push(newChunk);
        }
        return chunks;
    },
    string: (string, size = 2048) => {
        const numChunks = Math.ceil(string.length / size);
        const chunks = new Array(numChunks)
        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
            chunks[i] = string.length > size ? string.substr(o, size) + '...' : string;
        }
        return chunks;
    }
};
