import { Router } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { db, replyHistoryTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/replybro/generate", async (req, res) => {
  const { conversation, mode, lang = "english" } = req.body as {
    conversation: string;
    mode: string;
    lang?: string;
  };

  if (!conversation || !mode) {
    res.status(400).json({ error: "conversation and mode are required" });
    return;
  }

  const validModes = ["romantic", "funny", "savage", "emotional"];
  if (!validModes.includes(mode)) {
    res.status(400).json({ error: "Invalid mode" });
    return;
  }

  const system = `You are ReplyBro, a witty AI relationship coach. Respond ONLY with valid JSON, no markdown:
{"variants":["<reply 1>","<reply 2>","<reply 3>"],"mood":{"flirty":<0-100>,"playful":<0-100>,"tension":<0-100>,"warmth":<0-100>},"interestLevel":<0-100>,"signals":["<s1>","<s2>","<s3>"]}
Mode: ${mode} (romantic=warm heartfelt flirty; funny=witty sarcastic; savage=ice cold power move; emotional=empathetic deep).
Language for ALL 3 variants: ${lang}.`;

  const user = `Conversation:\n${conversation}\n\nGenerate 3 ${mode} reply variants in ${lang}.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: user }],
      system,
    });

    const block = message.content[0];
    if (block.type !== "text") {
      res.status(500).json({ error: "Unexpected response type" });
      return;
    }

    let parsed: {
      variants: string[];
      mood: { flirty: number; playful: number; tension: number; warmth: number };
      interestLevel: number;
      signals: string[];
    };

    try {
      const jsonMatch = block.text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : block.text);
    } catch {
      res.status(500).json({ error: "Failed to parse AI response" });
      return;
    }

    await db.insert(replyHistoryTable).values({
      conversationSnippet: conversation.slice(0, 200),
      mode,
      reply: parsed.variants[0] ?? "",
      interestLevel: Math.round(parsed.interestLevel),
    });

    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Error generating reply");
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

router.post("/replybro/rizz", async (req, res) => {
  const { opener } = req.body as { opener: string };
  if (!opener) {
    res.status(400).json({ error: "opener is required" });
    return;
  }

  const system = `You are a brutally honest rizz coach. Respond ONLY with valid JSON:
{"score":<0-100>,"grade":"<S/A/B/C/D/F>","verdict":"<one punchy sentence>","pros":["<p1>","<p2>"],"cons":["<c1>","<c2>"],"improved":"<better version of the opener>"}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      messages: [{ role: "user", content: `Rate this opening line: "${opener}"` }],
      system,
    });

    const block = message.content[0];
    if (block.type !== "text") {
      res.status(500).json({ error: "Unexpected response" });
      return;
    }

    const jsonMatch = block.text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : block.text);
    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Error scoring rizz");
    res.status(500).json({ error: "Failed to score" });
  }
});

router.post("/replybro/advice", async (req, res) => {
  const { name, trend, note } = req.body as {
    name: string;
    trend: number[];
    note?: string;
  };

  if (!name || !trend) {
    res.status(400).json({ error: "name and trend are required" });
    return;
  }

  const trendDir = trend[trend.length - 1] > trend[0] ? "increasing" : "decreasing";
  const system = `You are a relationship coach. Respond ONLY with valid JSON:
{"advice":"<2-3 sentence actionable advice>","nextMove":"<specific suggested action>","greenFlag":<true/false>}`;
  const user = `Contact: ${name}. Interest trend: ${trendDir}. Data: ${trend.join(", ")}. Note: ${note || "none"}.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: user }],
      system,
    });

    const block = message.content[0];
    if (block.type !== "text") {
      res.status(500).json({ error: "Unexpected response" });
      return;
    }

    const jsonMatch = block.text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : block.text);
    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Error getting advice");
    res.status(500).json({ error: "Failed to get advice" });
  }
});

router.get("/replybro/history", async (req, res) => {
  try {
    const history = await db
      .select()
      .from(replyHistoryTable)
      .orderBy(replyHistoryTable.createdAt);
    res.json(history.reverse());
  } catch (err) {
    req.log.error({ err }, "Error fetching history");
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

router.delete("/replybro/history/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const deleted = await db
      .delete(replyHistoryTable)
      .where(eq(replyHistoryTable.id, id))
      .returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting history");
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
