import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-5">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Left side: logo + title */}
        <div className="flex items-center gap-2">
        <Image
        src="/logos/logo_t.png"
        alt="Logo"
        width={40}
        height={40}
        className="invert brightness-200"
        priority
      />

          <span className="font-bold text-lg">Portfolio</span>
        </div>

        {/* Right side: year */}
        <p className="text-sm text-gray-400">@2025</p>
      </div>
    </footer>
  );
};

export default Footer;
