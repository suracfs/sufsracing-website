import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type MagicButtonProps = BaseProps &
  (
    | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
    | (AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string })
  );

const buttonClassName = `
  magic-button
  relative
  inline-flex
  h-11
  min-w-[128px]
  cursor-pointer
  items-center
  justify-center
  overflow-hidden
  border
  border-white/30
  bg-white/15
  px-4
  text-[11px]
  font-semibold
  uppercase
  tracking-wide
  text-black
  backdrop-blur-md
  shadow-[0_8px_30px_rgba(0,0,0,0.15)]
  transition-all
  duration-300
  ease-[cubic-bezier(0.16,1,0.3,1)]
  hover:-translate-y-1
  hover:scale-[1.04]
  hover:border-white/50
  hover:bg-white/25
  hover:shadow-[0_15px_35px_rgba(0,0,0,0.25)]
  active:translate-y-0
  active:scale-[0.96]
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-white/60
`;

export default function MagicButton({
  children,
  className = "",
  href,
  ...props
}: MagicButtonProps) {
  const combinedClassName = `${buttonClassName} ${className}`;

  const content = (
    <>
      {/* Sweeping hover highlight */}
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/40
          to-transparent
          transition-transform
          duration-700
          ease-out
          group-hover:translate-x-full
        "
      />

      {/* Inner glass glow */}
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-0
          shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      <span className="relative z-10 text-black">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`group ${combinedClassName}`}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={`group ${combinedClassName}`}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}