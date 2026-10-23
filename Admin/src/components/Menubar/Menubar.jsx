import React from 'react';

const Menubar = ({toggleSidebar, onLogout}) => {
  return (
<nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                    <div className="container-fluid">
                        <button className="btn btn-primary" id="sidebarToggle" onClick={toggleSidebar}>
                          <i className='bi bi-list'></i>
                        </button>
                        <button className="btn btn-outline-secondary" onClick={onLogout}>
                          <i className='bi bi-box-arrow-right me-1'></i> Abmelden
                        </button>
                        
                    </div>
                </nav>  )
}

export default Menubar;
