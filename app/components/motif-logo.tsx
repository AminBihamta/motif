import Image from "next/image";

type MotifLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function MotifLogo({
  className = "h-7 w-auto sm:h-8",
  priority = false,
}: MotifLogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Motif"
      width={484}
      height={150}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
