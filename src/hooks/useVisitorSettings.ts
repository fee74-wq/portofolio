import { locales, type Locale } from "../i18n/translations";

export type Theme = "dark" | "light";

const LOCALE_STORAGE_KEY = "sufi-portfolio-locale";
const THEME_STORAGE_KEY = "sufi-portfolio-theme";
const GREETING_STORAGE_KEY = "sufi-portfolio-greeting-dismissed";

function isLocale(value: string | null): value is Locale {
  return value !== null && locales.includes(value as Locale);
}

export function getSavedLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function getBrowserLocale(): Locale | null {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const language of languages) {
    const baseLanguage = language.toLowerCase().split("-")[0];
    if (locales.includes(baseLanguage as Locale)) return baseLanguage as Locale;
  }

  return null;
}

export function getInitialLocale(): { locale: Locale; canUseCountryFallback: boolean } {
  const savedLocale = getSavedLocale();
  if (savedLocale) return { locale: savedLocale, canUseCountryFallback: false };

  const browserLocale = getBrowserLocale();
  if (browserLocale) return { locale: browserLocale, canUseCountryFallback: false };

  return { locale: "en", canUseCountryFallback: true };
}

export function saveLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // The language still changes for this session when storage is unavailable.
  }
}

export function getInitialTheme(): Theme {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch {
    // Fall back to the system preference when storage is unavailable.
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function saveTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Theme switching remains available for the current session.
  }
}

export function mapCountryToLocale(countryCode: string): Locale | null {
  const code = countryCode.toUpperCase();
  const countryLanguages: Record<string, Locale> = {
    ID: "id",
    ES: "es",
    MX: "es",
    AR: "es",
    CL: "es",
    CO: "es",
    PE: "es",
    PT: "pt",
    BR: "pt",
    DE: "de",
    AT: "de",
    CH: "de",
    FR: "fr",
    BE: "fr",
    JP: "ja",
    SA: "ar",
    AE: "ar",
    EG: "ar",
    JO: "ar",
    LB: "ar",
    MA: "ar",
    DZ: "ar",
    TN: "ar",
    IQ: "ar",
    KW: "ar",
    QA: "ar",
    BH: "ar",
    OM: "ar",
    YE: "ar",
  };

  return countryLanguages[code] ?? null;
}

export interface VisitorCountry {
  name: string;
  code: string;
}

export async function lookupVisitorCountry(): Promise<VisitorCountry | null> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2800);

  try {
    const response = await fetch("https://ipwho.is/", { signal: controller.signal });
    if (!response.ok) return null;

    const result: unknown = await response.json();
    if (typeof result !== "object" || result === null || !("success" in result) || result.success !== true) return null;

    const country = "country" in result && typeof result.country === "string" ? result.country : "";
    const code = "country_code" in result && typeof result.country_code === "string" ? result.country_code : "";
    return country && code ? { name: country, code } : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function getGreetingDismissed() {
  try {
    return window.localStorage.getItem(GREETING_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function dismissGreeting() {
  try {
    window.localStorage.setItem(GREETING_STORAGE_KEY, "true");
  } catch {
    // Dismissal still applies until the page is refreshed.
  }
}