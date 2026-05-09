import { Injectable } from '@angular/core';

/**
 * Service to handle local storage operations
 */
@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private readonly storagePrefix = 'dating_app_';

    constructor() { }

    /**
     * Save data to local storage
     */
    setItem(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.storagePrefix + key, serializedValue);
        } catch (error) {
            console.error('Error saving to local storage:', error);
        }
    }

    /**
     * Retrieve data from local storage
     */
    getItem(key: string): any {
        try {
            const item = localStorage.getItem(this.storagePrefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error retrieving from local storage:', error);
            return null;
        }
    }

    /**
     * Remove item from local storage
     */
    removeItem(key: string): void {
        try {
            localStorage.removeItem(this.storagePrefix + key);
        } catch (error) {
            console.error('Error removing from local storage:', error);
        }
    }

    /**
     * Clear all app-specific storage
     */
    clear(): void {
        try {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Error clearing local storage:', error);
        }
    }

    /**
     * Check if key exists
     */
    hasItem(key: string): boolean {
        return localStorage.getItem(this.storagePrefix + key) !== null;
    }

    /**
     * Get all stored data (for debugging)
     */
    getAllItems(): { [key: string]: any } {
        const items: { [key: string]: any } = {};
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix)) {
                    const cleanKey = key.replace(this.storagePrefix, '');
                    items[cleanKey] = this.getItem(cleanKey);
                }
            }
        } catch (error) {
            console.error('Error getting all items from local storage:', error);
        }
        return items;
    }
}
