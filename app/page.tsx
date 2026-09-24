import Image from "next/image";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Sponsors from "./Sponsors";
import HoloCard from "./Holocard";
import MagicButton from "./MagicButton"; // <-- Import the new component
import Reveal from "./Reveal";
import FlashTextEffect from "./FlashTextEffect";
import NavTabs from "./Navtabs";
import Postcards from "./Postcards";
import FlashInvertMask from "./FlashInvertMask";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const specs = [
  { label: "0–100 km/h", value: "-.-", unit: "s" },
  { label: "Power", value: "--", unit: "kW" },
  { label: "Weight", value: "---", unit: "kg" },
  { label: "Top speed", value: "---", unit: "km/h" },
];

const navLinks = [
  { href: "#competition", label: "Competition" },
  { href: "#team", label: "Team" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#newsroom", label: "Newsroom" },
  { href: "#apply", label: "Apply" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-foreground">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-16">
          <Image
            className="h-8 w-auto"
            src="/sur_logo_horizontal.svg"
            alt="SUR logo"
            draggable={false}
            width={120}
            height={24}
            priority
          />
          <NavTabs links={navLinks} />

          {/* Header Magic Button */}
          <MagicButton
            href="mailto:formula.student@uni-sofia.bg"
            className="hidden text-sm font-medium sm:inline-flex"
          >
            Partner with us
          </MagicButton>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section id="competition" className="relative scroll-mt-24 overflow-hidden border-b border-line">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(#00000009 1px, transparent 1px), linear-gradient(90deg, #00000009 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* corner registration marks */}
          <svg
            className="pointer-events-none absolute left-6 top-6 h-6 w-6 text-zinc-400 sm:left-16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M1 8V1H8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <svg
            className="pointer-events-none absolute bottom-6 right-6 h-6 w-6 text-zinc-400 sm:right-16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M23 16v7h-7" stroke="currentColor" strokeWidth="1.5" />
          </svg>

          <div className="relative mx-auto w-full max-w-5xl px-6 py-24 sm:px-16 sm:py-32">
            
            <FlashTextEffect
              wrapperClassName="min-h-[160px]"
              offsetTop="-110vh"
              offsetLeft="-25vw"
              width="140vw"
              height="260vh"
              rotate={5}
              scale={1}
              //debug
              className={`${display.className} text-4xl font-semibold leading-[1.05] tracking-tight text-black sm:text-6xl`}
            >
              Formula Student,<br />engineered in Sofia.
            </FlashTextEffect>
            <p
              className="fade-up mt-6 max-w-md text-lg leading-8 text-zinc-600"
              style={{ animationDelay: "90ms" }}
            >
              We design, build, and race a single-seater formula car from
              scratch every season — the same problems Formula 1 teams solve,
              tackled by a bunch of students.
            </p>
            <div
              className="fade-up mt-10 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "160ms" }}
            >
            </div>

            <Postcards
              images={[
                //"20180812_14-59-15_1432_rankin-X4.jpg",
                //"54665063181_72d1a45075_o.jpg",
                "main_photo.jpg",
                "image034678.jpg",
                "IMG_6118.jpg",
                "image32330.jpg",
                "IMG_6123 (1).jpg",
                "image0333355.jpg",
              ]}
            />
            {/* Spec strip */}
            <dl
              className="fade-up mt-16 flex max-w-2xl flex-wrap gap-x-10 gap-y-6 border-t border-line pt-8"
              style={{ animationDelay: "230ms" }}
            >
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs text-zinc-500">{spec.label}</dt>
                  <dd className={`${mono.className} mt-1 text-2xl text-black`}>
                    {spec.value}
                    <span className="ml-1 text-sm text-zinc-500">
                      {spec.unit}
                    </span>
                  </dd>
                </div>
              ))}
              <Reveal>
               <p
                  className="fade-up mt-6 max-w-md text-lg leading-8 text-zinc-600"
                  style={{ animationDelay: "90ms" }}
                >
                  Hold on, we are cooking up something special... Comming soon! 
                </p>
              </Reveal>
            </dl>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="scroll-mt-24 border-b border-line">
          <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-16">
            <Reveal>
              <div className="grid gap-12 sm:grid-cols-[1fr_1fr]">
                <div>
                  <h2
                    className={`${display.className} text-3xl font-semibold tracking-tight text-black`}
                  >
                    Aspiring engineers
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-7 text-zinc-600">
                    Sofia University Racing is run entirely by students, from
                    aerodynamics and powertrain to electronics and business.
                    Everyone on the car — and the pitch deck — is solving the problems of today and tomorrow.
                  </p>
                  <a
                    href="mailto:formula.student@uni-sofia.bg"
                    className="mt-6 inline-flex text-sm font-medium text-black underline decoration-line underline-offset-4 transition-colors hover:decoration-black"
                  >
                    Join the team
                  </a>
                </div>
                <div className="grid grid-cols-3 gap-6 sm:pt-2">
                  {[
                    { value: "30+", label: "Members" },
                    { value: "2", label: "Seasons" },
                    { value: "6", label: "Departments" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p
                        className={`${mono.className} text-3xl text-black`}
                      >
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Sponsors */}
        <section id="sponsors" className="scroll-mt-24">
          <div className="mx-auto w-full max-w-5xl px-6 pt-20 sm:px-16">
            <Reveal>
              <h2
                className={`${display.className} text-3xl font-semibold tracking-tight text-black`}
              >
                Built with our partners.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-zinc-600">
                Materials, machining, electronics, and travel — none of it
                happens without the companies backing us each season.
              </p>
            </Reveal>
          </div>
          <div className="mx-auto w-full max-w-5xl px-6 sm:px-16">
            <Sponsors />
          </div>
        </section>

        {/* Newsroom */}
        <section id="newsroom" className="scroll-mt-24 border-t border-line">
          <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-16">
            <Reveal>
              <h2
                className={`${display.className} text-3xl font-semibold tracking-tight text-black`}
              >
                Newsroom.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-zinc-600">
                Updates, competition results, team milestones, and stories from
                Sofia University Racing.
              </p>
              <p className="mt-6 text-sm text-zinc-500">
                Coming soon.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Apply */}
        <section id="apply" className="scroll-mt-24 border-t border-line">
          <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-16">
            <Reveal>
              <h2
                className={`${display.className} text-3xl font-semibold tracking-tight text-black`}
              >
                Join the team.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-zinc-600">
                Interested in designing, building, racing, or helping run the
                team? Fill out our form and we'll get back to you swiftly.
              </p>
              <p className="mt-4 max-w-md text-base leading-7 text-zinc-600">
                Not a Sofia University student? Check out our partnering opportunities instead. 
              </p>
              <a
                href="forms.cloud.microsoft/e/NMeka4iTdK"
                className="mt-6 inline-flex text-sm font-medium text-black underline decoration-line underline-offset-4 transition-colors hover:decoration-black"
              >
                Apply to the team
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-foreground text-background">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-12 sm:grid-cols-2 sm:px-16 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className={`${display.className} text-lg font-semibold tracking-tight`}>
              Sofia University Racing
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-background/70">
              Building the next generation of Formula Student engineers and
              race cars.
            </p>
          </div>

          <address className="not-italic">
            <h3 className="text-sm font-semibold">Contact</h3>
            <div className="mt-3 space-y-2 text-sm leading-6 text-background/70">
              <p>Blvd. James Boucher 5, Faculty of Physics</p>
              <p>Sofia, Bulgaria</p>
              <a
                className="block transition-colors hover:text-background"
                href="mailto:formula.student@uni-sofia.bg"
              >
                formula.student@uni-sofia.bg
              </a>
            </div>
          </address>

          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-background/70">
              <li>
                <a className="transition-colors hover:text-background" href="#sponsors">
                  Sponsors
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-background" href="#team">
                  The Team
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-background" href="https://www.formulastudent.de/world/competitions/">
                  Competitions
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Social links">
            <h3 className="text-sm font-semibold">Follow us</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-background/70">
              <li>
                <a
                  className="transition-colors hover:text-background"
                  href="https://www.instagram.com/su.fs.racing/"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-background"
                  href="https://www.linkedin.com/company/sufs/"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-background"
                  href="https://www.facebook.com/profile.php?id=61582310791056"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-background/10">
          <p className="mx-auto w-full max-w-5xl px-6 py-5 text-xs text-background/50 sm:px-16">
            © 2026 Sofia University Racing. All rights reserved.
          </p>
        </div>
      </footer>
      </div>
  );
}