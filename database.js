import mysql from 'mysql2'
const pool = mysql.createPool({
    host:'127.0.0.1',
    user: 'root',
    password: '',
    database:'user'
}).promise()

export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

export async function getUsersById(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE id =?
    `, [id]);
    return rows[0];
}

export async function createUsers(name, lastName , age) {
    const [result] = await pool.query(`
    INSERT INTO users(name,lastName,age) 
    VALUES (?,?,?)`,[name,lastName,age]);
    return result;
}

export async function register(email, password,name,lastName,age) {
    const [result1] = await pool.query(`
    INSERT INTO auth(email,password) 
    VALUES (?,?)`, [email, password]);

    const [result2]= await pool.query(`
    INSERT INTO users(name,lastName,email,age) 
    VALUES (?,?,?,?)`, [name, lastName, email, age]);
    return result1,result2;
  
};

export async function login(email) {
    const [result] = await pool.query(`
    select * 
    from auth
    where email =?`,[email]);
    return result;
}
export async function updatePassword(email ,password){
    const[result] = await pool.query(`
    UPDATE auth
    SET password = ?
    WHERE email = ?`, [email,password])
}

export async function getProducts() {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows;
}

export async function getProductssById(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM products
    WHERE ProductID =?
    `, [id]);
    return rows[0];
}

export async function AdminPostProducts( UserID,  ProductName , Description , Price , StockQuantity) {
    const [rows] = await pool.query(`SELECT role
    FROM users
    WHERE id=?`, [UserID]);
    console.log(rows[0].role)
    if (rows[0].role === 'admin') {
        const [res] = await pool.query(`
        INSERT INTO products( ProductName, Description, Price, StockQuantity)
        VALUES (?,?,?,?)`, [ProductName, Description, Price, StockQuantity]);
        console.log(res)
        return res;
    }
}

