import nodemailer from 'nodemailer'

const mailTransporter = (host, port, secure, username, password) => nodemailer.createTransport({
    name: host,
    host: host,
    port: port,
    secure: secure,
    auth: {
        user: username,
        pass: password
    },
    tls: {
        rejectUnauthorized: false,
    },
})

export default mailTransporter;