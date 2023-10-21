import bcrypt from 'bcryptjs'

const User = [
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: true,
    },
    {
        name: 'aman',
        email: 'aman@gmail.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: false,
    },
    {
        name: 'himank',
        email: 'himank@gmail.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: false,
    },
    {
        name: 'deep',
        email: 'deep@gmail.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: false,
    },
]

export default User;