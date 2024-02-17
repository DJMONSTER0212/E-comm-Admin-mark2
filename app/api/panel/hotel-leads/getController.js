import connectDB from '@/app/_conf/database/connection'
import { hotelLeadModel } from '@/app/_models/hotel-lead'
import { Parser } from '@json2csv/plainjs';
import { NextResponse } from 'next/server';
import { leadStatuses } from '@/app/_conf/constants/constant';
import moment from 'moment';

export const hotelLeads = async ({ req, params }) => {
    const searchParams = req.nextUrl.searchParams
    const matchQuery = {};
    if (searchParams.get('name')) {
        matchQuery.name = { $regex: new RegExp(`.*${searchParams.get('name')}.*`, "i") }
    }
    if (searchParams.get('email')) {
        matchQuery.email = { $regex: new RegExp(`.*${searchParams.get('email')}.*`, "i") }
    }
    if (searchParams.get('phone')) {
        matchQuery.phone = { $regex: new RegExp(`.*${searchParams.get('phone')}.*`, "i") }
    }
    if (searchParams.get('country')) {
        matchQuery.email = { $regex: new RegExp(`.*${searchParams.get('email')}.*`, "i") }
    }
    if (searchParams.get('city')) {
        matchQuery.phone = { $regex: new RegExp(`.*${searchParams.get('phone')}.*`, "i") }
    }
    if (searchParams.get('status')) {
        matchQuery.status = { $in: searchParams.get('status').toString().split('.').map((item) => item) }
    }
    if (searchParams.get('dates')) {
        let dateStrings = searchParams.get('dates').toString().split('.')
        let checkIn = new Date(dateStrings[0].trim())
        let checkOut = new Date(dateStrings[1].trim())
        matchQuery.date = {
            $gte: checkIn,
            $lte: checkOut
        }
    }
    // Prepare pipeline
    let pipeline = [
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
    ]
    let page = searchParams.get('page') || 1;
    let perPage = searchParams.get('per_page') || 20;
    if (searchParams.get('all') != 'true') {
        pipeline.push({ $skip: (Number(page) - 1) * Number(perPage) })
        pipeline.push({ $limit: Number(perPage) })
    }
    // Database connection
    connectDB()
    // Fetching hotel leads
    let hotelLeads;
    try {
        hotelLeads = await hotelLeadModel.aggregate(pipeline);
    } catch (error) {
        return Response.json({ error: `Fetching hotel leads failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
    // Exporting to csv if enabled
    if (searchParams.get('export') == 'true') {
        const opts = {
            fields: [
                {
                    label: 'Name',
                    value: 'name',
                },
                {
                    label: 'Email',
                    value: 'email',
                },
                {
                    label: 'Phone',
                    value: 'phone',
                },
                {
                    label: 'Country',
                    value: 'country',
                },
                {
                    label: 'City',
                    value: 'city',
                },
                {
                    label: 'Guests',
                    value: 'guests',
                },
                {
                    label: 'Check in',
                    value: (row) => moment(row.checkIn).format('DD MMM YYYY'),
                },
                {
                    label: 'Check out',
                    value: (row) => moment(row.checkOut).format('DD MMM YYYY'),
                },
                {
                    label: 'Message',
                    value: 'message',
                },
                {
                    label: 'Status',
                    value: (row) => leadStatuses.find((status) => status.value == row.status).label,
                },
                {
                    label: 'Date',
                    value: (row) => moment(row.createdAt).format('DD MMM YYYY'),
                }
            ]
        };
        const parser = new Parser(opts);
        const csv = parser.parse(hotelLeads);
        return new NextResponse(csv, {
            status: 200,
            headers: new Headers({
                "content-disposition": `attachment; filename="hotel-leads.csv"`,
                "content-type": 'text/csv',
            })
        })
    }
    // Fetching page count
    if (searchParams.get('all') != 'true') {
        let totalHotelLeads;
        try {
            totalHotelLeads = await hotelLeadModel.countDocuments(matchQuery);
        } catch (error) {
            return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        return Response.json({ hotelLeads, pageCount: Math.ceil(totalHotelLeads / perPage) }, { status: 200 })
    }
    return Response.json(hotelLeads, { status: 200 })
}
