import { useState, memo, useEffect, useRef, useCallback } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Github,
  Linkedin,
  Instagram,
  MessageCircle,
  Briefcase,
  Clock,
  Globe2,
  Sparkles,
} from 'lucide-react';
import AnimatedAvatar from './AnimatedAvatar';
import { gsap } from 'gsap';
import { useReveal } from '@/hooks/useReveal';

const YOUR_EMAIL = 'thanan757@gmail.com';
const YOUR_NAME = 'Ananth N';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = memo(() => {
  const [sectionRef, inView] = useReveal<HTMLDivElement>(0.08, 350);
  const hasAnimatedRef = useRef(false);
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [lastMailtoUrl, setLastMailtoUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const validate = (data: FormData): Partial<FormData> => {
    const e: Partial<FormData> = {};
    if (!data.name.trim()) e.name = 'Please enter your name';
    if (!data.email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Please enter a valid email';
    if (!data.subject.trim()) e.subject = 'Please enter a subject';
    if (!data.message.trim()) e.message = 'Please enter a message';
    else if (data.message.trim().length < 10) e.message = 'Message should be at least 10 characters';
    return e;
  };

  const buildEmailBody = (data: FormData) =>
    `Hi ${YOUR_NAME},

${data.message}

---
From: ${data.name} <${data.email}>
Subject: ${data.subject}
Sent from: ananth-3d-genesis-folio portfolio
`;

  const buildMailtoUrl = (data: FormData) => {
    const subject = `[Portfolio] ${data.subject}`;
    const body = buildEmailBody(data);
    return `mailto:${YOUR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validate(form);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    setStatus('submitting');
    const url = buildMailtoUrl(form);
    setLastMailtoUrl(url);

    // Open the user's default mail client with the message pre-filled.
    // The recipient is already set to YOUR_EMAIL.
    const opened = window.open(url, '_self');

    // After a short delay, mark as success.
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    }, 600);
  };

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(YOUR_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked */
    }
  }, []);

  const handleQuickHire = () => {
    const url = buildMailtoUrl({
      name: form.name || 'A visitor from your portfolio',
      email: form.email || 'no-reply@example.com',
      subject: form.subject || 'Project Inquiry',
      message: form.message ||
        `Hi ${YOUR_NAME},\n\nI came across your portfolio and I would like to discuss a potential project with you.\n\nProject Overview:\n[Tell me about your project]\n\nTimeline:\n[Your expected timeline]\n\nBudget:\n[Optional budget range]\n\nLooking forward to hearing from you.\n\nBest regards,`,
    });
    setLastMailtoUrl(url);
    window.open(url, '_self');
  };

  useEffect(() => {
    if (!inView || hasAnimatedRef.current || !sectionRef.current) return;
    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.gsap-contact-header', { opacity: 0, y: 24, duration: 0.45, stagger: 0.12 });
      tl.from('.gsap-contact-card', { opacity: 0, y: 24, duration: 0.5, stagger: 0.08 }, '-=0.3');
      tl.from('.gsap-contact-form', { opacity: 0, y: 24, duration: 0.55 }, '-=0.4');
      tl.from('.gsap-contact-info', { opacity: 0, x: 16, duration: 0.55, stagger: 0.06 }, '-=0.5');
    }, sectionRef);

    return () => ctx.revert();
  }, [inView, sectionRef]);

  const inputClass = (hasError: boolean) =>
    `w-full bg-background/60 border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? 'border-destructive focus:ring-destructive/30 focus:border-destructive'
        : 'border-border focus:ring-primary/30 focus:border-primary'
    }`;

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-transparent" ref={sectionRef}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl -z-10" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl -z-10" />

      <div className="section-container relative z-content">
        {/* Title with Avatar */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 mb-12">
          <div className="flex-shrink-0 gsap-contact-header">
            <AnimatedAvatar variant="contact" className="w-44 h-60 md:w-56 md:h-72 lg:w-64 lg:h-80" />
          </div>
          <div className="text-center lg:text-left">
            <div className="gsap-contact-header inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Let's Collaborate
              </span>
            </div>
            <h2 className="gsap-contact-header text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-4 tracking-tight">
              Get In Touch
            </h2>
            <p className="gsap-contact-header text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Have a project, a role, or just a wild idea? Drop a message and
              I'll get back to you within 24 hours.
            </p>
          </div>
        </div>

        {/* Quick info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-5xl mx-auto">
          {[
            {
              icon: Briefcase,
              label: 'Available for',
              value: 'Freelance & Full-time',
              accent: 'text-primary',
            },
            {
              icon: Clock,
              label: 'Response time',
              value: 'Within 24 hours',
              accent: 'text-accent',
            },
            {
              icon: Globe2,
              label: 'Timezone',
              value: 'IST · UTC+5:30',
              accent: 'text-primary',
            },
          ].map((c, i) => (
            <div
              key={c.label}
              className="gsap-contact-card flex items-center gap-3 p-4 rounded-xl border border-border bg-card/70 backdrop-blur-md"
            >
              <div className={`p-2.5 rounded-lg bg-muted/60 ${c.accent}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {c.label}
                </p>
                <p className="text-sm font-semibold text-foreground">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact Form */}
          <div className="gsap-contact-form lg:col-span-3 relative overflow-hidden rounded-2xl border border-border bg-card/85 backdrop-blur-xl shadow-xl p-6 md:p-8">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl -z-0 pointer-events-none" />
            <div className="relative z-content">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Send a message</h3>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  To: {YOUR_EMAIL}
                </span>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-foreground block text-sm font-medium">
                      Your Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange('name')}
                        className={inputClass(!!errors.name)}
                        placeholder="John Doe"
                        autoComplete="name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-foreground block text-sm font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange('email')}
                        className={inputClass(!!errors.email)}
                        placeholder="john@example.com"
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-foreground block text-sm font-medium">
                    Subject <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <MessageSquare size={18} />
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange('subject')}
                      className={inputClass(!!errors.subject)}
                      placeholder="Project Inquiry / Job Opportunity / Just saying hi…"
                    />
                  </div>
                  {errors.subject && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.subject}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-foreground block text-sm font-medium">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={form.message}
                    onChange={handleChange('message')}
                    className={`${inputClass(!!errors.message)} px-4 pl-4 resize-none`}
                    placeholder="Tell me about your project, timeline, and budget. The more context the better!"
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground text-right">
                    {form.message.length} characters
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Opening email client…
                      </>
                    ) : status === 'success' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Ready to send
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickHire}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold bg-secondary text-secondary-foreground border border-border hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Briefcase className="w-4 h-4" /> Quick Hire Template
                  </button>
                </div>

                {/* Status messages */}
                {status === 'success' && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">Your email client should now be open.</p>
                      <p className="opacity-90 mt-0.5">
                        Review the pre-filled message and hit <strong>Send</strong>. It will be
                        delivered to <span className="font-mono">{YOUR_EMAIL}</span>.
                      </p>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      Couldn't open your email client. Please email me directly at{' '}
                      <span className="font-mono font-semibold">{YOUR_EMAIL}</span>.
                    </p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground italic pt-1">
                  ⓘ Submitting opens your default mail app (Gmail, Outlook, Apple Mail, etc.)
                  with everything pre-filled. No data is sent through this site.
                </p>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="gsap-contact-info lg:col-span-2 flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-foreground">Direct Contact</h3>
              <div className="space-y-3">
                {[
                  {
                    icon: Phone,
                    label: 'Phone',
                    value: '+91 6384227309',
                    href: 'tel:+916384227309',
                  },
                  {
                    icon: Mail,
                    label: 'Email',
                    value: YOUR_EMAIL,
                    href: `mailto:${YOUR_EMAIL}`,
                    copy: true,
                  },
                  {
                    icon: MapPin,
                    label: 'Location',
                    value: 'Madurai, Tamil Nadu, India',
                    href: 'https://maps.google.com/?q=Madurai+Tamil+Nadu+India',
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="gsap-contact-info group flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:scale-110 transition-transform">
                      <item.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.value}
                      </p>
                    </div>
                    {item.copy && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCopyEmail();
                        }}
                        className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Copy email"
                        aria-label="Copy email"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-foreground">Connect With Me</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    href: 'https://www.linkedin.com/in/ananth-n-583036233',
                    icon: Linkedin,
                    label: 'LinkedIn',
                    color: 'hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/40',
                  },
                  {
                    href: 'https://github.com/sparrow-003',
                    icon: Github,
                    label: 'GitHub',
                    color: 'hover:bg-foreground/10 hover:text-foreground hover:border-foreground/40',
                  },
                  {
                    href: 'https://www.instagram.com/_alexxz_0',
                    icon: Instagram,
                    label: 'Instagram',
                    color: 'hover:bg-[#E4405F]/10 hover:text-[#E4405F] hover:border-[#E4405F]/40',
                  },
                  {
                    href: 'https://api.whatsapp.com/send?phone=916384227309',
                    icon: MessageCircle,
                    label: 'WhatsApp',
                    color: 'hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/40',
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className={`gsap-contact-info group flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card/60 text-muted-foreground transition-all hover:scale-[1.03] active:scale-95 ${social.color}`}
                  >
                    <social.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Resume Download */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6 shadow-xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">My Resume</h3>
                  <p className="text-xs text-muted-foreground">
                    One-page overview of skills, projects, and experience.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/resume.pdf';
                  link.download = 'Ananth_Resume_Web_Developer.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                Download Resume (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';

export default Contact;
