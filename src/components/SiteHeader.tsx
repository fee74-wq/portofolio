import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { siteConfig } from "../config/site";
import { localeOptions, type Locale, type Messages } from "../i18n/translations";
import type { Theme } from "../hooks/useVisitorSettings";

interface SiteHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  theme: Theme;
  onThemeToggle: () => void;
  t: Messages;
}

export function SiteHeader({ locale, onLocaleChange, theme, onThemeToggle, t }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { href: "#services", label: t.nav.services },
    { href: "#work", label: t.nav.work },
    { href: "#process", label: t.nav.process },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#faq", label: t.nav.faq },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="#home" aria-label={`${siteConfig.name}, ${t.hero.role}`} onClick={closeMenu}>
          {siteConfig.name}<span>.</span>
        </a>

        <nav className="desktop-nav" aria-label={t.nav.main}>
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <label className="language-control">
            <span className="sr-only">{t.nav.language}</span>
            <select value={locale} onChange={(event) => onLocaleChange(event.currentTarget.value as Locale)}>
              {localeOptions.map((option) => (
                <option key={option.code} value={option.code}>{option.flag} {option.label}</option>
              ))}
            </select>
          </label>
          <button
            className="theme-toggle icon-button"
            type="button"
            onClick={onThemeToggle}
            aria-label={theme === "dark" ? t.nav.themeLight : t.nav.themeDark}
            title={theme === "dark" ? t.nav.themeLight : t.nav.themeDark}
          >
            {theme === "dark" ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
          </button>
          <a className="header-hire" href="#contact">{t.nav.hire}<ArrowUpRight size={13} aria-hidden="true" /></a>
          <button
            className="mobile-menu-toggle icon-button"
            type="button"
            aria-label={menuOpen ? t.nav.close : t.nav.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label={t.nav.mobile}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {navItems.map((item) => (
              <a href={item.href} key={item.href} onClick={closeMenu}>{item.label}<ArrowUpRight size={15} aria-hidden="true" /></a>
            ))}
            <a className="mobile-nav-hire" href="#contact" onClick={closeMenu}>{t.nav.hire}<ArrowUpRight size={15} aria-hidden="true" /></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}