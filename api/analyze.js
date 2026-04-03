export default async function handler(req, res) {
  const { data } = req.body;

  if (!data) {
    console.error("No CSV data received.");
    return res.status(400).json({ interpretation: "No CSV data received." });
  }

  const prompt = `Interpret the following CSV data:\n${JSON.stringify(data)}`;

  try {
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

    const text = await response.text(); // raw text to debug
    console.log("Hugging Face raw response:", text);

    // Try to parse JSON safely
    let aiResult;
    try { aiResult = JSON.parse(text); } catch (e) { aiResult = null; }

    const interpretation = aiResult?.choices?.[0]?.message?.content || text || "No response from AI.";
    res.status(200).json({ interpretation });

  } catch (error) {
    console.error("Router API error:", error);
    res.status(500).json({ interpretation: "Error connecting to AI." });
  }
}
