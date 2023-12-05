import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"
import { ServerHeader } from "./server-header"


interface ServerSidebarProps {
  serverId: string
}
export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile()
  if (!profile) return redirect("/")

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createAt: 'asc'
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  })

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
  const members = server?.members.filter((member) => member.profileId !== profile.id)

  if (!server) return redirect("/")

  const role = server.members.find((member) => member.profileId === profile.id)?.role

  return (
    <div className="fle flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
    </div>
  )
}
