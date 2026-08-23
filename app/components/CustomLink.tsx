
import Link from "next/link";

interface LinkProps {
  theme: string;
  label: string;
  icon: React.ComponentType;
  link: string;
}


export default function CustomLink({theme, label, icon: Icon, link}: LinkProps) {
    return (
      <Link
        className={`border px-4 py-2 rounded-lg text-sm hover:text-motif-charcoal hover:bg-motif-ivory flex flex-row gap-1 justify-center items-center transition-colors duration-300 ease-in-out hover:border-motif-ivory hover:animate-[gap-pulse_1s_ease-in-out_infinite] ${theme === "cream" ? "bg-transparent" : "bg-motif-red border-motif-red hover:text-motif-red"}`}
        href={link}
      >
        {label}
        <Icon />
      </Link>
    )
}
