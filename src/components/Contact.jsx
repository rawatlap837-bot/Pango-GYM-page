import { useEffect, useState } from 'react'
import { content } from '../content'
import Button from './Button'

const confirmations = [
  'Instant confirmation after payment',
  'Joining details sent on WhatsApp & email',
  'Your seat is reserved once payment is complete',
]

const VIDEO_URL = 'https://vimeo.com/1246793875'
const VIDEO_THUMBNAIL_URL = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(VIDEO_URL)}&width=1280`

const css = `
.offer-section .offer-content {
  position: relative;
  z-index: 1;
  max-width: 520px;
  margin: 0 auto;
}
.offer-section .offer-orbit {
  pointer-events: none;
}
.offer-section .offer-heading {
  margin: 0 auto 24px;
  text-align: center;
  text-wrap: balance;
}
.offer-section .offer-box {
  margin-top: 0;
}
.offer-section .offer-video {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0 0 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 14px;
  background: #160d20;
  box-shadow: 0 12px 32px rgba(0,0,0,.22);
}
.offer-section .offer-video-play {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  cursor: pointer;
  background-color: #160d20;
  background-image: linear-gradient(180deg, rgba(10,4,30,.05), rgba(10,4,30,.35)), var(--offer-video-thumbnail);
  background-position: center;
  background-size: cover;
}
.offer-section .offer-video-play-icon {
  display: grid;
  place-items: center;
  width: clamp(56px, 9vw, 84px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: #f2c92b;
  color: #1a0b3d;
  box-shadow: 0 10px 30px rgba(0,0,0,.45);
}
.offer-section .offer-video-play-icon svg { width: 44%; height: 44%; }
.offer-section .offer-video iframe {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

/* Bigger date / bonus lines */
.offer-section .offer-box ul.offer-details {
  display: grid;
  gap: 12px;
  margin: 18px 0 20px;
  padding: 0;
  list-style: none;
}
.offer-section .offer-box ul.offer-details li {
  font-size: clamp(16px, 4.6vw, 19px);
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0;
  text-align: left;
}

/* Confirmation texts */
.offer-section .offer-box ul.offer-confirm {
  display: grid;
  gap: 10px;
  margin: 0 0 22px;
  padding: 16px 0 0;
  list-style: none;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}
.offer-section .offer-box ul.offer-confirm li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: clamp(14px, 4vw, 16px);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
  text-align: left;
}
.offer-section .offer-confirm-icon {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border-radius: 50%;
  background: #f1c935;
  color: #2b1836;
  font-size: 12px;
  font-weight: 900;
  flex-shrink: 0;
}

/* Highlighted redirect notice */
.offer-section .offer-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin: 22px auto 0;
  padding: 14px 20px;
  border-radius: 16px;
  background: #f1c935;
  color: #2b1836;
  font-size: clamp(13px, 3.6vw, 15px);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: 0.01em;
  text-align: center;
  text-wrap: balance;
  box-shadow: 0 10px 32px rgba(241, 201, 53, 0.35);
  animation: offerRedirectPulse 2.2s ease-in-out infinite;
}
.offer-section .offer-redirect-icon {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2b1836;
  color: #f1c935;
  font-size: 13px;
  font-weight: 900;
  flex-shrink: 0;
}
.offer-section .offer-redirect strong {
  font-weight: 900;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

@keyframes offerRedirectPulse {
  0%, 100% { box-shadow: 0 10px 32px rgba(241, 201, 53, 0.35); }
  50%      { box-shadow: 0 10px 40px rgba(241, 201, 53, 0.65); }
}
@media (prefers-reduced-motion: reduce) {
  .offer-section .offer-redirect { animation: none; }
}
`

export default function Contact() {
  const { price, date, bonus, reassurance } = content.offer
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoThumbnail, setVideoThumbnail] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetch(VIDEO_THUMBNAIL_URL, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.thumbnail_url) setVideoThumbnail(data.thumbnail_url)
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  return (
    <section id="register" className="offer-section section-pad">
      <style>{css}</style>
      <div className="offer-orbit offer-orbit-one" aria-hidden="true" />
      <div className="offer-orbit offer-orbit-two" aria-hidden="true" />

      <div className="site-width offer-content">
        <h2 className="offer-heading">Confirm Your Booking Payment</h2>

        <div className="offer-video">
          {isVideoPlaying ? (
            <iframe
              src="https://player.vimeo.com/video/1246793875?autopause=0&amp;player_id=0&amp;app_id=58479&autoplay=1"
              title="Pango-Authority-Reel-FINAL"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              playsInline
            />
          ) : (
            <button
              className="offer-video-play"
              type="button"
              onClick={() => setIsVideoPlaying(true)}
              aria-label="Play Pango Authority video"
              style={videoThumbnail ? { '--offer-video-thumbnail': `url("${videoThumbnail}")` } : undefined}
            >
              <span className="offer-video-play-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="8 5 8 19 19 12" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            </button>
          )}
        </div>

        <div className="offer-box">
          <div className="offer-box-top">
            <span>WORKSHOP ACCESS</span>
            <strong>{price}</strong>
          </div>

          <ul className="offer-details">
            <li>{date}</li>
            <li>{bonus}</li>
          </ul>

          <ul className="offer-confirm">
            {confirmations.map((item) => (
              <li key={item}>
                <span className="offer-confirm-icon" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button href={content.offer.linkPlaceholder}>
            {content.cta.label}<span aria-hidden="true">↗</span>
          </Button>
          {reassurance && <p className="offer-reassurance">{reassurance}</p>}
        </div>

        <p className="offer-redirect">
          <span className="offer-redirect-icon" aria-hidden="true">↗</span>
          <span>
            You’ll be redirected to the <strong>Workshop Registration Page</strong>
          </span>
        </p>
      </div>
    </section>
  )
}
