import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function AnimatedBackground() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationFrameRef = useRef(0)

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

    particlesRef.current = Array.from({ length: 50 }, () => ({
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
      const isDark = document.documentElement.classList.contains('dark')

      particlesRef.current.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = isDark
          ? `rgba(147, 112, 219, ${particle.opacity})`
          : `rgba(88, 28, 135, ${particle.opacity})`
        ctx.fill()

        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
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

export function FloatingShapes() {
  const shapes = [
    { type: 'circle', size: 60, style: { top: '15%', left: '10%' }, delay: 0 },
    { type: 'square', size: 40, style: { top: '25%', right: '15%' }, delay: 0.5 },
    { type: 'circle', size: 30, style: { bottom: '30%', right: '10%' }, delay: 1.5 },
    { type: 'square', size: 35, style: { top: '60%', left: '5%' }, delay: 2 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {shapes.map((shape, idx) => (
        <motion.div
          key={idx}
          className="absolute opacity-[0.03]"
          style={shape.style}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.03, scale: 1, y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{
            opacity: { delay: shape.delay, duration: 0.5 },
            scale: { delay: shape.delay, duration: 0.5 },
            y: { delay: shape.delay + 1, duration: 6, repeat: Infinity },
            rotate: { delay: shape.delay + 1, duration: 20, repeat: Infinity, ease: 'linear' },
          }}
        >
          {shape.type === 'circle' && (
            <div className="rounded-full border-2 border-primary" style={{ width: shape.size, height: shape.size }} />
          )}
          {shape.type === 'square' && (
            <div className="border-2 border-primary" style={{ width: shape.size, height: shape.size }} />
          )}
        </motion.div>
      ))}
    </div>
  )
}

export function CursorGlow() {
  const glowRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
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
      className="fixed w-96 h-96 pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 opacity-20"
      style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', filter: 'blur(60px)' }}
      aria-hidden="true"
    />
  )
}
