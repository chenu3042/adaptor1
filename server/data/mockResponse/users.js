const userService = {
    users: [
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibmNyYWRtaW4iLCJleHAiOjE1NzIwODMxOTEsImlzcyI6Imh0dHBzOi8vd3d3Lm5jci5jb20vdHJhdmVsIiwiYXVkIjoiaHR0cHM6Ly93d3cubmNyLmNvbS90cmF2ZWwifQ.bjd3vZ1F3Q_9nd2W8jcmPyizvnvHMPLhAAZ7DU2PB3s",
            "id": 1,
            "userName": "admin",
            "firstName": "user",
            "lastName": "b",
            "userEmail": "admin@ncr.com",
            "active": true,
            "modifiedDate": "",
            "loginSession": "",
            "password": "admin123",
            "role": "ADMIN"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibmNyYWRtaW4iLCJleHAiOjE1NzIwODMxOTEsImlzcyI6Imh0dHBzOi8vd3d3Lm5jci5jb20vdHJhdmVsIiwiYXVkIjoiaHR0cHM6Ly93d3cubmNyLmNvbS90cmF2ZWwifQ.bjd3vZ1F3Q_9nd2W8jcmPyizvnvHMPLhAAZ7DU2PB3s",
            "id": 1,
            "userName": "user",
            "firstName": "user",
            "lastName": "b",
            "userEmail": "user@ncr.com",
            "active": true,
            "modifiedDate": "",
            "loginSession": "",
            "password": "user123",
            "role": "USER"
        }
    ],
    validateUser: function (loginUser) {
        console.log(loginUser.username)
        return this.users.filter(function(user) { 
            console.log(loginUser.username+" -- "+user.userName);
            return user.userEmail === loginUser.username 
        });
    }
}
module.exports = userService;