function logout()
{
    // Clear user data from localStorage
    localStorage.removeItem('userToken');
    window.location.href="landingPage.html";
}
function updateprofile()
{
    window.location.href="userProfile.html";
}
function changepassword()
{
    window.location.href="userResetpassword1.html";
}