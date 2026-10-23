import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  label: string;
}

export function WhatsAppButton({ phone, message, label }: WhatsAppButtonProps) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a className="whatsapp-float" href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
      <MessageCircle size={21} strokeWidth={2} aria-hidden="true" />
      <span className="whatsapp-tooltip" aria-hidden="true">{label}</span>
    </a>
  );
}