import bcrypt from 'bcryptjs'

export const encryptPassword = async (password) => {
  const pass = await bcrypt.hash(password, 8)
  return pass
}

export const verifyPassword = async (plainText, hashedText) => {
  return await bcrypt.compare(plainText, hashedText);
}
