import bcrypt from 'bcryptjs';

export const hashing = async({plaintext , rounds = Number(process.env.ROUND) || 10}) => {
    return await bcrypt.hash(plaintext , rounds);
}

export const compareHash = async ({plaintext , hash}) => {
    return await bcrypt.compare(plaintext , hash);
}