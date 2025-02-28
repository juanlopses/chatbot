const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// OpenRouter API Key
const OPENROUTER_API_KEY = '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';

// Endpoint para manejar mensajes del chatbot
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensaje no proporcionado.' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'cognitivecomputations/dolphin3.0-mistral-24b:free',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error al comunicarse con OpenRouter:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al obtener respuesta del modelo.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
