import React, { useState } from 'react'
import DefaultDatePicker, { CalendarContainer } from 'react-datepicker'

import { CustomTypography, Input } from 'components'
import { Switch } from 'components'

import 'react-datepicker/dist/react-datepicker.css'

export const DatePicker = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [timeChecked, setTimeChecked] = useState<boolean>(false)
  const onChange = (date: Date) => {
    setStartDate(date)
  }
  return (
    <>
      <CustomTypography variant="h1" className="mb-8 text-center">
        Pick a time
      </CustomTypography>
      <DefaultDatePicker
        formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
        selected={startDate}
        onChange={onChange}
        inline
        calendarContainer={CalendarContainer}
        dateFormat="MMMM d, yyyy h:mm aa"
      />
      <div className="gap-2">
        <div className="w-28 gap-1">
          <Input placeholder="" mainColor />
          <CustomTypography variant="h2">:</CustomTypography>
          <Input placeholder="" mainColor />
        </div>
        <Switch labels={['AM', 'PM']} checked={timeChecked} onChange={(checked: boolean) => setTimeChecked(checked)} />
      </div>
    </>
  )
}

export default DatePicker
