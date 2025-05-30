require('dotenv').config();
const { cmd } = require('../lib'); // for ALI-MD command registration

cmd({
  pattern: 'sameemoji', // just a dummy trigger
  desc: 'Auto react with same emoji in message',
  type: 'fun',
  fromMe: false
}, async (message, match, m, conn) => {
    // This block runs when command is triggered, not auto.
    await message.send('*✅ SAME_EMOJI_REACT plugin loaded successfully!*');
});

// ========== Auto Reaction ==========
conn.ev.on('messages.upsert', async ({ messages }) => {
    try {
        const m = messages[0];
        if (!m.message || m.key.fromMe || !!m.message?.reactionMessage) return;
        if (process.env.SAME_EMOJI_REACT?.toLowerCase() !== 'true') return;

        const text = m?.body || m?.text || m?.caption || m?.message?.conversation || '';
        const emojiRegex = /[\p{Emoji}\u200d]+/gu;
        const emojis = text.match(emojiRegex);

        if (!emojis || emojis.length === 0) return;

        const chosenEmoji = emojis[0];

        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: chosenEmoji,
                key: m.key
            }
        });

        console.log(`✅ Reacted with "${chosenEmoji}" to message.`);
    } catch (err) {
        console.error('❌ Auto React Error:', err);
    }
});
