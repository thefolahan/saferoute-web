import type { CSSProperties } from 'react';

type SpaceStar = {
  delay: number;
  duration: number;
  left: number;
  maxOpacity: number;
  minOpacity: number;
  size: number;
  top: number;
};

const stars: SpaceStar[] = Array.from({ length: 130 }, (_, index) => ({
  delay: (index * 137) % 2600,
  duration: 1300 + ((index * 173) % 2200),
  left: (index * 37 + (index % 7) * 9) % 100,
  maxOpacity: 0.42 + (index % 5) * 0.11,
  minOpacity: 0.04 + (index % 3) * 0.03,
  size: index % 11 === 0 ? 3 : index % 4 === 0 ? 2 : 1,
  top: (index * 53 + (index % 9) * 11) % 100
}));

type StarStyle = CSSProperties & {
  '--star-delay': string;
  '--star-duration': string;
  '--star-left': string;
  '--star-max-opacity': string;
  '--star-min-opacity': string;
  '--star-size': string;
  '--star-top': string;
};

export function SpaceBackground({ subtle = false }: { subtle?: boolean }) {
  const visibleStars = subtle
    ? stars.filter((_, index) => index % 2 === 0)
    : stars;

  return (
    <div className="space-background" aria-hidden="true">
      {visibleStars.map((star, index) => {
        const style: StarStyle = {
          '--star-delay': `${star.delay}ms`,
          '--star-duration': `${star.duration}ms`,
          '--star-left': `${star.left}%`,
          '--star-max-opacity': String(
            subtle ? Math.min(0.3, star.maxOpacity * 0.42) : star.maxOpacity
          ),
          '--star-min-opacity': String(subtle ? 0.03 : star.minOpacity),
          '--star-size': `${star.size}px`,
          '--star-top': `${star.top}%`
        };

        return <span className="space-background__star" key={index} style={style} />;
      })}
    </div>
  );
}
