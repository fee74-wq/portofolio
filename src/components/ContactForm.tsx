import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { Messages } from "../i18n/translations";

interface ContactFormProps {
  t: Messages["contact"];
}

export function ContactForm({ t }: ContactFormProps) {
  const [hasError, setHasError] = useState(false);
  const [submitted] = useState(() => new URLSearchParams(window.location.search).get("contact") === "success");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!event.currentTarget.checkValidity()) {
      event.preventDefault();
      setHasError(true);
      event.currentTarget.reportValidity();
      return;
    }

    setHasError(false);
  };

  if (submitted) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span className="success-icon"><Check size={23} aria-hidden="true" /></span>
        <h3>{t.successTitle}</h3>
        <p>{t.successBody}</p>
      </div>
    );
  }

  return (
    <form
      className="contact-form"
      name="contact"
      method="POST"
      action="/?contact=success#contact"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      onInvalidCapture={() => setHasError(true)}
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className="honeypot-field" aria-hidden="true">
        <label>{t.honeypot}<input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
      </p>

      <div className="form-heading">
        <span className="form-step">01 / 01</span>
        <h3>{t.formTitle}</h3>
      </div>

      {hasError && <p className="form-error" role="alert">{t.error}</p>}

      <div className="form-grid">
        <label className="form-field">
          <span>{t.name}<span className="required-mark" aria-hidden="true">*</span></span>
          <input name="name" type="text" placeholder={t.namePlaceholder} autoComplete="name" required maxLength={100} />
        </label>
        <label className="form-field">
          <span>{t.email}<span className="required-mark" aria-hidden="true">*</span></span>
          <input name="email" type="email" placeholder={t.emailPlaceholder} autoComplete="email" required maxLength={160} />
        </label>
        <label className="form-field">
          <span>{t.projectType}<span className="required-mark" aria-hidden="true">*</span></span>
          <select name="projectType" defaultValue="" required>
            <option value="" disabled>{t.projectTypePlaceholder}</option>
            {t.projectOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>{t.budget}</span>
          <select name="budget" defaultValue="">
            <option value="" disabled>{t.budgetPlaceholder}</option>
            {t.budgetOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="form-field form-field-wide">
          <span>{t.message}<span className="required-mark" aria-hidden="true">*</span></span>
          <textarea name="message" placeholder={t.messagePlaceholder} required minLength={12} maxLength={3000} rows={4} />
        </label>
      </div>

      <div className="form-submit-row">
        <span className="form-required-note"><span aria-hidden="true">*</span> {t.required}</span>
        <button className="button button-primary form-submit" type="submit">{t.submit}<ArrowUpRight size={16} aria-hidden="true" /></button>
      </div>
    </form>
  );
}