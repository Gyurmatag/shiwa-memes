import React from 'react'
import { FiMonitor } from 'react-icons/fi'
import { BsLightbulb } from 'react-icons/bs'
import { CiDark } from 'react-icons/ci'

type ThemeRadioInputProps = {
  name: string
  value: string
  checked: boolean
  onChangeTheme: (themeValue: string) => void
}

const ThemeRadioInput = ({
  name,
  value,
  checked,
  onChangeTheme,
}: ThemeRadioInputProps) => {
  const handleThemeOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeTheme(e.target.value)
  }

  const isDarkMode = value === 'dark'
  const isLightMode = value === 'light'
  const isSystemMode = value === 'system'

  return (
    <div>
      <input
        type="radio"
        name={name}
        value={value}
        id={`${name}-option`}
        className="peer hidden"
        checked={checked}
        onChange={handleThemeOptionChange}
      />
      <label
        htmlFor={`${name}-option`}
        className="block cursor-pointer select-none rounded-xl p-3 text-center peer-checked:bg-shiwa-purple peer-checked:font-bold peer-checked:text-white md:p-2"
      >
        {isDarkMode && <CiDark size="25" />}
        {isLightMode && <BsLightbulb size="25" />}
        {isSystemMode && <FiMonitor size="25" />}
      </label>
    </div>
  )
}

export default ThemeRadioInput
