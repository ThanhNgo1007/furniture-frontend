/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider, ListItemIcon, ListItemText } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../State/AuthSlice'
import { useAppDispatch } from '../State/Store'

interface menuItem {
  name: string
  path: string
  icon: any
  activeIcon: any
}

interface DrawerListProp {
  menu: menuItem[]
  menu2: menuItem[]
  toggleDrawer: () => void
}

const DrawerList = ({ menu, menu2, toggleDrawer }: DrawerListProp) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout(navigate))
  }
  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-[400px] border-r py-8">
        <div className="space-y-5">
          {menu.map((item: any, index: number) => (
            <div
              onClick={() => navigate(item.path)}
              key={index}
              className="pr-12 cursor-pointer"
            >
              <div
                className={`${
                  item.path == location.pathname
                    ? 'bg-teal-600 text-white'
                    : 'text-teal-600'
                } flex items-center px-8 py-6 rounded-r-full`}
              >
                <ListItemIcon>
                  {item.path == location.pathname ? item.activeIcon : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </div>
            </div>
          ))}
        </div>
        <Divider />
        <div className="space-y-5">
          {menu2.map((item: any, index: number) => (
            <div
              onClick={() => {
                navigate(item.path)
                if (item.path == '/') handleLogout()
              }}
              key={index}
              className="pr-12 cursor-pointer"
            >
              <div
                className={`${
                  item.path == location.pathname
                    ? 'bg-teal-600 text-white'
                    : 'text-teal-600'
                } flex
                                items-center px-8 py-6 rounded-r-full`}
              >
                <ListItemIcon>
                  {item.path == location.pathname ? item.activeIcon : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DrawerList
