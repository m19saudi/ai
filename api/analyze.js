export default async function handler(req, res) {
  const { data } = req.body;
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
    console.log("Hugging Face response:", aiResult); // <--- this will show in Vercel logs

    // Try multiple possible fields for Gemma output
    const interpretation = aiResult[0]?.generated_text || aiResult?.generated_text || JSON.stringify(aiResult);

    res.status(200).json({ interpretation });
  } catch (error) {
    console.error("Error calling Hugging Face:", error);
    res.status(500).json({ interpretation: "Error connecting to AI." });
  }
}
