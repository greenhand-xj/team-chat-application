import { NextApiResponseServerIO } from '@/types'
import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export const config = {
  api: {
    bodyParser: false
  }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any
    const io = new SocketIOServer(httpServer, {
      path,
      // addTrailingSlash: false
    })
    res.socket.server.io = io
  }
  res.end()
}
export default ioHandler
