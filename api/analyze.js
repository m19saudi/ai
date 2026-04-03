export default async function handler(req, res) {
  try {
    const { userInput } = req.body;
    if(!userInput) return res.status(400).json({ output: "No data provided." });

    const prompt = `
You are an expert water quality analyst. 
The user provides water data in JSON format: ${JSON.stringify(userInput)}

1. Summarize the key metrics (pH, Turbidity, Hardness, Lead, Nitrates).
2. Highlight any values that are outside safe ranges.
3. Suggest recommendations for improving water quality.
4. Return output in clear, human-readable text suitable for a webpage textarea.
`;

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers:{
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages:[{role:"user", content: prompt}],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "No response from AI.";
    res.status(200).json({ output });

  } catch(err){
    console.error(err);
    res.status(500).json({ output: "Error connecting to AI." });
  }
}
