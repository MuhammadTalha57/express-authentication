import express from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
const PORT = 3000;

app.use(express.json());

type User = {
    email: string,
    name: string,
    passwordHash: string
};
// Users Database
let users: User[] = [];

app.post("/register", async (req, res, next) => {
    let {name, email, password} = req.body;

    let emailExist = false;
    for(const user of users) {
        if(user.email === email) {
            emailExist = true;
            break;
        }
    }
    if(emailExist) {
       return res.status(409).json({success: false, message: "User with this email already exist"});
    } else {
        const hash = await bcrypt.hash(password, 10);
        users.push({email, name, passwordHash: hash});
        // New User Added

        // Creating JWT Token
        const secret = process.env.AUTH_SECRET || "your-default-secret";
        let token = jwt.sign(
            {
                email: email,
                name: name
            },
            secret,
            {expiresIn: "1h"}
        );

        res
        .status(201)
        .json({
            success: true,
            data: {
                email: email,
                name: name,
                token: token 
            }
        });
    }
});

app.post("/login", async (req, res, next) => {
    let {email, password} = req.body;

    let user = users.find((user) => user.email === email);
    if(!user) {
        return res.status(401).json({success: false, message: "User Not Found"});
    } else {
        if(await bcrypt.compare(password, user.passwordHash)) {
            // Login Successful

            // Creating JWT Token
            const secret = process.env.AUTH_SECRET || "your-default-secret";
            let token = jwt.sign(
                {
                    email: user.email,
                    name: user.name
                },
                secret,
                {expiresIn: "1h"}
            );
            res
            .status(200)
            .json({
                success: true,
                data: {
                    email: user.email,
                    name: user.name,
                    token: token,
                },
            });

        } else {
            
            return res.status(401).json({success: false, message: "Incorrect Credentials"});
        }
    }
});

const userAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({success: false, message: "Unauthorized"});
    }

    const token = authHeader.split(' ')[1] || '';
    const secret = process.env.AUTH_SECRET || "your-default-secret";

    try {
        const decoded = jwt.verify(token, secret) as unknown as {email: string; name: string};

       (req as any).user = decoded;
       next(); 
    } catch (error) {
        return res.status(401).json({success: false, message: "Invalid or Expired Token"});
    }
};
app.get("/profile", userAuth, (req, res, next) => {
        res.status(200).json({success: true, user: (req as any).user});
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});