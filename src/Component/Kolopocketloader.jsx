
import React from 'react'
import { motion } from 'framer-motion'
import './Kolopocketloader.css'

export function Loader({caption = "Loading"}) {
  return (
    <motion.div
      className="kp-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Ambient radial glow behind the symbol */}
      <div className="kp-loader__glow" aria-hidden="true" />

      <div className="kp-loader__stage">
        <svg
          className="kp-loader__infinity"
          viewBox="0 0 200 120"
          width="240"
          height="140"
          aria-hidden="true"
        >
          <defs>
            {/* Strong outer glow for the traveling light */}
            <filter id="kp-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Bright-to-fade gradient along the lit segment */}
            <linearGradient id="kp-light" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0" />
              <stop offset="40%" stopColor="#22c55e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Dim base loop (the unlit infinity) */}
          <path
            d="M 30 60 C 30 30, 70 30, 100 60 C 130 90, 170 90, 170 60 C 170 30, 130 30, 100 60 C 70 90, 30 90, 30 60 Z"
            fill="none"
            stroke="#16a34a"
            strokeOpacity="0.12"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
          />

          {/* Outer faint glow trail */}
          <path
            className="kp-loader__trail"
            d="M 30 60 C 30 30, 70 30, 100 60 C 130 90, 170 90, 170 60 C 170 30, 130 30, 100 60 C 70 90, 30 90, 30 60 Z"
            fill="none"
            stroke="#22c55e"
            strokeOpacity="0.5"
            strokeWidth="8"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="0.28 0.72"
          />

          {/* Bright traveling light */}
          <path
            className="kp-loader__light"
            d="M 30 60 C 30 30, 70 30, 100 60 C 130 90, 170 90, 170 60 C 170 30, 130 30, 100 60 C 70 90, 30 90, 30 60 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="0.15 0.85"
            filter="url(#kp-glow)"
          />
        </svg>
      </div>

      <motion.p
        className="kp-loader__text"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {caption}
        <span className="kp-loader__dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </motion.p>
    </motion.div>
  )
}



