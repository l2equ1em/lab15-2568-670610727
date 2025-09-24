import { Router, type Request, type Response } from "express";
import { courses } from "../db/db.js";
import { 
    zCourseId, 
    zCoursePostBody,
    zCoursePutBody, 
    zCourseDeleteBody } from "../schemas/courseValidator.js";
import { type Course } from "../libs/types.js";

const router: Router = Router();

// READ all
router.get("/", (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Get all courses successfully",
            data: courses,
        });
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
            error: err,
        });
    }
});

// Params URL 
router.get("/:courseId/", (req: Request, res: Response) => {
  try {
    let courseId;
    courseId = req.params.courseId;

    // validate courseId
    const result_validate = zCourseId.safeParse(courseId);

    if (!result_validate.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: result_validate.error.issues[0]?.message,
      });
    }

    // find course by courseId
    const foundIndex = courses.findIndex(
      (course) => course.courseId === Number(courseId)
    );

    // if not found
    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course does not exists",
      });
    }

    // set header
    res.set("Link", `/courses/${courseId}`);

    return res.status(200).json({
      success: true,
      message: `Get course ${courseId} successfully`,
      data: courses[foundIndex],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

router.post("/", (req: Request, res: Response) => {
    try {
        const body = req.body as Course;

        // validate body
        const result = zCoursePostBody.safeParse(body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: result.error.issues[0]?.message,
            });
        }
        // check duplicate courseId
        const found = courses.find(
            (course) => course.courseId === body.courseId
        );

        // if duplicate
        if(found) {
            return res.status(409).json({
                success: false,
                error: "Course ID already exists",
            });
        }

        // add new course
        const new_course = body;
        courses.push(new_course);

        // set header
        res.set("Link", `/courses/${body.courseId}`);
        return res.status(201).json({
            success: true,
            message: `Course ${body.courseId} has been added successfully`,
            data: new_course,
        });
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
            error: err,
        });
    }
});

router.put("/", (req: Request, res: Response) => {
    try {
        const body = req.body as Course;
        // validate body
        const result = zCoursePutBody.safeParse(body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: result.error.issues[0]?.message,
            });
        }
        // check duplicate courseId
        const foundIndex = courses.findIndex(
            (course) => course.courseId === body.courseId
        );
        // if not found
        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Course does not exist",
            });
        }
        // update course
        courses[foundIndex] = {...courses[foundIndex], ...body};
        // set header
        res.set("Link", `/courses/${body.courseId}`);
        return res.status(200).json({
            success: true,
            message: `Course ${body.courseId} has been updated successfully`,
            data: courses[foundIndex],
        });
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
            error: err,
        });
    }
});

router.delete("/",(req: Request, res: Response) => {
    try {
        const body = req.body;
        // validate body
        const parseResult = zCourseDeleteBody.safeParse(body);
        // if not valid
        if(!parseResult.success){
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: parseResult.error.issues[0]?.message,
            });
        }
        // find course by courseId
        const foundIndex = courses.findIndex(
            (course) => course.courseId === body.courseId
        );
        // if not found
        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Course does not exist",
            });
        }
        // delete student
        res.json({
            success: true,
            message: `Course ${body.courseId} has been deleted successfully`,
            data: courses[foundIndex],
        });
        courses.splice(foundIndex, 1);
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
            error: err,
        });
    }
});

export default router;
