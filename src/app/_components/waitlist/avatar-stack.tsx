import Image from 'next/image';

type AvatarStackProps = {
  avatars: string[];
  size: number;
  overlap: number;
  countText: string;
  countBg: string;
  countColor: string;
  countSize: number;
  countLineHeight: number;
};

export function AvatarStack({
  avatars,
  size,
  overlap,
  countText,
  countBg,
  countColor,
  countSize,
  countLineHeight
}: AvatarStackProps) {
  return (
    <div className="flex items-center">
      {avatars.map((src, i) => (
        <span
          key={src}
          className="relative inline-block overflow-hidden rounded-full ring-2 ring-white"
          style={{
            width: size,
            height: size,
            marginLeft: i === 0 ? 0 : -overlap,
            zIndex: i
          }}
        >
          <Image src={src} alt="" width={size} height={size} className="h-full w-full object-cover" />
        </span>
      ))}
      <span
        className="inline-flex items-center justify-center rounded-full font-semibold ring-2 ring-white"
        style={{
          width: size,
          height: size,
          marginLeft: -overlap,
          backgroundColor: countBg,
          color: countColor,
          fontSize: countSize,
          lineHeight: `${countLineHeight}px`,
          zIndex: avatars.length
        }}
      >
        {countText}
      </span>
    </div>
  );
}
