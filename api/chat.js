export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "Mensagens inválidas"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5.6-luna",
          instructions:
            "Você é o FacilitaAI, um assistente útil, claro e educado. Responda em português do Brasil.",
          input: messages,
          max_output_tokens: 1000
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Erro na API"
      });
    }

    return res.status(200).json({
      response: data.output_text || ""
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno no servidor"
    });
  }
}
