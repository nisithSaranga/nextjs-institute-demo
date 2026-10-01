"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { evidenceGallery, evidencePhotos } from "@/content/reference-pages";

// Timings/rotation come from saved source. Pause and focus handling are accessibility additions.
export function EvidenceCarousel({ triple = false }: { triple?: boolean }) {
  const count = triple ? 8 : 5;
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const indexRef = useRef(0);
  const request = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const userPaused = useRef(false);
  const reducedRef = useRef(false);
  const keyboardFocus = useRef(false);
  const hovered = useRef(false);
  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);
  const selectImage = useCallback(async (value: number) => {
    const next = (value + count) % count;
    const version = ++request.current;
    try {
      // Keep the current image(s) until the replacement has decoded.
      await Promise.all(Array.from({ length: triple ? 3 : 1 }, async (_, offset) => {
        const image = new window.Image();
        image.src = evidencePhotos[evidenceGallery[(next + offset) % count]].src;
        await image.decode();
      }));
      if (version === request.current) { indexRef.current = next; setCurrent(next); }
    } catch { /* Keep the last working selection if a photograph is unavailable. */ }
  }, [count, triple]);
  const start = useCallback((manual = false) => {
    stop();
    if (!reducedRef.current && !userPaused.current && !keyboardFocus.current && (manual || !hovered.current)) {
      timer.current = setInterval(() => { void selectImage(indexRef.current + 1); }, 5000);
    }
  }, [selectImage, stop]);
  useEffect(() => {
    setReady(true);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reducedRef.current = motion.matches; setReduced(motion.matches); start(); };
    update();
    motion.addEventListener("change", update);
    return () => { stop(); request.current++; motion.removeEventListener("change", update); };
  }, [start, stop]);
  function select(value: number) { void selectImage(value); start(true); }
  function togglePause() {
    userPaused.current = !userPaused.current;
    setPaused(userPaused.current);
    if (userPaused.current) stop(); else start(true);
  }
  return <div className={`evidence-carousel ${triple ? "equipment-carousel" : "about-carousel"}`}
    role="region" aria-roledescription="carousel" aria-label={triple ? "Illustrative equipment gallery" : "Illustrative workspace gallery"}
    onMouseEnter={() => { hovered.current = true; stop(); }}
    onMouseLeave={() => { hovered.current = false; start(); }}
    onFocusCapture={event => { if (event.target.matches(":focus-visible")) { keyboardFocus.current = true; stop(); } }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) { keyboardFocus.current = false; start(); } }}>
    <div className="evidence-slides">{triple ? [0, 1, 2].map(offset => {
      const index = (current + offset) % count;
      const photo = evidencePhotos[evidenceGallery[index]];
      return <img key={offset} src={photo.src} alt={`Illustrative: ${photo.alt}`} loading="lazy" decoding="async" style={{ objectPosition: index > 4 ? "70% center" : "center" }} />;
    }) : evidenceGallery.slice(0, count).map((key, index) => {
      const photo = evidencePhotos[key];
      return <img key={index} src={photo.src} alt={`Illustrative: ${photo.alt}`} loading="lazy" decoding="async" className={index === current ? "is-current" : ""} aria-hidden={index !== current} />;
    })}</div>
    <button hidden={!ready} type="button" className="evidence-pause" disabled={reduced} aria-pressed={paused || reduced} onClick={togglePause}>{reduced ? "Automatic advance off" : paused ? "Play gallery" : "Pause gallery"}</button>
    <button hidden={!ready} type="button" className="evidence-prev" aria-label="Previous gallery image" onClick={() => select(current - 1)}>&#8249;</button>
    <button hidden={!ready} type="button" className="evidence-next" aria-label="Next gallery image" onClick={() => select(current + 1)}>&#8250;</button>
    <div className="evidence-dots" hidden={!ready}>{Array.from({ length: count }, (_, index) => <button key={index} type="button" aria-label={`Show gallery image ${index + 1}`} aria-pressed={current === index} onClick={() => select(index)} />)}</div>
  </div>;
}
