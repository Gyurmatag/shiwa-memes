'use client'
import React from 'react'
import { useTheme } from 'next-themes'
import ThemeRadioInput from '@/app/profile/theme/ThemeRadioInput'

const ThemeSelector = () => {
  const { theme, setTheme, themes } = useTheme()

  const handleThemeOptionChange = (selectedTheme: string) => {
    setTheme(selectedTheme)
  }

  return (
    <form className="my-8">
      <div className="flex space-x-3 p-2">
        {themes?.map((themeValue) => (
          <ThemeRadioInput
            key={themeValue}
            name={themeValue}
            value={themeValue}
            checked={theme === themeValue}
            onChangeTheme={handleThemeOptionChange}
          />
        ))}
      </div>
    </form>
  )
}

export default ThemeSelector
