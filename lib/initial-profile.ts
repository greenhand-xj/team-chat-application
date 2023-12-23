import { currentUser, redirectToSignIn } from "@clerk/nextjs"
import { db } from "./db"
import { getRandomName } from "./utils"


export const initialProfile = async () => {
  const user = await currentUser()

  if (!user) {
    return redirectToSignIn()
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  })

  if (profile) return profile
  let name: string
  if (user.firstName && user.lastName) {
    name = `${user.firstName} ${user.lastName}`
  } else if (user.username) {
    name = `${user.username}`
  } else {
    name = `${getRandomName()}`
  }
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl
    }
  })
  return newProfile
}