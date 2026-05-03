'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const particleCount = 50
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get computed style for primary color
      const computedStyle = getComputedStyle(document.documentElement)
      const isDark = document.documentElement.classList.contains('dark')
      
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = isDark 
          ? `rgba(147, 112, 219, ${particle.opacity})`
          : `rgba(88, 28, 135, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = isDark
              ? `rgba(147, 112, 219, ${0.1 * (1 - distance / 150)})`
              : `rgba(88, 28, 135, ${0.08 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  )
}

// Floating geometric shapes for decoration
export function FloatingShapes() {
  const shapes = [
    { type: 'circle', size: 60, top: '15%', left: '10%', delay: 0 },
    { type: 'square', size: 40, top: '25%', right: '15%', delay: 0.5 },
    { type: 'triangle', size: 50, bottom: '20%', left: '20%', delay: 1 },
    { type: 'circle', size: 30, bottom: '30%', right: '10%', delay: 1.5 },
    { type: 'square', size: 35, top: '60%', left: '5%', delay: 2 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {shapes.map((shape, idx) => (
        <motion.div
          key={idx}
          className="absolute opacity-[0.03]"
          style={{
            top: shape.top,
            bottom: shape.bottom,
            left: shape.left,
            right: shape.right,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.03, 
            scale: 1,
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            opacity: { delay: shape.delay, duration: 1 },
            scale: { delay: shape.delay, duration: 1 },
            y: { delay: shape.delay + 1, duration: 8, repeat: Infinity },
            rotate: { delay: shape.delay + 1, duration: 20, repeat: Infinity, ease: 'linear' },
          }}
        >
          {shape.type === 'circle' && (
            <div 
              className="rounded-full border-2 border-primary"
              style={{ width: shape.size, height: shape.size }}
            />
          )}
          {shape.type === 'square' && (
            <div 
              className="border-2 border-primary"
              style={{ width: shape.size, height: shape.size }}
            />
          )}
          {shape.type === 'triangle' && (
            <div
              className="border-l-2 border-b-2 border-primary"
              style={{ 
                width: 0, 
                height: 0, 
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid currentColor`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Gradient orbs that follow cursor
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={glowRef}
      className="fixed w-96 h-96 pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 opacity-20 transition-opacity duration-300"
      style={{
        background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }}
      aria-hidden="true"
    />
  )
}
