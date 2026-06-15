import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Send, Play, Shield, Gamepad2, Trophy, Flame } from "lucide-react";
import { trackEvent } from "../lib/tracking";

const GAMES = [
  {
    id: "doodleJump",
    title: "Doodle Jump",
    img: "https://cdn.beacons.ai/user_content/Mi4w4sksZtQZB22lbZbBm4xjdUG3/referenced_images/stock-images__link-in-bio__links-block__home__9bee4616-136f-4307-8d99-e762b2794c78__d6476a46-b54d-49d7-99b5-5f07afce856a__c3978611-40b6-42a4-89f8-70dad81d6be2.webp?t=1775820165378",
  },
  {
    id: "mineslot",
    title: "Mineslot",
    img: "https://cdn.beacons.ai/user_content/Mi4w4sksZtQZB22lbZbBm4xjdUG3/referenced_images/generated-images__link-in-bio__links-block__home__417e8d38-d782-46ce-a523-165cbb7822d4__7d82b498-f1a3-4885-a4b5-f752ffa69779__1d91d00c-0f09-4fe5-9fb9-35de304e632d.webp?t=1775821049642",
  },
  {
    id: "aviamasters",
    title: "Aviamasters",
    img: "https://cdn.beacons.ai/user_content/Mi4w4sksZtQZB22lbZbBm4xjdUG3/referenced_images/generated-images__link-in-bio__links-block__home__417e8d38-d782-46ce-a523-165cbb7822d4__e52b890b-e9fa-48d9-ae68-465869cc155e__1556e3f3-d7de-4892-a90f-71841b1a72cc.webp?t=1775821823070",
  },
  {
    id: "towerRush",
    title: "Tower Rush",
    img: "https://cdn.beacons.ai/user_content/Mi4w4sksZtQZB22lbZbBm4xjdUG3/referenced_images/generated-images__link-in-bio__links-block__home__417e8d38-d782-46ce-a523-165cbb7822d4__789b3c82-6f43-4b09-9668-b780f2a7f9a5__c58234c1-f973-425a-8c61-4bf8ae96cc5e.webp?t=1775821564121",
  },
];

// Трекинг + редирект: сначала отправляем beacon, потом переходим
function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>, name: string) {
  e.preventDefault();
  const href = (e.currentTarget as HTMLAnchorElement).href;
  trackEvent(`click_${name.toLowerCase().replace(/\s+/g, "_")}`);
  // Небольшая задержка чтобы beacon успел уйти, потом редирект
  setTimeout(() => {
    window.location.href = href;
  }, 80);
}

export default function LandingPage() {
  const [links, setLinks] = useState<Record<string, string>>({
    telegram: "https://t.me/qwezkow",
    game: "https://t.me/qwezkow",
    doodleJump: "https://t.me/qwezkow",
    mineslot: "https://t.me/qwezkow",
    aviamasters: "https://t.me/qwezkow",
    towerRush: "https://t.me/qwezkow",
  });

  useEffect(() => {
    trackEvent("page_view");
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        const fixUrl = (url: string | undefined, fallback: string) => {
          if (!url) return fallback;
          return url.startsWith("http") ? url : `https://${url}`;
        };

        setLinks({
          telegram: fixUrl(data.telegramLink, "https://t.me/qwezkow"),
          game: fixUrl(data.gameLink, "https://t.me/qwezkow"),
          doodleJump: fixUrl(data.doodleJumpLink, "https://t.me/qwezkow"),
          mineslot: fixUrl(data.mineslotLink, "https://t.me/qwezkow"),
          aviamasters: fixUrl(data.aviamastersLink, "https://t.me/qwezkow"),
          towerRush: fixUrl(data.towerRushLink, "https://t.me/qwezkow"),
        });
      })
      .catch((err) => console.error("Failed to load config", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] text-white flex justify-center p-4 selection:bg-red-500 selection:text-white overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-red-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-[390px] flex flex-col items-center relative z-10 pt-6 pb-20">
        <header className="text-center mb-10">
          <motion.div
            initial={{ rotate: -10, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="relative w-[160px] h-[160px] mx-auto mb-8 cursor-pointer group"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600 via-[#7000ff] to-red-600 p-[4px] animate-[spin_4s_linear_infinite] shadow-[0_0_60px_rgba(255,0,0,0.4)] group-hover:shadow-[0_0_80px_rgba(112,0,255,0.6)] transition-shadow">
              <div className="w-full h-full bg-black rounded-full" />
            </div>
            <img
              src="https://i.postimg.cc/fRKhCTGs/wmremove-transformed.png"
              className="absolute inset-[10px] w-[calc(100%-20px)] h-[calc(100%-20px)] rounded-full object-cover z-10 border-4 border-black group-hover:scale-105 transition-transform duration-300"
              alt="LNKX logo"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[42px] font-black tracking-tighter leading-none mb-2"
          >
            LNKX <span className="text-red-600">WIN</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block px-4 py-1.5 bg-[#00ffa3] text-black text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(0,255,163,0.4)]"
          >
            +500% К ДЕПОЗИТУ
          </motion.div>
        </header>

        <div className="w-full space-y-4 mb-14">
          <motion.a
            href={links.game}
            onClick={(e) => handleLinkClick(e, "start_playing")}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center justify-center w-full py-6 bg-[#ff0000] text-white rounded-3xl font-black text-xl uppercase tracking-widest shadow-[0_15px_30px_rgba(255,0,0,0.4)] border-b-4 border-red-800 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full hover:translate-x-full transition-transform duration-1000 skew-x-12 pointer-events-none" />
            <Play className="w-7 h-7 mr-3 fill-current" />
            НАЧАТЬ ИГРАТЬ
          </motion.a>

          <motion.a
            href={links.telegram}
            onClick={(e) => handleLinkClick(e, "telegram")}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center w-full py-6 bg-[#1a1a2e] border-2 border-[#7000ff]/30 text-white rounded-3xl font-black text-xl uppercase tracking-widest hover:border-[#7000ff] transition-all"
          >
            <Send className="w-6 h-6 mr-3" />
            НАШ ТЕЛЕГРАМ
          </motion.a>
        </div>

        <div className="w-full mb-6">
          <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-red-600 inline-block mb-4">
            ПОПУЛЯРНЫЕ ШЛЮЗЫ
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {GAMES.map((game, idx) => (
            <motion.a
              key={game.title}
              href={links[game.id]}
              onClick={(e) => handleLinkClick(e, game.title)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-[#111118] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#7000ff]/50 transition-all p-1"
            >
              <div className="relative overflow-hidden rounded-[1.8rem] aspect-square">
                <img
                  src={game.img}
                  className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  alt={game.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-60" />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
              </div>
              <div className="p-4 text-center">
                <span className="block font-black text-[11px] text-white mb-2 uppercase tracking-tight">
                  {game.title}
                </span>
                <div className="inline-flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-1 rounded-full bg-[#00ffa3] animate-pulse" />
                  <span className="text-[8px] font-black text-[#00ffa3] uppercase tracking-widest">
                    Active Bonus
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between w-full px-6 opacity-30 text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-[7px] font-black uppercase tracking-widest">Encrypted</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span className="text-[7px] font-black uppercase tracking-widest">VIP Verified</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-[7px] font-black uppercase tracking-widest">Real RTP</span>
          </div>
        </div>

        <footer className="mt-16 border-t border-white/5 pt-8 w-full">
          <p className="text-[9px] text-gray-700 font-black tracking-[0.4em] text-center uppercase leading-loose">
            2026 © LNKX OFFICIAL TEAM
            <br />
            ALL RIGHTS RESERVED. 18+
          </p>
        </footer>
      </div>
    </div>
  );
}
