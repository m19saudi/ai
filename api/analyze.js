export default async function handler(req, res) {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ interpretation: "Invalid or empty CSV data." });
    }

    const prompt = `Interpret the following CSV data (3 values per row) in simple terms:\n${JSON.stringify(data)}`;

    const response = await fetch("https://router.huggingface.co/api/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gemma-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      })
    });

    const text = await response.text();
    let aiResult;
    try { aiResult = JSON.parse(text); } catch { aiResult = null; }

    const interpretation = aiResult?.choices?.[0]?.message?.content || text || "No response from AI.";

    res.status(200).json({ interpretation });

  } catch (error) {
    console.error("Function crash:", error);
    res.status(500).json({ interpretation: "Error connecting to AI." });
  }
}
