"use client"
import React from 'react'
import Mails from './mails/mails'
import SmtpDetails from './smtp-details/smtp-details'
import MailTemplates from './mail-templates/mail-templates'

const SmtpSettings = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
      <div className="grid gap-5 h-fit">
        <SmtpDetails />
        <MailTemplates />
      </div>
      <Mails />
    </div>
  )
}

export default SmtpSettings