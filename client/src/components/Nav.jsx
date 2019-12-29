import React from 'react';

const Nav = ({handleViewChange}) => {
    const handleClick = (e) => {
        handleViewChange(e.target.id);
    }
    return (
        <nav className="nav">
            <li id='search' onClick={handleClick}>
                Search
            </li>
            <li id='wishlist' onClick={handleClick}>
                My wishlist
            </li>
            <li>Login</li>
        </nav>
    )
}
export default Nav;