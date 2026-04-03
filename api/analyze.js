export default async function handler(req, res) {
  const { data } = req.body;

  // Prepare prompt for Gemma AI
  const prompt = `Interpret the following CSV data (3 values per row) in simple terms:\n${JSON.stringify(data)}`;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/google/gemma-2b", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const aiResult = await response.json();

    res.status(200).json({ interpretation: aiResult[0]?.generated_text || "No response from AI." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ interpretation: "Error connecting to AI." });
  }
}
