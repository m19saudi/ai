export default async function handler(req, res) {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ interpretation: "No CSV data received." });
    }

    const prompt = `Interpret the following CSV data:\n${JSON.stringify(data)}`;

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b", // <--- a working model
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const json = await response.json();
    if (!response.ok) {
      console.error("HF Error:", json);
      return res.status(500).json({
        interpretation: `HuggingFace error: ${
          json.error || json.message || JSON.stringify(json)
        }`,
      });
    }

    const interpretation =
      json.choices?.[0]?.message?.content ||
      "No interpretation returned by model.";

    res.status(200).json({ interpretation });
  } catch (err) {
    console.error("Function error:", err);
    res.status(500).json({ interpretation: "Unexpected server error." });
  }
}
