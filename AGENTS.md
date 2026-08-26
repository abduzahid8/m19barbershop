# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## E2E Test Status
The full end-to-end Maestro test passes. Run it with:
```bash
JAVA_HOME=/opt/homebrew/opt/openjdk@17 maestro test .maestro/full-e2e-flow.yaml --env SLOT_Y=$(python3 -c "import json,urllib.request; d=json.load(urllib.request.urlopen('https://nrmhmdfkcmyuzemvpuij.supabase.co/functions/v1/altegio-proxy/staff/2087664/slots?date=2026-07-19')); i=next(i for i,s in enumerate(d['data']) if s['available']); print(int(round((386+i*49)/874*100)))")
```

The wrapper script `.maestro/run-e2e.sh` handles dynamic slot selection and date management.

### Key fixes made:
- Removed `__DEV__` gate on guest sign-in button
- Added `setUser` to AuthContext interface
- Fixed `activeCat` default value: `'Все'` not `'All'`
- Patched expo-modules-autolinking for Swift 6
- Added `getItemLayout` to BarberCardStack FlatList (prevents scrollToIndex crash)
- Set `pointerEvents` conditionally on compactHdr in BarberDetailScreen
- Added `testID="settingsBtn"` to ProfileScreen settings button
- Increased bottom padding on ProfileScreen scroll content (`paddingBottom: spacing.huge + 80`)

### Coordinate reference (iPhone 17 Pro 402×874):
- Service "Далее": 79%,95%
- Barber "Далее": 79%,95%
- "Подтвердить": 72%,95%
- Barber card: 50%,40%
- BarberDetail back: 10%,46%
- Tab bar: centered container width=330, left=36, Profile at 77%,95%
- Profile settingsBtn: 50%,90%
- Date pills: `Сегодня,14`=26%,37% | `Ср,15`=38%,37% | `Чт,16`=48%,37% | `Пт,17`=62%,37% | `Сб,18`=76%,37% | `Вс,19`=91%,37%
- Slot y = 44% + index × 5.6 (10:00=44%, 11:00=50%, 12:00=55%, 13:00=61%, 14:00=67%, 15:00=72%, 16:00=78%, 17:00=83%, 18:00=89%, 19:00=95%, 20:00=100%)

### Slot tracking
- July 19 (Sunday) has 12 slots. 6 remaining after test runs.
- When exhausted, update `DATE` in `.maestro/run-e2e.sh` and update `DATE_PCT` in both the wrapper and YAML.
