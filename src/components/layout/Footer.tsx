import Link from "next/link";

const socialLinks = [
  { name: "Facebook", url: "https://www.facebook.com/LoftDesArts" },
  { name: "Google Maps", url: "https://maps.app.goo.gl/tz5g4Zq5yGPz949N7" },
];

export function Footer() {
  return (
    <footer className="w-full bg-black border-t border-zinc-800 py-8">
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-zinc-400 mb-2">
              1625 rue Clark, Montréal, Québec, Canada H2X 2R5
            </p>
            <div className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} Syndicate Lofts des Arts. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 