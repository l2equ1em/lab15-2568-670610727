import { Router, type Request, type Response } from "express";
import { zStudentId } from "../schemas/studentValidator.js";
import { students, courses } from "../db/db.js";
const router = Router();

router.get("/:studentId/courses", (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId;
        const result_varidate = zStudentId.safeParse(studentId);

        if(!result_varidate.success){
            return res.status(400).json({
                message: "Validation failed",
                error: result_varidate.error.issues[0]?.message,
            });
        }

        const foundIndex = students.findIndex(
            (student) => student.studentId === studentId
        );

        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Student does not exists",
            });
        }

        res.set("Link", `/students/${studentId}/courses`);

        let courses_filter;

        if (students[foundIndex]?.courses !== undefined) {
            let courses_List = students[foundIndex].courses;
            courses_filter = courses.filter((course) => courses_List?.includes(course.courseId));

            courses_filter = courses_filter.map((course) => {
                return {
                    courseId: course.courseId,
                    courseTitle: course.courseTitle,
                };
            });
        }

        return res.status(200).json({
            success: true,
            message: `Get courses detail of student ${studentId}`,
            data: {
                studentId: studentId,
                courses: courses_filter,
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Somthing is wrong, please try again",
            error: err,
        });
    }
})


export default router;
