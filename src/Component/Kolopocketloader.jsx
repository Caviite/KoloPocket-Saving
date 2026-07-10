import React from 'react'
import { motion } from 'framer-motion'
import './Kolopocketloader.css'

export function Loader({ caption = "Processing" }) {
  return (
    <motion.div
      className="kp-loader-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-live="polite"
    >
      <div className="kp-loader-card">
        <div className="kp-spinner-wrapper">
          {/* Sleek Minimalist Spinner Ring */}
          <div className="kp-sleek-spinner"></div>
          
          {/* Centered Digital Wallet Icon */}
          <div className="kp-center-wallet">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#16a34a" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
              <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
              <circle cx="16" cy="14" r="1.5" fill="#16a34a" />
            </svg>
          </div>
        </div>

        {/* Sleek lowercase/uppercase tracking caption text */}
        <p className="kp-loader-caption">
          {caption}
          <span className="kp-loader-dots">
            <span></span><span></span><span></span>
          </span>
        </p>
      </div>
    </motion.div>
  )
}