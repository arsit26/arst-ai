export default async function handler(req, res) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Mengambil prompt yang dikirim dari tampilan depan (HTML)
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Mengambil API Key yang disembunyikan dengan aman di brankas Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key belum diatur di server Vercel.' });
    }

    // Alamat asli AI Google Gemini
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // Data yang dikirim ke Gemini
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: "Gunakan bahasa Indonesia yang gaul, engaging, dan mudah dipahami oleh pengguna sosial media masa kini." }] }
    };

    // Proses mengirim permintaan
    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        return res.status(response.status).json({ error: data.error?.message || 'Error dari API Google' });
    }

    // Mengambil teks balasan dari AI dan mengirimkannya kembali ke aplikasimu
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ text: generatedText });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
