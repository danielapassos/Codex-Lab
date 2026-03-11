type IconProps = {
  className?: string;
};

export function SearchIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 6 18 18" strokeLinecap="round" />
      <path d="M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 17 17 7" strokeLinecap="round" />
      <path d="M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GithubIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2a10 10 0 0 0-3.162 19.488c.5.092.683-.217.683-.483 0-.237-.008-.865-.013-1.697-2.78.604-3.368-1.34-3.368-1.34-.455-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.004.07 1.533 1.03 1.533 1.03.892 1.528 2.34 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.252-4.555-1.11-4.555-4.941 0-1.091.39-1.984 1.029-2.684-.104-.253-.446-1.268.097-2.643 0 0 .84-.269 2.75 1.025A9.55 9.55 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.544 1.375.202 2.39.099 2.643.64.7 1.028 1.593 1.028 2.684 0 3.84-2.339 4.686-4.566 4.934.359.309.679.919.679 1.853 0 1.338-.012 2.418-.012 2.748 0 .268.18.58.688.481A10.002 10.002 0 0 0 12 2Z" />
    </svg>
  );
}

export function LinkedInIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56A1.94 1.94 0 0 0 5.22 3 1.97 1.97 0 0 0 3.28 4.94c0 1.06.86 1.94 1.94 1.94a1.95 1.95 0 0 0 1.94-1.94ZM20 12.72c0-3.47-1.85-5.08-4.32-5.08-1.99 0-2.88 1.09-3.38 1.85V8.5H8.94V20h3.38v-6.42c0-1.69.32-3.32 2.42-3.32 2.08 0 2.1 1.95 2.1 3.42V20H20v-7.28Z" />
    </svg>
  );
}

export function XIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1 2h6.4l4.4 5.8L18.9 2Zm-1.1 18h1.8L6.3 3.9H4.4L17.8 20Z" />
    </svg>
  );
}
