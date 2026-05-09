# Local Storage Data Access Guide

## How to Access Stored Registration Data

### Option 1: Browser Console (Quick Check)

Open browser DevTools (F12) and paste in console:

```javascript
// Get registration data
JSON.parse(localStorage.getItem("dating_app_pendingRegistration"));

// Get timestamp
localStorage.getItem("dating_app_registrationTimestamp");

// See all stored app data
Object.keys(localStorage)
  .filter((key) => key.startsWith("dating_app_"))
  .forEach((key) => console.log(key, localStorage.getItem(key)));
```

### Option 2: In Angular Component

```typescript
import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "./services/local-storage.service";

@Component({
  selector: "app-dashboard",
  template: `...`,
})
export class DashboardComponent implements OnInit {
  registrationData: any;

  constructor(private storage: LocalStorageService) {}

  ngOnInit() {
    // Get stored registration
    this.registrationData = this.storage.getItem("pendingRegistration");

    if (this.registrationData) {
      console.log("Found pending registration:", this.registrationData);
      console.log("Email:", this.registrationData.email);
      console.log("Name:", this.registrationData.firstName + " " + this.registrationData.lastName);
    }
  }
}
```

### Option 3: Service (Recommended)

```typescript
import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { RegisterRequest } from "../models";

@Injectable({
  providedIn: "root",
})
export class RegistrationService {
  constructor(private storage: LocalStorageService) {}

  /**
   * Get pending registration data
   */
  getPendingRegistration(): RegisterRequest | null {
    return this.storage.getItem("pendingRegistration");
  }

  /**
   * Get registration timestamp
   */
  getRegistrationTime(): string | null {
    return this.storage.getItem("registrationTimestamp");
  }

  /**
   * Check if there's pending registration
   */
  hasPendingRegistration(): boolean {
    return this.storage.hasItem("pendingRegistration");
  }

  /**
   * Clear pending registration
   */
  clearPendingRegistration(): void {
    this.storage.removeItem("pendingRegistration");
    this.storage.removeItem("registrationTimestamp");
  }

  /**
   * Send pending registration to backend and clear storage
   */
  syncToBackend(registerData: RegisterRequest): void {
    // Call API
    // this.authService.register(registerData).subscribe(...)

    // On success, clear storage
    this.clearPendingRegistration();
  }
}
```

## Real-World Usage Examples

### Example 1: Auto-Fill Registration Form

```typescript
ngOnInit() {
  // Check if user has pending registration
  if (this.storage.hasItem('pendingRegistration')) {
    const saved = this.storage.getItem('pendingRegistration');

    // Pre-fill form
    this.registerForm.patchValue({
      firstName: saved.firstName,
      lastName: saved.lastName,
      email: saved.email,
      // Don't pre-fill password for security!
    });
  }
}
```

### Example 2: Sync After Delayed API Call

```typescript
// Register locally first, sync later
this.storage.setItem("pendingRegistration", formData);

// Try to sync to backend after 5 seconds
setTimeout(() => {
  const pending = this.storage.getItem("pendingRegistration");

  if (pending) {
    this.authService.register(pending).subscribe({
      next: (response) => {
        // Success! Clear storage
        this.storage.removeItem("pendingRegistration");
      },
      error: (error) => {
        // Still there for later retry
        console.log("Will retry later");
      },
    });
  }
}, 5000);
```

### Example 3: Email Verification Flow

```typescript
/**
 * Send verification email
 */
sendVerificationEmail(email: string) {
  const pending = this.storage.getItem('pendingRegistration');

  if (pending && pending.email === email) {
    // Send email with verification link
    this.emailService.sendVerificationEmail(email).subscribe({
      next: () => {
        console.log('Verification email sent');
        // Don't clear storage yet - wait for verification
      }
    });
  }
}

/**
 * After user verifies email
 */
onEmailVerified(email: string) {
  const pending = this.storage.getItem('pendingRegistration');

  if (pending) {
    // Now register with backend
    this.authService.register(pending).subscribe({
      next: () => {
        // Success! Clear
        this.storage.removeItem('pendingRegistration');
      }
    });
  }
}
```

### Example 4: Recovery After Network Failure

```typescript
/**
 * Check for interrupted registration on app startup
 */
checkForIncompleteRegistration() {
  if (this.storage.hasItem('pendingRegistration')) {
    const timestamp = this.storage.getItem('registrationTimestamp');
    const now = new Date().getTime();
    const registrationTime = new Date(timestamp).getTime();
    const hoursPassed = (now - registrationTime) / (1000 * 60 * 60);

    // If less than 24 hours old, offer to continue
    if (hoursPassed < 24) {
      this.showNotification(
        'You have an incomplete registration. Continue?',
        () => this.router.navigate(['/register'])
      );
    } else {
      // Old data - clear it
      this.storage.removeItem('pendingRegistration');
      this.storage.removeItem('registrationTimestamp');
    }
  }
}
```

### Example 5: Admin Dashboard - View All Pending Registrations

```typescript
/**
 * Get all app-stored data for debugging/admin purposes
 */
getAllPendingRegistrations() {
  const allData = this.storage.getAllItems();
  return Object.keys(allData)
    .filter(key => key.includes('pendingRegistration'))
    .map(key => allData[key]);
}
```

## Data Structure Reference

### Stored Object Structure

```typescript
interface PendingRegistration {
  firstName: string; // e.g., "John"
  lastName: string; // e.g., "Doe"
  email: string; // e.g., "john@example.com"
  password: string; // e.g., "hashedPassword123"
  confirmPassword: string; // e.g., "hashedPassword123"
}

interface RegistrationMetadata {
  timestamp: string; // ISO 8601 format
}
```

### Example Data

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

## Storage Limits & Considerations

```
// Storage Capacity
- Per origin: ~5-10MB (varies by browser)
- Sufficient for: ~100,000+ registration records

// Security Notes
- Data is stored in PLAIN TEXT
- Accessible by JavaScript on same origin
- Clear on logout for security
- Use HTTPS always for transmission
```

## Clearing Storage

### Clear Specific Keys

```typescript
// Clear one registration
this.storage.removeItem("pendingRegistration");

// Clear timestamp
this.storage.removeItem("registrationTimestamp");
```

### Clear All App Data

```typescript
// Clear everything
this.storage.clear();
```

### Clear on Logout

```typescript
logout() {
  // Clear registration data
  this.storage.clear();

  // Redirect to login
  this.router.navigate(['/login']);
}
```

## Debugging LocalStorage Issues

### Check if LocalStorage is Available

```typescript
/**
 * Check if localStorage is supported
 */
isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
```

### Inspect All Data

```typescript
// Log all stored keys and values
console.table(
  Object.keys(localStorage).map((key) => ({
    key,
    value: localStorage.getItem(key),
  })),
);
```

### Monitor Storage Changes

```typescript
/**
 * Listen for storage changes from other tabs
 */
window.addEventListener("storage", (event) => {
  if (event.key === "dating_app_pendingRegistration") {
    console.log("Registration data changed:", event.newValue);
  }
});
```

## Integration with API

### Step-by-Step Backend Sync

```typescript
/**
 * Complete registration sync flow
 */
completeRegistration() {
  // Step 1: Get from localStorage
  const pendingData = this.storage.getItem('pendingRegistration');

  if (!pendingData) {
    console.error('No pending registration found');
    return;
  }

  // Step 2: Show loading state
  this.isRegistering = true;

  // Step 3: Send to backend
  this.authService.register(pendingData).subscribe({
    next: (response) => {
      // Step 4: Clear localStorage
      this.storage.removeItem('pendingRegistration');
      this.storage.removeItem('registrationTimestamp');

      // Step 5: Store user data if needed
      this.storage.setItem('currentUser', response.user);

      // Step 6: Navigate
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      // Step 7: Handle error - data stays in storage
      console.error('Registration failed:', error);
      this.isRegistering = false;
    }
  });
}
```

## Common Patterns

### Pattern 1: Temporary Storage Until Verified

```typescript
// User registers → Data in localStorage
// User verifies email → Data synced to backend
// Success → Data cleared from localStorage
```

### Pattern 2: Retry Failed Registration

```typescript
// Registration fails → Data stays in storage
// User can retry from same page or come back later
```

### Pattern 3: Multi-Device Sync

```typescript
// Device A: Register locally (in localStorage)
// Device B: Register locally (in localStorage)
// Backend: Unifies data when synced
```

### Pattern 4: Offline Registration

```typescript
// Internet off → Register locally (stored)
// Internet on → Auto-sync to backend
// Success → Clear storage
```

## TypeScript Usage

```typescript
import { LocalStorageService } from './services/local-storage.service';
import { RegisterRequest } from './models/auth.model';

@Component({...})
export class MyComponent {

  constructor(
    private storage: LocalStorageService
  ) {}

  saveRegistration(data: RegisterRequest) {
    // Save with type safety
    this.storage.setItem('pendingRegistration', data);
  }

  loadRegistration(): RegisterRequest | null {
    // Load with type
    return this.storage.getItem('pendingRegistration') as RegisterRequest;
  }

  hasRegistration(): boolean {
    return this.storage.hasItem('pendingRegistration');
  }
}
```

## Browser DevTools

### View in Chrome DevTools

1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage" in sidebar
4. Select your domain
5. View all `dating_app_*` keys

### View in Firefox DevTools

1. Open DevTools (F12)
2. Go to "Storage" tab
3. Click "Local Storage" in sidebar
4. Select your domain
5. View all `dating_app_*` keys

## Troubleshooting

| Problem                | Solution                                     |
| ---------------------- | -------------------------------------------- |
| Data not persisting    | Check localStorage isn't disabled in browser |
| Data not accessible    | Verify key name with `dating_app_` prefix    |
| Storage quota exceeded | Clear old data or use smaller values         |
| Data appears undefined | Check if key exists with `hasItem()` first   |
| Sync not happening     | Check network connection and API endpoint    |

## Summary

LocalStorage integration allows:
✅ Persist registration data between page reloads
✅ Implement retry logic for failed registrations
✅ Provide offline registration capability
✅ Smooth UX during network issues
✅ Easy debugging and data inspection

Accessed via:

- `LocalStorageService` in components
- Browser DevTools for inspection
- `localStorage` object directly (not recommended)

Ready for production use!
