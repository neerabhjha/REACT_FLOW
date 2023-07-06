import React from 'react'

function ContextMenu({isContextMenuOpen, onMouseLeave}) {
  return (
    isContextMenuOpen ? <><div onMouseOut={onMouseLeave}>ContextMenu</div></> : null
  )
}

export default ContextMenu