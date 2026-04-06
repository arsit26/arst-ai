module.exports = async function(req, res) {
  // --- FITUR CEK SERVER (Agar kita tahu Vercel-nya sudah baca file ini) ---
  if (req.method === 'GET') {
    return res.status(200).send("API SERVER ARST AI BERJALAN NORMAL! 🚀");
  }

  // --- LOGIKA UTAMA APLIKASI ---
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Hanya menerima metode POST' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    // Mengambil API Key dari Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API Key belum diatur di Vercel.' });
    }

    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: "Gunakan bahasa Indonesia yang gaul, engaging, dan mudah dipahami oleh pengguna sosial media masa kini." }] }
    };

    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        return res.status(response.status).json({ error: data.error?.message || 'Error API Google' });
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ text: generatedText });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
