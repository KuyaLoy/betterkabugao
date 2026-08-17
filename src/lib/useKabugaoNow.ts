import { useEffect, useState, useSyncExternalStore } from "react";
import { KABUGAO } from "../app/site-content";

export type NowState = { day: string; date: string; time: string };

export type WeatherState =
  | { status: "loading" | "unavailable" }
  | { status: "ready"; temperature: string; description: string };

/** WMO weather interpretation codes used by Open-Meteo. */
const WMO: Record<number, string> = {
  0: "Clear", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  56: "Freezing drizzle", 57: "Freezing drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
  66: "Freezing rain", 67: "Freezing rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow",
  77: "Snow grains", 80: "Light showers", 81: "Showers", 82: "Heavy showers",
  85: "Snow showers", 86: "Snow showers", 95: "Thunderstorm",
  96: "Thunderstorm, hail", 99: "Thunderstorm, hail",
};

function readClock(): NowState {
  const now = new Date();
  const zone = KABUGAO.timeZone;
  return {
    day: new Intl.DateTimeFormat("en-PH", { weekday: "long", timeZone: zone }).format(now),
    date: new Intl.DateTimeFormat("en-PH", { day: "numeric", month: "long", year: "numeric", timeZone: zone }).format(now),
    time: new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: zone }).format(now),
  };
}

/**
 * A tiny external store for the clock.
 *
 * The clock is genuinely outside React — it changes on a timer, not from a
 * render — so useSyncExternalStore is the correct primitive. It also gives us
 * a stable server snapshot (null), which keeps the prerendered HTML and the
 * client's first paint identical instead of hydrating over a stale build-time
 * timestamp.
 */
const clockListeners = new Set<() => void>();
let clockSnapshot: NowState | null = null;
let clockTimer: number | undefined;

function emitClock() {
  clockSnapshot = readClock();
  for (const listener of clockListeners) listener();
}

function subscribeClock(listener: () => void): () => void {
  if (clockListeners.size === 0) {
    clockSnapshot = readClock();
    clockTimer = window.setInterval(emitClock, 30_000);
  }
  clockListeners.add(listener);

  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0 && clockTimer !== undefined) {
      window.clearInterval(clockTimer);
      clockTimer = undefined;
    }
  };
}

/** Live day, date and time in Kabugao (Philippine Standard Time). */
export function useKabugaoNow(): NowState | null {
  return useSyncExternalStore(
    subscribeClock,
    () => clockSnapshot,
    () => null,
  );
}

const WEATHER_ENDPOINT =
  `https://api.open-meteo.com/v1/forecast?latitude=${KABUGAO.latitude}&longitude=${KABUGAO.longitude}` +
  `&current=temperature_2m,weather_code&timezone=${encodeURIComponent(KABUGAO.timeZone)}`;

/**
 * Live weather for Kabugao from Open-Meteo (free, no API key, no tracking).
 * Falls back to an honest "unavailable" state rather than a placeholder
 * number — the network convention is never to display a figure that isn't real.
 */
export function useKabugaoWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    fetch(WEATHER_ENDPOINT, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("bad response"))))
      .then((payload: { current?: { temperature_2m?: number; weather_code?: number } }) => {
        const temperature = payload?.current?.temperature_2m;
        if (typeof temperature !== "number") throw new Error("no reading");
        setState({
          status: "ready",
          temperature: `${Math.round(temperature)}°C`,
          description: WMO[payload.current?.weather_code ?? -1] ?? "",
        });
      })
      .catch(() => setState({ status: "unavailable" }))
      .finally(() => window.clearTimeout(timeout));

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return state;
}
