/* eslint-disable @typescript-eslint/no-explicit-any */
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

const OrderStepper = ({ orderStatus, orderDate, deliveryDate }: any) => {
    const [currentStep, setCurrentStep] = useState(0);

    // Hàm format ngày
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    }

    // Định nghĩa các bước với dữ liệu ngày động
    const steps = [
        { name: "Wait for pending", description: `on ${formatDate(orderDate)}`, value: "PENDING" },
        { name: "Confirmed", description: "Order confirmed", value: "CONFIRMED" },
        { name: "Packing", description: "Seller packing", value: "PLACED" },
        { name: "Shipping", description: "On the way", value: "SHIPPED" },
        { name: "Delivered", description: `by ${formatDate(deliveryDate)}`, value: "DELIVERED" },
    ];

    const canceledStep = [
        { name: "Cancelled", description: `on ${formatDate(orderDate)}`, value: "CANCELLED" },
    ];

    const [statusStep, setStatusStep] = useState(steps);

    useEffect(() => {
        if (orderStatus === 'CANCELLED') {
            setStatusStep(canceledStep);
            setCurrentStep(1); // Step 2 is active (index 1)
        } else {
            setStatusStep(steps);
            // Xác định bước hiện tại dựa trên orderStatus
            const stepMap: { [key: string]: number } = {
                'PENDING': 0,
                'CONFIRMED': 1,
                'PLACED': 2,
                'SHIPPED': 3,
                'DELIVERED': 4,
                'COMPLETED': 4
            };
            setCurrentStep(stepMap[orderStatus] || 0);
        }
    }, [orderStatus, orderDate, deliveryDate]);

    return (
        <Box className="my-10">
            {statusStep.map((step, index) => (
                <div key={index} className={`flex px-4`}>
                    <div className='flex flex-col items-center'>
                        <Box
                            sx={{ zIndex: -1 }}
                            className={`w-8 h-8 rounded-full flex items-center
                        justify-center z-10 ${index <= currentStep
                                    ? "bg-gray-200 text-teal-500"
                                    : "bg-gray-300 text-gray-600"
                                }`}
                        >
                            {/* Logic icon: Nếu đã qua bước này hoặc đang ở bước này (và trạng thái khớp) */}
                            {(index < currentStep || step.value === orderStatus) ? (
                                <CheckCircleIcon />
                            ) : (
                                <FiberManualRecordIcon sx={{ zIndex: -1 }} />
                            )}

                        </Box>
                        {index < statusStep.length - 1 && (
                            <div className={`border h-20 w-[2px] ${index < currentStep
                                    ? "bg-teal-600"
                                    : "bg-gray-300 text-gray-600"
                                }`}>

                            </div>
                        )}
                    </div>

                    <div className={`ml-2 w-full`}>
                        <div className={`${step.value === orderStatus
                            ? "bg-teal-600 p-2 text-white font-medium rounded-md -translate-y-3"
                            : ""
                            } ${(orderStatus === "CANCELLED" && step.value === "CANCELLED") ? "bg-red-500 text-white p-2 rounded-md -translate-y-3" : ""} w-full`}
                        >
                            <p className={``}>
                                {step.name}
                            </p>
                            <p className={`${step.value === orderStatus || (orderStatus === "CANCELLED" && step.value === "CANCELLED")
                                ? "text-gray-200"
                                : "text-gray-500"
                                } text-xs`}>{step.description}</p>

                        </div>
                    </div>

                </div>
            ))}

        </Box>
    )
}

export default OrderStepper