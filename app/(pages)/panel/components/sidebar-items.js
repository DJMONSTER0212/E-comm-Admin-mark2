import { LayoutDashboard, User2, Settings, Globe, Library, FerrisWheel, Image as ImageIcon, Gift, CarTaxiFront, CarFront, Ticket, CreditCard, Hotel, Contact, ShoppingCart ,PackageSearch} from 'lucide-react';
export const sidebarItems = {
    sadmin: [
        {
            group: 'General',
            items: [
                {
                    title: 'Dashboard',
                    icon: <LayoutDashboard className='h-5 w-5 text-foreground' />,
                    link: '/panel/sadmin/dashboard'
                },
                {
                    title: 'Users',
                    icon: <User2 className='h-5 w-5 text-foreground' />,
                    link: '/panel/users'
                },

            ]
        },
        {
            group: 'Tours',
            items: [
                {
                    title: 'Categories',
                    icon: <Library className='h-5 w-5 text-foreground' />,
                    link: '/panel/tour-categories'
                },
                {
                    title: 'Tours',
                    icon: <FerrisWheel className='h-5 w-5 text-foreground' />,
                    link: '/panel/tours'
                },
                {
                    title: 'Bookings',
                    icon: <Ticket className='h-5 w-5 text-foreground' />,
                    link: '/panel/tours-bookings'
                },
            ]
        },
        {
            group: 'Cars',
            items: [
                {
                    title: 'Car companies',
                    icon: <CarFront className='h-5 w-5 text-foreground' />,
                    link: '/panel/car-companies'
                },
                {
                    title: 'Rented cars',
                    icon: <CarTaxiFront className='h-5 w-5 text-foreground' />,
                    link: '/panel/rented-cars'
                },
                {
                    title: 'Bookings',
                    icon: <Ticket className='h-5 w-5 text-foreground' />,
                    link: '/panel/cars-bookings'
                },
            ]
        },
        {
            group: 'Leads',
            items: [
                {
                    title: 'Visa leads',
                    icon: <CreditCard className='h-5 w-5 text-foreground' />,
                    link: '/panel/visa-leads'
                },
                {
                    title: 'Hotel leads',
                    icon: <Hotel className='h-5 w-5 text-foreground' />,
                    link: '/panel/hotel-leads'
                },
                {
                    title: 'Contact leads',
                    icon: <Contact className='h-5 w-5 text-foreground' />,
                    link: '/panel/contact-leads'
                }
            ]
        },
        {
            group: 'Promotions',
            items: [
                {
                    title: 'Auth banners',
                    icon: <ImageIcon className='h-5 w-5 text-foreground' />,
                    link: '/panel/auth-banners'
                },
                {
                    title: 'Homepage banners',
                    icon: <ImageIcon className='h-5 w-5 text-foreground' />,
                    link: '/panel/homepage-banners'
                },
                {
                    title: 'Coupons',
                    icon: <Gift className='h-5 w-5 text-foreground' />,
                    link: '/panel/coupons'
                }
            ]
        },
        {
            group: 'Other',
            items: [
                {
                    title: 'Settings',
                    icon: <Settings className='h-5 w-5 text-foreground' />,
                    link: '/panel/settings'
                }
            ]
        }
    ],
    admin: [
        {
            group: 'General',
            items: [
                {
                    title: 'Dashboard',
                    icon: <LayoutDashboard className='h-5 w-5 text-foreground' />,
                    link: '/panel/sadmin/dashboard'
                },
                {
                    title: 'Users',
                    icon: <User2 className='h-5 w-5 text-foreground' />,
                    link: '/panel/users'
                },
            ]
        },
        {
            group: 'Products',
            items: [
                {
                    title: 'Categories',
                    icon: <Library className='h-5 w-5 text-foreground' />,
                    link: '/panel/tour-categories'
                },
                {
                    title: 'Products',
                    icon: <ShoppingCart className='h-5 w-5 text-foreground' />,
                    link: '/panel/tours'
                },
                {
                    title: 'Orders',
                    icon: <PackageSearch className='h-5 w-5 text-foreground' />,
                    link: '/panel/tours-bookings'
                },
            ]
        },


        {
            group: 'Promotions',
            items: [
                {
                    title: 'Auth banners',
                    icon: <ImageIcon className='h-5 w-5 text-foreground' />,
                    link: '/panel/auth-banners'
                },
                {
                    title: 'Homepage banners',
                    icon: <ImageIcon className='h-5 w-5 text-foreground' />,
                    link: '/panel/homepage-banners'
                },
                {
                    title: 'Coupons',
                    icon: <Gift className='h-5 w-5 text-foreground' />,
                    link: '/panel/coupons'
                }
            ]
        },
        {
            group: 'Other',
            items: [
                {
                    title: 'Settings',
                    icon: <Settings className='h-5 w-5 text-foreground' />,
                    link: '/panel/settings'
                }
            ]
        }
    ],
    supportTeam: [
        {
            group: 'Leads',
            items: [
                {
                    title: 'Visa leads',
                    icon: <CreditCard className='h-5 w-5 text-foreground' />,
                    link: '/panel/visa-leads'
                },
                {
                    title: 'Hotel leads',
                    icon: <Hotel className='h-5 w-5 text-foreground' />,
                    link: '/panel/hotel-leads'
                },
                {
                    title: 'Contact leads',
                    icon: <Contact className='h-5 w-5 text-foreground' />,
                    link: '/panel/contact-leads'
                }
            ]
        },
        {
            group: 'Promotions',
            items: [
                {
                    title: 'Auth banners',
                    icon: <ImageIcon className='h-5 w-5 text-foreground' />,
                    link: '/panel/auth-banners'
                },
                {
                    title: 'Homepage banners',
                    icon: <ImageIcon className='h-5 w-5 text-foreground' />,
                    link: '/panel/homepage-banners'
                }
            ]
        },
    ]
}