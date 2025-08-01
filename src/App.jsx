import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [hearts, setHearts] = useState([])
  const [showMessage, setShowMessage] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [showSpecialMessage, setShowSpecialMessage] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 })
  const [showHateMessage, setShowHateMessage] = useState(false)

  const messages = [
    "Happy Girlfriend Day, my love! 💕",
    "You make every day feel like a celebration! ✨",
    "Thank you for being the most amazing person in my life! 🌟",
    "You're not just my girlfriend, you're my best friend! 💖",
    "Every moment with you is pure magic! 🪄",
    "You're the reason I believe in love! 💝",
    "Thank you for loving me unconditionally! 💕",
    "You're my everything! 💫"
  ]

  const specialMessages = [
    "You're the first thing I think about when I wake up",
    "And the last thing I think about before I sleep",
    "Your smile brightens my darkest days",
    "Your laugh is my favorite sound in the world",
    "You make me want to be a better person",
    "Every day with you is a new adventure",
    "You're my soulmate, my partner, my everything",
    "I love you more than words can express",
    "Happy Girlfriend Day, my beautiful angel! 💕"
  ]

  // Check if device is mobile and get screen dimensions
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setIsMobile(width <= 768)
      setScreenDimensions({ width, height })
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Create floating hearts with mobile-first approach - reduced frequency
    const interval = setInterval(() => {
      setHearts(prev => {
        // Limit total hearts to prevent performance issues
        if (prev.length >= 20) {
          return prev
        }
        return [...prev, {
          id: Date.now(),
          x: Math.random() * screenDimensions.width,
          y: screenDimensions.height + 50,
          size: Math.random() * 15 + 8, // Smaller hearts for mobile
          speed: Math.random() * 1.5 + 0.8, // Slower for mobile
          type: 'regular'
        }]
      })
    }, 1000) // Slower generation to reduce blinking

    return () => clearInterval(interval)
  }, [screenDimensions])

  useEffect(() => {
    // Animate hearts - improved performance
    const animation = setInterval(() => {
      setHearts(prev => prev.map(heart => ({
        ...heart,
        y: heart.y - heart.speed
      })).filter(heart => heart.y > -50))
    }, 100) // Slower animation for better performance

    return () => clearInterval(animation)
  }, [])

  useEffect(() => {
    // Show messages one by one - slower for mobile
    if (showMessage) {
      const interval = setInterval(() => {
        setCurrentMessage(prev => {
          if (prev < messages.length - 1) {
            return prev + 1
          } else {
            setShowSpecialMessage(true)
            return prev
          }
        })
      }, 2500) // Slower for mobile readability

      return () => clearInterval(interval)
    }
  }, [showMessage])

  useEffect(() => {
    // Start the message sequence after a delay
    const timer = setTimeout(() => {
      setShowMessage(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleLoveButtonClick = () => {
    // Create 3 big red hearts that float above - mobile optimized
    const bigRedHearts = Array.from({ length: 3 }, (_, i) => ({
      id: `big-red-${Date.now()}-${i}`,
      x: (screenDimensions.width / 4) * (i + 1) - 30, // Adjusted for mobile
      y: screenDimensions.height + 100,
      size: 60, // Consistent size for mobile
      speed: 2,
      type: 'big-red',
      rotation: Math.random() * 360
    }))
    
    setHearts(prev => [...prev, ...bigRedHearts])
  }

  const handleHateButtonClick = () => {
    // Create a burst of hearts around the button - reduced count
    const burstHearts = Array.from({ length: 8 }, (_, i) => ({
      id: `burst-${Date.now()}-${i}`,
      x: (screenDimensions.width / 2) + (Math.random() - 0.5) * 150, // Smaller spread
      y: screenDimensions.height / 2 + (Math.random() - 0.5) * 150, // Smaller spread
      size: Math.random() * 25 + 15, // Smaller sizes
      speed: Math.random() * 3 + 1.5, // Slower speed
      type: 'burst',
      rotation: Math.random() * 360,
      angle: (i / 8) * 360 // Spread in all directions
    }))
    
    setHearts(prev => [...prev, ...burstHearts])
    
    // Show the sweet message
    setShowHateMessage(true)
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowHateMessage(false)
    }, 3000)
  }

  return (
    <div className="app">
      {/* Background gradient */}
      <div className="background"></div>
      
      {/* Floating hearts */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className={`heart ${heart.type === 'big-red' ? 'big-red-heart' : ''} ${heart.type === 'burst' ? 'burst-heart' : ''}`}
          style={{
            left: heart.x,
            top: heart.y,
            fontSize: heart.size,
            animationDuration: `${heart.speed * 3}s`, // Slower animation
            transform: heart.type === 'big-red' ? `rotate(${heart.rotation}deg)` : 
                       heart.type === 'burst' ? `rotate(${heart.rotation}deg) translate(${Math.cos(heart.angle * Math.PI / 180) * 80}px, ${Math.sin(heart.angle * Math.PI / 180) * 80}px)` : 'none'
          }}
        >
          {heart.type === 'big-red' ? '❤️' : heart.type === 'burst' ? '💖' : '💖'}
        </div>
      ))}

      {/* Main content */}
      <div className="content">
        <div className="title-container">
          <h1 className="title">Happy Girlfriend Day!</h1>
          <div className="subtitle">To the most amazing person in my life</div>
        </div>

        {/* Message display */}
        {showMessage && (
          <div className="message-container">
            <div className="message">
              {messages[currentMessage]}
            </div>
          </div>
        )}

        {/* Special message sequence */}
        {showSpecialMessage && (
          <div className="special-messages">
            {specialMessages.map((msg, index) => (
              <div
                key={index}
                className="special-message"
                style={{
                  animationDelay: `${index * 2}s`
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        )}

        {/* Interactive elements - mobile first */}
        <div className="interactive-section">
          <div className="button-container">
            <button 
              className="love-button"
              onClick={handleLoveButtonClick}
              aria-label="Click for more love"
            >
              Click for more love! 💕
            </button>
            
            {/* Hate Me button - now stays in place */}
            <button 
              className="hate-button"
              onClick={handleHateButtonClick}
              aria-label="Hate me button"
            >
              Hate Me 😢
            </button>
          </div>
        </div>

        {/* Hate button message */}
        {showHateMessage && (
          <div className="hate-message">
            Can't hate me! I love you too much! 💕
          </div>
        )}

        {/* Decorative elements */}
        <div className="decorations">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">💫</div>
          <div className="sparkle sparkle-3">⭐</div>
          <div className="sparkle sparkle-4">🌟</div>
        </div>
      </div>
    </div>
  )
}

export default App
