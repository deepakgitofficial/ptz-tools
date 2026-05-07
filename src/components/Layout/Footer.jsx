import React from 'react'

const Footer = () => {
    return (
        <div>
            <div className="text-center py-8 text-[var(--text-muted)] text-sm border-t border-gray-400]">
                © {new Date().getFullYear()} PTZ Tools. All rights reserved.
            </div>
        </div>
    )
}

export default Footer