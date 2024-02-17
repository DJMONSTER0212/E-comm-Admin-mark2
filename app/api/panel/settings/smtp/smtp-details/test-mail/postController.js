import connectDB from '@/app/_conf/database/connection'
import { testMailSender } from '@/app/_conf/mail/mail-sender';

export const postTestMail = async ({ req }) => {
    const { email, outgoingEmail } = await req.json();
    // Database connection
    connectDB()
    // Sending test mail
    try {
        await testMailSender({ email, outgoingEmail });
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 })
    }
}