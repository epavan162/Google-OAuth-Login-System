import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface FloatingInputProps {
    label: string
    value: string
    onChange: (val: string) => void
    type?: string
    multiline?: boolean
    error?: string
    theme?: string
}

const FloatingInput: React.FC<FloatingInputProps> = ({
    label,
    value,
    onChange,
    type = 'text',
    multiline = false,
    error,
    theme = 'dark',
}) => {
    const [focused, setFocused] = useState(false)
    const isActive = focused || value.length > 0

    const isLight = theme === 'light'
    const bgColor = isLight ? 'bg-gray-100/80' : 'bg-white/5'
    const borderColor = error
        ? 'border-red-400/50'
        : isLight
            ? 'border-gray-300 focus:border-primary-500'
            : 'border-white/10 focus:border-primary-400/50'
    const textColorClass = isLight ? 'text-gray-900' : 'text-white'
    const labelInactive = isLight ? 'text-gray-500' : 'text-gray-400'
    const labelActive = 'text-primary-400'

    const inputProps = {
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        className: `
      w-full px-4 pt-6 pb-2 ${bgColor}
      border ${borderColor} rounded-xl ${textColorClass}
      focus:outline-none focus:ring-2 focus:ring-primary-500/50
      transition-all duration-300 resize-none
    `,
    }

    return (
        <div className="relative">
            <motion.label
                className={`
          absolute left-4 pointer-events-none
          transition-all duration-200 
          ${isActive
                        ? `top-2 text-xs ${labelActive}`
                        : `top-4 text-sm ${labelInactive}`
                    }
        `}
            >
                {label}
            </motion.label>
            {multiline ? (
                <textarea {...inputProps} rows={3} />
            ) : (
                <input {...inputProps} type={type} />
            )}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-400"
                >
                    {error}
                </motion.p>
            )}
        </div>
    )
}

export default FloatingInput
