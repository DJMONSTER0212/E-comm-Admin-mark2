import React from 'react'

const page = () => {
    return (
        <>
            <div className="mb-7">
                <h1 className='text-3xl font-bold leading-[1.5]'>Terms and Conditions</h1>
                <p className='text-base text-muted-foreground mt-1.5'>Your data{"'"}s security is our utmost priority. Our concise Privacy Policy ensures transparency and safeguards your information.</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-2">Information Collection</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>We collect personal information when you sign up for our services.</li>
                    <li>Information is also gathered through cookies for a better user experience.</li>
                </ul>
                <h2 className="text-2xl font-bold mb-2">Use of Information</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>Your data is used to provide and improve our services.</li>
                    <li>We may use your email for important updates and announcements.</li>
                </ul>
                <h2 className="text-2xl font-bold mb-2">Information Sharing</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>We do not sell, trade, or otherwise transfer your information to third parties.</li>
                    <li>Your data may be shared with trusted partners for specific services.</li>
                </ul>
                <h2 className="text-2xl font-bold mb-2">Security</h2>
                <p className="mb-4">
                    We implement security measures to protect your personal information from unauthorized access or disclosure.
                </p>
                <h2 className="text-2xl font-bold mb-2">Changes to Privacy Policy</h2>
                <p className="mb-4">
                    We reserve the right to update our Privacy Policy. Check this page for any changes.
                </p>
                <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
                <p>If you have any questions regarding this Privacy Policy, contact us at <a href="mailto:privacy@example.com" className="text-blue-500">privacy@example.com</a>.</p>
            </div>
        </>
    )
}

export default page