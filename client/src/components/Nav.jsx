import React from 'react';

const Nav = ({handleViewChange, handleLogout, isLogged}) => {
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

            { isLogged ? (
                <>
                <li id="statistics" onClick={handleClick}>
                    Statistics
                </li>
                <li id="discounts" onClick={handleClick}>
                    Discounts
                </li>
                </>
            ) : null}

            
            <li id="login" onClick={!isLogged ? handleClick : handleLogout}>
                {!isLogged ? 'Login' : 'logout'}
            </li>
        </nav>
    )
}
export default Nav;