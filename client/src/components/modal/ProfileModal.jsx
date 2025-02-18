import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react"
import { useSelector } from "react-redux"
import { Assets } from '../../assets'
import { useEffect } from "react";
import userAPI from "../../service/userAPI";

export function ProfileDialog() {
  const user = useSelector((state) => state.user)
  const [isUpdate, setIsUpdate] = useState(false)
  return (
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader className="flex flex-row gap-4 items-center">
          { isUpdate && <img onClick={()=>setIsUpdate(false)} className="w-4 h-4" src={Assets.icons.back}/> }
          <DialogTitle>{isUpdate ? 'Cập nhật tài khoản' : 'Thông tin tài khoản'}</DialogTitle>
        </DialogHeader>
        {
          !isUpdate ? 
          <>
            <div className="flex-row flex gap-4 items-center">
              <img className="rounded-full w-16 h-16  " src={user?.avatarUrl}/>
              <p className="font-bold">{user.username}</p>
            </div>
            <div>
                {/* <Label className="text-right mb-4 text-base font-bold">
                  Thông tin cá nhân
                </Label> */}
              <div className="h-0.5 w-full bg-slate-400"/>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <span className="">Giới tính</span>
                  <span className="font-semibold">{user?.gender}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="">Ngày sinh</span>
                  <span className="font-semibold">{user?.dob}</span>
                </div>

                <div className="flex justify-between">
                  <span className="">Email</span>
                  <span className="font-semibold">{user.email}</span>
                </div>
              </div>
              {/* <p className="text-sm mt-4">Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này</p> */}
            </div>
            <DialogFooter>
              <Button onClick={()=>setIsUpdate(true)} className="w-full" type="submit">Cập nhật</Button>
            </DialogFooter>
          </>
          :
          <>
            <ProfileUpdateForm onFinish={()=>setIsUpdate(false)} user={user}/>
          </>
        }
      </DialogContent>
  )
}

export const ProfileUpdateForm = ({
  onFinish,
  user
}) => {
  const [name, setName] = useState(user.username);
  const [gender, setGender] = useState(user.gender || "male");
  const [dob, setDob] = useState(new Date(user.dob) || new Date());
  const [day, setDay] = useState(dob.getDay());
  const [month, setMonth] = useState("11");
  const [year, setYear] = useState(dob.getFullYear());
  
  var getDaySelect = (month) => {return ["2", "4", "6", "9", "11"].includes(month) ? 30 : 31}
  const [daySelect, setDaySelect] = useState(getDaySelect(month));
  
  useEffect(() => {
    setDaySelect(getDaySelect(month))
    if (day == "31" && getDaySelect(month) == "30") {
      setDay("30")
    }
  }, [month])

  const onUpdate = async () => {
    const updated = await userAPI.updateMe({
      username: name,
      gender,
      dob: new Date(dob)
    })

    if (updated) {
      console.log("success");
      
    }
  }
  

  return (
    <div className="p-6 max-w-lg">
      <div className="mb-4">
        <Label className="">Tên hiển thị</Label>
        <Input
          className="mt-1 border-gray-700 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <Label className="mb-2">Giới tính</Label>

      {/* Giới tính */}
      <RadioGroup 
        className="flex space-x-6 mb-4" 
        value={gender} 
        onValueChange={setGender}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            className={`w-4 h-4 border-gray-300 focus:ring-0`}
            value="male" id="male" />
          <Label htmlFor="male">Nam</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            className={`w-4 h-4 border-gray-300 focus:ring-0`}
            value="female" id="female" />
          <Label htmlFor="female">Nữ</Label>
        </div>
      </RadioGroup>

      {/* Ngày sinh */}
      <Label className="">Ngày sinh</Label>
      <div className="flex space-x-4 mt-2">
        <Select value={day} onValueChange={setDay}>
          <SelectTrigger className=" border-gray-700">
            <SelectValue placeholder="Ngày" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(daySelect).keys()].map((d) => (
              <SelectItem key={d + 1} value={(d + 1).toString()}>
                {d + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className=" border-gray-700">
            <SelectValue placeholder="Tháng" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(12).keys()].map((m) => (
              <SelectItem key={m + 1} value={(m + 1).toString()}>
                {m + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className=" border-gray-700">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 50 }, (_, i) => (new Date().getFullYear()) - i).map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nút bấm */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button onClick={onFinish} variant="outline" className="border-gray-600">
          Hủy
        </Button>
        <Button 
          onClick={onUpdate} 
          disabled={name?.length == 0}
          className="bg-blue-600 hover:bg-blue-800"
          >Cập nhật
        </Button>
      </div>
    </div>
  );
};
