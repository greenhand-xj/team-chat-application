"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

interface MediaRoomProps {
  chatId: string
  video: boolean
  audio: boolean
}

export const MediaRoom = function ({ chatId, video, audio }: MediaRoomProps) {
  const { user } = useUser()
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName || !user?.username) return
    const name = (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.username;
    ; (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [chatId, user?.firstName, user?.lastName, user?.username]);

  if (token === "") {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Loading...
        </p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      connect={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onError={(error) => console.error(error)}
      // options={{
      //   publishDefaults: {
      //     videoCodec: 'h264'
      //   }
      // }}
      data-lk-theme="default"
    // style={{ height: '100dvh' }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
