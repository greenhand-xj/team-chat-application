import { db } from "./db";

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
  const existingConversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId)
  if (existingConversation) {
    return existingConversation
  }
  return await createConversation(memberOneId, memberTwoId)
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [
          {
            memberOneId,
            memberTwoId
          },
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })
  } catch (error) {
    return null
  }
}

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })
  } catch (error) {
    return null
  }
}