"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { heroSlides } from "@/content/hero-slides";
import { Arrow } from "./icons";

// Text arrives as Server Component children. Only background selection needs JS.
export function HeroCarousel({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const requested = useRef(0);
  const version = useRef(0);

  useEffect(() => {
    setReady(true);
    return () => {
      version.current += 1;
    };
  }, []);

  async function select(index: number) {
    requested.current = index;
    const selection = ++version.current;
    const image = images.current[index];
    if (!image) return;
    try {
      // Retain the previous photo until the next one is downloaded AND decoded.
      // The latest request wins if a visitor moves quickly across the dots.
      await image.decode();
      if (selection === version.current) setActive(index);
    } catch {
      // A failed image must not replace the last working background.
      if (selection === version.current) requested.current = active;
    }
  }

  function step(direction: number) {
    void select(
      (requested.current + direction + heroSlides.length) % heroSlides.length,
    );
  }

  return (
    <section
      className="home-hero"
      aria-labelledby="page-title"
      onFocusCapture={(event) => {
        // Keyboard focus must never land on fading controls. Keep the entrance
        // cancelled for this visit even after focus moves out of the copy.
        const copy = (event.target as HTMLElement).closest<HTMLElement>(
          ".hero-copy",
        );
        if (copy) copy.style.animation = "none";
      }}
    >
      <div className="hero-backgrounds" aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <Image
            key={slide.image}
            ref={(element) => {
              images.current[index] = element;
            }}
            src={slide.image}
            alt=""
            fill
            sizes="100vw"
            preload={index === 0}
            loading={index === 0 ? undefined : "eager"}
            fetchPriority={index === 0 ? undefined : "low"}
            className={`hero-background${index === active ? " is-active" : ""}`}
            style={
              {
                "--hero-position": slide.position,
                "--hero-mobile-position": slide.mobilePosition,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-layout">
        {children}
        <div className="hero-controls-row">
          <div
            className="hero-controls"
            role="group"
            aria-label="Hero background controls"
            hidden={!ready}
          >
            <button
              type="button"
              className="hero-arrow"
              onClick={() => step(-1)}
              aria-label="Previous background image"
            >
              <Arrow direction="left" />
            </button>
            <div className="hero-dots">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  className="hero-dot"
                  aria-label={`Show ${slide.label.toLowerCase()} background`}
                  aria-pressed={index === active}
                  onClick={() => void select(index)}
                  onPointerEnter={(event) => {
                    if (
                      event.pointerType === "mouse" &&
                      matchMedia("(hover: hover) and (pointer: fine)").matches
                    ) {
                      void select(index);
                    }
                  }}
                >
                  <span aria-hidden="true" />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="hero-arrow"
              onClick={() => step(1)}
              aria-label="Next background image"
            >
              <Arrow />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
