import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType, MemberRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import { ServerHeader } from './server-header'
import { ScrollArea } from '../ui/scroll-area'
import { ServerSearch } from './server-search'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Separator } from '../ui/separator'
import { ServerSection } from './server-section'
import { ServerChannel } from './server-channel'
import { ServerMember } from './server-member'

interface ServerSidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.GUEST]: null,
}
export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile()
  if (!profile) return redirect('/')

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  )
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  )
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  )
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  )

  if (!server) return redirect('/')

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role

  return (
    <div className="fle flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Audio Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: 'member',
                data: members?.map((member) => ({
                  id: member.profileId,
                  name: member.profile?.name,
                  icon: roleIconMap[member.role],
                }))
              }
            ]}
          />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        {!!textChannels?.length && (
          <div className='mb-2'>
            <ServerSection sectionType='channels' channelType={ChannelType.TEXT} role={role} label="Text Channels" />
            <div className="space-y-[2px]">
              {textChannels?.map((channel) => (
                <ServerChannel role={role} key={channel.id} server={server} channel={channel} />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className='mb-2'>
            <ServerSection sectionType='channels' channelType={ChannelType.AUDIO} role={role} label="Audio Channels" />
            <div className='space-y-[2px]'>
              {audioChannels?.map((channel) => (
                <ServerChannel role={role} key={channel.id} server={server} channel={channel} />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className='mb-2'>
            <ServerSection sectionType='channels' channelType={ChannelType.VIDEO} role={role} label="Video Channels" />
            <div className='space-y-[2px]'>
              {videoChannels?.map((channel) => (
                <ServerChannel role={role} key={channel.id} server={server} channel={channel} />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className='mb-2'>
            <ServerSection sectionType='members' role={role} label="Members" server={server} />
            <div className='space-y-[2px]'>
              {members?.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
