import connectDB from '@/app/_conf/database/connection'
import { contactLeadModel } from '@/app/_models/contact-lead'
import { Parser } from '@json2csv/plainjs';
import { NextResponse } from 'next/server';
import { leadContactServices, leadStatuses } from '@/app/_conf/constants/constant';
import moment from 'moment';

export const contactLeads = async ({ req, params }) => {
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
    if (searchParams.get('service')) {
        matchQuery.service = { $in: searchParams.get('service').toString().split('.').map((item) => item) }
    }
    if (searchParams.get('status')) {
        matchQuery.status = { $in: searchParams.get('status').toString().split('.').map((item) => item) }
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
    // Fetching contact leads
    let contactLeads;
    try {
        contactLeads = await contactLeadModel.aggregate(pipeline);
    } catch (error) {
        return Response.json({ error: `Fetching contact leads failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
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
                    label: 'Service',
                    value: (row) => leadContactServices.find((service) => service.value == row.service).label,
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
        const csv = parser.parse(contactLeads);
        return new NextResponse(csv, {
            status: 200,
            headers: new Headers({
                "content-disposition": `attachment; filename="contact-leads.csv"`,
                "content-type": 'text/csv',
            })
        })
    }
    // Fetching page count
    if (searchParams.get('all') != 'true') {
        let totalContactLeads;
        try {
            totalContactLeads = await contactLeadModel.countDocuments(matchQuery);
        } catch (error) {
            return Response.json({ error: `Fetching page count failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
        }
        return Response.json({ contactLeads, pageCount: Math.ceil(totalContactLeads / perPage) }, { status: 200 })
    }
    return Response.json(contactLeads, { status: 200 })
}
