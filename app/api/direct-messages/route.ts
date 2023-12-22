import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { DirectMessage } from "@prisma/client"
import { NextResponse } from "next/server"

const MESSAGES_BATCH = 10

export async function GET(req: Request) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')
    const cursor = searchParams.get('cursor')

    if (!conversationId) {
      return new NextResponse('Conversation ID Missing', { status: 400 })
    }

    let messages: DirectMessage[] = []

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        },
        orderBy: {
          createAt: "desc",
        }
      })
    } else {
      messages = await db.directMessage.findMany({
        where: {
          conversationId
        },
        orderBy: {
          createAt: 'desc'
        },
        take: MESSAGES_BATCH,
        include: {
          member: {
            include: {
              profile: true
            }
          }
        }
      })
    }

    let nextCursor = null
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }

    return NextResponse.json({ items: messages, nextCursor })
  } catch (error) {
    console.log('[DIRECT_MESSAGES_POST_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}