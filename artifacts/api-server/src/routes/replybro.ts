import { Router } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { db, replyHistoryTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/replybro/generate", async (req, res) => {
  const { conversation, mode } = req.body as { conversation: string; mode: string };

  if (!conversation || !mode) {
    res.status(400).json({ error: "conversation and mode are required" });
    return;
  }

  const validModes = ["romantic", "funny", "savage", "emotional"];
  if (!validModes.includes(mode)) {
    res.status(400).json({ error: "Invalid mode" });
    return;
  }

  const modeInstructions: Record<string, string> = {
    romantic: "Write a warm, charming, flirty reply that shows genuine interest and creates emotional connection. Be sweet, sincere, and slightly playful.",
    funny: "Write a witty, humorous reply with good timing. Use light humor, wordplay, or a clever observation that makes them smile or laugh.",
    savage: "Write a confident, bold, slightly edgy reply. Be direct, a little provocative, but still cool and controlled — not mean.",
    emotional: "Write a deeply empathetic, thoughtful reply that shows you truly understand their feelings. Be sincere, vulnerable, and emotionally intelligent.",
  };

  const systemPrompt = `You are ReplyBro, an expert at crafting perfect text message replies. Analyze the conversation and generate a ${mode} reply.

You must respond in valid JSON format with this exact structure:
{
  "reply": "the perfect reply text",
  "moodScores": {
    "romantic": <0-100>,
    "funny": <0-100>,
    "savage": <0-100>,
    "emotional": <0-100>
  },
  "interestLevel": <0-100>,
  "signals": ["signal1", "signal2", "signal3"]
}

The moodScores represent the mood detected in THEIR messages (not your reply).
The interestLevel is how interested they seem in you (0=not at all, 100=very interested).
The signals are 3-5 short observations about the conversation dynamic (e.g. "Uses ellipsis showing hesitation", "Short replies indicate coolness", "Asked about your plans").

Reply mode: ${modeInstructions[mode]}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `Here is the conversation:\n\n${conversation}\n\nGenerate a ${mode} reply.`,
        },
      ],
      system: systemPrompt,
    });

    const block = message.content[0];
    if (block.type !== "text") {
      res.status(500).json({ error: "Unexpected response type from AI" });
      return;
    }

    let parsed: {
      reply: string;
      moodScores: { romantic: number; funny: number; savage: number; emotional: number };
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

    const snippet = conversation.slice(0, 200);
    await db.insert(replyHistoryTable).values({
      conversationSnippet: snippet,
      mode,
      reply: parsed.reply,
      interestLevel: Math.round(parsed.interestLevel),
    });

    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Error generating reply");
    res.status(500).json({ error: "Failed to generate reply" });
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
