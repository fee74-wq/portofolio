import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Atom,
  Braces,
  Code2,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  PanelsTopLeft,
  Plus,
  Server,
  X,
} from "lucide-react";
import { ContactForm } from "./components/ContactForm";
import { Reveal } from "./components/Reveal";
import { SiteHeader } from "./components/SiteHeader";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { siteConfig } from "./config/site";
import {
  dismissGreeting,
  getGreetingDismissed,
  getInitialLocale,
  getInitialTheme,
  lookupVisitorCountry,
  mapCountryToLocale,
  saveLocale,
  saveTheme,
  type Theme,
  type VisitorCountry,
} from "./hooks/useVisitorSettings";
import { messages, type Locale, type Messages } from "./i18n/translations";

interface SectionIntroProps {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  align?: "left" | "right";
}

function SectionIntro({ id, eyebrow, title, copy, align = "left" }: SectionIntroProps) {
  return (
    <div className={`section-intro section-intro-${align}`}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      <p className="section-copy">{copy}</p>
    </div>
  );
}

function setMeta(selector: string, content: string, attribute = "content") {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.setAttribute(attribute, content);
}

function createWhatsAppHref(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  id: "id_ID",
  es: "es_ES",
  pt: "pt_BR",
  de: "de_DE",
  fr: "fr_FR",
  ar: "ar_SA",
  ja: "ja_JP",
};

function App() {
  const initialSettings = useRef(getInitialLocale()).current;
  const [locale, setLocale] = useState<Locale>(initialSettings.locale);
  const [canUseCountryFallback, setCanUseCountryFallback] = useState(initialSettings.canUseCountryFallback);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [visitorCountry, setVisitorCountry] = useState<VisitorCountry | null>(null);
  const [greetingDismissed, setGreetingDismissed] = useState(getGreetingDismissed);
  const fallbackRef = useRef(canUseCountryFallback);
  const reduceMotion = useReducedMotion();
  const t: Messages = messages[locale];

  useEffect(() => {
    fallbackRef.current = canUseCountryFallback;
  }, [canUseCountryFallback]);

  useEffect(() => {
    let isActive = true;

    lookupVisitorCountry().then((country) => {
      if (!isActive || !country) return;
      setVisitorCountry(country);

      if (fallbackRef.current) {
        const detectedLocale = mapCountryToLocale(country.code);
        if (detectedLocale) setLocale(detectedLocale);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    root.dataset.theme = theme;

    document.title = `${siteConfig.name} | ${t.meta.title}`;
    setMeta('meta[name="description"]', t.meta.description);
    setMeta('meta[property="og:title"]', document.title);
    setMeta('meta[property="og:description"]', t.meta.description);
    setMeta('meta[property="og:url"]', siteConfig.baseUrl);
    setMeta('meta[property="og:image"]', `${siteConfig.baseUrl}${siteConfig.heroImage}`);
    setMeta('meta[property="og:image:alt"]', t.hero.imageAlt);
    setMeta('meta[property="og:locale"]', openGraphLocales[locale]);
    setMeta('meta[name="twitter:title"]', document.title);
    setMeta('meta[name="twitter:description"]', t.meta.description);
    setMeta('meta[name="twitter:image"]', `${siteConfig.baseUrl}${siteConfig.heroImage}`);
    setMeta('meta[name="theme-color"]', theme === "dark" ? "#0b0e10" : "#f4f4ef");
    setMeta('link[rel="canonical"]', `${siteConfig.baseUrl}/`, "href");

    const schema = (document.getElementById("person-schema") as HTMLScriptElement | null) ?? document.createElement("script");
    schema.id = "person-schema";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteConfig.name,
      jobTitle: siteConfig.title,
      description: t.meta.description,
      email: `mailto:${siteConfig.email}`,
      url: siteConfig.baseUrl,
      image: `${siteConfig.baseUrl}${siteConfig.heroImage}`,
      address: {
        "@type": "PostalAddress",
        addressCountry: siteConfig.countryCode,
      },
      knowsAbout: siteConfig.skills,
      sameAs: Object.values(siteConfig.socials).filter((url) => !url.includes("your-username")),
    });
    if (!schema.isConnected) document.head.appendChild(schema);
  }, [locale, theme, t.hero.imageAlt, t.meta.description, t.meta.title]);

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale);
    setCanUseCountryFallback(false);
    fallbackRef.current = false;
    saveLocale(nextLocale);
  };

  const handleThemeToggle = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      saveTheme(nextTheme);
      return nextTheme;
    });
  };

  const handleGreetingDismiss = () => {
    dismissGreeting();
    setGreetingDismissed(true);
  };

  const greeting = visitorCountry
    ? t.greeting.format.replace("{country}", visitorCountry.name)
    : "";

  const stackIcons = [Atom, Braces, PanelsTopLeft, Server];
  const serviceItems = [
    { number: "01", item: t.services.items.whiteLabel },
    { number: "02", item: t.services.items.landing },
    { number: "03", item: t.services.items.webApps },
    { number: "04", item: t.services.items.support },
  ];

  return (
    <div className="portfolio-page">
      <a className="skip-link" href="#main-content">{t.nav.skip}</a>
      <SiteHeader
        locale={locale}
        onLocaleChange={handleLocaleChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        t={t}
      />

      <AnimatePresence>
        {visitorCountry && !greetingDismissed && (
          <motion.aside
            className="location-greeting"
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
          >
            <div className="greeting-inner">
              <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
              <p>{greeting}</p>
              <button type="button" onClick={handleGreetingDismiss} aria-label={t.greeting.dismiss}>
                <X size={15} aria-hidden="true" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main id="main-content">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <motion.img
            className="hero-image"
            src={siteConfig.heroImage}
            alt={t.hero.imageAlt}
            fetchPriority="high"
            decoding="async"
            initial={reduceMotion ? false : { scale: 1.045 }}
            animate={{ scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="hero-shade" aria-hidden="true" />
          <motion.div
            className="hero-ambient"
            aria-hidden="true"
            animate={reduceMotion ? undefined : { x: [0, 18, 0], y: [0, -12, 0], opacity: [0.28, 0.42, 0.28] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="hero-inner page-width">
            <motion.div
              className="hero-copy"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hero-status-line">
                <span className="availability-indicator" aria-hidden="true" />
                <span>{t.hero.availability}</span>
                <span className="status-separator" aria-hidden="true" />
                <span className="hero-eyebrow">{t.hero.eyebrow}</span>
              </div>

              <h1 id="hero-title">
                <span className="hero-name">{siteConfig.name}<span className="hero-period">.</span></span>
                <span className="hero-headline">{t.hero.headline}</span>
              </h1>
              <p className="hero-copy-text">{t.hero.copy}</p>

              <div className="hero-actions">
                <a className="button button-primary" href="#contact">
                  {t.hero.hire}<ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <a className="button button-quiet" href="#work">
                  {t.hero.work}<ArrowDown size={15} aria-hidden="true" />
                </a>
              </div>

              <div className="hero-context">
                <span>{t.hero.role}</span>
                <span className="context-divider" aria-hidden="true" />
                <span>{t.hero.basedIn.replace("{location}", siteConfig.location)}</span>
              </div>

              <div className="hero-stack-block">
                <p>{t.hero.stack}</p>
                <div className="hero-stack">
                  {siteConfig.skills.map((skill, index) => {
                    const StackIcon = stackIcons[index % stackIcons.length];
                    return (
                      <span className="stack-item" key={skill}>
                        <StackIcon size={15} strokeWidth={1.7} aria-hidden="true" />
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <a className="hero-scroll-cue" href="#services">
              <span>{t.hero.scroll}</span><ArrowDown size={14} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="section section-services" id="services" aria-labelledby="services-title">
          <div className="page-width">
            <Reveal>
              <SectionIntro id="services-title" eyebrow={t.services.eyebrow} title={t.services.title} copy={t.services.copy} />
            </Reveal>
            <div className="service-list">
              {serviceItems.map(({ number, item }, index) => (
                <Reveal key={number} delay={index * 0.045}>
                  <article className="service-row">
                    <span className="service-number">{number}</span>
                    <div className="service-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <ArrowUpRight className="service-arrow" size={19} strokeWidth={1.6} aria-hidden="true" />
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-work" id="work" aria-labelledby="work-title">
          <div className="page-width">
            <Reveal>
              <div className="work-heading">
                <SectionIntro id="work-title" eyebrow={t.portfolio.eyebrow} title={t.portfolio.title} copy={t.portfolio.copy} />
              </div>
            </Reveal>
            <div className="project-grid">
              {siteConfig.projects.map((project, index) => {
                const copy = t.portfolio.projects[project.id];
                return (
                  <Reveal key={project.id} delay={index * 0.08} className={`project-reveal project-reveal-${index + 1}`}>
                    <article className="project-card">
                      <a className="project-image-link" href={project.demo} target="_blank" rel="noreferrer" aria-label={`${t.portfolio.demo}: ${copy.title}`}>
                        <div className="project-image-frame">
                          <img src={project.image} alt={copy.alt} loading="lazy" decoding="async" width="1200" height="900" />
                          <span className="project-image-action" aria-hidden="true"><ArrowUpRight size={21} /></span>
                        </div>
                      </a>
                      <div className="project-info">
                        <div className="project-heading-line">
                          <div>
                            <p className="project-concept">{t.portfolio.concept}</p>
                            <h3>{copy.title}</h3>
                          </div>
                          <span className="project-number">0{index + 1}</span>
                        </div>
                        <p className="project-description">{copy.description}</p>
                        <div className="project-bottom-line">
                          <ul className="project-tags" aria-label={t.hero.stack}>
                            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                          </ul>
                          <div className="project-links">
                            <a href={project.demo} target="_blank" rel="noreferrer">{t.portfolio.demo}<ArrowUpRight size={14} aria-hidden="true" /></a>
                            <a href={project.source} target="_blank" rel="noreferrer">{t.portfolio.source}<Code2 size={14} aria-hidden="true" /></a>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section-process" id="process" aria-labelledby="process-title">
          <div className="page-width">
            <Reveal>
              <SectionIntro id="process-title" eyebrow={t.process.eyebrow} title={t.process.title} copy={t.process.copy} />
            </Reveal>
            <div className="process-list">
              {t.process.steps.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.05}>
                  <article className="process-step">
                    <span className="process-step-no">0{index + 1}</span>
                    <div className="process-step-marker"><span /></div>
                    <div className="process-step-copy">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-why" aria-labelledby="why-title">
          <div className="page-width why-layout">
            <Reveal className="why-sticky-copy">
              <SectionIntro id="why-title" eyebrow={t.why.eyebrow} title={t.why.title} copy={t.why.copy} />
              <a className="text-link" href="#contact">{t.nav.hire}<ArrowRight size={16} aria-hidden="true" /></a>
            </Reveal>
            <div className="why-list">
              {t.why.points.map((point, index) => (
                <Reveal key={point.title} delay={index * 0.04}>
                  <article className="why-row">
                    <span className="why-no">0{index + 1}</span>
                    <div><h3>{point.title}</h3><p>{point.description}</p></div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-pricing" id="pricing" aria-labelledby="pricing-title">
          <div className="page-width pricing-layout">
            <Reveal>
              <SectionIntro id="pricing-title" eyebrow={t.pricing.eyebrow} title={t.pricing.title} copy={t.pricing.copy} />
              <a className="text-link pricing-link" href="#contact">{t.pricing.cta}<ArrowRight size={16} aria-hidden="true" /></a>
            </Reveal>
            <div className="pricing-list">
              {siteConfig.pricing.map((item, index) => {
                const copy = t.pricing.items[item.id];
                const price = item.startingPrice === null
                  ? t.pricing.custom
                  : `${t.pricing.from} ${new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(item.startingPrice)}+`;
                return (
                  <Reveal key={item.id} delay={index * 0.06}>
                    <article className="pricing-row">
                      <span className="pricing-number">0{index + 1}</span>
                      <div className="pricing-item-copy"><h3>{copy.title}</h3><p>{copy.description}</p></div>
                      <p className="pricing-price">{price}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section-faq" id="faq" aria-labelledby="faq-title">
          <div className="page-width faq-layout">
            <Reveal>
              <SectionIntro id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} copy={t.faq.copy} />
            </Reveal>
            <div className="faq-list">
              {t.faq.items.map((item, index) => (
                <FaqItem key={item.question} index={index} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section-contact" id="contact" aria-labelledby="contact-title">
          <div className="contact-glow" aria-hidden="true" />
          <div className="page-width contact-layout">
            <Reveal className="contact-copy-column">
              <SectionIntro id="contact-title" eyebrow={t.contact.eyebrow} title={t.contact.title} copy={t.contact.copy} />
              <div className="contact-actions">
                <a className="button button-primary" href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(t.contact.title)}`}>
                  {t.contact.emailMe}<ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <a className="button button-outline" href={createWhatsAppHref(t.contact.whatsappMessage)} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} aria-hidden="true" />{t.contact.whatsapp}
                </a>
              </div>
              <a className="contact-email" href={`mailto:${siteConfig.email}`}>{siteConfig.email}<ArrowUpRight size={14} aria-hidden="true" /></a>
            </Reveal>
            <Reveal className="contact-form-column" delay={0.12}>
              <ContactForm t={t.contact} />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-main">
          <div className="footer-brand-block">
            <a className="wordmark footer-wordmark" href="#home" aria-label={`${siteConfig.name}, ${t.footer.top}`}>
              {siteConfig.name}<span>.</span>
            </a>
            <p>{t.footer.summary}</p>
          </div>
          <div className="footer-socials">
            <p>{t.footer.socials}</p>
            <div className="social-links">
              <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" aria-label={t.footer.github}><Code2 size={18} aria-hidden="true" /></a>
              <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" aria-label={t.footer.linkedin}><Globe2 size={18} aria-hidden="true" /></a>
              <a href={`mailto:${siteConfig.email}`} aria-label={t.contact.emailMe}><Mail size={18} aria-hidden="true" /></a>
            </div>
          </div>
          <a className="footer-top" href="#home">{t.footer.top}<ArrowUp size={15} aria-hidden="true" /></a>
        </div>
        <div className="page-width footer-bottom">
          <p>© {new Date().getFullYear()} {siteConfig.name}. {t.footer.copyright}</p>
          <p>{t.hero.basedIn.replace("{location}", siteConfig.location)}</p>
        </div>
      </footer>

      <WhatsAppButton phone={siteConfig.whatsapp} message={t.contact.whatsappMessage} label={t.contact.whatsapp} />
    </div>
  );
}

interface FaqItemProps {
  index: number;
  question: string;
  answer: string;
}

function FaqItem({ index, question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(index === 0);
  const reduceMotion = useReducedMotion();
  const questionId = `faq-question-${index}`;
  const answerId = `faq-answer-${index}`;

  return (
    <article className={`faq-item${open ? " faq-item-open" : ""}`}>
      <h3>
        <button id={questionId} className="faq-question" type="button" aria-expanded={open} aria-controls={answerId} onClick={() => setOpen((current) => !current)}>
          <span className="faq-number">0{index + 1}</span>
          <span>{question}</span>
          <Plus className="faq-plus" size={19} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </h3>
      <motion.div
        id={answerId}
        className="faq-answer"
        role="region"
        aria-labelledby={questionId}
        aria-hidden={!open}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
      >
        {open && <p>{answer}</p>}
      </motion.div>
    </article>
  );
}

export default App;
