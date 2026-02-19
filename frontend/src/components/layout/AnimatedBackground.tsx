import React from 'react'

const AnimatedBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden gradient-bg dark:gradient-bg">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            {/* Light mode background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:hidden opacity-90" />
        </div>
    )
}

export default AnimatedBackground
