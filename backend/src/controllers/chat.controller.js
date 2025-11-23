import prisma from "../prismaClient.js";


export const sendMessage = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { content } = req.body;

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId: parseInt(receiverId),
        content,
      },
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
};


export const getChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: parseInt(userId) },
          { senderId: parseInt(userId), receiverId: req.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to get chats" });
  }
};
