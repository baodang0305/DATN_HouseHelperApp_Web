import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Messages.css"

const Messages = ({ messages, userIsEntering, mName }) => {
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
                            <img src={messageContainer.avatar.image} className="img-sent-text" style={{backgroundColor: messageContainer.avatar.color}}/>
                        </div>
                    </div>
                ) : (
                    <div key={index} className="item-message-container justify-start">
                        <div className="img-sent-text-container">
                            <img src={messageContainer.avatar.image} className="img-sent-text" style={{backgroundColor: messageContainer.avatar.color}}/>
                        </div>
                        <div className="message-box margin-left-5 align-items-flex-start">
                            <div className="message-text background-gray">{messageContainer.message}</div> 
                        </div>
                    </div>   
                )
            );
        });    
    }

    // let listMessages = [];
    // let isSentByCurrentUser = false;
    // let listTamPhai = [];
    // let listTamTrai = [];

    // if (messages) {
    //     messages.map((messageContainer, index) => {

    //         if (messageContainer.name === mName) {
    //             isSentByCurrentUser = true;
    //         } else {
    //             isSentByCurrentUser = false;
    //         }

    //         if (isSentByCurrentUser) {
    //             if (listTamTrai.length !== 0) {
    //                 listMessages.push(
    //                     <div key={index} className="item-message-container justify-start">
    //                         <div className="img-sent-text-container">
    //                             <img src={messageContainer.avatar} className="img-sent-text" />
    //                         </div>
    //                         <div className="message-box margin-left-5 align-items-flex-start">
    //                             {listTamTrai}
    //                         </div>
    //                     </div>   
    //                 )
    //                 listTamTrai = [];
    //                 listTamPhai.push(
    //                     <div className="message-text background-blue">{messageContainer.message}</div>
    //                 )
    //             } else {
    //                 listTamPhai.push(
    //                     <div className="message-text background-blue">{messageContainer.message}</div>
    //                 )
    //             }
    //         } else {
    //             if (listTamPhai.length !== 0) {
    //                 listMessages.push(
    //                     <div key={index} className="item-message-container justify-end">
    //                         <div className="message-box margin-right-5 align-items-flex-end">
    //                             {listTamPhai}
    //                         </div>
    //                         <div className="img-sent-text-container">
    //                             <img src={messageContainer.avatar} className="img-sent-text" />
    //                         </div>
    //                     </div>
    //                 )
    //                 listTamPhai = [];
    //                 listTamTrai.push(
    //                     <div className="message-text background-gray">{messageContainer.message}</div>
    //                 )
    //             } else {
    //                 listTamTrai.push(
    //                     <div className="message-text background-gray">{messageContainer.message}</div>
    //                 )
    //             }
    //         }
    //     });
    // }

    return (
        <ScrollToBottom className="scroll-messages">
            {listMessages}
            {userIsEntering &&
                (
                    <div className="item-message-container justify-start">
                        <div className="img-sent-text-container">
                            <img src={userIsEntering.mAvatar.image} className="img-sent-text" style={{backgroundColor: userIsEntering.mAvatar.color}} />
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

                )
            }

        </ScrollToBottom>
    );
}

export default Messages;