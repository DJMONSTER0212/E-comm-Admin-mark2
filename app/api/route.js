import connectDB from "../_conf/database/connection";
import { settingModel } from '@/app/_models/setting'
import { userModel } from '@/app/_models/user'
import { tourModel } from '@/app/_models/tour'
import bcrypt from 'bcrypt';
connectDB()

export async function GET(request) {
    console.log(request.method)
    const loadDefaultSettings = async () => {
        const setting = new settingModel();
        await setting.save()
    }
    const newUser = async () => {
        const user = new userModel({
            name: 'Mohit Kumawat',
            email: 'mohitkumawat310@gmail.com',
            phone: '9057965596',
            image: '/panel/images/newUser.webp',
            block: false,
            verified: true,
            password: 'xxxxx',
            signedInWith: 'credentials',
            role: 'admin'
        });
        await user.save()
    }
    // newUser()

    const newTour = async () => {
        const tour = new tourModel({
            images: ['https://coolify-tnit-site.s3.ap-south-1.amazonaws.com/public/beingstay/categories/1698963233985-82e15d64a6e8e999aa2b93cba5552529.jpg'],
            name: 'Jaipur city tour',
            slug: 'jaipur-city-tour',
            duration: '3 Days and 2 Nights',
            languages: 'Hindi, English and Rajasthani',
            meetingPoint: {
                address: 'Narayan singh circle, Delhi road, Jaipur',
                mapsLink: 'https://www.google.com/maps/dir//narayan+singh+circle+jaipur/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x396db6a1922237fb:0x304918e297fb2324?sa=X&ved=2ahUKEwiO8qO1usGCAxWNyjgGHWxKCzEQ9Rd6BAhLEAA',
                shortDesc: 'Reach at 3:00 PM',
            },
            endPoint: {
                address: 'Narayan singh circle, Delhi road, Jaipur',
                mapsLink: 'https://www.google.com/maps/dir//narayan+singh+circle+jaipur/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x396db6a1922237fb:0x304918e297fb2324?sa=X&ved=2ahUKEwiO8qO1usGCAxWNyjgGHWxKCzEQ9Rd6BAhLEAA',
                shortDesc: 'Before 9:00 PM',
            },
            shortDesc: 'This tour will include the experience of the inner beauty of jaipur city.',
            desc: 'This tour will include the experience of the inner beauty of jaipur city.',
            includes: [
                {
                    title: 'Taxi fare',
                    isIncluded: true,
                },
                {
                    title: 'Medical care',
                    isIncluded: true,
                },
                {
                    title: 'Personal shopping charges',
                    isIncluded: false,
                },
            ],
            itinerary: [{
                desc: 'This itinerary includes all the activity of this tour:',
                items: [
                    {
                        title: 'Day 1',
                        subTitle: 'Famous palaces of the city',
                        shortDesc: 'On day 1 we will start the stour with beautifull palaces of jaipur.'
                    }
                ]
            }],
            additionalInfo: ['Please arrive on time to avoid any delay.'],
            tags: ['new', 'popular', 'mostLiked'],
            cityId: '65432a030b228ae845754fec',
            categoryId: '65441cbea1ab5559a6a40978',
            isActive: true
        })
        await tour.save()
    }
    // try {
    //     await newTour()
    // } catch (error) {
    //     return Response.json({ message: error })
    // }
    return Response.json({ message: bcrypt.hashSync('12345678', 10) })
}