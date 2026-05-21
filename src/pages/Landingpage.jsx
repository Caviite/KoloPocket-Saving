import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import kpop from '../pages/KoloPocket_LOGO-removebg-preview.png'
import kpLogo from './KoloPocket_LOGO-removebg-preview.png'
import {
  Wallet,
  Menu,
  X,
  ArrowRight,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowDownToLine,
  Lock,
  SlidersHorizontal,
  ShieldCheck,
  LineChart,
} from 'lucide-react'

import './Landingpage.css'

import { nav } from 'framer-motion/client'
import { useNavigate } from 'react-router-dom'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
}

const steps = [
  {
    number: '1',
    title: 'Create a savings plan',
    description:
      'Set your goal, target amount, and timeline. Customize it to fit your unique lifestyle and needs.',
    icon: Target,
  },
  {
    number: '2',
    title: 'Deposit money gradually',
    description:
      'Add funds manually or set up auto-save to build your balance steadily without feeling the pinch.',
    icon: ArrowDownToLine,
  },
  {
    number: '3',
    title: 'Withdraw when complete',
    description:
      'Stay disciplined. Funds unlock only when you hit your goal, ensuring you actually reach it.',
    icon: Lock,
  },
]

const features = [
  {
    title: 'Flexible Savings',
    description:
      'Save at your own pace with customizable plans that fit your lifestyle. Pause or adjust anytime.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Secure Withdrawals',
    description:
      'Withdraw only when your goal is complete, ensuring disciplined savings and preventing impulse spending.',
    icon: ShieldCheck,
  },
  {
    title: 'Progress Tracking',
    description:
      'Visualize your savings journey with beautiful charts and stay motivated every step of the way.',
    icon: LineChart,
  },
]

const stats = [
  { value: '$2M+', label: 'Saved by users' },
  { value: '50k+', label: 'Active savers' },
  { value: '4.9/5', label: 'App store rating' },
]


function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <div className="logo">
          <div className="logo-icon">
            <img src={kpLogo} alt="KoloPocket logo" style={{width: 90, height: 80,  background: 'transparent', objectFit: 'cover'}} />
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary">
          <a href="#how-it-works" className="nav-link">How it works</a>
          <a href="#features" className="nav-link">Features</a>
        </nav>

        <div className="nav-cta">
          <button className="nav-login" onClick={() => navigate('./auth')}>Log in</button>
          <button onClick={() => navigate('./auth')} className="btn btn-sm">Get started</button>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mobile-menu"
          >
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#features" className="nav-link">Features</a>
            <div className="mobile-divider" />
            <button className="mobile-login" onClick={() => navigate('./signin')}>Log in</button>
            <button className="mobile-cta" onClick={() => navigate('/register')}>Get started</button>
          </motion.div>
        )}
      </div>
    </header>
  )
}

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-bg-blob" aria-hidden="true" />
      <div className="container">
        <div className="hero-grid">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants} className="hero-badge">
              <span className="hero-badge-dot" />
              The smart way to save
            </motion.div>

            <motion.h1 variants={itemVariants} className="hero-title">
              Save with purpose.
              <br />
              <span className="accent">Spend with confidence.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="hero-subtitle">
              Create customizable savings plans, deposit at your own pace, and
              withdraw only when your goal is complete. Build discipline
              effortlessly.
            </motion.p>

            <motion.div variants={itemVariants} className="hero-ctas">
              <button className="btn btn-primary" onClick={() => navigate('./auth')}>
                Start saving now
                <ArrowRight size={18} />
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="hero-trust">
              <div className="trust-item">
                <CheckCircle2 size={18} className="trust-icon" />
                No hidden fees
              </div>
              <div className="trust-item">
                <CheckCircle2 size={18} className="trust-icon" />
                Bank-level security
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            className="hero-mockup"
          >
            <div className="mockup-card">
              <div className="mockup-header">
                <div className="mockup-goal">
                  <div className="mockup-goal-icon">
                    <Target size={22} />
                  </div>
                  <div>
                    <h3 className="mockup-goal-title">New MacBook Pro</h3>
                    <p className="mockup-goal-cat">Tech Gadgets</p>
                  </div>
                </div>
                <span className="mockup-pill">On track</span>
              </div>

              <div className="mockup-progress-head">
                <h2 className="mockup-amount">$1,450</h2>
                <span className="mockup-target">of $2,000</span>
              </div>

              <div className="mockup-progress-track">
                <motion.div
                  className="mockup-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: '72.5%' }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                />
              </div>

              <div className="mockup-stats">
                <div className="mockup-stat">
                  <p className="mockup-stat-label">Monthly Auto-save</p>
                  <p className="mockup-stat-value">$250.00</p>
                </div>
                <div className="mockup-stat">
                  <p className="mockup-stat-label">Time remaining</p>
                  <p className="mockup-stat-value">2 Months</p>
                </div>
              </div>
            </div>

            <motion.div
              className="floater floater-top"
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <div className="floater-icon green">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="floater-label">Interest Earned</p>
                <p className="floater-value">+$42.50</p>
              </div>
            </motion.div>

            <motion.div
              className="floater floater-bottom"
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            >
              <div className="floater-icon light">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="floater-label">Deposit Success</p>
                <p className="floater-value">+$250.00</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">How Kolopocket works</h2>
          <p className="section-subtitle">
            Three simple steps to build better financial habits and reach your
            goals faster.
          </p>
        </div>

        <div className="steps">
          <div className="step-line" aria-hidden="true" />
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                className="step"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <div className="step-circle">
                  <span className="step-number">{step.number}</span>
                  <Icon size={36} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Everything you need to save smarter</h2>
          <p className="section-subtitle">
            Powerful features designed to help you build wealth and achieve your
            financial targets.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="feature-icon">
                  <Icon size={26} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="section">
      <div className="cta-wrap">
        <motion.div
          className="cta"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <svg
            className="cta-pattern"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>

          <div className="cta-inner">
            <h2 className="cta-title">Ready to hit your savings goals?</h2>
            <p className="cta-subtitle">
              Join thousands of users who are building better financial habits
              with Kolopocket today.
            </p>
            <button className="cta-button" onClick={() => navigate('./auth')}>
              Create your first plan
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">
                <img src={kpLogo} alt="KoloPocket logo" style={{width: 90, height: 50, background: 'transparent', objectFit: 'cover'}} />
              </div>
            </div>
            <p className="footer-tagline">
              The smart savings app that helps you build discipline, track
              progress, and achieve your financial goals.
            </p>

          </div>

          <div>
            <h4 className="footer-col-title">Product</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Features</a></li>
              <li><a href="#" className="footer-link">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Legal</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Kolopocket Inc. All rights reserved.</p>
          <span>Made with ❤️ for savers</span>
        </div>
      </div>
    </footer>
  )
}

function Landingpage() {
  return (
    <div className="landing">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default Landingpage

