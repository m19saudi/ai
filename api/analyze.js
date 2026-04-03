export default async function handler(req, res) {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ interpretation: "No CSV data received." });
  }

  const prompt = `Interpret the following CSV data (3 values per row) in simple terms:\n${JSON.stringify(data)}`;

  try {
    // Call Hugging Face Router API
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

    // Get JSON response
    const aiResult = await response.json();
    console.log("Hugging Face response:", aiResult);

    // Safely extract AI text
    let interpretation = "No response from AI.";
    if (aiResult?.choices?.length > 0) {
      interpretation = aiResult.choices[0]?.message?.content || JSON.stringify(aiResult);
    } else if (aiResult?.error) {
      interpretation = `AI returned error: ${aiResult.error}`;
    }

    res.status(200).json({ interpretation });

  } catch (error) {
    console.error("Router API error:", error);
    res.status(500).json({ interpretation: "Error connecting to AI." });
  }
}
