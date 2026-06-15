import { Hono } from "hono";
import { UAParser } from "ua-parser-js";

// Types
interface Env {
  ASSETS: Fetcher;
  STATS_DB: KVNamespace;
  ADMIN_PASSWORD: string;
  TELEGRAM_LINK: string;
  GAME_LINK: string;
  DOODLE_JUMP_LINK: string;
  MINESLOT_LINK: string;
  AVIAMASTERS_LINK: string;
  TOWER_RUSH_LINK: string;
}

interface LogEntry {
  id: string;
  ip: string;
  country: string;
  browser: string;
  os: string;
  device: string;
  action: string;
  referer: string;
  timestamp: string;
}

// App configuration
const app = new Hono<{ Bindings: Env }>();

// Helper: serve SPA index
const serveIndex = async (c: any): Promise<Response> => {
  const url = new URL(c.req.url);
  url.pathname = "/index.html";
  return c.env.ASSETS.fetch(new Request(url.toString(), { headers: c.req.raw.headers }));
};

// API: log a click or page view
app.post("/api/log", async (c) => {
  try {
    const body = await c.req.json<{ action?: string }>();
    const ua = c.req.header("user-agent") ?? "";
    const parser = new UAParser(ua);
    const r = parser.getResult();

    const ip =
      (c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for") ?? "0.0.0.0")
        .split(",")[0]
        .trim();

    const entry: LogEntry = {
      id: crypto.randomUUID(),
      ip,
      country: c.req.header("cf-ipcountry") ?? "??",
      browser: r.browser.name ?? "Unknown",
      os: r.os.name ?? "Unknown",
      device: [r.device.vendor, r.device.model].filter(Boolean).join(" ") || "Desktop",
      action: (body.action ?? "page_view").slice(0, 120),
      referer: c.req.header("referer") ?? "",
      timestamp: new Date().toISOString(),
    };

    const list: LogEntry[] = (await c.env.STATS_DB.get("stats", { type: "json" })) ?? [];
    list.unshift(entry);
    
    await c.env.STATS_DB.put("stats", JSON.stringify(list.slice(0, 1000)));

    return c.json({ ok: true });
  } catch {
    return c.json({ ok: false }, 500);
  }
});

// API: get stats
app.get("/api/stats", async (c) => {
  const pass = c.req.query("pass") ?? "";
  const expected = c.env.ADMIN_PASSWORD ?? "overload";
  if (pass !== expected) return c.json({ error: "Unauthorized" }, 401);

  const list = (await c.env.STATS_DB.get("stats", { type: "json" })) ?? [];
  return c.json(list);
});

// API: clear stats
app.post("/api/clear", async (c) => {
  try {
    const { pass } = await c.req.json<{ pass?: string }>();
    const expected = c.env.ADMIN_PASSWORD ?? "overload";
    if (pass !== expected) return c.json({ error: "Unauthorized" }, 401);

    await c.env.STATS_DB.put("stats", "[]");
    return c.json({ ok: true });
  } catch {
    return c.json({ ok: false }, 500);
  }
});

// API: config
app.get("/api/config", (c) => {
  return c.json({
    telegramLink: c.env.TELEGRAM_LINK,
    gameLink: c.env.GAME_LINK,
    doodleJumpLink: c.env.DOODLE_JUMP_LINK,
    mineslotLink: c.env.MINESLOT_LINK,
    aviamastersLink: c.env.AVIAMASTERS_LINK,
    towerRushLink: c.env.TOWER_RUSH_LINK,
  });
});

// SPA routes
app.get("/", serveIndex);
app.get("/panel", serveIndex);
app.get("/panel/", serveIndex);

// Static assets + fallback
app.all("*", async (c) => {
  const path = new URL(c.req.url).pathname;

  if (path.startsWith("/api/")) {
    return c.json({ error: "Not Found" }, 404);
  }

  if (path.includes(".")) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    if (res.status !== 404) return res;
    return c.text("Not Found", 404);
  }

  if (path.startsWith("/cdn-cgi/")) {
    return c.text("Not Found", 404);
  }

  return serveIndex(c);
});

export default app;