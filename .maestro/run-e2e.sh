#!/bin/bash
set -euo pipefail

export JAVA_HOME=/opt/homebrew/opt/openjdk@17

DATE="2026-07-19"

# Вс, 19 at [[340,303][389,348]] → center (91%,37%)
DATE_PCT="91%,37%"

RESP=$(curl -s "https://nrmhmdfkcmyuzemvpuij.supabase.co/functions/v1/altegio-proxy/staff/2087664/slots?date=$DATE")
FIRST_AVAIL=$(echo "$RESP" | python3 -c "
import sys, json
d = json.load(sys.stdin)
data = d.get('data', [])
for i, s in enumerate(data):
    if s['available']:
        y = int(round((386 + i * 49) / 874 * 100))
        print(f'{i},{y}')
        break
else:
    print('-1,-1')
")

IDX=$(echo "$FIRST_AVAIL" | cut -d, -f1)
SLOT_Y=$(echo "$FIRST_AVAIL" | cut -d, -f2)

if [ "$IDX" = "-1" ]; then
  echo "No slots on $DATE. Checking July 26..."
  DATE="2026-07-26"
  DATE_PCT="50%,100%"
  RESP=$(curl -s "https://nrmhmdfkcmyuzemvpuij.supabase.co/functions/v1/altegio-proxy/staff/2087664/slots?date=$DATE")
  FIRST_AVAIL=$(echo "$RESP" | python3 -c "
import sys, json
d = json.load(sys.stdin)
data = d.get('data', [])
for i, s in enumerate(data):
    if s['available']:
        print(f'{i},{int(round((386 + i * 49) / 874 * 100))}')
        break
else:
    print('-1,-1')
")
  SLOT_Y=$(echo "$FIRST_AVAIL" | cut -d, -f2)
  if [ "$SLOT_Y" = "-1" ]; then exit 1; fi
fi

echo "Date: $DATE, slot index=$IDX, date=$DATE_PCT, slot_y=$SLOT_Y%"

exec maestro test .maestro/full-e2e-flow.yaml --env SLOT_Y="$SLOT_Y" --env DATE_PCT="$DATE_PCT" 2>&1
