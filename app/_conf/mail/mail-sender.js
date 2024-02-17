import { settingModel } from '@/app/_models/setting'
import mailTransporter from './mail-transporter'
import { otpMailTemplates } from './templates/otp-mail-template'
import connectDB from '../database/connection'

export const otpSender = async (otp, recipient) => {
    connectDB();
    const settings = await settingModel.findOne().lean()
    if (!settings?.smtpDetails?.host || !settings.smtpDetails.port || typeof settings.smtpDetails.secure !== 'boolean' || !settings.smtpDetails.username || !settings.smtpDetails.password) {
        throw new Error('SMTP details are not set up yet.')
    }
    if (!settings?.smtpDetails?.isActive) {
        throw new Error('SMTP service is currently disabled.')
    }
    if (!settings?.mails?.otp?.outgoing) {
        throw new Error('Outgoing mail for OTP is not set up yet.')
    }
    const { host, port, secure, username, password } = settings.smtpDetails;
    const otpMailTemplate = otpMailTemplates.filter((template) => template.id == settings.mailTemplates.otpTemplate)[0];
    const mailContent = {
        from: `Verification mail <${settings.mails.otp.outgoing}>`, // sender address
        to: recipient.email,
        subject: `Verification mail From ${settings.general.name} website`, // Subject line
        html: otpMailTemplate.body(otp, recipient, settings),
    };
    try {
        await mailTransporter(host, port, secure, username, password).sendMail(mailContent);
        return true;
    } catch (error) {
        throw new Error(error)
    }
}

export const testMailSender = async (recipient) => {
    connectDB();
    const settings = await settingModel.findOne().lean()
    if (!settings?.smtpDetails?.isActive) {
        throw new Error('SMTP service is currently disabled.')
    }
    const { host, port, secure, username, password } = settings.smtpDetails;
    const mailContent = {
        from: `Test mail <${recipient.outgoingEmail}>`, // sender address
        to: recipient.email,
        subject: `Test mail From ${settings.general.name} website`, // Subject line
        html: `It is a test mail from ${settings.general.name}`,
    };
    try {
        await mailTransporter(host, port, secure, username, password).sendMail(mailContent);
        return true;
    } catch (error) {
        throw new Error(error)
    }
}