"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, ArrowRight, Laptop, Linkedin, MessageCircle, Instagram } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { useIsMobile } from "@/hooks/use-mobile"

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const isMobile = useIsMobile()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({ name: "", email: "", message: "" })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  const handleHireMe = () => {
    const subject = "Job Opportunity"
    const body = `Hi Ananth,

I've been captivated by your portfolio and would like to discuss a potential collaboration that could redefine digital excellence.

Let's create something extraordinary together.

Best regards,`

    const mailtoLink = `mailto:thanan757@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/ananth-n-583036233?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      icon: <Linkedin className="text-blue-400" size={24} />,
      color: "from-blue-600 to-blue-400",
    },
    {
      name: "WhatsApp",
      url: "https://wa.link/pnboci",
      icon: <MessageCircle className="text-green-400" size={24} />,
      color: "from-green-600 to-green-400",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/_alexxz_0?igsh=MXZweGo5YzlsZGsyag==",
      icon: <Instagram className="text-pink-400" size={24} />,
      color: "from-pink-600 to-purple-400",
    },
  ]

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black -z-10"></div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-5">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 0.8, 1.2, 1],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-20">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Get In{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-400">Touch</span>
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-purple-500 to-amber-500 mx-auto mb-8"
              initial={{ width: 0 }}
              animate={isInView ? { width: 96 } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have a project in mind or want to discuss a potential opportunity? I'd love to hear from you and explore
              how we can work together to create something extraordinary.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.02, rotateY: 2 }} transition={{ type: "spring", stiffness: 300 }}>
                <GlassCard className="h-full">
                  <h3 className="text-2xl font-semibold text-white mb-8">Contact Information</h3>

                  <div className="space-y-8 mb-10">
                    <motion.div
                      className="flex items-start gap-4"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="bg-purple-500/20 p-3 rounded-xl"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Mail className="text-purple-400" size={24} />
                      </motion.div>
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1">Email</h4>
                        <a
                          href="mailto:thanan757@gmail.com"
                          className="text-purple-300 hover:text-amber-300 transition-colors"
                        >
                          thanan757@gmail.com
                        </a>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-4"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="bg-purple-500/20 p-3 rounded-xl"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Phone className="text-purple-400" size={24} />
                      </motion.div>
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1">Phone</h4>
                        <a href="tel:+916384227309" className="text-purple-300 hover:text-amber-300 transition-colors">
                          +91 6384227309
                        </a>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-4"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="bg-purple-500/20 p-3 rounded-xl"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <MapPin className="text-purple-400" size={24} />
                      </motion.div>
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1">Location</h4>
                        <p className="text-gray-300">Ramanathapuram, Tamil Nadu, India</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Social Media Links */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-white mb-4">Connect With Me</h4>
                    <div className="flex gap-4">
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`bg-gradient-to-r ${social.color} p-3 rounded-xl hover:scale-110 transition-all duration-300`}
                          whileHover={{
                            scale: 1.1,
                            rotate: 5,
                          }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {social.icon}
                          <span className="sr-only">{social.name}</span>
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  <div className="relative h-[200px] mb-8 flex items-center justify-center">
                    <motion.div
                      className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-amber-300 to-purple-600"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      Let's create something amazing together!
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <motion.div
                        className="w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/20 to-amber-500/20"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleHireMe}
                      className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-bold py-6 rounded-xl transition-all transform hover:scale-105 group"
                    >
                      <Laptop className="mr-2" size={18} />
                      Hire Me Now
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </GlassCard>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.02, rotateY: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <GlassCard>
                  <h3 className="text-2xl font-semibold text-white mb-8">Send Me a Message</h3>

                  {isSubmitted ? (
                    <motion.div
                      className="bg-green-900/30 border border-green-500/30 text-green-300 p-4 rounded-xl mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <p className="font-medium">Message sent successfully!</p>
                      <p className="text-sm mt-1">
                        Thank you for reaching out. I'll get back to you as soon as possible.
                      </p>
                    </motion.div>
                  ) : null}

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          required
                          className="w-full bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-purple-500"
                        />
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Your Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          required
                          className="w-full bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-purple-500"
                        />
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                          Your Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleInputChange}
                          placeholder="Hello, I'd like to discuss a project..."
                          required
                          className="w-full min-h-[150px] bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-purple-500"
                        />
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-bold py-6 rounded-xl transition-all transform hover:scale-105 group"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Send className="mr-2" size={18} />
                              Send Message
                              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
