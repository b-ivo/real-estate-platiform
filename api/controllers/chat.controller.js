import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // Attach receiver info to each chat
    const chatWithReceivers = await Promise.all(
      chats.map(async (chat) => {
        const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
        const receiver = await prisma.user.findUnique({
          where: { id: receiverId },
          select: { id: true, username: true, avatar: true },
        });
        return { ...chat, receiver };
      })
    );

    res.status(200).json(chatWithReceivers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        users: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // Mark as seen
    await prisma.chat.update({
      where: { id: req.params.id },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  if (!receiverId) {
    return res.status(400).json({ message: "receiverId is required!" });
  }

  if (receiverId === tokenUserId) {
    return res.status(400).json({ message: "Cannot create a chat with yourself!" });
  }

  try {
    // Check if chat already exists between these two users
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { userIDs: { hasSome: [tokenUserId] } },
          { userIDs: { hasSome: [receiverId] } },
        ],
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
        seenBy: [tokenUserId],
        users: {
          connect: [{ id: tokenUserId }, { id: receiverId }],
        },
      },
    });

    res.status(201).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
