import express, { type Request, type Response} from "express";
import morgan from 'morgan';
import studentRouter from "./routes/studentRoutes.js";
import courseRouter from "./routes/courseRoutes.js";

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "lab 15 API service successfully"
  });
});

app.get("/me", (req: Request, res: Response) => {
    try {
        const myInfo = {
            studentId: "670610727",
            firstName: "Lawit",
            lastName: "Pinkaew",
            program: "CPE",
            section: "001",
        };

        return res.status(200).json({
            success: true,
            message: "Student information",
            data: myInfo,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something is wrong, please try again",
            error: err,
        });
    }
});

app.use("/students", studentRouter);
app.use("/courses", courseRouter);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

export default app;
