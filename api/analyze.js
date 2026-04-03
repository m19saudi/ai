export default async function handler(req, res) {
  const { data } = req.body;

  // Prepare the prompt
  const prompt = `Interpret the following CSV data (3 values per row) in simple terms:\n${JSON.stringify(data)}`;

  try {
    const response = await fetch("https://router.huggingface.co/api/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gemma-4",       // Use Gemma 4
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      })
    });

    const aiResult = await response.json();
    console.log("Hugging Face response:", aiResult);

    // Extract the AI message text
    const interpretation = aiResult?.choices?.[0]?.message?.content || JSON.stringify(aiResult);

    res.status(200).json({ interpretation });

  } catch (error) {
    console.error("Error calling Hugging Face Router API:", error);
    res.status(500).json({ interpretation: "Error connecting to AI." });
  }
}
