import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import profileImg from "../../../assets/profile-img.png";
import "./Messages.css";

const Messages = ({messages, name}) => {

    let isSentByCurrentUser;
    const listMessages = messages.map((message) => {
        isSentByCurrentUser = false;
        if (message.user === name) {
            isSentByCurrentUser = true;
        }

        return (
            isSentByCurrentUser ? (
                <div className="item-message-container justify-end">
                    <div className="message-box margin-right-5 align-items-flex-end">
                        <div className="message-text background-blue">{message.text}</div> 
                    </div>
                    <div className="img-sent-text-container">
                        <img src={profileImg} className="img-sent-text"/>
                    </div>
                </div>
            )
            : (
                <div className="item-message-container justify-start">
                    <div className="img-sent-text-container">
                        <img src={profileImg} className="img-sent-text"/>
                    </div>
                    <div className="message-box margin-left-5 align-items-flex-start">
                        <div className="message-text background-gray">{message.text}</div> 
                    </div>
                </div>   
            )
        );
    });

    return (
        <ScrollToBottom className="scroll-messages">
            {listMessages}
        </ScrollToBottom>
    );
}

export default Messages;