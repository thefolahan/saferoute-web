/**
 * A two-series line chart drawn from real numbers.
 *
 * Replaces the exported `ActivityChart`, which was one fixed path 1010px wide:
 * the same curve regardless of what the axis labels underneath it said, and it
 * peaked at 80K on a dataset whose largest day was single digits.
 *
 * Deliberately plain SVG rather than a charting library — two polylines and a
 * gradient do not justify a dependency, and the surrounding grid, ticks and
 * labels are already the design's own markup.
 */
export type Series = { label: string; color: string; values: number[] };

export function LineChart({
  series,
  width = 560,
  height = 142,
  ticks = 5
}: {
  series: Series[];
  width?: number;
  height?: number;
  /** Horizontal grid lines, matching the rows the design draws. */
  ticks?: number;
}) {
  const length = Math.max(...series.map((s) => s.values.length), 0);

  if (length < 2) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-sm leading-5 text-gray-500"
      >
        Not enough days of activity to draw a line yet.
      </div>
    );
  }

  // A single shared scale, so the two lines can be read against each other.
  const peak = Math.max(1, ...series.flatMap((s) => s.values));
  const top = niceCeiling(peak);
  const step = width / (length - 1);

  const pointsFor = (values: number[]) =>
    values.map((value, index) => {
      const x = index * step;
      const y = height - (value / top) * height;
      return [x, y] as const;
    });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      role="img"
      aria-label={series
        .map((s) => `${s.label}: ${s.values.join(', ')}`)
        .join('; ')}
    >
      {Array.from({ length: ticks }, (_, index) => {
        const y = (height / (ticks - 1)) * index;
        return (
          <line
            key={index}
            x1={0}
            x2={width}
            y1={y}
            y2={y}
            stroke="#EEEEEE"
            strokeWidth={1}
          />
        );
      })}

      {series.map((s) => {
        const coords = pointsFor(s.values);
        const line = coords
          .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
          .join(' ');
        const gid = `fill-${s.label.replace(/[^a-zA-Z0-9]/g, '')}`;

        return (
          <g key={s.label}>
            <path
              d={`${line} L${width} ${height} L0 ${height} Z`}
              fill={`url(#${gid})`}
            />
            <path
              d={line}
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
                <stop stopColor={s.color} stopOpacity="0.18" />
                <stop offset="1" stopColor={s.color} stopOpacity="0.01" />
              </linearGradient>
            </defs>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Round the axis top up to something a person would choose — 1, 2, 5, 10, 20,
 * 50 and so on — so the gridline labels are readable numbers rather than the
 * exact peak.
 */
export function niceCeiling(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalised = value / magnitude;
  const rounded = normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10;
  return rounded * magnitude;
}

/** The axis labels for a chart topping out at `top`, highest first. */
export function axisTicks(top: number, count = 5): string[] {
  return Array.from({ length: count }, (_, index) => {
    const value = (top / (count - 1)) * (count - 1 - index);
    return value >= 1000
      ? `${Math.round(value / 100) / 10}K`
      : String(Math.round(value));
  });
}
