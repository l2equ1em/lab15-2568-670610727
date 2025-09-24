import express, { type Request, type Response} from "express";
import morgan from 'morgan';
import studentRouter from "./routes/studentRoutes.js";
import courseRouter from "./routes/courseRoutes.js";

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

app.get("/me", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Studnet information",
    data: {
    studentId: "670610727",
    firstName: "Lawit",
    lastName: "Pinkaew",
    Program: "CPE",
    section: "001",
  },
  });
});

app.use("/students", studentRouter);
app.use("/courses", courseRouter);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

export default app;
