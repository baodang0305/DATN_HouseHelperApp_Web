import apiUrlTypes from "../helpers/apiURL";

function saveMessage({user1, user2, message}) {
    return dispatch => {
        return fetch(`${apiUrlTypes.local}/save-message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ user1, user2, message })
        })
        .then(response => response.json()
            .then(data => {
                console.log(data);
            })
        )
    }
}

export default saveMessage;