import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "", onClick }: { className?: string, onClick?: () => void }) {
  return (
    <div onClick={onClick}>
      <Image 
        src="/logo.png" 
        alt="Zivlo Logo" 
        width={140} 
        height={40} 
        className="object-contain h-20 w-auto" 
        priority 
      />
    </div>
  );
}
