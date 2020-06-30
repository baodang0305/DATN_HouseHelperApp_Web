import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Messages.css"
import { Avatar } from "antd";

const Messages = ({ messages, userIsEntering, mID }) => {
    let isSeen = false;
    let listMessages;
    let isSentByCurrentUser;
    if (messages.length !== 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.id === mID && lastMessage.seen) { isSeen = true; }
        listMessages = messages.map((messageContainer, index) => {
            isSentByCurrentUser = false;
            if (messageContainer.id === mID) {
                isSentByCurrentUser = true;
            }
            return (
                isSentByCurrentUser
                    ? <div key={index} className="item-message-container justify-end">
                        <div className="message-box margin-right-5 align-items-flex-end">
                            <div className="message-text background-blue ">{messageContainer.message}</div>
                        </div>
                        <div className="img-sent-text-container">
                            <Avatar src={messageContainer.avatar.image} className="img-sent-text" style={{ backgroundColor: messageContainer.avatar.color }} />
                        </div>
                    </div>
                    : <div key={index} className="item-message-container justify-start">
                        <div className="img-sent-text-container">
                            <Avatar src={messageContainer.avatar.image} className="img-sent-text" style={{ backgroundColor: messageContainer.avatar.color }} />
                        </div>
                        <div className="message-box margin-left-5 align-items-flex-start">
                            <div className="message-text background-gray">{messageContainer.message}</div>
                        </div>
                    </div>

            );

        });
    }

    return (
        <ScrollToBottom className="scroll-messages">
            {listMessages}
            {userIsEntering
                ? <div className="item-message-container justify-start">
                    <div className="img-sent-text-container">
                        <Avatar src={userIsEntering.mAvatar.image} className="img-sent-text" style={{ backgroundColor: userIsEntering.mAvatar.color }} />
                    </div>
                    <div className="message-box margin-left-5 align-items-flex-start">
                        <div className="dots-typing-container">
                            <React.Fragment>
                                <span className='typing-dot'></span>
                                <span className='typing-dot'></span>
                                <span className='typing-dot'></span>
                            </React.Fragment>
                        </div>
                    </div>
                </div>
                : isSeen && <div className="item-message-container justify-end"> Đã Xem </div>
            }
        </ScrollToBottom>
    );
}

export default Messages;