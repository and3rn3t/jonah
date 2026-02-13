import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function PoolHeader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Track container size with ResizeObserver
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    // Initial measurement
    updateDimensions()

    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  // Run animation when we have valid dimensions
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrame: number
    let time = 0

    // Set canvas size based on measured dimensions
    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    ctx.scale(dpr, dpr)

    const width = dimensions.width
    const height = dimensions.height

    const NUM_LANES = 8

    // Color palettes that lanes cycle through
    const colorPalettes = [
      { water: [14, 165, 233], accent: [56, 189, 248] },   // Sky blue
      { water: [6, 182, 212], accent: [34, 211, 238] },    // Cyan
      { water: [20, 184, 166], accent: [45, 212, 191] },   // Teal
      { water: [59, 130, 246], accent: [96, 165, 250] },   // Blue
      { water: [99, 102, 241], accent: [129, 140, 248] },  // Indigo
      { water: [139, 92, 246], accent: [167, 139, 250] },  // Violet
      { water: [168, 85, 247], accent: [192, 132, 252] },  // Purple
      { water: [236, 72, 153], accent: [244, 114, 182] },  // Pink
    ]

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const getColorForLane = (laneIndex: number, t: number): [number, number, number] => {
      // Each lane cycles through colors at different phase offsets
      const cycleSpeed = 0.0003
      const phase = (t * cycleSpeed + laneIndex * 0.15) % 1
      const paletteIndex = Math.floor(phase * colorPalettes.length)
      const nextPaletteIndex = (paletteIndex + 1) % colorPalettes.length
      const blend = (phase * colorPalettes.length) % 1

      const current = colorPalettes[paletteIndex].water
      const next = colorPalettes[nextPaletteIndex].water

      return [
        Math.round(lerp(current[0], next[0], blend)),
        Math.round(lerp(current[1], next[1], blend)),
        Math.round(lerp(current[2], next[2], blend))
      ]
    }

    const laneWidth = width / NUM_LANES

    // Initialize bubbles
    const bubblesList: Array<{
      lane: number
      x: number
      y: number
      radius: number
      speed: number
      wobble: number
      wobbleSpeed: number
    }> = []
    for (let i = 0; i < 40; i++) {
      const lane = Math.floor(Math.random() * NUM_LANES)
      bubblesList.push({
        lane,
        x: lane * laneWidth + Math.random() * laneWidth,
        y: Math.random() * height,
        radius: 1.5 + Math.random() * 3,
        speed: 0.4 + Math.random() * 0.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.02
      })
    }

    const animate = () => {
      time++

      ctx.clearRect(0, 0, width, height)

      // Draw each swimming lane with animated color
      for (let i = 0; i < NUM_LANES; i++) {
        const laneX = i * laneWidth
        const color = getColorForLane(i, time)

        // Create gradient for water depth effect
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.85)`)
        gradient.addColorStop(0.5, `rgba(${Math.max(0, color[0] - 20)}, ${Math.max(0, color[1] - 20)}, ${Math.max(0, color[2] - 10)}, 0.9)`)
        gradient.addColorStop(1, `rgba(${Math.max(0, color[0] - 40)}, ${Math.max(0, color[1] - 40)}, ${Math.max(0, color[2] - 20)}, 0.95)`)

        ctx.fillStyle = gradient
        ctx.fillRect(laneX, 0, laneWidth, height)

        // Animated wave pattern within each lane
        const waveOffset = time * 0.03 + i * 0.5
        ctx.save()
        ctx.globalAlpha = 0.15

        for (let w = 0; w < 3; w++) {
          ctx.beginPath()
          const waveY = height * (0.2 + w * 0.3)
          ctx.moveTo(laneX, waveY)

          for (let x = 0; x <= laneWidth; x += 2) {
            const y = waveY + Math.sin((x + laneX) * 0.02 + waveOffset + w) * 8
              + Math.sin((x + laneX) * 0.01 + waveOffset * 0.7) * 4
            ctx.lineTo(laneX + x, y)
          }

          ctx.lineTo(laneX + laneWidth, height)
          ctx.lineTo(laneX, height)
          ctx.closePath()

          ctx.fillStyle = `rgba(255, 255, 255, ${0.1 - w * 0.02})`
          ctx.fill()
        }
        ctx.restore()

        // Light caustics/shimmer effect
        ctx.save()
        ctx.globalAlpha = 0.08
        const causticOffset = time * 0.02
        for (let cy = 0; cy < height; cy += 20) {
          for (let cx = 0; cx < laneWidth; cx += 20) {
            const shimmer = Math.sin((cx + laneX) * 0.1 + causticOffset) *
              Math.cos(cy * 0.1 + causticOffset * 0.8) * 0.5 + 0.5
            if (shimmer > 0.7) {
              ctx.beginPath()
              ctx.arc(laneX + cx + 10, cy + 10, 3 + shimmer * 2, 0, Math.PI * 2)
              ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
              ctx.fill()
            }
          }
        }
        ctx.restore()
      }

      // Draw lane dividers (rope lines)
      for (let i = 1; i < NUM_LANES; i++) {
        const laneX = i * laneWidth

        // Main rope
        ctx.save()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.lineWidth = 3
        ctx.beginPath()

        for (let y = 0; y < height; y += 2) {
          const wobble = Math.sin(y * 0.05 + time * 0.02) * 1.5
          if (y === 0) {
            ctx.moveTo(laneX + wobble, y)
          } else {
            ctx.lineTo(laneX + wobble, y)
          }
        }
        ctx.stroke()

        // Colored float markers on the rope
        const floatSpacing = 15
        const floatColors = ['#ef4444', '#ffffff', '#3b82f6', '#ffffff']
        for (let y = floatSpacing / 2; y < height; y += floatSpacing) {
          const wobble = Math.sin(y * 0.05 + time * 0.02) * 1.5
          const colorIndex = Math.floor(y / floatSpacing) % floatColors.length
          ctx.fillStyle = floatColors[colorIndex]
          ctx.beginPath()
          ctx.arc(laneX + wobble, y, 4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      // Draw and animate bubbles
      bubblesList.forEach((bubble) => {
        bubble.y -= bubble.speed
        bubble.wobble += bubble.wobbleSpeed
        const wobbleX = Math.sin(bubble.wobble) * 3

        if (bubble.y + bubble.radius < 0) {
          bubble.y = height + bubble.radius + Math.random() * 20
          const laneX = bubble.lane * laneWidth
          bubble.x = laneX + Math.random() * laneWidth
        }

        ctx.beginPath()
        ctx.arc(bubble.x + wobbleX, bubble.y, bubble.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
        ctx.fill()

        // Bubble highlight
        ctx.beginPath()
        ctx.arc(
          bubble.x + wobbleX - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.35,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fill()
      })

      // Surface sparkles
      ctx.save()
      const numSparkles = 12
      for (let i = 0; i < numSparkles; i++) {
        const sparkleX = ((time * 0.5 + i * (width / numSparkles)) % width)
        const sparkleY = 10 + Math.sin(time * 0.05 + i) * 8
        const sparkleSize = 1.5 + Math.sin(time * 0.1 + i * 0.7) * 1

        ctx.beginPath()
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fill()
      }
      ctx.restore()

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [dimensions])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-32 md:h-40 relative overflow-hidden shadow-2xl rounded-b-lg"
      style={{ transformOrigin: 'top' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block', width: dimensions.width, height: dimensions.height }}
      />

      {/* Pool edge effect */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-b from-slate-400 to-slate-500 shadow-md" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-t from-white/30 to-transparent" />
    </motion.div>
  )
}
