import connectDB from '@/app/_conf/database/connection'
import { rentedCarSpecialpriceModel } from '@/app/_models/rented-car-special-price'

export const postSpecialPrice = async ({ req, params, session }) => {
    const { rentedCarId } = params
    if (!rentedCarId) {
        return Response.json({ error: `Rented car id is required to perform this action.` }, { status: 400 })
    }
    const body = await req.json();
    const updateFields = {
        name: body.name,
        price: body.price,
        rangeType: body.rangeType,
        date: {
            startDate: body.startDate,
            endDate: body.endDate,
        },
        day: body.day,
        rentedCarId: rentedCarId,
    }
    // Check for required details
    if (updateFields.rangeType == 'date') {
        if (!updateFields.date.startDate || !updateFields.date.endDate) {
            return Response.json({ error: "Start date and end date is required for this special price." }, { status: 400 });
        }
        // Check for any existing special price for these date
        const currentSpecialPrices = await rentedCarSpecialpriceModel.find({ rentedCarId, rangeType: 'date' });
        function checkDateRangeOverlap(currentSpecialPrices, startDate, endDate) {
            for (let specialPrice of currentSpecialPrices) {
                if (
                    (new Date(specialPrice.date.startDate) >= new Date(startDate) && new Date(specialPrice.date.startDate) <= new Date(endDate)) ||  // Start date of object is within the provided range
                    (new Date(specialPrice.date.endDate) >= new Date(startDate) && new Date(specialPrice.date.endDate) <= new Date(endDate)) ||      // End date of object is within the provided range
                    (new Date(specialPrice.date.startDate) <= new Date(startDate) && new Date(specialPrice.date.endDate) >= new Date(endDate))       // Object's range fully encompasses the provided range
                ) {
                    // Dates partially or fully overlap
                    return true;
                }
            }
            // No overlap found
            return false;
        }
        if (checkDateRangeOverlap(currentSpecialPrices, updateFields.date.startDate, updateFields.date.endDate)) {
            return Response.json({ error: `Provided dates partially or fully overlap with existing special prices.` }, { status: 400 })
        }
        // Delete day field
        delete updateFields.day;
    }
    if (updateFields.rangeType == 'day') {
        if (!updateFields.day) {
            return Response.json({ error: "Day is required for this special price." }, { status: 400 })
        }
        // Check for any existing special price for same day
        const currentSpecialPrices = await rentedCarSpecialpriceModel.find({ rentedCarId, rangeType: 'day', day: updateFields.day });
        if (currentSpecialPrices.length > 0) {
            return Response.json({ error: `Prices for this day is already added.` }, { status: 400 })
        }
        // Delete date field
        delete updateFields.date;
    }
    // Database connection
    connectDB()
    // Adding new rented car special price
    try {
        const newRentedCarSpecialPrice = new rentedCarSpecialpriceModel(updateFields)
        await newRentedCarSpecialPrice.save();
        return Response.json({ status: 200 })
    } catch (error) {
        return Response.json({ error: `Adding special price failed. ${process.env.NODE_ENV == 'development' ? `Error : ${error}`: ''}` }, { status: 400 })
    }
}