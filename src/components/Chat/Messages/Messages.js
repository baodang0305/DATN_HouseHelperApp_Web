import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Messages.css";

const Messages = ({messages, mName}) => {

    let listMessages;
    let isSentByCurrentUser;
    if (messages) {
        listMessages = messages.map((messageContainer, index) => {

            isSentByCurrentUser = false;
            if (messageContainer.name === mName) {
                isSentByCurrentUser = true;
            }

            return (
                isSentByCurrentUser ? (
                    <div key={index} className="item-message-container justify-end">
                        <div className="message-box margin-right-5 align-items-flex-end">
                            <div className="message-text background-blue">{messageContainer.message}</div> 
                        </div>
                        <div className="img-sent-text-container">
                            <img src={messageContainer.avatar} className="img-sent-text"/>
                        </div>
                    </div>
                )
                : (
                    <div key={index} className="item-message-container justify-start">
                        <div className="img-sent-text-container">
                            <img src={messageContainer.avatar} className="img-sent-text"/>
                        </div>
                        <div className="message-box margin-left-5 align-items-flex-start">
                            <div className="message-text background-gray">{messageContainer.message}</div> 
                        </div>
                    </div>   
                )
            );
        });    
    }
        
    return (
        <ScrollToBottom className="scroll-messages">
            {listMessages}
        {/* { isSentByCurrentUser ? 
            (    
                <div className="dots-typing-container">    
                    <React.Fragment>
                        <span className='typing-dot'></span>
                        <span className='typing-dot'></span>
                        <span className='typing-dot'></span>
                    </React.Fragment>
                </div>
            ) 
            : 
            (
                <div className="dots-typing-container">    
                    <React.Fragment>
                        <span className='typing-dot'></span>
                        <span className='typing-dot'></span>
                        <span className='typing-dot'></span>
                    </React.Fragment>
                </div>
            )
        } */}

        </ScrollToBottom>
    );
}

export default Messages;