import React from 'react';

const Message = ({ content, isSelf }) => {
    return (
        <div className={`message ${isSelf ? 'self' : ''}`}>
            <p>{content}</p>
        </div>
    );
};

export default Message;
