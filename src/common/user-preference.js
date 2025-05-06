"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserPreference = exports.loadUserPreference = void 0;
function loadUserPreference(key) {
    return window.localStorage.getItem(key);
}
exports.loadUserPreference = loadUserPreference;
function saveUserPreference(key, value) {
    window.localStorage.setItem(key, value);
}
exports.saveUserPreference = saveUserPreference;
