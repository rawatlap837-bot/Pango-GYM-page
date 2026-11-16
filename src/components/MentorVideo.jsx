import { useEffect, useState } from 'react'
import { content } from '../content'

const VIDEO_URL = 'https://vimeo.com/1246793875'
const VIDEO_THUMBNAIL_URL = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(VIDEO_URL)}&width=1280`

const css = `
.mentor-video {
  position: relative;
  width: min(100%, 520px);
  min-width: 0;
  aspect-ratio: 16 / 9;
  margin-bottom: 24px;
  overflow: hidden;
  border: 1px solid #e5d4fb;
  border-radius: 18px;
  background: #160d20;
  box-shadow: 0 12px 32px rgba(75, 16, 160, .14);
}
.mentor-video-play {
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
  background-image: linear-gradient(180deg, rgba(10,4,30,.05), rgba(10,4,30,.35)), var(--mentor-video-thumbnail);
  background-position: center;
  background-size: cover;
}
.mentor-video-play:focus-visible {
  outline: 3px solid #f1c935;
  outline-offset: -5px;
}
.mentor-video-play-icon {
  display: grid;
  place-items: center;
  width: clamp(56px, 9vw, 76px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: #f2c92b;
  color: #1a0b3d;
  box-shadow: 0 10px 30px rgba(0,0,0,.45);
}
.mentor-video-play-icon svg { width: 44%; height: 44%; }
.mentor-video iframe {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
@media (max-width: 640px) {
  .mentor-video { margin-bottom: 22px; border-radius: 14px; }
}
`

export default function MentorVideo() {
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
    <>
      <style>{css}</style>
      <div className="mentor-video">
        {isVideoPlaying ? (
          <iframe
            src="https://player.vimeo.com/video/1246793875?autopause=0&player_id=0&app_id=58479&autoplay=1"
            title={`${content.about.title} - Meet Your Gym Growth Mentor`}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            className="mentor-video-play"
            type="button"
            onClick={() => setIsVideoPlaying(true)}
            aria-label={`Play ${content.about.title}'s introduction`}
            style={videoThumbnail ? { '--mentor-video-thumbnail': `url("${videoThumbnail}")` } : undefined}
          >
            <span className="mentor-video-play-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="8 5 8 19 19 12" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </>
  )
}
