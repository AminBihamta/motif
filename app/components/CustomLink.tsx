
import Link from "next/link";

interface LinkProps {
  theme: string;
  label: string;
  icon: React.ComponentType;
  link: string;
  icon_left?: boolean;
  custom_className?: string;
}


export default function CustomLink({theme,custom_className, label, icon_left, icon: Icon, link}: LinkProps) {
    return (
      <Link
        className={` ${custom_className} border px-4 py-2 cursor-pointer rounded-lg text-sm hover:text-motif-charcoal  flex flex-row gap-1 justify-center items-center transition-colors duration-300 ease-in-out hover:border-motif-ivory hover:animate-[gap-pulse_1s_ease-in-out_infinite] ${theme === "cream" ? "hover:bg-motif-ivory bg-transparent" : ""} ${theme === "red" ? "hover:bg-motif-ivory bg-motif-red border-motif-red hover:text-motif-red" : ""} ${theme === "charcol" ? "text-motif-charcoal hover:text-motif-ivory border-motif-charcoal hover:bg-motif-charcoal hover:border-motif-charcoal bg-motif-charcol border-motif-charcol hover:text-motif-charcol" : ""}`}
        href={link}
      >

        {icon_left ? (
          <>
            {<Icon />}
            {label}
          </>
        ) : (
            <>
              {label}
              {<Icon />}

            </>
        )}
      </Link>
    )
}
