import Image from "next/image";

export default function Logo({
  className = "h-8 w-auto",
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Image
      src="/logo-removebg.png"
      alt="Zivlo"
      width={120}
      height={32}
      className={`object-contain ${className}`}
      priority
    />
  );
}
