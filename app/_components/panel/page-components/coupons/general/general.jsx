import React from 'react'
import EditCoupon from './edit';
import DeleteCoupon from './delete';

const GeneralCoupon = ({ coupon }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            <EditCoupon coupon={coupon} />
            <div className="grid grid-cols-1 gap-5 h-fit">
                <DeleteCoupon coupon={coupon} />
            </div>
        </div>
    )
}

export default GeneralCoupon