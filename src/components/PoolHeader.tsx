import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Sun, Moon, CloudSun, SunHorizon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

export function PoolHeader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [timeOfDay, setTimeOfDay] = useState(0)

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
    let cycleTime = 0

    const getColorForTime = (time: number) => {
      const normalizedTime = time % 1
      
      if (normalizedTime < 0.25) {
        const t = normalizedTime / 0.25
        return {
          top: interpolateColor('#0ea5e9', '#a855f7', t),
          mid: interpolateColor('#0284c7', '#9333ea', t),
          bottom: interpolateColor('#0369a1', '#7e22ce', t),
          waveTop: 'rgba(168, 85, 247, 0.4)',
          waveBottom: 'rgba(126, 34, 206, 0.1)',
          bubbleColor: 'rgba(255, 255, 255, 0.4)',
          sparkleColor: 'rgba(255, 255, 255, 0.8)',
          phase: 'day-to-sunset'
        }
      } else if (normalizedTime < 0.5) {
        const t = (normalizedTime - 0.25) / 0.25
        return {
          top: interpolateColor('#a855f7', '#1e3a8a', t),
          mid: interpolateColor('#9333ea', '#1e40af', t),
          bottom: interpolateColor('#7e22ce', '#1e1b4b', t),
          waveTop: `rgba(${lerp(168, 30, t)}, ${lerp(85, 64, t)}, ${lerp(247, 175, t)}, 0.4)`,
          waveBottom: `rgba(${lerp(126, 30, t)}, ${lerp(34, 27, t)}, ${lerp(206, 75, t)}, 0.1)`,
          bubbleColor: 'rgba(255, 255, 255, 0.3)',
          sparkleColor: `rgba(255, 255, ${lerp(255, 200, t)}, ${lerp(0.8, 0.6, t)})`,
          phase: 'sunset-to-night'
        }
      } else if (normalizedTime < 0.75) {
        const t = (normalizedTime - 0.5) / 0.25
        return {
          top: interpolateColor('#1e3a8a', '#0ea5e9', t),
          mid: interpolateColor('#1e40af', '#0284c7', t),
          bottom: interpolateColor('#1e1b4b', '#0369a1', t),
          waveTop: `rgba(${lerp(30, 14, t)}, ${lerp(64, 165, t)}, ${lerp(175, 233, t)}, 0.4)`,
          waveBottom: `rgba(${lerp(30, 3, t)}, ${lerp(27, 105, t)}, ${lerp(75, 161, t)}, 0.1)`,
          bubbleColor: 'rgba(255, 255, 255, 0.35)',
          sparkleColor: `rgba(255, 255, ${lerp(200, 255, t)}, ${lerp(0.6, 0.7, t)})`,
          phase: 'night-to-dawn'
        }
      } else {
        const t = (normalizedTime - 0.75) / 0.25
        return {
          top: interpolateColor('#0ea5e9', '#0ea5e9', t),
          mid: interpolateColor('#0284c7', '#0284c7', t),
          bottom: interpolateColor('#0369a1', '#0369a1', t),
          waveTop: 'rgba(14, 165, 233, 0.4)',
          waveBottom: 'rgba(3, 105, 161, 0.1)',
          bubbleColor: 'rgba(255, 255, 255, 0.4)',
          sparkleColor: 'rgba(255, 255, 255, 0.8)',
          phase: 'dawn-to-day'
        }
      }
    }

    const interpolateColor = (color1: string, color2: string, t: number): string => {
      const hex1 = color1.replace('#', '')
      const hex2 = color2.replace('#', '')
      
      const r1 = parseInt(hex1.substring(0, 2), 16)
      const g1 = parseInt(hex1.substring(2, 4), 16)
      const b1 = parseInt(hex1.substring(4, 6), 16)
      
      const r2 = parseInt(hex2.substring(0, 2), 16)
      const g2 = parseInt(hex2.substring(2, 4), 16)
      const b2 = parseInt(hex2.substring(4, 6), 16)
      
      const r = Math.round(r1 + (r2 - r1) * t)
      const g = Math.round(g1 + (g2 - g1) * t)
      const b = Math.round(b1 + (b2 - b1) * t)
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }

    const lerp = (a: number, b: number, t: number): number => {
      return a + (a - b) * t
    }

    const animate = () => {
      const width = canvas.getBoundingClientRect().width
      const height = canvas.getBoundingClientRect().height

      cycleTime += 0.0002
      const colors = getColorForTime(cycleTime)
      setTimeOfDay(cycleTime % 1)

      ctx.clearRect(0, 0, width, height)

      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, colors.top)
      gradient.addColorStop(0.5, colors.mid)
      gradient.addColorStop(1, colors.bottom)
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
        waveGradient.addColorStop(0, colors.waveTop)
        waveGradient.addColorStop(1, colors.waveBottom)
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
        ctx.fillStyle = colors.bubbleColor
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
        ctx.fillStyle = colors.sparkleColor
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

  const getPhaseInfo = (time: number) => {
    const normalizedTime = time % 1
    
    if (normalizedTime < 0.25) {
      return { icon: SunHorizon, label: 'Sunset', color: 'bg-purple-500/90 text-white' }
    } else if (normalizedTime < 0.5) {
      return { icon: Moon, label: 'Night', color: 'bg-indigo-900/90 text-white' }
    } else if (normalizedTime < 0.75) {
      return { icon: CloudSun, label: 'Dawn', color: 'bg-blue-400/90 text-white' }
    } else {
      return { icon: Sun, label: 'Day', color: 'bg-sky-500/90 text-white' }
    }
  }

  const phaseInfo = getPhaseInfo(timeOfDay)
  const PhaseIcon = phaseInfo.icon

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
      
      <Badge className={`absolute top-4 right-4 ${phaseInfo.color} border-0 shadow-lg flex items-center gap-2 px-3 py-1.5`}>
        <PhaseIcon size={16} weight="fill" />
        <span className="text-sm font-semibold">{phaseInfo.label}</span>
      </Badge>
      
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
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent rounded-full blur-sm"
          />
          <div className="absolute top-0 left-1/2 w-8 h-4 bg-sky-200/50 rounded-full -translate-x-1/2" />
          <div className="absolute top-2 left-1/2 w-6 h-3 bg-sky-300/40 rounded-full -translate-x-1/2" />
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent" />
    </motion.div>
  )
}
