# House Hub

Local backend + web dashboard for your ESP32 house assistant and Grid Connect lights.

```
Phone / browser  →  House Hub (this folder)
ESP32 assistant  →  House Hub WebSocket
House Hub        →  Grid Connect lights (local Tuya)
```

The ESP32 should not talk to Grid Connect itself. It reports sensors and voice
phrases; the hub runs automations and switches lights.

## Run the hub

```powershell
cd $env:USERPROFILE\Documents\house-hub
npm install
npm run dev
```

- Dashboard: http://localhost:5173
- On your phone / LAN: http://192.168.0.9:5173
- API / WebSocket: http://192.168.0.9:8787

## What you can do now

- Watch the OLED-style face and live sensor tiles
- Type voice commands (`turn on the lights`, `goodnight`, `what's the temperature`)
- Toggle and dim Grid Connect lights
- Enable the starter automations (motion, goodnight, warm-room alert)
- Add a real light with its Tuya device ID and local key

Lights stay in **simulated** mode until a local Tuya connection succeeds, so the
UI works before any hardware is on the network.

## Grid Connect keys

Grid Connect bulbs and plugs are rebranded Tuya devices. For local control you need:

1. Pair the light in the Grid Connect or Smart Life app
2. Create a project on the [Tuya IoT Platform](https://iot.tuya.com/)
3. Link the app account and read each device's `id` and `local_key`
4. Paste those into **Add a Grid Connect light** (IP is optional if discovery works)

## ESP32

Firmware lives in your PlatformIO project:

`Documents\PlatformIO\Projects\AI_Assistant`

Edit `include\config.h` before flashing: Wi-Fi SSID/password and **your PC LAN IP**
as `HUB_HOST` (not `localhost`). Then the OLED, DHT11, encoder, PIR, and buzzer
keep working locally, and telemetry is pushed to this hub.

| Part | Pin |
| --- | --- |
| OLED SDA / SCL | 21 / 22 |
| DHT11 | 4 |
| Encoder CLK / DT / SW | 16 / 17 / 13 |
| PIR | 33 |
| Buzzer | 2 |

The hub answers with `welcome` and `command` (`face`, `say`, `oledText`).
Motion on the ESP32 can fire the “Motion turns lights on” automation.
