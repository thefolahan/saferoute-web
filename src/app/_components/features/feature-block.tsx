import Image from 'next/image';

export type FeatureBlockProps = {
  eyebrow?: string;
  heading: string;
  description: string;
  phone: string;
  /** Phone mockup on the left, text on the right. */
  phoneLeft?: boolean;
  /** Block 6 uses the smaller 48/60 heading. */
  small?: boolean;
};

/**
 * Feature showcase block — Figma 491:22685 family.
 * Dark card row: 489px text column + a grow phone-mockup panel (gray-900,
 * radius 32) that clips the 397x818 phone at 80px from its top. gap 40.
 */
export function FeatureBlock({
  eyebrow,
  heading,
  description,
  phone,
  phoneLeft = false,
  small = false
}: FeatureBlockProps) {
  return (
    <div className="mx-auto max-w-[1280px] px-20 py-20">
      <div
        className={`flex items-center gap-10 ${phoneLeft ? 'flex-row-reverse' : ''}`}
      >
        {/* Text column */}
        <div className="flex w-[489px] shrink-0 flex-col items-start gap-4">
          {eyebrow ? (
            <p className="text-base font-normal text-[#0BA5EC]">{eyebrow}</p>
          ) : null}
          <h2
            className={`font-medium tracking-tightest text-gray-25 ${
              small
                ? 'text-[48px] leading-[60px]'
                : 'text-[60px] leading-[72px]'
            }`}
          >
            {heading}
          </h2>
          <p className="text-base font-normal text-gray-200">{description}</p>
        </div>

        {/* Phone panel */}
        <div className="relative flex h-[560px] flex-1 justify-center overflow-hidden rounded-[32px] bg-gray-900">
          <Image
            src={phone}
            alt=""
            width={397}
            height={818}
            className="mt-20 h-[818px] w-[397px] shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
