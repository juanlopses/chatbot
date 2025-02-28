const express = require('express');
const { exec } = require('child_process'); // Módulo para ejecutar comandos de shell
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
app.post('/chat', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensaje no proporcionado.' });
  }

  // Construir el comando curl
  const curlCommand = `
    curl https://openrouter.ai/api/v1/chat/completions \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
      -d '{
        "model": "cognitivecomputations/dolphin3.0-mistral-24b:free",
        "messages": [
          {
            "role": "user",
            "content": "${message.replace(/"/g, '\\"')}"
          }
        ]
      }'
  `;

  // Ejecutar el comando curl
  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error al ejecutar curl:', error);
      return res.status(500).json({ error: 'Error al comunicarse con la API.' });
    }

    if (stderr) {
      console.error('Error en la respuesta de curl:', stderr);
      return res.status(500).json({ error: 'Error en la respuesta de la API.' });
    }

    try {
      const response = JSON.parse(stdout); // Parsear la respuesta JSON
      const reply = response.choices[0].message.content;
      res.json({ reply });
    } catch (parseError) {
      console.error('Error al parsear la respuesta:', parseError);
      res.status(500).json({ error: 'Error al procesar la respuesta de la API.' });
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
