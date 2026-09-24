"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type PostcardsProps = {
  images?: string[];
};

const defaultImages = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  "image4.jpg",
  "image5.jpg",
];

export default function Postcards({
  images = defaultImages,
}: PostcardsProps) {
  const [page, setPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Number of postcards shown on each page
  const cardsPerPage = 6;

  // Automatically move to the next page every 20 seconds
  const autoAdvanceTime = 20000;

  const totalPages = Math.ceil(images.length / cardsPerPage);

  const visibleImages = useMemo(() => {
    const start = page * cardsPerPage;

    return images.slice(start, start + cardsPerPage);
  }, [images, page]);

  /*
   * Change page with a small fade/slide animation.
   */
  const changePage = (newPage: number) => {
    if (newPage === page || isAnimating || totalPages <= 1) {
      return;
    }

    setIsAnimating(true);

    setTimeout(() => {
      setPage(newPage);

      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 250);
  };

  /*
   * Automatically advance to the next page.
   */
  useEffect(() => {
    if (totalPages <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setPage((currentPage) =>
        currentPage < totalPages - 1 ? currentPage + 1 : 0
      );
    }, autoAdvanceTime);

    return () => clearInterval(timer);
  }, [totalPages]);

  /*
   * Keep page valid if the images prop changes.
   */
  useEffect(() => {
    if (page >= totalPages) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  return (
    <section className="postcards">
      <div className="postcards__viewport">
        <div
          className={`postcards__grid ${
            isAnimating ? "postcards__grid--animating" : ""
          }`}
        >
          {visibleImages.map((image, index) => {
            // Slightly different rotation for each postcard.
            const rotations = [-4, 2, -2, 3, -3, 1, -1];

            const globalIndex = page * cardsPerPage + index;

            const rotation =
              rotations[globalIndex % rotations.length];

            return (
              <div
                key={`${image}-${globalIndex}`}
                className="postcard"
                style={
                  {
                    "--rotation": `${rotation}deg`,
                  } as React.CSSProperties
                }
              >
                <div 
                    className="postcard__image"
                    onContextMenu={(e) => e.preventDefault()}
                >
                  <Image
                    src={`/fsg/${image}`}
                    alt={`Gallery image ${globalIndex + 1}`}
                    draggable={false}
                    fill
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 30vw, 220px"
                    priority={globalIndex < 5}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page dots */}
      {totalPages > 1 && (
        <div className="postcards__dots" aria-label="Gallery pages">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to page ${index + 1}`}
              aria-current={page === index ? "page" : undefined}
              className={`postcards__dot ${
                page === index ? "postcards__dot--active" : ""
              }`}
              onClick={() => changePage(index)}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .postcards {
          width: 100%;
          padding: 3rem 1rem;
          overflow: hidden;
        }

        .postcards__viewport {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          overflow: visible;
        }

        .postcards__grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 2rem;

          align-items: center;
          justify-items: center;

          padding: 3rem 1rem;

          opacity: 1;
          transform: translateX(0);

          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        /*
         * Page transition.
         */
        .postcards__grid--animating {
          opacity: 0;
          transform: translateX(-25px);
        }

        .postcard {
          --rotation: 0deg;

          position: relative;

          width: 100%;
          max-width: 210px;

          padding: 10px;

          background: #fff;

          border-radius: 2px;

          box-shadow:
            0 10px 20px rgba(0, 0, 0, 0.12),
            0 3px 6px rgba(0, 0, 0, 0.08);

          transform:
            rotate(var(--rotation))
            scale(1);

          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s ease;

          cursor: pointer;

          z-index: 1;
        }

        /*
         * Hover effect.
         */
        .postcard:hover {
          transform:
            rotate(0deg)
            scale(1.15)
            translateY(-12px);

          box-shadow:
            0 30px 60px rgba(0, 0, 0, 0.25),
            0 10px 20px rgba(0, 0, 0, 0.15);

          z-index: 20;
        }

        .postcard__image {
          position: relative;

          width: 100%;

          aspect-ratio: 4 / 3;

          overflow: hidden;

          background: #eee;
        }

        .postcard__image :global(img) {
          object-fit: cover;

          transition:
            transform 0.45s ease;
        }

        .postcard:hover .postcard__image :global(img) {
          transform: scale(1.04);
        }

        /*
         * Page navigation dots.
         */
        .postcards__dots {
          display: flex;
          justify-content: center;
          align-items: center;

          gap: 9px;

          margin-top: 0.5rem;
        }

        .postcards__dot {
          width: 9px;
          height: 9px;

          padding: 0;

          border: none;
          border-radius: 50%;

          background: rgba(0, 0, 0, 0.25);

          cursor: pointer;

          transition:
            transform 0.25s ease,
            background 0.25s ease,
            opacity 0.25s ease;
        }

        .postcards__dot:hover {
          transform: scale(1.4);

          background: rgba(0, 0, 0, 0.5);
        }

        .postcards__dot--active {
          transform: scale(1.35);

          background: rgba(0, 0, 0, 0.75);
        }

        /*
         * Tablet
         */
        @media (max-width: 1000px) {
          .postcards__grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        /*
         * Mobile
         */
        @media (max-width: 650px) {
          .postcards {
            padding: 2rem 0.5rem;
          }

          .postcards__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));

            gap: 1.5rem;

            padding: 2rem 0.5rem;
          }

          .postcard {
            max-width: 180px;
          }

          .postcard:hover {
            transform:
              rotate(0deg)
              scale(1.08)
              translateY(-8px);
          }
        }

        /*
         * Small phones
         */
        @media (max-width: 420px) {
          .postcards__grid {
            grid-template-columns: 1fr;
          }

          .postcard {
            max-width: 240px;
          }
        }

        /*
         * Respect users who prefer reduced motion.
         */
        @media (prefers-reduced-motion: reduce) {
          .postcards__grid,
          .postcard,
          .postcards__dot,
          .postcard__image :global(img) {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}