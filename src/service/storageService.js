import ls from 'localstorage-slim';

/**
 * Retrieves a value from storage using the provided key.
 *
 * @param {string} key - The key to retrieve the value from storage
 * @return {any} The value stored in the specified key
 */
export const getStorage = (key) =>{
    // console.log("getStorage: ", key);
    return ls.get(key,{decrypt:true});
}

/**
 * Removes the specified item from the storage.
 *
 * @param {string} key - the key of the item to be removed from storage
 * @return {void} 
 */
export const removeStorage = (key) => {
    // console.log("removeStorage: ", key);
    ls.remove(key);
}

/**
 * Sets the value in the storage for the given key.
 *
 * @param {string} key - The key for the value in the storage
 * @param {any} value - The value to be stored
 * @return {undefined} 
 */
export const setStorage = (key, value) =>{
    // console.log("setStorage: ", `${key}: ${value}`);
    ls.set(key, value);
}

export const setSessionStorage = (key, value) =>{    
    sessionStorage.setItem(key, value);
}

export const getSessionStorage = (key) =>{    
    return sessionStorage.getItem(key);
}

export const removeSessionStorage = (key) => {
    sessionStorage.removeItem(key);
}

export default getStorage;