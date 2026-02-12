import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export function PoolHeader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    const waves: Array<{
      y: number
      length: number
      amplitude: number
      frequency: number
      speed: number
      offset: number
    }> = [
      { y: 40, length: 0.015, amplitude: 15, frequency: 0.015, speed: 0.02, offset: 0 },
      { y: 50, length: 0.02, amplitude: 10, frequency: 0.01, speed: 0.015, offset: Math.PI },
      { y: 60, length: 0.01, amplitude: 8, frequency: 0.008, speed: 0.01, offset: Math.PI / 2 }
    ]

    const poolLanes = 6
    const bubbles: Array<{
      x: number
      y: number
      radius: number
      speed: number
      wobble: number
      wobbleSpeed: number
    }> = []

    for (let i = 0; i < 25; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: 60 + Math.random() * (canvas.height - 60),
        radius: 1 + Math.random() * 3,
        speed: 0.3 + Math.random() * 0.8,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03
      })
    }

    let animationFrame: number

    const animate = () => {
      const width = canvas.getBoundingClientRect().width
      const height = canvas.getBoundingClientRect().height

      ctx.clearRect(0, 0, width, height)

      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#0ea5e9')
      gradient.addColorStop(0.5, '#0284c7')
      gradient.addColorStop(1, '#0369a1')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      for (let i = 1; i < poolLanes; i++) {
        const laneX = (width / poolLanes) * i
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.lineWidth = 2
        ctx.setLineDash([10, 10])
        ctx.beginPath()
        ctx.moveTo(laneX, 0)
        ctx.lineTo(laneX, height)
        ctx.stroke()
      }
      ctx.setLineDash([])

      waves.forEach((wave) => {
        wave.offset += wave.speed
        ctx.beginPath()
        ctx.moveTo(0, wave.y)

        for (let x = 0; x < width; x++) {
          const y =
            wave.y +
            Math.sin(x * wave.length + wave.offset) * wave.amplitude +
            Math.sin(x * wave.frequency + wave.offset * 2) * (wave.amplitude * 0.5)
          ctx.lineTo(x, y)
        }

        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()

        const waveGradient = ctx.createLinearGradient(0, wave.y, 0, height)
        waveGradient.addColorStop(0, 'rgba(14, 165, 233, 0.4)')
        waveGradient.addColorStop(1, 'rgba(3, 105, 161, 0.1)')
        ctx.fillStyle = waveGradient
        ctx.fill()
      })

      bubbles.forEach((bubble) => {
        bubble.y -= bubble.speed
        bubble.wobble += bubble.wobbleSpeed
        const wobbleX = Math.sin(bubble.wobble) * 2

        if (bubble.y + bubble.radius < 0) {
          bubble.y = height + bubble.radius
          bubble.x = Math.random() * width
        }

        ctx.beginPath()
        ctx.arc(bubble.x + wobbleX, bubble.y, bubble.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(
          bubble.x + wobbleX - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.3,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.fill()
      })

      const sparkles = 8
      for (let i = 0; i < sparkles; i++) {
        const x = (width / sparkles) * i + (Date.now() / 50) % (width / sparkles)
        const y = 20 + Math.sin((Date.now() / 1000) + i) * 15
        const size = 1 + Math.sin((Date.now() / 500) + i * 0.5)

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fill()
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-32 md:h-40 relative overflow-hidden shadow-2xl"
      style={{ transformOrigin: 'top' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 2
        }}
        className="absolute top-1/2 -translate-y-1/2 w-20 h-12"
      >
        <div className="relative w-full h-full">
          <motion.div
            animate={{
              scaleX: [1, 0.9, 1],
              scaleY: [1, 1.1, 1]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full blur-sm"
          />
          <div className="absolute top-0 left-1/2 w-8 h-4 bg-sky-200/50 rounded-full -translate-x-1/2" />
          <div className="absolute top-2 left-1/2 w-6 h-3 bg-sky-300/40 rounded-full -translate-x-1/2" />
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </motion.div>
  )
}
