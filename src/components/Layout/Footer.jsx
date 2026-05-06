import React from 'react'

const Footer = () => {
    return (
        <div>
            <div className="text-center py-8 text-[var(--text-muted)] text-sm border-t border-[var(--border-dark)]">
                © {new Date().getFullYear()} FinTools. All rights reserved.
            </div>
        </div>
    )
}

export default Footer