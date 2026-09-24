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

const buttonClassName =
  "inline-flex cursor-pointer items-center justify-center rounded-lg bg-accent px-5 py-2 text-black shadow-lg";

export default function MagicButton({
  children,
  className = "",
  href,
  ...props
}: MagicButtonProps) {
  const combinedClassName = `${buttonClassName} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={combinedClassName}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
