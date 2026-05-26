import { motion } from 'framer-motion';
import { useState, memo } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Download } from 'lucide-react';
import AnimatedAvatar from './AnimatedAvatar';

const Contact = memo(() => {
  const [ref, isInView] = useReveal<HTMLDivElement>(0.05);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  const handleHireMe = () => {
    const subject = "Project Inquiry - I'd Like to Hire You";
    const body = `Hello Ananth,\n\nI came across your impressive portfolio website and I'm interested in discussing a potential project with you.\n\nProject Overview:\n[Brief description of your project/requirements]\n\nTimeline:\n[Your expected timeline]\n\nBudget Range:\n[Your budget range if applicable]\n\nLooking forward to hearing from you soon!\n\nBest regards,\n[Your Name]`;
    window.location.href = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Ananth_Resume_Web_Developer.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-transparent" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 -z-10" />
      
      {/* Background elements */}
      <motion.div className="absolute inset-0 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 2 }}>
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent shadow-inner" />
        <div className="grid grid-cols-6 grid-rows-8 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-border/30" />
          ))}
        </div>
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-border/30 rounded-full animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 border-2 border-border/30 rounded-full animate-float-delay" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-border/30 rounded-full animate-float-slow" />
      </motion.div>

      <div className="section-container relative z-10">
        {/* Title with Avatar */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-12">
          <div className="flex-shrink-0">
            <AnimatedAvatar variant="contact" className="w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-96" />
          </div>

          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title text-3xl md:text-5xl text-gradient uppercase italic tracking-tighter">
              Get In Touch
            </h2>
            <p className="section-subtitle max-w-xl">
              Ready to turn your vision into reality? Let's create something extraordinary together
            </p>
          </motion.div>
        </div>

        <motion.div
          className="max-w-2xl mx-auto mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={handleHireMe}
            className="px-10 py-5 bg-primary hover:bg-primary/90 rounded-3xl text-xl font-black text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group uppercase tracking-widest"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Send className="h-5 w-5" />
              Hire Me Now
            </span>
          </motion.button>
          <motion.p className="text-muted-foreground mt-4 italic" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.8 }}>
            *Opens your default email app with a pre-filled template
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <motion.div
            className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 lg:col-span-3 border border-border shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">Send Me a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-foreground block text-sm font-medium">Your Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><User size={18} /></div>
                    <input type="text" id="name" name="name" required className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 text-foreground transition-all" placeholder="John Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-foreground block text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Mail size={18} /></div>
                    <input type="email" id="email" name="email" required className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 text-foreground transition-all" placeholder="john@example.com" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-foreground block text-sm font-medium">Subject</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><MessageSquare size={18} /></div>
                  <input type="text" id="subject" name="subject" required className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 text-foreground transition-all" placeholder="Project Inquiry" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-foreground block text-sm font-medium">Message</label>
                <textarea id="message" name="message" rows={6} required className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 text-foreground resize-none transition-all" placeholder="Tell me about your project..." />
              </div>
              <motion.button
                type="submit"
                className="px-8 py-3 bg-primary/10 rounded-xl font-bold text-foreground border border-primary/30 hover:bg-primary/20 transition-all w-full md:w-auto relative overflow-hidden group uppercase tracking-widest shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={formStatus === 'submitting'}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {formStatus === 'idle' && (<><Send size={18} />Send Message</>)}
                  {formStatus === 'submitting' && 'Sending...'}
                  {formStatus === 'success' && 'Message Sent!'}
                  {formStatus === 'error' && 'Please Try Again'}
                </span>
              </motion.button>

              {formStatus === 'success' && (
                <motion.div className="text-primary mt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  Thank you for reaching out! I'll get back to you soon.
                </motion.div>
              )}
              {formStatus === 'error' && (
                <motion.div className="text-destructive mt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  There was an error sending your message. Please try again.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="bg-card/60 backdrop-blur-xl rounded-2xl p-8 lg:col-span-2 border border-border shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">Contact Information</h3>
            <div className="space-y-6">
              {[
                { icon: Phone, label: "Phone", value: "+91 6384227309" },
                { icon: Mail, label: "Email", value: "thanan757@gmail.com" },
                { icon: MapPin, label: "Location", value: "Madurai, Tamil Nadu, India" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 border border-primary/20"
                    whileHover={{ scale: 1.1 }}
                  >
                    <item.icon size={18} className="text-primary" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.label}</h4>
                    <p className="text-muted-foreground">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <h3 className="text-xl font-bold mt-10 mb-6 text-foreground">Connect With Me</h3>
            <div className="flex gap-4">
              {[
                { href: "https://www.linkedin.com/in/ananth-n-583036233", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 4a2 2 0 1 0 0 4 2 2 0 1 0 0-4z" },
                { href: "https://github.com/sparrow-003", icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
                { href: "https://www.instagram.com/_alexxz_0", icon: "M2 2h20v20H2z M17.5 6.5h.01 M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" },
                { href: "https://api.whatsapp.com/send?phone=916384227309", icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-border"
                  whileHover={{ scale: 1.2, rotate: idx % 2 === 0 ? 10 : -10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>

            {/* Resume Download */}
            <div className="mt-10">
              <motion.button
                onClick={handleDownloadResume}
                className="inline-flex items-center gap-2 px-6 py-3 border border-primary rounded-md font-medium text-foreground hover:bg-primary/10 transition-all group relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                <span className="relative z-10">Download Resume</span>
                <span className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';

export default Contact;
