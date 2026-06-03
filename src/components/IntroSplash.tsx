import { useEffect, useRef, useState } from 'react';

/**
 * Full-screen intro video that plays on every app open.
 * - black bg, muted + playsinline autoplay (iOS-safe), object-fit cover, no controls
 * - Walflex logo fades in over the last ~1s
 * - on end → fade out (0.5s) → onDone() ; on error/stall → skip immediately
 */
export default function IntroSplash({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadingOut, setFadingOut] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) {
      onDone();
      return;
    }
    let done = false;
    const skip = () => {
      if (done) return;
      done = true;
      onDone();
    };
    const finish = () => {
      if (done) return;
      setFadingOut(true);
      window.setTimeout(skip, 500); // wait out the opacity transition
    };
    const onTime = () => {
      if (v.duration && isFinite(v.duration) && v.duration - v.currentTime <= 1) setShowLogo(true);
    };

    // hard fallback if metadata never loads / video stalls
    let fallback = window.setTimeout(skip, 12000);
    const onMeta = () => {
      window.clearTimeout(fallback);
      if (v.duration && isFinite(v.duration)) fallback = window.setTimeout(finish, v.duration * 1000 + 1500);
    };

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('ended', finish);
    v.addEventListener('error', skip);

    const p = v.play?.();
    if (p && typeof p.catch === 'function') p.catch(skip); // autoplay blocked → skip to app

    return () => {
      window.clearTimeout(fallback);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('ended', finish);
      v.removeEventListener('error', skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black transition-opacity duration-500"
      style={{ opacity: fadingOut ? 0 : 1 }}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 grid place-items-center pointer-events-none transition-opacity duration-700"
        style={{ opacity: showLogo ? 1 : 0 }}
      >
        <img src="/logo.svg" alt="Walflex" className="w-28 h-28 rounded-3xl shadow-2xl" />
      </div>
    </div>
  );
}
