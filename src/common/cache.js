"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expireCache = exports.addToCache = exports.cached = void 0;
/**
 * @param durationMs cache duration (milliseconds)
 * @param onCacheExpired function to load latest value when cache is expired
 * @param onCacheMiss function to load latest value on cache miss
 */
function cached(key, durationMs, onCacheExpired, onCacheMiss, now = Date.now()) {
    return __awaiter(this, void 0, void 0, function* () {
        const item = window.localStorage.getItem(key);
        if (item) {
            const { value, expiration } = JSON.parse(item);
            if (expiration && expiration > now) {
                // valid
                // console.log(`Found cache: ${key}=${value}`);
                return value;
            }
            else {
                return onCacheExpired(value);
            }
        }
        // not found
        const value = yield onCacheMiss();
        addToCache(key, value, durationMs);
        return value;
    });
}
exports.cached = cached;
function addToCache(key, value, durationMs, now = Date.now()) {
    window.localStorage.setItem(key, JSON.stringify({ value, expiration: now + durationMs }));
}
exports.addToCache = addToCache;
function expireCache(key) {
    window.localStorage.removeItem(key);
}
exports.expireCache = expireCache;
