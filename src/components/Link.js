import React from 'react';
import { Link } from 'react-router-dom';

export default props => {
    if(props.disabled){
        return <span className={props.className} style={{ backgroundColor: 'lightGray' }}>{props.children}</span>
    }
    return (
        <Link to={props.to} className={props.className}>{props.children}</Link>
    )
}

