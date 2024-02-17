import mongoose from "mongoose";
import { Schema } from "mongoose";
import { currencySymbols } from "../_conf/constants/constant";

const settingSchema = new Schema({
    general: {
        name: {
            type: String,
            default: 'Default',
        },
        companyName: {
            type: String,
            default: 'Default',
        },
        currencySymbol: {
            type: String,
            enum: currencySymbols.map((currencySymbol) => currencySymbol.value),
            default: currencySymbols.map((currencySymbol) => currencySymbol.value)[0]
        },
        lightLogo: {
            type: String,
            default: '/logo-light.png',
        },
        darkLogo: {
            type: String,
            default: '/logo-dark.png',
        },
        emailLogo: {
            type: String,
            default: '/logo-light.png',
        },
        faviconLogo: {
            type: String,
            default: '/favicon.ico'
        },
        info: {
            inquiryMail: {
                type: String,
                default: 'enquiry@example.com',
                required: true
            },
            inquiryPhone: {
                type: String,
                default: '+911234567890',
                required: true
            },
            inquiryPhone2: {
                type: String,
                default: '+911234567890',
            },
            whatsappPhone: {
                type: String,
                default: '1234567890',
            },
            address: {
                type: String,
                default: 'Robert Robertson, 1234 NW Bobcat Lane, St. Robert, MO 65584-5678',
            },
            footerPara: {
                type: String,
                default: '“Today, the wispy wet water is streaming down from the sky, like honey slipping off a spoon.” “Drops of rain exit the pillowcases, drowsily float like feathers, soar in many directions.” ',
            },
        },
        social: {
            facebook: {
                type: String,
            },
            instagram: {
                type: String,
            },
            x: {
                type: String,
            },
            peerlist: {
                type: String,
            },
            linkedin: {
                type: String,
            },
            youtube: {
                type: String,
            },
            google: {
                type: String,
            },
        }
    },
    policies: {
        refundPolicy: {
            type: String,
        },
        privacyPolicy: {
            type: String,
        },
        TermAndConditions: {
            type: String,
        },
    },
    seo: {
        metadataBase: { type: String },
        title: { type: String },
        description: { type: String },
        applicationName: { type: String },
        referrer: { type: String },
        keywords: [{ type: String }],
        publisher: { type: String },
        manifest: { type: String },
        icons: {
            icon: { type: String },
            shortcut: { type: String },
            apple: { type: String },
        },
        openGraph: {
            images: [{ type: String }],
            title: { type: String },
            description: { type: String },
            siteName: { type: String },
            url: { type: String },
            keywords: [{ type: String }],
            publisher: { type: String },
        },
        twitter: {
            card: { type: String, default: 'summary_large_image' },
            images: [{ type: String }],
            title: { type: String },
            description: { type: String },
        },
        appLinks: {
            ios: {
                url: { type: String },
                app_store_id: { type: String },
            },
            android: {
                package: { type: String },
                app_name: { type: String },
            },
            web: {
                url: { type: String },
                should_fallback: { type: Boolean, default: true },
            },
        },
        robots: {
            index: { type: Boolean, default: true },
            follow: { type: Boolean, default: true },
            nocache: { type: Boolean, default: true },
            googleBot: {
                index: { type: Boolean, default: true },
                follow: { type: Boolean, default: true },
                noimageindex: { type: Boolean, default: true },
            }
        }
    },
    smtpDetails: {
        host: { type: String },
        port: { type: Number },
        secure: { type: Boolean, default: false },
        username: { type: String },
        password: { type: String },
        isActive: { type: Boolean, default: true },
    },
    mailTemplates: {
        otpTemplate: {
            type: Number,
            default: 1,
            required: true
        },
    },
    mails: {
        contact: {
            outgoing: { type: String },
            incoming: { type: String },
        },
        otp: {
            outgoing: { type: String },
        }
    },
    signinMethods: {
        type: [{
            name: { type: String, required: true },
            isActive: { type: Boolean, default: true },
            credentials: { type: Schema.Types.Mixed },
        }],
        required: true,
        default: [{
            name: 'credentials',
            isActive: true,
        }]
    },
    s3Details: {
        bucketName: { type: String },
        bucketRegion: { type: String },
        accessKey: { type: String },
        secretKey: { type: String },
        uploadPath: { type: String },
        backupPath: { type: String },
        isActive: { type: Boolean },
    },
    tour: {
        autoConfirmBooking: {
            type: Boolean,
            default: true
        },
    },
    rentedCar: {
        autoConfirmBooking: {
            type: Boolean,
            default: true
        },
    },
    sadmin: {
        activateWebsite: {
            type: Boolean,
            default: false,
            required: true
        },
        activateMaintenanceMode: {
            type: Boolean,
            default: false,
            required: true
        },
    }
}, { timestamps: true });

export const settingModel = mongoose.models.settings || mongoose.model('settings', settingSchema);
