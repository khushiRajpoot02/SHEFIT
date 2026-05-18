# Interview Preparation — Project Deep Dive

---

## 1. Live Vehicle Tracking

### Feature Overview
- Show vehicles live on Google Map
- Route history with polylines
- Driving behaviour list (harsh brake, acceleration, overspeeding)
- Vehicle fuel status
- Custom markers for incidents on map

### Data Flow
```
TCU Device (on vehicle)
      ↓
Backend processes + exposes API
      ↓
Frontend polls API periodically
      ↓
Plot on react-native-maps (Google Map SDK)
```

### Live Location — Polling Pattern
```javascript
useEffect(() => {
  let timeoutId;
  let isMounted = true;

  const poll = async () => {
    try {
      await fetchVehicleData();       // wait for API to finish
    } finally {
      if (isMounted) {
        timeoutId = setTimeout(poll, 5000); // only then schedule next call
      }
    }
  };

  poll(); // start first call immediately

  return () => {
    isMounted = false;
    clearTimeout(timeoutId);          // cleanup on unmount
  };
}, []);
```

**Why setTimeout recursive over setInterval:**
```
setInterval:                    setTimeout recursive:
────────────────────            ─────────────────────
call 1 starts  0s               call 1 starts  0s
call 2 starts  5s ← overlap!    call 1 ends    3s
call 1 ends    8s               call 2 starts  8s ← no overlap
```

### Smooth Vehicle Movement
```javascript
mapRef.current.animateToRegion({
  latitude: newLat,
  longitude: newLng,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
}, 1000); // 1 second animation
```
- `animateToRegion` shows smooth movement instead of jumping

### Route History — Chunked PolyLine
```javascript
const fetchRouteInChunks = async () => {
  let page = 1;
  let hasMore = true;
  let allCoords = [];

  while (hasMore) {
    const response = await fetch(
      `/api/route-history?vehicleId=123&page=${page}&limit=500`
    );
    const data = await response.json();

    allCoords = [...allCoords, ...data.coordinates]; // stitch coords
    setRouteCoordinates([...allCoords]);              // update map progressively

    hasMore = data.hasNextPage;
    page++;
  }
};

<MapView>
  <Polyline
    coordinates={routeCoordinates}   // [{ latitude, longitude }, ...]
    strokeColor="#FF0000"
    strokeWidth={3}
  />
</MapView>
```

### Custom Markers for Driving Behaviour
```javascript
<Marker
  coordinate={{ latitude: item.lat, longitude: item.lng }}
  title={item.type}
>
  <View style={styles.markerContainer}>
    <Image source={getMarkerIcon(item.type)} style={styles.markerIcon} />
    <Text>{item.type}</Text>
  </View>
</Marker>

const getMarkerIcon = (type) => {
  switch(type) {
    case 'Harsh Brake':        return require('../assets/brake.png');
    case 'Harsh Acceleration': return require('../assets/acceleration.png');
    case 'Overspeeding':       return require('../assets/speed.png');
    default:                   return require('../assets/default.png');
  }
};
```
- Marker accepts children → replace default pin with custom View

### FlatList Optimization for Driving Behaviour List
```javascript
const plotOnMap = useCallback((item) => {
  setSelectedIncident(item);
  mapRef.current.animateToRegion({
    latitude: item.lat,
    longitude: item.lng,
  });
}, []); // no external deps — safe with []

const renderIncidentItem = useCallback(({ item }) => (
  <TouchableOpacity onPress={() => plotOnMap(item)}>
    <Text>{item.type}</Text>
    <Text>{item.time}</Text>
  </TouchableOpacity>
), [plotOnMap]); // plotOnMap is stable → renderItem is stable

<FlatList
  data={drivingBehaviourList}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderIncidentItem}
  initialNumToRender={10}       // render only 10 on first load
  windowSize={5}                // keep 5 screen-heights in memory
  maxToRenderPerBatch={10}      // 10 items per JS batch
  removeClippedSubviews={true}  // detach off-screen views
/>
```

**Why each prop:**
```
keyExtractor         → React identifies changed items, avoids full re-render
renderItem useCallback → stable reference → items don't re-render unnecessarily
initialNumToRender   → faster initial load
windowSize           → less memory usage
maxToRenderPerBatch  → prevents UI freeze while scrolling
removeClippedSubviews → reduces memory on Android
```

---

## 2. FastTag + ICICI Payment Integration

### Feature Overview
- Link vehicle FASTag with ICICI bank
- Show bank account details per vehicle
- Transaction history
- Low balance alert
- Toll auto-deduction display
- Recharge via ICICI payment WebView

### FastTag Linking Flow
```
Fleet manager selects vehicle → clicks Link FASTag
        ↓
Frontend calls your backend API
        ↓
Backend returns session token + ICICI URL
        ↓
Frontend sends session token to ICICI URL
        ↓
ICICI handles OTP + bank verification (their UI)
        ↓
Linking complete → fetch account details → show on UI
```

### Payment Flow
```
Fleet manager clicks Recharge
        ↓
Frontend calls backend: POST /api/fastag/initiate-payment
        ↓
Backend calls ICICI with { amount, vehicleId, callbackUrl }
callbackUrl = "https://yourapp.com/payment/callback"  ← backend owns this
        ↓
ICICI returns paymentUrl to backend
        ↓
Backend sends paymentUrl to frontend
        ↓
Frontend loads paymentUrl in WebView
        ↓
User completes payment on ICICI page
        ↓
ICICI redirects WebView to callbackUrl?transactionId=X&status=SUCCESS
        ↓
onNavigationStateChange detects callback URL
        ↓
Frontend extracts params → sends transactionId to backend
        ↓
Backend verifies with ICICI directly → confirms transaction
        ↓
Frontend updates balance + shows success
```

### WebView Implementation
```javascript
const [iciciPaymentUrl, setIciciPaymentUrl] = useState('');
const [webViewLoading, setWebViewLoading] = useState(true);

const initiatePayment = async () => {
  const response = await fetch('/api/fastag/initiate-payment', {
    method: 'POST',
    body: JSON.stringify({ vehicleId, amount }),
  });
  const data = await response.json();
  setIciciPaymentUrl(data.paymentUrl);
};

<View style={{ flex: 1 }}>
  <WebView
    source={{ uri: iciciPaymentUrl }}
    onLoadStart={() => setWebViewLoading(true)}
    onLoadEnd={() => setWebViewLoading(false)}
    onNavigationStateChange={(navState) => {
      const { url } = navState;

      if (url.includes('/payment/callback')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const status = urlParams.get('status');
        const transactionId = urlParams.get('transactionId');
        const amount = urlParams.get('amount');

        if (status === 'SUCCESS') {
          verifyWithBackend(transactionId);
        } else {
          handlePaymentFailure(status);
        }
      }
    }}
  />

  {webViewLoading && (
    <ActivityIndicator
      style={StyleSheet.absoluteFill}
      size="large"
      color="#FF6B00"
    />
  )}
</View>
```

### Why Backend Verification (not trust URL directly)
```
URL params are client-side data — anyone can tamper:

Original:   ?status=FAILED&amount=500
Tampered:   ?status=SUCCESS&amount=500

Anyone (especially rooted device) can hit callback URL with status=SUCCESS
without actually paying.

Fix:
Frontend gets transactionId from URL
      ↓
Sends to your backend
      ↓
Backend calls ICICI API directly: "did TXN123 actually succeed?"
      ↓
ICICI confirms → backend returns verified result
      ↓
Frontend updates UI only after backend confirmation

Source of truth = backend verifying with ICICI, not URL params.
```

### Payment Failure Handling
```javascript
const handlePaymentFailure = (status) => {
  setWebViewVisible(false);

  if (status === 'CANCELLED') {
    Toast.show({ type: 'error', text1: 'Payment cancelled' });
  } else {
    Toast.show({ type: 'error', text1: 'Payment failed. Please try again.' });
  }

  navigation.goBack(); // back to recharge screen
};
```

### Low Balance Alert
```javascript
const FastTagScreen = () => {
  const { data } = useGetFastTagAccountQuery(vehicleId);

  useEffect(() => {
    if (!data) return;

    const { balance, lowBalanceThreshold } = data;
    // threshold is dynamic — set by fleet manager, comes from backend
    // NOT hardcoded on frontend

    if (balance < lowBalanceThreshold) {
      Toast.show({
        type: 'error',
        text1: 'Low Balance Alert',
        text2: `FASTag balance is ₹${balance}. Please recharge.`,
      });
    }
  }, [data]);
};
```

**Key points:**
```
✓ Threshold is dynamic — comes from backend, not hardcoded
✓ Triggered on screen entry via useEffect on data change
✓ Used toast — not alert() which blocks UI
```

---

## Quick Revision — Key Points to Remember

### Live Vehicle Tracking
- `setTimeout` recursive pattern → prevents API call overlap
- `animateToRegion` → smooth vehicle movement
- Chunked API + progressive `setRouteCoordinates` → polyline performance
- `Marker` children → custom marker UI
- `useCallback` chain: `plotOnMap` → `renderIncidentItem` → FlatList stable

### FastTag + ICICI
- Session token flow for linking
- Backend owns callbackUrl — never hardcoded on frontend
- `onNavigationStateChange` detects ICICI redirect
- Extract params from `navState.url` using `URLSearchParams`
- Always verify `transactionId` with backend — never trust URL status
- Low balance threshold is dynamic from backend
- Toast over alert() — non-blocking UI

---

## 3. Native Modules

### Flow — End to End
```
1. Spec file (NativeGymGirlDeviceInfo.ts)
   → name MUST start with "Native" (Codegen requirement)
   → interface Spec extends TurboModule
   → declare function signatures + return types
   → export TurboModuleRegistry.getEnforcing('GymGirlDeviceInfo')
        ↓
2. Codegen auto-generates C++ bridge on build
   → creates NativeGymGirlDeviceInfoSpec (abstract C++ class)
        ↓
3. DeviceInfoModule.kt
   → extends NativeGymGirlDeviceInfoSpec
   → getName() = 'GymGirlDeviceInfo' — MUST match spec
   → implement all functions
   → No @ReactMethod needed (Codegen handles it)
        ↓
4. DeviceInfoPackage.kt
   → registers DeviceInfoModule with RN
   → createNativeModules returns listOf(DeviceInfoModule)
        ↓
5. MainApplication.kt (NOT MainActivity)
   → add DeviceInfoPackage() to getPackages()
        ↓
6. Use in JS/TS
   → import NativeGymGirlDeviceInfo from '../native/NativeGymGirlDeviceInfo'
   → await NativeGymGirlDeviceInfo.getDeviceModel()
```

### Key Rules
```
✓ File name starts with Native → Codegen reads it
✓ TurboModuleRegistry.getEnforcing name = getName() in Kotlin
✓ Codegen runs automatically on npx react-native run-android
✓ Register in MainApplication not MainActivity
✓ No @ReactMethod in New Architecture
```

---

## 4. Biometric Authentication (react-native-keychain)

### Flow
```
App opens
    ↓
Check: user logged in? (Firebase)
    ↓ No → Login Screen
    ↓ Yes
    ↓
Check: biometric enabled? (hasGenericPassword)
    ↓ No → go straight to App
    ↓ Yes
    ↓
Show BiometricGateScreen → OS shows fingerprint/face prompt
    ↓ Pass → go to App
    ↓ Fail → logout → Login Screen
```

### Four Key Functions
```
setGenericPassword   → ENABLE  (save entry locked behind biometric)
getGenericPassword   → VERIFY  (OS shows prompt, returns value if passes)
hasGenericPassword   → CHECK   (is biometric enabled?)
resetGenericPassword → DISABLE (delete the entry)
```

### How Keychain Supports Biometric
```javascript
await Keychain.setGenericPassword('user', 'biometric_enabled', {
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
  // tells OS: only allow reading this if biometric passes
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
});
// Keychain doesn't call biometric — OS does
// accessControl flag tells OS to protect data behind biometric
```

### SERVICE Constant
```javascript
const SERVICE = "GymGirlBiometricAuth";
// namespaces all keychain entries under this key
// prevents conflict with other apps or other keychain entries
```

### react-native-keychain vs react-native-biometrics
```
                    react-native-biometrics    react-native-keychain
Primary purpose     biometric only             secure storage
Biometric support   yes (dedicated)            yes (via accessControl)
Secure storage      no                         yes
Use when            just need biometric check  need biometric + store tokens
```

---

## 5. Personal Projects

### Food Ordering App (React JS)
- Built on Swiggy public API
- Features: restaurant listing, detail page, search, add to cart
- Redux for cart state management

**Cart duplicate handling:**
```javascript
addItem: (state, action) => {
  const existingItem = state.items.find(item => item.id === action.payload.id);
  if (existingItem) {
    existingItem.quantity += 1;      // exists → increase quantity
  } else {
    state.items.push({ ...action.payload, quantity: 1 }); // new → add
  }
}
```

### Expense Tracker (React Native)
- CRUD: create, edit, update, delete expenses
- Category tagging (Food, Travel, Shopping, Bills)
- Monthly summary with Bar Chart
- Category breakdown with Pie/Donut Chart
- Budget limit with progress bar + alert
- Library: react-native-chart-kit

**Chart data format:**
```javascript
const data = {
  labels: ['Jan', 'Feb', 'Mar'],           // x-axis
  datasets: [{ data: [5000, 8000, 4000] }] // y-axis
};
```

---

## 6. Testing (Jest + React Native Testing Library)

### Trick to Remember — AAA Pattern
```
Every test = 3 steps
ARRANGE → set up data
ACT     → call the function
ASSERT  → check result
```

### Unit Test
```javascript
describe('calculateTotal', () => {
  it('returns correct total', () => {
    const items = [{ price: 100, quantity: 2 }]; // ARRANGE
    const result = calculateTotal(items);         // ACT
    expect(result).toBe(200);                     // ASSERT
  });
});
```

### Component Test
```javascript
it('calls onPress when pressed', () => {
  const mockFn = jest.fn();
  const { getByText } = render(<Button title="Login" onPress={mockFn} />);
  fireEvent.press(getByText('Login'));
  expect(mockFn).toHaveBeenCalledTimes(1);
});
```

### Mock API
```javascript
jest.mock('./api');
getUserProfile.mockResolvedValue({ id: 1, name: 'Khushi' }); // fake success
getUserProfile.mockRejectedValue(new Error('Network error')); // fake error
```

### Common Matchers
```
toBe(value)              → strict equality
toEqual(object)          → deep equality for objects/arrays
toBeTruthy()             → value is truthy
toHaveLength(n)          → array/string length
toHaveBeenCalledTimes(n) → mock called n times
toHaveBeenCalledWith(x)  → mock called with specific arg
```

### Run Tests
```bash
npx jest                    # run all
npx jest filename.test.js   # run specific file
npx jest --watch            # watch mode
npx jest --coverage         # coverage report
```

---

## 7. Scenario Based Questions

### Scenario 1 — App crashes on network switch
```
Cause:   API calls fail when switching WiFi → mobile data

Fix:
→ NetInfo.addEventListener to watch network state
→ Offline: show banner, disable network actions
→ Back online: show toast + refetch
→ Crashlytics for detecting affected devices
```

### Scenario 2 — Screen with 1000+ items is slow
```
Fix:
→ FlatList (never ScrollView for large lists)
→ Pagination (load 20 at a time)
→ initialNumToRender={10}
→ windowSize={5}
→ maxToRenderPerBatch={10}
→ removeClippedSubviews={true}
→ keyExtractor by id
→ renderItem with useCallback
→ getItemLayout if fixed height items
→ React.memo on list item component
```

### Scenario 3 — App slows down after 30 mins, crashes
```
Causes + Fixes:

Memory leak:
→ useEffect cleanup missing (clearInterval, removeEventListener)

Infinite re-renders:
→ missing/wrong useEffect dependencies
→ setState inside useEffect without condition

Large data in memory:
→ pagination, don't load all at once
→ FastImage for image caching

Investigate with:
→ Android Studio Profiler (memory over time)
→ Flipper (RN debugging)
→ Firebase Crashlytics (crash stack trace)
```

### Scenario 4 — App needs offline support
```
Options:
AsyncStorage   → simple key-value, small data
SQLite         → structured data, complex queries
MMKV           → faster than AsyncStorage
RTK Query      → session-level cache automatically

Pattern:
API success → save to AsyncStorage
API fail    → load from AsyncStorage → show "Offline mode" banner

Always tell user they are seeing cached data
→ "Last updated: 2 hours ago"
```

### Scenario 5 — Security audit
```
Data on device:
→ react-native-keychain (Android Keystore / iOS Secure Enclave)
→ NEVER use AsyncStorage for sensitive data (not encrypted)

Data in transit:
→ HTTPS for all API calls
→ SSL Pinning (react-native-ssl-pinning) → prevents MITM attack

Additional:
→ Jailbreak/Root detection (react-native-jail-monkey)
→ Short lived access tokens + refresh token pattern
```

### Scenario 6 — Feature works on Android, breaks on iOS
```
Approach:
1. Check library iOS compatibility
2. Find alternate library if needed
3. Use Platform.OS for platform specific code
4. Use platform specific files (Button.ios.js / Button.android.js)

Common Android vs iOS differences:
Shadows:   Android → elevation  |  iOS → shadowColor/Offset/Opacity
Keyboard:  Android → behavior='height'  |  iOS → behavior='padding'
Safe Area: iOS needs SafeAreaView for notch
Fonts:     Android → Roboto  |  iOS → San Francisco
```
