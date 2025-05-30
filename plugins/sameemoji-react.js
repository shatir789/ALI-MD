require('dotenv').config();

module.exports = {
  name: 'sameemoji-react',
  description: 'Auto react with same emoji as in message',
  type: 'auto',
  async onMessage(m, conn) {
    try {
      if (process.env.SAME_EMOJI_REACT?.toLowerCase() !== 'true') return;
      if (!m.message || m.key.fromMe || !!m.message?.reactionMessage) return;

      const text =
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption ||
        m.body || m.text || '';

      const emojiRegex = /[\p{Emoji}\u200d]+/gu;
      const emojis = text.match(emojiRegex);

      if (!emojis || emojis.length === 0) return;

      const emoji = emojis[0];

      await conn.sendMessage(m.key.remoteJid, {
        react: {
          text: emoji,
          key: m.key
        }
      });

      console.log(`✅ Reacted with emoji: ${emoji}`);
    } catch (err) {
      console.error('❌ sameemoji-react error:', err);
    }
  }
};
