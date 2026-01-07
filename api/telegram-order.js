export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { text } = req.body;

    const token = process.env.TG_TOKEN;
    const chat_id = process.env.TG_CHAT;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id,
        text
      })
    });

    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'telegram error' });
  }
}
