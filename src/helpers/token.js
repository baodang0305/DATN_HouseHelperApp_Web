const inforLogin = JSON.parse(localStorage.getItem("inforLogin")) || null;
const { token } = inforLogin || null;

export default token;
