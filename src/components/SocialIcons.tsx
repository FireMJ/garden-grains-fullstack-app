// src/components/SocialIcons.tsx
import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "@/config/socialLinks";

export const SocialIcons = () => {
  return (
    <div className="flex gap-4">
      {socialLinks.map(({ name, href, icon }) => (
        <Link
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="hover:opacity-80 transition-opacity"
        >
          <Image
            src={icon}
            alt={name}
            width={24}
            height={24}
            priority
          />
        </Link>
      ))}
    </div>
  );
};


export default SocialIcons;
