import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [hearts, setHearts] = useState([])
  const [showMessage, setShowMessage] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [showSpecialMessage, setShowSpecialMessage] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hateButtonPosition, setHateButtonPosition] = useState({ x: 0, y: 0 })
  const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 })
  const [hateButtonMoved, setHateButtonMoved] = useState(false)

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
    // Create floating hearts with mobile-first approach
    const interval = setInterval(() => {
      setHearts(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * screenDimensions.width,
        y: screenDimensions.height + 50,
        size: Math.random() * 15 + 8, // Smaller hearts for mobile
        speed: Math.random() * 1.5 + 0.8, // Slower for mobile
        type: 'regular'
      }])
    }, 600) // Slower generation for mobile

    return () => clearInterval(interval)
  }, [screenDimensions])

  useEffect(() => {
    // Animate hearts
    const animation = setInterval(() => {
      setHearts(prev => prev.map(heart => ({
        ...heart,
        y: heart.y - heart.speed
      })).filter(heart => heart.y > -50))
    }, 50)

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

  const handleHateButtonHover = () => {
    // Only move on hover for desktop, not on mobile touch
    if (!isMobile) {
      moveHateButton()
    }
  }

  const handleHateButtonTouch = () => {
    // Add delay for mobile to make it more playful
    setTimeout(() => {
      moveHateButton()
    }, 300)
  }

  const moveHateButton = () => {
    // Calculate safe boundaries for mobile
    const buttonWidth = 160 // Approximate button width
    const buttonHeight = 50 // Approximate button height
    const padding = 20 // Safe padding from edges
    
    const maxX = screenDimensions.width - buttonWidth - padding
    const maxY = screenDimensions.height - buttonHeight - padding
    
    // Ensure button stays within screen bounds
    const newX = Math.max(padding, Math.min(maxX, Math.random() * maxX))
    const newY = Math.max(padding, Math.min(maxY, Math.random() * maxY))
    
    setHateButtonPosition({
      x: newX,
      y: newY
    })
    setHateButtonMoved(true)
  }

  return (
    <div className="app">
      {/* Background gradient */}
      <div className="background"></div>
      
      {/* Floating hearts */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className={`heart ${heart.type === 'big-red' ? 'big-red-heart' : ''}`}
          style={{
            left: heart.x,
            top: heart.y,
            fontSize: heart.size,
            animationDuration: `${heart.speed * 2}s`,
            transform: heart.type === 'big-red' ? `rotate(${heart.rotation}deg)` : 'none'
          }}
        >
          {heart.type === 'big-red' ? '❤️' : '💖'}
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
            
            {/* Hate Me button positioned beside love button initially */}
            <button 
              className="hate-button"
              onMouseEnter={handleHateButtonHover}
              onTouchStart={handleHateButtonTouch}
              style={{
                left: hateButtonPosition.x || 'auto',
                top: hateButtonPosition.y || 'auto',
                position: hateButtonPosition.x ? 'fixed' : 'static'
              }}
              aria-label="Hate me button"
            >
              Hate Me 😢
            </button>
          </div>
        </div>

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
