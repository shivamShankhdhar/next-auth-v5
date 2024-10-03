import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verficationToken = await db.verificationToken.findUnique({
      where: {
        token
      }
    })
  } catch (error) {
    
  }
}


export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verficationToken = await db.verificationToken.findFirst({
      where: {
        email
      }
    });
    return verficationToken;
  } catch (error) {
    
  }
  return null;
}