import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../State/Store";

const UserDetails = () => {
    const { user } = useAppSelector(store => store.auth)
    const { t } = useTranslation()
    return (
        <div className="flex justify-center py-10">
            <div className="w-full lg:w-[70%]">
                <div className="flex items-center pb-3 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-600">{t('account.personalDetails')}</h1>
                </div>
                <div className="">
                    <div className="py-5">
                        <span className="font-semibold">{t('account.name')} : </span>
                        <span className="text-gray-600">{user?.fullName}</span>
                    </div>
                    <div className="py-5">
                        <span className="font-semibold">{t('account.mobile')} : </span>
                        <span className="text-gray-600">{user?.mobile}</span>
                    </div>
                    <div className="py-5">
                        <span className="font-semibold">{t('account.email')} : </span>
                        <span className="text-gray-600">{user?.email}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDetails